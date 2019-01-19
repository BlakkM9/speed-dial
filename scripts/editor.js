let urlInput;
let imgInput;
let fileInput;
let uploadAnimation;
let generateButton;
let tilePreviewContainer;
let tilePreview;

$(document).ready(function() {

    urlInput = $("#url-input");
    imgInput = $("#img-input");
    fileInput = $("#img-file-input");
    uploadAnimation = $("#upload-animation-container");
    generateButton = $("#generate-button");
    tilePreviewContainer = $("#tile-preview-container");
    tilePreview = $("#tile-preview");


    //Editor
    editor.click(function(e) {
        if (e.target.id === "editor-container") {
            editor.css("display", "none");
            urlInput.val("");
            imgInput.val("");
        }
    });

    //Generate button
    generateButton.click(function() {
        if (urlInputIsValid()) {
            imgInput.prop("disabled", true);
            uploadAnimation.css("display", "block");
            generateButton.prop("disabled", true);
            generateScreenshot(urlInput.val());
        }
    });

    imgInput.bind("keyup input paste", function() {
        if (imgInputisValidSilent()) {
            $("<img/>").attr("src", imgInput.val()).on("load", function() {
                $(this).remove();
                tilePreviewContainer.css("display", "flex");
                tilePreview.css("background-image", "url('" + imgInput.val() + "')");
            }).on("error", function() {
                $(this).remove();
                tilePreviewContainer.css("display", "none");
                console.log("error loading preview image");
            });
        } else {
            tilePreviewContainer.css("display", "none");
        }
    });
});

function editorInputIsValid() {
    let valid = urlInputIsValid();

    if (!imgInputisValidSilent()) {
        imgInput.css("border", "1px solid red");
        valid = false;
    } else {
        imgInput.css("border", "");
    }

    return valid;
}

function urlInputIsValid() {
    let valid = true;

    if (!urlInputIsValidSilent()) {
        urlInput.css("border", "1px solid red");
        valid = false;
    } else {
        urlInput.css("border", "");
    }

    return valid;
}

function urlInputIsValidSilent() {
    return urlIsValid(urlInput.val());
}

function imgInputisValidSilent() {
    return urlIsValid(imgInput.val());
}

function generateScreenshot(url) {
    let reqUrl = "https://url-2-png.herokuapp.com?url=" + url + "&width=" + data.width + "&height=" + data.height;
    // let reqUrl = "localhost:8080?url=" + url + "&width=" + data.width + "&height=" + data.height;

    fetch(reqUrl).then(res => {
        res.blob().then(blobRes => {
            uploadFile(new File([blobRes], "preview.png", {type: "image/png"}));
        }, onError);
    }, onError);
}

function openEditor(row, col) {
    let saveButton = $("#save-button");

    let qTile = $(".tile");

    tilePreview.css("width", qTile.css("width"));
    tilePreview.css("padding-top", qTile.css("padding-top"));
    tilePreview.css("background-color", "black");

    saveButton.off("click");
    uploadAnimation.css("display", "");
    imgInput.prop("disabled", false);

    let tile = tileData[data.cols * row + col];
    editor.css("display", "flex");

    urlInput.css("border", "");
    imgInput.css("border", "");

    if (!tile.url.match("none")) {
        urlInput.val(tile.url);
    }
    if (!tile.img.match("none")) {
        imgInput.val(tile.img);
        tilePreviewContainer.css("display", "flex");
        tilePreview.css("background-image", "url(" + imgInput.val() + ")");
    } else {
        tilePreviewContainer.css("display", "none");
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

function openFirstEmpty(addURL) {

    let tile = $($(".tile.empty")[0]);

    let rowClass = tile.parent().attr("class");
    let colClass = tile.attr("class");

    rowClass = /row\d/.exec(rowClass)[0];
    colClass = /col\d/.exec(colClass)[0];

    let row = parseInt(/\d/.exec(rowClass)[0]);
    let col = parseInt(/\d/.exec(colClass)[0]);

    if (row < data.rows && col < data.cols) {
        urlInput.val(addURL);
        openEditor(row, col);
    } else {
        console.log("no free tiles");
    }
}