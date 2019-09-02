import {BarPicker} from "./barpicker.js";

export class AlphaPicker extends BarPicker {
    constructor(selector) {
        super(selector, false);
    }

    update(hex) {
        let rgbHex = hex.substr(0, 6);
        this.element.style.background = "linear-gradient(to bottom, transparent, #" + rgbHex + ")";
    }
}