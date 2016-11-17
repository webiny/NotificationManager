import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
import Editor from './Editor';

export default (model, form) => {
    const templateSelect = {
        ui: 'templateSelect',
        api: '/entities/notification-manager/templates',
        fields: 'name',
        label: 'Template',
        name: 'handlers.email.template',
        placeholder: 'Select template',
        allowClear: true
    };

    return (
        <Ui.Tabs.Tab label="Email content" icon="fa-envelope">
            <Ui.Form.Fieldset title={<Ui.Checkbox {...form.bindTo('handlers.email.send')} label="Send email" grid={12}/>}/>
            <Ui.Logic.Hide if={!_.get(model, 'handlers.email.send')}>
                <Ui.Grid.Row>
                    <Ui.Grid.Col all={4}>
                        <Ui.Input
                            label="Subject"
                            name="handlers.email.subject"
                            validate="required"/>
                        <Ui.Input
                            label="From Address"
                            name="handlers.email.fromAddress"
                            validate="email"
                            placeholder="Leave blank to use the default sender"/>
                        <Ui.Input
                            label="From Name"
                            name="handlers.email.fromName"
                            placeholder="Leave blank to use the default sender"/>
                        <Ui.Select {...templateSelect} validate="required"/>
                    </Ui.Grid.Col>
                    <Ui.Grid.Col all={8}>
                        <Editor
                            variables={model.variables}
                            label="Content"
                            name="handlers.email.content"
                            description="You can use Smarty syntax for your email content."/>
                    </Ui.Grid.Col>
                </Ui.Grid.Row>
            </Ui.Logic.Hide>
        </Ui.Tabs.Tab>
    );
};