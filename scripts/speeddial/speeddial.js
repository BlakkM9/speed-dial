$(function() {
    settingsIcon.click(function() {
        openSettings();
    });
});

function processClick(e, tile) {

    //Only process if left or middle button
    if (e.which === 1 || e.which === 2) {
        let rowClass = tile.parent().attr("class");
        let colClass = tile.attr("class");
        let empty = colClass.includes("empty");

        rowClass = /row\d/.exec(rowClass)[0];
        colClass = /col\d/.exec(colClass)[0];

        let row = parseInt(/\d/.exec(rowClass)[0]);
        let col = parseInt(/\d/.exec(colClass)[0]);

        if (empty) {
            if (e.which === 1) {
                openEditor(row, col);
            }
        } else if (replacing) {
            if (e.which === 1) {
                showInfo(false);
                replacing = false;
                openEditor(row, col, false);
            }
        } else {
            let url = tileData[data.cols * row + col].url;
            //Left
            if (e.which === 1) {
                window.location = url;
                //Middle
            } else if (e.which === 2) {
                browser.tabs.create({
                   active: false,
                   url: url
                }).then();
            }
        }
    }
}

function openSettings() {
    if (data.advanced_settings_default) {
        window.location.href = "/settings.html";
    } else {
        displayCreator();
    }
}

// function openPrivate(row, col) {
//     browser.windows.create({
//         incognito: true,
//         url: ""
//     });
// }