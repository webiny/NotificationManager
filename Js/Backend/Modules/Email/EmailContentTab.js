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
                            <Ui.Section title={<Ui.Checkbox {...form.bindTo('handlers.email.send')} label="Send email" grid={12}/>}/>
                            <Ui.Logic.Hide if={!_.get(model, 'handlers.email.send')}>
                                <Ui.Grid.Row>
                                    <Ui.Grid.Col all={4}>
                                        <Ui.Input
                                            label="Subject"
                                            {...form.bindTo('handlers.email.subject')}
                                            validate="required"/>
                                        <Ui.Input
                                            label="From Address"
                                            {...form.bindTo('handlers.email.fromAddress')}
                                            validate="email"
                                            placeholder="Leave blank to use the default sender"/>
                                        <Ui.Input
                                            label="From Name"
                                            {...form.bindTo('handlers.email.fromName')}
                                            placeholder="Leave blank to use the default sender"/>
                                        <Ui.Select {...templateSelect} validate="required" {...form.bindTo('handlers.email.template')}/>
                                    </Ui.Grid.Col>
                                    <Ui.Grid.Col all={8}>
                                        <Editor
                                            variables={model.variables}
                                            label="Content"
                                            {...form.bindTo('handlers.email.content')}
                                            description="You can use Smarty syntax for your email content."/>
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