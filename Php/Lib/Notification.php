<?php

namespace Apps\NotificationManager\Php\Lib;

use Apps\Webiny\Php\Lib\WebinyTrait;
use Apps\Webiny\Php\Lib\Entity\AbstractEntity;
use Webiny\Component\StdLib\StdLibTrait;
use Webiny\Component\Storage\File\File;
use Apps\NotificationManager\Php\Entities\Notification as NotificationEntity;

/**
 * Class Notification
 * @package Apps\NotificationManager\Php\Lib
 */
class Notification
{
    use WebinyTrait, StdLibTrait;

    protected $slug;
    protected $recipients = [];
    protected $entities = [];
    protected $customVars = [];
    protected $attachments = [];

    /**
     * @param string $slug Notification slug.
     */
    public function __construct($slug)
    {
        $this->slug = $slug;
    }

    /**
     * Set one or more recipients
     *
     * @param mixed   $recipient
     * @param boolean $append Append to the list of existing recipients
     *
     * @return $this
     */
    public function setRecipient($recipient, $append = true)
    {
        if (!$append) {
            $this->recipients = is_array($recipient) ? $recipient : [$recipient];

            return $this;
        }

        if (is_array($recipient)) {
            $this->recipients = array_merge($this->recipients, $recipient);
        } else {
            $this->recipients[] = $recipient;
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
     * @param mixed  $value
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
        $notification = NotificationEntity::findOne(['slug' => $this->slug]);
        if (empty($notification)) {
            throw new NotificationException(sprintf('Unable to load notification "%s".', $this->slug));
        }

        $handlers = $this->wService()->getServicesByTag('notification-manager-handler', AbstractNotificationHandler::class);

        /* @var $handler AbstractNotificationHandler */
        foreach ($handlers as $handler) {
            $handler->setNotification($notification);
            if ($handler->canSend()) {
                $handler->setRecipients($this->recipients);
                $handler->setAttachments($this->attachments);
                $handler->setEntityVariables($this->entities);
                $handler->setCustomVariables($this->customVars);
                $handler->send();
            }
        }

        return true;
    }
}