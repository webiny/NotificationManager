<?php

namespace Apps\NotificationManager\Php\Lib;

use Apps\Core\Php\DevTools\WebinyTrait;
use Apps\Core\Php\DevTools\Entity\AbstractEntity;
use Apps\NotificationManager\Php\Entities\EmailLog;
use Apps\NotificationManager\Php\Entities\NotificationVariable;
use Webiny\Component\Mailer\Email;
use Webiny\Component\Mailer\MailerTrait;
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
    use ValidationTrait, WebinyTrait, MailerTrait;

    protected $slug;
    protected $recipients = [];
    protected $entities = [];
    protected $customVars = [];
    protected $attachments = [];
    protected $emailContent;
    protected $emailSubject;

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
                    self::validation()->validate($e[0], 'email');
                    $this->recipients[] = new Email($email, (isset($e[1]) ? $e[1] : null));
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
            new NotificationException(sprintf('Unable to load notification "%s".', $this->slug));
        }
        $this->emailSubject = $this->notification->email['subject'];

        // append tracker
        $markReadUrl = '/services/notification-manager/feedback/email/mark-read/{emailLog}/1px';
        $trackerPath = $this->wConfig()->get('Application.ApiPath') . $markReadUrl;
        $tracker = '<img src="' . $trackerPath . '" style="border:none; width:1px; height:1px; position: absolute" />';
        $this->emailContent = $this->notification->email['content'] . $tracker;

        // combine the template and the content
        $replace = [
            '{_content_}'  => $this->emailContent,
            '{_hostName_}' => $this->wConfig()->get('Application.WebPath')
        ];
        $this->emailContent = str_replace(array_keys($replace), array_values($replace), $this->notification->template->content);

        // parse variables
        $this->parseVariables();

        // save the mail into the mail queue
        $this->scheduleForSending();

        return true;
    }

    /**
     * @throws NotificationException
     */
    private function parseVariables()
    {
        // load all variables required for this notification
        $vars = NotificationVariable::find(['notification' => $this->notification->id]);
        if ($vars->totalCount() < 1) {
            return;
        }

        // loop over variables and make sure all the variables are provided
        foreach ($vars as $v) {
            if ($v->type == 'entity') {
                if (!isset($this->entities[$v->entity])) {
                    throw new NotificationException(sprintf('Entity "%s", that is required by "%s" variable, is missing.', $v->entity,
                        $v->key));
                } else {
                    // replace the value inside the content
                    $this->emailContent = str_replace('{' . $v->key . '}', $this->entities[$v->entity][$v->attribute], $this->emailContent);

                    // replace the value inside the subject line
                    $this->emailSubject = str_replace('{' . $v->key . '}', $this->entities[$v->entity][$v->attribute], $this->emailSubject);
                }
            } else {
                if (!isset($this->customVars[$v->key])) {
                    throw new NotificationException(sprintf('Custom variable "%s" is missing.', $v->key));
                } else {
                    // replace the value inside the content
                    $this->emailContent = str_replace('{' . $v->key . '}', $this->customVars[$v->key], $this->emailContent);

                    // replace the value inside the subject line
                    $this->emailSubject = str_replace('{' . $v->key . '}', $this->customVars[$v->key], $this->emailSubject);
                }
            }
        }
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