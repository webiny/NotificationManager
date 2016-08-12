import Webiny from 'Webiny';

const Ui = Webiny.Ui.Components;

class PreviewModal extends Webiny.Ui.ModalComponent {

    constructor(props) {
        super(props);

        this.state = {
            'type': 'info',
            'message': 'Your message is queued for sending...',
            'title': 'Please Wait'
        };
    }

    setPending() {
        this.setState({
            'type': 'info',
            'message': 'Your message is queued for sending...',
            'title': 'Please Wait'
        });
    }

    setSuccess() {
        this.setState({
            'type': 'success',
            'message': 'Your message was sent, please check your inbox at ' + Webiny.Model.get('User').email,
            'title': 'Message Sent'
        });
    }

    setError() {
        this.setState({
            'type': 'error',
            'message': 'There has been an error while trying to send your message. Please check your SMTP settings.',
            'title': 'Message Not Sent'
        });
    }

    renderDialog() {
        return (
            <Ui.Modal.Dialog>
                <Ui.Modal.Header title="Preview Email"/>
                <Ui.Modal.Body>
                    <Ui.Alert type={this.state.type} title={this.state.title} close={false}>
                        {this.state.message}
                    </Ui.Alert>
                </Ui.Modal.Body>
                <Ui.Modal.Footer>
                    <Ui.Button type="default" label="Close" onClick={this.hide}/>
                </Ui.Modal.Footer>
            </Ui.Modal.Dialog>
        );
    }
}

export default PreviewModal;