let prompt;
let promptText;
let promptCancelButton;
let promptOkButton;

$(function() {
    prompt = $("#prompt-contaier");
    promptText = $("#prompt-text")
    promptCancelButton = $("#prompt-cancel-button");
    promptOkButton = $("#prompt-ok-button");
});

function cPrompt(message, callback) {
    promptCancelButton.off("click");
    promptOkButton.off("click");

    promptText.html(message);

    prompt.css("display", "flex");

    promptCancelButton.click(function() {
        prompt.css("display", "");
        callback(false);
    });

    promptOkButton.click(function() {
        prompt.css("display", "");
        callback(true);
    })
}