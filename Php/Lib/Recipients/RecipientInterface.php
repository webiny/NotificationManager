<?php

namespace Apps\NotificationManager\Php\Lib\Recipients;

interface RecipientInterface
{
    /**
     * Returns a unique string identifying this recipient.
     *
     * @return string
     */
    public function getId();
}