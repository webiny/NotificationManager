import React from 'react';
import Webiny from 'webiny';

/**
 * @i18n.namespace NotificationManager.Backend.Email.ActivityList
 */
class ActivityList extends Webiny.Ui.View {
    constructor(props) {
        super(props);

        this.bindMethods('showContent');
    }

    showContent(id) {
        const myWindow = window.open('', '_blank', 'width=800,height=600');
        const api = new Webiny.Api.Endpoint('/entities/notification-manager/email-log').setQuery({'_fields': 'content'});

        api.get('/' + id).then(response => {
            // tell to the feedback service not to mark email as read on the preview
            let content = response.getData('entity.content').replace(/\/1px/, '/1px?preview=true');

            // show the preview window
            myWindow.document.write(content);
            myWindow.focus();
        });
    }

    deleteLog(id) {
        const api = new Webiny.Api.Endpoint('/entities/notification-manager/email-log');

        api.delete(id).then(response => {
            if (!response.isError()) {
                Webiny.Growl.success('Email log deleted successfully!');
                this.activityList.loadData();
            } else {
                Webiny.Growl.danger(response.getError());
            }
        });
    }
}

ActivityList.defaultProps = {

    renderer() {
        const listProps = {
            ref: ref => this.activityList = ref,
            api: '/entities/notification-manager/email-log',
            query: {notification: this.props.notification.id},
            fields: 'id,status,email,name,subject,createdOn',
            searchFields: 'email,name,subject',
            sort: '-createdOn'
        };

        const searchProps = {
            placeholder: this.i18n('Search by name, email or subject'),
            name: '_searchQuery'
        };

        const dateProps = {
            placeholder: this.i18n('Search by date'),
            name: 'createdOn'
        };

        const {Ui} = this.props;

        return (
            <Ui.List {...listProps}>
                <Ui.List.FormFilters>
                    {({apply, reset}) => (
                        <Ui.Grid.Row>
                            <Ui.Grid.Col all={5}>
                                <Ui.Input {...searchProps} onEnter={apply()}/>
                            </Ui.Grid.Col>
                            <Ui.Grid.Col all={5}>
                                <Ui.Date {...dateProps} onChange={apply()}/>
                            </Ui.Grid.Col>
                            <Ui.Grid.Col all={2}>
                                <Ui.Button type="secondary" align="right" label={this.i18n('Reset Filters')} onClick={reset()}/>
                            </Ui.Grid.Col>
                        </Ui.Grid.Row>
                    )}
                </Ui.List.FormFilters>
                <Ui.List.Table>
                    <Ui.List.Table.Row>
                        <Ui.List.Table.CaseField name="status" label={this.i18n('Status')} align="left">
                            <case value="pending">
                                <Ui.Label type="default">{this.i18n('Pending')}</Ui.Label>
                            </case>
                            <case value="error">
                                <Ui.Label type="error">{this.i18n('Error')}</Ui.Label>
                            </case>
                            <case value="sent">
                                <Ui.Label type="info">{this.i18n('Sent')}</Ui.Label>
                            </case>
                            <case value="delivered">
                                <Ui.Label type="success">{this.i18n('Delivered')}</Ui.Label>
                            </case>
                            <case value="hard-bounce">
                                <Ui.Label type="error">{this.i18n('Hard Bounce')}</Ui.Label>
                            </case>
                            <case value="soft-bounce">
                                <Ui.Label type="warning">{this.i18n('Soft Bounce')}</Ui.Label>
                            </case>
                            <case value="complaint">
                                <Ui.Label type="error">{this.i18n('Complaint')}</Ui.Label>
                            </case>
                            <case value="read">
                                <Ui.Label type="success">{this.i18n('Read')}</Ui.Label>
                            </case>
                        </Ui.List.Table.CaseField>
                        <Ui.List.Table.TimeAgoField name="createdOn" align="left" label={this.i18n('Date Sent')} sort="createdOn"/>
                        <Ui.List.Table.Field name="email" align="left" label={this.i18n('Email')} sort="email"/>
                        <Ui.List.Table.Field name="subject" align="left" label={this.i18n('Subject')} sort="subject"/>
                        <Ui.List.Table.Actions>
                            <Ui.List.Table.Action icon="fa-search" label={this.i18n('Show Content')} onClick={({data}) => this.showContent(data.id)}/>
                            <Ui.List.Table.DeleteAction onClick={({data}) => this.deleteLog(data.id)}/>
                        </Ui.List.Table.Actions>
                    </Ui.List.Table.Row>
                </Ui.List.Table>
                <Ui.List.Pagination/>
            </Ui.List>
        );
    }
};

export default Webiny.createComponent(ActivityList, {
    modulesProp: 'Ui',
    modules: ['List', 'Grid', 'Button', 'Input', 'Date', 'Label']
});