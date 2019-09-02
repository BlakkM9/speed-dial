import {Utils} from "./utils.js";

export class BarPicker {
    constructor(selector, horizontal = false) {
        this.element = document.querySelector(selector);
        this.markerElement = this.element.querySelector(".marker");
        this.horizontal = horizontal;
        this.onchange = function(event) {};

        //Event
        let _this = this;
        this.element.onmousedown = function(event) {mousedown(_this, event)};
    }

    // setValue(value) {
    //     let _this = this;
    //     if (this.horizontal) {
    //         mousemove(_this, {})
    //     } else {
    //         mousemove(_this, {})
    //     }
    // }
}

function mousedown(_this, event) {
    _this.element.onmousedown = function() {};

    document.onmouseup = function(e) {mouseup(_this, e)};
    document.onmousemove = function(e) {mousemove(_this, e)};
}

function mousemove(_this, event) {
    let pos;
    let value;
    let markerOffset;
    let size;

    if (_this.horizontal) {
        size = "clientWidth";
        pos = event.x - _this.element.getBoundingClientRect().left;

    } else {
        size = "clientHeight";
        pos = event.y - _this.element.getBoundingClientRect().top;
    }

    value = Utils.clamp((pos / _this.element[size]), 0, 1);
    markerOffset = _this.markerElement[size] / 2;

    pos = Utils.clamp(pos, -markerOffset, _this.element[size] - markerOffset);
    _this.markerElement.style[_this.horizontal ? "left" : "top"] = pos + "px";

    _this.onchange({value: value});
}

function mouseup(_this, event) {
    document.onmouseup = function() {};
    document.onmousemove = function() {};
    _this.element.onmousedown = function(e) {mousedown(_this, e)};
}