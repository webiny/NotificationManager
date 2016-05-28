import Webiny from 'Webiny';
import Views from './Views/Views';

class Overview extends Webiny.Module {

    init() {
        const Menu = Webiny.Ui.Menu;

        this.registerMenus(
            new Menu('Notifications', [
                new Menu('Activity', 'NotificationManager.Activity')
            ], 'icon-bell')
        );

        this.registerRoutes(
            new Webiny.Route('NotificationManager.Activity', '/notification-manager/activity', Views.List, 'Notification Manager - Activity')
        );
    }
}

export default Overview;