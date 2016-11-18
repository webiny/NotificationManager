import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

export default () => {
    return (
        <Ui.Tabs.Tab label="Slack" icon="fa-slack">
            <Ui.Grid.Row>
                <Ui.Grid.Col all={12}>
                    <Ui.Input
                        label="Token"
                        name="slack.token"
                        description={<span>Bot token to use when sending notifications. <a target="_blank" href="https://api.slack.com/bot-users">Create your Slack bot here.</a></span>}/>
                    <Ui.Input label="Team" name="slack.team"/>
                    <Ui.Input label="Username" name="slack.username"/>
                </Ui.Grid.Col>
            </Ui.Grid.Row>
        </Ui.Tabs.Tab>
    );
};