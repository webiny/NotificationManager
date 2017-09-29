import React from 'react';
import _ from 'lodash';
import Webiny from 'webiny';
import Editor from './Editor';
import ActivityList from './ActivityList';

/**
 * @i18n.namespace NotificationManager.Backend.Email.EmailContentTab
 */
export default () => {
    return Webiny.import(['Tabs', 'Section', 'Checkbox', 'Logic', 'Grid', 'Input', 'Select']).then(Ui => {
        return (model, form) => {
            const templateSelect = {
                api: '/entities/notification-manager/templates',
                fields: 'name',
                label: 'Template',
                placeholder: 'Select template',
                allowClear: true
            };

            return (
                <Ui.Tabs.Tab label={Webiny.I18n('Email content')} icon="fa-envelope">
                    <Ui.Grid.Row>
                        <Ui.Grid.Col all={12}>
                            <Ui.Section title={form.bindTo(<Ui.Checkbox name="handlers.email.send" label={Webiny.I18n('Send email')}/>)}/>
                            <Ui.Logic.Hide if={!_.get(model, 'handlers.email.send')}>
                                <Ui.Tabs>
                                    <Ui.Tabs.Tab label={Webiny.I18n('Content')}>
                                        <Ui.Grid.Row>
                                            <Ui.Grid.Col all={4}>
                                                <Ui.Input
                                                    label={Webiny.I18n('Subject')}
                                                    name="handlers.email.subject"
                                                    validate="required"/>
                                                <Ui.Input
                                                    label={Webiny.I18n('From Address')}
                                                    name="handlers.email.fromAddress"
                                                    validate="email"
                                                    placeholder={Webiny.I18n('Leave blank to use the default sender')}/>
                                                <Ui.Input
                                                    label={Webiny.I18n('From Name')}
                                                    name="handlers.email.fromName"
                                                    placeholder={Webiny.I18n('Leave blank to use the default sender')}/>
                                                <Ui.Select
                                                    {...templateSelect}
                                                    validate="required"
                                                    name="handlers.email.template"/>
                                            </Ui.Grid.Col>
                                            <Ui.Grid.Col all={8}>
                                                <Editor
                                                    variables={model.variables}
                                                    label={Webiny.I18n('Content')}
                                                    name="handlers.email.content"
                                                    description={Webiny.I18n('You can use Smarty syntax for your email content.')}/>
                                            </Ui.Grid.Col>
                                        </Ui.Grid.Row>
                                    </Ui.Tabs.Tab>
                                    <Ui.Tabs.Tab label={Webiny.I18n('Activity')}>
                                        <ActivityList notification={model}/>
                                    </Ui.Tabs.Tab>
                                </Ui.Tabs>
                            </Ui.Logic.Hide>
                        </Ui.Grid.Col>
                    </Ui.Grid.Row>
                </Ui.Tabs.Tab>
            );
        }
    });
};