import React from 'react';
import Webiny from 'webiny';
import SettingsForm from './SettingsForm';

class Settings extends Webiny.App.Module {

    init() {
        this.name = 'Settings';
        const Menu = Webiny.Ui.Menu;
        const role = 'notification-manager';

        this.registerMenus(
            <Menu label="Marketing Tools" icon="fa-bell">
                <Menu label="Notification Manager" role={role}>
                    <Menu label="Settings" route="NotificationManager.Settings"/>
                </Menu>
            </Menu>
        );

        this.registerRoutes(
            new Webiny.Route('NotificationManager.Settings', '/notification-manager/settings', SettingsForm, 'Notification Manager - Settings').setRole(role)
        );
    }
}

export default Settings;