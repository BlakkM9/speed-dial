//TODO add info to buttons and inputs
//TODO add gallery to editor with filter options
//TODO add preview to editor
//TODO add image options to editor (background-color and contain/cover)
//TODO add reflexion height option to creator

let loader;
let creator;
let speedDial;
let editor;
let init;

$(document).ready(function() {
    loader = $("#loader");
    creator = $("#creator-container");
    speedDial = $("#speeddial");
    editor = $("#editor-container");

    setTimeout(function() {
    }, 100);

    const addURL = getQuery("url");
    //If addURL is send
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
        editor.css("display", "");
        creator.css("display", "");
        speedDial.css("display", "none");
        loader.css("display", "");
    } else {
        loader.css("display", "none");
    }
}

function removeInit() {
    remove("sync", "init", function() {
        console.log("reset init");
    })
}