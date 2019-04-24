let iconSelectionContainer;
let iconSelection;
let iconPreviewTile;
let useButton;
let cancelButton;

$(function() {

    iconSelectionContainer = $("#icon-selection-container");
    iconSelection = $("#icon-selection > .inner");
    useButton = $("#use-button");
    cancelButton = $("#cancel-button");

    iconSelectionContainer.click(function(e) {
        if (e.target.id === "icon-selection-container") {
            showIconSelection(false);
            setImgLoading(false);
        }
    });

    useButton.click(function() {
        let selected = iconSelection.find(".tile.icon-select.selected");
        let url = selected.css("background-image").substr(5);
        url = url.substring(0, url.length - 2);
        uploadUrl(url);
        showIconSelection(false);
    });

    cancelButton.click(function() {
        showIconSelection(false);
        setImgLoading(false);
    });
});

function showIconSelection(show, body) {
    if (show) {
        generateIconSelection(body);
        iconSelectionContainer.css("display", "flex");
    } else {
        iconSelectionContainer.css("display", "");
        //Delete content
        iconSelection.html("");
    }
}

function generateIconSelection(body) {
    let rows = Math.ceil(body.urls.length / 2);

    useButton.prop("disabled", true);

    let tile = $(".tile");
    let tilePaddingTop = tile.css("padding-top");

    for (let i = 0; i < rows; i++) {
        let row = $("<div class='icon-selection-row'></div>");
        iconSelection.append(row);
        for (let j = 0; j < 2; j++) {
            if (body.urls.length - (2 * i + j) > 0) {
                let iconTile = $("<div class='tile icon-select'></div>");
                let iconTileBg = $("<div class='icon-tile-background'></div>");
                row.append(iconTileBg);
                row.append(iconTile);
                iconTile.css("width", tile.css("width"));
                iconTileBg.css("width", tile.css("width"));
                iconTile.css("padding-top", tilePaddingTop);
                iconTileBg.css("height", tilePaddingTop);
                iconTile.css("background-image", "url(" + body.urls[2 * i + j].url + ")");
                iconTile.css("background-size", "contain");

                //4 is border width and 12 is border width * 3

                iconTileBg.css("top", 4);

                if (j === 0) {
                    iconTileBg.css("left", 4);
                }
                if (j === 1) {
                    iconTileBg.css("left", tile.outerWidth() + 12);
                }
            }
        }
    }


    iconPreviewTile = $(".tile.icon-select");
    // iconPreviewTile.css("width");
    iconPreviewTile.click(function() {
        let curr = $(this);

        iconPreviewTile.each(function() {
            if ($(this) !== curr) {
                $(this).removeClass("selected");
            }
        });

        if (curr.hasClass("selected")) {
            curr.removeClass("selected");
        } else {
            curr.addClass("selected");
            useButton.prop("disabled", false);
        }
    });
}