class HelloViewModel {
    teamName: KnockoutObservable<string>
    devName: KnockoutObservable<string>
    button: Button
    button2: Button
    button3: Button
    buttonTS: ButtonTS
    buttonTS2: ButtonTS
    buttonTS3: ButtonTS
    link: Link 

    constructor(teamName: string, devName: string) {
        this.teamName = ko.observable(teamName);
        this.devName = ko.observable(devName);

        this.button = new Button({
            text: "Switch values",
            onClick: this.switchValues.bind(this)
        });

        this.button2 = new Button({
            text: "Switch values",
            onClick: this.switchValues.bind(this),
            type: Button.type.second
        });

        this.button3 = new Button({
            text: "Switch values",
            onClick: this.switchValues.bind(this),
            type: Button.type.additional
        });

        this.buttonTS = new ButtonTS({
            text: "TS",
            onClick: this.switchValues.bind(this),
        });

        this.buttonTS2 = new ButtonTS({
            text: "TS2",
            onClick: this.switchValues.bind(this),
            type: ButtonTSType.second
        });

        this.buttonTS3 = new ButtonTS({
            text: "TS3",
            onClick: this.switchValues.bind(this),
            type: ButtonTSType.additional
        });

        this.link = new Link({
            text: "Link",
            onClick: this.switchValues.bind(this),
        });

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

        ko.components.register("mnlink", {
            viewModel: { instance: this.link },
            template: `
            <div class="MNLink">
                <a class="MNLink-element" data-bind="
                    click: _onClick, 
                    clickBubble: _clickBubble(),
                    text: _text,
                    css: _css,
                    attr: { href: _href }"></a>
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