let imageBackgroundEditorContainer;
let urlBgInput;
let bgUploadAnimation;
let removeBgButton;
let bgBrowseButton;
let bgFileInput;
let saveBgButton;

$(function() {
    imageBackgroundEditorContainer = $("#image-bg-editor-container");
    urlBgInput = $("#bg-url-input");
    bgUploadAnimation = $("#bg-upload-animation");
    removeBgButton = $("#remove-bg-button");
    bgBrowseButton = $("#bg-browse-button");
    bgFileInput = $("#bg-img-file-input");
    saveBgButton = $("#save-bg-button");

    imageBackgroundEditorContainer.click(function(e) {
        if (e.target.id === "image-bg-editor-container") {
            openImageBackgroundEditor(false);
        }
    });

    removeBgButton.click(function() {
        openImageBackgroundEditor(false);
        data.bg_image = "";
    });

    saveBgButton.click(function() {
        openImageBackgroundEditor(false);
        data.bg_image = urlBgInput.val();
    });

    bgFileInput.on("change", function() {
        uploadFile(bgFileInput.prop("files")[0], function(url) {
            if (url !== null) {
                urlBgInput.val(url);
                urlBgInput.trigger("paste");
                bgImageLoading(false);
            } else {
                bgImageLoading(false);
            }
        });
        bgImageLoading(true);
    });

    urlBgInput.bind("keyup input paste", function() {
        if (urlIsValid(urlBgInput.val())) {
            $("<img alt=''/>").attr("src", urlBgInput.val()).on("load", function() {
                console.log("bg image loaded");
                bgBrowseButton.prop("disabled", false);
                saveBgButton.prop("disabled", false);
                $(this).remove();
            }).on("error", function() {
                console.log("Error loading preview image");
                bgBrowseButton.prop("disabled", true);
                saveBgButton.prop("disabled", true);
                $(this).remove();
            });
        } else {
            bgBrowseButton.prop("disabled", true);
            saveBgButton.prop("disabled", true);
        }

        if (urlBgInput.val().length !== 0) {
            removeBgButton.prop("disabled", false);
        } else {
            removeBgButton.prop("disabled", true);
        }

    });

    $("#background-image-icon").click(function() {
        openImageBackgroundEditor(true);
    });
});

function openImageBackgroundEditor(show) {

    if (show) {
        urlBgInput.val(data.bg_image);
        if (urlIsValid(urlBgInput.val())) {
            bgBrowseButton.prop("disabled", false);
            saveBgButton.prop("disabled", false);
        } else {
            bgBrowseButton.prop("disabled", true);
            saveBgButton.prop("disabled", true);
        }
        if (urlBgInput.val().length === 0) {
            removeBgButton.prop("disabled", true);
        }

        imageBackgroundEditorContainer.css("display", "flex");
    } else {
        imageBackgroundEditorContainer.css("display", "");
    }
}

function bgImageLoading(loading) {
    if (loading) {
        bgUploadAnimation.css("display", "block");
        urlBgInput.prop("disabled", true);
        bgFileInput.prop("disabled", true);
        bgBrowseButton.prop("disabled", true);
        saveBgButton.prop("disabled", true);
    } else {
        bgUploadAnimation.css("display", "");
        urlBgInput.prop("disabled", false);
        bgFileInput.prop("disabled", false);
        bgBrowseButton.prop("disabled", false);
    }
}