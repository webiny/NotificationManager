import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class SettingsForm extends Ui.Form.Form {
    renderFields() {
        return (
            <fields>

                <Ui.Grid.Row>
                    <Ui.Grid.Col all={6}>
                        <Ui.Input label="Title" name="title" validate="required" />

                        <Ui.Input label="Slug" name="slug" readOnly={true} />

                        <Ui.Textarea label="Description" name="description"/>

                        <Ui.Textarea label="Labels" name="labels"/>
                    </Ui.Grid.Col>

                    <Ui.Grid.Col all={6}>
                        @ToDo: Sending history goes here
                    </Ui.Grid.Col>

                </Ui.Grid.Row>

            </fields>

        );
    }
}

export default SettingsForm;
