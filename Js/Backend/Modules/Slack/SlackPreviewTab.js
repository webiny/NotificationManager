import React from 'react';
import _ from 'lodash';
import Webiny from 'webiny';

/**
 * @i18n.namespace NotificationManager.Backend.Slack.SlackPreviewTab
 */
export default () => {
    return Webiny.import(['Grid', 'Input', 'Tabs']).then(Ui => {
        return (model, form, notification) => {
            if (!_.get(notification, 'handlers.slack.send')) {
                return null;
            }

            return (
                <Ui.Tabs.Tab label={Webiny.I18n('Slack message')} icon="fa-slack">
                    <Ui.Grid.Row>
                        <Ui.Grid.Col all={12}>
                            <Ui.Input
                                label={Webiny.I18n('Token')}
                                name="slack.token"
                                placeholder={Webiny.I18n('Leave empty to use Slack settings')}/>
                            <Ui.Input
                                label={Webiny.I18n('Team')}
                                name="slack.team"
                                placeholder={Webiny.I18n('Leave empty to use Slack settings')}/>
                            <Ui.Input
                                label={Webiny.I18n('Username')}
                                name="slack.username"
                                placeholder={Webiny.I18n('Leave empty to use Slack settings')}/>
                            <Ui.Input
                                label={Webiny.I18n('Channel/User')}
                                name="slack.channel"
                                placeholder={Webiny.I18n('Leave empty to use Slack message channel')}
                                description={Webiny.I18n('Specify a channel or username: #general or @mark')}/>
                        </Ui.Grid.Col>
                    </Ui.Grid.Row>
                </Ui.Tabs.Tab>
            );
        }
    });
};