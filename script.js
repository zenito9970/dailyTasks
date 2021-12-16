$(function() {
    const tasklist = (() => {
        const json = localStorage.getItem("savedata");
        if (!json) return {};
        return JSON.parse(json).tasklist;
    })();

    function save() {
        const json = JSON.stringify({
            tasklist: tasklist,
        });
        localStorage.setItem("savedata", json);
    }

    function createNewTask(id) {
        const container = $("#task-list");
        const div = $('<div class="task-line"></div>');
        const checkbox = $('<input type="checkbox">');
        const textbox = $('<input type="text" class="task-text" placeholder="task">');
        const clearbutton = $('<button class="clear-button"><span class="batsu"></span></button>');

        if (!id) {
            id = newUlid();
        }

        if (id in tasklist) {
            textbox.val(tasklist[id].text);
            const checked = tasklist[id].checked;
            checkbox.prop("checked", checked);
            if (checked) textbox.addClass("line-through");
        } else {
            tasklist[id] = {
                text: "",
                checked: false,
            };
        }

        checkbox.change(() => {
            const checked = checkbox.is(":checked");
            if (checked) {
                textbox.addClass("line-through");
            } else {
                textbox.removeClass("line-through");
            }

            tasklist[id].checked = checked;
            save();
        });

        clearbutton.click(() => {
            div.remove();
            delete tasklist[id];
            save();
        });

        textbox.blur(() => {
            tasklist[id].text = textbox.val();
            save();
        });

        div.append(checkbox);
        div.append(textbox);
        div.append(clearbutton);
        container.append(div);
    }

    $("#add-task-button").click(function() {
        createNewTask();
    });

    $("#all-reset-button").click(function() {
        $('input[type="checkbox"]').prop("checked", false);
        $('input[type="text"]').removeClass("line-through");
        for (const id in tasklist) tasklist[id].checked = false;
        save();
    });

    for (const id in tasklist) {
        createNewTask(id);
    }
});
