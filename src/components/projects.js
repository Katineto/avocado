import React, { Component } from "react";

class Projects extends Component {
  render() {
    const {
      projects,
      handleClick,
      selectProject,
      deleteProject,
      selectedProj
    } = this.props;

    return (
      <div className="proj-wrapper">
        <h2>Projects</h2>
        {projects.map(proj => {
          return (
            <div
              key={proj.id}
              className={
                proj.id === selectedProj ? "project-selected" : "project"
              }
            >
              <p
                className="proj-title"
                onClick={() => selectProject(proj.id)}
                key={proj.id}
              >
                {proj.title}
              </p>
              <button
                className="delete-proj-btn"
                onClick={() => deleteProject(proj.id)}
              />
            </div>
          );
        })}
        <AddProjectForm addProject={handleClick} />
      </div>
    );
  }
}

class AddProjectForm extends Component {
  render(props) {
    return (
      <form id="add-proj-form">
        <input type="text" id="proj-form-input" />
        <button
          type="submit"
          id="add-proj-btn"
          onClick={e => {
            e.preventDefault();
            const element = document.getElementById("proj-form-input");
            const value = element.value;
            element.value = "";
            return this.props.addProject(value);
          }}
        >
          Add
        </button>
      </form>
    );
  }
}

export default Projects;
