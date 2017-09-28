<?php

namespace Apps\NotificationManager\Php\Entities;

use Apps\Webiny\Php\Lib\Api\ApiContainer;
use Apps\Webiny\Php\Lib\Entity\AbstractEntity;
use Apps\NotificationManager\Php\Lib\AbstractNotificationHandler;
use Apps\Webiny\Php\Lib\Entity\Indexes\IndexContainer;
use Webiny\Component\Mongo\Index\CompoundIndex;
use Webiny\Component\StdLib\StdObject\ArrayObject\ArrayObject;

/**
 * Class Notification
 *
 * @property string      $id
 * @property string      $title
 * @property string      $description
 * @property string      $slug
 * @property array       $labels
 * @property ArrayObject $handlers
 * @property array       $variables
 */
class Notification extends AbstractEntity
{
    protected static $classId = 'NotificationManager.Entities.Notification';
    protected static $i18nNamespace = 'NotificationManager.Entities.Notification';
    protected static $collection = 'NotificationManagerNotifications';
    protected static $mask = '{title}';

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

        $this->attr('slug')->char()->setToArrayDefault()->setValidators('required,unique')->setValidationMessages([
            'unique' => 'A notification with the same slug already exists.'
        ])->onSet(function ($val) {
            return $this->str($val)->slug()->val();
        });

        $this->attr('labels')->arr()->setToArrayDefault();
        $this->attr('variables')->arr();
        $this->attr('handlers')->object()->setToArrayDefault();

        $this->onBeforeSave(function () {
            $handlers = $this->wService()->getServicesByTag('notification-manager-handler', AbstractNotificationHandler::class);

            /* @var $handler AbstractNotificationHandler */
            foreach ($handlers as $handler) {
                $handler->setNotification($this);
                if ($handler->canSend()) {
                    $handler->validate();
                }
            }
        });
    }

    protected function entityApi(ApiContainer $api)
    {
        parent::entityApi($api);

        /**
         * @api.name Preview notification
         */
        $api->post('{id}/preview', function () {
            $data = $this->wRequest()->getRequestData();

            $handlers = $this->wService()->getServicesByTag('notification-manager-handler', AbstractNotificationHandler::class);

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
        $api->post('{id}/copy', function () {
            $newNotification = new Notification();
            $newNotification->slug = $this->slug . '-copy';
            $newNotification->title = $this->title . ' Copy';
            $newNotification->description = $this->description;
            $newNotification->labels = $this->labels;
            $newNotification->variables = $this->variables;
            $newNotification->handlers = $this->handlers;
            $newNotification->save();

            return $this->apiFormatEntity($newNotification, $this->wRequest()->getFields());
        });
    }

    protected static function entityIndexes(IndexContainer $indexes)
    {
        parent::entityIndexes($indexes);
        $indexes->add(new CompoundIndex('title', ['title', 'deletedOn'], false, true));
        $indexes->add(new CompoundIndex('slug', ['slug', 'deletedOn'], false, true));
    }

    /**
     * Used for incrementing various stats for handlers (eg. email could have 'read' and 'bounced').
     *
     * @param string $handler
     * @param string $type
     *
     * @return $this
     */
    public function incrementHandlerStat($handler, $type)
    {
        $key = $handler . '.stats.' . $type;
        $currentCount = $this->handlers->keyNested($key) ?: 0;
        $this->handlers->keyNested($key, ++$currentCount);

        return $this;
    }
}