import Webiny from 'Webiny';
import Views from './Views/Views';

class Settings extends Webiny.Module {

    init() {
        this.registerRoutes(
            new Webiny.Route('NotificationManager.Settings', '/notification-manager/settings', Views.SettingsForm, 'Notification Manager - Settings')
        );
    }
}

export default Settings;