//TODO add option to generate from website icon http://url-2-png.herokuapp.com/icon?url=... ready to be used (;
//TODO add advanced settings page
//TODO add reflexion height option to creator
//TODO add border radius setting
//TODO add tile shadow to settings
//TODO replace text inputs with sliders in normal settings
//TODO add gallery to editor with filter options
//TODO make secret options (hidden speed dials)
//TODO rebuild to work with js modules (to hide annoying warnings)

let loader;
let creator;
let speedDial;
let editorContainer;
let init;

$(function() {
    loader = $("#loader");
    creator = $("#creator-container");
    speedDial = $("#speeddial");
    editorContainer = $("#editor-container");

    const addURL = getQuery("url");
    //If addURL was send
    if (addURL != null) {
        save("local", {add_url: addURL}, function() {
            window.location.search = "";
        });
    } else {
        //Else check if init (not first start)
        isInit(function() {

            //If not first start
            if (init) {
                //Generate speeddial from data and open
                loadDatafromStorage(function() {
                    generateSpeedDial();
                });
            } else {
                //Check if data exists anyway or try to load data from storage
                if (!isDataLoaded()) {
                    loadDatafromStorage(function() {
                        //If no data was found
                        if (data == null) {
                            //Open blank creator
                            displayCreator();
                        } else {
                            //Generate speeddial from loaded data and open
                            generateSpeedDial();
                        }
                    });
                } else {
                    //Generate speeddial from data saved in variable
                    generateSpeedDial();
                }
            }
        });
    }
});

function isInit(callback) {
    //Check if variable is null
    if (init != null) {
        callback();
    } else {
        //If yes try to load from storage
        browser.storage.sync.get("init").then((res) => {
            //If not present in storage
            if (res.init == null) {
                //Set to false;
                init = false;
            } else {
                //Set to loaded value
                init = res.init;
            }
            callback();
        });
    }
}

function isDataLoaded() {
    return (data != null);
}

function loadDatafromStorage(callback) {
    browser.storage.sync.get("data").then((res) => {
        data = res.data;
        callback();
    }, onError);
}

//States
function setLoading(loading) {
    if (loading) {
        editorContainer.css("display", "");
        creator.css("display", "");
        speedDial.css("display", "none");
        loader.css("display", "");
    } else {
        loader.css("display", "none");
    }
}

// function isPrivateMode() {
//     let privateMode;
//
//     $(document).keydown(function(e) {
//         if (e.ctrlKey && e.altKey && e.key === "d") {
//             privateMode = true;
//         }
//     });
//
//     $(document).keyup(function(e) {
//         if (e.ctrlKey || e.altKey || e.key === "d") {
//             privateMode = false;
//         }
//     });
//
//     return privateMode;
// }