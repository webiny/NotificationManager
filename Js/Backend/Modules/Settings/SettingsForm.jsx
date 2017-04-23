import Webiny from 'Webiny';

class SettingsForm extends Webiny.Ui.View {
    renderNotificationSettingsTabs(model, form) {
        const {Tabs} = this.props;
        const tabs = Webiny.Injector.getByTag('NotificationManager.SettingsForm.Tab');
        return tabs.map(tab => {
            const tabProps = _.assign({key: tab.name}, tab.value(model, form));
            return <Tabs.Tab {...tabProps}/>
        });

    }
}

SettingsForm.defaultProps = {
    renderer() {
        const {Settings, View, Tabs, Button} = this.props;
        return (
            <Settings api="/entities/notification-manager/settings">
                {(model, form) => (
                    <View.Form>
                        <View.Header
                            title="Notification Manager Settings"
                            description="Set your notification settings here"/>
                        <View.Body noPadding>
                            <Tabs size="large" position="left">
                                {this.renderNotificationSettingsTabs(model, form)}
                            </Tabs>
                        </View.Body>
                        <View.Footer align="right">
                            <Button type="primary" onClick={form.submit} label="Save settings"/>
                        </View.Footer>
                    </View.Form>
                )}
            </Settings>
        );
    }
};

export default Webiny.createComponent(SettingsForm, {modules: ['Settings', 'View', 'Tabs', 'Button']});
