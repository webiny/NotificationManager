<?php

namespace Apps\NotificationManager\Php\Lib;

use Apps\Core\Php\DevTools\WebinyTrait;
use Apps\Core\Php\Entities\Setting;
use Webiny\Component\Config\Config;

class Mailer
{
    use WebinyTrait;

    /**
     * @return \Webiny\Component\Mailer\Mailer
     * @throws NotificationException
     * @throws \Webiny\Component\StdLib\Exception\Exception
     */
    public static function getMailer()
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

        \Webiny\Component\Mailer\Mailer::setConfig(Config::getInstance()->parseResource(['NotificationManager' => $config]));

        return self::wMailer('NotificationManager');
    }

}