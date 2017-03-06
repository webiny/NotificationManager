import Webiny from 'Webiny';
import ActivityList from './ActivityList';

class Activity extends Webiny.Module {

    init() {
        this.name = 'Activity';
        const Menu = Webiny.Ui.Menu;
        const role = 'notification-manager';

        this.registerMenus(
            new Menu('Marketing Tools', [
                new Menu('Notification Manager', [
                    new Menu('Activity', 'NotificationManager.Activity')
                ]).setRole(role)
            ], 'icon-bell')
        );

        this.registerRoutes(
            new Webiny.Route('NotificationManager.Activity', '/notification-manager/activity', ActivityList, 'Notification Manager - Activity').setRole(role)
        );
    }
}

export default Activity;