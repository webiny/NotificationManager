import Webiny from 'Webiny';

export default (model, form) => {
    return {
        label: 'Slack message',
        icon: 'fa-slack',
        children: (
            <Webiny.Ui.LazyLoad modules={['Grid', 'Section', 'Logic', 'Input', 'MarkdownEditor', 'Checkbox', 'DelayedOnChange']}>
                {(Ui) => (
                    <Ui.Grid.Row>
                        <Ui.Grid.Col all={12}>
                            <Ui.Section
                                title={<Ui.Checkbox {...form.bindTo('handlers.slack.send')} label="Send Slack message" grid={12}/>}/>
                            <Ui.Logic.Hide if={!_.get(model, 'handlers.slack.send')}>
                                <Ui.Input
                                    label="Channel/User"
                                    {...form.bindTo('handlers.slack.channel')}
                                    validate="required"
                                    description="Specify a channel or username: #general or @mark"/>
                                <Ui.DelayedOnChange>
                                    <Ui.MarkdownEditor
                                        label="Message"
                                        {...form.bindTo('handlers.slack.message')}
                                        validate="required"/>
                                </Ui.DelayedOnChange>
                            </Ui.Logic.Hide>
                        </Ui.Grid.Col>
                    </Ui.Grid.Row>
                )}
            </Webiny.Ui.LazyLoad>
        )
    };
};