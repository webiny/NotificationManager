import Webiny from 'Webiny';

const Ui = Webiny.Ui.Components;

class EntityVariableModal extends Webiny.Ui.ModalComponent {
    renderDialog() {
        const formProps = {
            ui: 'entityVariableForm',
            defaultModel: _.merge({type: 'entity'}, this.props.data),
            onSubmit: model => {
                Webiny.Growl.success(<span>Variable <strong>{model.key}</strong> added!</span>);
                this.hide().then(() => {
                    this.props.onSave(model);
                    this.props.showView('variableList')();
                });
            }
        };

        const entitySelect = {
            label: 'Entity',
            name: 'entity',
            placeholder: 'Select Entity',
            allowClear: true,
            api: '/services/core/entities',
            fields: 'class,name',
            perPage: 2,
            valueAttr: 'class',
            minimumResultsForSearch: 5,
            optionRenderer: option => {
                return (
                    <div>
                        <strong>{option.data.name}</strong>
                        <br/>
                        <span>{option.data.class}</span>
                    </div>
                );
            },
            selectedRenderer: option => {
                return option.data.name;
            }
        };

        return (
            <Ui.Modal.Dialog>
                <Ui.Modal.Header title="Entity Variable"/>
                <Ui.Modal.Body>
                    <Ui.Form.Container {...formProps}>
                        {() => (
                            <Ui.Grid.Row>
                                <Ui.Grid.Col all={12}>
                                    <Ui.Input label="Variable Name" name="key" validate="required"/>
                                    <Ui.Select {...entitySelect}/>
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
                    <Ui.Button type="primary" label="Save" onClick={this.ui('entityVariableForm:submit')}/>
                </Ui.Modal.Footer>
            </Ui.Modal.Dialog>
        );
    }
}

export default EntityVariableModal;