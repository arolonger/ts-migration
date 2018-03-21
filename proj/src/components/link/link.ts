/**
 * Link class
 */
class Link {
    /**
     * 
     * @param {boolean} [params.clickBubble=false] - prevent bubbling for click event
     * @param {string} [params.css=""] - pass css class to customize link, variants defined inside
     * @param {string} params.text - link's text
     * @param {function} params.onClick - function called on click
     * @param {string} params.href - href to <a> element
     */
    constructor(params) {
        let defaultParams = {
            clickBubble: false,
            css: ""
        }

        params = _.defaults(params, defaultParams);

        this._text = params.text;
        this._clickBubble = ko.observable(params.clickBubble);
        this._onClick = params.onClick;
        this._href = params.href;
        this._css = params.css !== "" ? this._getStyle(params.css) : params.css;
    }

    /**
     * 
     * @param {string} css - decorator name
     * @returns {string} css class to add
     */
    _getStyle (css) {
        switch (css) {
            case "square":
                return "square";
            
            default:
                throw "can't match your css parameter to possible options";
        }
    }
}