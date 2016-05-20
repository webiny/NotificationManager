import Webiny from 'Webiny';
import VariableList from './NotificationForm/VariableList';
import SettingsForm from './NotificationForm/SettingsForm';
import EmailForm from './NotificationForm/EmailForm';
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

        return (

            <Ui.Form.ApiContainer ui="notificationForm" {...formProps}>

                <Ui.Panel.Panel>
                    <Ui.Panel.Header>
                        <Ui.Grid.Row>
                            <Ui.Grid.Col all={10}>
                                Notification
                            </Ui.Grid.Col>
                            <Ui.Grid.Col all={2}>
                                <Ui.Button type="primary" align="right" onClick={this.ui('notificationForm:submit')}>Save Changes</Ui.Button>
                                <Ui.Button type="default" align="right" onClick={this.ui('notificationForm:cancel')}>Go Back</Ui.Button>
                            </Ui.Grid.Col>
                        </Ui.Grid.Row>

                    </Ui.Panel.Header>
                    <Ui.Panel.Body>

                        <Ui.Tabs.Tabs ui="tabs">

                            <Ui.Tabs.Tab label="General" icon="icon-settings">
                                <SettingsForm layout={false} onInvalid={this.ui('tabs:selectTab', 0)}/>
                            </Ui.Tabs.Tab>

                            <Ui.Tabs.Tab label="Email content" icon="icon-doc-text">
                                <EmailForm layout={false} onInvalid={this.ui('tabs:selectTab', 1)}/>
                            </Ui.Tabs.Tab>

                            <Ui.Tabs.Tab label="Variables" icon="icon-menu">
                                <VariableList/>
                            </Ui.Tabs.Tab>

                        </Ui.Tabs.Tabs>
                    </Ui.Panel.Body>
                </Ui.Panel.Panel>
            </Ui.Form.ApiContainer>
        );
    }
};


export default NotificationForm;
