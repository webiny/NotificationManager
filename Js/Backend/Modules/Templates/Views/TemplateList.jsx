import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
const Table = Ui.List.Table;

class TemplateList extends Webiny.Ui.View {
    constructor(props) {
        super(props);
    }
}

TemplateList.defaultProps = {

    renderer() {
        const listProps = {
            api: '/entities/notification-manager/templates',
            fields: 'name,createdOn',
            searchFields: 'name',
            connectToRouter: true
        };

        const searchProps = {
            placeholder: 'Search by name',
            name: '_searchQuery'
        };

        return (
            <Ui.View.List>
                <Ui.View.Header title="Templates">
                    <Ui.Link type="primary" align="right" route="NotificationManager.Template.Create">
                        <Ui.Icon icon="icon-plus-circled"/>
                        Create new Template
                    </Ui.Link>
                </Ui.View.Header>

                <Ui.View.Body>
                    <Ui.List.ApiContainer ui="templateList" {...listProps}>

                        <Ui.List.FormFilters>
                            {(applyFilters, resetFilters) => (
                                <Ui.Grid.Row>
                                    <Ui.Grid.Col all={10}>
                                        <Ui.Input {...searchProps} onEnter={applyFilters()}/>
                                    </Ui.Grid.Col>
                                    <Ui.Grid.Col all={2}>
                                        <Ui.Button type="secondary" align="right" label="Reset Filter" onClick={resetFilters()}/>
                                    </Ui.Grid.Col>
                                </Ui.Grid.Row>
                            )}
                        </Ui.List.FormFilters>

                        <Table.Table>
                            <Table.Row>
                                <Table.Field name="name" align="left" label="Name" sort="name"/>
                                <Table.TimeAgoField name="createdOn" align="left" label="Created On" sort="createdOn"/>

                                <Table.Actions>
                                    <Table.EditAction route="NotificationManager.Template.Edit"/>
                                    <Table.DeleteAction/>
                                </Table.Actions>
                            </Table.Row>
                        </Table.Table>

                        <Ui.List.Pagination/>
                    </Ui.List.ApiContainer>
                </Ui.View.Body>
            </Ui.View.List>
        );
    }
};

export default TemplateList;