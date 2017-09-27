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
                <Ui.Tabs.Tab label={this.i18n('Slack message')} icon="fa-slack">
                    <Ui.Grid.Row>
                        <Ui.Grid.Col all={12}>
                            {form.bindTo(
                                <Ui.Input
                                    label={this.i18n('Token')}
                                    name="slack.token"
                                    placeholder={this.i18n('Leave empty to use Slack settings')}/>
                            )}
                            {form.bindTo(
                                <Ui.Input
                                    label={this.i18n('Team')}
                                    name="slack.team"
                                    placeholder={this.i18n('Leave empty to use Slack settings')}/>
                            )}
                            {form.bindTo(
                                <Ui.Input
                                    label={this.i18n('Username')}
                                    name="slack.username"
                                    placeholder={this.i18n('Leave empty to use Slack settings')}/>
                            )}
                            {form.bindTo(
                                <Ui.Input
                                    label={this.i18n('Channel/User')}
                                    name="slack.channel"
                                    placeholder={this.i18n('Leave empty to use Slack message channel')}
                                    description="Specify a channel or username: #general or @mark"/>
                            )}
                        </Ui.Grid.Col>
                    </Ui.Grid.Row>
                </Ui.Tabs.Tab>
            );
        }
    });
};