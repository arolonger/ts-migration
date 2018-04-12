declare class CustomSelectList {
    selected: KnockoutObservable<any>

    constructor(params: {
        data: Array<any>,
        displayField: string,
        valueField: string,
        validationElement: KnockoutObservable<any>,
        onElementSet: Function,
        observable: KnockoutObservable<any>,
        htmlID: string
    });

    refresh(data: Array<any>): void;
}