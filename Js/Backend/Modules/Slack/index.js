import Webiny from 'Webiny';
import SlackSettingsTab from './SlackSettingsTab';
import SlackContentTab from './SlackContentTab';
import SlackPreviewTab from './SlackPreviewTab';

class Slack extends Webiny.Module {

    init() {
        this.name = 'Slack';
        Webiny.Injector.register('slackSettingsTab', SlackSettingsTab, ['NotificationManager.SettingsForm.Tab']);
        Webiny.Injector.register('slackContentTab', SlackContentTab, ['NotificationManager.NotificationForm.Tab']);
        Webiny.Injector.register('slackPreviewTab', SlackPreviewTab, ['NotificationManager.NotificationForm.Preview']);
    }
}

export default Slack;