/*
 * @isFocusActive - after focus,
 * @loadInProgress - loader,
 * @listID - string with list ID,
 * @data - object with current data,
 * @selected - selected object but in transfer description it's not an object!
 * @isListFiltering
 * Here you can define, how to find in whole collection selected string or object but with pricised statement. ( _.findIndex(this.data(), value) )
 * @beneficiaryCase - tag beneficiary list with true value and then all magic will happenend
 */

class CommonCombobox {
    constructor(params) {
        let defaultParams = {
            isListFiltering: ko.observable(false),
            beneficiaryCase: false
        }

        params = _.defaults(params, defaultParams);

        this.isFocusActive = params.isFocusActive;
        this.loadInProgress = params.loadInProgress;
        this.listID = params.listID;
        this.data = params.data;
        this.selected = params.selectedObject;
        this.isListFiltering = params.isListFiltering;
        // flag for beneficiary list which is a little bit different list than others in tranfers
        this.beneficiaryCase = params.beneficiaryCase;
        // some lists - custom select list, and custom select with search have defined valueField params, check it ;)
        this.valueField = params.valueField;

        this.showList = ko.observable(false).extend({ notify: 'always' }) || ko.observable();

        this.keyboardSupportIndex = -1;
        this.elements;
        this.elementsNumber;
        this.elementHeight;
        this.afterRenderCounter = 0;
        this.scrollableList;
        this.isListLoadedDynamically;
        this.scrollTriggered = false;
        this.focusFlag = false;
        this.parentPX;
        this.elementPX;
        this.distancePX;

        this.scrollList = (value) => {
            if (_.isUndefined(this.scrollableList)) {
                return true;
            } else {
                this.scrollableList.scrollTop(value);
            }
        };

        /* add class to highlight selected element */
        this.markAsActive = (idx) => {
            this.getElements();
            $(this.elements).removeClass('js-focus');
            $(this.elements[idx]).addClass('js-focus');

            //var list = this.scrollableList;
            //var el = this.scrollableList.find('.js-focus');
            //if (el !== undefined && list !== undefined) {
            //    var parentPX = list.offset().top;
            //    var elementPX = el.offset().top;
            //    var distancePX = elementPX - parentPX;
            //    console.log(distancePX);
            //}
        };

        this.arrowControlHandler = (d, e) => {
            switch (e.which) {
                case 27: {
                    // future close list event
                    break;
                }
                case 40: {
                    e.preventDefault();
                    this.moveAndMarkAsFocused('forward');
                    break;
                }
                case 38: {
                    e.preventDefault();
                    this.moveAndMarkAsFocused('back');
                    break;
                }
                case 13: {
                    e.preventDefault();
                    this.scrollableList.find('.js-focus').trigger('mousedown');
                    this.elements.removeClass('js-focus');
                    return true;
                    break;
                }
                case 9: {
                    this.showList(false);
                    return true;
                    break;
                }
                default: {
                    return true;
                }
            }
        }

        this.moveAndMarkAsFocused = (direction) => {
            if (direction == 'forward') {
                this.keyboardSupportIndex++;
            } else if (direction == 'back') {
                this.keyboardSupportIndex--;
            }

            if (this.isListLoadedDynamically && this.keyboardSupportIndex === this.elementsNumber) {
                this.scrollableList.trigger('ps-y-reach-end');
                this.scrollTriggered = true;
            }

            /* keep min, max value, load if list is dynamic */
            if (this.keyboardSupportIndex < -1) {
                this.keyboardSupportIndex = -1;

            } else if (this.keyboardSupportIndex === this.elementsNumber) {
                this.keyboardSupportIndex = this.elementsNumber - 1;
            }

            this.markAndScroll(this.keyboardSupportIndex);
        }
        // to remove
        //this.updateIndex = (el) => {
        //    this.keyboardSupportIndex = $(this.elements).index(el);
        //}

        /* use this method to check if your list has selected element ex. transfer description */
        this.amIOnTheList = () => {
            return this.keyboardSupportIndex !== -1 ? true : false;
        }

        this.getElements = () => {
            // we use it to make sure, that elements were render, because loader == hide is not enought
            let listID = $("#" + this.listID);

            this.elements = listID.find('.list-element').not('.no-results');
            this.elementsNumber = this.elements.length;
            this.elementHeight = $(this.elements).outerHeight() + 1;
            this.scrollableList = listID.find('.js-scrollbar');
            this.isListLoadedDynamically = listID.find('.js-lazy').length;
        }

        this.hoverEvent = (d, e) => {
            $(this.elements).removeClass('js-focus');
            $(e.target).addClass('js-focus');
        }

        /* subscribes */
        this.isFocusActive.subscribe((isFocused) => {
            if (isFocused) {
                let shouldIFocusAfterFinishLoading = this.loadInProgress();

                if (shouldIFocusAfterFinishLoading) {
                    this.focusFlag = true;
                }

                this.getElements();
            } else {
                return true;
            }
        });

        this.loadInProgress.subscribe((value) => {
            // loaded all data here
            if (!value) {
                if (this.focusFlag) {
                    let comboboxFocused = $(document.activeElement);
                    if (comboboxFocused.length) {
                        comboboxFocused.trigger('focusout').trigger('focus');
                        this.focusFlag = false;
                    }
                }
            }
        });

        this.isListFiltering.subscribe((value) => {
            this.getElements();

            if (this.beneficiaryCase && value == "") {
                this.keyboardSupportIndex = -1;
                this.markAsActive(this.keyboardSupportIndex);
                this.scrollList(0);
                return true;
            }

            if (value && !_.isUndefined(this.scrollableList) && this.scrollableList.length > 0) {
                this.scrollableList.perfectScrollbar('update');
                this.keyboardSupportIndex = -1;
                this.markAsActive(this.keyboardSupportIndex);
                this.scrollList(0);
            } else {
                //removed temporary, if see any problems with list, check it at first
                //let idx = this.findSelectedIndex();
                //this.markAndScroll(idx);
            }
        });
        /* end of subscribes */

        /* bindings */
        this.afterRender = this.afterRender.bind(this);
        this.findSelectedIndex = this.findSelectedIndex.bind(this);
        this.clickEvent = this.clickEvent.bind(this);
        this.markAndScroll = this.markAndScroll.bind(this);
        /* end of bindings */
    }

    markAndScroll(idx) {
        // setTimeout for IE9
        setTimeout(() => {
            this.markAsActive(idx);
            this.scrollList(idx * this.elementHeight);
        }, 0);
    }

    clickEvent(d, e) {
        $(e.currentTarget).find('.input').focus();
    }

    focusEventCallback() {
        $('.js-exp-list').trigger('hide');
        this.showList(true);

        this.getElements();
        if (_.isUndefined(ko.unwrap(this.selected()))) {
            //this.markAsActive(-1);
            //this.scrollList(0);
            //this.keyboardSupportIndex = -1;
            //console.log('click');
        } else {
            let idx = this.findSelectedIndex();

            this.markAndScroll(idx);
            this.keyboardSupportIndex = idx;
        }
        return true;
    }

    findSelectedIndex() {
        let value = ko.unwrap(this.selected());
        if (_.isUndefined(value)) {
            return -1;
        } else {
            if (_.isNull(this.valueField) || _.isUndefined(this.valueField)) {
                return _.findIndex(this.data(), value);
            } else {
                return _.findIndex(this.data(), (customObject) => { return customObject[this.valueField] == value; });
            }
        }
    }

    afterRender(o, currentRenderer) {
        let lastFromData = this.data()[this.data().length - 1];

        // if render done
        if (_.isMatch(currentRenderer, lastFromData)) {
            this.getElements();

            // set new downloaded elements at the top of the list - ex. beneficiary list
            if (this.scrollTriggered) {
                this.keyboardSupportIndex += 1;
                this.markAndScroll(this.keyboardSupportIndex);
                this.scrollTriggered = false;
            }

            if (this.focusFlag) {
                this.markAndScroll(this.keyboardSupportIndex);
            }
        }
    }
}