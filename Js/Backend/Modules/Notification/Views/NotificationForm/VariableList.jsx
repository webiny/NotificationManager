import Webiny from 'Webiny';
import EntityVariableModal from './EntityVariableModal';
import CustomVariableModal from './CustomVariableModal';
const Ui = Webiny.Ui.Components;
const Table = Ui.List.Table;

const views = {
    entity: 'entityVariableModal',
    custom: 'customVariableModal'
};

class VariableList extends Webiny.Ui.View {

    constructor(props) {
        super(props);

        this.bindMethods('saveVariable');
    }

    saveVariable(oldVar, newVar) {
        const vars = _.clone(this.props.data);
        const existing = _.find(vars, {key: _.get(oldVar, 'key', newVar.key)});
        if (!existing) {
            vars.push(newVar);
        } else {
            _.merge(existing, newVar);
        }
        this.props.onChange(vars);
    }

    deleteConfirm(data, actions, modal) {
        const vars = _.clone(this.props.data);
        vars.splice(_.findIndex(vars, data.key), 1);
        modal.hide().then(() => {
            this.props.onChange(vars);
        });
    }

    getEntityAttributes(data) {
        if (data.type !== 'entity') {
            return;
        }

        return (<ul>
            <Ui.Data
                api="/services/core/entities/attributes"
                fields="tag,name"
                query={{'entity': data.entity}}>
                {varData => (
                    varData.map(varDetails => {
                        return (<li key={varDetails.name}>{varDetails.name}</li>);
                    })
                )}
            </Ui.Data>
        </ul>);
    }
}

VariableList.defaultProps = {

    renderer() {
        const listProps = {
            ui: 'variableListContainer',
            sort: 'key',
            data: this.props.data
        };

        return (
            <Ui.ViewSwitcher.Container>
                <Ui.ViewSwitcher.View view="variableList" defaultView>
                    {showView => (
                        <view>
                            <h2>
                                <Ui.Grid.Row>
                                    <Ui.Grid.Col all={10}>Variables</Ui.Grid.Col>
                                    <Ui.Grid.Col all={2}>
                                        <Ui.Dropdown.Dropdown title="Create Variable" align="right">
                                            <Ui.Dropdown.Header title="Variable Type"/>
                                            <Ui.Dropdown.Link onClick={showView('entityVariableModal')} title="Entity"/>
                                            <Ui.Dropdown.Link onClick={showView('customVariableModal')} title="Custom"/>
                                        </Ui.Dropdown.Dropdown>
                                    </Ui.Grid.Col>
                                </Ui.Grid.Row>
                            </h2>
                            <Ui.Grid.Row>
                                <Ui.Grid.Col all={12}>
                                    <Ui.Alert title="About">
                                        This is a list of variables that you can use in your notification content.
                                        The list also defines the data source from where the variable value will be pulled.
                                    </Ui.Alert>
                                    <Ui.Alert title="Important" type="warning">
                                        Changes you make to the variables are not saved until you save the notification!
                                    </Ui.Alert>
                                    <Ui.List.StaticContainer {...listProps}>
                                        <Table.Table>
                                            <Table.Row>
                                                <Table.Field name="key" align="left" label="Variable Name" sort="key">
                                                    {data => (
                                                        <span>
                                                            <strong>&#123;${data.key}&#125;</strong>
                                                            <br/>
                                                            <span>{data.description}</span>
                                                        </span>
                                                    )}
                                                </Table.Field>
                                                <Table.Field name="key" align="left" label="Entity" sort="key">
                                                    {data => (
                                                        <span>
                                                            {data.entity}
                                                            {this.getEntityAttributes(data)}
                                                        </span>
                                                    )}
                                                </Table.Field>

                                                <Table.Actions>
                                                    <Table.EditAction label="Edit" onClick={(data) => showView(views[data['type']])(data)}/>
                                                    <Table.DeleteAction
                                                        onConfirm={(data, action, modal) => this.deleteConfirm(data, action, modal)}/>
                                                </Table.Actions>
                                            </Table.Row>
                                        </Table.Table>
                                    </Ui.List.StaticContainer>
                                </Ui.Grid.Col>
                            </Ui.Grid.Row>
                        </view>
                    )}
                </Ui.ViewSwitcher.View>
                <Ui.ViewSwitcher.View view="entityVariableModal" modal>
                    {(showView, data) => (
                        <EntityVariableModal {...{showView, data}} onSave={variable => this.saveVariable(data, variable)}/>
                    )}
                </Ui.ViewSwitcher.View>
                <Ui.ViewSwitcher.View view="customVariableModal" modal>
                    {(showView, data) => (
                        <CustomVariableModal {...{showView, data}} onSave={variable => this.saveVariable(data, variable)}/>
                    )}
                </Ui.ViewSwitcher.View>

            </Ui.ViewSwitcher.Container>
        );
    }
};

export default VariableList;