import Webiny from 'webiny';

class Email extends Webiny.App.Module {

    init() {
        this.name = 'Email';
        Webiny.registerModule(
            new Webiny.Module('EmailSettingsTab', () => import('./EmailSettingsTab')).setTags('NotificationManager.SettingsForm.Tab'),
            new Webiny.Module('EmailContentTab', () => import('./EmailContentTab')).setTags('NotificationManager.NotificationForm.Tab'),
            new Webiny.Module('EmailPreviewTab', () => import('./EmailPreviewTab')).setTags('NotificationManager.NotificationForm.Preview')
        );
    }
}

export default Email;