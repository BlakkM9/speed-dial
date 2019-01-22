let colorInput;

$(function() {

    colorInput = $(".color-input");

    colorInput.change(function() {
        let currInput = $(this);
        currInput.parent().css("background-color", $(this).val());
    });
});