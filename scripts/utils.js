const rgbMatcher = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/;

function rgb2hex(rgb) {
    rgb = rgb.match(rgbMatcher);
    return "#" + dec2hex(rgb[1]) + dec2hex(rgb[2]) + dec2hex(rgb[3]);
}

function dec2hex(decInt) {
    let hexString = parseInt(decInt, 10).toString(16);
    if (hexString.length % 2) {
        hexString = '0' + hexString;
    }
    return hexString;
}

function onError(error) {
    console.log(error);
}

function getQuery(key) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(key);
}

function urlIsValid(url) {
    try {
        new URL(url);
        return true;
    } catch (_) {
        return false;
    }
}

let errorTimeout;
function showError(msg, displayTime) {
    if (displayTime == null) {
        displayTime = 4;
    }
    console.log("Error:", msg);
    let error = $("#error-message");

    error.html(msg);
    error.addClass("active");
    clearTimeout(errorTimeout);
    errorTimeout = setTimeout(function() {
        error.removeClass("active");
    }, displayTime * 1000);
}

function save(storage, data, callback) {
    if (storage === "sync") {
        browser.storage.sync.set(data).then(callback, onError);
    } else if (storage === "local") {
        browser.storage.local.set(data).then(callback, onError);
    }
}

function get(storage, name, callback) {
    if (storage === "sync") {
        browser.storage.sync.get(name).then(res => callback(res), onError);
    } else if (storage === "local") {
        browser.storage.local.get(name).then(res => callback(res), onError);
    }
}

function remove(storage, data, callback) {
    if (storage === "sync") {
        browser.storage.sync.remove(data).then(callback, onError);
    } else if (storage === "local") {
        browser.storage.local.remove(data).then(callback, onError);
    }
}
