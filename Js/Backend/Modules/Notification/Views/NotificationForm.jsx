import Webiny from 'Webiny';
import NotificationVariableList from './NotificationForm/NotificationVariableList';
import NotificationVariableModal from './NotificationForm/NotificationVariableModal';
import NotificationSettingsForm from './NotificationForm/NotificationSettingsForm';
const Ui = Webiny.Ui.Components;


class NotificationForm extends Webiny.Ui.View {

}

NotificationForm.defaultProps = {
    renderer() {
        const formProps = {
            api: '/entities/notification-manager/notifications',
            fields: '*',
            connectToRouter: true,
            onSubmitSuccess: 'NotificationManager.Notifications',
            onCancel: () => Webiny.Router.goToRoute('NotificationManager.Notifications'),
            onChangeName: (val, input) => {
                console.log(input);
            }
        };


        return (

            <Ui.Form.ApiContainer ui="myForm" {...formProps}>

                <Ui.Panel.Panel>
                    <Ui.Panel.Header title="Notification"/>
                    <Ui.Panel.Body>

                        <Ui.Tabs.Tabs ui="tabs">

                            <Ui.Tabs.Tab label="General" icon="icon-settings">
                                <NotificationSettingsForm/>
                            </Ui.Tabs.Tab>

                            <Ui.Tabs.Tab label="Email content" icon="icon-doc-text">
                                <Ui.Form.Form layout={false}>
                                    <fields>
                                        <Ui.Grid.Row>
                                            <Ui.Grid.Col all={6}>

                                                <Ui.Form.Fieldset title="About"/>

                                                <Ui.Input label="Name" name="name" validate="required" />


                                            </Ui.Grid.Col>

                                        </Ui.Grid.Row>

                                    </fields>

                                    <actions>
                                        <Ui.Button type="default" onClick={this.ui('myForm:cancel')} label="Cancel"/>
                                        <Ui.Button type="secondary" onClick={this.ui('myForm:reset')} label="Reset"/>
                                        <Ui.Button type="primary" onClick={this.ui('myForm:submit')} label="Submit"/>
                                    </actions>

                                </Ui.Form.Form>

                            </Ui.Tabs.Tab>

                            <Ui.Tabs.Tab label="Variables" icon="icon-menu">
                                <Ui.Alert title="About">
                                    This is a list of variables that you can use in your notification content.
                                    The list also defines the data source from where the variable value will be pulled.
                                </Ui.Alert>

                                <h2>
                                    <Ui.Grid.Row>
                                        <Ui.Grid.Col all={10}>
                                            Variables
                                        </Ui.Grid.Col>
                                        <Ui.Grid.Col all={2}>
                                            <Ui.Button type="primary" align="right" onClick={this.ui('notificationVariableModal:show')}>Create new Variable</Ui.Button>
                                            <NotificationVariableModal ui="notificationVariableModal"/>
                                        </Ui.Grid.Col>
                                    </Ui.Grid.Row>
                                </h2>

                                <NotificationVariableList/>

                            </Ui.Tabs.Tab>

                        </Ui.Tabs.Tabs>

                    </Ui.Panel.Body>
                </Ui.Panel.Panel>

            </Ui.Form.ApiContainer>
        );
    }
};


export default NotificationForm;
