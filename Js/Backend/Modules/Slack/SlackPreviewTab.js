import React from 'react';
import _ from 'lodash';
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
                            {form.bindTo(
                                <Ui.Input
                                    label="Token"
                                    name="slack.token"
                                    placeholder="Leave empty to use Slack settings"/>
                            )}
                            {form.bindTo(
                                <Ui.Input
                                    label="Team"
                                    name="slack.team"
                                    placeholder="Leave empty to use Slack settings"/>
                            )}
                            {form.bindTo(
                                <Ui.Input
                                    label="Username"
                                    name="slack.username"
                                    placeholder="Leave empty to use Slack settings"/>
                            )}
                            {form.bindTo(
                                <Ui.Input
                                    label="Channel/User"
                                    name="slack.channel"
                                    placeholder="Leave empty to use Slack message channel"
                                    description="Specify a channel or username: #general or @mark"/>
                            )}
                        </Ui.Grid.Col>
                    </Ui.Grid.Row>
                )}
            </Webiny.Ui.LazyLoad>
        )
    };
};