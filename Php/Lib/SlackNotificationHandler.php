<?php
namespace Apps\NotificationManager\Php\Lib;

use Apps\Core\Php\DevTools\Exceptions\AppException;
use Apps\NotificationManager\Php\Entities\Settings;
use Webiny\Component\TemplateEngine\TemplateEngineException;

/**
 * Class AbstractNotificationHandler
 * @package Apps\NotificationManager\Php\Lib
 */
class SlackNotificationHandler extends AbstractNotificationHandler
{
    /**
     * @var \Apps\Core\Php\DevTools\TemplateEngine
     */
    protected $templateInstance;
    private $message;
    private $channel;
    private $team;
    private $token;
    private $username;

    function __construct()
    {
        $this->templateInstance = $this->wTemplateEngine();
    }

    public function canSend()
    {
        $handler = $this->notification->handlers['slack'] ?? null;

        return $handler && $handler['send'];
    }

    public function send()
    {
        $this->loadSettings();
        $slack = $this->notification->handlers['slack'];
        $this->channel = $slack['channel'] ?? '';
        $this->message = $slack['message'] ?? '';
        $variables = $this->parseVariables();
        $this->message = $this->templateInstance->fetch('eval:' . $this->message, $variables);
        $this->sendMessage();
    }

    /**
     * @inheritdoc
     */
    public function setRecipients(array $recipients)
    {
        return $this;
    }

    public function validate()
    {
        $handler = $this->notification->handlers['slack'];
        // Validate all email keys (message, subject, ...)
        foreach ($handler as $key => $v) {
            if (is_string($v)) {
                $this->validateVariables($v);
            }
        }

        // validate message
        try {
            $this->templateInstance->fetch('eval:' . $handler['message'] ?? '');
        } catch (TemplateEngineException $e) {
            throw new AppException('Invalid template syntax: ' . $e->getMessage());
        }
    }

    public function preview($data)
    {
        $preview = $data['slack'] ?? [];
        $handler = $this->notification->handlers['slack'];

        $this->loadSettings();
        $keys = ['token', 'team', 'channel', 'username'];
        foreach ($keys as $key) {
            if (isset($preview[$key]) && $preview[$key] != '') {
                $this->{$key} = $preview[$key];
            }
        }

        $this->message = $handler['message'];

        if ($this->sendMessage()) {
            return [
                'status'  => true,
                'message' => 'Slack message was sent successfully to ' . $this->channel . '.'
            ];
        }

        return [
            'status'  => false,
            'message' => 'Failed to send preview message to ' . $this->channel . '.'
        ];
    }

    public function validateVariables($message)
    {
        // extract variables from the provided message
        $variables = $this->str($message)->match('\{\$(.*?)\}');

        if (!$variables || $variables->count() < 1) {
            return true;
        }

        $missingVars = [];
        foreach ($variables[1] as $v) {
            // we need to explode the nested attributes
            $v = $this->str($v)->explode('.')->first();

            foreach ($this->notification->variables as $av) {
                if ($v == $av['key']) {
                    // We have found or match, continue to the outer loop
                    continue 2;
                }
            }
            $missingVars[] = $v;
        }

        if (count($missingVars) > 0) {
            $message = 'One or more variables present in the Slack message are not defined in the variables list. (';
            throw new AppException($message . join(', ', $missingVars) . ')');
        }

        return true;
    }

    private function sendMessage()
    {
        $post = [
            'token'    => $this->token,
            'team'     => $this->team,
            'channel'  => $this->channel,
            'username' => $this->username,
            'as_user'  => true,
            'text'     => $this->message
        ];

        $res = $this->postMessage($post);

        return $res['ok'] ?? false;
    }

    private function postMessage($message, $type = 'message')
    {
        $url = [
            'message' => 'https://slack.com/api/chat.postMessage',
            'file'    => 'https://slack.com/api/files.upload'
        ];

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url[$type]);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($message));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $res = curl_exec($ch);
        curl_close($ch);

        return json_decode($res, true);
    }

    private function loadSettings()
    {
        $settings = Settings::load();
        $slackSettings = $settings['slack'];
        $this->username = $slackSettings['username'];
        $this->team = $slackSettings['team'];
        $this->token = $slackSettings['token'];
        $this->channel = $this->notification->handlers['slack']['channel'];
    }
}