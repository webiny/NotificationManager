import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class EmailForm extends Ui.Form.Form {
    renderFields() {
        return (
            <fields>

                <Ui.Grid.Row>
                    <Ui.Grid.Col all={6}>
                        <Ui.Input label="Subject" name="email.subject" validate="required" />

                        <Ui.Input label="From Address" name="email.fromAddress" validate="required, email" />

                        <Ui.Input label="From Name" name="email.fromName" validate="required" />

                    </Ui.Grid.Col>

                    <Ui.Grid.Col all={6}>
                        <Ui.Textarea label="Content" name="email.content"/>
                    </Ui.Grid.Col>

                </Ui.Grid.Row>

            </fields>
        );
    }
}


export default EmailForm;
