//TODO calculate option heights automatically
const OPTIONS_HEIGHT_EXTENDED = 141;
const OPTIONS_HEIGHT_REDUCED = 51;

let editorContainer;
let editor;
let urlInput;
let imgInput;
let tilePreviewContainer;
let tilePreview;
let fileInput;
let uploadAnimation;
let optionsDropdown;
let options;
let tileBgPipette;
let tileBgInput;
let displaySizePercentInput;
let displayTypeSelect;
let generateButton;
let generateDropDownContainer;
let generateButtonScreenshot;
let generateButtonIcon;
let browseButton;
let saveButton;

let replacing = false;
let pickingColor = false;
let imgPreviewLoaded = false;
let generateDropDownOpen = false;

let controller;
let signal;

let currentTile;

$(function() {

    editorContainer = $("#editor-container");
    editor = $("#editor");
    urlInput = $("#url-input");
    imgInput = $("#img-input");
    tilePreviewContainer = $("#tile-preview-container");
    tilePreview = $("#tile-preview");
    fileInput = $("#img-file-input");
    uploadAnimation = $("#upload-animation");
    optionsDropdown = $("#show-options-dropdown");
    options = $("#options");
    tileBgPipette = $("#color-tile-background-pipette");
    tileBgInput = $("#color-tile-background");
    displaySizePercentInput = $("#display-size-percentage-input");
    displayTypeSelect = $("#display-type-select");
    generateButton = $("#generate-button");
    generateDropDownContainer = $(".multi-button-container");
    generateButtonScreenshot = $("#generate-button-screenshot");
    generateButtonIcon = $("#generate-button-icon");
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

        if (!generateDropDownOpen) {
            showGenerateDropDown(true);
        } else {
            showGenerateDropDown(false);
        }

        // if (urlInputIsValid()) {
        //     setImgLoading(true);
        //     generateScreenshot(urlInput.val());
        // }
    });

    //Screenshot button
    generateButtonScreenshot.click(function() {
        if (urlInputIsValid()) {
            setImgLoading(true);
            generateScreenshot(urlInput.val());
            showGenerateDropDown(false);
        }
    });

    //Generate icon
    generateButtonIcon.click(function() {
       if (urlInputIsValid()) {
           setImgLoading(true);
           generateIcon(urlInput.val());
           showGenerateDropDown(false);
       }
    });

    //Pipette
    tileBgPipette.click(function() {
        console.log("picking color");
        pickColor(true);
    });

    $(document).keyup(function(e) {
        if (pickingColor) {
            if (e.key === "Escape") {
                pickColor(false);
            }
        }
    });

    //Input
    tileBgInput.change(function() {
        console.log("tile bg input changed:", tileBgInput.val());
        tilePreview.css("background-color", tileBgInput.val());
    });

    tileBgInput.on("hexchange", function() {
       tilePreview.css("background-color", tileBgInput.val());
    });

    //Display type select
    displayTypeSelect.change(function(e, value) {
        console.log("type changed:", value);
        if (value === "percentage") {
            displaySizePercentInput.css("display", "block");
            displaySizePercentInput.val("100");
            tilePreview.css("background-size", "100%");
        } else {
            displaySizePercentInput.css("display", "");
            tilePreview.css("background-size", value);
        }
    });

    displaySizePercentInput.bind("keyup input paste", function() {
        tilePreview.css("background-size", displaySizePercentInput.val() + "%");
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

    if (!imgInputisValidSilent() || !imgPreviewLoaded) {
        imgInput.css("border", "1px solid red");
        valid = false;
    } else {
        imgInput.css("border", "");
    }

    if (!valid) {
        showError("Invalid Input");
    }

    return valid;
}

function urlInputIsValid() {
    let valid = true;

    if (!urlInputIsValidSilent()) {
        urlInput.css("border", "1px solid red");
        valid = false;
        showError("Invalid Image URL");
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

    let screenshotMethod = "server";

    if (screenshotMethod === "server") {
        generateScreenshotWithServer(url)
    } else if (screenshotMethod === "tab") {
        // generateScreenshotWithTab(url);
    } else if (screenshotMethod === "window") {
        // generateScreenshotWithWindow(url);
    }
}

function generateIcon(url) {
    let reqUrl = "https://url-2-png.herokuapp.com/icon?url=" + url;

    $.ajax({
       dataType: "json",
       url: reqUrl,
       data: data,
       success: function(body) {
           showIconSelection(true, body);
       }
    });
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



            if (/\d+%/.test(currentTile.size)) {
                displaySizePercentInput.css("display", "block");
            } else {
                displaySizePercentInput.css("display", "");
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

                if (getSelectValue(displayTypeSelect) === "percentage") {
                    currentTile.size = displaySizePercentInput.val() + "%";
                } else {
                    currentTile.size = getSelectValue(displayTypeSelect);
                }

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
        pickColor(false);
        setImgLoading(false);
        showGenerateDropDown(false);
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

function showGenerateDropDown(show) {
    //Set correct position for generate drop down
    generateDropDownContainer.css("top", generateButton.position().top + generateButton.outerHeight());
    generateDropDownContainer.css("left", generateButton.position().left + (generateButton.outerWidth(true) - generateButton.outerWidth()) / 2);

    if (show) {
        generateDropDownContainer.css("opacity", "1");
        generateDropDownContainer.css("pointer-events", "auto");
        generateButton.css("border-radius", "2px 2px 0 0");
        generateDropDownOpen = true;
    } else {
        generateDropDownContainer.css("opacity", "");
        generateDropDownContainer.css("pointer-events", "");
        generateButton.css("border-radius", "");
        generateDropDownOpen = false;
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
        options.css("padding-top", "15px");
        options.css("height", "75px");
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
    tilePreviewContainer.css("padding-top", "5px");

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

let colorPickerCanvas;

function pickColor(picking) {
    let colorPreview = $("#color-pipette-preview");
    if (picking) {

        colorPickerCanvas = document.createElement("canvas");

        showInfo("Move your cursor over the Preview Image!<br> Cancel with ESC or click anywhere else.");
        tilePreview.addClass("picking-color-allowed");
        colorPickerCanvas = document.createElement("canvas");
        colorPickerCanvas.width = tilePreview.width();
        colorPickerCanvas.height = tilePreview.innerHeight() - tilePreview.height();
        let ctx = colorPickerCanvas.getContext("2d");

        //Background with current background color
        ctx.beginPath();
        ctx.rect(0, 0, colorPickerCanvas.width, colorPickerCanvas.height);
        ctx.fillStyle = tileBgInput.val();
        ctx.fill();

        console.log(tileBgInput.val());

        blobFromUrl(imgInput.val(), function (blobURL) {
            console.log(blobURL);

            $("<img alt=''/>").attr("src", blobURL).on("load", function () {
                let img = $(this)[0];
                let imgRatio = img.height / img.width;
                let canvasRatio = colorPickerCanvas.height / colorPickerCanvas.width;
                let mode = getSelectValue(displayTypeSelect);

                let startX;
                let startY;

                let realWidth;
                let realHeight;
                if (mode === "contain") {
                    //Calculate real image size in tile
                    if (canvasRatio > imgRatio) {
                        realWidth = colorPickerCanvas.width;
                        realHeight = realWidth * imgRatio;
                    } else {
                        realHeight = colorPickerCanvas.height;
                        realWidth = realHeight / imgRatio;
                    }

                } else if (mode === "cover") {
                    if (canvasRatio > imgRatio) {
                        realHeight = colorPickerCanvas.height;
                        realWidth = realHeight / imgRatio;
                    } else {
                        realWidth = colorPickerCanvas.width;
                        realHeight = realWidth * imgRatio;
                    }
                } else if (mode === "auto") {
                    realWidth = img.width;
                    realHeight = img.height;
                }

                //Calculate center
                startX = (colorPickerCanvas.width - realWidth) / 2;
                startY = (colorPickerCanvas.height - realHeight) / 2;

                ctx.drawImage(img, startX, startY, realWidth, realHeight);
                $(this).remove();
            });
        });

        tilePreview.on("mousemove.pipette", function (e) {
            let x = e.originalEvent.clientX + 22;
            let y = e.originalEvent.clientY - 42;

            let pixelData = ctx.getImageData(e.originalEvent.layerX, e.originalEvent.layerY, 1, 1).data;

            let rgbString = "rgb(" + pixelData[0] + ", " + pixelData[1] + ", " + pixelData[2] + ")";

            colorPreview.css("background-color", rgbString);
            colorPreview.css("left", x);
            colorPreview.css("top", y);
        });

        tilePreview.on("mouseenter.pipette", function () {
            colorPreview.css("display", "block");
        });

        tilePreview.on("mouseleave.pipette", function () {
            colorPreview.css("display", "");
        });

        editor.on("click.pipette", function (e) {
            let id = e.target.id;

            if (id !== "tile-preview" && id !== "color-tile-background-pipette" && $(target).parent("#color-tile-background").length) {
                pickColor(false);
            } else if (id === "tile-preview") {
                tileBgInput.val(rgb2hex(colorPreview.css("background-color")));
                tileBgInput.trigger("change");
                pickColor(false);
            }
        });
    } else {
        showInfo(false);
        tilePreview.removeClass("picking-color-allowed");
        colorPreview.css("display", "");
        tilePreview.off(".pipette");
        $(colorPickerCanvas).remove();
    }

    pickingColor = picking;
}