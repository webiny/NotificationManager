import Webiny from 'Webiny';

export default (model, form) => {
    return {
        label: 'Slack',
        icon: 'fa-slack',
        children: (
            <Webiny.Ui.LazyLoad modules={['Grid', 'Input']}>
                {(Ui) => (
                    <Ui.Grid.Row>
                        <Ui.Grid.Col all={12}>
                            {form.bindTo(
                                <Ui.Input
                                    label="Token"
                                    name="slack.token"
                                    description={
                                        <span>
                                            Bot token to use when sending notifications.&nbsp;
                                            <a target="_blank" href="https://api.slack.com/bot-users">Create your Slack bot here.</a>
                                        </span>
                                    }/>
                            )}
                            {form.bindTo(
                                <Ui.Input label="Team" name="slack.team"/>
                            )}
                            {form.bindTo(
                                <Ui.Input label="Username" name="slack.username"/>
                            )}
                        </Ui.Grid.Col>
                    </Ui.Grid.Row>
                )}
            </Webiny.Ui.LazyLoad>
        )
    };
};