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

            </Ui.Grid.Row>
        );
    }
};

export default TemplateList;