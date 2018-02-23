var chSlider = (function () {
    'use strict';
    var _defaultConfig = { width: '300px', height: '0.2em', sliderId: 'slider', sliderColor: '#E0E0E0', fillColor: 'blue', thumbClass: 'thumb', thumbRadius: '25px', thumbColor: "green", thumbHoverColor: "yellow", startRange: 0, endRange: 100, step: 1, value: 0, displayValue: true, onchange: function (e) { } };

    function chSlider(config, customDocument) {

        // document environment
        chSlider.prototype.document = customDocument || document;

        // initial custom configuration
        this._config = _initConfig(config);

        // initialization UI elements
        this._UIElements = this._getUIElements(this._config);

        // initial styles of the slider
        this._setStyles();

        // set and render initial value
        this._value = this.getValue();
        this.setValue(this._config.value);

        // bind events
        this._bindEvent();
    }

    chSlider.prototype.getDefaultConfig = function () {
        return this._defaultConfig;
    }

    chSlider.prototype.getCurrentConfig = function () {
        return this._config;
    }

    chSlider.prototype.getUIElements = function () {
        return this._UIElements;
    }

    chSlider.prototype.getValue = function () {
        return this._value ? this._value : this.getCurrentConfig().startRange;
    }

    chSlider.prototype.setValue = function (value) {
        if (typeof value !== 'number' || isNaN(value)) return;

        if (value < this.getCurrentConfig().startRange) value = this.getCurrentConfig().startRange;
        if (value > this.getCurrentConfig().endRange) value = this.getCurrentConfig().endRange;
        this._value = value;

        this._moveThumbTo(this._value);
        return this.getValue();
    }


    chSlider.prototype._animateMouseDown = function () {
        this.getUIElements().thumb.style.background = this.getCurrentConfig().thumbHoverColor;
        this.getUIElements().thumb.style.border = '0.2em solid ' + this.getCurrentConfig().thumbHoverColor;
        this.getUIElements().thumb.style.top = '-0.6em';
        this.getUIElements().filling.style.top = '-1.4em';
    }

    chSlider.prototype._animateMouseUp = function () {
        this.getUIElements().thumb.style.background = this.getCurrentConfig().thumbColor;
        this.getUIElements().thumb.style.width = '1em';
        this.getUIElements().thumb.style.height = '1em';
        this.getUIElements().thumb.style.border = 'none';
        this.getUIElements().thumb.style.top = '-0.4em';
        this.getUIElements().filling.style.top = '-1em';
    }

    chSlider.prototype._moveThumbTo = function (value) {
        var left = this._calcThumbPositionByValue(value);
        this.getUIElements().thumb.style.left = left + 'px';
    }

    chSlider.prototype._renderFillRange = function () {

        var filling = this.document.createElement('div');
        filling.className += " filling";
        this.getUIElements().slider.appendChild(filling);
        this._UIElements.filling = filling;
    }

    chSlider.prototype._renderDisplay = function () {
        var display = this.document.createElement('span');
        display.className += " ch-value";
        this.getUIElements().slider.appendChild(display);
        this._UIElements.display = display;
    }

    chSlider.prototype._updateDisplayValue = function () {
        this.getUIElements().display.innerHTML = this.getValue();
    }

    chSlider.prototype._bindEvent = function () {
        this._bindMouseEvent();
        this._bindTouchEvent();

        this.valueChanged = function () {
            this.getCurrentConfig().onchange(this.getValue());

            if (this.getCurrentConfig().displayValue) this._updateDisplayValue();
        }
    }

    chSlider.prototype._bindMouseEvent = function () {
        this.getUIElements().thumb.onmousedown = function (event) {
            event = event || this._fixEvent.call(this, window.event);

            this._animateMouseDown();

            var thumbCoords = this._getCoords(this.getUIElements().thumb);
            var shiftX = event.pageX - thumbCoords.left;
            var sliderCoords = this._getCoords(this.getUIElements().slider);

            this.document.onmousemove = function (event) {
                event = event || this._fixEvent.call(this, window.event);;

                //  calculate parent coordinate, since position is relative
                var newLeft = event.pageX - shiftX - sliderCoords.left;
                this._renderThumb(newLeft);
            }.bind(this);

            this.document.onmouseup = function (event) {
                this._animateMouseUp();
                this.document.onmousemove = this.document.onmouseup = null;
            }.bind(this);

            return false; // disable selection start (cursor change)
        }.bind(this);

        this.getUIElements().thumb.ondragstart = function () {
            return false;
        };

        this.getUIElements().slider.onclick = function (event) {
            event = event || this._fixEvent.call(this, window.event);
            var sliderCoords = this._getCoords(this.getUIElements().slider);
            var newLeft = event.pageX - sliderCoords.left - this.getUIElements().thumb.offsetWidth / 2;
            
            this._renderThumb(newLeft);
        }.bind(this);
    }

    chSlider.prototype._renderThumb = function (newLeft) {
        // if the cursor is outside the slider
        if (newLeft < - this.getUIElements().thumb.clientWidth / 2) {
            newLeft = -this.getUIElements().thumb.clientWidth / 2;
        }

        var rightEdge = this.getUIElements().slider.offsetWidth - this.getUIElements().thumb.clientWidth / 2;

        if (newLeft > rightEdge) {
            newLeft = rightEdge;
        }

        this._value = this._caclValueByThumbPosition(newLeft + this.getUIElements().thumb.clientWidth / 2);
        this.getUIElements().thumb.style.left = newLeft + 'px';
        this.getUIElements().filling.style.width = newLeft + this.getUIElements().thumb.clientWidth / 2 + 'px';

        this.valueChanged();      
    }

    chSlider.prototype._bindTouchEvent = function () {
        this.getUIElements().thumb.ontouchstart = function (event) {
            event = event || this._fixEvent.call(this, window.event);;

            this._animateMouseDown();

            var thumbCoords = this._getCoords(this.getUIElements().thumb);
            var shiftX = event.targetTouches[0].pageX - thumbCoords.left;
            var sliderCoords = this._getCoords(this.getUIElements().slider);

            this.document.ontouchmove = function (event) {
                event = event || this._fixEvent.call(this, window.event);;

                //  calculate parent coordinate, since position is relative
                var newLeft = event.targetTouches[0].pageX - shiftX - sliderCoords.left;

                this._renderThumb(newLeft);
            }.bind(this);

            this.document.ontouchend = function (event) {
                this._animateMouseUp();
                this.document.ontouchmove = this.document.ontouchend = null;
            }.bind(this);

            return false; // disable selection start (cursor change)
        }.bind(this);
    }

    chSlider.prototype._caclValueByThumbPosition = function (currentRange) {

        var fullRange = this.getUIElements().slider.offsetWidth;
        var sliceRange = fullRange / (this.getCurrentConfig().endRange - this.getCurrentConfig().startRange);
        var result = currentRange / sliceRange + this.getCurrentConfig().startRange;

        // round to step
        result = Math.round(result / this.getCurrentConfig().step) * this.getCurrentConfig().step

        // if round was first and last numbers
        if (result < this.getCurrentConfig().startRange) result = this.getCurrentConfig().startRange;
        if (result > this.getCurrentConfig().endRange) result = this.getCurrentConfig().endRange;
        return result;
    }

    chSlider.prototype._calcThumbPositionByValue = function (value) {
        var sliceRange = this.getUIElements().slider.offsetWidth / (this.getCurrentConfig().endRange - this.getCurrentConfig().startRange);
        var result = sliceRange * (value - this.getCurrentConfig().startRange) - this.getUIElements().thumb.clientWidth / 2;

        return result;
    }

    chSlider.prototype._setStyles = function () {
        // insert filling div
        this._renderFillRange();

        var sliderStyle = this.getUIElements().slider.style,
            thumbStyle = this.getUIElements().thumb.style,
            fillingStyle = this.getUIElements().filling.style;

        // slider styles
        sliderStyle.position = 'relative';
        sliderStyle.width = this.getCurrentConfig().width;
        sliderStyle.maxWidth = '100%';
        sliderStyle.borderRadius = '5px';
        sliderStyle.background = this.getCurrentConfig().sliderColor;
        sliderStyle.MozBackground = '-moz-linear-gradient(left top, #E0E0E0, #EEEEEE) repeat scroll 0 0 transparent';
        sliderStyle.webkitBackground = '-webkit-gradient(linear, left top, right bottom, from(#E0E0E0), to(#EEEEEE))';
        sliderStyle.height = this.getCurrentConfig().height;
        sliderStyle.margin = '1em 0';
        sliderStyle.cursor = 'pointer';

        // thumb styles
        thumbStyle.borderRadius = '1em';
        thumbStyle.webkitBorderRadius = '1em';
        thumbStyle.MozBorderRadius = '1em';
        thumbStyle.behavior = 'url(PIE.htc)';
        thumbStyle.height = '1em';
        thumbStyle.width = '1em';
        thumbStyle.background = this.getCurrentConfig().thumbColor;
        thumbStyle.left = -this.getUIElements().thumb.offsetWidth / 2 + 'px';
        thumbStyle.top = '-0.4em';
        thumbStyle.backgroundClip = 'padding-box';
        thumbStyle.position = 'relative';
        thumbStyle.cursor = 'pointer';
        thumbStyle.zIndex = '10';

        // fill section styles
        fillingStyle.width = this._calcThumbPositionByValue(Math.max(this.getCurrentConfig().value, this.getCurrentConfig().startRange)) + this.getUIElements().thumb.clientWidth / 2 + 'px';
        fillingStyle.position = 'relative';
        fillingStyle.top = '-1em';
        fillingStyle.borderRadius = '5px';
        fillingStyle.background = this.getCurrentConfig().fillColor;
        fillingStyle.MozBackground = '-moz-linear-gradient(left top, #E0E0E0, #EEEEEE) repeat scroll 0 0 transparent';
        fillingStyle.webkitBackground = '-webkit-gradient(linear, left top, right bottom, from(#E0E0E0), to(#EEEEEE))';
        fillingStyle.height = this.getCurrentConfig().height;

        // display styles
        if (this.getCurrentConfig().displayValue) {
            this._renderDisplay();
            var displayStyle = this.getUIElements().display.style;

            displayStyle.position = 'absolute';
            displayStyle.top = '0';
            displayStyle.left = '50%';
            displayStyle.textAlign = 'center';
            this.getUIElements().display.innerHTML = this.getValue();
        }
    }

    function _initConfig(config) {
        // return and display error if invalid configuration type
        if (typeof config !== 'undefined' && (typeof config !== 'object' || config === null)) {
            console.error('Invalid ChSlider configuration. The input argument should be an object, not a ' + typeof config);
            return _defaultConfig;
        };

        // merge custom and default configurations
        return typeof config !== 'undefined' && config !== null ? Object.assign({}, _defaultConfig, config) : _defaultConfig;

    }

    chSlider.prototype._getUIElements = function(config) {
        var UIElements = {};
        UIElements.slider = this.document.getElementById(config.sliderId),
        UIElements.thumb = UIElements.slider.querySelector('.' + config.thumbClass);
        return UIElements;
    }

    chSlider.prototype._getCoords = function(elem) { // except IE8-
        var box = elem.getBoundingClientRect();
        var scrollY = window.scrollY || window.pageYOffset || this.document.documentElement.scrollTop;
        var scrollX = window.scrollX || window.pageXOffset || this.document.documentElement.scrollLeft;
        return {
            top: box.top + scrollY,
            left: box.left + scrollX
        };
    }

    chSlider.prototype._fixEvent = function(e) {

        e.currentTarget = this;
        e.target = e.srcElement;

        if (e.type == 'mouseover' || e.type == 'mouseenter') e.relatedTarget = e.fromElement;
        if (e.type == 'mouseout' || e.type == 'mouseleave') e.relatedTarget = e.toElement;

        if (e.pageX == null && e.clientX != null) {
            var html = this.document.documentElement;
            var body = this.document.body;

            e.pageX = e.clientX + (html.scrollLeft || body && body.scrollLeft || 0);
            e.pageX -= html.clientLeft || 0;

            e.pageY = e.clientY + (html.scrollTop || body && body.scrollTop || 0);
            e.pageY -= html.clientTop || 0;
        }

        if (!e.which && e.button) {
            e.which = e.button & 1 ? 1 : (e.button & 2 ? 3 : (e.button & 4 ? 2 : 0));
        }

        return e;
    }

    return chSlider;
})();

//module.exports = chSlider;
