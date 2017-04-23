import Webiny from 'Webiny';

class NotificationCreateNewModal extends Webiny.Ui.ModalComponent {

    renderDialog() {
        const formProps = {
            ui: 'newNotificationForm',
            api: '/entities/notification-manager/notification',
            fields: 'id, title',
            onSubmitSuccess: (val) => {
                if (val.getData('id')) {
                    Webiny.Router.goToRoute('NotificationManager.Notification.Edit', {id: val.getData('id')});
                }
                this.hide();
            }
        };

        const {Modal, Form, Grid, Input, Textarea, Button} = this.props;

        return (
            <Modal.Dialog>
                <Modal.Header title="New Notification"/>
                <Modal.Body>
                    <Form {...formProps}>
                        {() => (
                            <Grid.Row>
                                <Grid.Col all={12}>
                                    <Input label="Title" name="title" validate="required"/>
                                </Grid.Col>
                                <Grid.Col all={12}>
                                    <Input
                                        label="Slug"
                                        name="slug"
                                        placeholder="Leave blank for automatic slug"
                                        description="This cannot be changed later."/>
                                </Grid.Col>
                                <Grid.Col all={12}>
                                    <Textarea label="Description" name="description"/>
                                </Grid.Col>
                            </Grid.Row>
                        )}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button type="secondary" label="Cancel" onClick={this.hide}/>
                    <Button type="primary" label="Add Notification" onClick={this.ui('newNotificationForm:submit')}/>
                </Modal.Footer>
            </Modal.Dialog>
        );
    }
}

export default Webiny.createComponent(NotificationCreateNewModal, {modules: ['Modal', 'Form', 'Grid', 'Input', 'Textarea', 'Button']});