import close from "./assets/close.png";
import inboxIcon from './assets/inbox.png';
import todayIcon from './assets/today.png';
import daysIcon from './assets/7-days.png';
import importantIcon from './assets/important.png';


const loader = (function () {
    function load() {
        nav();
        side();
        createProjects();
        main();

    }

    function nav() {
        let content = document.createElement("div");
        content.classList.add("content");
        let div = document.createElement("div");
        div.classList.add("nav");
        let logo = document.createElement("div");
        logo.textContent = "To Do";
        logo.classList.add("logo");
        let buttonContainer = document.createElement("div");
        let button = document.createElement("button");
        buttonContainer.classList.add("button-container");
        button.textContent = "+"
        button.classList.add("add-btn");
        buttonContainer.append(button);
        div.append(logo);
        div.append(buttonContainer);
        content.append(div);
        document.body.append(content);
    }

    function side() {
        let content = document.querySelector(".content");
        let container = document.createElement("div");
        container.classList.add("container");
        let items = ["Inbox", "Today", "This Week"];
        let src = [inboxIcon, todayIcon, daysIcon, importantIcon];
        let sidebar = document.createElement("div");
        let ul = document.createElement("ul");
        ul.classList.add("sidebar-items");
        sidebar.classList.add("sidebar")
        for (let i = 0; i < items.length; i++) {
            let li = document.createElement("li");
            let span1 = document.createElement("span");
            let span2 = document.createElement("span");

            const image = new Image();
            image.src = src[i];

            span1.append(image);
            span2.textContent = items[i];
            li.append(span1, span2);
            ul.append(li);
        }

        sidebar.append(ul);
        container.append(sidebar);
        content.append(container);
    }

    function createProjects() {
        let sidebar = document.querySelector(".sidebar");
        let div = document.createElement("div");
        div.classList.add("projects");
        let div2 = document.createElement("div");
        div2.textContent = "Projects";
        div2.classList.add("projects");
        let div3 = document.createElement("div");
        div3.classList.add("project-list");
        let ul2 = document.createElement("ul");
        ul2.classList.add("project-list-list");
        let ul = document.createElement("ul");
        let li = document.createElement("li");
        li.textContent = "+ Add Project";
        ul.append(li);
        div3.append(ul2, ul);
        div.append(div2, div3);
        sidebar.append(div);
    }
    function main() {
        let container = document.querySelector(".container");
        let main = document.createElement("div");
        main.classList.add("main");
        container.append(main);
    }

    return {
        load
    };
})();


export default loader;