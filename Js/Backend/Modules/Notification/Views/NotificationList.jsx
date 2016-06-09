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
        const listProps = {
            api: '/entities/notification-manager/notifications',
            fields: 'title,description,slug,email.subject,createdOn',
            searchFields: 'title,description,email.subject',
            connectToRouter: true
        };

        const searchProps = {
            placeholder: 'Search by title, description or email subject',
            name: '_searchQuery'
        };

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
                <Ui.Grid.Col all={12}>
                    <Ui.List.ApiContainer ui="notificationList" {...listProps}>

                        <Ui.List.FormFilters>
                            {(applyFilters, resetFilters) => (
                                <Ui.Grid.Row>
                                    <Ui.Grid.Col all={10}>
                                        <Ui.Input {...searchProps} onEnter={applyFilters()}/>
                                    </Ui.Grid.Col>
                                    <Ui.Grid.Col all={2}>
                                        <Ui.Button type="primary" label="Filter" onClick={applyFilters()}/>
                                        <Ui.Button type="secondary" label="Reset" onClick={resetFilters()}/>
                                    </Ui.Grid.Col>
                                </Ui.Grid.Row>
                            )}
                        </Ui.List.FormFilters>

                        <Table.Table>
                            <Table.Row>
                                <Table.Field align="left" label="Title" sort="title">
                                    {data => <span><strong>{data.title}</strong><br/>{data.slug}</span>}
                                </Table.Field>
                                <Table.Field name="description" align="left" label="Description" sort="description"/>
                                <Table.TimeAgoField name="createdOn" align="left" label="Created On" sort="createdOn"/>
                                <Table.Actions>
                                    <Table.EditAction route="NotificationManager.Notification.Edit"/>
                                    <Table.DeleteAction/>
                                </Table.Actions>
                            </Table.Row>
                            <Table.Empty/>
                        </Table.Table>
                        <Ui.List.Pagination/>
                    </Ui.List.ApiContainer>
                </Ui.Grid.Col>
            </Ui.Grid.Row>
        );
    }
};

export default NotificationList;