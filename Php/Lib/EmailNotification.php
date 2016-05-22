<?php

namespace Apps\NotificationManager\Php\Lib;

use Apps\NotificationManager\Php\Entities\Notification;
use Webiny\Component\Validation\ValidationTrait;
use Webiny\Component\Validation\ValidationException;

class EmailNotification
{
    use ValidationTrait;

    protected $content;
    protected $recipientEmail;
    protected $recipientName;

    public function __construct($slug)
    {
        // load notification
        /**
         * @var Notification $notification
         */
        $notification = Notification::findOne(['slug' => $slug]);
        if (empty($notification)) {
            new NotificationException(sprintf('Unable to load notification "%s".', $slug));
        }

        // combine the template and the content
        $this->content = str_replace('{_content_}', $notification->email['content'], $notification->template->content);
    }

    public function setRecipient($email, $name)
    {
        try {
            self::validation()->validate($email, 'email');
        } catch (ValidationException $e) {
            new NotificationException(sprintf('Recipient email "%s" is invalid.', $email));
        }

        $this->recipientEmail = $email;
        $this->recipientName = $name;
    }

}