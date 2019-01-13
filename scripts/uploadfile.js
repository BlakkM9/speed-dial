let fileInput;
let uploadAnimation;
let clientID = "2e71d236b3417d4";

$(document).ready(function() {
    fileInput = $("#img-file-input");
    uploadAnimation = $("#upload-animation");
    fileInput.on("change", function() {
        uploadFile(fileInput.prop("files")[0]);
    })
});

function uploadFile(file) {
    imgInput.val("");
    uploadAnimation.css("display", "block");

    let settings = {
        "url": "https://api.imgur.com/3/image",
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Authorization": "Client-ID " + clientID
        },
        "processData": false,
        "mimeType": "multipart/form-data",
        "contentType": false,
        "data": file
    };
    $.ajax(settings).done(function (res) {
        let link = JSON.parse(res).data.link;
        uploadAnimation.css("display", "");
        imgInput.val(link);
    });
}