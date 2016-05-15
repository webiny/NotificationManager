import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class NotificationSettingsForm extends Webiny.Ui.View {
}

NotificationSettingsForm.defaultProps = {
    renderer() {
        const formProps = {
            api: '/entities/notification-manager/notification',
            fields: '*',
            connectToRouter: true
        };

        return (
            <Ui.Form.ApiContainer ui="notificationSettingsForm" {...formProps}>

                <Ui.Form.Form layout={false}>
                    <fields>

                        <Ui.Grid.Row>
                            <Ui.Grid.Col all={6}>
                                <Ui.Input label="Title" name="title" validate="required" />

                                <Ui.Input label="Slug" name="slug" readOnly={true} />

                                <Ui.Textarea label="Description" name="description"/>

                                <Ui.Button type="primary" align="right" onClick={this.ui('notificationSettingsForm:submit')} label="Submit"/>
                                <Ui.Button type="secondary" align="right" onClick={this.ui('notificationSettingsForm:reset')} label="Reset"/>
                            </Ui.Grid.Col>

                            <Ui.Grid.Col all={6}>
                                @ToDo: Sending history goes here
                            </Ui.Grid.Col>

                        </Ui.Grid.Row>

                    </fields>
                </Ui.Form.Form>

            </Ui.Form.ApiContainer>
        );
    }
};


export default NotificationSettingsForm;
