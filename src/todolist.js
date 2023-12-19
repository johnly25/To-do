class ToDoList {
    constructor(title) {
        this.title = title;
        this.list = [];
    }
    add(item) {
        this.list.push(item);
    }
    remove(index) {
        this.list.splice(index,1);
    }
}

export default ToDoList;