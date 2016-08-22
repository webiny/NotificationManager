# Notification Manager

Notification Manager app provides a user-friendly interface for creating transactional emails
similar to Mandrill with a few additional features that make your development life a lot easier.

The system keeps track of your email variables and will not send your email if there are any missing replacement values,
which will spare you from embarrassment and unprofessional looking emails. 

Besides the regular email templates, you are also able to create email layout templates (for your header, footer, etc.) 
and save you some time maintaining dozens and even hundreds of templates when your company contact info or social media accounts change.

## Sending email with attachments from PHP

```php
/* @var NotificationManager $nm */
$nm = $this->wService('NotificationManager');
$notification = $nm->getNotification('test');

$file = new File('webiny.json', $this->wStorage('YourStorage'));
$notification->addAttachment($file, 'custom.json', 'application/json');

$notification->setRecipient('client@email.com', 'Client');
$notification->send();
```

## Instant Send

If you don't want your emails to be added to the queue, but you want them to be sent instantly, just set `Application.NotificationManager.InstantSend`
to `true` in your config. This is useful for development, so you don't wait for the cron job to trigger for in order to receive your email.

```yaml
Application:
  NotificationManager:
      InstantSend: true
```

## Email content - template

The email content field is parsed by Smarty template engine. This enables you to write an if or a foreach loop, amongst many other stuff that smarty supports.
You can also write variables like {$object.attribute} in case if you want to access child parameters, or array keys.