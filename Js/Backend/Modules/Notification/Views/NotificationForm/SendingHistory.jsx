import Webiny from 'Webiny';
import List from '../../../Activity/Views/List';
const Ui = Webiny.Ui.Components;
const Table = Ui.List.Table;

class SendingHistory extends List {

}

SendingHistory.defaultProps = {

    renderer() {
        const listProps = {
            api: '/entities/notification-manager/email-log',
            fields: 'id,status,email,name,subject,createdOn',
            query: {
                notification: Webiny.Router.getParams('id')
            }
        };

        return (
            <Ui.List ui="templateList" {...listProps}>
                <Table>
                    <Table.Row>
                        <Table.Empty/>
                        <Table.TimeAgoField name="createdOn" align="left" label="Date Sent" sort="createdOn"/>
                        <Table.Field name="email" align="left" label="Email" sort="email"/>
                        <Table.Field align="right">
                            {data => <Ui.Link type="default" onClick={() => this.showContent(data.id)}>Show Content</Ui.Link>}
                        </Table.Field>

                    </Table.Row>
                </Table>
                <Ui.List.Pagination/>
            </Ui.List>

        );
    }
};

export default SendingHistory;