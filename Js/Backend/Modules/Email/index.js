import Webiny from 'Webiny';
import EmailSettingsTab from './EmailSettingsTab';
import EmailContentTab from './EmailContentTab';
import EmailPreviewTab from './EmailPreviewTab';

class Email extends Webiny.Module {

    init() {
        Webiny.Injector.register('emailSettingsTab', EmailSettingsTab, ['NotificationManager.SettingsForm.Tab']);
        Webiny.Injector.register('emailContentTab', EmailContentTab, ['NotificationManager.NotificationForm.Tab']);
        Webiny.Injector.register('emailPreviewTab', EmailPreviewTab, ['NotificationManager.NotificationForm.Preview']);
    }
}

export default Email;