const INFO_TEXT = {
    width:      "The width of your SpeedDials in percent. 100 for example " +
                "means the whole browser width is used for the images.</br>" +
                "Values between 100 and 70 are working good",

    ratio:      "Ratio means the width : heigh of your SpeedDials.</br>" +
                "Exampe: You want to use images that have a resolution " +
                "of 1920 x 1080 (Full HD) so you can write 1920 in the first " +
                "and 1080 in the second. Or you could write 16 in the first 9 " +
                "in the second. It's the same.",

    gaps:       "Vertical and horizontal gap between the SpeedDials.</br>" +
                "0 means no gap. Values between 0 and 100 are working good",

    generate:   "",

    browse:     ""
};

let infoPopup;

$(document).ready(function() {
    infoPopup = $("#info-popup");

    let info = $(".hover.info");

    info.hover(function(e) {
    }, function() {
        infoPopup.css("display", "");
    });

    info.mousemove(function(e) {
        let id = e.target.parentElement.id;
        if (!(id.length < 5)) {
            id = id.substr(5, id.length);
        } else {
            id = "invalid tooltip";
        }

        let infoText = INFO_TEXT[id];

        infoPopup.html(infoText);

        let x = e.originalEvent.clientX + 10;
        let y = e.originalEvent.clientY + 10;
        infoPopup.css("top", y);
        infoPopup.css("left", x);
        infoPopup.css("display", "block");
    });
});