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
            fields: 'title,description,slug,email.subject,createdOn,labels',
            searchFields: 'title,slug,description,email.subject,labels',
            connectToRouter: true
        };

        const searchProps = {
            placeholder: 'Search by title, description or email subject',
            name: '_searchQuery'
        };

        return (
            <Ui.View.List>
                <Ui.View.Header title="Notifications">
                    <Ui.Button type="primary" align="right" onClick={this.ui('notificationCreateNewModal:show')}>
                        <Ui.Icon icon="icon-plus-circled"/>
                        Create notification
                    </Ui.Button>
                    <NotificationCreateNewModal ui="notificationCreateNewModal"/>
                </Ui.View.Header>

                <Ui.View.Body>
                    <Ui.List.ApiContainer ui="notificationList" {...listProps}>

                        <Ui.List.FormFilters>
                            {(applyFilters, resetFilters) => (
                                <Ui.Grid.Row>
                                    <Ui.Grid.Col all={10}>
                                        <Ui.Input {...searchProps} onEnter={applyFilters()}/>
                                    </Ui.Grid.Col>
                                    <Ui.Grid.Col all={2}>
                                        <Ui.Button type="secondary" align="right" label="Reset Filter" onClick={resetFilters()}/>
                                    </Ui.Grid.Col>
                                </Ui.Grid.Row>
                            )}
                        </Ui.List.FormFilters>

                        <Table.Table>
                            <Table.Row>
                                <Table.Field align="left" label="Title" sort="title" route="NotificationManager.Notification.Edit">
                                    {data => (
                                        <span>
                                            <strong>{data.title}</strong>
                                            <br/>{data.slug}<br/>
                                            {data.labels.map((l, k) => <Ui.Label key={k} type="info">{l}</Ui.Label>)}
                                        </span>
                                    )}
                                </Table.Field>
                                <Table.Field name="description" align="left" label="Description" sort="description"/>
                                <Table.TimeAgoField name="createdOn" align="left" label="Created" sort="createdOn"/>
                                <Table.Actions>
                                    <Table.Action label={this.i18n(`Copy`)} icon="fa-files-o" onClick={row => {
                                        new Webiny.Api.Endpoint(listProps.api).post(`/${row.id}/copy`).then(response => {
                                            Webiny.Growl.success(this.i18n('Notification copied successfully!'));
                                            Webiny.Router.goToRoute('NotificationManager.Notification.Edit', {
                                                id: response.getData('id')
                                            });
                                        });
                                    }}/>
                                    <Ui.Dropdown.Divider />
                                    <Table.EditAction route="NotificationManager.Notification.Edit"/>
                                    <Table.DeleteAction/>
                                </Table.Actions>
                            </Table.Row>
                        </Table.Table>
                        <Ui.List.Pagination/>
                    </Ui.List.ApiContainer>
                </Ui.View.Body>
            </Ui.View.List>
        );
    }
};

export default NotificationList;