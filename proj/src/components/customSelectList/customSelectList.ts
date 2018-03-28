/*
 * This control can be used as a simple list, wihtout any filters, just open - select - close. * 
 * In tax, zus transfer we have to call some action after change value ex. focus
 * You can define callbackAfterSetElement outside CustomSelectList model.
 */

class CustomSelectList {
    constructor(params) {
        //initialization
        let defaultParams = {
            data: ko.observableArray([]),
            displayField: null,
            valueField: null,
            validationElement: params.observable,
            onElementSet: () => { }
        }

        params = _.defaults(params, defaultParams);

        if (!params.observable || !ko.isObservable(params.observable)) {
            throw "Observable is required";
        }

        if (!params.htmlID) {
            throw "Parameter htmlID is required";
        }

        this.selected = params.observable;
        this.displayValue = ko.observable();

        this.displayField = params.displayField;
        this.valueField = params.valueField;
        this.htmlID = params.htmlID;
        this.listID = params.htmlID + "List";
        this.validationElement = params.validationElement;
        this._onElementSet = params.onElementSet;
        this.callbackAfterSetElement = params.callbackAfterSetElement;
        this.focusStatus = ko.observable(false);

        this._flatObjectStructure = this.displayField ? false : true;

        this.dataList = ko.isObservable(params.data) ? params.data : ko.observableArray(params.data);

        this.loadInProgress = ko.observable(false);

        if (this.selected()) {
            let selectedElement = this.valueField ? this.findElementByValue(this.selected()) : this.selected();
            this._setDisplayValue(selectedElement);
        }
        //end of initialization

        //computed
        this.loader = ko.pureComputed(() => {
            return this.loadInProgress() ? "js-loading" : '';
        });

        //end of computed

        //subscriptions
        this.selected.subscribe((newValue) => {
            newValue = ko.unwrap(newValue);

            let selectedElement = this.valueField ? this.findElementByValue(newValue) : newValue;
            this._setDisplayValue(selectedElement);
        });
        //end of subscriptions

        this.common = new CommonCombobox({
            isFocusActive: this.focusStatus,
            loadInProgress: this.loadInProgress,
            listID: this.listID,
            data: this.dataList,
            selectedObject: this.selected,
            valueField: this.valueField
        });

        this.setElement = this.setElement.bind(this);
    }

    setElement(clicked) {
        this._setDisplayValue(clicked);
        this._setObservable(clicked);
        this._onElementSet();

        this.common.showList(false);

        if (!_.isUndefined(this.callbackAfterSetElement)) {
            this.callbackAfterSetElement();
        }
    }

    setElementByValue(value) {
        if (!this.valueField) {
            throw "Operation not allowed";
        }

        let elementToSet = this.findElementByValue(value)
        if (elementToSet) {
            this.setElement(elementToSet);
        }
    }

    setFirstElementFromList() {
        if (!_.isUndefined(this.dataList()[0])) {
            this._setObservable(this.dataList()[0]);
            this.selected.valueHasMutated();
            this._onElementSet();
        }
    }

    _setObservable(clicked) {
        if (this.valueField) {
            clicked = ko.unwrap(clicked);
            this.selected(clicked[this.valueField]);
        } else {
            this.selected(clicked);
        }
    }

    _setDisplayValue(clicked) {
        clicked = ko.unwrap(clicked);
        if (!clicked) {
            this.displayValue("");
        } else if (this._flatObjectStructure) {
            this.displayValue(clicked);
        } else {
            this.displayValue(clicked[this.displayField]);
        }
    }

    findElementByValue(value) {
        if (!this.valueField) {
            throw "Operation not allowed";
        }

        return _.find(this.dataList(), (el) => {
            el = ko.unwrap(el);
            if (!el) {
                return false;
            }
            return el[this.valueField] == value;
        });
    }

    focusEvent() {
        this.focusStatus(true);

        this.common.focusEventCallback();
    }

    focusoutEvent() {
        this.focusStatus(false);
    }

    /*
     * @params
     * data: after successfull ajax request invoke refresh function with reference to new data source
     */
    refresh(data) {
        this.dataList(ko.isObservable(data) ? data() : data);
    }
}