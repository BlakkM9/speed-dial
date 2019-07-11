let whatsNewContainer;
let whatsNew;
let versionHeader;
let newsDiv;
let okButton;

$(function() {
    whatsNewContainer = $("#whats-new-container");
    whatsNew = $("#whats-new");
    versionHeader = $("#version");
    newsDiv = $("#news");
    okButton = $("#whats-new-ok-button");

    whatsNewContainer.click(function(e) {
        if (e.target.id === "whats-new-container") {
            showWhatsNew(false);
        }
    });

    okButton.click(function() {
        showWhatsNew(false);
    });
});

function showWhatsNew(show) {
    if (show) {
        getNewFeatures(data.version);
        whatsNewContainer.css("display", "flex");
    } else {
        whatsNewContainer.css("display", "");
    }
}

function getNewFeatures(version) {
    versionHeader.html("v" + version);

    if (version === "1.5.0") {
        newsDiv.html(
            "- Option to Display Options Icon in top-right Corner<br><br>" +
            "- When SpeedDial was updated, it shows you what's new in this Version<br><br>" +
            "- Option added to Override the Browsers Homepage with the SpeedDial<br><br>" +
            "- When editing Tiles, there is a Pipette that can be used to pick a<br>" +
            "Color from the Preview Image<br><br>" +
            "- Minor bug fixes"
        );
    }

    if (version === "1.5.1") {
        newsDiv.html(
            "- Generate Tile Preview from Websites Logo (if possible)<br><br>" +
            "- Set Width of Image in the Tile in Percent (100 % equals \"Contain\"<br><br>" +
            "- Bug fixes");
    }

    if (version === "1.6.0") {
        newsDiv.html(
            "- Clicking on a Tile with middle Mousebutton opens Page in new Tab<br><br>" +
            "- Use an Image as Background for your SpeedDial<br><br>" +
            "- Effect when hovering Tiles is now independend of SpeedDial Background<br>" +
            "and adjustable<br><br>" +
            "- Minor bug fixes");
    }
}