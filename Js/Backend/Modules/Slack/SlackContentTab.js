import React from 'react';
import _ from 'lodash';
import Webiny from 'webiny';

const modules = ['Tabs', 'Grid', 'Section', 'Logic', 'Input', 'Textarea', 'Checkbox'];

/**
 * @i18n.namespace NotificationManager.Backend.Slack.SlackContentTab
 */
export default () => Webiny.import(modules).then(Ui => {
    const slackMessages = 'https://api.slack.com/docs/messages';

    return (model, form) => {
        return (
            <Ui.Tabs.Tab label={Webiny.I18n('Slack message')} icon="fa-slack">
                <Ui.Grid.Row>
                    <Ui.Grid.Col all={12}>
                        <Ui.Section
                            title={form.bindTo(<Ui.Checkbox name="handlers.slack.send" label={Webiny.I18n('Send Slack message')}/>)}/>
                        <Ui.Logic.Hide if={!_.get(model, 'handlers.slack.send')}>
                            <Ui.Input
                                label={Webiny.I18n('Channel/User')}
                                name="handlers.slack.channel"
                                validate="required"
                                description={Webiny.I18n('Specify a channel or username: #general or @mark')}/>
                            <Ui.Textarea
                                label={Webiny.I18n('Message')}
                                name="handlers.slack.message"
                                validate="required"
                                description={(
                                    <span>
                                        {Webiny.I18n('Read about {link} and how to compose them', {
                                            link: <a href={slackMessages} target="_blank">Slack messages</a>
                                        })}
                                    </span>
                                )}/>
                        </Ui.Logic.Hide>
                    </Ui.Grid.Col>
                </Ui.Grid.Row>
            </Ui.Tabs.Tab>
        );
    };
});