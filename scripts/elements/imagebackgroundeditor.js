let imageBackgroundEditorContainer;
let removeBgButton;
let urlBgInput;
let saveBgButton;

$(function() {
    imageBackgroundEditorContainer = $("#image-bg-editor-container");
    removeBgButton = $("#remove-bg-button");
    urlBgInput = $("#bg-url-input");
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

    $("#background-image-icon").click(function() {
        openImageBackgroundEditor(true);
    });
});

function openImageBackgroundEditor(show) {

    if (show) {
        urlBgInput.val(data.bg_image);
        imageBackgroundEditorContainer.css("display", "flex");
    } else {
        imageBackgroundEditorContainer.css("display", "");
    }
}