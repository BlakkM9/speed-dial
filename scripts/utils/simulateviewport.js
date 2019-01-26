function simulateViewport(ratio) {
    let iframe = document.createElement('iframe');
    let viewportRatio = document.documentElement.clientHeight / document.documentElement.clientWidth;

    document.body.innerHTML = "";
    document.body.style.margin = "0";

    iframe.style.border = "none";
    iframe.style.position = "fixed";

    if (ratio > viewportRatio) {
        iframe.height = document.documentElement.clientHeight;
        iframe.width = iframe.height / ratio;
    } else {
        iframe.width = document.documentElement.clientWidth;
        iframe.height = iframe.width * ratio;
    }

    iframe.src = window.location;
    document.body.appendChild(iframe);

    iframe.onload = function() {
        let content = iframe.contentWindow ? iframe.contentWindow.document : iframe.contentDocument;

        content.documentElement.style.overflow = "hidden";
        content.documentElement.style.position = "relative";

        browser.runtime.sendMessage({"finished": true}).then(() => {});
    };
}