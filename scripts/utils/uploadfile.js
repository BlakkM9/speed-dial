let uploadReq;
let uploadUrlReq;
const clientID = "2e71d236b3417d4";

function uploadFile(file, callback) {

    uploadReq = $.ajax({
        url: "https://api.imgur.com/3/image",
        method: "POST",
        timeout: 0,
        headers: {Authorization: "Client-ID " + clientID},
        processData: false,
        mimeType: "mulitpart/form-data",
        contentType: false,
        data: file,

        success: function(res) {
            callback(JSON.parse(res).data.link);
        },
        error: function(res) {
            console.log("uploading failed:", res);

            switch (res.status) {
                case 400: {
                    showError("Upload failed because because of invalid data was send.</br>This usually is due to the screenshot server being down.</br>Try again later.", 10);
                    break;
                }
                case 0: {
                    if (res.statusText === "Uploading canceled") {
                        break;
                    }
                }
                //noinspection FallthroughInSwitchStatementJS
                default: {
                    showError("Upload failed with error code " + res.status);
                }
            }

            callback(null);
        }
    });
}

function uploadUrl(url) {
    uploadUrlReq = $.ajax({
        url: "https://api.imgur.com/3/image",
        method: "POST",
        timout: 0,
        headers: {Authorization: "Client-ID " + clientID},
        processData: false,
        mimeType: "url",
        contentType: false,
        data: url,

        success: function(res) {
            let link = JSON.parse(res).data.link;
            imgInput.val(link);
            imgInput.trigger("paste");
            setImgLoading(false);
        },
        error: function(res) {
            console.log("uploading failed:", res);
            setImgLoading(false);
            switch (res.status) {
                case 400: {
                    showError("Upload failed because because of invalid data was send.</br>This usually is due to the screenshot server being down.</br>Try again later.", 10);
                    break;
                }
                case 0: {
                    if (res.statusText === "Uploading canceled") {
                        break;
                    }
                }
                //noinspection FallthroughInSwitchStatementJS
                default: {
                    showError("Upload failed with error code " + res.status);
                }
            }
        }
    });
}