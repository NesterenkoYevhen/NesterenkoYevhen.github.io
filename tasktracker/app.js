//Elements UI
const btnAddTask = document.querySelector(".task-area__add");
const inputTask = document.querySelector(".task-area__input");
const taskList = document.querySelector(".submited-tasks__list");

//Help variables
let clockTimerObj = {};
let tdMask = "tdl_";
let timeMask = "time_";
let pauseMask = "pause_";
let saveObj = {};

//Events
btnAddTask.addEventListener("click", onBtnAddTaskClickHandler);
taskList.addEventListener("click", onTaskListClickHandler);
inputTask.addEventListener("input", onInputTaskHandler);

function onInputTaskHandler({ target: { value } }) {
  localStorage.setItem("currentInput", value);
}

function onBtnAddTaskClickHandler(e) {
  let startDate = new Date();
  let newTask;
  if (inputTask.value == "") {
    newTask = taskBody(new Date().toLocaleString(), startDate);
  } else {
    newTask = taskBody(inputTask.value, startDate);
  }
  taskList.insertAdjacentHTML("afterbegin", newTask);
  inputTask.value = "";

  //Timer
  let fChild = taskList.firstChild;
  clockTimerObj[`${fChild.getAttribute("data-item-id")}`] = setInterval(
    function () {
      timer(fChild);
    },
    1000
  );
}

function onTaskListClickHandler({ target }) {
  if (target.classList.contains("submited-tasks__delete")) {
    target.closest(".submited-tasks__element").remove();
    saveObj[
      `${target
        .closest(".submited-tasks__element")
        .getAttribute("data-item-id")}`
    ].myEvent = "delete";
    localStorage.setItem(
      target.closest(".submited-tasks__element").getAttribute("data-item-id"),
      JSON.stringify(
        saveObj[
          `${target
            .closest(".submited-tasks__element")
            .getAttribute("data-item-id")}`
        ]
      )
    );
    delete clockTimerObj[
      `${target
        .closest(".submited-tasks__element")
        .getAttribute("data-item-id")}`
    ];
    localStorage.removeItem(
      `${target
        .closest(".submited-tasks__element")
        .getAttribute("data-item-id")}`
    );
    return;
  }
  if (target.classList.contains("submited-tasks__pause")) {
    //clear intarval
    clearInterval(
      clockTimerObj[
        `${target
          .closest(".submited-tasks__element")
          .getAttribute("data-item-id")}`
      ]
    );

    //delete from local obj
    delete clockTimerObj[
      `${target
        .closest(".submited-tasks__element")
        .getAttribute("data-item-id")}`
    ];

    //add pause to  attribute
    target
      .closest(".submited-tasks__element")
      .setAttribute(
        "data-pause-time",
        target
          .closest(".submited-tasks__element")
          .querySelector(".submited-tasks__time").textContent
      );

    //add pause to storage obj
    saveObj[
      `${target
        .closest(".submited-tasks__element")
        .getAttribute("data-item-id")}`
    ][`${pauseMask}`] = target
      .closest(".submited-tasks__element")
      .querySelector(".submited-tasks__time").textContent;

    saveObj[
      `${target
        .closest(".submited-tasks__element")
        .getAttribute("data-item-id")}`
    ].run = false;
    saveObj[
      `${target
        .closest(".submited-tasks__element")
        .getAttribute("data-item-id")}`
    ].myEvent = "pause";
    localStorage.setItem(
      target.closest(".submited-tasks__element").getAttribute("data-item-id"),
      JSON.stringify(
        saveObj[
          `${target
            .closest(".submited-tasks__element")
            .getAttribute("data-item-id")}`
        ]
      )
    );

    target.closest(".submited-tasks__element").classList.add("bg-light-yellow");

    target.classList.remove("fa-pause-circle", "submited-tasks__pause");

    target.classList.add("fa-play-circle", "submited-tasks__play");
    return;
  }
  if (target.classList.contains("submited-tasks__play")) {
    target
      .closest(".submited-tasks__element")
      .setAttribute("data-start-time", new Date());

    saveObj[
      `${target
        .closest(".submited-tasks__element")
        .getAttribute("data-item-id")}`
    ][`${timeMask}`] = new Date();
    saveObj[
      `${target
        .closest(".submited-tasks__element")
        .getAttribute("data-item-id")}`
    ].run = true;
    saveObj[
      `${target
        .closest(".submited-tasks__element")
        .getAttribute("data-item-id")}`
    ].myEvent = "play";
    localStorage.setItem(
      target.closest(".submited-tasks__element").getAttribute("data-item-id"),
      JSON.stringify(
        saveObj[
          `${target
            .closest(".submited-tasks__element")
            .getAttribute("data-item-id")}`
        ]
      )
    );

    clockTimerObj[
      `${target
        .closest(".submited-tasks__element")
        .getAttribute("data-item-id")}`
    ] = setInterval(function () {
      timer(target.closest(".submited-tasks__element"));
    }, 1000);

    target
      .closest(".submited-tasks__element")
      .classList.remove("bg-light-yellow");
    target.classList.remove("fa-play-circle", "submited-tasks__play");
    target.classList.add("fa-pause-circle", "submited-tasks__pause");

    return;
  }
}

//Help function

function taskBody(text, sTime) {
  let newId = 0;
  [...taskList.children].forEach((element) => {
    let oldId = element.getAttribute("data-item-id").slice(4);
    if (Number(oldId) > newId) {
      newId = oldId;
    }
  });
  newId++;
  saveObj[`${tdMask + newId}`] = {
    [`${tdMask}`]: text,
    [`${timeMask}`]: sTime,
    [`${pauseMask}`]: `00:00:00`,
    run: true,
    myEvent: "nothing",
  };
  localStorage.setItem(
    tdMask + newId,
    JSON.stringify(saveObj[`${tdMask + newId}`])
  );

  //Timer
  return `<li class='submited-tasks__element d-flex justify-content-between align-items-center' data-item-id="${
    tdMask + newId
  }" data-start-time = "${sTime}">
    <p class="submited-tasks__content">${text}</p>
    <div class="submited-tasks__duration d-flex align-items-center">
      <span class="submited-tasks__time">00:00:00</span>
      <div class="submited-tasks__pause-delete-block">
        <i class="far fa-pause-circle submited-tasks__pause"></i>
        <i class="far fa-minus-square submited-tasks__delete"></i>
      </div>
    </div>
  </li>`;
}

function showTasks() {
  let isLen = localStorage.length;
  if (isLen > 0) {
    for (let i = 0; i < isLen; i++) {
      let key = localStorage.key(i);
      if (key.indexOf(tdMask) == 0) {
        let checkStop = JSON.parse(localStorage.getItem(key)).run;
        if (checkStop) {
          let oldRunTask = buildOldRunTasks(key);
          taskList.insertAdjacentHTML("afterbegin", oldRunTask);
          let fChild = taskList.firstChild;
          clockTimerObj[`${fChild.getAttribute("data-item-id")}`] = setInterval(
            function () {
              timer(fChild);
            },
            1000
          );
        } else {
          let oldStopTask = buildOldStopTasks(key);
          taskList.insertAdjacentHTML("afterbegin", oldStopTask);
        }
      }
    }
  }
}
showTasks();

function timer(element) {
  let thisDate = new Date();
  let myDate = new Date(element.getAttribute("data-start-time"));
  let t = thisDate.getTime() - myDate.getTime();
  let ms, s, m, h;
  if (!element.getAttribute("data-pause-time")) {
    ms = t % 1000;
    t -= ms;
    ms = Math.floor(ms / 10);
    t = Math.floor(t / 1000);
    s = t % 60;
    t -= s;
    t = Math.floor(t / 60);
    m = t % 60;
    t -= m;
    t = Math.floor(t / 60);
    h = t % 60;
    if (h > 99 && m > 59 && s > 59) {
      element.querySelector(".submited-tasks__time").textContent = "99:59:59";
      return;
    }
    if (h < 10) h = "0" + h;
    if (m < 10) m = "0" + m;
    if (s < 10) s = "0" + s;
    element.querySelector(".submited-tasks__time").textContent =
      h + ":" + m + ":" + s;
  } else {
    [pH, pM, pS] = element.getAttribute("data-pause-time").split(":");
    t += pH * 60 * 60 * 1000 + pM * 60 * 1000 + pS * 1000;
    ms = t % 1000;
    t -= ms;
    ms = Math.floor(ms / 10);
    t = Math.floor(t / 1000);
    s = t % 60;
    t -= s;
    t = Math.floor(t / 60);
    m = t % 60;
    t -= m;
    t = Math.floor(t / 60);
    h = t % 60;
    if (h > 99 && m > 59 && s > 59) {
      element.querySelector(".submited-tasks__time").textContent = "99:59:59";
      return;
    }
    if (h < 10) h = "0" + h;
    if (m < 10) m = "0" + m;
    if (s < 10) s = "0" + s;
    element.querySelector(".submited-tasks__time").textContent =
      h + ":" + m + ":" + s;
  }
}

function buildOldRunTasks(itemId) {
  let saveTask = JSON.parse(localStorage.getItem(itemId));
  saveObj[`${itemId}`] = {
    [`${tdMask}`]: saveTask[tdMask],
    [`${timeMask}`]: saveTask[timeMask],
    [`${pauseMask}`]: saveTask[pauseMask],
    run: saveTask["run"],
    myEvent: "nothing",
  };
  return `<li class='submited-tasks__element d-flex justify-content-between align-items-center' data-item-id="${itemId}" data-start-time = "${saveTask[timeMask]}" data-pause-time="${saveTask[pauseMask]}">
    <p class="submited-tasks__content">${saveTask[tdMask]}</p>
    <div class="submited-tasks__duration d-flex align-items-center">
      <span class="submited-tasks__time">00:00:00</span>
      <div class="submited-tasks__pause-delete-block">
        <i class="far fa-pause-circle submited-tasks__pause"></i>
        <i class="far fa-minus-square submited-tasks__delete"></i>
      </div>
    </div>
  </li>`;
}

function buildOldStopTasks(itemId) {
  let saveTask = JSON.parse(localStorage.getItem(itemId));
  saveObj[`${itemId}`] = {
    [`${tdMask}`]: saveTask[tdMask],
    [`${timeMask}`]: saveTask[timeMask],
    [`${pauseMask}`]: saveTask[pauseMask],
    run: saveTask["run"],
    myEvent: "nothing",
  };
  return `<li class='submited-tasks__element d-flex justify-content-between align-items-center  bg-light-yellow' data-item-id="${itemId}" data-start-time = "${saveTask[timeMask]}" data-pause-time="${saveTask[pauseMask]}">
    <p class="submited-tasks__content">${saveTask[tdMask]}</p>
    <div class="submited-tasks__duration d-flex align-items-center">
      <span class="submited-tasks__time">${saveTask[pauseMask]}</span>
      <div class="submited-tasks__pause-delete-block">
        <i class="far fa-play-circle submited-tasks__play"></i>
        <i class="far fa-minus-square submited-tasks__delete"></i>
      </div>
    </div>
  </li>`;
}

window.onstorage = (event) => {
  if (event.key == "currentInput") {
    inputTask.value = event.newValue;
  }
  if (event.key.indexOf(tdMask) == 0) {
    if (event.oldValue == null) {
      onBtnAddTaskClickHandler();
    } else {
      let myTask = JSON.parse(event.newValue);
      if (myTask) {
        switch (myTask["myEvent"]) {
          case "delete":
            document.querySelector(`li[data-item-id="${event.key}"]`).remove();
            //localStorage.removeItem(event.key);
            break;
          case "pause":
            //clear interval
            clearInterval(clockTimerObj[`${event.key}`]);
            //add pause to  attribute
            document
              .querySelector(`li[data-item-id="${event.key}"]`)
              .setAttribute(
                "data-pause-time",
                document
                  .querySelector(`li[data-item-id="${event.key}"]`)
                  .querySelector(".submited-tasks__time").textContent
              );
            document
              .querySelector(`li[data-item-id="${event.key}"]`)
              .classList.add("bg-light-yellow");

            document
              .querySelector(`li[data-item-id="${event.key}"]`)
              .querySelector(`.fa-pause-circle`)
              .classList.add("fa-play-circle", "submited-tasks__play");

            document
              .querySelector(`li[data-item-id="${event.key}"]`)
              .querySelector(`.fa-pause-circle`)
              .classList.remove("fa-pause-circle", "submited-tasks__pause");
            break;
          case "play":
            document
              .querySelector(`li[data-item-id="${event.key}"]`)
              .setAttribute("data-start-time", new Date());
            clockTimerObj[`${event.key}`] = setInterval(function () {
              timer(document.querySelector(`li[data-item-id="${event.key}"]`));
            }, 1000);
            document
              .querySelector(`li[data-item-id="${event.key}"]`)
              .classList.remove("bg-light-yellow");

            document
              .querySelector(`li[data-item-id="${event.key}"]`)
              .querySelector(`.fa-play-circle`)
              .classList.add("fa-pause-circle", "submited-tasks__pause");

            document
              .querySelector(`li[data-item-id="${event.key}"]`)
              .querySelector(`.fa-pause-circle`)
              .classList.remove("fa-play-circle", "submited-tasks__play");

            break;
        }
      }
    }
  }
};
