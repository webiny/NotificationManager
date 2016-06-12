import Webiny from 'Webiny';
import Views from './Views/Views';

class Settings extends Webiny.Module {

    init() {
        const Menu = Webiny.Ui.Menu;

        this.registerMenus(
            new Menu('Marketing Tools', [
                new Menu('Notification Manager', [
                    new Menu('Settings', 'NotificationManager.Settings')
                ])
            ], 'icon-bell')
        );

        this.registerRoutes(
            new Webiny.Route('NotificationManager.Settings', '/notification-manager/settings', Views.SettingsForm, 'Notification Manager - Settings')
        );
    }
}

export default Settings;