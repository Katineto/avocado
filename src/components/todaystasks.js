import React, { Component } from "react";
import format from "date-fns/format";

class TodaysTasks extends Component {
  render() {
    const { projects, selectProject } = this.props;
    const todaysTasks = getTodaysTasks(projects);
    return (
      <div className="today-wrapper">
        <h2 className="today-header">Today's tasks</h2>
        {todaysTasks.map(task => {
          return (
            <div
              className="today-card"
              key={task.id}
              onClick={() => selectProject(task.projectId)}
            >
              <p className="today-title">{task.title}</p>
              <p className="today-proj">In project: </p>
              <p>{task.projectTitle}</p>
            </div>
          );
        })}
      </div>
    );
  }
}

function getTodaysTasks(projects) {
  const today = new Date();
  let todayReadable = `${today.getFullYear()}-${Number(today.getMonth()) +
    1}-${today.getDate()}`;
  todayReadable = format(todayReadable, "MMM D, YYYY");

  const todaysTasks = [];
  for (let projIndex = 0; projIndex < projects.length; projIndex += 1) {
    for (
      let taskIndex = 0;
      taskIndex < projects[projIndex].tasks.length;
      taskIndex += 1
    ) {
      if (projects[projIndex].tasks[taskIndex].date === todayReadable) {
        todaysTasks.push(projects[projIndex].tasks[taskIndex]);
      }
    }
  }
  return todaysTasks;
}

export default TodaysTasks;
