import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

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

        if (this.state.response) {
            content = this.state.response.map((r, i) => {
                return (
                    <Ui.Alert key={i} type={r.status ? 'success' : 'danger'}>{r.message}</Ui.Alert>
                );
            });
        }

        if (!this.state.response) {
            content = (
                <Ui.Tabs position="left">
                    {tabs.map(tab => {
                        const tabContent = tab.value(this.props.model);
                        return tabContent ? React.cloneElement(tabContent, {key: tab.name}) : null;
                    })}
                </Ui.Tabs>
            );
        }

        return (
            <Ui.Modal.Dialog><Ui.Form onSubmit={this.submit}>
                {(model, form) => (
                    <wrapper>
                        {this.state.loading ? <Ui.Loader/> : null}
                        <Ui.Modal.Header title="Preview Notification"/>
                        <Ui.Modal.Body noPadding={!this.state.response}>
                            {content}
                        </Ui.Modal.Body>
                        <Ui.Modal.Footer>
                            <Ui.Button type="default" label="Close" onClick={this.hide}/>
                            <Ui.Button type="primary" label="Send Preview" onClick={form.submit}/>
                        </Ui.Modal.Footer>
                    </wrapper>
                )}
            </Ui.Form></Ui.Modal.Dialog>
        );
    }
}

export default PreviewModal;