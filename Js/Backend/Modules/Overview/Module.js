import Webiny from 'Webiny';
import Views from './Views/Views';

class Overview extends Webiny.Module {

    init() {
        this.registerRoutes(
            new Webiny.Route('NotificationManager.Overview', '/notification-manager/overview', Views.List, 'Notification Manager - Overview'),
            new Webiny.Route('NotificationManager.Overview.Details', '/notification-manager/overview/:id', Views.Details, 'Notification Manager - Details')
        );
    }
}

export default Overview;