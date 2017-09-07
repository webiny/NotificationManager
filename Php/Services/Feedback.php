<?php
namespace Apps\NotificationManager\Php\Services;

use Apps\Webiny\Php\Lib\Api\ApiContainer;
use Apps\Webiny\Php\Lib\Interfaces\PublicApiInterface;
use Apps\Webiny\Php\Lib\Services\AbstractService;
use Apps\Webiny\Php\Lib\Exceptions\AppException;
use Apps\NotificationManager\Php\Entities\EmailLog;


class Feedback extends AbstractService implements PublicApiInterface
{
    protected function serviceApi(ApiContainer $api)
    {
        $api->get('email/mark-read/{emailLog}/1px', function (EmailLog $emailLog) {
            return $this->markRead($emailLog);
        });

        $api->post('email/bounce', function () {
            return $this->parse();
        });

        $api->post('email/complaint', function () {
            return $this->parse();
        });

        $api->post('email/delivery', function () {
            return $this->parse();
        });
    }


    public function markRead(EmailLog $emailLog)
    {
        // get current status to see if we need to update global stats for the notification entity
        if ($emailLog->status != $emailLog::STATUS_READ && !$this->wRequest()->query('preview', false)) {
            $emailLog->status = $emailLog::STATUS_READ;
            $emailLog->save();

            $emailLog->notification->incrementHandlerStat('email', 'read')->save();
        }

        // return 1px transparent gif
        header('Content-Type: image/gif');
        echo base64_decode('R0lGODlhAQABAJAAAP8AAAAAACH5BAUQAAAALAAAAAABAAEAAAICBAEAOw==');
        die();
    }

    public function parse()
    {
        $data = $this->wRequest()->getPayload();

        // check if it's a subscription confirmation
        if (!empty($data->get('Type')) && $data->get('Type') == 'SubscriptionConfirmation') {
            // confirm the subscription
            file_get_contents($data->get('SubscribeURL'));

            return true;
        }

        // extract message id
        if (empty($data->get('mail')['messageId'])) {
            throw new AppException('Payload is missing messageId');
        }
        $mgId = $data->get('mail')['messageId'];

        // get message for the matching message id
        /**
         * @var EmailLog $emailLog
         */
        $emailLog = EmailLog::findOne(['messageId' => $mgId]);
        if (empty($emailLog)) {
            throw new AppException(sprintf('Message under id "%s" not found in email log.', $mgId));
        }

        // save the log info
        $emailLog->log = print_r($data->getAll(), true);

        // check the notificationType
        $notificationType = strtolower($data->get('notificationType'));
        switch ($notificationType) {
            case 'bounce':
                if ($data->get('bounce')['bounceType'] == 'Permanent') {
                    $emailLog->status = $emailLog::STATUS_HARD_BOUNCE;
                } else {
                    $emailLog->status = $emailLog::STATUS_SOFT_BOUNCE;
                }

                $emailLog->notification->incrementHandlerStat('email', 'bounced');
                break;

            case 'complaint':
                $emailLog->status = $emailLog::STATUS_COMPLAINT;
                $emailLog->notification->incrementHandlerStat('email', 'complaint');
                break;

            case 'delivery':
                $emailLog->status = $emailLog::STATUS_DELIVERED;
                $emailLog->notification->incrementHandlerStat('email', 'delivered');
                break;
        }

        $emailLog->notification->save();

        return true;
    }

}