import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class NotificationCreateNewModal extends Webiny.Ui.ModalComponent {

    constructor(props) {
        super(props);
    }

    render() {
        const formProps = {
            ui: 'newNotificationForm',
            api: '/entities/notification-manager/notification',
            fields: 'id, title',
            onSubmitSuccess: (val) => {
                if (val.getData('id')) {
                    Webiny.Router.goToRoute('NotificationManager.Notification.Edit', {id: val.getData('id')});
                }
                //this.ui('frequencySelect').prepareOptions();
                this.hide();
            }
        };

        return (
            <Ui.Modal.Dialog ref="dialog">
                <Ui.Modal.Header title="New Notification"/>
                <Ui.Modal.Body>
                    <Ui.Form.ApiContainer {...formProps}>
                        <Ui.Form.Form layout={false}>
                            <fields>
                                <Ui.Grid.Row>
                                    <Ui.Grid.Col all={12}>
                                        <Ui.Input label="Title" name="title" validate="required"/>
                                    </Ui.Grid.Col>
                                    <Ui.Grid.Col all={12}>
                                        <Ui.Textarea label="Description" name="description"/>
                                    </Ui.Grid.Col>
                                </Ui.Grid.Row>
                            </fields>
                        </Ui.Form.Form>
                    </Ui.Form.ApiContainer>
                </Ui.Modal.Body>
                <Ui.Modal.Footer>
                    <Ui.Button type="secondary" label="Cancel" onClick={this.hide}/>
                    <Ui.Button type="primary" label="Add frequency" onClick={this.ui('newNotificationForm:submit')}/>
                </Ui.Modal.Footer>
            </Ui.Modal.Dialog>
        );
    }
}

export default NotificationCreateNewModal;