<?php
namespace Apps\NotificationManager\Php\Entities;

use Apps\Core\Php\DevTools\WebinyTrait;
use Apps\Core\Php\DevTools\Entity\AbstractEntity;
use Apps\Core\Php\DevTools\Exceptions\AppException;
use Apps\Core\Php\Entities\Setting;
use Apps\NotificationManager\Php\Lib\AbstractNotificationHandler;
use Apps\NotificationManager\Php\Lib\NotificationException;
use Webiny\Component\Mailer\Email;
use Webiny\Component\Mailer\Mailer;

/**
 * Class Notification
 *
 * @property string $id
 * @property string $title
 * @property string $description
 * @property string $slug
 * @property array  $labels
 * @property array  $handlers
 * @property array  $variables
 *
 * @package Apps\Core\Php\Entities
 *
 */
class Notification extends AbstractEntity
{
    use WebinyTrait;

    protected static $entityCollection = 'NotificationManagerNotifications';
    protected static $entityMask = '{title}';

    public function __construct()
    {
        parent::__construct();

        $this->attr('title')->char()->setValidators('required,unique')->setValidationMessages([
            'unique' => 'A notification with the same title already exists.'
        ])->setToArrayDefault()->onSet(function ($val) {
            if (!$this->exists() && !$this->slug) {
                $this->slug = $this->str($val)->slug()->val();
            }

            return $val;
        })->setAfterPopulate();

        $this->attr('description')->char()->setToArrayDefault();

        $this->attr('slug')->char()->setToArrayDefault()->setOnce()->setValidators('required,unique')->setValidationMessages([
            'unique' => 'A notification with the same slug already exists.'
        ])->onSet(function ($val) {
            return $this->str($val)->slug()->val();
        });

        $this->attr('labels')->arr()->setToArrayDefault();
        $this->attr('variables')->arr();
        $this->attr('handlers')->object()->setToArrayDefault();

        /**
         * @api.name Preview notification
         */
        $this->api('post', '{id}/preview', function () {
            $data = $this->wRequest()->getRequestData();

            $abstractHandler = '\Apps\NotificationManager\Php\Lib\AbstractNotificationHandler';
            $handlers = $this->wService()->getServicesByTag('notification-manager-handler', $abstractHandler);

            $results = [];
            /* @var $handler AbstractNotificationHandler */
            foreach ($handlers as $handler) {
                $handler->setNotification($this);
                if ($handler->canSend()) {
                    $results[] = $handler->preview($data);
                }
            }

            return $results;
        });

        /**
         * @api.name Copy notification
         * @api.body.title string New notification title
         */
        $this->api('post', '{id}/copy', function () {
            $newNotification = new Notification();
            $newNotification->title = uniqid($this->title . '-');
            $newNotification->description = $this->description;
            $newNotification->labels = $this->labels;
            $newNotification->variables = $this->variables;
            $newNotification->handlers = $this->handlers;
            $newNotification->save();

            return $newNotification->toArray($this->wRequest()->getFields());

        });

        $this->onBeforeSave(function () {
            $abstractHandler = '\Apps\NotificationManager\Php\Lib\AbstractNotificationHandler';
            $handlers = $this->wService()->getServicesByTag('notification-manager-handler', $abstractHandler);

            /* @var $handler AbstractNotificationHandler */
            foreach ($handlers as $handler) {
                $handler->setNotification($this);
                if ($handler->canSend()) {
                    $handler->validate();
                }
            }
        });
    }
}