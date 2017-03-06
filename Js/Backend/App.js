import 'Assets/styles.scss';
import Webiny from 'Webiny';
import Activity from './Modules/Activity';
import Email from './Modules/Email';
import Notification from './Modules/Notification';
import Settings from './Modules/Settings';
import Slack from './Modules/Slack';
import Templates from './Modules/Templates';

class NotificationManager extends Webiny.App {
    constructor() {
        super('NotificationManager.Backend');
        this.modules = [
            new Activity(this),
            new Email(this),
            new Notification(this),
            new Settings(this),
            new Slack(this),
            new Templates(this)
        ];
    }
}

Webiny.registerApp(new NotificationManager());

