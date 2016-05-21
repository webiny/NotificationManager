import Webiny from 'Webiny';
import VariableList from './NotificationForm/VariableList';
const Ui = Webiny.Ui.Components;


class NotificationForm extends Webiny.Ui.View {

}

NotificationForm.defaultProps = {
    renderer() {
        const formProps = {
            api: '/entities/notification-manager/notifications',
            fields: '*,template',
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

        return (
            <Ui.Form.Container ui="notificationForm" {...formProps}>
                {(model, container) => (
                    <Ui.Panel.Panel>
                        <Ui.Panel.Header>
                            <Ui.Grid.Row>
                                <Ui.Grid.Col all={10}>
                                    Notification
                                </Ui.Grid.Col>
                                <Ui.Grid.Col all={2}>
                                    <Ui.Button type="primary" align="right" onClick={container.submit}>Save Changes</Ui.Button>
                                    <Ui.Button type="default" align="right" onClick={container.cancel}>Go Back</Ui.Button>
                                </Ui.Grid.Col>
                            </Ui.Grid.Row>

                        </Ui.Panel.Header>
                        <Ui.Panel.Body>
                            <Ui.Tabs.Tabs>
                                <Ui.Tabs.Tab label="General" icon="icon-settings">
                                    <Ui.Grid.Row>
                                        <Ui.Grid.Col all={6}>
                                            <Ui.Input label="Title" name="title" validate="required" />
                                            <Ui.Input label="Slug" name="slug" readOnly={true} />
                                            <Ui.Textarea label="Description" name="description"/>
                                            <Ui.Tags label="Labels" name="labels" placeholder="Add Label" />
                                        </Ui.Grid.Col>
                                        <Ui.Grid.Col all={6}>
                                            @ToDo: Sending history goes here
                                        </Ui.Grid.Col>
                                    </Ui.Grid.Row>
                                </Ui.Tabs.Tab>
                                <Ui.Tabs.Tab label="Email content" icon="icon-doc-text">
                                    <Ui.Grid.Row>
                                        <Ui.Grid.Col all={6}>
                                            <Ui.Input label="Subject" name="email.subject" validate="required"/>
                                            <Ui.Input label="From Address" name="email.fromAddress" validate="required, email"/>
                                            <Ui.Input label="From Name" name="email.fromName" validate="required"/>
                                            <Ui.Select {...templateSelect} validate="required"/>
                                        </Ui.Grid.Col>
                                        <Ui.Grid.Col all={6}>
                                            <Ui.HtmlEditor label="Content" name="email.content"/>
                                        </Ui.Grid.Col>
                                    </Ui.Grid.Row>
                                </Ui.Tabs.Tab>
                                <Ui.Tabs.Tab label="Variables" icon="icon-menu">
                                    <VariableList/>
                                </Ui.Tabs.Tab>
                            </Ui.Tabs.Tabs>
                        </Ui.Panel.Body>
                    </Ui.Panel.Panel>
                )}
            </Ui.Form.Container>
        );
    }
};


export default NotificationForm;
