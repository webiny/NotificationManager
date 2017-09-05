<?php
namespace Apps\NotificationManager\Php\Entities;

use Apps\Webiny\Php\Lib\Exceptions\AppException;
use Apps\Webiny\Php\Lib\WebinyTrait;
use Apps\Webiny\Php\Lib\Entity\AbstractEntity;

/**
 * Class Template
 *
 * @property string $id
 * @property string $name
 * @property string $content
 * @property int    $notificationsCount
 *
 * @package Apps\Webiny\Php\Entities
 *
 */
class Template extends AbstractEntity
{
    use WebinyTrait;

    protected static $entityCollection = 'NotificationManagerTemplate';
    protected static $entityMask = '{name}';

    public function __construct()
    {
        parent::__construct();

        $this->attr('name')->char()->setValidators('required,unique')->setValidationMessages([
            'unique' => 'A notification with the same title already exists.'
        ])->setToArrayDefault();
        $this->attr('content')->char()->setToArrayDefault();

        /**
         * Returns total notifications that are using this template
         */
        $this->attr('notificationsCount')->dynamic(function () {
            return Notification::count(['template' => $this->id]);
        });
    }

    /**
     * We don't allow deletion of this template if it's in use by notifications
     * @throws AppException
     */
    public function canDelete()
    {
        if ($this->notificationsCount > 0) {
            throw new AppException('Template is in use and can not be deleted!');
        }
    }
}