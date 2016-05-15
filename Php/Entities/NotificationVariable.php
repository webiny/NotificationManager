<?php
namespace Apps\NotificationManager\Php\Entities;

use Apps\Core\Php\DevTools\DevToolsTrait;
use Apps\Core\Php\DevTools\Entity\EntityAbstract;

/**
 * Class Jobs
 *
 * @property string $id
 * @property string $key
 * @property string $entity
 * @property string $attribute
 * @property string $description
 * @property string $notification
 *
 * @package Apps\Core\Php\Entities
 *
 */
class NotificationVariable extends EntityAbstract
{
    use DevToolsTrait;

    protected static $entityCollection = 'NotificationVariable';
    protected static $entityMask = '{key}';

    public function __construct()
    {
        parent::__construct();

        $this->attr('key')->char()->setValidators('required')->setToArrayDefault();

        $this->attr('entity')->char()->setValidators('required')->setToArrayDefault();
        $this->attr('attribute')->char()->setValidators('required')->setToArrayDefault();
        $this->attr('description')->char()->setToArrayDefault();

        $notification = '\Apps\NotificationManager\Php\Entities\Notification';
        $this->attr('notification')->many2one('Notification')->setEntity($notification)->setValidators('required');
    }

    public function save()
    {
        // $this
        // throw exception ValidationException
        return parent::save();
    }
}