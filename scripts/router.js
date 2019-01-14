//TODO add info to creator and upload button
//TODO add gallery to editor with filter options
//TODO add preview to editor
//TODO add image options to editor (background-color and contain/cover)

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

    const urlParams = new URLSearchParams(window.location.search);
    const addURL = urlParams.get("url");

    if (addURL != null) {
        browser.storage.sync.set({add: addURL}).then(() => {
            console.log("add url saved:"  + addURL);
            window.location.search = "";
        });
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

function isInit(callback) {
    if (init != null) {
        callback(init);
    } else {
        browser.storage.sync.get("init").then((res) => {
            callback(res.init);
        });
    }
}

function setLoading(loading) {
    if (loading) {
        editor.css("display", "");
        creator.css("display", "");
        speedDial.css("display", "none");
        loader.css("display", "block");
    }
}