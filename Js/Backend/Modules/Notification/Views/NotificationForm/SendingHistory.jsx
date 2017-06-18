import Webiny from 'Webiny';

class SendingHistory extends Webiny.Ui.View {
    constructor(props) {
        super(props);

        this.bindMethods('showContent');
    }

    showContent(id) {
        const myWindow = window.open('', '_blank', 'width=800,height=600');
        const api = new Webiny.Api.Endpoint('/entities/notification-manager/email-log').setQuery({'_fields': 'content'});

        api.get('/' + id).then((response) => {
            // tell to the feedback service not to mark email as read on the preview
            let content = response.getData('entity.content').replace(/\/1px/, '/1px?preview=true');

            // show the preview window
            myWindow.document.write(content);
            myWindow.focus();
        });
    }
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
            <Webiny.Ui.LazyLoad modules={['List', 'Link']}>
                {({List, Link}) => (
                    <List {...listProps}>
                        <List.Table>
                            <List.Table.Row>
                                <List.Table.Empty/>
                                <List.Table.TimeAgoField name="createdOn" align="left" label="Date Sent" sort="createdOn"/>
                                <List.Table.Field name="email" align="left" label="Email" sort="email"/>
                                <List.Table.Field align="right">
                                    {data => <Link type="default" onClick={() => this.showContent(data.id)}>Show Content</Link>}
                                </List.Table.Field>

                            </List.Table.Row>
                        </List.Table>
                        <List.Pagination/>
                    </List>
                )}
            </Webiny.Ui.LazyLoad>
        );
    }
};

export default SendingHistory;