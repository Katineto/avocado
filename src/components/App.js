import React, { Component } from "react";
import Projects from "./projects";
import { Tasks } from "./tasks";
import TodaysTasks from "./todaystasks";
import format from "date-fns/format";
import compareAsc from "date-fns/compare_asc";

class App extends Component {
  constructor() {
    super();
    this.state = this.populateState();
  }
  //Project related functionality
  createProject(title) {
    let id = this.state.id;
    this.setState({ id: (id += 1) });
    return {
      title,
      id,
      tasks: []
    };
  }
  populateState = () => {
    if (localStorage.getItem("avocado")) {
      return this.populateStateWithLocalStorage();
    } else {
      return {
        id: 0,
        selectedProjId: 0,
        projects: [],
        taskId: 0
      };
    }
  };
  //Saving and retrieving data from local storage
  populateStateWithLocalStorage = () => {
    return JSON.parse(localStorage.getItem("avocado"));
  };
  componentDidUpdate() {
    this.saveStateToLocalStorage();
  }
  saveStateToLocalStorage = () => {
    localStorage.setItem("avocado", JSON.stringify(this.state));
  };

  addProject = title => {
    if (title === "") return;
    const newProject = this.createProject(title);
    const newState = {
      projects: [newProject, ...this.state.projects]
    };
    this.setState(newState);
    this.setState({ selectedProjId: newProject.id });
  };
  handleProjSelect = id => {
    this.setState({ selectedProjId: id });
    let projects = [...this.state.projects];
    if (projects.length > 1) {
      const currentProject = projects.filter(proj => {
        return proj.id === id;
      })[0];
      projects = projects.filter(proj => {
        return proj.id !== currentProject.id;
      });
      projects.unshift(currentProject);
      this.setState({ projects });
    }
  };
  handleProjDelete = id => {
    let projects = [...this.state.projects];
    projects = projects.filter(proj => {
      return proj.id !== id;
    });
    this.setState({
      projects
    });
    //set selectedProjId to first project's id
    if (projects.length !== 0)
      this.setState({ selectedProjId: projects[0].id });
  };

  //Task related functionality
  createTask(title, date, priority) {
    let id = this.state.taskId;
    this.setState({ taskId: (id += 1) });
    let done = false;
    const setDate = date => {
      if (date !== "") return format(date, "MMM D, YYYY");
      else return "No date";
    };
    let dueDate = setDate(date);

    return {
      title,
      id,
      done,
      priority,
      date: dueDate
    };
  }
  handleTaskCreation = (title, desc, date, priority) => {
    if (title === "") return;
    const newTask = this.createTask(title, desc, date, priority);
    newTask.projectId = this.state.selectedProjId;
    let projects = [...this.state.projects];
    const currentProject = projects.filter(
      proj => proj.id === this.state.selectedProjId
    );
    const index = projects.indexOf(currentProject[0]);
    newTask.projectTitle = projects[index].title;
    projects[index].tasks.push(newTask);
    this.setState({ projects });
  };
  handleTaskDelete = taskid => {
    const projects = [...this.state.projects];
    const currentProject = projects.filter(
      proj => proj.id === this.state.selectedProjId
    )[0];
    const index = projects.indexOf(currentProject);
    const tasks = currentProject.tasks.filter(task => {
      return task.id !== taskid;
    });
    projects[index].tasks = tasks;
    this.setState({
      projects
    });
  };
  toggleDone = taskId => {
    const projects = [...this.state.projects];
    const currentProject = projects.filter(proj => {
      return proj.id === this.state.selectedProjId;
    })[0];
    const projIndex = projects.indexOf(currentProject);

    const currentTask = currentProject.tasks.filter(task => {
      return task.id === taskId;
    })[0];
    const taskIndex = currentProject.tasks.indexOf(currentTask);
    currentTask.done = !currentTask.done;
    currentProject.tasks[taskIndex] = currentTask;
    projects[projIndex] = currentProject;

    this.setState({ projects });
  };
  handleNameSort = proj => {
    const sorted = proj.tasks.sort((a, b) => {
      const A = a.title.toUpperCase();
      const B = b.title.toUpperCase();
      if (A < B) return -1;
      if (A > B) return 1;
      else return 0;
    });
    const projects = [...this.state.projects];
    const projIndex = projects.indexOf(proj);
    projects[projIndex].tasks = sorted;
    projects[projIndex].sort = "name-sort";
    this.setState({ projects });
  };
  handleDateSort = proj => {
    const sorted = proj.tasks.sort((a, b) => {
      if (a.date === "No date") return 1;
      else return compareAsc(a.date, b.date);
    });
    const projects = [...this.state.projects];
    const projIndex = projects.indexOf(proj);
    projects[projIndex].tasks = sorted;
    projects[projIndex].sort = "date-sort";
    this.setState({ projects });
  };
  handleCompletionSort = proj => {
    const sorted = proj.tasks.sort((a, b) => {
      if (a.done === false) return -1;
      if (a.done === true) return 1;
      else return 0;
    });
    const projects = [...this.state.projects];
    const projIndex = projects.indexOf(proj);
    projects[projIndex].tasks = sorted;
    projects[projIndex].sort = "done-sort";
    this.setState({ projects });
  };
  handleStarSort = proj => {
    const sorted = proj.tasks.sort((a, b) => a.priority - b.priority);
    const projects = [...this.state.projects];
    const projIndex = projects.indexOf(proj);
    projects[projIndex].tasks = sorted;
    projects[projIndex].sort = "star-sort";
    this.setState({ projects });
  };

  render() {
    const currentProject = this.state.projects.filter(proj => {
      return proj.id === this.state.selectedProjId;
    });
    return (
      <React.Fragment>
        <Projects
          projects={this.state.projects}
          handleClick={this.addProject}
          selectProject={this.handleProjSelect}
          deleteProject={this.handleProjDelete}
          selectedProj={this.state.selectedProjId}
        />
        {this.state.projects.length === 0 && (
          <div className="tasks-wrapper">
            <h2>Tasks</h2>
            <p className="no-projects">
              You have no projects. Create a new project to add tasks.
            </p>
          </div>
        )}
        {this.state.projects.length !== 0 &&
          currentProject[0] !== undefined && (
            <Tasks
              tasks={currentProject[0].tasks}
              createNewTask={this.handleTaskCreation}
              deleteTask={this.handleTaskDelete}
              handleToggleDone={this.toggleDone}
              sortMethod={currentProject[0].sort}
              sortbyName={() => this.handleNameSort(currentProject[0])}
              sortByDate={() => this.handleDateSort(currentProject[0])}
              sortByCompletion={() =>
                this.handleCompletionSort(currentProject[0])
              }
              sortByStars={() => this.handleStarSort(currentProject[0])}
            />
          )}
        <TodaysTasks
          projects={this.state.projects}
          selectedProjId={this.state.selectedProjId}
          selectProject={this.handleProjSelect}
        />
      </React.Fragment>
    );
  }
}

export default App;
