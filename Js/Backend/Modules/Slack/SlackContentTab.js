import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

export default (model, form) => {
    return (
        <Ui.Tabs.Tab label="Slack message" icon="fa-slack">
            <Ui.Grid.Row>
                <Ui.Grid.Col all={12}>
                    <Ui.Form.Fieldset title={<Ui.Checkbox {...form.bindTo('handlers.slack.send')} label="Send Slack message" grid={12}/>}/>
                    <Ui.Hide if={!_.get(model, 'handlers.slack.send')}>
                        <Ui.Input
                            label="Channel/User"
                            name="handlers.slack.channel"
                            validate="required"
                            description="Specify a channel or username: #general or @mark"
                            />
                        <Ui.MarkdownEditor label="Message" name="handlers.slack.message" validate="required"/>
                    </Ui.Hide>
                </Ui.Grid.Col>
            </Ui.Grid.Row>
        </Ui.Tabs.Tab>
    );
};