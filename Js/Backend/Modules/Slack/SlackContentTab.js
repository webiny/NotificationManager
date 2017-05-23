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
                            <Ui.Section title={form.bindTo(<Ui.Checkbox name="handlers.slack.send" label="Send Slack message" grid={12}/>)}/>
                            <Ui.Logic.Hide if={!_.get(model, 'handlers.slack.send')}>
                                {form.bindTo(
                                    <Ui.Input
                                        label="Channel/User"
                                        name="handlers.slack.channel"
                                        validate="required"
                                        description="Specify a channel or username: #general or @mark"/>
                                )}
                                <Ui.DelayedOnChange>
                                    {form.bindTo(<Ui.MarkdownEditor label="Message" name="handlers.slack.message" validate="required"/>)}
                                </Ui.DelayedOnChange>
                            </Ui.Logic.Hide>
                        </Ui.Grid.Col>
                    </Ui.Grid.Row>
                )}
            </Webiny.Ui.LazyLoad>
        )
    };
};