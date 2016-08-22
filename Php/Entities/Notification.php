<?php
namespace Apps\NotificationManager\Php\Entities;

use Apps\Core\Php\DevTools\WebinyTrait;
use Apps\Core\Php\DevTools\Entity\AbstractEntity;
use Apps\Core\Php\DevTools\Exceptions\AppException;
use Apps\Core\Php\Entities\Setting;
use Apps\NotificationManager\Php\Lib\NotificationException;
use Webiny\Component\Entity\EntityCollection;
use Webiny\Component\Mailer\Email;
use Webiny\Component\Mailer\Mailer;
use Webiny\Component\TemplateEngine\TemplateEngineException;

/**
 * Class Notification
 *
 * @property string           $id
 * @property string           $title
 * @property string           $description
 * @property string           $slug
 * @property array            $labels
 * @property object           $email
 * @property EntityCollection $variables
 * @property Template         $template
 *
 * @package Apps\Core\Php\Entities
 *
 */
class Notification extends AbstractEntity
{
    use WebinyTrait;

    protected static $entityCollection = 'NotificationManagerNotification';
    protected static $entityMask = '{title}';

    public function __construct()
    {
        parent::__construct();

        $this->attr('title')->char()->setValidators('required,unique')->setValidationMessages([
            'unique' => 'A notification with the same title already exists.'
        ])->setToArrayDefault()->onSet(function ($val) {
            $this->slug = $this->str($val)->slug()->val();

            return $val;
        })->setAfterPopulate(true);

        $this->attr('description')->char()->setToArrayDefault();
        $this->attr('slug')->char()->setToArrayDefault();
        $this->attr('labels')->arr()->setToArrayDefault();
        $this->attr('email')->object()->setToArrayDefault()->onSet(function ($val) {
            foreach ($val as $v) {
                $this->validateVariables($v);
            }

            // validate content
            $templateEngine = $this->wTemplateEngine();
            try {
                $templateEngine->fetch('eval:' . $val['content']);
                // everything is fine…
            } catch (TemplateEngineException $e) {
                // error occurred
                throw new AppException('Invalid template syntax: '.$e->getMessage());
            }

            return $val;
        })->setAfterPopulate(true);

        $template = 'Apps\NotificationManager\Php\Entities\Template';
        $this->attr('template')->many2one('Template')->setEntity($template);

        $this->attr('variables')->one2many('notification')->setEntity('\Apps\NotificationManager\Php\Entities\NotificationVariable');

        $this->api('post', 'preview/{notification}', function (Notification $notification) {
            $data = $this->wRequest()->getRequestData();

            return $this->preview($notification, $data);
        });

        $this->api('post', '{id}/copy', function () {
            $newNotification = new Notification();
            $newNotification->description = $this->description;
            $newNotification->title = uniqid($this->title . '-');
            $newNotification->labels = $this->labels;
            $newNotification->template = $this->template;
            $newNotification->save();

            /* @var EntityCollection $variables */
            $variables = $this->variables;

            foreach ($variables as $variable) {
                /* @var NotificationVariable $variable */
                $newVariable = new NotificationVariable();
                $newVariable->key = $variable->key;
                $newVariable->entity = $variable->entity;
                $newVariable->description = $variable->description;
                $newVariable->type = $variable->type;

                $newVariable->notification = $newNotification;
                $newVariable->save();
            }

            $newNotification->email = $this->email;
            $newNotification->save();

            return $newNotification->toArray($this->wRequest()->getFields());

        });
    }

    /**
     * Send preview email
     *
     * @param Notification $notification
     * @param array        $data
     *
     * @return array
     * @throws NotificationException
     */
    public function preview(Notification $notification, array $data)
    {
        // we take the latest content from the post request
        $content = $data['content'];

        // we take the template from the current notification
        $content = str_replace('{_content_}', $content, $notification->template->content);

        // send it
        // get mailer
        /* @var $mailer Mailer */
        $mailer = $this->wService('NotificationManager')->getMailer();

        // get settings
        $settings = Setting::findOne(['key' => 'notification-manager']);
        if (!$settings) {
            throw new NotificationException('Settings sendLimit not defined.');
        }

        // get sender
        $senderEmail = !empty($data['fromAddress']) ? $data['fromAddress'] : $settings['settings']['senderEmail'];
        $senderName = !empty($data['fromName']) ? $data['fromName'] : $settings['settings']['senderName'];

        // populate
        $msg = $mailer->getMessage();
        $msg->setFrom(new Email($senderEmail, $senderName));
        $msg->setSubject($data['subject'])->setBody($content)->setTo(new Email($data['email']));


        if ($mailer->send($msg)) {
            return ['status' => true];
        }

        return ['status' => false];
    }

    public function validateVariables($content)
    {
        // extract variables from the provided content
        $variables = $this->str($content)->match('\{(.*?)\}');

        if (!$variables || $variables->count() < 1) {
            return true;
        }

        // load all variables associated with this notification
        $assocVars = NotificationVariable::find(['notification' => $this->id]);

        $missingVars = [];
        foreach ($variables[1] as $v) {
            $found = false;

            // we need to explode the nested attributes
            $v = $this->str($v)->explode('.')->first()->replace('$', '');

            foreach ($assocVars as $av) {
                if ($v == $av->key) {
                    $found = true;
                }
            }

            if (!$found) {
                $missingVars[] = $v;
            }
        }

        if (count($missingVars) > 0) {
            throw new AppException('One or more variables present in the email content are not defined in the variables list. (' . join(', ',
                    $missingVars) . ')');
        }

        return true;

    }


}