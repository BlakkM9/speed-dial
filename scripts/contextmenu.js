let contextMenu;
let actionEdit;
let actionRemove;
let actionOptions;
let target;
let contextMenuOpened;

$(document).ready(function() {
    contextMenu = $("#context-menu");
    actionEdit = $("#action-edit");
    actionRemove = $("#action-remove");
    actionOptions = $("#action-options");

    $(document).contextmenu(function(e) {
        contextMenuOpened = true;
        let x = e.originalEvent.clientX;
        let y = e.originalEvent.clientY;
        let maxX = $(window).width() - contextMenu.outerWidth();
        let maxY = $(window).height() - contextMenu.outerHeight();

        //Clamp
        if (x > maxX) {
            x = maxX;
        }
        if (y > maxY) {
            y = maxY;
        }

        console.log(maxX, maxY);
        console.log(x, y);

        if(!e.target.className.includes("tile")) {
            actionOptions.css("padding-top", "10px");
            $("hr").css("display", "none");
            actionEdit.css("display", "none");
            actionRemove.css("display", "none");
        } else {
            actionOptions.css("padding-top", "");
            $("hr").css("display", "");
            actionEdit.css("display", "");
            actionRemove.css("display", "");

            //Extract tile row and col and safe in target
            let tile = $(e.target);

            target = {"row": parseInt(/\d/.exec(tile.parent().attr("class"))[0]), "col": parseInt(/\d/.exec(tile.attr("class"))[0])};
        }

        contextMenu.css("top", y + "px");
        contextMenu.css("left", x + "px");
        contextMenu.css("display", "block");

        return false;
    });

    $(document).click(function(e) {
        if (e.which === 1) {
            if (contextMenuOpened) {
                if (e.target.className !== "menu-entry" && e.target.id !== "context-menu") {
                    closeContextMenu();
                }
            }
        }
    });

    contextMenu.click(function(e) {
        switch(e.target.id) {
            case "action-edit":
                closeContextMenu();
                openEditor(target.row, target.col);
                break;
            case "action-remove":
                closeContextMenu();
                resetTile(target.row, target.col);
                break;
            case "action-options":
                closeContextMenu();
                openCreator();
                break;
            default:

        }
    });
});

function closeContextMenu() {
    contextMenuOpened = false;
    contextMenu.css("display", "");
}


function resetTile(row, col) {
    tileData[data.cols * row + col].url = "none";
    tileData[data.cols * row + col].img = "none";
    applyTileData();
}