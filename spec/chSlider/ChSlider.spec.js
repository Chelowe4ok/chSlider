describe('chSlider', function () {
    const jsdom = require("jsdom");
    var chSlider = require('./../../chSlider.js');
    var slider;
    const { JSDOM } = jsdom;
    const dom = new JSDOM(`<!DOCTYPE html>
                        <div id="slider" class="slider">
                            <div class="thumb"></div>
                        </div>
    `);
    
    beforeEach(function () {
        slider = new chSlider({}, dom.window.document);
    });

    afterEach(function () {
        slider = null;
    });

    it("should be return current value", function () {
        var result = slider.getValue();
        expect(result).toEqual(0);
    });

    it("should be set current value", function () {
        var result = slider.setValue(5);
        expect(result).toEqual(5);
    });

    it("should be return object of UI elements", function () {
        var result = slider.getUIElements();
        expect(typeof result).toEqual('object');
    });
})