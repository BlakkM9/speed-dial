// browser.contextMenus.create({
//     id: "add-page-to-speeddial",
//     title: "Add page to SpeedDial",
// });

browser.contextMenus.create({
    id: "add",
    title: "Add Page",
});

// browser.contextMenus.create({
//     id: "use-as-thumbnail",
//     title: "Use as Thumbnail",
//     contexts: ["image"]
// });
//
// browser.contextMenus.create({
//     id: "add-with-thumbnail",
//     title: "Add Page with Thumnail",
//     contexts: ["image"]
// });

browser.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "add") {
        browser.tabs.create({url: "/speeddial.html?url=" + tab.url + ""});
    }
});