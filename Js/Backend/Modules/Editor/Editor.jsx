import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class Editor extends Webiny.Ui.Component {
    constructor(props) {
        super(props);

        this.bindMethods(
            'detectVariable',
            'renderOption',
            'selectItem',
            'selectCurrent',
            'selectNext',
            'selectPrev',
            'getCurrentIndex'
        );

        this.state = {
            insertAt: null,
            options: null,
            selectedOption: null
        };
    }

    componentDidMount() {
        super.componentDidMount();

        this.editor = this.refs.editor.getEditor();

        this.editor.on('text-change', (delta, oldDelta, source) => {
            if (source === 'user') {
                this.detectVariable();
            }
        });

        // 38 = UP, 40 = DOWN, 27 = ESCAPE, 13 = ENTER
        this.editor.keyboard.addBinding({key: 38}, () => {
            if (this.state.options) {
                this.selectPrev();
                return false;
            }
            return true;
        });

        this.editor.keyboard.addBinding({key: 40}, () => {
            if (this.state.options) {
                this.selectNext();
                return false;
            }
            return true;
        });

        this.editor.keyboard.addBinding({key: 27}, () => {
            if (this.state.options) {
                this.setState({options: null});
                return false;
            }
            return true;
        });

        // Need to use this hacky solution to execute my handler before all others
        this.editor.keyboard.bindings[13].unshift({
            key: 13, handler: () => {
                if (this.state.options) {
                    this.selectCurrent();
                    return false;
                }
                return true;
            }
        });

        window.qe = this.editor;
    }

    detectVariable() {
        const selection = this.editor.getSelection();
        const text = this.editor.getText(0, selection.index);
        let variable = null;

        if (text.endsWith('{$')) {
            // Show list of notification variables
            this.setState({
                insertAt: selection.index,
                selectedOption: 0,
                options: this.props.variables
            });
            return;
        }

        if (text.endsWith('.')) {
            for (let i = selection.index; i >= 0; i--) {
                if (text[i] === '{' && text[i + 1] === '$') {
                    variable = text.substring(i + 2, text.length - 1);
                    break;
                }
            }

            if (variable) {
                console.log("DETECTED VARIABLE", variable);
                this.setState({
                    insertAt: selection.index,
                    selectedOption: 0,
                    options: [
                        {key: 'number'},
                        {key: 'dueDate'},
                        {key: 'total'}
                    ]
                });
            } else {
                this.setState('options', null);
            }
            return;
        }

        // See if a partial variable name is typed in and filter options based on that
        for (let i = selection.index - 1; i >= 0; i--) {
            if (typeof text[i] == 'undefined' || text[i] === ' ') {
                break;
            }

            if (text[i] === '{' && text[i + 1] === '$') {
                variable = text.substring(i + 2, selection.index);
                let options = _.filter(this.props.variables, v => v.key.startsWith(variable));
                if (!options) {
                    this.setState({options: null});
                    return;
                } else {
                    options = _.map(options, opt => {
                        opt.insertValue = opt.key.length <= variable.length ? '' : opt.key.substring(variable.length);
                        return opt;
                    });
                    this.setState({
                        insertAt: selection.index,
                        selectedOption: 0,
                        options
                    });
                    return;
                }
            }
        }

        this.setState({options: null});
    }

    getCurrentIndex() {
        const selection = this.editor.getSelection(true);
        return selection.index;
    }

    renderOption(item, index) {
        const itemClasses = {
            'variable-option': true,
            'text-left': true,
            selected: index === this.state.selectedOption
        };

        const linkProps = {
            onMouseDown: () => this.selectItem(item),
            onMouseOver: () => this.setState({selectedOption: index})
        };

        return (
            <li key={index} className={this.classSet(itemClasses)} {...linkProps}>
                <span className="title"><Ui.Icon icon="fa-cube"/> {item.key}</span>
                {item.description ? <span className="description">{item.description}</span> : null}
                <span className="type">{item.type === 'entity' ? item.entity : 'Custom variable'}</span>
            </li>
        );
    }

    selectItem(item) {
        console.log("selected", item);
        const insert = _.has(item, 'insertValue') ? item.insertValue : item.key;
        this.editor.insertText(this.state.insertAt, insert);
        this.editor.setSelection(this.state.insertAt + _.get(insert, 'length', 0));
        this.setState({options: null, insertAt: null});
    }

    selectNext() {
        if (!this.state.options) {
            return;
        }

        let selected = this.state.selectedOption + 1;
        if (selected >= this.state.options.length) {
            selected = this.state.options.length - 1;
        }

        this.setState({
            selectedOption: selected
        });
    }

    selectPrev() {
        if (!this.state.options) {
            return;
        }

        let selected = this.state.options.length - 1;
        if (this.state.selectedOption <= selected) {
            selected = this.state.selectedOption - 1;
        }

        if (selected < 0) {
            selected = 0;
        }

        this.setState({
            selectedOption: selected
        });
    }

    selectCurrent() {
        if (!this.state.options) {
            return;
        }

        if (this.state.selectedOption === -1) {
            return;
        }

        const current = this.state.options[this.state.selectedOption];
        this.selectItem(current);
    }
}

Editor.defaultProps = {
    imageApi: '/entities/core/images',
    accept: ['image/jpg', 'image/jpeg', 'image/gif', 'image/png'],
    sizeLimit: 2485760,
    label: null,
    description: null,
    info: null,
    tooltip: null,
    toolbar: [
        ['bold', 'italic', 'underline', 'strike'],
        ['link'],
        [{'list': 'ordered'}, {'list': 'bullet'}],
        [{'indent': '-1'}, {'indent': '+1'}],
        [{'size': ['small', false, 'large', 'huge']}],
        [{'header': [1, 2, 3, 4, 5, 6, false]}],
        [{'color': []}, {'background': []}],
        [{'font': []}],
        [{'align': []}],
        ['clean']
    ],
    renderer() {
        let label = null;
        if (this.props.label) {
            let tooltip = null;
            if (this.props.tooltip) {
                tooltip = <Ui.Tooltip target={<Ui.Icon icon="icon-info-circle"/>}>{this.props.tooltip}</Ui.Tooltip>;
            }
            label = <label className="control-label">{this.props.label} {tooltip}</label>;
        }

        let info = this.props.info;
        if (_.isFunction(info)) {
            info = info(this);
        }

        let description = this.props.description;
        if (_.isFunction(description)) {
            description = description(this);
        }

        let dropdownMenu = null;
        if (this.state.options) {
            const bounds = this.editor.getBounds(this.state.insertAt);
            const toolbarHeight = this.editor.getModule('toolbar').container.offsetHeight + 15;
            dropdownMenu = (
                <div className="search" style={{top: bounds.top + toolbarHeight, left: bounds.left}}>
                    <div className="autosuggest">
                        <div className="plain-search">
                            <ul>{this.state.options.map(this.renderOption)}</ul>
                        </div>
                    </div>
                </div>
            );
        }

        const passProps = ['accept', 'imageApi', 'sizeLimit', 'toolbar', 'valueLink'];

        return (
            <div className="form-group">
                {label}
                <span className="info-text">{info}</span>
                <div className="notification-manager-editor">
                    <Ui.HtmlEditor ref="editor" {..._.pick(this.props, passProps)}/>
                    {dropdownMenu}
                </div>
                <span className="help-block">{description}</span>
            </div>
        );
    }
};

export default Editor;
