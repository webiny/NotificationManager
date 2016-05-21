import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class TemplateForm extends Webiny.Ui.View {

}

TemplateForm.defaultProps = {
    renderer() {
        const formProps = {
            api: '/entities/notification-manager/templates',
            fields: '*',
            connectToRouter: true,
            //onSubmitSuccess: 'NotificationManager.Templates',
            //onCancel: () => Webiny.Router.goToRoute('NotificationManager.Templates')
        };

        return (
            <Ui.Form.Container ui="myForm" {...formProps}>
                {(model, container) => (
                    <Ui.Panel.Panel>
                        <Ui.Panel.Header title="Template"/>
                        <Ui.Panel.Body>
                            <Ui.Grid.Row>
                                <Ui.Grid.Col all={6}>
                                    <Ui.Form.Fieldset title="Template"/>
                                    <Ui.Input label="Name" name="name" validate="required"/>
                                    <Ui.CodeEditor label="Content" name="content"/>
                                </Ui.Grid.Col>
                                <Ui.Grid.Col all={6}>
                                    <Ui.Form.Fieldset title="System Tags"/>
                                </Ui.Grid.Col>
                            </Ui.Grid.Row>
                        </Ui.Panel.Body>
                        <Ui.Panel.Footer className="text-right">
                            <Ui.Button type="default" onClick={container.cancel} label="Cancel"/>
                            <Ui.Button type="secondary" onClick={container.reset} label="Reset"/>
                            <Ui.Button type="primary" onClick={container.submit} label="Submit"/>
                        </Ui.Panel.Footer>
                    </Ui.Panel.Panel>
                )}
            </Ui.Form.Container>
        );
    }
};


export default TemplateForm;
