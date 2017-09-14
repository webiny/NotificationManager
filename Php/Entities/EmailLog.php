<?php

namespace Apps\NotificationManager\Php\Entities;

use Apps\Webiny\Php\Lib\Entity\Indexes\IndexContainer;
use Apps\Webiny\Php\Lib\Entity\AbstractEntity;
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
 */
class EmailLog extends AbstractEntity
{
    const STATUS_PENDING = 'pending';
    const STATUS_ERROR = 'error';
    const STATUS_SENT = 'sent';
    const STATUS_DELIVERED = 'delivered';
    const STATUS_HARD_BOUNCE = 'hard-bounce';
    const STATUS_SOFT_BOUNCE = 'soft-bounce';
    const STATUS_COMPLAINT = 'complaint';
    const STATUS_READ = 'read';

    protected static $classId = 'NotificationManager.Entities.EmailLog';
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
        $this->attr('status')->char()->setDefaultValue(self::STATUS_PENDING)->setToArrayDefault();
        $this->attr('notification')->many2one()->setEntity(Notification::class);
    }

    protected static function entityIndexes(IndexContainer $indexes)
    {
        parent::entityIndexes($indexes);
        $indexes->add(new SingleIndex('createdOn', 'createdOn', false, false, false, 5184000)); // expire after 60 days
    }
}