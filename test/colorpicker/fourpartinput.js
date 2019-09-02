import {Utils} from "./utils.js";

export class FourPartInput {
    constructor(selector, max1, max2, max3, max4) {
        this.containerElement = document.querySelector(selector);
        this.valElements = this.containerElement.querySelectorAll("input");
        this.max = [max1, max2, max3, max4];
        this.lastValids = ["", "", "", ""];

        //Events
        this.onchange = function(event) {};

        let _this = this;
        for (let i = 0; i < this.valElements.length; i++) {
            this.valElements[i].oninput = function(event) {checkInput(_this, i, event)};
            this.valElements[i].onfocus = function() {_this.valElements[i].select()};

        }
    }

    setValues(val1, val2, val3, val4) {
        let val = [val1, val2, val3, val4];
        for (let i = 0; i < this.valElements.length; i++) {
            this.valElements[i].value = Utils.clamp(val[i], 0, this.max[i]);
            this.lastValids[i] = this.valElements[i].value;
        }
    }
}

function checkInput(_this, i, event) {
    let inputType = event["inputType"];
    let target = event.target;
    let text = event.data;

    // //Return and reset if nan
    // if (isNaN(parseInt(target.value))) {
    //     target.value = _this.lastValids[i];
    //     return;
    // }

    console.log(event);

    //Check if valid input char
    if (inputType.includes("insert")) {
        if (!isNaN(parseInt(text))) {
            setInput(_this, i, target);
        } else {
            target.value = _this.lastValids[i];
        }
    } else {
        setInput(_this, i, target);
    }
}

function setInput(_this, i, target) {
    target.value = Utils.clamp(parseInt(target.value), 0, _this.max[i]);
    _this.lastValids[i] = target.value;
    _this.onchange({
        0: _this.valElements[0].value,
        1: _this.valElements[1].value,
        2: _this.valElements[2].value,
        3: _this.valElements[3].value
    });
}