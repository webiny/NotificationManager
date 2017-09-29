import React from 'react';
import _ from 'lodash';
import Webiny from 'webiny';

/**
 * @i18n.namespace NotificationManager.Backend.Email.EmailPreviewTab
 */
export default () => {
    return Webiny.import(['Input', 'Tabs']).then(Ui => {
        return (model, form, notification) => {
            if (!_.get(notification, 'handlers.email.send')) {
                return null;
            }

            return (
                <Ui.Tabs.Tab label={Webiny.I18n('Email content')} icon="fa-envelope">
                    {form.bindTo(
                        <Ui.Input
                            name="email.email"
                            label={Webiny.I18n('Email recipient')}
                            validate="email"
                            placeholder={Webiny.I18n(`Leave empty to use {usersEmail}`, {usersEmail: Webiny.Model.get('User').email})}/>
                    )}
                </Ui.Tabs.Tab>
            );
        }
    });
};