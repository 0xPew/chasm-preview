const submitButton = document.getElementById("submit");
const roleInput = document.getElementById("role-input");
const textInput = document.getElementById("text-input");
const responseContainer = document.getElementById("response");

const startLoadingAnimation = () => {
  submitButton.disabled = true;
  submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
  submitButton.style.cursor = "not-allowed";
};

const stopLoadingAnimation = () => {
  submitButton.disabled = false;
  submitButton.innerHTML = '<i class="fas fa-check"></i>';
  submitButton.style.cursor = "pointer";
};

const showResponse = (timetable) => {
  responseContainer.style.display = "block";
  responseContainer.innerHTML = "";

  const table = document.createElement("table");

  const headerRow = table.insertRow(0);
  const timeHeaderCell = headerRow.insertCell(0);
  const taskHeaderCell = headerRow.insertCell(1);
  timeHeaderCell.textContent = "Time";
  taskHeaderCell.textContent = "Task";

  for (let entry of timetable) {
    const row = table.insertRow();
    const timeCell = row.insertCell(0);
    const taskCell = row.insertCell(1);
    timeCell.textContent = entry.time;
    taskCell.textContent = entry.task;
  }

  responseContainer.appendChild(table);
};


submitButton.addEventListener("click", () => {
  startLoadingAnimation();
  const roleValue = roleInput.value;
  const inputValue = textInput.value;
  const myHeaders = new Headers();

  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    input: {
      request: inputValue,
      job_role: roleValue
    }
  });

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch("https://pms.chasm.net/api/prompts/execute/204", requestOptions)
    .then(response => response.json())
    .then(result => {
      const content = result.content;

      let keepTaskList = JSON.parse(content).keep_task_list;
      let taskNames = "";

      for (let taskObj of keepTaskList) {
        for (let taskName in taskObj) {
          taskNames += taskName + ", ";
        }
      }

      taskNames = taskNames.slice(0, -2);

      const secondRequestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify({
          "input": {
            "verified_tasks": taskNames
          }
        }),
        redirect: 'follow'
      };

      return fetch("https://pms.chasm.net/api/prompts/execute/224", secondRequestOptions);
    })
    .then(response => response.json())
    .then(secondResult => {
      const content = secondResult.content;
      const timetable = JSON.parse(content).timetable;

      console.log(timetable);

      showResponse(timetable);
      stopLoadingAnimation();
    })
    .catch(error => {
      stopLoadingAnimation();
      responseContainer.innerHTML = "<h2 class='list-heading'>Error, please try again later</h2>";
    });
});