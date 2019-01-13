let urlInput;
let imgInput;

$(document).ready(function() {

    urlInput = $("#url-input");
    imgInput = $("#img-input");

    //Editor
    editor.click(function(e) {
        if (e.target.id === "editor-container") {
            editor.css("display", "none");
            urlInput.val("");
            imgInput.val("");
        }
    });
});

function processClick(e, tile) {

    let rowClass = tile.parent().attr("class");
    let colClass = tile.attr("class");
    let empty = colClass.includes("empty");

    rowClass = /row\d/.exec(rowClass)[0];
    colClass = /col\d/.exec(colClass)[0];

    let row = parseInt(/\d/.exec(rowClass)[0]);
    let col = parseInt(/\d/.exec(colClass)[0]);

    if (empty) {
        openEditor(row, col);
    } else {
        window.location = tileData[data.cols * row + col].url;
    }
}

function openEditor(row, col) {
    let saveButton = $("#save-button");
    saveButton.off("click");

    let tile = tileData[data.cols * row + col];
    editor.css("display", "flex");

    urlInput.css("border", "");
    imgInput.css("border", "");

    if (!tile.url.match("none")) {
        urlInput.val(tile.url);
    }
    if (!tile.url.match("none")) {
        imgInput.val(tile.img);
    }

    saveButton.click(function() {

        if (editorInputIsValid()) {
            editor.css("display", "");
            speedDial.css("display", "none");
            loader.css("display", "block");

            tileData[data.cols * row + col].url = urlInput.val();
            tileData[data.cols * row + col].img = imgInput.val();

            urlInput.val("");
            imgInput.val("");

            applyTileData();
        }
    });
}

function editorInputIsValid() {
    let urlPat = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
    let valid = true;

    if (!urlInput.val().match(urlPat)) {
        urlInput.css("border", "1px solid red");
        valid = false;
    } else {
        urlInput.css("border", "");
    }

    if (!imgInput.val().match(urlPat)) {
        imgInput.css("border", "1px solid red");
        valid = false;
    } else {
        imgInput.css("border", "");
    }

    return valid;
}