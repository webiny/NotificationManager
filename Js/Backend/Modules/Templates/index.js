import Webiny from 'webiny';
import Views from './Views/Views';

class Templates extends Webiny.App.Module {

    init() {
        this.name = 'Templates';
        const Menu = Webiny.Ui.Menu;
        const role = 'notification-manager';

        this.registerMenus(
            new Menu('Marketing Tools', [
                new Menu('Notification Manager', [
                    new Menu('Templates', 'NotificationManager.Templates')
                ]).setRole(role)
            ], 'icon-bell')
        );

        this.registerRoutes(
            new Webiny.Route('NotificationManager.Templates', '/notification-manager/templates', Views.TemplateList, 'Notification Manager - Templates').setRole(role),
            new Webiny.Route('NotificationManager.Template.Edit', '/notification-manager/template/:id', Views.TemplateForm, 'Notification Manager - Edit Template').setRole(role),
            new Webiny.Route('NotificationManager.Template.Create', '/notification-manager/template', Views.TemplateForm, 'Notification Manager - New Template').setRole(role)
        );
    }
}

export default Templates;