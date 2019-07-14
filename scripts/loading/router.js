//DID fix screenshot and icon generation!!!! (heroku account suspended, because of crypto mining?!?) / changed to other heroku account

//Next version
//TODO fix icon selection height (adjust to available height and use multiple pages)
//TODO add own color picker (with transparency)
//TODO add option to change settings icons color (and maybe size)
//TODO prompt when leaving without saving
//TODO add options for bg image (bg-size etc)
//TODO add preview to bg image selection (maybe)

//Later versions
//TODO improve info when inputs are invalid in options
//TODO add settings for screenshot method
//TODO add option for using images without uploading
//TODO extend help page
//TODO add interactive tutorial
//TODO replace text inputs with sliders in normal settings (maybe)
//TODO make secret options (hidden speed dials)
//TODO rebuild to work with js modules (to hide annoying warnings)

let loader;
let creator;
let speedDial;
let init;

$(function() {
    loader = $("#loader");
    creator = $("#creator-container");
    speedDial = $("#speeddial");

    const addURL = getQuery("url");
    //If addURL was send
    if (addURL != null) {
        save("local", {add_url: addURL}, function() {
            window.location.search = "";
        });
    } else {
        //Else check if init (not first start)
        isInit(function() {

            console.log("init", init);

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
                            console.log("no data found");
                            //Open blank creator with default settings
                            createData();
                            displayCreator();
                        } else {
                            console.log("found data in storage", data);
                            //Generate speeddial from loaded data and open
                            generateSpeedDial();
                        }
                    });
                } else {
                    console.log("data is loaded", data);
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
    return !$.isEmptyObject(data);
}

function loadDatafromStorage(callback) {
    get("sync", "data", function(res) {
        data = res.data;
        callback();
    });
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