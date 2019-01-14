let urlInput;
let imgInput;
let fileInput;
let uploadAnimation;
let generateButton;
let previewTile;

$(document).ready(function() {

    urlInput = $("#url-input");
    imgInput = $("#img-input");
    fileInput = $("#img-file-input");
    uploadAnimation = $("#upload-animation");
    generateButton = $("#generate-button");
    previewTile = $("#tile-preview");


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
            previewTile.css("background-image", "url('" + imgInput.val() + "')");
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
    console.log(imgInput.val());
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

function openForFirstEmpty() {
    let firstEmpty = $(".tile.empty")[0];
    console.log(firstEmpty.parent().attr("class"));
    console.log(firstEmpty.attr("class"));
}

function openEditor(row, col) {
    let saveButton = $("#save-button");

    previewTile.css("width", (100.0 / data.cols) * 3 + "%");
    previewTile.css("padding-top", (((data.height / data.width) * 100 / data.cols) - (data.vgap / 20)) * 3 + "%");
    previewTile.css("background-color", "black");
    previewTile.css("background-image", "");
    // $("#tile-preview-container").css("display", "none");

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