browser.tabs.onUpdated.addListener(function(tabId, changeInfo) {
    if (changeInfo.url === "about:home") {
        browser.storage.sync.get("data").then(res => {
            let data = res.data;
            if (data.override_homepage) {
                browser.tabs.update(tabId, {url: "../speeddial.html", loadReplace: true})
            }
        }, onError);
    }
});

function onError(error) {
    console.log(error);
}