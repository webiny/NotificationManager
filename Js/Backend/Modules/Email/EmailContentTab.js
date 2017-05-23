import Webiny from 'Webiny';
import Editor from './Editor';

export default (model, form) => {
    const templateSelect = {
        ui: 'templateSelect',
        api: '/entities/notification-manager/templates',
        fields: 'name',
        label: 'Template',
        placeholder: 'Select template',
        allowClear: true
    };

    return {
        label: 'Email content',
        icon: 'fa-envelope',
        children: (
            <Webiny.Ui.LazyLoad modules={['Section', 'Checkbox', 'Logic', 'Grid', 'Input', 'Select']}>
                {(Ui) => (
                    <Ui.Grid.Row>
                        <Ui.Grid.Col all={12}>
                            <Ui.Section title={form.bindTo(<Ui.Checkbox name="handlers.email.send" label="Send email" grid={12}/>)}/>
                            <Ui.Logic.Hide if={!_.get(model, 'handlers.email.send')}>
                                <Ui.Grid.Row>
                                    <Ui.Grid.Col all={4}>
                                        {form.bindTo(
                                            <Ui.Input
                                                label="Subject"
                                                name="handlers.email.subject"
                                                validate="required"/>
                                        )}
                                        {form.bindTo(
                                            <Ui.Input
                                                label="From Address"
                                                name="handlers.email.fromAddress"
                                                validate="email"
                                                placeholder="Leave blank to use the default sender"/>
                                        )}
                                        {form.bindTo(
                                            <Ui.Input
                                                label="From Name"
                                                name="handlers.email.fromName"
                                                placeholder="Leave blank to use the default sender"/>
                                        )}
                                        {form.bindTo(
                                            <Ui.Select
                                                {...templateSelect}
                                                validate="required"
                                                name="handlers.email.template"/>
                                        )}
                                    </Ui.Grid.Col>
                                    <Ui.Grid.Col all={8}>
                                        {form.bindTo(
                                            <Editor
                                                variables={model.variables}
                                                label="Content"
                                                name="handlers.email.content"
                                                description="You can use Smarty syntax for your email content."/>
                                        )}
                                    </Ui.Grid.Col>
                                </Ui.Grid.Row>
                            </Ui.Logic.Hide>
                        </Ui.Grid.Col>
                    </Ui.Grid.Row>
                )}
            </Webiny.Ui.LazyLoad>
        )
    };
};