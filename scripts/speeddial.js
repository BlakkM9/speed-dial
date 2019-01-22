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
    } else if (replacing) {
        showInfo(false);
        replacing = false;
        openEditor(row, col, false);
    } else {
        // if (isPrivateMode()) {
        //     openPrivate(row, col);
        // } else {
        window.location = tileData[data.cols * row + col].url;
        // }
    }
}

// function openPrivate(row, col) {
//     browser.windows.create({
//         incognito: true,
//         url: ""
//     });
// }