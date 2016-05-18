import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class TemplateForm extends Webiny.Ui.View {

}

TemplateForm.defaultProps = {
    renderer() {
        const formProps = {
            title: 'Template',
            api: '/entities/notification-manager/templates',
            fields: '*',
            connectToRouter: true,
            //onSubmitSuccess: 'NotificationManager.Templates',
            //onCancel: () => Webiny.Router.goToRoute('NotificationManager.Templates')
        };

        return (
            <Ui.Form.ApiContainer ui="myForm" {...formProps}>
                <Ui.Form.Form>
                    <fields>
                        <Ui.Grid.Row>
                            <Ui.Grid.Col all={6}>

                                <Ui.Form.Fieldset title="Template"/>

                                <Ui.Input label="Name" name="name" validate="required"/>
                                <Ui.CodeEditor label="Content" name="content" />

                            </Ui.Grid.Col>

                            <Ui.Grid.Col all={6}>

                                <Ui.Form.Fieldset title="System Tags"/>

                            </Ui.Grid.Col>

                            </Ui.Grid.Row>

                    </fields>

                    <actions>
                        <Ui.Button type="default" onClick={this.ui('myForm:cancel')} label="Cancel"/>
                        <Ui.Button type="secondary" onClick={this.ui('myForm:reset')} label="Reset"/>
                        <Ui.Button type="primary" onClick={this.ui('myForm:submit')} label="Submit"/>
                    </actions>

                </Ui.Form.Form>

            </Ui.Form.ApiContainer>
        );
    }
};


export default TemplateForm;
