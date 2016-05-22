<?php
namespace Apps\NotificationManager\Php\Entities;

use Apps\Core\Php\DevTools\DevToolsTrait;
use Apps\Core\Php\DevTools\Entity\EntityAbstract;

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
class Settings extends EntityAbstract
{
    use DevToolsTrait;

    protected static $entityCollection = 'NotificationManagerSettings';
    protected static $entityMask = '{id}';

    public function __construct()
    {
        parent::__construct();

        $this->attr('content')->char()->setToArrayDefault();
    }
}