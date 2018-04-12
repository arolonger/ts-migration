class HelloViewModel {
    teamName: KnockoutObservable<string>
    devName: KnockoutObservable<string>
    button: Button
    button2: Button
    button3: Button
    buttonTS: ButtonTS
    buttonTS2: ButtonTS
    buttonTS3: ButtonTS
    list: CustomSelectList

    constructor(teamName: string, devName: string) {
        this.teamName = ko.observable(teamName);
        this.devName = ko.observable(devName);

        this.button = new Button({
            text: "Button",
            onClick: this.switchValues.bind(this),
        });

        this.button2 = new Button({
            text: "Button",
            onClick: this.switchValues.bind(this),
            type: Button.type.second
        });

        this.button3 = new Button({
            text: "Button",
            onClick: this.switchValues.bind(this),
            type: Button.type.additional
        });

        this.buttonTS = new ButtonTS({
            text: "ButtonTS",
            onClick: this.switchValues.bind(this),
        });

        this.buttonTS2 = new ButtonTS({
            text: "ButtonTS",
            onClick: this.switchValues.bind(this),
            type: ButtonTSType.second
        });

        this.buttonTS3 = new ButtonTS({
            text: "ButtonTS",
            onClick: this.switchValues.bind(this),
            type: ButtonTSType.additional
        });

        this.list = new CustomSelectList({
            data: [],
            displayField: "display",
            validationElement: ko.observable(),
            valueField: "value",
            onElementSet: () => {
                console.log('lalla');
            },
            observable: ko.observable(),
            htmlID: "Hej"
        });

        this.list.refresh([
            {
                "display": "element1",
                "value": 0
            }
        ]);

        ko.components.register("mnbutton", {
            viewModel: {
                createViewModel: (params) => {
                    return params.instance;
                }
            },
            template: `
            <button data-bind="text: _text, click: _onClick, css: _css"></button>
            `
        });

        ko.components.register("mncustomselectlist", {
            viewModel: { instance: this.list },
            template: `
            <div class="MNDropDownList js-closedropdownlist">
            <div class="input-wrapper" data-bind="
                                        click: common.clickEvent, 
                                        attr: { id: htmlID }">
                <span class="js-currentText" data-bind="text: displayValue"></span>
        
                <input class="input js-disabled" data-bind="
                       value: displayValue, 
                       validationElement: validationElement,
                       event: {
                        focus: focusEvent,
                        focusout: focusoutEvent,
                        keydown: common.arrowControlHandler
                       }" readonly />
                <span class="launcher icon icon-arrow-down"></span>
            </div>
        
            <div class="list js-exp-list col-xs-12" data-bind="css: { 'js-show': common.showList }, attr: { id: listID }">
                <div class="js-to-resize">
                    <ul class="list-container js-list-container custom-select-list js-scrollbar" data-bind="
                        foreach: { 
                            data: dataList
                        }">
                        <li class="list-element" data-bind="
                            text: $rawData[$parent.displayField],
                            event: { 
                                mouseenter: $parent.common.hoverEvent,
                                mousedown: $parent.setElement 
                            }"></li>
                    </ul>
                </div>
            </div>
        </div>`
        });
    }

    private switchValues () {
        const teamNameValue = this.teamName();
        const devNameValue = this.devName();

        this.teamName(devNameValue);
        this.devName(teamNameValue);
    }
}