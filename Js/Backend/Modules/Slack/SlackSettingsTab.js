import React from 'react';
import Webiny from 'webiny';

/**
 * @i18n.namespace NotificationManager.Backend.Slack.SlackSettingsTab
 */
export default () => Webiny.import(['Tabs', 'Grid', 'Input']).then(Ui => {
    return (model, form) => {
        return (
            <Ui.Tabs.Tab label={this.i18n('Slack')} icon="fa-slack">
                <Ui.Grid.Row>
                    <Ui.Grid.Col all={12}>
                        <Ui.Input
                            label={this.i18n('Token')}
                            name="slack.token"
                            description={(
                                <span>
                                    {this.i18n('Bot token to use when sending notifications.')}
                                    <a target="_blank" href="https://api.slack.com/bot-users">{this.i18n('Create your Slack bot here.')}</a>
                                </span>
                            )}/>
                        <Ui.Input label={this.i18n('Team')} name="slack.team"/>
                        <Ui.Input label={this.i18n('Username')} name="slack.username"/>
                    </Ui.Grid.Col>
                </Ui.Grid.Row>
            </Ui.Tabs.Tab>
        );
    };
});