import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class SettingsForm extends Webiny.Ui.View {
    renderNotificationSettingsTabs(model, form) {
        const tabs = Webiny.Injector.getByTag('NotificationManager.SettingsForm.Tab');
        return tabs.map(tab => {
            return React.cloneElement(tab.value(model, form), {key: tab.name});
        });
    }
}

SettingsForm.defaultProps = {
    renderer() {
        return (
            <Ui.Settings api="/entities/notification-manager/settings">
                {(model, form) => (
                    <Ui.View.Form>
                        <Ui.View.Header
                            title="Notification Manager Settings"
                            description="Set your notification settings here"/>
                        <Ui.View.Body noPadding>
                            <Ui.Tabs size="large" position="left">
                                {this.renderNotificationSettingsTabs(model, form)}
                            </Ui.Tabs>
                        </Ui.View.Body>
                        <Ui.View.Footer align="right">
                            <Ui.Button type="primary" onClick={form.submit} label="Save settings"/>
                        </Ui.View.Footer>
                    </Ui.View.Form>
                )}
            </Ui.Settings>
        );
    }
};


export default SettingsForm;
