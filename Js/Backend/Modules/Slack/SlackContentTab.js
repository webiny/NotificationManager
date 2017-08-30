import React from 'react';
import _ from 'lodash';
import Webiny from 'webiny';

const modules = ['Tabs', 'Grid', 'Section', 'Logic', 'Input', 'Textarea', 'Checkbox'];

export default () => Webiny.import(modules).then(Ui => {
    const slackMessages = 'https://api.slack.com/docs/messages';

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
                                <Ui.Textarea
                                    label="Message"
                                    name="handlers.slack.message"
                                    validate="required"
                                    description={<span>Read about <a href={slackMessages} target="_blank">Slack messages</a> and how to compose them</span>}/>
                        </Ui.Logic.Hide>
                    </Ui.Grid.Col>
                </Ui.Grid.Row>
            </Ui.Tabs.Tab>
        );
    };
});