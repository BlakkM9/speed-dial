const REFLECT_BRIGHTNESS_PERCENT = 60;
const REFLECT_HEIGHT_PERCENT = 50;
const REFLECT_DISTANCE_PERCENT = 3;
const REFLECT_BRIGHTNESS_HEX = dec2hex(Math.round(255 * (REFLECT_BRIGHTNESS_PERCENT / 100)));
let head;
let body;
let colorInput;
let totalWidth;
let cols, rows;
let width, height;
let vgap, hgap;
let reflection;

let data;
let tileData = [];

$(function() {
    head = $("head");
    body = $("body");
    colorInput = $(".color-input");

    totalWidth = $("#total-width");
    cols = $("#cols");
    rows = $("#rows");
    width = $("#width");
    height = $("#height");
    vgap = $("#vgap");
    hgap = $("#hgap");
    reflection = $("#reflection");

    $("#create-button").click(function() {
        if (creatorInputIsValid()) {
            setLoading(true);
            save("sync", {init: true}, function() {
                init = true;
                saveData();
                displayCreator(false);
            });
            browser.storage.sync.set({init: true}).then(() => {
                generateSpeedDial();
            }, onError);
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
        if (data == null || !init) {
            colorInput.val(rgb2hex(body.css("background-color").toString()));
            totalWidth.val("90");
            cols.val("5");
            rows.val("3");
            width.val("4");
            height.val("3");
            vgap.val("2");
            hgap.val("2");
            reflection.prop("checked", false);
            speedDial.css("display", "");
            creator.css("background-color", "transparent");
        } else {
            colorInput.val(data.bg);
            totalWidth.val(data.total_width);
            cols.val(data.cols);
            rows.val(data.rows);
            width.val(data.width);
            height.val(data.height);
            vgap.val(data.vgap);
            hgap.val(data.hgap);
            reflection.prop("checked", data.reflection);
            $("#create-button").html("Apply changes");
            creator.css("background-color", "");
        }

        $(colorInput).trigger("change");

        setLoading(false);
        creator.css("display", "grid");
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

function saveData() {

    data = {
        "bg": colorInput.val(),

        "total_width": parseFloat(totalWidth.val()),

        "cols": parseInt(cols.val()),
        "rows": parseInt(rows.val()),

        "width": parseInt(width.val()),
        "height": parseInt(height.val()),

        "vgap": parseInt(vgap.val()),
        "hgap": parseInt(hgap.val()),

        "reflection": reflection.prop("checked")
    };

    save("sync", {"data": data}, function() {
        console.log("data saved");
    });
}

function generateSpeedDial() {
    //Clear speeddial inner html and speeddial inline css
    speedDial.html("");

    //If old data format is used
    checkAndAdjustDataCompability();

    //Create HTML
    //Rows
    for (let i = 0; i < data.rows; i++) {
        speedDial.append("<div class='row row" + i + "'></div>");
        //Cols
        for (let j = 0; j < data.cols; j++) {
            let row = $(".row" + i);
            row.append("<div draggable='true' class='tile col" + j + " empty'></div>");
            //Add spacer
            if (j !== (data.cols - 1)) {
                row.append("<div class='vspacer'></div>");
            }
        }
    }

    let reflectionRow;
    //Reflection
    if (data.reflection) {
        speedDial.append("<div id='reflection-container'><div class='row reflection'></div></div>");
        reflectionRow = $(".row.reflection");
        for (let i = 0; i < data.cols; i++) {
            reflectionRow.append("<div class='tile col" + i + " reflection empty'></div>");
            //Add spacer
            if (i !== (data.cols - 1)) {
                reflectionRow.append("<div class='vspacer'></div>");
            }
        }

        reflectionRow.css("background", "linear-gradient(" + data.bg + REFLECT_BRIGHTNESS_HEX + ", " + data.bg + ")");
    }

    //Calculate values
    let vGapPercent = data.vgap / 10;
    let hGapPercent = data.hgap / 10;
    let tileWidthPercent = (100.0 - (data.cols - 1) * vGapPercent) / data.cols;
    let tilePaddingTop = tileWidthPercent * (data.height / data.width);

    let tile = $(".tile");

    //Create CSS
    //Spacers
    $(".vspacer").css("width", vGapPercent + "%");

    //SpeedDial
    speedDial.css("width", data.total_width + "%");

    //Background
    body.css("background-color", data.bg);

    //Tiles + rows
    tile.css("width", tileWidthPercent + "%");
    tile.css("padding-top", tilePaddingTop + "%");
    $(".row").css("margin-bottom", hGapPercent + "%");

    //Reflection row
    if (data.reflection) {
        $("#reflection-container").css("margin-top", REFLECT_DISTANCE_PERCENT + "%");
        reflectionRow.css("height", REFLECT_HEIGHT_PERCENT + "%");
        $(".row:nth-last-child(2)").css("margin-bottom", 0);
    } else {
        $(".row:last-child").css("margin-bottom", 0);
    }

    //Add listeners
    //Click
    tile.click(function(e) {
        processClick(e, $(this));
    });

    //Hover
    tile.hover(function() {
        $(this).css("opacity", "1");
        if (data.reflection && $(this).attr("id") == null) {
            if ($(this).parent().attr("class").includes("row" + (data.rows - 1))) {
                let col = /col\d/.exec($(this).attr("class"))[0];
                let reflexTile = $("." + col + ".reflection");
                reflexTile.css("opacity", "1");
            }
        }
    }, function() {
        $(this).css("opacity", "");
        if (data.reflection && $(this).attr("id") == null) {
            if ($(this).parent().attr("class").includes("row" + (data.rows - 1))) {
                let col = /col\d/.exec($(this).attr("class"))[0];
                $("." + col + ".reflection").css("opacity", "");
            }
        }
    });

    //Drag and drop
    tile.on("dragstart", function(e) {drag(e)});
    tile.on("dragover", function(e) {allowDrag(e)});
    tile.on("drop", function(e) {drop(e)});

    //Check if tile data exists and create/load and set it
    if (tileData.length === 0) {
        get("sync", "tileData", function(res) {
            if (res.tileData == null) {
                createTileData();
                applyTileData();
            } else {
                tileData = res.tileData;
                validateTileData();
                applyTileData();

            }
        });
    } else {
        validateTileData();
        applyTileData();
    }
}

function validateTileData() {
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
                "url": "none"
            });
        }
    }
}

function createTileData() {

    for (let i = 0; i < data.rows ; i++) {
        for (let j = 0; j < data.cols; j++) {
            tileData.push({
                "img": "none",
                "url": "none"
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
            if (tileData[data.cols * i + j].img !== "none") {
                imageCount++;
                let imgUrl = tileData[data.cols * i + j].img;
                $("<img alt=''/>").attr("src", imgUrl).on("load", function() {
                    $(this).remove();
                    tile.css("background-image", "url('" + imgUrl + "')");
                    tile.removeClass("empty");
                    loadedImages++;

                    if (loadedImages === imageCount) {
                        setLoading(false);
                        speedDial.css("display", "flex");
                    }
                }).on("error", function() {
                    console.log("failed to load image", (loadedImages + 1));
                });
            } else {
                tile.css("background-image", "");
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
            if (tileData[data.cols * (data.rows - 1) + j].img !== "none") {
                tile.css("background-image", "url(" + tileData[data.cols * (data.rows - 1) + j].img + ")");
                tile.removeClass("empty");
            } else {
                tile.css("background-image", "");
                tile.addClass("empty");
            }
        }
    }

    save("sync", {tileData: tileData}, function() {
        //Check opend via add context menu
        getAddURL(function(addURL) {
            if (addURL != null) {
                openFirstEmpty(addURL);
            }
        })
    });
}

function getAddURL(callback) {
    get("local", "add_url", function(res) {
        let addURL = res.add_url;
        console.log("loaded add url", addURL);
        remove("local", "add_url", function() {
            callback(addURL);
        });
    });
}