/**
 * Button class for all 3 basic kinds of buttons
 */

enum ButtonTSType {
    main = 'main-button',
    second = 'secondary-button',
    additional = 'additional-button'
}

class ButtonTS {
    private _text: string
    private _onClick: Function
    private _css: ButtonTSType
    /**
     * 
     * @param {function} params.onClick -action executed on button click
     * @param {string} params.text - text displayed on the button
     * @param {function} [params.type=Button.type.main] - property which decide about how button looks like.
     */
    constructor(params: { text: string, onClick: Function, type?: ButtonTSType}) {
        let defaultParams = {
            type: ButtonTSType.main
        }

        params = _.defaults(params, defaultParams);

        this._text = params.text;

        this._onClick = params.onClick;

        this._css = params.type;
    }
}