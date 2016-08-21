import Webiny from 'Webiny';
import EntityVariableModal from './EntityVariableModal';
import CustomVariableModal from './CustomVariableModal';
const Ui = Webiny.Ui.Components;
const Table = Ui.List.Table;

class VariableList extends Webiny.Ui.View {

}

VariableList.defaultProps = {

    renderer() {
        const listProps = {
            ui: 'variableListContainer',
            api: '/entities/notification-manager/notification-variable',
            query: {
                notification: Webiny.Router.getParams('id'),
                '_sort': 'key'
            },
            fields: '*',
            perPage: 1000
        };

        return (
            <Ui.ViewSwitcher.Container>
                <Ui.ViewSwitcher.View view="variableList" defaultView>
                    {showView => (
                        <view>

                            <h2>
                                <Ui.Grid.Row>
                                    <Ui.Grid.Col all={10}>
                                        Variables
                                    </Ui.Grid.Col>
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
                                </Ui.Grid.Col>
                            </Ui.Grid.Row>
                            <Ui.List.ApiContainer {...listProps}>
                                <Table.Table>
                                    <Table.Empty/>
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
                                        <Table.Field name="entity" align="left" label="Entity" sort="entity"/>
                                        <Table.Actions>
                                            <Table.EditAction label="Edit" onClick={(data) => {
                                                if (data['type'] === 'entity') {
                                                    showView('entityVariableModal')(data);
                                                } else {
                                                    showView('customVariableModal')(data);
                                                }
                                            }}/>
                                            <Table.DeleteAction/>
                                        </Table.Actions>
                                    </Table.Row>
                                </Table.Table>
                            </Ui.List.ApiContainer>
                        </view>
                    )}
                </Ui.ViewSwitcher.View>

                <Ui.ViewSwitcher.View view="entityVariableModal" modal>
                    {(showView, data) => <EntityVariableModal {...{showView, data}} />}
                </Ui.ViewSwitcher.View>

                <Ui.ViewSwitcher.View view="customVariableModal" modal>
                    {(showView, data) => <CustomVariableModal {...{showView, data}} />}
                </Ui.ViewSwitcher.View>

            </Ui.ViewSwitcher.Container>
        );
    }
};

export default VariableList;