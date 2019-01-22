
let selectContainer;
let select;
let option;
let dropDownContainer;

$(function() {
    dropDownContainer = $(".select.container .drop-down.container");
    select = $(".select.container > .select");
    selectContainer = $(".select.container");
    option = $(".menu-entry.drop-down");

    selectContainer.click(function() {

        if ($(this).attr("class").includes("active")) {
            showSelect($(this), false);
        } else {
            showSelect($(this), true);
        }
    });

    $(document).click(function(e) {
        if (e.which === 1) {
            if (!e.target.className.includes("select")) {
                selectContainer.removeClass("active");
            }
        }
    });

    option.click(function(e) {
        let target = $(e.target);
        let container = target.parent().parent().parent();
        let display = target.parent().parent().find(".selected");
        let valueBefore = display.html();
        display.html(target.html());

        target.parent().find(".menu-entry.drop-down.select").html(target.html());

        updateSelect(container, false);
        if (valueBefore !== display.html()) {
            container.trigger("change", getSelectValue(container));
        }
    });
});

function showSelect(currentSelect, show) {
    if (show) {
        updateSelect(currentSelect, false);
        currentSelect.addClass("active");
    } else {
        currentSelect.removeClass("active");
    }
}

function updateSelect(el, updateWidth) {
    if (updateWidth == null) {
        updateWidth = true;
    }

    let currDdc = el.find(".drop-down.container");

    if (updateWidth) {
        currDdc.css("width", currDdc.width());
    }

    updateAvailableOptions(el);

    if (updateWidth) {
        el.css("width", currDdc.outerWidth());
    }

    let offset = el.offset();
    currDdc.css("top", offset.top);
    currDdc.css("left", offset.left);
}

function updateAvailableOptions(el) {
    let options = el.find(option);
    let selected = $(options[0]);


    for (let i = 1; i < options.length; i++) {
        let currOption = $(options[i]);
        if (currOption.html() === selected.html()) {
            currOption.css("display", "none");
        } else {
            currOption.css("display", "");
        }
    }
}

function getSelectValue(el) {
    let options = el.find(option);
    let selected = $(options[0]);
    let value;

    for (let i = 1; i < options.length; i++) {
        let currOption = $(options[i]);
        if (currOption.html() === selected.html()) {
            value = currOption.attr("data-value");
            break;
        }
    }

    return value;
}

function setSelectValue(el, value) {
    let options = el.find(option);
    let selected = $(options[0]);

    for (let i = 1; i < options.length; i++) {
        let currOption = $(options[i]);
        if (currOption.attr("data-value") === value) {
            selected.html(currOption.html());
            el.find(".selected").html(currOption.html());
            return true;
        }
    }
    return false;
}