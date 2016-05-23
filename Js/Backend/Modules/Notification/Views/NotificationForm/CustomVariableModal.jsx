import Webiny from 'Webiny';

const Ui = Webiny.Ui.Components;

class EntityVariableModal extends Webiny.Ui.ModalComponent {

    constructor(props) {
        super(props);
    }

    render() {
        const formProps = {
            ui: 'customVariableForm',
            api: '/entities/notification-manager/notification-variable',
            fields: '*',
            defaultModel: _.merge({type: 'custom'}, {notification: Webiny.Router.getParams('id')}, this.props.data),
            onSubmitSuccess: this.props.showView('variableList'),
            onSuccessMessage: record => {
                return <span>Variable
                    <strong>{record.key}</strong>
                    saved!</span>;
            }
        };

        return (
            <Ui.Modal.Dialog ref="dialog">
                <Ui.Modal.Header title="Custom Variable"/>
                <Ui.Modal.Body>
                    <Ui.Form.Container {...formProps}>
                        {() => (
                            <Ui.Grid.Row>
                                <Ui.Grid.Col all={12}>
                                    <Ui.Input label="Variable Name" name="key" validate="required"/>
                                    <Ui.Input label="Description" name="description"/>
                                    <Ui.Hidden name="notification"/>
                                    <Ui.Hidden name="type"/>
                                </Ui.Grid.Col>
                            </Ui.Grid.Row>
                        )}
                    </Ui.Form.Container>
                </Ui.Modal.Body>
                <Ui.Modal.Footer>
                    <Ui.Button type="default" label="Close" onClick={this.hide}/>
                    <Ui.Button type="primary" label="Save changes" onClick={this.ui('customVariableForm:submit')}/>
                </Ui.Modal.Footer>
            </Ui.Modal.Dialog>
        );
    }
}

export default EntityVariableModal;