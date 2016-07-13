<?php

namespace Apps\NotificationManager\Php\Lib;

use Apps\Core\Php\DevTools\DevToolsTrait;
use Apps\Core\Php\DevTools\Entity\AbstractEntity;
use Apps\NotificationManager\Php\Entities\EmailLog;
use Apps\NotificationManager\Php\Entities\NotificationVariable;
use Webiny\Component\Mailer\MailerTrait;
use Webiny\Component\Validation\ValidationTrait;
use Webiny\Component\Validation\ValidationException;
use Apps\NotificationManager\Php\Entities\Notification as NotificationEntity;

class Notification
{
    use ValidationTrait, DevToolsTrait, MailerTrait;

    protected $slug;
    protected $recipientEmail;
    protected $recipientName;
    protected $entities = [];
    protected $customVars = [];
    protected $emailContent;

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
     * @param string $email
     * @param string $name
     *
     * @return $this
     */
    public function setRecipient($email, $name)
    {
        try {
            self::validation()->validate($email, 'email');
        } catch (ValidationException $e) {
            new NotificationException(sprintf('Recipient email "%s" is invalid.', $email));
        }

        $this->recipientEmail = $email;
        $this->recipientName = $name;

        return $this;
    }

    /**
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
     * Send the notification.
     * If successful true is returned, otherwise false.
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

        // append tracker
        $trackerPath = $this->wConfig()
                            ->get('Application.ApiPath') . '/services/notification-manager/feedback/email/mark-read/{emailLog}/1px';
        $tracker = '<img src="' . $trackerPath . '" style="border:none; width:1px; height:1px; position: absolute" />';
        $this->emailContent = $this->notification->email['content'] . $tracker;

        // combine the template and the content
        $this->emailContent = str_replace(['{_content_}', '{_hostName_}'],
            [$this->emailContent, $this->wConfig()->get('Application.WebPath')],
            $this->notification->template->content);

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
                    throw new NotificationException(sprintf('Entity "%s", that is required by "%s" variable, is missing.',
                        $v->entity, $v->key));
                } else {
                    // replace the value inside the content
                    $this->emailContent = str_replace('{' . $v->key . '}',
                        $this->entities[$v->entity]->getAttribute($v->attribute)->getValue(), $this->emailContent);
                }
            } else {
                if (!isset($this->customVars[$v->key])) {
                    throw new NotificationException(sprintf('Custom variable "%s" is missing.', $v->key));
                } else {
                    // replace the value inside the content
                    $this->emailContent = str_replace('{' . $v->key . '}', $this->customVars[$v->key],
                        $this->emailContent);
                }
            }
        }
    }

    public function scheduleForSending()
    {
        // start email log
        $log = new EmailLog();
        $log->content = $this->emailContent;
        $log->email = $this->recipientEmail;
        $log->name = $this->recipientName;
        $log->notification = $this->notification;
        $log->subject = $this->notification->email['subject'];
        $log->save();

        // update the tracker with the email log id
        $log->content = str_replace('{emailLog}', $log->id, $log->content);
        $log->save();
    }
}