import {Utils} from "./utils.js";
import {ColorUtils} from "./colorutils.js";
import {FourPartInput} from "./fourpartinput.js";
import {SatValPicker} from "./satvalpicker.js";
import {AlphaPicker} from "./alphapicker.js";
import {BarPicker} from "./barpicker.js";

const huePicker = new BarPicker(".hue-picker", true);
const satValPicker = new SatValPicker(".sat-val-picker");
const alphaPicker = new AlphaPicker(".alpha-picker");
const beforeColorPreview = document.querySelector(".color-before");
const currentColorPreview = document.querySelector(".color-current");

const hexInput = document.querySelector(".hex-input");
const rgbaInput = new FourPartInput(".rgba-input", 255, 255, 255, 255);
const hsvaInput = new FourPartInput(".hsva-input", 360, 255, 255, 255);
const hslaInput = new FourPartInput(".hsla-input", 360, 255, 255, 255);

class ColorPicker {

    _hex = "";
    _hue = 0;
    _sat = 1;
    _val = 1;
    _alpha = 1;

    _lastValidHex;


    constructor(selector) {
        this.colorPicker = document.querySelector(selector);
        this.hexInput = document.querySelector(selector + " .hex-input");
        this.rgbaInput = new FourPartInput(selector + " .rgba-input", 255, 255, 255, 255);
        this.hsvaInput = new FourPartInput(selector + " .hsva-input", 360, 255, 255, 255);
        this.hslaInput = new FourPartInput(selector + " .hsla-input", 360, 255, 255, 255);
    }

    show(x, y) {
        this.colorPicker.style.left = x;
        this.colorPicker.style.top = y;
        this.colorPicker.style.display = "flex";
    }

    hide() {
        this.colorPicker.style.display = "";
    }
}

let hex = "";
let hue = 0;
let sat = 1;
let val = 1;
let alpha = 1;

let lastValidHex;

updateCurrentPreviewColor();
updateInputs();

function updateCurrentPreviewColor() {

    let rgb = ColorUtils.hsv2rgb({hue: hue, sat: sat, val: val});
    hex = ColorUtils.rgba2hex({r: rgb.r, g: rgb.g, b: rgb.b, a: alpha});

    currentColorPreview.style.background = "#" + hex;

    satValPicker.update(hue);
    // updateInputs();
}

function updateCurrentPreviewFromHex(newHex) {
    let exHex = ColorUtils.extendHex(newHex);

    if (exHex != null) {
        hex = exHex;

        let rgba = ColorUtils.hex2rgba(hex);
        if (rgba != null) {
            alpha = rgba.a;
            let hsv = ColorUtils.rgb2hsv(rgba);
            hue = hsv.hue;
            sat = hsv.sat;
            val = hsv.val;
            let hsl = ColorUtils.hsv2hsl({hue: hue, sat: sat, val: val});

            currentColorPreview.style.background = "#" + hex;
            updatePickers();
            updateInputs(false, true, true, true);
        }
    }
}

function updateInputs(updateHEX = true, updateRGBA = true, updateHSVA = true, updateHSLA = true) {

    let rgb = ColorUtils.hsv2rgb({hue: hue, sat: sat, val: val});
    let hsl = ColorUtils.hsv2hsl({hue: hue, sat: sat, val: val});

    if (updateHEX) {
        lastValidHex = hex;
        if (alpha === 1) {
            hexInput.value = hex.substr(0, hex.length - 2);
        } else {
            hexInput.value = hex;
        }
    }

    if (updateRGBA) {
        rgbaInput.setValues(Utils.to255(rgb.r), Utils.to255(rgb.g),  Utils.to255(rgb.b), Utils.to255(alpha));
    }

    if (updateHSVA) {
        hsvaInput.setValues(Math.floor(hue), Utils.to255(sat), Utils.to255(val), Utils.to255(alpha));
    }

    if (updateHSLA) {
        hslaInput.setValues(Math.floor(hsl.hue), Utils.to255(hsl.sat), Utils.to255(hsl.light), Utils.to255(alpha));
    }
}

function updatePickers() {
    satValPicker.update(hue);

    alphaPicker.update(hex);
}


satValPicker.onchange = function(event) {
    sat = event.sat;
    val = event.val;

    updateCurrentPreviewColor();
    updateInputs();
    alphaPicker.update(hex);
};

alphaPicker.onchange = function(event) {
    alpha = event.value;
    updateCurrentPreviewColor();
    updateInputs();
};

huePicker.onchange = function(event) {
    hue = event.value * 360;

    updateCurrentPreviewColor();
    updatePickers();
};

hexInput.addEventListener("input", function(event) {
    let inputType = event["inputType"];
    let target = event.target;
    let text = event.data;

    //Check if hex char(s)
    if (inputType.includes("insert")) {
        if (/[0-9A-Fa-f]+/.test(text)) {
            lastValidHex = target.value;
        } else {
            target["value"] = lastValidHex;
        }
    } else {
        lastValidHex = target.value;
    }

    updateCurrentPreviewFromHex(target.value);
});

// rgbaInput.onchange = function(event) {
//     console.log(event);
//     let rgba = {r: event[0], g: event[1], b: event[2], a: event[3]};
//     alpha = rgba.a;
//     let hsv = ColorUtils.rgb2hsv(rgba);
//     hue = hsv.hue;
//     sat = hsv.sat;
//     val = hsv.val;
//     hex = ColorUtils.rgba2hex(rgba);
//
//     updateCurrentPreviewColor();
//     updatePickers();
//     updateInputs(true, false, true, true);
// };
