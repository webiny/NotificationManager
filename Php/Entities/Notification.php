<?php
namespace Apps\NotificationManager\Php\Entities;

use Apps\Core\Php\DevTools\DevToolsTrait;
use Apps\Core\Php\DevTools\Entity\EntityAbstract;

/**
 * Class Jobs
 *
 * @property string $id
 * @property string $title
 * @property string $description
 * @property string $slug
 * @property array  $labels
 * @property object $email
 *
 * @package Apps\Core\Php\Entities
 *
 */
class Notification extends EntityAbstract
{
    use DevToolsTrait;

    protected static $entityCollection = 'Notification';
    protected static $entityMask = '{title}';

    public function __construct()
    {
        parent::__construct();

        $this->attr('title')->char()->setValidators('required,unique')->setValidationMessages([
            'unique' => 'A notification with the same title already exists.'
        ])->setToArrayDefault()->onSet(function ($val) {
            $this->slug = $this->str($val)->slug()->val();

            return $val;
        })->setAfterPopulate(true);

        $this->attr('description')->char()->setToArrayDefault();
        $this->attr('slug')->char()->setToArrayDefault();
        $this->attr('labels')->arr()->setToArrayDefault();
        $this->attr('email')->object()->setToArrayDefault();
    }
}