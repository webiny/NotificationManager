<?php
namespace Apps\NotificationManager\Php\Services;

use Apps\Core\Php\DevTools\DevToolsTrait;
use Apps\Core\Php\DevTools\Exceptions\AppException;
use Apps\Core\Php\DevTools\Services\AbstractService;
use Apps\NotificationManager\Php\Entities\EmailLog;
use Apps\NotificationManager\Php\Lib\Notification;


class Feedback extends AbstractService
{
    use DevToolsTrait;

    function __construct()
    {
        $this->api('get', 'email/mark-read/{emailLog}/1px', function (EmailLog $emailLog) {
            return $this->markRead($emailLog);
        });

        $this->api('post', 'email/bounce', function () {
            return $this->parse();
        });

        $this->api('post', 'email/complaint', function () {
            return $this->parse();
        });

        $this->api('post', 'email/delivery', function () {
            return $this->parse();
        });

        $this->api('get', 'test', function ($test) {

            //$notification = new Notification('test-11');
            //$notification->setRecipient('slasherz999@gmail.com', 'Sven Al Hamad');

        });
    }

    public function markRead(EmailLog $emailLog)
    {
        // get current status to see if we need to update global stats for the notification entity
        if ($emailLog->status != $emailLog::STATUS_READ) {
            $emailLog->notification->email['read'] = empty($emailLog->notification->email['read']) ? 1 : $emailLog->notification->email['read'] + 1;
        }

        $emailLog->status = $emailLog::STATUS_READ;
        $emailLog->save();

        // return 1px transparent gif
        header('Content-Type: image/gif');
        echo base64_decode('R0lGODlhAQABAJAAAP8AAAAAACH5BAUQAAAALAAAAAABAAEAAAICBAEAOw==');
        die();
    }

    public function parse()
    {
        $data = $this->wRequest()->getPayload();

        // check if it's a subscription confirmation
        if (!empty($data->Type) && $data->Type == 'SubscriptionConfirmation') {
            // confirm the subscription
            file_get_contents($data->SubscribeURL);
            return;
        }

        // extract message id
        if (empty($data->mail->messageId)) {
            throw new AppException('Payload is missing messageId');
        }

        // get message for the matching message id
        /**
         * @var EmailLog $emailLog
         */
        $emailLog = EmailLog::findOne(['messageId' => $data->mail->messageId]);
        if (empty($emailLog)) {
            throw new AppException(sprintf('Message under id "%s" not found in email log.', $data->mail->messageId));
        }

        // save the log info
        $emailLog->log = print_r($data->val(), true);

        // check the notificationType
        $notificationType = strtolower($data->notificationType);
        switch ($notificationType) {
            case 'bounce':
                if ($data->bounce->bounceType == 'Permanent') {
                    $emailLog->status = $emailLog::STATUS_HARD_BOUNCE;
                } else {
                    $emailLog->status = $emailLog::STATUS_SOFT_BOUNCE;
                }
                $emailLog->notification->email['bounced'] = empty($emailLog->notification->email['bounced']) ? 1 : $emailLog->notification->email['bounced'] + 1;
                break;

            case 'complaint':
                $emailLog->status = $emailLog::STATUS_COMPLAINT;
                $emailLog->notification->email['complaint'] = empty($emailLog->notification->email['complaint']) ? 1 : $emailLog->notification->email['complaint'] + 1;
                break;

            case 'delivery':
                $emailLog->status = $emailLog::STATUS_DELIVERED;
                $emailLog->notification->email['delivered'] = empty($emailLog->notification->email['delivered']) ? 1 : $emailLog->notification->email['delivered'] + 1;
                break;
        }

        $emailLog->save();
    }
}