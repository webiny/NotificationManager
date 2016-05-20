import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class EmailForm extends Ui.Form.Form {
    renderFields() {

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
            <fields>

                <Ui.Grid.Row>
                    <Ui.Grid.Col all={6}>
                        <Ui.Input label="Subject" name="email.subject" validate="required" />

                        <Ui.Input label="From Address" name="email.fromAddress" validate="required, email" />

                        <Ui.Input label="From Name" name="email.fromName" validate="required" />

                        <Ui.Select {...templateSelect} validate="required" />

                    </Ui.Grid.Col>

                    <Ui.Grid.Col all={6}>
                        <Ui.HtmlEditor label="Content" name="email.content"/>
                    </Ui.Grid.Col>

                </Ui.Grid.Row>

            </fields>
        );
    }
}


export default EmailForm;
