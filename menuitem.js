browser.contextMenus.create({
    id: "add-page-to-speeddial",
    title: "Add page to SpeedDial",
});

browser.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "add-page-to-speeddial") {
        browser.tabs.create({url: "/speeddial.html?url=" + tab.url + ""});
    }
});