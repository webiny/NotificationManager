import Webiny from 'Webiny';
import PreviewModal from './NotificationForm/PreviewModal';
import SendingHistory from './NotificationForm/SendingHistory';
const Ui = Webiny.Ui.Components;


class NotificationForm extends Webiny.Ui.View {
    constructor(props){
        super(props);

        this.preview = false;
        this.bindMethods('saveAndPreview');
    }

    renderNotificationTabs(model, form) {
        const tabs = Webiny.Injector.getByTag('NotificationManager.NotificationForm.Tab');
        return tabs.map(tab => {
            return React.cloneElement(tab.value(model, form), {key: tab.name});
        });
    }

    saveAndPreview() {
        this.preview = true;
        this.ui('notificationForm').submit().then(() => {
            this.preview = false;
            this.ui('previewModal').show();
        });
    }
}

NotificationForm.defaultProps = {
    renderer() {
        const formProps = {
            api: '/entities/notification-manager/notifications',
            fields: '*,variables',
            connectToRouter: true,
            onSubmitSuccess: () => {
                if (!this.preview) {
                    Webiny.Router.goToRoute('NotificationManager.Notifications');
                }
            },
            onCancel: () => Webiny.Router.goToRoute('NotificationManager.Notifications')
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
            <Ui.Form ui="notificationForm" {...formProps}>
                {(model, form) => (
                    <Ui.View.Form>
                        <Ui.View.Header title="Notification"/>

                        <Ui.View.Body noPadding={true}>
                            <PreviewModal ui="previewModal" model={model}/>
                            <Ui.Tabs size="large">
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
                                <Ui.Tabs.Tab label="Variables" icon="icon-menu">
                                    <Ui.Alert title="About">
                                        This is a list of variables that you can use in your notification content.
                                        The list also defines the data source from where the variable value will be pulled.
                                    </Ui.Alert>
                                    <Ui.Alert title="Important" type="warning">
                                        Changes you make to the variables are not saved until you save the notification!
                                    </Ui.Alert>
                                    <Ui.Dynamic.Fieldset name="variables" ui="fieldset">
                                        <Ui.Dynamic.Header>
                                            {() => (
                                                <Ui.Grid.Row>
                                                    <Ui.Grid.Col all={2}><Ui.Form.Fieldset title="Variable name"/></Ui.Grid.Col>
                                                    <Ui.Grid.Col all={4}><Ui.Form.Fieldset
                                                        title="Entity (leave blank for custom variables)"/></Ui.Grid.Col>
                                                    <Ui.Grid.Col all={3}><Ui.Form.Fieldset title="Description"/></Ui.Grid.Col>
                                                    <Ui.Grid.Col all={3}></Ui.Grid.Col>
                                                </Ui.Grid.Row>
                                            )}
                                        </Ui.Dynamic.Header>
                                        <Ui.Dynamic.Row>
                                            {(record, actions) => {
                                                return (
                                                    <Ui.Grid.Row>
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
                                                                <Ui.Button type="primary" label="Add" onClick={actions.add(record)}/>
                                                                <Ui.Button type="secondary" label="x" onClick={actions.remove(record)}/>
                                                            </div>
                                                        </Ui.Grid.Col>
                                                    </Ui.Grid.Row>
                                                );
                                            }}
                                        </Ui.Dynamic.Row>
                                        <Ui.Dynamic.Empty>
                                            {(actions) => {
                                                return (
                                                    <Ui.Grid.Row>
                                                        <Ui.Grid.Col all={12}>
                                                            <h5>You have not defined any variables yet. Click "Add variable" to define your
                                                                first variable!</h5>
                                                            <Ui.Button type="primary" label="Add variable" onClick={actions.add()}/>
                                                        </Ui.Grid.Col>
                                                    </Ui.Grid.Row>
                                                );
                                            }}
                                        </Ui.Dynamic.Empty>
                                    </Ui.Dynamic.Fieldset>
                                </Ui.Tabs.Tab>
                                {this.renderNotificationTabs(model, form)}
                            </Ui.Tabs>
                        </Ui.View.Body>
                        <Ui.View.Footer>
                            <Ui.Button align="right" type="primary" onClick={form.submit}>Save Changes</Ui.Button>
                            <Ui.Button align="right" type="secondary" onClick={this.saveAndPreview}>Save &amp; Send Preview</Ui.Button>
                            <Ui.Button align="left" type="default" onClick={form.cancel}>Go Back</Ui.Button>
                        </Ui.View.Footer>
                    </Ui.View.Form>
                )}
            </Ui.Form>
        );
    }
};


export default NotificationForm;
