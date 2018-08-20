import React, { Component } from "react";
import yellowStar from "../assets/yellow_star.svg";
import yellowStarFilled from "../assets/yellow_star_filled.svg";
import grayStar from "../assets/gray_star.svg";
import grayStarFilled from "../assets/gray_star_filled.svg";
import alphabet from "../assets/sorting_icons/alphabet.svg";
import alphabetSelected from "../assets/sorting_icons/alphabet_selected.svg";
import calendar from "../assets/sorting_icons/calendar.svg";
import calendarSelected from "../assets/sorting_icons/calendar_selected.svg";
import done from "../assets/sorting_icons/done.svg";
import doneSelected from "../assets/sorting_icons/done_selected.svg";
import star from "../assets/sorting_icons/star.svg";
import starSelected from "../assets/sorting_icons/star_selected.svg";

class Tasks extends Component {
  render(props) {
    const {
      tasks,
      createNewTask,
      deleteTask,
      handleToggleDone,
      sortbyName,
      sortByDate,
      sortByCompletion,
      sortByStars,
      sortMethod
    } = this.props;
    return (
      <div className="tasks-wrapper">
        <h2>Tasks</h2>
        <AddTaskForm handleTaskCreation={createNewTask} />
        {tasks.length === 0 && <p id="no-tasks">No tasks in this project.</p>}
        {tasks.length > 1 && (
          <SortingPanel
            sortByName={sortbyName}
            sortByDate={sortByDate}
            sortByCompletion={sortByCompletion}
            sortByStars={sortByStars}
            sortMethod={sortMethod}
          />
        )}
        <div className="task-list">
          {tasks.map(task => {
            return (
              <Task
                task={task}
                key={task.id}
                handleDelete={() => deleteTask(task.id)}
                toggleDone={() => handleToggleDone(task.id)}
              />
            );
          })}
        </div>
      </div>
    );
  }
}

class Task extends Component {
  render(props) {
    const { task } = this.props;
    const checked = task.done;
    return (
      <div
        className={
          checked === true ? "single-task task-checked" : "single-task"
        }
      >
        <input
          type="checkbox"
          id={task.id}
          checked={checked}
          onChange={this.props.toggleDone}
        />
        <p>{task.title}</p>
        <Priority
          priority={task.priority}
          setPriority={() => {}}
          checked={checked}
        />
        <p>{task.date}</p>
        <button className="delete-task-btn" onClick={this.props.handleDelete} />
      </div>
    );
  }
}

class AddTaskForm extends Component {
  constructor() {
    super();
    this.state = {
      priority: 1
    };
  }
  setPriority = starId => {
    this.setState({
      priority: Number(starId)
    });
  };
  cancelTaskCreation = () => {
    const titleElement = document.getElementById("title");
    const date = document.getElementById("duedate");
    titleElement.value = "";
    date.value = "";
  };

  render() {
    return (
      <div className="add-task-wrapper">
        <label htmlFor="title">Task title</label>
        <input type="text" id="title" />
        <label htmlFor="duedate">Due date</label>
        <input type="date" id="duedate" />
        <label id="priority" htmlFor="priority">
          Priority
        </label>
        <Priority
          setPriority={this.setPriority}
          priority={this.state.priority}
          checked={undefined}
        />
        <button id="cancel-btn" onClick={this.cancelTaskCreation}>
          Cancel
        </button>
        <button
          id="add-task-btn"
          onClick={() => {
            const titleElement = document.getElementById("title");
            const date = document.getElementById("duedate");
            const priority = this.state.priority;

            this.props.handleTaskCreation(
              titleElement.value,
              date.value,
              priority
            );
            titleElement.value = "";
            date.value = "";
          }}
        >
          Add
        </button>
      </div>
    );
  }
}

class Priority extends Component {
  getStar = (priority, imgId, checked) => {
    if (checked === undefined || checked === false) {
      if (priority >= imgId) return yellowStarFilled;
      else return yellowStar;
    } else if (checked === true) {
      if (priority >= imgId) return grayStarFilled;
      else return grayStar;
    }
  };
  render() {
    const { priority, setPriority, checked } = this.props;
    return (
      <div
        id="stars-wrapper"
        priority={priority}
        onClick={e => setPriority(e.target.id)}
      >
        <img
          src={this.getStar(priority, 1, checked)}
          alt="*"
          className="star"
          id="1"
        />
        <img
          src={this.getStar(priority, 2, checked)}
          alt="*"
          className="star"
          id="2"
        />
        <img
          src={this.getStar(priority, 3, checked)}
          alt="*"
          className="star"
          id="3"
        />
      </div>
    );
  }
}

class SortingPanel extends Component {
  getIcon = (original, projectSort, iconId) => {
    if (projectSort === undefined || projectSort !== iconId) {
      return original;
    } else if (projectSort === "name-sort" && iconId === projectSort)
      return alphabetSelected;
    else if (projectSort === "date-sort" && iconId === projectSort)
      return calendarSelected;
    else if (projectSort === "star-sort" && iconId === projectSort)
      return starSelected;
    else return doneSelected;
  };
  render() {
    const {
      sortByName,
      sortByDate,
      sortByCompletion,
      sortByStars,
      sortMethod
    } = this.props;
    return (
      <div className="sorting-panel">
        <img
          src={this.getIcon(alphabet, sortMethod, "name-sort")}
          title="Sort by name"
          className="sort"
          id="name-sort"
          alt=""
          onClick={sortByName}
        />
        <img
          src={this.getIcon(calendar, sortMethod, "date-sort")}
          title="Sort by date"
          className="sort"
          id="date-sort"
          alt=""
          onClick={sortByDate}
        />
        <img
          src={this.getIcon(star, sortMethod, "star-sort")}
          title="Sort by stars"
          className="sort"
          id="star-sort"
          alt=""
          onClick={sortByStars}
        />
        <img
          src={this.getIcon(done, sortMethod, "done-sort")}
          title="Sort by completion"
          className="sort"
          id="done-sort"
          alt=""
          onClick={sortByCompletion}
        />
      </div>
    );
  }
}

export { Tasks };
