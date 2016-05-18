import Webiny from 'Webiny';
import Views from './Views/Views';

class Template extends Webiny.Module {

    init() {
        this.registerRoutes(
            new Webiny.Route('NotificationManager.Templates', '/notification-manager/templates', Views.TemplateList, 'Notification Manager - Templates'),
            new Webiny.Route('NotificationManager.Template.Edit', '/notification-manager/template/:id', Views.TemplateForm, 'Notification Manager - Edit Template'),
            new Webiny.Route('NotificationManager.Template.Create', '/notification-manager/template', Views.TemplateForm, 'Notification Manager - New Template')
        );
    }
}

export default Template;