<?php
namespace Apps\NotificationManager\Php\Lib;

use Apps\Webiny\Php\DevTools\WebinyTrait;
use Apps\NotificationManager\Php\Entities\Notification as NotificationEntity;
use Webiny\Component\StdLib\StdLibTrait;

/**
 * Class AbstractNotificationHandler
 * @package Apps\NotificationManager\Php\Lib
 */
abstract class AbstractNotificationHandler
{
    use WebinyTrait, StdLibTrait;

    /**
     * @var NotificationEntity
     */
    protected $notification;
    protected $variables = [];
    protected $recipients = [];
    protected $attachments = [];
    protected $entityVariables = [];
    protected $customVariables = [];

    abstract public function canSend();

    abstract public function send();

    abstract public function setRecipients(array $recipients);

    abstract public function validate();

    abstract public function preview($data);

    public function setNotification(NotificationEntity $notification)
    {
        $this->notification = $notification;
    }

    /**
     * @param array $variables
     *
     * @return $this
     */
    public function setVariables(array $variables = [])
    {
        $this->variables = $variables;

        return $this;
    }

    /**
     * @param array $attachments
     *
     * @return $this
     */
    public function setAttachments(array $attachments = [])
    {
        $this->attachments = $attachments;

        return $this;
    }

    /**
     * @param $entityVariables
     *
     * @return $this
     */
    public function setEntityVariables($entityVariables)
    {
        $this->entityVariables = $entityVariables;

        return $this;
    }

    /**
     * @param $customVariables
     *
     * @return $this
     */
    public function setCustomVariables($customVariables)
    {
        $this->customVariables = $customVariables;

        return $this;
    }

    protected function parseVariables()
    {
        $values = [];
        foreach ($this->notification->variables as $v) {
            if (!empty($v['entity']) && !isset($this->entityVariables[$v['entity']])) {
                $error = 'Entity "%s", that is required by "%s" variable, is missing.';
                throw new NotificationException(sprintf($error, $v['entity'], $v['key']));
            }

            $values[$v['key']] = !empty($v['entity']) ? $this->entityVariables[$v['entity']] : $this->customVariables[$v['key']];
        }

        return $values;
    }
}