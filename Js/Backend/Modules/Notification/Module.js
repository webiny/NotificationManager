import Webiny from 'Webiny';
import Views from './Views/Views';
import Components from './Components/Components';

class Notification extends Webiny.Module {

    init() {
        const Menu = Webiny.Ui.Menu;

        this.registerComponents(Components);

        this.registerMenus(
            new Menu('Marketing Tools', [
                new Menu('Notification Manager', [
                    new Menu('Notifications', 'NotificationManager.Notifications')
                ])
            ], 'icon-bell')
        );

        this.registerRoutes(
            new Webiny.Route('NotificationManager.Notifications', '/notification-manager/notifications', Views.NotificationList, 'Notification Manager - Notification'),
            new Webiny.Route('NotificationManager.Notification.Edit', '/notification-manager/notification/:id', Views.NotificationForm, 'Notification Manager - Edit Notification')
        );
    }
}

export default Notification;