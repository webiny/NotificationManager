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
            <Ui.List.ApiContainer ui="templateList" {...listProps}>
                <Table.Table>
                    <Table.Row>
                        <Table.TimeAgoField name="createdOn" align="left" label="Date Sent" sort="createdOn"/>
                        <Table.Field name="email" align="left" label="Email" sort="email"/>
                        <Table.Field align="right">
                            {data => <Ui.Link type="default" onClick={() => this.showContent(data.id)}>Show Content</Ui.Link>}
                        </Table.Field>

                    </Table.Row>
                </Table.Table>
                <Ui.List.Pagination/>
            </Ui.List.ApiContainer>

        );
    }
};

export default SendingHistory;