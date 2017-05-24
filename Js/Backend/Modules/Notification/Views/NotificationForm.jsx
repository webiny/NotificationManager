import Webiny from 'Webiny';
import PreviewModal from './NotificationForm/PreviewModal';
import SendingHistory from './NotificationForm/SendingHistory';

class NotificationForm extends Webiny.Ui.View {
    constructor(props) {
        super(props);

        this.preview = false;
        this.bindMethods('saveAndPreview');
    }

    registerTabs(model, form) {
        const {Tabs} = this.props;
        const tabs = Webiny.Injector.getByTag('NotificationManager.NotificationForm.Tab');
        return tabs.map(tab => {
            const tabProps = _.assign({key: tab.name}, tab.value(model, form));
            return <Tabs.Tab {...tabProps}/>
        });
    }

    saveAndPreview(model, form) {
        if (_.isEqual(model, form.getInitialModel())) {
            return this.ui('previewModal').show();
        }

        this.preview = true;
        return form.submit().then(() => {
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
            api: '/services/webiny/entities',
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

        const {Form, View, Tabs, Grid, Section, Input, Textarea, Tags, Alert, Dynamic, Select, Button} = this.props;

        return (
            <Form ui="notificationForm" {...formProps}>
                {(model, form) => (
                    <View.Form>
                        <View.Header title="Notification"/>

                        <View.Body noPadding={true}>
                            <PreviewModal ui="previewModal" model={model} form={form}/>
                            <Tabs size="large">
                                <Tabs.Tab label="General" icon="icon-settings">
                                    <Grid.Row>
                                        <Grid.Col all={6}>
                                            <Section title="Notification Settings"/>

                                            <Input label="Title" name="title" validate="required"/>
                                            <Input label="Slug" name="slug"/>
                                            <Textarea label="Description" name="description"/>
                                            <Tags label="Labels" name="labels" placeholder="Add Label"/>
                                        </Grid.Col>
                                        <Grid.Col all={6}>
                                            <Section title="Sending History"/>
                                            <SendingHistory/>
                                        </Grid.Col>
                                    </Grid.Row>
                                </Tabs.Tab>
                                <Tabs.Tab label="Variables" icon="icon-menu">
                                    <Alert title="About">
                                        This is a list of variables that you can use in your notification content.
                                        The list also defines the data source from where the variable value will be pulled.
                                    </Alert>
                                    <Alert title="Important" type="warning">
                                        Changes you make to the variables are not saved until you save the notification!
                                    </Alert>
                                    <Dynamic.Fieldset name="variables" ui="fieldset">
                                        <Dynamic.Header>
                                            {() => (
                                                <Grid.Row>
                                                    <Grid.Col all={2}><Section title="Variable name"/></Grid.Col>
                                                    <Grid.Col all={4}><Section
                                                        title="Entity (leave blank for custom variables)"/></Grid.Col>
                                                    <Grid.Col all={3}><Section title="Description"/></Grid.Col>
                                                    <Grid.Col all={3}/>
                                                </Grid.Row>
                                            )}
                                        </Dynamic.Header>
                                        <Dynamic.Row>
                                            {(record, actions) => {
                                                return (
                                                    <Grid.Row>
                                                        <Grid.Col all={2}>
                                                            <Input placeholder="Key" name="key" validate="required"/>
                                                        </Grid.Col>
                                                        <Grid.Col all={4}>
                                                            <Select {...entitySelect} label={null}/>
                                                        </Grid.Col>
                                                        <Grid.Col all={3}>
                                                            <Input placeholder="Description" name="description"/>
                                                        </Grid.Col>
                                                        <Grid.Col all={3}>
                                                            <div className="btn-group">
                                                                <Button type="primary" label="Add"
                                                                        onClick={actions.add(record)}/>
                                                                <Button type="secondary" label="x"
                                                                        onClick={actions.remove(record)}/>
                                                            </div>
                                                        </Grid.Col>
                                                    </Grid.Row>
                                                );
                                            }}
                                        </Dynamic.Row>
                                        <Dynamic.Empty>
                                            {(actions) => {
                                                return (
                                                    <Grid.Row>
                                                        <Grid.Col all={12}>
                                                            <h5>You have not defined any variables yet. Click "Add variable" to
                                                                define your
                                                                first variable!</h5>
                                                            <Button type="primary" label="Add variable" onClick={actions.add()}/>
                                                        </Grid.Col>
                                                    </Grid.Row>
                                                );
                                            }}
                                        </Dynamic.Empty>
                                    </Dynamic.Fieldset>
                                </Tabs.Tab>
                                {this.registerTabs(model, form)}
                            </Tabs>
                        </View.Body>
                        <View.Footer>
                            <Button align="right" type="primary" onClick={form.submit}>Save Changes</Button>
                            <Button align="right" type="secondary" onClick={() => this.saveAndPreview(model, form)}>
                                Save &amp; Send Preview
                            </Button>
                            <Button align="left" type="default" onClick={form.cancel}>Go Back</Button>
                        </View.Footer>
                    </View.Form>
                )}
            </Form>
        );
    }
};


export default Webiny.createComponent(NotificationForm, {
    modules: ['Form', 'View', 'Tabs', 'Grid', 'Section', 'Input', 'Textarea', 'Tags', 'Alert', 'Dynamic', 'Select', 'Button']
});
