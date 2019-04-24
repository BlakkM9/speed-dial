function checkAndAdjustDataCompability() {
    let oldVersion = false;

    //Check if version is in data else check every change made before version was added to data
    if (!data.hasOwnProperty("version")) {
        data.version = "1.3.1";
        console.log("version was missing");
        oldVersion = true;

        //Check if padding is still existent in data
        if (!data.hasOwnProperty("total_width")) {
            data.total_width = 100 - data.padding;
            delete data.padding;
            console.log("total_width was missing");
            oldVersion = true;
        }

        //Check if optionsVisible is in data
        if (!data.hasOwnProperty("tile_options_visible")) {
            data.tile_options_visible = false;
            console.log("tile_options_visible was missing");
            oldVersion = true;
        }
    }

    let versionInt = parseInt(data.version.replace(/\./g, ""));
    console.log("current version:", versionInt);

    if (versionInt < 140) {

        data.reflection_gap = 3;
        data.reflection_height = 50;
        data.reflection_brightness = 60;
        data.border_radius = 0;
        data.shadow = false;
        data.shadow_intensity = 50;
        data.shadow_color = "#000001";

        data.advanced_settings_warning = true;
        data.advanced_settings_default = false;
    }

    if (versionInt < 150) {
        data.show_settings_icon = false;
        data.override_homepage = false;
    }

    if (versionInt < 151) {
        oldVersion = true;
        data.version = browser.runtime.getManifest().version;
    }

    if (oldVersion) {
        console.log("data was on old version - updated");
        save("sync", {"data": data}, function() {
            console.log("data saved with new format");
            console.log("new version:", parseInt(data.version.replace(/\./g, "")));

        });
        showWhatsNew(true);
    } else {
        console.log("data was up to date");
    }
}

function checkAndAdjustTileDataCompability() {
    let oldVersion = false;

    if (!tileData[0].hasOwnProperty("size")) {
        for (let i = 0; i < tileData.length; i++) {
            let currData = tileData[i];
            if (!currData.hasOwnProperty("size")) {
                tileData[i].size = "contain";
                if(!oldVersion) {
                    oldVersion = true;
                }
            }
            if (!currData.hasOwnProperty("bg")) {
                tileData[i].bg = "#000000";
                if(!oldVersion) {
                    oldVersion = true;
                }
            }
        }
    }

    if (oldVersion) {
        console.log("tile data was on old version - updated");
        save("sync", {tileData: tileData}, function() {
            console.log("tileData saved with new format");
        })
    } else {
        console.log("tile data was up to date");
    }
}