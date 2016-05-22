<?php

namespace Apps\NotificationManager\Php\Lib;


class Notification
{
    public static function send($slug, $recipient, array $entities = [])
    {
        $emailNotification = new EmailNotification($slug);

        // check recipient details
        $recipientName = '';
        if (is_array($recipient)) {
            $recipientEmail = $recipient[0];
            if (isset($recipient[1])) {
                $recipientName = $recipient[1];
            }
        } else {
            $recipientEmail = $recipient;
        }
        $emailNotification->setRecipient($recipientEmail, $recipientName);

        // get content and pass it to the parser


    }
}