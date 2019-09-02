let colorInput;
let hexInput;

$(function() {

    colorInput = $(".color-input");
    hexInput = $(".color-input-container > .text-input");

    colorInput.change(function() {
        let currInput = $(this);
        let val = currInput.val();

        console.log("set val:" + val.substr(1, val.length));

        currInput.parent().css("background-color", val);
        currInput.parent().removeClass("active");
        currInput.parent().parent().find(".text-input").val(val.substr(1, val.length));
    });

    hexInput.bind("keyup input paste", function() {
        let curr = $(this);
        let val = "#" + curr.val();
        curr.next().css("background-color", val);
        val = rgb2hex(curr.next().css("background-color"));
        curr.next().find(".color-input").val(val);
        colorInput.trigger("hexchange");
    });
});