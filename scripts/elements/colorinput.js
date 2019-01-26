let colorInput;
let hexInput;

$(function() {

    colorInput = $(".color-input");
    hexInput = $(".color-input-container > .text-input");

    colorInput.change(function() {
        let currInput = $(this);
        let val = currInput.val();

        currInput.parent().css("background-color", val);
        currInput.parent().removeClass("active");
        currInput.parent().parent().find(".text-input").val(val.substr(1, val.length));
    });

    hexInput.bind("keyup input paste", function() {
        let curr = $(this);
        let val = "#" + curr.val();
        curr.find(".color-input").val(val);
        curr.next().css("background-color", val);
    });
});