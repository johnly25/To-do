import _, {forEach} from 'lodash';
import ToDo from './todo';
import Project from './project';
import ProjectList from './projectlist';
import loader from './loadup';
import './styles.css';
import editIcon from './assets/edit.png';
import {format, parse, isThisWeek, isToday} from 'date-fns';

const domHandler = (function () {
  const database = new ProjectList();
  const inbox = new Project('Inbox');
  let todo1 = new ToDo('eat something', 'cereal', 'Priority 5', '2023-12-19');
  let todo2 = new ToDo('eat something', 'cereal', 'Priority 5', '2023-12-19');

  inbox.add(todo1);
  inbox.add(todo2);
  database.add(inbox);

  function setup() {
    createDialog();
    createAddDialog();

    let addButton = document.querySelector('.add-btn');
    let addTaskButton = document.querySelector('#add-task-btn');
    let cancelButton = document.querySelector('#cancel-btn');
    let menu = document.querySelectorAll('.sidebar-items li');
    let projects = document.querySelectorAll('.project-list li');
    let dialog = document.querySelector('#add-task');
    let projectDialog = document.querySelector('#add-project');
    let cancelProject = document.querySelector('#cancel-project-btn');
    let addProjectBtn = document.querySelector('#add-project-btn');

    menu.forEach((item) => {
      item.addEventListener('click', (event) => {
        updateView(event.target);
      });
    });

    addButton.addEventListener('click', () => {
      dialog.showModal();
    });

    cancelButton.addEventListener('click', (e) => {
      console.log('cancel');
      dialog.close();
    });

    cancelProject.addEventListener('click', () => {
      projectDialog.close();
    });

    addProjectBtn.addEventListener('click', () => {
      addProject();
      updateProjectList();
      updateProjectDropdown();
      addProjectListener();
      projectDialog.close();
    });

    addTaskButton.addEventListener('click', (event) => {
      event.preventDefault(); // We don't want to submit this fake form
      addTask();
      dialog.close(); // Have to send the select box value here.
      clearTask();
    });

    projects.forEach((project) => {
      project.addEventListener('click', (event) => {
        if (event.target.textContent === '+ Add Project') {
          projectDialog.showModal();
        }
      });
    });
  }
  function addProjectListener() {
    let projects = document.querySelectorAll('.project-list-list li');
    projects.forEach((project) => {
      project.addEventListener('click', (event) => {
        console.log(event.target.textContent);
        projectView(event.target.textContent);
        console.log('clicked');
      });
    });
  }

  function projectView(title) {
    let main = document.querySelector('.main');
    main.textContent = '';
    let inboxContainer = document.createElement('div');
    inboxContainer.classList.add('inbox');
    main.append(inboxContainer);
    let todos = document.createElement('div');
    todos.classList.add('todo-container');
    inboxContainer.textContent = title;

    let project = database.list.find((project) => project.title === title);

    for (let i = 0; i < project.list.length; i++) {
      let div = document.createElement('div');
      let details = document.createElement('div');
      div.classList.add('task');
      details.classList.add('details');

      let input = document.createElement('input');
      let label = document.createElement('label');
      let description = document.createElement('div');
      let priority = document.createElement('div');
      let date = document.createElement('div');

      input.type = 'checkbox';
      input.id = 'task ' + i;
      input.setAttribute('index', i);
      input.classList.add('checkbox');
      label.for = 'task ' + i;
      label.textContent = project.list[i].task;
      description.textContent = project.list[i].description;
      priority.textContent = project.list[i].priority;
      date.textContent = project.list[i].date;
      let edit = document.createElement('div');
      const image = new Image();
      image.src = editIcon;
      details.append(label, description, priority, date);

      edit.append(image);
      div.append(input, details, edit);
      todos.append(div);
      main.append(todos);
    }
  }
  function updateProjectList() {
    let projectList = document.querySelector('.project-list-list');
    projectList.textContent = '';
    for (let i = 1; i < database.list.length; i++) {
      let li = document.createElement('li');
      li.textContent = database.list[i].title;
      projectList.append(li);
    }
    console.log(projectList);
  }

  function createAddDialog() {
    let dialog = document.createElement('dialog');
    let project = document.createElement('input');
    let cancel = document.createElement('button');
    let add = document.createElement('button');
    let div1 = document.createElement('div');
    let div2 = document.createElement('div');
    let div3 = document.createElement('div');
    project.type = 'text';
    project.id = 'project-name';

    project.placeholder = 'Add Project...';
    dialog.id = 'add-project';

    cancel.textContent = 'Cancel';
    add.textContent = 'Add Project';
    cancel.id = 'cancel-project-btn';
    cancel.value = 'cancel';
    add.id = 'add-project-btn';
    add.value = 'default';
    div3.classList.add('input-container');

    div1.append(project);
    div2.append(cancel, add);
    div3.append(div1, div2);
    dialog.append(div1, div2, div3);
    document.body.append(dialog);
  }

  function addProject() {
    let projectName = document.querySelector('#project-name');
    const project = new Project(projectName.value);
    database.add(project);
    projectName.value = '';
  }

  function clearTask() {
    let task = document.querySelector('#task');
    let description = document.querySelector('#description');
    let projects = document.querySelector('#projects');
    let priority = document.querySelector('#priority');
    let date = document.querySelector('#date');
    task.value = '';
    description.value = '';
    projects.value = 'Inbox';
    priority.value = 'Priority 5';
    date.value = '';
  }

  function updateView(event) {
    if (event.textContent == 'Inbox') {
      inboxView();
    } else if (event.textContent == 'Today') {
      todayView();
    } else if (event.textContent == 'This Week') {
      weekView();
    }
  }

  function weekView() {
    let main = document.querySelector('.main');
    main.textContent = '';
    let inboxContainer = document.createElement('div');
    inboxContainer.classList.add('inbox');
    main.append(inboxContainer);
    let todos = document.createElement('div');
    todos.classList.add('todo-container');
    inboxContainer.textContent = 'Inbox';

    let project = database.list.find((project) => project.title === 'Inbox');

    for (let i = 0; i < project.list.length; i++) {
      let date = parse(project.list[i].date, 'yyyy-MM-dd', new Date());
      console.log(project.list[i].date);
      console.log(date);
      console.log(isThisWeek(date));
      if (isThisWeek(date)) {
        let div = document.createElement('div');
        let details = document.createElement('div');
        div.classList.add('task');
        details.classList.add('details');

        let input = document.createElement('input');
        let label = document.createElement('label');
        let description = document.createElement('div');
        let priority = document.createElement('div');
        let date = document.createElement('div');

        input.type = 'checkbox';
        input.id = 'task ' + i;
        input.setAttribute('index', i);
        input.classList.add('checkbox');
        label.for = 'task ' + i;
        label.textContent = project.list[i].task;
        description.textContent = project.list[i].description;
        priority.textContent = project.list[i].priority;
        date.textContent = project.list[i].date;
        let edit = document.createElement('div');
        const image = new Image();
        image.src = editIcon;
        details.append(label, description, priority, date);

        edit.append(image);
        div.append(input, details, edit);
        todos.append(div);
        main.append(todos);
      }
    }
    addCheckboxListener();
  }

  function todayView() {
    let main = document.querySelector('.main');
    main.textContent = '';
    let inboxContainer = document.createElement('div');
    inboxContainer.classList.add('inbox');
    main.append(inboxContainer);
    let todos = document.createElement('div');
    todos.classList.add('todo-container');
    inboxContainer.textContent = 'Inbox';

    let project = database.list.find((project) => project.title === 'Inbox');

    for (let i = 0; i < project.list.length; i++) {
      let date = parse(project.list[i].date, 'yyyy-MM-dd', new Date());
      console.log(isToday(date));
      if (isToday(date)) {
        let div = document.createElement('div');
        let details = document.createElement('div');
        div.classList.add('task');
        details.classList.add('details');

        let input = document.createElement('input');
        let label = document.createElement('label');
        let description = document.createElement('div');
        let priority = document.createElement('div');
        let date = document.createElement('div');

        input.type = 'checkbox';
        input.id = 'task ' + i;
        input.setAttribute('index', i);
        input.classList.add('checkbox');
        label.for = 'task ' + i;
        label.textContent = project.list[i].task;
        description.textContent = project.list[i].description;
        priority.textContent = project.list[i].priority;
        date.textContent = project.list[i].date;
        let edit = document.createElement('div');
        const image = new Image();
        image.src = editIcon;
        details.append(label, description, priority, date);

        edit.append(image);
        div.append(input, details, edit);
        todos.append(div);
        main.append(todos);
      }
    }
    addCheckboxListener();
  }

  function inboxView() {
    let main = document.querySelector('.main');
    main.textContent = '';
    let inboxContainer = document.createElement('div');
    inboxContainer.classList.add('inbox');
    main.append(inboxContainer);
    let todos = document.createElement('div');
    todos.classList.add('todo-container');
    inboxContainer.textContent = 'Inbox';

    let project = database.list.find((project) => project.title === 'Inbox');

    for (let i = 0; i < project.list.length; i++) {
      let div = document.createElement('div');
      let details = document.createElement('div');
      div.classList.add('task');
      details.classList.add('details');

      let input = document.createElement('input');
      let label = document.createElement('label');
      let description = document.createElement('div');
      let priority = document.createElement('div');
      let date = document.createElement('div');

      input.type = 'checkbox';
      input.id = 'task ' + i;
      input.setAttribute('index', i);
      input.classList.add('checkbox');
      label.for = 'task ' + i;
      label.textContent = project.list[i].task;
      description.textContent = project.list[i].description;
      priority.textContent = project.list[i].priority;
      date.textContent = project.list[i].date;
      let edit = document.createElement('div');
      const image = new Image();
      image.src = editIcon;
      details.append(label, description, priority, date);

      edit.append(image);
      div.append(input, details, edit);
      todos.append(div);
      main.append(todos);
    }

    addCheckboxListener();
  }

  function addCheckboxListener() {
    let checkboxes = document.querySelectorAll('.checkbox');
    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener('change', (e) => {
        if (e.target.checked === true) {
          console.log(e.target.getAttribute('index'));
          removeTask(e.target.getAttribute('index'));
          inboxView();
        }
      });
    });
  }

  function removeTask(index) {
    let project = database.list.find((project) => project.title === 'Inbox');
    console.log(project);
    project.remove(index);
  }

  function addTask() {
    let task = document.querySelector('#task');
    let description = document.querySelector('#description');
    let projects = document.querySelector('#projects');
    let priority = document.querySelector('#priority');
    let date = document.querySelector('#date');

    let project = database.list.find(
      (project) => project.title === projects.value,
    );
    let todo = new ToDo(
      task.value,
      description.value,
      priority.value,
      date.value,
    );
    project.add(todo);
  }

  function createDialog() {
    let dialog = document.createElement('dialog');
    let task = document.createElement('input');
    let description = document.createElement('input');
    let projects = createProjectDropdown();
    let priority = createPriorityDropdown();
    let date = document.createElement('input');

    let cancel = document.createElement('button');
    let add = document.createElement('button');
    let div1 = document.createElement('div');
    let div2 = document.createElement('div');
    let div3 = document.createElement('div');
    let div4 = document.createElement('div');
    let div5 = document.createElement('div');

    description.type = 'text';
    task.type = 'text';
    date.type = 'date';
    task.placeholder = 'Add Task...';
    description.placeholder = 'description';
    dialog.id = 'add-task';
    task.id = 'task';
    date.id = 'date';
    description.id = 'description';
    cancel.textContent = 'Cancel';
    add.textContent = 'Add Task';
    cancel.id = 'cancel-btn';
    cancel.value = 'cancel';
    cancel.formmethod = 'dialog';

    add.id = 'add-task-btn';
    add.value = 'default';

    div5.classList.add('input-container');

    div1.append(task);
    div2.append(description);
    div3.append(date, projects, priority);
    div4.append(cancel, add);
    div5.append(div3, div4);
    dialog.append(div1, div2, div5);
    document.body.append(dialog);
  }

  function updateProjectDropdown() {
    let projects = document.querySelector('#projects');
    console.log(projects);
    projects.textContent = '';
    for (let i = 0; i < database.list.length; i++) {
      let option = document.createElement('option');
      option.value = database.list[i].title;
      option.textContent = database.list[i].title;
      projects.append(option);
    }
  }
  function createProjectDropdown() {
    let projects = document.createElement('select');
    projects.id = 'projects';

    for (let i = 0; i < database.list.length; i++) {
      let option = document.createElement('option');
      option.value = database.list[i].title;
      option.textContent = database.list[i].title;
      projects.append(option);
    }

    return projects;
  }

  function createPriorityDropdown() {
    let priority = document.createElement('select');
    priority.id = 'priority';
    for (let i = 1; i <= 5; i++) {
      let option = document.createElement('option');
      option.value = 'Priority ' + i;
      option.textContent = 'Priority ' + i;
      priority.append(option);
    }
    priority.value = 'Priority 5';
    return priority;
  }

  return {
    setup,
  };
})();

loader.load();
domHandler.setup();
