import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

export default (model) => {
    if (!_.get(model, 'handlers.email.send')) {
        return null;
    }

    return (
        <Ui.Tabs.Tab label="Email content" icon="fa-envelope">
            <Ui.Input
                name="email.email"
                label="Email recipient"
                validate="email"
                placeholder={`Leave empty to use ${Webiny.Model.get('User').email}`}/>
        </Ui.Tabs.Tab>
    );
};