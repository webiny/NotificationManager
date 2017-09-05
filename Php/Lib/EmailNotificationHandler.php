<?php
namespace Apps\NotificationManager\Php\Lib;

use Apps\Webiny\Php\Lib\Exceptions\AppException;
use Apps\Webiny\Php\RequestHandlers\ApiException;
use Apps\NotificationManager\Php\Entities\EmailLog;
use Apps\NotificationManager\Php\Entities\Settings;
use Apps\NotificationManager\Php\Entities\Template;
use Apps\NotificationManager\Php\Lib\Recipients\Email;
use Apps\NotificationManager\Php\Services\MailQueue;
use Webiny\Component\Mailer\Mailer;
use Webiny\Component\Storage\File\File;
use Webiny\Component\TemplateEngine\TemplateEngineException;

/**
 * Class AbstractNotificationHandler
 * @package Apps\NotificationManager\Php\Lib
 */
class EmailNotificationHandler extends AbstractNotificationHandler
{
    protected $emailContent = '';
    protected $emailSubject = '';
    /**
     * @var \Apps\Webiny\Php\Lib\TemplateEngine
     */
    protected $templateInstance;

    function __construct()
    {
        $this->templateInstance = $this->wTemplateEngine();
    }

    public function canSend()
    {
        $handler = $this->notification->handlers['email'] ?? null;

        if (!is_array($handler)) {
            return false;
        }

        return $handler['send'];
    }

    public function send()
    {
        // assign content and subject
        $email = $this->notification->handlers['email'];
        $this->emailSubject = $email['subject'];
        $this->emailContent = $email['content'] ?? '';

        // parse variables
        $variables = $this->parseVariables();

        // merge variables and content
        $this->emailContent = $this->templateInstance->fetch('eval:' . $this->emailContent, $variables);
        $this->emailSubject = $this->templateInstance->fetch('eval:' . $this->emailSubject, $variables);

        // append tracker
        $markReadUrl = '/services/notification-manager/feedback/email/mark-read/{emailLog}/1px';
        $trackerPath = $this->wConfig()->get('Application.ApiPath') . $markReadUrl;
        $tracker = '<img src="' . $trackerPath . '" style="height:1px !important; width:1px !important; border: 0 !important; margin: 0 !important; padding: 0 !important" width="1" height="1" border="0">';
        $this->emailContent .= $tracker;

        // combine the template and the content
        $replace = [
            '{_content_}'  => $this->emailContent,
            '{_subject_}'  => $this->emailSubject,
            '{_hostName_}' => $this->wConfig()->get('Application.WebPath')
        ];

        /* @var $template Template */
        $template = Template::findById($email['template']);
        $this->emailContent = str_replace(array_keys($replace), array_values($replace), $template->content);

        // save the mail into the mail queue
        $this->scheduleForSending();
    }

    /**
     * Set email recipients. Must be an array of Email instances. Other values will be ignored.
     *
     * @param array $recipients
     *
     * @return $this
     */
    public function setRecipients(array $recipients)
    {
        foreach ($recipients as $recipient) {
            if ($recipient instanceof Email) {
                $this->recipients[] = $recipient;
            }
        }

        return $this;
    }

    public function validate()
    {
        $handler = $this->notification->handlers['email'];
        // Validate all email keys (content, subject, ...)
        foreach ($handler as $key => $v) {
            if (is_string($v)) {
                $this->validateVariables($v);
            }
        }

        // validate content
        try {
            $this->templateInstance->fetch('eval:' . $handler['content']);
        } catch (TemplateEngineException $e) {
            throw new AppException('Invalid template syntax: ' . $e->getMessage());
        }
    }

    public function preview($data)
    {
        $preview = $data['email'] ?? null;
        $handler = $this->notification->handlers['email'];
        /* @var $template Template */
        $template = Template::findById($handler['template']);
        $content = str_replace('{_content_}', $handler['content'], $template->content);
        $content = str_replace('{_hostName_}', $this->wConfig()->get('Application.WebPath'), $content);

        // get mailer
        /* @var $mailer Mailer */
        $mailer = $this->wService('NotificationManager')->getMailer();

        // get settings
        $settings = Settings::load();
        if (!$settings) {
            throw new NotificationException('Settings sendLimit not defined.');
        }

        // get sender
        $senderEmail = !empty($handler['fromAddress']) ? $handler['fromAddress'] : $settings->email['senderEmail'];
        $senderName = !empty($handler['fromName']) ? $handler['fromName'] : $settings->email['senderName'];

        // populate
        $recipient = isset($preview['email']) && $preview['email'] != '' ? $preview['email'] : $this->wAuth()->getUser()->email;
        $msg = $mailer->getMessage();
        $msg->setFrom(new Email($senderEmail, $senderName));
        $msg->setSubject($handler['subject'])->setBody($content)->setTo(new Email($recipient));


        if ($mailer->send($msg)) {
            return [
                'handler' => 'email',
                'status'  => true,
                'message' => 'Email was sent successfully! Check your ' . $recipient . ' inbox.'
            ];
        }

        return [
            'handler' => 'email',
            'status'  => false,
            'message' => 'Failed to send preview email to ' . $recipient . '.'
        ];
    }

    private function scheduleForSending()
    {

        if (count($this->recipients) < 1) {
            throw new ApiException('An email notification has to have at least 1 recipient.');
        }

        /* @var $r Email */
        foreach ($this->recipients as $r) {
            // start email log
            $log = new EmailLog();
            $log->content = $this->emailContent;
            $log->email = $r->email;
            $log->name = $r->name;
            $log->notification = $this->notification;
            $log->subject = $this->emailSubject;
            $log->save();

            // copy attachments to temporary storage
            /* @var File $att */
            $storage = $this->wStorage('NotificationManager');
            foreach ($this->attachments as $index => $att) {
                $key = $log->id . '-' . $index . '.tmp';
                $storage->setContents($key, $att['file']->getContents());
                $log->attachments[] = [
                    'key'  => $key,
                    'type' => $att['type'],
                    'name' => $att['name']
                ];
            }

            // update the tracker with the email log id (we get the id after the previous save)
            $log->content = str_replace('{emailLog}', $log->id, $log->content);
            $log->save();

            // check if instant send it active
            if ($this->wConfig()->get('NotificationManager.InstantSend', false)) {
                $mailQueue = new MailQueue();
                $mailQueue->sendEmails();
            }
        }
    }

    public function validateVariables($content)
    {
        // extract variables from the provided content
        $variables = $this->str($content)->match('\{\$(.*?)\}');

        if (!$variables || $variables->count() < 1) {
            return true;
        }

        $missingVars = [];
        foreach ($variables[1] as $v) {
            // we need to explode the nested attributes
            $v = $this->str($v)->explode('.')->first();

            foreach ($this->notification->variables as $av) {
                if ($v == $av['key']) {
                    // We have found or match, continue to the outer loop
                    continue 2;
                }
            }
            $missingVars[] = $v;
        }

        if (count($missingVars) > 0) {
            $message = 'One or more variables present in the email content are not defined in the variables list. (';
            throw new AppException($message . join(', ', $missingVars) . ')');
        }

        return true;

    }
}