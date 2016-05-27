<?php
namespace Apps\NotificationManager\Php\Services;

use Apps\Core\Php\DevTools\DevToolsTrait;
use Apps\Core\Php\DevTools\Services\AbstractService;
use Apps\Core\Php\Entities\Setting;
use Apps\NotificationManager\Php\Entities\EmailLog;
use Apps\NotificationManager\Php\Entities\Notification;
use Apps\NotificationManager\Php\Lib\NotificationException;
use Webiny\Component\Config\Config;
use Webiny\Component\Mailer\Email;
use Webiny\Component\Mailer\Mailer;

class MailQueue extends AbstractService
{
    use DevToolsTrait;

    function __construct()
    {
        $this->api('get', 'send', function () {
            // calculate the max amount of emails we can send in one minute (that's the cron frequency)
            $settings = Setting::findOne(['key' => 'notification-manager']);
            if (!$settings) {
                throw new NotificationException('Settings sendLimit not defined.');
            }

            $minuteLimit = $settings['settings']['sendLimit'] * 60;
            $sleepTime = (1 / $settings['settings']['sendLimit']) * 1000000; // in microseconds

            // get the max number of email we can send within 1 min limit
            $emails = EmailLog::find(['status' => EmailLog::STATUS_PENDING], ['+createdOn'], $minuteLimit);
            if ($emails->count() < 1) {
                return false;
            }

            /**
             * @var EmailLog $e
             */
            $emailLog = ['sent' => 0, 'errors' => 0];
            foreach ($emails as $e) {
                $notification = Notification::findById($e->notification);

                $mailer = $this->getMailer($notification->email['fromAddress'], $notification->email['fromName']);
                $msg = $mailer->getMessage();
                $msg->setSubject($e->subject)->setBody($e->content)->setTo(new Email($e->email, $e->name));

                try {
                    $result = $mailer->send($msg);
                    if ($result) {
                        $e->status = EmailLog::STATUS_SENT;
                        $e->messageId = $msg->getHeader('Message-ID');
                        $emailLog['sent']++;
                    } else {
                        $e->status = EmailLog::STATUS_ERROR;
                        $e->log = print_r($mailer->getTransport()->getDebugLog(), true);
                        $emailLog['errors']++;
                    }

                    $e->save();
                } catch (\Exception $ex) {
                    $e->status = EmailLog::STATUS_ERROR;
                    $e->log = $ex->getMessage();
                    $e->save();
                    $emailLog['errors']++;
                }

                // sleep
                usleep($sleepTime);
            }

            return $emailLog;

        });
    }

    /**
     * @return Mailer
     * @throws NotificationException
     * @throws \Webiny\Component\StdLib\Exception\Exception
     */
    private function getMailer($email, $name)
    {
        // load the mailer settings
        $settings = Setting::findOne(['key' => 'notification-manager']);
        if (empty($settings)) {
            throw new NotificationException(sprintf('Unable to load SMTP settings'));
        }
        $settings = $settings['settings'];

        $config = [
            'Sender'    => [
                'Email' => $email,
                'Name'  => $name
            ],
            'Transport' => [
                'Type'       => 'smtp',
                'Host'       => $settings['serverName'],
                'Port'       => 587,
                'Username'   => $settings['username'],
                'Password'   => $settings['password'],
                'Encryption' => 'tls',
                'AuthMode'   => 'login'
            ],
            'Debug'     => true
        ];

        Mailer::setConfig(Config::getInstance()->parseResource(['Default' => $config]));

        return $this->mailer('Default');
    }

}