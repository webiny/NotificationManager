import React from 'react';
import Webiny from 'webiny';
import ActivityList from './ActivityList';

class Activity extends Webiny.App.Module {

    init() {
        this.name = 'Activity';
        const Menu = Webiny.Ui.Menu;
        const role = 'notification-manager';

        this.registerMenus(
            <Menu label="Marketing Tools" icon="icon-bell">
                <Menu label="Notification Manager" role={role}>
                    <Menu label="Activity" route="NotificationManager.Activity"/>
                </Menu>
            </Menu>
        );

        this.registerRoutes(
            new Webiny.Route('NotificationManager.Activity', '/notification-manager/activity', ActivityList, 'Notification Manager - Activity').setRole(role)
        );
    }
}

export default Activity;