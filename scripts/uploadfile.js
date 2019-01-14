let clientID = "2e71d236b3417d4";

$(document).ready(function() {
    fileInput.on("change", function() {
        uploadFile(fileInput.prop("files")[0]);
    })
});

function uploadFile(file) {
    imgInput.prop("disabled", true);
    uploadAnimation.css("display", "block");

    $.ajax({
        url: "https://api.imgur.com/3/image",
        method: "POST",
        timeout: 0,
        headers: {Authorization: "Client-ID " + clientID},
        processData: false,
        mimeType: "mulitpart/form-data",
        contentType: false,
        data: file,

        success: function(res) {
            let link = JSON.parse(res).data.link;
            imgInput.prop("disabled", false);
            generateButton.prop("disabled", false);
            uploadAnimation.css("display", "");
            imgInput.val(link);
            imgInput.trigger("paste");
        },
        error: function(res) {
            console.log("uploading failed:");
            console.log(res);
        }
    });
}