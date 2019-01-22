//TODO calculate option heights automatically
const OPTIONS_HEIGHT_EXTENDED = 108;
const OPTIONS_HEIGHT_REDUCED = 38;

let editor;
let urlInput;
let imgInput;
let tilePreviewContainer;
let tilePreview;
let fileInput;
let uploadAnimation;
let optionsDropdown;
let options;
let tileBgInput;
let displayTypeSelect;
let generateButton;
let browseButton;
let saveButton;

let replacing = false;
let imgPreviewLoaded = false;

let controller;
let signal;

let currentTile;

$(function() {

    editor = $("#editor");
    urlInput = $("#url-input");
    imgInput = $("#img-input");
    tilePreviewContainer = $("#tile-preview-container");
    tilePreview = $("#tile-preview");
    fileInput = $("#img-file-input");
    uploadAnimation = $("#upload-animation-container");
    optionsDropdown = $("#show-options-dropdown");
    options = $("#options");
    tileBgInput = $("#color-tile-background");
    displayTypeSelect = $("#display-type-select");
    generateButton = $("#generate-button");
    browseButton = $("#browse-button");
    saveButton = $("#save-button");

    //Editor
    editorContainer.click(function(e) {
        if (e.target.id === "editor-container") {
            openEditor(false);
        }
    });

    optionsDropdown.click(function() {
        showOptions(!data.tile_options_visible);
    });

    //Generate button
    generateButton.click(function() {
        if (urlInputIsValid()) {
            setImgLoading(true);
            generateScreenshot(urlInput.val());
        }
    });

    //Input
    tileBgInput.change(function() {
        console.log("tile bg input changed:", tileBgInput.val());
        tilePreview.css("background-color", tileBgInput.val());
    });

    //Dispay type select
    displayTypeSelect.change(function(e, value) {
        console.log("type changed:", value);
        tilePreview.css("background-size", value);
    });

    //Bind img input to update preview image
    imgInput.bind("keyup input paste", function() {
        if (imgInputisValidSilent()) {
            $("<img alt=''/>").attr("src", imgInput.val()).on("load", function() {
                tilePreview.css("background-image", "url('" + imgInput.val() + "')");
                showTilePreview(true);
                imgPreviewLoaded = true;
                $(this).remove();
            }).on("error", function() {
                console.log("Error loading preview image");
                showTilePreview(false);
                imgPreviewLoaded = false;
                $(this).remove();
            });
        } else {
            showTilePreview(false);
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
    if (row !== false) {
        if (useDefaultContent == null) {
            useDefaultContent = true;
        }

        controller = new AbortController();
        signal = controller.signal;

        uploadAnimation.css("display", "");
        imgInput.prop("disabled", false);

        currentTile = tileData[data.cols * row + col];
        editorContainer.css("display", "flex");

        urlInput.css("border", "");
        imgInput.css("border", "");
        showTilePreview(false);

        if (useDefaultContent) {
            if (currentTile.url === "none") {
                urlInput.val("");
            } else {
                urlInput.val(currentTile.url);
            }

            if (currentTile.img === "none") {
                imgInput.val("");
            } else {
                imgInput.val(currentTile.img);
                imgInput.trigger("paste");
                tilePreview.css("background-image", "url(" + imgInput.val() + ")");
            }
        }

        saveButton.off("click");
        saveButton.click(function() {
            console.log("saveButton clicked");

            if (editorInputIsValid()) {
                setLoading(true);

                currentTile.url = urlInput.val();
                currentTile.img = imgInput.val();
                currentTile.bg = tileBgInput.val();
                currentTile.size = getSelectValue(displayTypeSelect);

                urlInput.val("");
                imgInput.val("");
                openEditor(false);
                applyTileData();
            }
        });
    } else {
        //Close editor
        urlInput.val("");
        imgInput.val("");
        if (uploadReq != null) {
            uploadReq.abort("Uploading canceled");
        }
        controller.abort();
        editorContainer.css("display", "");
        showTilePreview(false);
        setImgLoading(false);
    }

    save("sync", {"data": data}, function() {
        console.log("data saved");
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

function showTilePreview(show) {

    let tile = $(".tile");

    let tilePaddingTop = tile.css("padding-top");

    tilePreview.css("width", tile.css("width"));
    tilePreview.css("padding-top", tilePaddingTop);
    tilePreview.css("background-color", currentTile.bg);
    tilePreview.css("background-size", currentTile.size);

    if (show) {
        showOptions(data.tile_options_visible);
        tileBgInput.val(currentTile.bg);
        setSelectValue(displayTypeSelect, currentTile.size);
        tileBgInput.trigger("change");
    } else {
        tilePreviewContainer.css("padding-top", "");
        tilePreviewContainer.css("height", "");
    }
}

function showOptions(show) {

    let dropDownSvg = $("#options-dropdown-svg");

    console.log("showing options", show);

    if (show) {
        updateSelect($("#display-type-select"));
        dropDownSvg.addClass("active");
        options.css("padding", "5px");
        options.css("height", "60");
    } else {
        dropDownSvg.removeClass("active");
        displayTypeSelect.removeClass("active");
        options.css("padding", "");
        options.css("height", "");
    }

    setPreviewHeight(show);
    data.tile_options_visible = show;

    save("sync", {data: data});
}

function setPreviewHeight(optionsVisible) {
    tilePreviewContainer.css("padding-top", "25px");

    let previewHeight = tilePreview.outerHeight();

    console.log(data.tile_options_visible);

    let newHeight;
    if (optionsVisible) {
        newHeight = previewHeight + OPTIONS_HEIGHT_EXTENDED + 25; //Padding top of tilepreviewcontainer
    } else {
        newHeight = previewHeight + OPTIONS_HEIGHT_REDUCED + 25; //Padding top of tilepreviewcontainer;
    }

    tilePreviewContainer.css("height", newHeight);
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