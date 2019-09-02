import {Utils} from "./utils.js";
import {ColorUtils} from "./colorutils.js";

export class SatValPicker {


    constructor(selector) {
        this.element = document.querySelector(selector);
        this.markerElement = this.element.querySelector(".marker");

        this.markerWidth = this.markerElement.clientWidth;
        this.markerHeight = this.markerElement.clientHeight;

        //Events
        this.onchange = function(event) {};

        let _this = this;
        this.element.onmousedown = function() {mousedown(_this)};
    }

    update(hue) {
        this.hue = hue;
        let hslString = "hsl(" + hue + ", 100%, 50%)";
        this.element.style.background = "linear-gradient(to bottom, transparent, black)," +
            "linear-gradient(to left, transparent, white)," +
            "linear-gradient(" + hslString + "," + hslString + ")";
    }

    updateMarker(x, y, sat, val) {

        x = Utils.clamp(x, -5, this.element.offsetWidth - (this.markerWidth / 2));
        y = Utils.clamp(y, -5, this.element.offsetHeight - (this.markerHeight / 2));

        this.markerElement.style.left = x + "px";
        this.markerElement.style.top = y + "px";


        let rgb = ColorUtils.hsv2rgb({hue: this.hue, sat: sat, val: val});
        let luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.144 * rgb.b);
        let markerColor;

        if (luminance > 0.4) {
            markerColor = "black";
        } else {
            markerColor = "white";
        }

        this.markerElement.style.borderColor = markerColor;
    }
}

function mousedown(_this) {
    _this.element.onmousedown = function() {};

    document.onmouseup = function() {mouseup(_this)};
    document.onmousemove = function(event) {mousemove(_this, event)};
}

function mousemove(_this, event) {
    let x = event.x - _this.element.getBoundingClientRect().left;
    let y = event.y - _this.element.getBoundingClientRect().top;
    let sat = x / _this.element.clientWidth;
    let val = 1 - (y / _this.element.clientHeight);

    sat = Utils.clamp(sat, 0, 1);
    val = Utils.clamp(val, 0, 1);

    _this.updateMarker(x, y, sat, val);
    _this.onchange({sat: sat, val: val});
}

function mouseup(_this) {
    document.onmouseup = function() {};
    document.onmousemove = function() {};
    _this.element.onmousedown = function() {mousedown(_this)};
}
