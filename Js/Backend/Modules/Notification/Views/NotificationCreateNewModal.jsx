import React from 'react';
import Webiny from 'webiny';

class NotificationCreateNewModal extends Webiny.Ui.ModalComponent {

    renderDialog() {
        const formProps = {
            api: '/entities/notification-manager/notification',
            fields: 'id,title',
            onSubmitSuccess: ({apiResponse}) => {
                const id = apiResponse.getData('entity.id');
                if (id) {
                    Webiny.Router.goToRoute('NotificationManager.Notification.Edit', {id});
                }
                this.hide();
            }
        };

        const {Modal, Form, Grid, Input, Textarea, Button} = this.props;

        return (
            <Modal.Dialog>
                <Form {...formProps}>
                    {({form}) => (
                        <Modal.Content>
                            <Form.Loader/>
                            <Modal.Header title="New Notification" onClose={this.hide}/>
                            <Modal.Body>
                                <Grid.Row>
                                    <Grid.Col all={12}>
                                        <Input label="Title" name="title" validate="required"/>
                                    </Grid.Col>
                                    <Grid.Col all={12}>
                                        <Input
                                            label="Slug"
                                            name="slug"
                                            placeholder="Leave blank for automatic slug"
                                            description="WARNING: This cannot be changed later."/>
                                    </Grid.Col>
                                    <Grid.Col all={12}>
                                        <Textarea label="Description" name="description"/>
                                    </Grid.Col>
                                </Grid.Row>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button type="default" label="Cancel" onClick={this.hide}/>
                                <Button type="primary" label="Add Notification" onClick={form.submit}/>
                            </Modal.Footer>
                        </Modal.Content>
                    )}
                </Form>
            </Modal.Dialog>
        );
    }
}

export default Webiny.createComponent(NotificationCreateNewModal, {
    modules: ['Modal', 'Form', 'Grid', 'Input', 'Textarea', 'Button']
});