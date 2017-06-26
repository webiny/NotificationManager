import Webiny from 'Webiny';

const modules = ['Tabs', 'Grid', 'Section', 'Logic', 'Input', 'MarkdownEditor', 'Checkbox', 'DelayedOnChange'];

export default () => Webiny.import(modules).then(Ui => {
    return (model, form) => {
        return (
            <Ui.Tabs.Tab label="Slack message" icon="fa-slack">
                <Ui.Grid.Row>
                    <Ui.Grid.Col all={12}>
                        <Ui.Section
                            title={form.bindTo(<Ui.Checkbox name="handlers.slack.send" label="Send Slack message"/>)}/>
                        <Ui.Logic.Hide if={!_.get(model, 'handlers.slack.send')}>
                            <Ui.Input
                                label="Channel/User"
                                name="handlers.slack.channel"
                                validate="required"
                                description="Specify a channel or username: #general or @mark"/>
                            <Ui.DelayedOnChange><Ui.MarkdownEditor label="Message" name="handlers.slack.message" validate="required"/></Ui.DelayedOnChange>
                        </Ui.Logic.Hide>
                    </Ui.Grid.Col>
                </Ui.Grid.Row>
            </Ui.Tabs.Tab>
        );
    };
});