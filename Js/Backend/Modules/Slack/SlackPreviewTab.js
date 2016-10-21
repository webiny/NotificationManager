import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

export default (model) => {
    if (!_.get(model, 'handlers.slack.send')) {
        return null;
    }

    return (
        <Ui.Tabs.Tab label="Slack message" icon="fa-slack">
            <Ui.Grid.Row>
                <Ui.Grid.Col all={12}>
                    <Ui.Input
                        label="Token"
                        name="slack.token"
                        placeholder="Leave empty to use Slack settings"/>
                    <Ui.Input
                        label="Team"
                        name="slack.team"
                        placeholder="Leave empty to use Slack settings"/>
                    <Ui.Input
                        label="Username"
                        name="slack.username"
                        placeholder="Leave empty to use Slack settings"/>
                    <Ui.Input
                        label="Channel/User"
                        name="slack.channel"
                        placeholder="Leave empty to use Slack message channel"
                        description="Specify a channel or username: #general or @mark"/>
                </Ui.Grid.Col>
            </Ui.Grid.Row>
        </Ui.Tabs.Tab>
    );
};