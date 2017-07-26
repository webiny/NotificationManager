import React from 'react';
import Webiny from 'webiny';

class SettingsForm extends Webiny.Ui.View {
    registerTabs(model, form) {
        return this.props.plugins.map((pl, index) => {
            const tab = pl(model, form);
            return React.cloneElement(tab, {key: index});
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
                                {this.registerTabs(model, form)}
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

export default Webiny.createComponent(SettingsForm, {
    modules: ['Settings', 'View', 'Tabs', 'Button', {
        plugins: () => {
            return Webiny.importByTag('NotificationManager.SettingsForm.Tab').then(modules => {
                const promises = Object.values(modules).map(tab => tab());
                return Promise.all(promises);
            });
        }
    }]
});
