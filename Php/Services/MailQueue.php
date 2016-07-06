<?php
namespace Apps\NotificationManager\Php\Services;

set_time_limit(0);

use Apps\Core\Php\DevTools\DevToolsTrait;
use Apps\Core\Php\DevTools\Services\AbstractService;
use Apps\Core\Php\Entities\Setting;
use Apps\NotificationManager\Php\Entities\EmailLog;
use Apps\NotificationManager\Php\Lib\NotificationException;
use Webiny\Component\Config\Config;
use Webiny\Component\Mailer\Email;
use Webiny\Component\Mailer\Mailer;
use Webiny\Component\Mailer\MailerTrait;

class MailQueue extends AbstractService
{
    use DevToolsTrait, MailerTrait;

    function __construct()
    {
        $this->api('get', 'send', function () {
            return $this->sendEmails();
        });
    }

    private function sendEmails()
    {
        // calculate the max amount of emails we can send in one minute (that's the cron frequency)
        $settings = Setting::findOne(['key' => 'notification-manager']);
        if (!$settings) {
            throw new NotificationException('Settings sendLimit not defined.');
        }

        $minuteLimit = $settings['settings']['sendLimit'] * 60;
        $sleepTime = (1 / $settings['settings']['sendLimit']) * 1000000; // in microseconds

        // get the max number of email we can send within 1 min limit
        // we want to keep the process active for the full minute, so we don't wait 60s to get the email
        $numIterations = 3;
        do {
            $emails = EmailLog::find(['status' => EmailLog::STATUS_PENDING], ['+createdOn'], $minuteLimit);
            $count = $emails->count();
            if ($count < 1) {
                // sleep for 5 seconds
                sleep(5);
                $numIterations--;
                if ($numIterations <= 0) {
                    return 'Email queue was empty, no emails were sent.';
                }
            } else {
                // update all those emails to status SENT, in case if another cron runs in meantime so we don't send some emails twice
                // this can happen because we sleep between sending emails to stay within the send limit
                foreach ($emails as $e) {
                    //$e->status = EmailLog::STATUS_SENT;
                    //$e->save();
                }
            }

        } while ($count < 1 && $numIterations > 0);

        /**
         * @var EmailLog $e
         */
        $mailer = $this->getMailer();
        $emailLog = ['sent' => 0, 'errors' => 0];
        foreach ($emails as $e) {
            $msg = $mailer->getMessage();
            $msg->setFrom(new Email($e->notification->email['fromAddress'], $e->notification->email['fromName']));
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
    }

    /**
     * @return Mailer
     * @throws NotificationException
     * @throws \Webiny\Component\StdLib\Exception\Exception
     */
    private function getMailer()
    {
        // load the mailer settings
        $settings = Setting::findOne(['key' => 'notification-manager']);
        if (empty($settings)) {
            throw new NotificationException(sprintf('Unable to load SMTP settings'));
        }
        $settings = $settings['settings'];

        $config = [
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