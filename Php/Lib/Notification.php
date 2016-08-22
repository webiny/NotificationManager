<?php

namespace Apps\NotificationManager\Php\Lib;

use Apps\Core\Php\DevTools\TemplateEngine;
use Apps\Core\Php\DevTools\WebinyTrait;
use Apps\Core\Php\DevTools\Entity\AbstractEntity;
use Apps\NotificationManager\Php\Entities\EmailLog;
use Apps\NotificationManager\Php\Entities\NotificationVariable;
use Webiny\Component\Mailer\Email;
use Webiny\Component\Mailer\MailerTrait;
use Webiny\Component\StdLib\StdLibTrait;
use Webiny\Component\Storage\File\File;
use Webiny\Component\Validation\ValidationTrait;
use Webiny\Component\Validation\ValidationException;
use Apps\NotificationManager\Php\Entities\Notification as NotificationEntity;

/**
 * Class Notification
 * @package Apps\NotificationManager\Php\Lib
 */
class Notification
{
    use ValidationTrait, WebinyTrait, MailerTrait, StdLibTrait;

    protected $slug;
    protected $recipients = [];
    protected $entities = [];
    protected $customVars = [];
    protected $attachments = [];
    protected $emailContent;
    protected $emailSubject;

    /**
     * @var TemplateEngine
     */
    protected $templateInstance;

    /**
     * @var NotificationEntity
     */
    protected $notification;

    /**
     * @param string $slug Notification slug.
     */
    public function __construct($slug)
    {
        $this->slug = $slug;
        $this->templateInstance = $this->wTemplateEngine();
    }

    /**
     * Set recipient
     *
     * @param string|array $email An email, or list of emails in form [[email, name], [email, name]]
     * @param string       $name
     *
     * @return $this
     */
    public function setRecipient($email, $name = null)
    {
        if (is_array($email)) {
            foreach ($email as $e) {
                try {
                    self::validation()->validate($e[0] ?? null, 'email');
                    $this->recipients[] = new Email($e[0], $e[1] ?? null);
                } catch (ValidationException $e) {
                    new NotificationException(sprintf('Recipient email "%s" is invalid.', $e[0]));
                }
            }
        } else {
            try {
                self::validation()->validate($email, 'email');
                $this->recipients[] = new Email($email, $name);
            } catch (ValidationException $e) {
                new NotificationException(sprintf('Recipient email "%s" is invalid.', $email));
            }
        }

        return $this;
    }

    /**
     * Add entity
     *
     * @param AbstractEntity $entity
     *
     * @return $this
     */
    public function addEntity(AbstractEntity $entity)
    {
        $this->entities[get_class($entity)] = $entity;

        return $this;
    }

    /**
     * Add custom variable
     *
     * @param string $name
     * @param string $value
     *
     * @return $this
     */
    public function addCustomVariable($name, $value)
    {
        $this->customVars[$name] = $value;

        return $this;
    }

    /**
     * Add attachment
     *
     * @param File   $file
     * @param string $fileName
     * @param string $type
     *
     * @return $this
     */
    public function addAttachment(File $file, $fileName = '', $type = 'plain/text')
    {
        $this->attachments[] = ['file' => $file, 'name' => $fileName, 'type' => $type];

        return $this;
    }

    /**
     * Send the notification.
     * Returns true on success or false on failure.
     *
     * @return bool
     * @throws NotificationException
     */
    public function send()
    {
        /**
         * @var NotificationEntity $notification
         */
        // load notification
        $this->notification = NotificationEntity::findOne(['slug' => $this->slug]);
        if (empty($this->notification)) {
            throw new NotificationException(sprintf('Unable to load notification "%s".', $this->slug));
        }

        // assign content and subject
        $this->emailSubject = $this->notification->email['subject'];
        $this->emailContent = $this->notification->email['content'];

        // parse variables
        $this->parseVariables();

        // merge variables and content
        $this->emailContent = $this->templateInstance->fetch('eval:' . $this->emailContent);
        $this->emailSubject = $this->templateInstance->fetch('eval:' . $this->emailSubject);

        // append tracker
        $markReadUrl = '/services/notification-manager/feedback/email/mark-read/{emailLog}/1px';
        $trackerPath = $this->wConfig()->get('Application.ApiPath') . $markReadUrl;
        $tracker = '<img src="' . $trackerPath . '" style="border:none; width:1px; height:1px; position: absolute" />';
        $this->emailContent .= $tracker;

        // combine the template and the content
        $replace = [
            '{_content_}'  => $this->emailContent,
            '{_hostName_}' => $this->wConfig()->get('Application.WebPath')
        ];
        $this->emailContent = str_replace(array_keys($replace), array_values($replace), $this->notification->template->content);

        // save the mail into the mail queue
        $this->scheduleForSending();

        return true;
    }

    /**
     * @throws NotificationException
     */
    private function parseVariables()
    {
        $this->emailContent = $this->parseEntityVariables($this->emailContent);
        $this->emailContent = $this->parseCustomVariables($this->emailContent);

        $this->emailSubject = $this->parseEntityVariables($this->emailSubject);
        $this->emailSubject = $this->parseCustomVariables($this->emailSubject);
    }

    private function parseEntityVariables($content)
    {
        $vars = NotificationVariable::find(['notification' => $this->notification->id, 'type' => 'entity']);
        if ($vars->totalCount() < 1) {
            return $content;
        }

        foreach ($vars as $v) {
            if (!isset($this->entities[$v->entity])) {
                throw new NotificationException(sprintf('Entity "%s", that is required by "%s" variable, is missing.', $v->entity,
                    $v->key));
            }

            $this->templateInstance->getTemplateEngine()->assign($v->key, $this->entities[$v->entity]);
        }

        return $content;
    }

    private function parseCustomVariables($content)
    {
        $vars = NotificationVariable::find(['notification' => $this->notification->id, 'type' => 'custom']);
        if ($vars->totalCount() < 1) {
            return $content;
        }

        foreach ($vars as $v) {
            if (!isset($this->customVars[$v->key])) {
                throw new NotificationException(sprintf('Custom variable "%s" is missing.', $v->key));
            }

            $this->templateInstance->getTemplateEngine()->assign($v->key, $this->customVars[$v->key]);
        }

        return $content;

    }

    private function scheduleForSending()
    {
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
        }
    }
}