function generateScreenshotWithServer(url) {
    let reqUrl = "https://url-2-png.herokuapp.com/screenshot?url=" + url + "&width=" + data.width + "&height=" + data.height;

    // console.log("screenshot reqURL:", reqUrl);

    let generationTimer = setTimeout(function() {
        showInfo("Screenshot Generation may take a few Seconds due to the Screenshot Server sleeping");
    }, 2000);

    fetch(reqUrl, {
        method: "GET",
        signal: signal,
    }).then(res => {
        clearTimeout(generationTimer);
        showInfo(false);

        res.blob().then(blobRes => {

            let blobURL = URL.createObjectURL(blobRes);

            tilePreview.css("background-image", "url(" + blobURL + ")");

            uploadFile(new File([blobRes], "preview.png", {type: "image/png"}));
        }, function() {
            onError();
            clearTimeout(generationTimer);
        });
    }, function() {
        onError();
        clearTimeout(generationTimer);
    });
}

// function generateScreenshotWithTab(url) {
//     let ratio = data.height / data.width;
//
//     browser.tabs.create({
//         url: url,
//         active: false,
//     }).then(tab => {
//         browser.tabs.hide(tab.id).then(() => {});
//
//         browser.tabs.update(tab.id, {
//             muted: true,
//         }).then(() => {});
//
//         browser.tabs.executeScript(tab.id, {
//             file: "/scripts/utils/simulateviewport.js",
//             runAt: "document_start"
//         }).then(() => {
//             browser.tabs.executeScript(tab.id, {
//                 code: "simulateViewport(" + ratio + ");",
//             }).then(() => {});
//         });
//
//         browser.runtime.onMessage.addListener(captureTab);
//
//         function captureTab() {
//
//             browser.tabs.captureTab(tab.id).then(dataURL => {
//                 fetch(dataURL).then(res => res.blob()).then(blob => {
//                     let blobURL = URL.createObjectURL(blob);
//
//                     browser.tabs.remove(tab.id).then(() =>{});
//
//                     $("<img alt=''/>").attr("src", blobURL).on("load", function () {
//                         let img = $(this)[0];
//                         let canvas = document.createElement("canvas");
//                         canvas.width = 500;
//                         canvas.height = Math.round(canvas.width * ratio);
//                         let ctx = canvas.getContext("2d");
//
//                         let imgRatio = img.height / img.width;
//                         let clippingWidth;
//                         let clippingHeight;
//
//                         if (imgRatio > ratio) {
//                             clippingWidth = img.width;
//                             clippingHeight = img.width * ratio;
//                         } else {
//                             clippingHeight = img.height;
//                             clippingWidth = img.height / ratio;
//                         }
//
//                         ctx.drawImage(img, 0, 0, clippingWidth, clippingHeight, 0, 0, canvas.width, canvas.height);
//
//                         canvas.toBlob(function(blob) {
//                             let blobUrl = URL.createObjectURL(blob);
//                             tilePreview.css("background-image", "url(" + blobUrl + ")");
//
//                             setImgLoading(false);
//
//                             $(canvas).remove();
//                             $(this).remove();
//                             browser.runtime.onMessage.removeListener(captureTab);
//                         });
//                     });
//                 });
//             });
//         }
//     });
// }
//
// function generateScreenshotWithWindow(url) {
//     let ratio = data.height / data.width;
//
//     let currentWindowId;
//     browser.windows.getLastFocused().then(window => {
//         currentWindowId = window.id;
//     });
//
//     browser.windows.create({
//         url: url,
//         type: "popup",
//         width: 0,
//         height: 0
//     }).then(window => {
//         let windowId = window.id;
//         let tab = window.tabs[0];
//
//         browser.windows.update(currentWindowId, {
//             focused: true
//         }).then(() => {});
//
//         browser.tabs.update(tab.id, {
//             muted: true,
//         }).then(() => {});
//
//         let desiredWidth = 1000;
//         let desiredHeight = 1000 * ratio;
//
//         browser.windows.update(windowId, {
//             width: desiredWidth,
//             height: desiredHeight,
//         }).then(() => {
//             browser.tabs.onUpdated.addListener(updateSize);
//
//             function updateSize(tabId, changeInfo) {
//                 if (tabId === tab.id && changeInfo.status === "complete") {
//
//                     browser.tabs.executeScript(tabId, {
//                         code:   "document.documentElement.style.overflow = 'hidden';" +
//                             "([document.documentElement.clientWidth, document.documentElement.clientHeight]);"
//                     }).then(res => {
//                         let oldWidth = res[0][0];
//                         let oldHeight = res[0][1];
//
//                         browser.windows.update(windowId, {
//                             width: desiredWidth + (desiredWidth - oldWidth),
//                             height: desiredHeight + (desiredHeight - oldHeight),
//                         }).then(() => {
//
//                             browser.tabs.captureTab(tabId).then(dataURL => {
//                                 fetch(dataURL).then(res => res.blob()).then(blob => {
//                                     let blobURL = URL.createObjectURL(blob);
//
//                                     browser.windows.remove(windowId).then(() =>{});
//
//                                     $("<img alt=''/>").attr("src", blobURL).on("load", function () {
//                                         let img = $(this)[0];
//                                         let canvas = document.createElement("canvas");
//                                         canvas.width = 500;
//                                         canvas.height = Math.round(canvas.width * ratio);
//                                         let ctx = canvas.getContext("2d");
//
//                                         ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
//
//                                         canvas.toBlob(function(blob) {
//                                             let blobUrl = URL.createObjectURL(blob);
//                                             tilePreview.css("background-image", "url(" + blobUrl + ")");
//
//                                             setImgLoading(false);
//
//                                             $(canvas).remove();
//                                             $(this).remove();
//                                             browser.runtime.onMessage.removeListener(updateSize);
//                                         });
//                                     });
//                                 });
//                             });
//                         });
//                     });
//                 }
//             }
//         })
//     });
// }