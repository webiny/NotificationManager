<?php

namespace Apps\NotificationManager\Php\Lib;

use Apps\Webiny\Php\DevTools\WebinyTrait;
use Apps\Webiny\Php\DevTools\Entity\AbstractEntity;
use Webiny\Component\StdLib\StdLibTrait;
use Webiny\Component\Storage\File\File;
use Apps\NotificationManager\Php\Entities\Notification as NotificationEntity;
use Apps\NotificationManager\Php\Lib\Recipients\RecipientInterface;

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

    private $isSent = false;

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
     * @param RecipientInterface $recipient
     * @param boolean            $append Append to the list of existing recipients
     *
     * @return $this
     * @throws NotificationException
     */
    public function setRecipient(RecipientInterface $recipient, $append = false)
    {
        if (isset($this->recipients[$recipient->getId()])) {
            throw new NotificationException('Unable to set recipient as the give recipient is already in the list: ' . $recipient->getId());
        }

        if (!$append) {
            $this->recipients = [$recipient->getId() => $recipient];

            return $this;
        }

        $this->recipients[$recipient->getId()] = $recipient;

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
        if ($this->isSent) {
            throw new NotificationException('You cannot call "send" multiple times on the same notification. You need to create a new class instance.');
        }

        /**
         * @var NotificationEntity $notification
         */
        $notification = NotificationEntity::findOne(['slug' => $this->slug]);
        if (empty($notification)) {
            throw new NotificationException(sprintf('Unable to load notification "%s".', $this->slug));
        }

        $abstractHandler = '\Apps\NotificationManager\Php\Lib\AbstractNotificationHandler';
        $handlers = $this->wService()->getServicesByTag('notification-manager-handler', $abstractHandler);

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

        $this->isSent = true;

        return true;
    }
}