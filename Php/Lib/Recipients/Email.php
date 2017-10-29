<?php

namespace Apps\NotificationManager\Php\Lib\Recipients;

class Email extends \Webiny\Component\Mailer\Email implements RecipientInterface
{

    /**
     * Returns a unique string identifying this recipient.
     *
     * @return string
     */
    public function getId()
    {
        return $this->email;
    }
}