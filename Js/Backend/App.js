import 'Assets/styles.scss';
import Webiny from 'webiny';
import Email from './Modules/Email';
import Notification from './Modules/Notification';
import Settings from './Modules/Settings';
import Slack from './Modules/Slack';
import Templates from './Modules/Templates';

class NotificationManager extends Webiny.App {
    constructor() {
        super('NotificationManager.Backend');
        this.modules = [
            new Email(this),
            new Notification(this),
            new Settings(this),
            new Slack(this),
            new Templates(this)
        ];
    }

    onInstalled() {
        return (
            <div>Bok!</div>
        );
    }
}

Webiny.registerApp(new NotificationManager());

