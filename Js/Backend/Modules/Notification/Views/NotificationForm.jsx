import Webiny from 'Webiny';
import PreviewModal from './NotificationForm/PreviewModal';
import SendingHistory from './NotificationForm/SendingHistory';
import Editor from './../Components/Editor';
const Ui = Webiny.Ui.Components;


class NotificationForm extends Webiny.Ui.View {

    constructor(props) {
        super(props);

        this.bindMethods('sendTestEmail');
    }

    sendTestEmail(model) {
        const postBody = {
            'email': Webiny.Model.get('User').email,
            'content': model.email.content,
            'subject': model.email.subject,
            'fromAddress': model.email.fromAddress,
            'fromName': model.email.fromName
        };

        const api = new Webiny.Api.Endpoint('/entities/notification-manager/notifications');

        // show modal box
        this.ui('previewModal').show();
        this.ui('previewModal').setPending();
        api.post(Webiny.Router.getParams('id') + '/preview', postBody).then((response) => {
            if (response.data.data.status === true) {
                this.ui('previewModal').setSuccess();
            } else {
                this.ui('previewModal').setError();
            }
        });
    }

}

NotificationForm.defaultProps = {
    renderer() {
        const formProps = {
            api: '/entities/notification-manager/notifications',
            fields: '*,variables,template',
            connectToRouter: true,
            onSubmitSuccess: () => Webiny.Router.goToRoute('NotificationManager.Notifications'),
            onCancel: () => Webiny.Router.goToRoute('NotificationManager.Notifications')
        };

        const templateSelect = {
            ui: 'templateSelect',
            api: '/entities/notification-manager/templates',
            fields: 'name',
            label: 'Template',
            name: 'template',
            placeholder: 'Select template',
            allowClear: true
        };

        const entitySelect = {
            name: 'entity',
            placeholder: 'Select Entity',
            allowClear: true,
            api: '/services/core/entities',
            fields: 'class,name',
            perPage: 2,
            valueAttr: 'class',
            minimumResultsForSearch: 5,
            optionRenderer: option => {
                return (
                    <div>
                        <strong>{option.data.name}</strong>
                        <br/>
                        <span>{option.data.class}</span>
                    </div>
                );
            },
            selectedRenderer: option => {
                return option.data.name;
            }
        };

        return (
            <Ui.Form.Container ui="notificationForm" {...formProps}>
                {(model, container) => (
                    <Ui.View.Form>
                        <Ui.View.Header title="Notification"/>

                        <Ui.View.Body noPadding={true}>
                            <Ui.Tabs.Tabs size="large">
                                <Ui.Tabs.Tab label="General" icon="icon-settings">
                                    <Ui.Grid.Row>
                                        <Ui.Grid.Col all={6}>
                                            <Ui.Form.Fieldset title="Notification Settings"/>

                                            <Ui.Input label="Title" name="title" validate="required"/>
                                            <Ui.Input label="Slug" name="slug" readOnly={true}/>
                                            <Ui.Textarea label="Description" name="description"/>
                                            <Ui.Tags label="Labels" name="labels" placeholder="Add Label"/>
                                        </Ui.Grid.Col>
                                        <Ui.Grid.Col all={6}>
                                            <Ui.Form.Fieldset title="Sending History"/>
                                            <SendingHistory/>
                                        </Ui.Grid.Col>
                                    </Ui.Grid.Row>
                                </Ui.Tabs.Tab>
                                <Ui.Tabs.Tab label="Email content" icon="icon-doc-text">
                                    <Ui.Grid.Row>
                                        <Ui.Grid.Col all={4}>
                                            <Ui.Input
                                                label="Subject"
                                                name="email.subject"
                                                validate="required"/>
                                            <Ui.Input
                                                label="From Address"
                                                name="email.fromAddress"
                                                validate="email"
                                                placeholder="Leave blank to use the default sender"/>
                                            <Ui.Input
                                                label="From Name"
                                                name="email.fromName"
                                                placeholder="Leave blank to use the default sender"/>
                                            <Ui.Select {...templateSelect} validate="required"/>
                                        </Ui.Grid.Col>
                                        <Ui.Grid.Col all={8}>
                                            <Editor
                                                variables={model.variables}
                                                label="Content"
                                                name="email.content"
                                                description="You can use Smarty syntax for your email content."/>
                                        </Ui.Grid.Col>
                                    </Ui.Grid.Row>
                                </Ui.Tabs.Tab>
                                <Ui.Tabs.Tab label="Variables" icon="icon-menu">
                                    <Ui.Alert title="About">
                                        This is a list of variables that you can use in your notification content.
                                        The list also defines the data source from where the variable value will be pulled.
                                    </Ui.Alert>
                                    <Ui.Alert title="Important" type="warning">
                                        Changes you make to the variables are not saved until you save the notification!
                                    </Ui.Alert>
                                    <Ui.Dynamic.Fieldset name="variables">
                                        <Ui.Dynamic.Header>
                                            {() => (
                                                <Ui.Grid.Row>
                                                    <Ui.Grid.Col all={2}><Ui.Form.Fieldset title="Variable name"/></Ui.Grid.Col>
                                                    <Ui.Grid.Col all={4}><Ui.Form.Fieldset title="Entity (leave blank for custom variables)"/></Ui.Grid.Col>
                                                    <Ui.Grid.Col all={3}><Ui.Form.Fieldset title="Description"/></Ui.Grid.Col>
                                                    <Ui.Grid.Col all={3}></Ui.Grid.Col>
                                                </Ui.Grid.Row>
                                            )}
                                        </Ui.Dynamic.Header>
                                        <Ui.Dynamic.Row>
                                            {function (record, index, actions) {
                                                return (
                                                    <Ui.Grid.Row key={index}>
                                                        <Ui.Grid.Col all={2}>
                                                            <Ui.Input placeholder="Key" name="key" validate="required"/>
                                                        </Ui.Grid.Col>
                                                        <Ui.Grid.Col all={4}>
                                                            <Ui.Select {...entitySelect} label={null}/>
                                                        </Ui.Grid.Col>
                                                        <Ui.Grid.Col all={3}>
                                                            <Ui.Input placeholder="Description" name="description"/>
                                                        </Ui.Grid.Col>
                                                        <Ui.Grid.Col all={3}>
                                                            <div className="btn-group">
                                                                <Ui.Button type="primary" label="Add" onClick={actions.add(index)}/>
                                                                <Ui.Button type="secondary" label="x" onClick={actions.remove(index)}/>
                                                            </div>
                                                        </Ui.Grid.Col>
                                                    </Ui.Grid.Row>
                                                );
                                            }}
                                        </Ui.Dynamic.Row>
                                        <Ui.Dynamic.Empty>
                                            {function (actions) {
                                                return (
                                                    <Ui.Grid.Row>
                                                        <Ui.Grid.Col all={12}>
                                                            <h5>You have not defined any variables yet. Click "Add variable" to define your first variable!</h5>
                                                            <Ui.Button type="primary" label="Add variable" onClick={actions.add(0)}/>
                                                        </Ui.Grid.Col>
                                                    </Ui.Grid.Row>
                                                )
                                            }}
                                        </Ui.Dynamic.Empty>
                                    </Ui.Dynamic.Fieldset>
                                </Ui.Tabs.Tab>
                            </Ui.Tabs.Tabs>
                            <PreviewModal ui="previewModal"/>
                        </Ui.View.Body>
                        <Ui.View.Footer>
                            <Ui.Button align="right" type="primary" onClick={container.submit}>Save Changes</Ui.Button>
                            <Ui.Button align="right" type="secondary" onClick={() => this.sendTestEmail(model)}>Send Test Email</Ui.Button>
                            <Ui.Button align="left" type="default" onClick={container.cancel}>Go Back</Ui.Button>
                        </Ui.View.Footer>
                    </Ui.View.Form>
                )}
            </Ui.Form.Container>
        );
    }
};


export default NotificationForm;
