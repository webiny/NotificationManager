<?php

namespace Apps\NotificationManager\Php\Lib;

use Apps\Core\Php\DevTools\DevToolsTrait;
use Apps\Core\Php\Entities\Setting;
use Apps\NotificationManager\Php\Entities\EmailLog;
use Apps\NotificationManager\Php\Entities\NotificationVariable;
use Webiny\Component\Mailer\Email;
use Webiny\Component\Mailer\Mailer;
use Webiny\Component\Mailer\MailerTrait;
use Webiny\Component\Validation\ValidationTrait;
use Webiny\Component\Validation\ValidationException;
use Apps\NotificationManager\Php\Entities\Notification as NotificationEntity;

use Webiny\Component\Entity\EntityAbstract;

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
     * @param EntityAbstract $entity
     *
     * @return $this
     */
    public function addEntity(EntityAbstract $entity)
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

        // combine the template and the content
        $this->emailContent = str_replace(['{_content_}', '{_hostName_}'],
            [$this->notification->email['content'], $this->wConfig()->get('Application.WebPath')],
            $this->notification->template->content);

        // parse variables
        $this->parseVariables();

        $mailer = $this->getMailer();
        $msg = $mailer->getMessage();
        $msg->setSubject($this->notification->email['subject'])
            ->setBody($this->emailContent)
            ->setTo(new Email($this->recipientEmail, $this->recipientName));

        // start email log
        $log = new EmailLog();
        $log->content = $this->emailContent;
        $log->email = $this->recipientEmail;
        $log->notification = $this->notification->getId();
        $log->subject = $this->notification->email['subject'];

        // send the message and add the message to email log
        try {
            $result = $mailer->send($msg);
            if ($result) {
                $log->status = EmailLog::STATUS_SENT;
                $log->messageId = $msg->getHeader('Message-ID');
            } else {
                $log->status = EmailLog::STATUS_ERROR;
                $log->log = print_r($mailer->getTransport()->getDebugLog(), true);
            }

            $log->save();
        } catch (\Exception $e) {
            $log->status = EmailLog::STATUS_ERROR;
            $log->log = $e->getMessage();
            $log->save();

            return false;
        }

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

    /**
     * @return Mailer
     * @throws NotificationException
     * @throws \Webiny\Component\StdLib\Exception\Exception
     */
    private function getMailer()
    {
        // load the mailer settings
        $settings = Setting::findOne(['key' => 'notification-manager']);
        if (empty($settings)) {
            throw new NotificationException(sprintf('Unable to load SMTP settings'));
        }
        $settings = $settings['settings'];

        $config = [
            'Sender'    => [
                'Email' => $this->notification->email['fromAddress'],
                'Name'  => $this->notification->email['fromName']
            ],
            'Transport' => [
                'Type'       => 'smtp',
                'Host'       => $settings['serverName'],
                'Port'       => 587,
                'Username'   => $settings['username'],
                'Password'   => $settings['password'],
                'Encryption' => 'tls',
                'AuthMode'   => 'login'
            ],
            'Debug'     => true
        ];

        Mailer::setConfig(\Webiny\Component\Config\Config::getInstance()->parseResource(['Default' => $config]));

        return $this->mailer('Default');
    }
}