//TODO add info to creator and upload button
//TODO add gallery to editor with filter options
//TODO add preview to editor
//TODO add image options to editor (background-color and contain/cover)
//TODO add option to use iframe as preview

let loader;
let creator;
let editor;
let init;
let remove = false;
// remove = true;

$(document).ready(function() {
    loader = $("#loader");
    creator = $("#creator-container");
    editor = $("#editor-container");
    if (remove === true) {
        browser.storage.sync.remove("init").then(() => {
            checkInit();
        }, onError);
    } else {
        checkInit();
    }
});

function checkInit() {
    browser.storage.sync.get("init").then((res) => {
        init = res.init;

        if (init !== true) {
            openCreator();

        } else {
            speedDial.css("display", "none");
            loader.css("display", "block");
            checkDataLoaded();
        }

    }, onError);
}