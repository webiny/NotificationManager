<?php
namespace Apps\NotificationManager\Php\Entities;

use Apps\Core\Php\DevTools\DevToolsTrait;
use Apps\Core\Php\DevTools\Entity\EntityAbstract;

/**
 * Class Template
 *
 * @property string $id
 * @property string $name
 * @property string $content
 *
 * @package Apps\Core\Php\Entities
 *
 */
class Template extends EntityAbstract
{
    use DevToolsTrait;

    protected static $entityCollection = 'Template';
    protected static $entityMask = '{name}';

    public function __construct()
    {
        parent::__construct();

        $this->attr('name')->char()->setValidators('required,unique')->setValidationMessages([
            'unique' => 'A notification with the same title already exists.'
        ])->setToArrayDefault();
        $this->attr('content')->char()->setToArrayDefault();
    }
}