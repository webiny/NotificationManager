import React from 'react';
import _ from 'lodash';
import Webiny from 'webiny';

export default () => {
    return Webiny.import(['Input', 'Tabs']).then(Ui => {
        return (model, form, notification) => {
            if (!_.get(notification, 'handlers.email.send')) {
                return null;
            }

            return (
                <Ui.Tabs.Tab label="Email content" icon="fa-envelope">
                    {form.bindTo(
                        <Ui.Input
                            name="email.email"
                            label="Email recipient"
                            validate="email"
                            placeholder={`Leave empty to use ${Webiny.Model.get('User').email}`}/>
                    )}
                </Ui.Tabs.Tab>
            );
        }
    });
};