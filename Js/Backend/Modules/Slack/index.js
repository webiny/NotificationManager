import Webiny from 'Webiny';

class Slack extends Webiny.App.Module {

    init() {
        this.name = 'Slack';
        Webiny.registerModule(
            new Webiny.Module('SlackSettingsTab', () => import('./SlackSettingsTab')).setTags('NotificationManager.SettingsForm.Tab'),
            new Webiny.Module('SlackContentTab', () => import('./SlackContentTab')).setTags('NotificationManager.NotificationForm.Tab'),
            new Webiny.Module('SlackPreviewTab', () => import('./SlackPreviewTab')).setTags('NotificationManager.NotificationForm.Preview')
        );
    }
}

export default Slack;