import Webiny from 'Webiny';

export default (model, form) => {
    if (!_.get(model, 'handlers.slack.send')) {
        return null;
    }

    return {
        label: 'Slack message',
        icon: 'fa-slack',
        children: (
            <Webiny.Ui.LazyLoad modules={['Grid', 'Input']}>
                {(Ui) => (
                    <Ui.Grid.Row>
                        <Ui.Grid.Col all={12}>
                            <Ui.Input
                                label="Token"
                                {...form.bindTo('slack.token')}
                                placeholder="Leave empty to use Slack settings"/>
                            <Ui.Input
                                label="Team"
                                {...form.bindTo('slack.team')}
                                placeholder="Leave empty to use Slack settings"/>
                            <Ui.Input
                                label="Username"
                                {...form.bindTo('slack.username')}
                                placeholder="Leave empty to use Slack settings"/>
                            <Ui.Input
                                label="Channel/User"
                                {...form.bindTo('slack.channel')}
                                placeholder="Leave empty to use Slack message channel"
                                description="Specify a channel or username: #general or @mark"/>
                        </Ui.Grid.Col>
                    </Ui.Grid.Row>
                )}
            </Webiny.Ui.LazyLoad>
        )
    };
};