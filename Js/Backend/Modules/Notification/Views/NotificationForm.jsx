import React from 'react';
import _ from 'lodash';
import Webiny from 'webiny';
import PreviewModal from './NotificationForm/PreviewModal';

/**
 * @i18n.namespace NotificationManager.Backend.Notification.PreviewModal
 */
class NotificationForm extends Webiny.Ui.View {
    constructor(props) {
        super(props);

        this.state = {
            tabs: [],
            entityOptions: []
        };
        this.preview = false;
        this.bindMethods('saveAndPreview');
    }

    componentDidMount() {
        super.componentDidMount();
        new Webiny.Api.Endpoint('/services/webiny/entities').get('/', {_fields: 'class,name'}).then(apiResponse => {
            this.setState({entityOptions: apiResponse.getData()});
        });
    }

    registerTabs(model, form) {
        return this.props.plugins.map((pl, index) => {
            const tab = pl(model, form);
            return React.cloneElement(tab, {key: index});
        });
    }

    saveAndPreview(model, form) {
        if (_.isEqual(model, form.getInitialModel())) {
            return this.previewModal.show();
        }

        this.preview = true;
        return form.submit().then(() => {
            this.preview = false;
            this.previewModal.show();
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
            valueAttr: 'class',
            minimumResultsForSearch: 5,
            options: this.state.entityOptions,
            optionRenderer: ({option}) => {
                return (
                    <div>
                        <strong>{option.data.name}</strong>
                        <br/>
                        <span>{option.data.class}</span>
                    </div>
                );
            },
            selectedRenderer: ({option}) => {
                return option.data.name;
            }
        };

        const {Form, View, Tabs, Grid, Section, Input, Textarea, Tags, Alert, Dynamic, Select, Button, ButtonGroup} = this.props;

        return (
            <Form {...formProps}>
                {({model, form}) => (
                    <View.Form>
                        <View.Header title={this.i18n('Notification')}/>
                        <View.Body noPadding={true}>
                            <PreviewModal ref={ref => this.previewModal = ref} model={model} form={form}/>
                            <Tabs size="large">
                                <Tabs.Tab label={this.i18n('General')} icon="icon-settings">
                                    <Grid.Row>
                                        <Grid.Col all={12}>
                                            <Section title={this.i18n('Notification Settings')}/>
                                            <Input label={this.i18n('Title')} name="title" validate="required"/>
                                            <Input label={this.i18n('Slug')} name="slug"/>
                                            <Textarea label={this.i18n('Description')} name="description"/>
                                            <Tags label={this.i18n('Labels')} name="labels" placeholder={this.i18n('Add Label')}/>
                                        </Grid.Col>
                                    </Grid.Row>
                                </Tabs.Tab>
                                <Tabs.Tab label={this.i18n('Variables')} icon="icon-menu">
                                    <Alert title={this.i18n('About')}>
                                        This is a list of variables that you can use in your notification content.
                                        The list also defines the data source from where the variable value will be pulled.
                                    </Alert>
                                    <Alert title={this.i18n('Important')} type="warning">
                                        Changes you make to the variables are not saved until you save the notification!
                                    </Alert>
                                    <Dynamic.Fieldset name="variables">
                                        <Dynamic.Header>
                                            {() => (
                                                <Grid.Row>
                                                    <Grid.Col all={2}><Section title={this.i18n('Variable name')}/></Grid.Col>
                                                    <Grid.Col all={4}><Section
                                                        title={this.i18n('Entity (leave blank for custom variables)')}/></Grid.Col>
                                                    <Grid.Col all={3}><Section title={this.i18n('Description')}/></Grid.Col>
                                                    <Grid.Col all={3}/>
                                                </Grid.Row>
                                            )}
                                        </Dynamic.Header>
                                        <Dynamic.Row>
                                            {({data, actions}) => {
                                                return (
                                                    <Grid.Row>
                                                        <Grid.Col all={2}>
                                                            <Input placeholder={this.i18n('Key')} name="key" validate="required"/>
                                                        </Grid.Col>
                                                        <Grid.Col all={4}>
                                                            <Select {...entitySelect} label={null}/>
                                                        </Grid.Col>
                                                        <Grid.Col all={3}>
                                                            <Input placeholder={this.i18n('Description')} name="description"/>
                                                        </Grid.Col>
                                                        <Grid.Col all={3}>
                                                            <ButtonGroup>
                                                                <Button type="primary" label={this.i18n('Add')}  onClick={actions.add(data)}/>
                                                                <Button type="secondary" label={this.i18n('x')} onClick={actions.remove(data)}/>
                                                            </ButtonGroup>
                                                        </Grid.Col>
                                                    </Grid.Row>
                                                );
                                            }}
                                        </Dynamic.Row>
                                        <Dynamic.Empty>
                                            {({actions}) => {
                                                return (
                                                    <Grid.Row>
                                                        <Grid.Col all={12}>
                                                            <h5>You have not defined any variables yet. Click "Add variable" to
                                                                define your
                                                                first variable!</h5>
                                                            <Button type="primary" label={this.i18n('Add variable')} onClick={actions.add()}/>
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
    modules: [
        'Form', 'View', 'Tabs', 'Grid', 'Section', 'Input', 'Textarea', 'Tags', 'Alert', 'Dynamic', 'Select', 'Button', 'ButtonGroup',
        {
            plugins: () => {
                return Webiny.importByTag('NotificationManager.NotificationForm.Tab').then(modules => {
                    const promises = Object.values(modules).map(tab => tab());
                    return Promise.all(promises);
                });
            }
        }
    ]
});
