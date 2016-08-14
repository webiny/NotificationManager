<?php
namespace Apps\NotificationManager\Php\Entities;

use Apps\Core\Php\DevTools\WebinyTrait;
use Apps\Core\Php\DevTools\Entity\AbstractEntity;

/**
 * Class EmailLog
 *
 * @property string       $id
 * @property string       $messageId
 * @property integer      $status
 * @property string       $subject
 * @property string       $content
 * @property array        $attachments
 * @property string       $email
 * @property string       $name
 * @property string       $log
 * @property Notification $notification
 *
 * @package Apps\Core\Php\Entities
 *
 */
class EmailLog extends AbstractEntity
{
    use WebinyTrait;

    const STATUS_PENDING = 0;
    const STATUS_ERROR = 1;
    const STATUS_SENT = 2;
    const STATUS_DELIVERED = 3;
    const STATUS_HARD_BOUNCE = 4;
    const STATUS_SOFT_BOUNCE = 5;
    const STATUS_COMPLAINT = 6;
    const STATUS_READ = 7;

    protected static $entityCollection = 'NotificationManagerEmailLog';
    protected static $entityMask = '{messageId}';

    public function __construct()
    {
        parent::__construct();

        $this->attr('messageId')->char()->setToArrayDefault();
        $this->attr('subject')->char()->setToArrayDefault();
        $this->attr('content')->char();
        $this->attr('attachments')->arr();
        $this->attr('email')->char()->setToArrayDefault();
        $this->attr('name')->char()->setToArrayDefault();
        $this->attr('log')->char();

        /*
         * 1 - error sending
         * 2 - sent, waiting for response
         * 3 - successfully delivered
         * 4 - bounce
         * 5 - complaint
         * 6 - read
         */
        $this->attr('status')->integer()->setToArrayDefault();

        $notification = 'Apps\NotificationManager\Php\Entities\Notification';
        $this->attr('notification')->many2one('Notification')->setEntity($notification);
    }
}