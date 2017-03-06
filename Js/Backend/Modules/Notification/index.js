import Webiny from 'Webiny';
import Views from './Views/Views';
import Components from './Components/Components';

class Notification extends Webiny.Module {

    init() {
        this.name = 'Notification';
        const Menu = Webiny.Ui.Menu;
        const role = 'notification-manager';
        
        this.registerComponents(Components);

        this.registerMenus(
            new Menu('Marketing Tools', [
                new Menu('Notification Manager', [
                    new Menu('Notifications', 'NotificationManager.Notifications')
                ]).setRole(role)
            ], 'icon-bell')
        );

        this.registerRoutes(
            new Webiny.Route('NotificationManager.Notifications', '/notification-manager/notifications', Views.NotificationList, 'Notification Manager - Notification').setRole(role),
            new Webiny.Route('NotificationManager.Notification.Edit', '/notification-manager/notification/:id', Views.NotificationForm, 'Notification Manager - Edit Notification').setRole(role)
        );
    }
}

export default Notification;