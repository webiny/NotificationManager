<?php
namespace Apps\NotificationManager\Php\Entities;

use Apps\Core\Php\DevTools\DevToolsTrait;
use Apps\Core\Php\DevTools\Entity\EntityAbstract;
use Webiny\Component\Entity\EntityException;

/**
 * Class NotificationVariable
 *
 * @property string $id
 * @property string $key
 * @property string $entity
 * @property string $attribute
 * @property string $description
 * @property string $notification
 * @property string $type
 *
 * @package Apps\Core\Php\Entities
 *
 */
class NotificationVariable extends EntityAbstract
{
    use DevToolsTrait;

    protected static $entityCollection = 'NotificationManagerVariable';
    protected static $entityMask = '{key}';

    public function __construct()
    {
        parent::__construct();

        $this->attr('key')->char()->setValidators('required')->setToArrayDefault();

        $this->attr('entity')->char()->setToArrayDefault();
        $this->attr('attribute')->char()->setToArrayDefault();
        $this->attr('description')->char()->setToArrayDefault();
        $this->attr('type')->char()->setToArrayDefault();

        $notification = '\Apps\NotificationManager\Php\Entities\Notification';
        $this->attr('notification')->many2one('Notification')->setEntity($notification)->setValidators('required');
    }

    public function save()
    {
        // check that the give variable key doesn't already exist for the current notification
        $result = $this->find(['key'          => $this->key,
                               'notification' => $this->notification->id,
                               'id'           => ['$ne' => $this->id]
        ]);
        if ($result->totalCount() > 0) {
            $ex = new EntityException(EntityException::VALIDATION_FAILED, [1]);
            $ex->setInvalidAttributes(['key' => sprintf('Given key "%s" already exists.', $this->key)]);
            throw $ex;
        }

        return parent::save();
    }
}