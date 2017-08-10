<?php
namespace Apps\NotificationManager\Php\Entities;

use Apps\Webiny\Php\DevTools\WebinyTrait;
use Apps\Webiny\Php\DevTools\Entity\AbstractEntity;
use Webiny\Component\Mongo\Index\SingleIndex;

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
 * @package Apps\Webiny\Php\Entities
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

        $this->index(new SingleIndex('createdOn', 'createdOn', false, false, false, 5184000)); // expire after 60 days

        $this->attr('messageId')->char()->setToArrayDefault();
        $this->attr('subject')->char()->setToArrayDefault();
        $this->attr('content')->char();
        $this->attr('attachments')->arr();
        $this->attr('email')->char()->setToArrayDefault();
        $this->attr('name')->char()->setToArrayDefault();
        $this->attr('log')->char();
        $this->attr('status')->char()->setDefaultValue(self::STATUS_PENDING)->setToArrayDefault();

        $notification = 'Apps\NotificationManager\Php\Entities\Notification';
        $this->attr('notification')->many2one('Notification')->setEntity($notification);
    }
}