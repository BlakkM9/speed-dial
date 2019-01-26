
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

    option.hover(function() {
        let target = $(this);
        if (target.attr("class").includes("select")) {
            highlightSelected(target.parent());
        } else {
            let childs = target.parent().children();
            for (let i = 1; i < childs.length; i++) {
                let child = $(childs[i]);
                if (child.attr("class").includes("hover")) {
                    child.removeClass("hover");
                }
            }
            target.addClass("hover");
        }
    }, function() {
        $(this).removeClass("hover");
    });


    dropDownContainer.hover(function(e) {
    }, function() {
        highlightSelected($(this).parent());
    });

    $(document).click(function(e) {
        if (e.which === 1 && e.target.hasOwnProperty("className")) {
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

    //The 2 is for each 1px border on left and right
    let selectPadding = el.outerWidth() - el.width() - 2;

    highlightSelected(el);

    if (updateWidth) {
        el.css("width", currDdc.width() - selectPadding);
    }

    let offset = el.offset();
    currDdc.css("top", offset.top);
    currDdc.css("left", offset.left);
}

function highlightSelected(el) {

    let options = el.find(option);
    let selected = $(options[0]);


    for (let i = 1; i < options.length; i++) {
        let currOption = $(options[i]);
        if (currOption.html() === selected.html()) {
            currOption.addClass("hover");
        } else {
            currOption.removeClass("hover");
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