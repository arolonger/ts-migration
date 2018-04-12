/**
 * Button class for all 3 basic kinds of buttons
 */
class Button {
    /**
     * 
     * @param {object} params - contains belows parameters
     * @param {function} params.onClick -action executed on button click
     * @param {string} params.text - text displayed on the button
     * @param {function} [params.type=Button.type.main] - property which decide about how button looks like.
     */
    constructor(params) {
        let defaultParams = {
            type: Button.type.main
        }

        params = _.defaults(params, defaultParams);

        this._text = params.text;

        this._onClick = params.onClick;

        this._css = params.type;
    }

    /**
     * ENUM returning type of button
     */
    static get type() {
        return {
            main: 'main-button',
            second: 'secondary-button',
            additional: 'additional-button'
        }
    }
}