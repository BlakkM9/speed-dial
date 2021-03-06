function drag(e) {
    let tile = $(e.target);
    let target = {"row": parseInt(/\d/.exec(tile.parent().attr("class"))[0]), "col": parseInt(/\d/.exec(tile.attr("class"))[0])};

    e.originalEvent.dataTransfer.setData("text", JSON.stringify(target));
}

function drop(e) {
    e.originalEvent.preventDefault();

    let tile = $(e.target);

    let origin = e.originalEvent.dataTransfer.getData("text");
    let target = {"row": parseInt(/\d/.exec(tile.parent().attr("class"))[0]), "col": parseInt(/\d/.exec(tile.attr("class"))[0])};

    origin = JSON.parse(origin);

    let targetIndex = data.cols * target.row + target.col;
    let originIndex = data.cols * origin.row + origin.col;

    let tempUrl = tileData[originIndex].url;
    let tempImg = tileData[originIndex].img;
    let tempBg = tileData[originIndex].bg;
    let tempSize = tileData[originIndex].size;

    tileData[originIndex].url = tileData[targetIndex].url;
    tileData[originIndex].img = tileData[targetIndex].img;
    tileData[originIndex].bg = tileData[targetIndex].bg;
    tileData[originIndex].size = tileData[targetIndex].size;

    tileData[targetIndex].url = tempUrl;
    tileData[targetIndex].img = tempImg;
    tileData[targetIndex].bg = tempBg;
    tileData[targetIndex].size = tempSize;


    applyTileData();
}

function allowDrag(e) {
    e.originalEvent.preventDefault();

    let tile = $(e.target);
    tile.css("opacity", "1");
}

function unmarkTarget(e) {
    let tile = $(e.target);
    tile.css("opacity", "");
}

