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

    const STATUS_PENDING = 'pending';
    const STATUS_ERROR = 'error';
    const STATUS_SENT = 'sent';
    const STATUS_DELIVERED = 'delivered';
    const STATUS_HARD_BOUNCE = 'hard-bounce';
    const STATUS_SOFT_BOUNCE = 'soft-bounce';
    const STATUS_COMPLAINT = 'complaint';
    const STATUS_READ = 'read';

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