import Webiny from 'Webiny';
import NotificationVariableModal from './NotificationVariableModal';
const Ui = Webiny.Ui.Components;
const Table = Ui.List.Table;

class NotificationVariableList extends Webiny.Ui.View {

}

NotificationVariableList.defaultProps = {

    renderer() {
        const listProps = {
            api: '/entities/notification-manager/notification-variables',
            query: {
                notification: '@router:id',
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
                            <Ui.Alert title="About">
                                This is a list of variables that you can use in your notification content.
                                The list also defines the data source from where the variable value will be pulled.
                            </Ui.Alert>
                            <h2>
                                <Ui.Grid.Row>
                                    <Ui.Grid.Col all={10}>
                                        Variables
                                    </Ui.Grid.Col>
                                    <Ui.Grid.Col all={2}>
                                        <Ui.Button type="primary" align="right" onClick={showView('variableModal')}>
                                            Create new Variable
                                        </Ui.Button>
                                    </Ui.Grid.Col>
                                </Ui.Grid.Row>
                            </h2>
                            <Ui.List.ApiContainer {...listProps}>
                                <Table.Table>
                                    <Table.Row>
                                        <Table.Field name="key" align="left" label="Variable Name" sort="key">
                                            <Table.FieldRenderer>
                                                {function renderer(data) {
                                                    return (
                                                        <td className={this.getTdClasses()}>
                                                            <strong>&#123;{data.key}&#125;</strong>
                                                            <br/>
                                                            <span>{data.description}</span>
                                                        </td>
                                                    );
                                                }}</Table.FieldRenderer>
                                        </Table.Field>
                                        <Table.Field name="entity" align="left" label="Entity" sort="entity"/>
                                        <Table.Field name="attribute" align="left" label="Attribute" sort="attribute"/>
                                        <Table.Actions>
                                            <Table.EditAction label="Edit" onClick={showView('variableModal')}/>
                                            <Table.DeleteAction/>
                                        </Table.Actions>
                                    </Table.Row>
                                    <Table.Empty/>
                                </Table.Table>
                            </Ui.List.ApiContainer>
                        </view>
                    )}
                </Ui.ViewSwitcher.View>

                <Ui.ViewSwitcher.View view="variableModal" modal>
                    {(showView, data) => <NotificationVariableModal {...{showView, data}} />}
                </Ui.ViewSwitcher.View>
            </Ui.ViewSwitcher.Container>
        );
    }
};

export default NotificationVariableList;