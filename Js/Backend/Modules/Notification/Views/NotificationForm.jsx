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
                    <Ui.Panel.Header>

                            <Ui.Grid.Row>
                                <Ui.Grid.Col all={10}>
                                    Notification
                                </Ui.Grid.Col>
                                <Ui.Grid.Col all={2}>
                                    <Ui.Button type="primary" align="right" onClick={this.ui('notificationVariableModal:show')}>Save Changes</Ui.Button>
                                    <Ui.Button type="default" align="right" onClick={this.ui('notificationVariableModal:show')}>Go Back</Ui.Button>
                                </Ui.Grid.Col>
                            </Ui.Grid.Row>

                    </Ui.Panel.Header>
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
