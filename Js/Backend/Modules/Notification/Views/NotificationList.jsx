import Webiny from 'Webiny';
import NotificationCreateNewModal from './NotificationCreateNewModal';
const Ui = Webiny.Ui.Components;
const Table = Ui.List.Table;

class NotificationList extends Webiny.Ui.View {
    constructor(props) {
        super(props);
    }
}

NotificationList.defaultProps = {

    renderer() {
        return (
            <Ui.Grid.Row>
                <Ui.Grid.Col all={12}>
                    <h2>
                        <Ui.Grid.Row>
                            <Ui.Grid.Col all={10}>
                                Notifications
                            </Ui.Grid.Col>
                            <Ui.Grid.Col all={2}>
                                <Ui.Button type="primary" align="right" onClick={this.ui('notificationCreateNewModal:show')}>
                                    Create new Notification
                                </Ui.Button>
                                <NotificationCreateNewModal ui="notificationCreateNewModal"/>
                            </Ui.Grid.Col>
                        </Ui.Grid.Row>
                    </h2>
                </Ui.Grid.Col>

            </Ui.Grid.Row>
        );
    }
};

export default NotificationList;