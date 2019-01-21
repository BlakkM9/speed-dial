let urlInput;
let imgInput;
let tilePreviewContainer;
let tilePreview;
let fileInput;
let uploadAnimation;
let generateButton;
let browseButton;
let saveButton;

let replacing = false;
let imgPreviewLoaded = false;

let controller;
let signal;

$(function() {

    urlInput = $("#url-input");
    imgInput = $("#img-input");
    tilePreviewContainer = $("#tile-preview-container");
    tilePreview = $("#tile-preview");
    fileInput = $("#img-file-input");
    uploadAnimation = $("#upload-animation-container");
    generateButton = $("#generate-button");
    browseButton = $("#browse-button");
    saveButton = $("#save-button");


    //Editor
    editor.click(function(e) {
        if (e.target.id === "editor-container") {
            urlInput.val("");
            imgInput.val("");
            if (uploadReq != null) {
                uploadReq.abort("Uploading canceled");
            }
            controller.abort();
            editor.css("display", "");
            setImgLoading(false);
        }
    });

    //Generate button
    generateButton.click(function() {
        if (urlInputIsValid()) {
            setImgLoading(true);
            generateScreenshot(urlInput.val());
        }
    });

    //Bind img input to update preview image
    imgInput.bind("keyup input paste", function() {
        if (imgInputisValidSilent()) {
            $("<img alt=''/>").attr("src", imgInput.val()).on("load", function() {
                $(this).remove();
                tilePreviewContainer.css("display", "flex");
                tilePreview.css("background-image", "url('" + imgInput.val() + "')");
                imgPreviewLoaded = true;
            }).on("error", function() {
                $(this).remove();
                tilePreviewContainer.css("display", "none");
                console.log("Error loading preview image");
                imgPreviewLoaded = false;
            });
        } else {
            tilePreviewContainer.css("display", "none");
        }
    });
});

function editorInputIsValid() {
    let valid = urlInputIsValid();

    if (!(imgInputisValidSilent() && imgPreviewLoaded)) {
        imgInput.css("border", "1px solid red");
        valid = false;
    } else {
        imgInput.css("border", "");
    }

    if (!valid) {
        showError("Invalid input");
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
    let reqUrl = "https://url-2-png.herokuapp.com/screenshot?url=" + url + "&width=" + data.width + "&height=" + data.height;

    fetch(reqUrl, {
        method: "GET",
        signal: signal,
    }).then(res => {
        res.blob().then(blobRes => {
            uploadFile(new File([blobRes], "preview.png", {type: "image/png"}));
        }, onError);
    }, onError);
}

function openEditor(row, col, useDefaultContent) {
    if (useDefaultContent == null) {
        useDefaultContent = true;
    }
    let qTile = $(".tile");

    controller = new AbortController();
    signal = controller.signal;

    tilePreview.css("width", qTile.css("width"));
    tilePreview.css("padding-top", qTile.css("padding-top"));
    tilePreview.css("background-color", "black");

    uploadAnimation.css("display", "");
    imgInput.prop("disabled", false);

    let tile = tileData[data.cols * row + col];
    editor.css("display", "flex");


    console.log(useDefaultContent, tile);

    urlInput.css("border", "");
    imgInput.css("border", "");

    if (useDefaultContent) {
        if (tile.url === "none") {
            urlInput.val("");
        } else {
            urlInput.val(tile.url);
        }

        if (tile.img === "none") {
            imgInput.val("");
        } else {
            imgInput.val(tile.img);
            tilePreviewContainer.css("display", "flex");
            tilePreview.css("background-image", "url(" + imgInput.val() + ")");
        }
    }

    if (imgInput.val() === "") {
        tilePreviewContainer.css("display", "none");
    }

    saveButton.off("click");
    saveButton.click(function() {
        console.log("saveButton clicked");

        if (editorInputIsValid()) {
            setLoading(true);

            tileData[data.cols * row + col].url = urlInput.val();
            tileData[data.cols * row + col].img = imgInput.val();

            urlInput.val("");
            imgInput.val("");

            applyTileData();
        }
    });
}

function openFirstEmpty(addURL) {

    let freeTile = true;
    let tile = $($(".tile.empty")[0]);

    let col;
    let row;

    console.log(tile);

    if (tile.length === 0) {
        console.log("length of tile is 0");
        freeTile = false;
    } else {
        let colClass = tile.attr("class");
        let rowClass = tile.parent().attr("class");

        colClass = /col\d/.exec(colClass)[0];
        rowClass = /row\d/.exec(rowClass)[0];

        col = parseInt(/\d/.exec(colClass)[0]);
        row = parseInt(/\d/.exec(rowClass)[0]);

        console.log("free tile pos:", col, row);

        if (col > data.cols || row > data.rows) {
            freeTile = false;
        } else {
            urlInput.val(addURL);
            console.log("opening editor for tile", row, col);
            openEditor(row, col, false);
        }
    }

    if (!freeTile) {
        console.log("no free tiles");
        showInfo("No free tiles.</br>Click a tile to replace it.");
        urlInput.val(addURL);
        replacing = true;
    }
}

function setImgLoading(loading) {
    if (loading) {
        imgInput.prop("disabled", true);
        uploadAnimation.css("display", "block");
        generateButton.prop("disabled", true);
        browseButton.prop("disabled", true);
        fileInput.prop("disabled", true);
        saveButton.prop("disabled", true);
    } else {
        imgInput.prop("disabled", false);
        uploadAnimation.css("display", "");
        generateButton.prop("disabled", false);
        browseButton.prop("disabled", false);
        fileInput.prop("disabled", false);
        saveButton.prop("disabled", false);
    }
}