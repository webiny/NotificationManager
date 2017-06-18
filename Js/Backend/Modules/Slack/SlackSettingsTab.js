import Webiny from 'Webiny';

export default () => Webiny.import(['Tabs', 'Grid', 'Input']).then(Ui => {
    return (model, form) => {
        return (
            <Ui.Tabs.Tab label="Slack" icon="fa-slack">
                <Ui.Grid.Row>
                    <Ui.Grid.Col all={12}>
                        <Ui.Input
                            label="Token"
                            name="slack.token"
                            description={
                                <span>
                                Bot token to use when sending notifications.&nbsp;
                                    <a target="_blank" href="https://api.slack.com/bot-users">Create your Slack bot here.</a>
                            </span>
                            }/>
                        <Ui.Input label="Team" name="slack.team"/>
                        <Ui.Input label="Username" name="slack.username"/>
                    </Ui.Grid.Col>
                </Ui.Grid.Row>
            </Ui.Tabs.Tab>
        );
    };
});