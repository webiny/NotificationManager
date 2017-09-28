import React from 'react';
import Webiny from 'webiny';
import Views from './Views/Views';

/**
 * @i18n.namespace NotificationManager.Backend.Notification
 */
class Notification extends Webiny.App.Module {

    init() {
        this.name = 'Notification';
        const Menu = Webiny.Ui.Menu;
        const role = 'notification-manager';

        this.registerMenus(
            <Menu label={Webiny.I18n('Marketing Tools')} icon="fa-bell">
                <Menu label={Webiny.I18n('Notification Manager')} role={role}>
                    <Menu label={Webiny.I18n('Notifications')} route="NotificationManager.Notifications"/>
                </Menu>
            </Menu>
        );

        this.registerRoutes(
            new Webiny.Route('NotificationManager.Notifications', '/notification-manager/notifications', Views.NotificationList, 'Notification Manager - Notification').setRole(role),
            new Webiny.Route('NotificationManager.Notification.Edit', '/notification-manager/notification/:id', Views.NotificationForm, 'Notification Manager - Edit Notification').setRole(role)
        );
    }
}

export default Notification;