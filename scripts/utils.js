const hexDigits = ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"];

function rgb2hex(rgb) {
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}

function hex(x) {
    return isNaN(x) ? "00" : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
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
