function checkAndAdjustDataCompability() {
    console.log("checking if data is on correct version", data);

    if (!data.hasOwnProperty("total_width")) {
        data.total_width = 100 - data.padding;
        delete data.padding;
        console.log("data was on old version - updated");
        console.log(data);
        save("sync", {"data": data}, function() {
            console.log("data saved with new format");
        });
    } else {
        console.log("data was fomat was up to date");
    }
}