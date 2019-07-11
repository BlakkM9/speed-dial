// const REFLECT_BRIGHTNESS_PERCENT = 40;
// const REFLECT_BRIGHTNESS_HEX = ;
let head;
let body;
let totalWidth;
let cols, rows;
let width, height;
let vgap, hgap;
let reflection;
let bgColorInput;

let advancedSettingsLink;

let data = {};
let tileData = [];

$(function() {
    head = $("head");
    body = $("body");

    bgColorInput = $("#color-background");
    totalWidth = $("#total-width");
    cols = $("#cols");
    rows = $("#rows");
    width = $("#width");
    height = $("#height");
    vgap = $("#vgap");
    hgap = $("#hgap");
    reflection = $("#reflection");

    advancedSettingsLink = $("#advanced-settings-link");

    $("#create-button").click(function() {
        if (creatorInputIsValid()) {
            setLoading(true);
            if (!init) {
                save("sync", {init: true}, function() {
                    getAndSaveData();
                    displayCreator(false);
                    generateSpeedDial();
                    showWhatsNew(true);
                    init = true;
                });
            } else {
                getAndSaveData();
                displayCreator(false);
                generateSpeedDial();
            }
        }
    });

    creator.click(function(e) {
        if (init) {
            if (e.target.id === "creator-container") {
                creator.css("display", "none");
            }
        }
    });
});

function displayCreator(show) {
    if (show == null) {
        show = true;
    }

    if (show) {
        bgColorInput.val(data.bg);
        totalWidth.val(data.total_width);
        cols.val(data.cols);
        rows.val(data.rows);
        width.val(data.width);
        height.val(data.height);
        vgap.val(data.vgap);
        hgap.val(data.hgap);
        reflection.prop("checked", data.reflection);
        $("#create-button").html("Apply changes");

        $(bgColorInput).trigger("change");

        setLoading(false);
        creator.css("display", "flex");
    } else {
        creator.css("display", "");
    }
}

function creatorInputIsValid() {
    let valid = true;

    //Padding
    if (!totalWidth.val().match(/^[\d+][.,]?[\d]*$/)) {
        totalWidth.css("border", "1px solid red");
        valid = false;
    } else {
        totalWidth.css("border", "");
    }

    //Size
    if (!cols.val().match(/^[\d]+$/)) {
        cols.css("border", "1px solid red");
        valid = false;
    } else {
        cols.css("border", "");
    }

    if (!rows.val().match(/^[\d]+$/)) {
        rows.css("border", "1px solid red");
        valid = false;
    } else {
        rows.css("border", "");
    }

    //Ratio
    if (!width.val().match(/^[\d]+$/)) {
        width.css("border", "1px solid red");
        valid = false;
    } else {
        width.css("border", "");
    }

    if (!height.val().match(/^[\d]+$/)) {
        height.css("border", "1px solid red");
        valid = false;
    } else {
        height.css("border", "");
    }

    //Gaps
    if (!vgap.val().match(/^[\d]+$/)) {
        vgap.css("border", "1px solid red");
        valid = false;
    } else {
        vgap.css("border", "");
    }

    if (!hgap.val().match(/^[\d]+$/)) {
        hgap.css("border", "1px solid red");
        valid = false;
    } else {
        hgap.css("border", "");
    }

    if (!valid) {
        showError("Invalid input");
    }

    return valid;
}

function createData() {
    data = {};
    data.advanced_settings_default = false;
    data.advanced_settings_warning = true;
    data.total_width = 80;
    data.width = 4;
    data.height = 3;
    data.border_radius = 0;
    data.reflection = true;
    data.reflection_gap = 3;
    data.reflection_brightness = 60;
    data.reflection_height = 50;
    data.hover_effect_enabled = true;
    data.tile_bg_color = "#000000";
    data.over_opacity = 100;
    data.inactive_opacity = 70;
    data.shadow = false;
    data.shadow_color = "#000000";
    data.shadow_intensity = 60;
    data.tile_options_visible = false;
    data.bg = body.css("background-color");
    data.bg_image = "";
    data.cols = 5;
    data.rows = 3;
    data.vgap = 2;
    data.hgap = 2;
    data.show_settings_icon = true;
    data.override_homepage = false;

    data.version = browser.runtime.getManifest().version;

    save("sync", {"data": data}, function() {
        console.log("data saved");
    });
}

function getAndSaveData() {
    data.total_width = totalWidth.val();
    data.width = width.val();
    data.height = height.val();
    data.reflection = reflection.prop("checked");
    data.bg = bgColorInput.val();
    data.cols = cols.val();
    data.rows = rows.val();
    data.vgap = vgap.val();
    data.hgap = hgap.val();

    data.version = browser.runtime.getManifest().version;

    save("sync", {"data": data}, function() {
        console.log("data saved");
    });
}

function generateSpeedDial() {
    //Clear speeddial inner html and speeddial inline css
    speedDial.html("");

    //If old data format is used
    checkAndAdjustDataCompability();

    //Calculate values
    let vGapPercent = data.vgap / 10;
    let hGapPercent = data.hgap / 10;
    let tileWidthPercent = (100.0 - (data.cols - 1) * vGapPercent) / data.cols;
    let tilePaddingTop = tileWidthPercent * (data.height / data.width);

    //Create HTML
    //Rows


    for (let i = 0; i < data.rows; i++) {
        speedDial.append("<div class='row row" + i + "'></div>");
        //Cols
        for (let j = 0; j < data.cols; j++) {
            let row = $(".row" + i);
            //Add background for tile
            let tileBg = $("<div class='tile bg'></div>");
            row.append(tileBg);
            tileBg.css("left", ((tileWidthPercent + vGapPercent) * j) + "%");

            //Add tile
            row.append("<div draggable='true' class='tile col" + j + " empty'></div>");
            //Add spacer
            if (j !== (data.cols - 1)) {
                row.append("<div class='vspacer'></div>");
            }
        }
    }

    //Reflection
    let reflectionRow;
    if (data.reflection) {
        speedDial.append("<div id='reflection-container'><div class='row reflection'></div></div>");
        reflectionRow = $(".row.reflection");

        //Add gradient
        reflectionRow.append("<img id='reflection-gradient' alt='' src='../images/transparent.png'/>");

        //Add tile reflections
        for (let i = 0; i < data.cols; i++) {
            //Tile bg
            let tileBg = $("<div class='tile bg reflection'></div>");
            reflectionRow.append(tileBg);
            tileBg.css("left", ((tileWidthPercent + vGapPercent) * i) + "%");

            reflectionRow.append("<div class='tile col" + i + " reflection empty'></div>");
            //Add spacer
            if (i !== (data.cols - 1)) {
                reflectionRow.append("<div class='vspacer'></div>");
            }
        }
    }

    let tile = $(".tile");

    //Create CSS
    //Spacers
    $(".vspacer").css("width", vGapPercent + "%");

    //Setting icon
    if (data.show_settings_icon) {
        settingsIcon.css("display", "block");
    }

    //SpeedDial
    speedDial.css("width", data.total_width + "%");

    //Background
    body.css("background-color", data.bg);
    //If background image is set
    if (data.bg_image.length !== 0) {
        body.css("background-image", "url('" + data.bg_image + "')");
    } else {
        body.css("background-image", "");
    }

    //Tiles + rows
    tile.css("width", tileWidthPercent + "%");
    tile.css("padding-top", tilePaddingTop + "%");
    tile.css("border-radius", data.border_radius + "%");
    if (!data.hover_effect_enabled) {
        tile.css("opacity", "1");
    } else {
        tile.css("opacity", (data.inactive_opacity / 100));
    }
    if (data.shadow) {
        let hexIntensity = dec2hex(Math.round(255 * ((data.shadow_intensity) / 100)));
        tile.css("box-shadow", "0 1px 8px 0 " + data.shadow_color + hexIntensity);
    }
    $(".row").css("margin-bottom", hGapPercent + "%");

    //Tile bg
    let tileBg = $(".tile.bg");
    tileBg.css("position", "absolute");
    tileBg.css("background", data.tile_bg_color);
    tileBg.css("opacity", "1");

    //Reflection row
    if (data.reflection) {
        let reflectContainer = $("#reflection-container");
        reflectionRow.css("height", data.reflection_height + "%");
        $(".row:nth-last-child(2)").css("margin-bottom", 0);
        $(".row:last-child").css("margin-bottom", 0);

        //Calculate top offset of speeddial to be centered again with reflection height
        let rowHeight = speedDial.width() * (tilePaddingTop / 100);
        let diffInPx =  (rowHeight *  (100 - data.reflection_height)) / 100;
        let speedDialTop = ((diffInPx / body.height() * 100) / 2) + "%";
        reflectContainer.css("margin-top", data.reflection_gap + "%");
        speedDial.css("top", speedDialTop);

        //Reflection tile bg
        let tileBg = $(".tile.bg.reflection");
        tileBg.css("z-index", "-1");

        //Gradient
        let reflectionGradient = $("#reflection-gradient");

        //Gradient
        const heightPadding = 40;
        let reflectionAlpha = (100 - data.reflection_brightness) / 100;
        let reflectionGradientPadding = (100 - data.total_width) / 2;
        let reflectionGradientHeight = (((100 * 100) / data.reflection_height) + heightPadding);
        let reflectionGradientEndpoint = ((reflectionGradientHeight - heightPadding) * data.reflection_height) / reflectionGradientHeight;
        reflectionGradient.css("width", (100 + reflectionGradientPadding * 2) + "%");
        reflectionGradient.css("height",  reflectionGradientHeight + "%");
        reflectionGradient.css("left", -reflectionGradientPadding + "%");
        reflectionGradient.css("background-color", data.bg);
        reflectionGradient.css("mask-image",
            "linear-gradient(rgba(0, 0, 0, " + reflectionAlpha + "), black " + reflectionGradientEndpoint + "%)");
        //Image pos
        if (data.bg_image.length !== 0) {
            reflectionGradient.css("background-image", "url('" + data.bg_image + "')");
        } else {
            reflectionGradient.css("background-image", "");
        }

    } else {
        $(".row:last-child").css("margin-bottom", 0);
        speedDial.css("top", "0");
    }

    //Add listeners
    //TODO implement proper click listener not mouseup
    //Click (left and middle mouse button)
    tile.mouseup(function(e) {
        processClick(e, $(this));
    });

    //Hover
    if (data.hover_effect_enabled) {
        tile.hover(function() {
            $(this).css("opacity", (data.over_opacity / 100));
            if (data.reflection && $(this).attr("id") == null) {
                if ($(this).parent().attr("class").includes("row" + (data.rows - 1))) {
                    let col = /col\d/.exec($(this).attr("class"))[0];
                    let reflexTile = $("." + col + ".reflection");
                    reflexTile.css("opacity", (data.over_opacity / 100));
                }
            }
        }, function() {
            $(this).css("opacity", (data.inactive_opacity / 100));
            if (data.reflection && $(this).attr("id") == null) {
                if ($(this).parent().attr("class").includes("row" + (data.rows - 1))) {
                    let col = /col\d/.exec($(this).attr("class"))[0];
                    $("." + col + ".reflection").css("opacity", (data.inactive_opacity / 100));
                }
            }
        });
    }

    //Drag and drop
    tile.on("dragstart", function(e) {drag(e)});
    tile.on("dragover", function(e) {allowDrag(e)});
    tile.on("dragleave", function(e) {unmarkTarget(e)});
    tile.on("drop", function(e) {drop(e)});

    //Check if tile data exists and create/load and set it
    if (tileData.length === 0) {
        get("sync", "tileData", function(res) {
            if (res.tileData == null) {
                createTileData();
                applyTileData();
            } else {
                //Tile data found
                tileData = res.tileData;
                //Check if up to date
                checkAndAdjustTileDataCompability();
                validateTileDataSize();
                applyTileData();

            }
        });
    } else {
        validateTileDataSize();
        applyTileData();
    }
}

function validateTileDataSize() {
    //Check if tiledata is up to date
    if (tileData.length === data.cols * data.rows) {
        //Size fits
    } else if (tileData.length > data.cols * data.rows) {
        //If tiles were removed
    } else if (tileData.length < data.cols * data.rows) {
        //If tiles were added
        let diff = data.cols * data.rows - tileData.length;

        for (let i = 0; i < diff; i++) {
            tileData.push({
                "img": "none",
                "url": "none",
                "size": "contain",
                "bg": "#000000"
            });
        }
    }
}

function createTileData() {

    for (let i = 0; i < data.rows ; i++) {
        for (let j = 0; j < data.cols; j++) {
            tileData.push({
                "img": "none",
                "url": "none",
                "size": "contain",
                "bg": "#000000"
            });
        }
    }
}

function applyTileData() {
    let imageCount = 0;
    let loadedImages = 0;

    for (let i = 0; i < data.rows; i++) {
        for (let j = 0; j < data.cols; j++) {
            let tile = $(".row" + i + " .col" + j);
            let currTileData = tileData[data.cols * i + j];
            if (currTileData.img !== "none") {
                imageCount++;
                $("<img alt=''/>").attr("src", currTileData.img).on("load", function() {
                    tile.css("background-image", "url('" + currTileData.img + "')");
                    tile.css("background-size", currTileData.size);
                    tile.css("background-color", currTileData.bg);
                    tile.removeClass("empty");
                    loadedImages++;
                    $(this).remove();

                    if (loadedImages === imageCount) {
                        setLoading(false);
                        speedDial.css("display", "flex");
                    }
                }).on("error", function() {
                    console.log("failed to load image", (loadedImages + 1));
                });
            } else {
                tile.css("background-image", "");
                tile.css("background-size", "");
                tile.css("background-color", "");
                tile.addClass("empty");
            }
        }
    }

    if (imageCount === 0) {
        setLoading(false);
        speedDial.css("display", "flex");
    }

    if (data.reflection) {
        for (let j = 0; j < data.cols; j++) {
            let tile = $(".reflection.col" + j);
            let currTileData = tileData[data.cols * (data.rows - 1) + j];
            if (currTileData.img !== "none") {
                tile.css("background-image", "url(" + currTileData.img + ")");
                tile.css("background-size", currTileData.size);
                tile.css("background-color", currTileData.bg);
                tile.removeClass("empty");
            } else {
                tile.css("background-image", "");
                tile.css("background-size", "");
                tile.css("background-color", "");
                tile.addClass("empty");
            }
        }
    }

    save("sync", {tileData: tileData}, function() {
        //Check opened via add context menu
        getAddURL(function(addURL) {
            if (addURL != null) {
                console.log("add url:", addURL);
                openFirstEmpty(addURL);
            }
        })
    });
}

function getAddURL(callback) {
    get("local", "add_url", function(res) {
        let addURL = res.add_url;
        remove("local", "add_url", function() {
            callback(addURL);
        });
    });
}