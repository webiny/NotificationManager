import React from 'react';
import Webiny from 'webiny';

class PreviewModal extends Webiny.Ui.ModalComponent {

    constructor(props) {
        super(props);
        this.state = {
            response: null
        };
        this.bindMethods('submit');
    }

    submit({model: preview}) {
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

    renderContent(model, form) {
        const {Alert, Tabs, plugins} = this.props;

        if (this.state.response) {
            return this.state.response.map((r, i) => {
                return (
                    <Alert key={i} type={r.status ? 'success' : 'danger'}>{r.message}</Alert>
                );
            });
        }

        return (
            <Tabs position="left">
                {plugins.map((pl, index) => {
                    const tab = pl(model, form, this.props.model);
                    return React.isValidElement(tab) ? React.cloneElement(tab, {key: index}) : null;
                })}
            </Tabs>
        );
    }

    renderDialog() {
        const {Modal, Form, Button, Loader} = this.props;

        return (
            <Modal.Dialog onHide={() => this.setState({response: null})}>
                <Form onSubmit={this.submit}>
                    {({model, form}) => (
                        <Modal.Content>
                            {this.state.loading ? <Loader/> : null}
                            <Modal.Header title="Preview Notification"/>
                            <Modal.Body noPadding={!this.state.response}>
                                {this.renderContent(model, form)}
                            </Modal.Body>
                            <Modal.Footer>
                                <Button type="default" label="Close" onClick={this.hide}/>
                                <Button type="primary" label="Send Preview" onClick={form.submit}/>
                            </Modal.Footer>
                        </Modal.Content>
                    )}
                </Form>
            </Modal.Dialog>
        );
    }
}

export default Webiny.createComponent(PreviewModal, {
    modules: ['Alert', 'Tabs', 'Modal', 'Form', 'Button', 'Loader', {
        plugins: () => {
            return Webiny.importByTag('NotificationManager.NotificationForm.Preview').then(modules => {
                const promises = Object.values(modules).map(tab => tab());
                return Promise.all(promises);
            });
        }
    }]
});