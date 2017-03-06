import Webiny from 'Webiny';
import Views from './Views/Views';

class Settings extends Webiny.Module {

    init() {
        this.name = 'Settings';
        const Menu = Webiny.Ui.Menu;
        const role = 'notification-manager';

        this.registerMenus(
            new Menu('Marketing Tools', [
                new Menu('Notification Manager', [
                    new Menu('Settings', 'NotificationManager.Settings')
                ]).setRole(role)
            ], 'icon-bell')
        );

        this.registerRoutes(
            new Webiny.Route('NotificationManager.Settings', '/notification-manager/settings', Views.SettingsForm, 'Notification Manager - Settings').setRole(role)
        );
    }
}

export default Settings;