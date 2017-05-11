import Webiny from 'Webiny';

class PreviewModal extends Webiny.Ui.ModalComponent {

    constructor(props) {
        super(props);
        this.state = {
            response: null
        };
        this.bindMethods('submit');
    }

    componentWillReceiveProps(props) {
        super.componentWillReceiveProps(props);
        this.setState({response: null});
    }

    submit(preview) {
        const api = new Webiny.Api.Endpoint('/entities/notification-manager/notifications');
        this.setState({loading: true});
        this.request = api.post(Webiny.Router.getParams('id') + '/preview', preview).then(apiResponse => {
            this.setState({response: apiResponse.getData(), loading: false}, () => {
                setTimeout(() => {
                    this.hide();
                }, 3000);
            });
        });
    }

    renderDialog() {
        const tabs = Webiny.Injector.getByTag('NotificationManager.NotificationForm.Preview');
        let content = null;

        const {Alert, Tabs, Modal, Form, Button, Loader} = this.props;

        if (this.state.response) {
            content = this.state.response.map((r, i) => {
                return (
                    <Alert key={i} type={r.status ? 'success' : 'danger'}>{r.message}</Alert>
                );
            });
        }

        if (!this.state.response) {
            content = (
                <Tabs position="left">
                    {tabs.map(tab => {
                        const tabProps = tab.value(this.props.model, this.props.form);
                        return tabProps ? <Tabs.Tab key={tab.name} {...tabProps}/> : null;
                    })}
                </Tabs>
            );
        }

        return (
            <Modal.Dialog>
                <Form onSubmit={this.submit}>
                    {(model, form) => (
                        <wrapper>
                            {this.state.loading ? <Loader/> : null}
                            <Modal.Header title="Preview Notification"/>
                            <Modal.Body noPadding={!this.state.response}>
                                {content}
                            </Modal.Body>
                            <Modal.Footer>
                                <Button type="default" label="Close" onClick={this.hide}/>
                                <Button type="primary" label="Send Preview" onClick={form.submit}/>
                            </Modal.Footer>
                        </wrapper>
                    )}
                </Form>
            </Modal.Dialog>
        );
    }
}

export default Webiny.createComponent(PreviewModal, {modules: ['Alert', 'Tabs', 'Modal', 'Form', 'Button', 'Loader']});