import React from 'react';
import Webiny from 'webiny';
import Views from './Views/Views';

class Templates extends Webiny.App.Module {

    init() {
        this.name = 'Templates';
        const Menu = Webiny.Ui.Menu;
        const role = 'notification-manager';

        this.registerMenus(
            <Menu label="Marketing Tools" icon="fa-bell">
                <Menu label="Notification Manager" role={role}>
                    <Menu label="Templates" route="NotificationManager.Templates"/>
                </Menu>
            </Menu>
        );

        this.registerRoutes(
            new Webiny.Route('NotificationManager.Templates', '/notification-manager/templates', Views.TemplateList, 'Notification Manager - Templates').setRole(role),
            new Webiny.Route('NotificationManager.Template.Edit', '/notification-manager/template/:id', Views.TemplateForm, 'Notification Manager - Edit Template').setRole(role),
            new Webiny.Route('NotificationManager.Template.Create', '/notification-manager/template', Views.TemplateForm, 'Notification Manager - New Template').setRole(role)
        );
    }
}

export default Templates;