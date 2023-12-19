function createDialog() {
    let dialog = document.createElement("dialog");
    dialog.setAttribute("id", "addTask");
    let form = document.createElement("form");
    let input = document.createElement("input") 
    input.type = "text";
    form.append(input);
    dialog.append(form);
    document.body.append(dialog);
}

export default createDialog;