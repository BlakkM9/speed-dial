function checkAndAdjustDataCompability() {
    console.log("checking if data is on correct version");
    if (!data.hasOwnProperty("total_width")) {
        data.total_width = 100 - data.padding;
        delete data["padding"];
        console.log("data was on old version - updated");

        saveData();
    }
}