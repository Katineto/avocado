import format from "date-fns/format";

function createTask(title, id, done, priority, date) {
  return {
    title,
    id,
    done,
    priority,
    date: date,
    projectId: 1,
    projectTitle: "Welcome"
  };
}
function firstLoad() {
  const stepOne = createTask(
    "Click on project's name to view it's tasks",
    1,
    false,
    1,
    "No date"
  );
  const stepTwo = createTask(
    "Fill the form above to add new task",
    2,
    false,
    2,
    "No date"
  );
  const stepThree = createTask(
    "Your data is saved in local storage",
    3,
    false,
    2,
    "No date"
  );
  const today = new Date();
  let todayReadable = `${today.getFullYear()}-${Number(today.getMonth()) +
    1}-${today.getDate()}`;
  todayReadable = format(todayReadable, "MMM D, YYYY");

  const stepFour = createTask(
    "Thanks for checking out this project ❤",
    4,
    false,
    3,
    todayReadable
  );
  const welcome = [
    {
      id: 1,
      title: "Welcome",
      tasks: [stepOne, stepTwo, stepThree, stepFour]
    }
  ];
  return {
    id: 1,
    selectedProjId: 1,
    projects: [...welcome],
    taskId: 4
  };
}

export default firstLoad;
