import Webiny from 'Webiny';
import Views from './Views/Views';

class Module extends Webiny.Module {

    init() {
        const Menu = Webiny.Ui.Menu;

        this.registerMenus(
            new Menu('Notifications', 'NotificationManager.Notifications', 'icon-website')
        );

        this.registerRoutes(
            new Webiny.Route('NotificationManager.Notifications', '/notification-manager/notifications', Views.NotificationList, 'Notification Manager - Notification'),
            new Webiny.Route('NotificationManager.Notification.Edit', '/notification-manager/notification/:id', Views.NotificationForm, 'Notification Manager - Edit Notification')
        );
    }
}

export default Module;