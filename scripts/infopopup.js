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

    generate:   "Generate a screenshot from the entered website and upload it to imgur.</br>" +
                "This may take some while because the screenshot needs to be generated.",

    browse:     "Browse images from your computer. If you select an image it is automatically " +
                "uploaded to imgur, so don't choose files which contain private data! (even if the " +
                "imgur link is not public."
};

let infoPopup;

$(document).ready(function() {
    infoPopup = $("#info-popup");

    let info = $(".hover.info");
    let infoText;

    info.hover(() => {}, function() {
        infoPopup.css("display", "");
    });

    info.mousemove(function(e) {
        let id;
        if (e.target.tagName === "BUTTON" || e.target.tagName === "LABEL") {
            id = e.target.id;
            if (id.endsWith("-button")) {
                let buttonStart = id.indexOf("-button");
                id = id.substr(0, buttonStart);
                if (INFO_TEXT.hasOwnProperty(id)) {
                    infoText = INFO_TEXT[id];
                } else {
                    console.log("invalid button tooltip", id);
                }
            }
        } else {
            id = e.target.parentElement.id;

            if (id.startsWith("info-")) {
                id = id.substr(5, id.length);
                if (INFO_TEXT.hasOwnProperty(id)) {
                    infoText = INFO_TEXT[id];
                } else {
                    console.log("invalid info tooltip", id);
                }
            }
        }

        infoPopup.html(infoText);

        let x = e.originalEvent.clientX + 10;
        let y = e.originalEvent.clientY + 10;
        infoPopup.css("top", y);
        infoPopup.css("left", x);
        infoPopup.css("display", "block");
    });
});