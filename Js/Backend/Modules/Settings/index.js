import React from 'react';
import Webiny from 'webiny';
import SettingsForm from './SettingsForm';

/**
 * @i18n.namespace NotificationManager.Backend.Settings
 */
class Settings extends Webiny.App.Module {

    init() {
        this.name = 'Settings';
        const Menu = Webiny.Ui.Menu;
        const role = 'notification-manager';

        this.registerMenus(
            <Menu label={Webiny.I18n('Marketing Tools')} icon="fa-bell">
                <Menu label={Webiny.I18n('Notification Manager')} role={role}>
                    <Menu label={Webiny.I18n('Settings')} route="NotificationManager.Settings"/>
                </Menu>
            </Menu>
        );

        this.registerRoutes(
            new Webiny.Route('NotificationManager.Settings', '/notification-manager/settings', SettingsForm, 'Notification Manager - Settings').setRole(role)
        );
    }
}

export default Settings;