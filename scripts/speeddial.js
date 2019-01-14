$(document).ready(function() {

    colorInput.change(function() {
        $(this).parent().css("background-color", colorInput.val());
    });
});

function processClick(e, tile) {

    let rowClass = tile.parent().attr("class");
    let colClass = tile.attr("class");
    let empty = colClass.includes("empty");

    rowClass = /row\d/.exec(rowClass)[0];
    colClass = /col\d/.exec(colClass)[0];

    let row = parseInt(/\d/.exec(rowClass)[0]);
    let col = parseInt(/\d/.exec(colClass)[0]);

    if (empty) {
        openEditor(row, col);
    } else {
        window.location = tileData[data.cols * row + col].url;
    }
}

function isDataLoaded() {
    return (data == null);
}

function loadDatafromStorage(callback) {
    browser.storage.sync.get("data").then((res) => {
        callback(res.data);
    }, onError);
}