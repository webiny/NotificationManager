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
            defaultQuery: {notification: Webiny.Router.getParams('id'), '_sort': 'key'},
            fields: '*',
            connectToRouter: true,
            perPage: 1000
        };

        return (
            <variable-list>
                <Ui.List.ApiContainer ui="variableList" {...listProps}>
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
                                }}
                                </Table.FieldRenderer>
                            </Table.Field>
                            <Table.Field name="entity" align="left" label="Entity" sort="entity"/>
                            <Table.Field name="attribute" align="left" label="Attribute" sort="attribute"/>
                            <Table.Actions>
                                <Ui.List.Table.ModalAction label="Edit">
									{(data, actions, modalActions) => {
                                        return (
                                            <NotificationVariableModal ui="notificationVariableEditModal" data={data}/>
                                        );
                                    }}
                                </Ui.List.Table.ModalAction>
                                <Table.DeleteAction/>
                            </Table.Actions>


                        </Table.Row>
                        <Table.Empty/>
                    </Table.Table>
                </Ui.List.ApiContainer>
            </variable-list>

        );
    }
};

export default NotificationVariableList;