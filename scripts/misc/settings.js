let settingsContainer;

let backgroundColor;
let widthInput;
let colsInput;
let rowsInput;
let vGapInput;
let hGapInput;

let reflectionInput;
let reflectionOptions;
let reflectionGapInput;
let reflectionHeightInput;
let reflectionBrightnessInput;

let hoverEffectInput;
let hoverEffectOptions;
let hoverBgColorInput;
let hoverOverOpacity;
let hoverInactiveOpacity;

let ratioWidthInput;
let ratioHeightInput;
let borderRadiusInput;

let shadowInput;
let shadowOptions;
let shadowIntensityInput;
let shadowColorInput;

let advancedSettingsWarningInput;
let advancedSettingsDefaultInput;

let settingsIconOptions;
let showSettingsIconInput;
let settingsIconColorInput;

let overrideHomepageInput;

let resetButton;
let importInput;
let exportButton;

let cancelButton;
let applyButton;

let data;

$(function() {

    settingsContainer = $("#settings-container");

    backgroundColor = $("#color-background");
    widthInput = $("#total-width");
    colsInput = $("#cols");
    rowsInput = $("#rows");
    vGapInput = $("#vgap");
    hGapInput = $("#hgap");

    reflectionInput = $("#reflection");
    reflectionOptions = $("#reflection-options");
    reflectionGapInput = $("#reflection-gap");
    reflectionHeightInput = $("#reflection-height");
    reflectionBrightnessInput = $("#reflection-brightness");

    hoverEffectInput = $("#hover-effect");
    hoverEffectOptions = $("#hover-options");
    hoverBgColorInput = $("#tile-hover-bg-color");
    hoverOverOpacity = $("#hover-over-opacity");
    hoverInactiveOpacity = $("#hover-inactive-opacity");

    ratioWidthInput = $("#width");
    ratioHeightInput = $("#height");
    borderRadiusInput = $("#border-radius");

    shadowInput = $("#shadow");
    shadowOptions = $("#shadow-options");
    shadowIntensityInput = $("#shadow-intensity");
    shadowColorInput = $("#shadow-color");

    advancedSettingsWarningInput = $("#advanced-settings-warning");
    advancedSettingsDefaultInput = $("#advanced-settings-default");

    settingsIconOptions = $("#settings-icon-options");
    showSettingsIconInput = $("#show-settings-icon");
    settingsIconColorInput = $("#settings-icon-color");

    overrideHomepageInput = $("#override-homepage");

    resetButton = $("#reset-button");
    importInput = $("#import-input");
    exportButton = $("#export-button");

    cancelButton = $("#cancel-button");
    applyButton = $("#apply-button");


    get("sync", "data", function(res) {
        data = res.data;

        if (!data.advanced_settings_warning) {
            showWarning();
        }

        //Fill inputs from data values
        backgroundColor.val(data.bg);
        widthInput.val(data.total_width);
        colsInput.val(data.cols);
        rowsInput.val(data.rows);
        vGapInput.val(data.vgap);
        hGapInput.val(data.hgap);

        reflectionInput.prop("checked", data.reflection);
        reflectionGapInput.val(data.reflection_gap);
        reflectionHeightInput.val(data.reflection_height);
        reflectionBrightnessInput.val(data.reflection_brightness);

        hoverEffectInput.prop("checked", data.hover_effect_enabled);
        hoverBgColorInput.val(data.tile_bg_color);
        hoverOverOpacity.val(data.over_opacity);
        hoverInactiveOpacity.val(data.inactive_opacity);

        ratioWidthInput.val(data.width);
        ratioHeightInput.val(data.height);
        borderRadiusInput.val(data.border_radius);

        shadowInput.prop("checked", data.shadow);
        shadowIntensityInput.val(data.shadow_intensity);
        shadowColorInput.val(data.shadow_color);

        advancedSettingsWarningInput.prop("checked", data.advanced_settings_warning);
        advancedSettingsDefaultInput.prop("checked", data.advanced_settings_default);
        showSettingsIconInput.prop("checked", data.show_settings_icon);
        overrideHomepageInput.prop("checked", data.override_homepage);

        enableReflectionOptions(reflectionInput.prop("checked"));
        enableHoverOptions(hoverEffectInput.prop("checked"));
        enableShadowOptions(shadowInput.prop("checked"));
        enableSettingsIconOptions(showSettingsIconInput.prop("checked"));

        colorInput.trigger("change");

        settingsContainer.css("display", "flex");
    });

    reflectionInput.change(function() {
        enableReflectionOptions(reflectionInput.prop("checked"));
    });

    hoverEffectInput.change(function() {
       enableHoverOptions(hoverEffectInput.prop("checked"));
    });

    shadowInput.change(function() {
        enableShadowOptions(shadowInput.prop("checked"));
    });

    showSettingsIconInput.change(function() {
        enableSettingsIconOptions(showSettingsIconInput.prop("checked"));
    });

    resetButton.click(function() {
        wipeData(function() {
            window.location.href = "/speeddial.html";
        });
    });

    importInput.on("change", function() {
        let reader = new FileReader();
        reader.onload = function() {
            let importData = reader.result;
            importData = JSON.parse(importData.toString());
            save("sync", {data: importData.data}, function() {
                save("sync", {tileData: importData.tileData}, function() {
                    location.reload();
                });
            });
        };
        reader.readAsText(importInput.prop("files")[0]);
    });

    exportButton.click(function() {
        get("sync", "tileData", function(res) {
            let exportData = JSON.stringify({tileData: res.tileData, data: data});
            // console.log(exportData);
            download(exportData, "speeddial.dat", "text/plain");
        });
    });

    cancelButton.click(function() {
        window.location.href = "/speeddial.html";
    });

    applyButton.click(function() {
        //Get values from inputs
        data.bg = backgroundColor.val();
        data.total_width = widthInput.val();
        data.cols = colsInput.val();
        data.rows = rowsInput.val();
        data.vgap = vGapInput.val();
        data.hgap = hGapInput.val();

        data.reflection = reflectionInput.prop("checked");
        data.reflection_gap = reflectionGapInput.val();
        data.reflection_height = reflectionHeightInput.val();
        data.reflection_brightness = reflectionBrightnessInput.val();

        data.hover_effect_enabled = hoverEffectInput.prop("checked");
        data.tile_bg_color = hoverBgColorInput.val();
        data.over_opacity = hoverOverOpacity.val();
        data.inactive_opacity = hoverInactiveOpacity.val();

        data.width = ratioWidthInput.val();
        data.height = ratioHeightInput.val();
        data.border_radius = borderRadiusInput.val();
        data.shadow = shadowInput.prop("checked");
        data.shadow_intensity = shadowIntensityInput.val();
        data.shadow_color = shadowColorInput.val();

        data.advanced_settings_warning = advancedSettingsWarningInput.prop("checked");
        data.advanced_settings_default = advancedSettingsDefaultInput.prop("checked");
        data.show_settings_icon = showSettingsIconInput.prop("checked");
        data.override_homepage = overrideHomepageInput.prop("checked");

        save("sync", {data: data}, function() {
            window.location.href = "/speeddial.html";
        });
    });
});

function showWarning() {
    let container = $("#warning").parent();
    let understandButton = $("#understood-button");
    let neverShowCheckbox = $("#advanced-settings-warning-window");

    container.css("display", "flex");

    understandButton.click(function() {
        data.advanced_settings_warning = neverShowCheckbox.prop("checked");
        advancedSettingsWarningInput.prop("checked", neverShowCheckbox.prop("checked"));
        save("sync", {data: data}, function() {
            container.css("display", "");
        });
    });
}

function enableReflectionOptions(enable) {
    if (enable) {
        reflectionOptions.css("opacity", "");
        reflectionOptions.css("pointer-events", "");
    } else {
        reflectionOptions.css("opacity", "0.4");
        reflectionOptions.css("pointer-events", "none");
    }
}

function enableHoverOptions(enable) {
    if (enable) {
        hoverEffectOptions.css("opacity", "");
        hoverEffectOptions.css("pointer-events", "");
    } else {
        hoverEffectOptions.css("opacity", "0.4");
        hoverEffectOptions.css("pointer-events", "none");
    }
}

function enableShadowOptions(enable) {
    if (enable) {
        shadowOptions.css("opacity", "");
        shadowOptions.css("pointer-events", "");
    } else {
        shadowOptions.css("opacity", "0.4");
        shadowOptions.css("pointer-events", "none");
    }
}

function enableSettingsIconOptions(enable) {
    if (enable) {
        settingsIconOptions.css("opacity", "");
        settingsIconOptions.css("pointer-events", "");
    } else {
        settingsIconOptions.css("opacity", "0.4");
        settingsIconOptions.css("pointer-events", "none");
    }
}