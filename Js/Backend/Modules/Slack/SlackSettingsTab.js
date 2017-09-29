import React from 'react';
import Webiny from 'webiny';

/**
 * @i18n.namespace NotificationManager.Backend.Slack.SlackSettingsTab
 */
export default () => Webiny.import(['Tabs', 'Grid', 'Input']).then(Ui => {
    return (model, form) => {
        return (
            <Ui.Tabs.Tab label={Webiny.I18n('Slack')} icon="fa-slack">
                <Ui.Grid.Row>
                    <Ui.Grid.Col all={12}>
                        <Ui.Input
                            label={Webiny.I18n('Token')}
                            name="slack.token"
                            description={(
                                <span>
                                    {Webiny.I18n('Bot token to use when sending notifications.')}&nbsp;
                                    <a target="_blank" href="https://api.slack.com/bot-users">{Webiny.I18n('Create your Slack bot here.')}</a>
                                </span>
                            )}/>
                        <Ui.Input label={Webiny.I18n('Team')} name="slack.team"/>
                        <Ui.Input label={Webiny.I18n('Username')} name="slack.username"/>
                    </Ui.Grid.Col>
                </Ui.Grid.Row>
            </Ui.Tabs.Tab>
        );
    };
});