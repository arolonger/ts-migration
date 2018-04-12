interface ButtonType {
    main,
    second,
    additional
}

declare class Button {
    constructor(params: {
        text: string,
        onClick: Function,
        type?: ButtonType
    });

    static type: ButtonType;

    exampleMethodThatDoesntExists(data: number): void;
}