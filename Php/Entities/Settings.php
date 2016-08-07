<?php
namespace Apps\NotificationManager\Php\Entities;

use Apps\Core\Php\DevTools\WebinyTrait;
use Apps\Core\Php\DevTools\Entity\AbstractEntity;

/**
 * Class Settings
 *
 * @property string $id
 * @property string $serverName
 * @property string $username
 * @property string $password
 *
 * @package Apps\Core\Php\Entities
 *
 */
class Settings extends AbstractEntity
{
    use WebinyTrait;

    protected static $entityCollection = 'NotificationManagerSettings';
    protected static $entityMask = '{id}';

    public function __construct()
    {
        parent::__construct();

        $this->attr('content')->char()->setToArrayDefault();
    }
}