import Webiny from 'Webiny';

export default (model, form) => {
    if (!_.get(model, 'handlers.email.send')) {
        return null;
    }

    return {
        label: 'Email content',
        icon: 'fa-envelope',
        children: (
            <Webiny.Ui.LazyLoad modules={['Input']}>
                {(Ui) => (
                    <Ui.Input
                        {...form.bindTo('email.email')}
                        label="Email recipient"
                        validate="email"
                        placeholder={`Leave empty to use ${Webiny.Model.get('User').email}`}/>
                )}
            </Webiny.Ui.LazyLoad>
        )
    };
};