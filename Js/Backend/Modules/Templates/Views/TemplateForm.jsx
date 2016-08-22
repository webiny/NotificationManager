import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class TemplateForm extends Webiny.Ui.View {

    constructor(props) {
        super(props);

        this.bindMethods('previewTemplate');
    }

    previewTemplate(content) {
        const myWindow = window.open('data:text/html,' + encodeURIComponent(content),
            '_blank', 'width=800,height=600');
        myWindow.focus();
    }
}

TemplateForm.defaultProps = {
    renderer() {
        const formProps = {
            api: '/entities/notification-manager/templates',
            fields: '*',
            connectToRouter: true,
            onSubmitSuccess: () => Webiny.Router.goToRoute('NotificationManager.Templates'),
            onCancel: () => Webiny.Router.goToRoute('NotificationManager.Templates')
        };

        return (
            <Ui.Form.Container ui="templateForm" {...formProps}>
                {(model, container) => (
                    <Ui.View.Form>
                        <Ui.View.Header title="Template"/>

                        <Ui.View.Body>
                            <Ui.Grid.Row>
                                <Ui.Grid.Col all={8}>

                                    <Ui.Form.Fieldset title="Template"/>

                                    <Ui.Input label="Name" name="name" validate="required"/>
                                    <Ui.CodeEditor label="Content" name="content" description="Enter plain text or HTML content"/>

                                </Ui.Grid.Col>

                                <Ui.Grid.Col all={4}>

                                    <Ui.Form.Fieldset title="System Tags"/>

                                    <dl>
                                        <dt>&#123;_hostName_&#125;</dt>
                                        <dd>Website address,&nbsp;
                                            <strong>{window.location.origin}</strong>
                                        </dd>
                                    </dl>

                                    <dl>
                                        <dt>&#123;_content_&#125;</dt>
                                        <dd>Variable containing notification content.</dd>
                                    </dl>

                                    <dl>
                                        <dt>Notification variables</dt>
                                        <dd>Additionally you can include any of the variables that are available inside your
                                            notification, that will be using this template.
                                        </dd>
                                    </dl>

                                </Ui.Grid.Col>

                            </Ui.Grid.Row>
                        </Ui.View.Body>

                        <Ui.View.Footer>
                            <Ui.Button align="right" type="primary" onClick={container.submit}>Save Changes</Ui.Button>
                            <Ui.Button align="right" type="secondary" onClick={() => this.previewTemplate(model.content)}>Preview Template</Ui.Button>
                            <Ui.Button align="left" type="default" onClick={container.cancel}>Go Back</Ui.Button>
                        </Ui.View.Footer>
                    </Ui.View.Form>
                )}
            </Ui.Form.Container>
        );
    }
};


export default TemplateForm;
