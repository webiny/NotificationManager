import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class NotificationVariableForm extends Webiny.Ui.View {

    constructor(props) {
        super(props);

        this.state = {
            data: props.data
        };
    }

}

NotificationVariableForm.defaultProps = {
    renderer() {
        const formProps = {
            ui: _.get(this.props, 'name', 'variableForm'),
            api: '/entities/notification-manager/notification-variable',
            fields: '*',
            defaultModel: _.merge({}, {notification: Webiny.Router.getParams('id')}, this.props.data),
            onSubmitSuccess: () => {
                this.ui('variableList').loadData();
                this.ui('notificationVariableEditModal').hide();
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
            textAttr: 'name',
            minimumResultsForSearch: 5,
            optionRenderer: option => {
                return (
                    <div>
                        <strong>{option.name}</strong>
                        <br/>
                        <span>{option.class}</span>
                    </div>
                );
            },
            selectedRenderer: option => {
                return option.name;
            }
        };

        const attributeSelect = {
            label: 'Attribute',
            name: 'attribute',
            placeholder: 'Select Attribute',
            allowClear: true,
            api: '/services/core/entities/attributes',
            fields: 'tag,name',
            perPage: 2,
            valueAttr: 'name',
            textAttr: 'name',
            filterBy: ['entity', 'entity'],
            minimumResultsForSearch: 5,
            optionRenderer: option => {
                return (
                    <div>
                        <strong>{option.name}</strong>
                        <br/>
                        <span>{option.type}</span>
                    </div>
                );
            },
            selectedRenderer: option => {
                return option.name;
            }
        };

        let formButtons = null;
        if (this.props.showButtons === true) {
            formButtons = (<div>
                <Ui.Button type="primary" align="right" onClick={this.ui('variableForm:submit')} label="Submit"/>
                <Ui.Button type="secondary" align="right" onClick={this.ui('variableForm:reset')} label="Reset"/>
            </div>);
        }

//		this.ui('variableForm').setData(this.props.data);


        return (
            <Ui.Form.ApiContainer {...formProps}>

                <Ui.Form.Form layout={false}>
                    <fields>
                        <Ui.Input label="Variable Name" name="key" validate="required" />

                        <Ui.Select {...entitySelect}/>

                        <Ui.Select {...attributeSelect}/>

                        <Ui.Input label="Description" name="description" />

                        <Ui.Hidden name="notification" />

						{formButtons}

                    </fields>
                </Ui.Form.Form>

            </Ui.Form.ApiContainer>
        );
    }
};


export default NotificationVariableForm;
