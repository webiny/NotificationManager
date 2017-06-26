import Webiny from 'Webiny';
import Editor from './Editor';

export default () => {
    return Webiny.import(['Tabs', 'Section', 'Checkbox', 'Logic', 'Grid', 'Input', 'Select']).then(Ui => {
        return (model, form) => {
            const templateSelect = {
                api: '/entities/notification-manager/templates',
                fields: 'name',
                label: 'Template',
                placeholder: 'Select template',
                allowClear: true
            };

            return (
                <Ui.Tabs.Tab label="Email content" icon="fa-envelope">
                    <Ui.Grid.Row>
                        <Ui.Grid.Col all={12}>
                            <Ui.Section title={form.bindTo(<Ui.Checkbox name="handlers.email.send" label="Send email"/>)}/>
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
                                        <Ui.Select
                                            {...templateSelect}
                                            validate="required"
                                            name="handlers.email.template"/>
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
                        </Ui.Grid.Col>
                    </Ui.Grid.Row>
                </Ui.Tabs.Tab>
            );
        }
    });
};