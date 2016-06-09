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
            <Ui.Grid.Row>
                <Ui.Grid.Col all={12}>
                    <h2>
                        <Ui.Grid.Row>
                            <Ui.Grid.Col all={10}>
                                Templates
                            </Ui.Grid.Col>
                            <Ui.Grid.Col all={2}>
                                <Ui.Link type="primary" align="right" route="NotificationManager.Template.Create">Create new Templateb</Ui.Link>
                            </Ui.Grid.Col>
                        </Ui.Grid.Row>
                    </h2>
                </Ui.Grid.Col>
                <Ui.Grid.Col all={12}>
                    <Ui.List.ApiContainer ui="templateList" {...listProps}>

                        <Ui.List.FormFilters>
                            {(applyFilters, resetFilters) => (
                                <Ui.Grid.Row>
                                    <Ui.Grid.Col all={10}>
                                        <Ui.Input {...searchProps} onEnter={applyFilters()}/>
                                    </Ui.Grid.Col>
                                    <Ui.Grid.Col all={2}>
                                        <Ui.Button type="primary" label="Filter" onClick={applyFilters()}/>
                                        <Ui.Button type="secondary" label="Reset" onClick={resetFilters()}/>
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

                            <Table.Empty/>
                        </Table.Table>

                        <Ui.List.Pagination/>
                    </Ui.List.ApiContainer>
                </Ui.Grid.Col>

            </Ui.Grid.Row>
        );
    }
};

export default TemplateList;