import React from 'react';
import _ from 'lodash';
import Webiny from 'webiny';

export default (model, form) => {
    if (!_.get(model, 'handlers.email.send')) {
        return null;
    }

    return {
        label: 'Email content',
        icon: 'fa-envelope',
        children: (
            <Webiny.Ui.LazyLoad modules={['Input']}>
                {(Ui) => form.bindTo(
                    <Ui.Input
                        name="email.email"
                        label="Email recipient"
                        validate="email"
                        placeholder={`Leave empty to use ${Webiny.Model.get('User').email}`}/>
                )}
            </Webiny.Ui.LazyLoad>
        )
    };
};