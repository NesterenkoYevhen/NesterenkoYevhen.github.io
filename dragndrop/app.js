//Elements UI
const fileInput = document.querySelector(".drop-content__input");
const dropContent = document.querySelector(".drop-content");

//Events
dropContent.addEventListener("dragstart", onDragstartHandler);
dropContent.addEventListener("dragover", onDragoverHandler);
dropContent.addEventListener("dragleave", onDragleaveHandler);
dropContent.addEventListener("dragend", onDragendHandler);
dropContent.addEventListener("drop", onDropHandler);
dropContent.addEventListener("click", onClickHandler);
//dropContent.addEventListener("mousedown", onMouseDownHandler);
//document.querySelector('html').addEventListener("mouseup", onMouseUpHandler);

function onMouseDownHandler(e) {
  if (e.target.parentElement.classList.contains("thumb-nail")) {
    const targetFile = e.target.parentElement;
    targetFile.classList.add("dragging");
    targetFile.onmousedown = (e) => {
      console.log(e.target.parentElement);
    };
  }
}

function onMouseUpHandler(e) {
  //console.log(e.target.parentElement)
  // if (e.target.parentElement.classList.contains("thumb-nail")) {
  //   e.target.parentElement.classList.remove("dragging");
  // }
  if(e.target.classList.contains("thumb-nail")) {
    console.log('dsadasdasdas')
    return
  }
  console.log("dasdas");
  console.log(document.querySelectorAll(".thumb-nail"));
  [...document.querySelectorAll(".thumb-nail")].forEach(el => {
    console.log(el)
    el.classList.remove("over");
    el.classList.remove("dragging");
  })
}

function onDragoverHandler(e) {
  e.preventDefault();
  dropContent.classList.add("drop-content--over");
  if (
    e.target.parentElement &&
    e.target.parentElement.classList.contains("thumb-nail")
  ) {
    let old = document.querySelector(".over");
    old && old.classList.remove("over");
    e.target.parentElement.classList.add("over");
    e.preventDefault();
  }
  
}

function onDragleaveHandler(e) {
  dropContent.classList.remove("drop-content--over");
  if(document.querySelectorAll(".thumb-nail")) {
    [...document.querySelectorAll(".thumb-nail")].forEach(el => {
      console.log(el)
      el.classList.remove("over");
      el.classList.remove("dragging");
    })
  }
}

function onDragendHandler(e) {
  dropContent.classList.remove("drop-content--over");
  if(document.querySelectorAll(".thumb-nail")) {
    [...document.querySelectorAll(".thumb-nail")].forEach(el => {
      console.log(el)
      el.classList.remove("over");
      el.classList.remove("dragging");
    })
  }
}

function onDropHandler(e) {
  e.preventDefault();

  if (e.dataTransfer.files.length) {
    fileInput.files = e.dataTransfer.files;
    [...e.dataTransfer.files].forEach((file) => updateThumbnail(file));
  }
  dropContent.classList.remove("drop-content--over");
  if (
    e.target.parentElement &&
    e.target.parentElement.classList.contains("thumb-nail")
  ) {
    let old = document.querySelector(".dragging");
    old && old.classList.remove("dragging");
    old = document.querySelector(".over");
    old && old.classList.remove("over");
    let v = e.target.parentElement.parentElement.innerHTML;
    let fromEl = document.querySelector('#'+e.dataTransfer.getData('id'));
    let fromElCont = document.querySelector('#'+e.dataTransfer.getData('id')).innerHTML;
    e.target.parentElement.parentElement.innerHTML = fromElCont;
    fromEl.innerHTML = v;
  }
}

function onClickHandler(e) {
  if (e.target.classList.contains("thumb-nail__close")) {
    e.target.closest(".nail").remove();
    if (!dropContent.querySelector(".nail")) {
      dropContent
        .querySelector(".row")
        .insertAdjacentHTML("afterbegin", createArrow());
      return;
    }
    return;
  }
}

function onDragstartHandler(e) {
  e.dataTransfer.setData("id", e.target.id);
  e.target.querySelector(".thumb-nail").classList.add("dragging");
}

//Helpers
function updateThumbnail(file) {
  let myFile = createThumbnail(file);
  if (!myFile) {
    return;
  }
  if (document.querySelector(".arrow-block")) {
    document.querySelector(".arrow-block").remove();
  }
  dropContent.querySelector(".row").insertAdjacentHTML("beforeend", myFile);
}

let fileCount = 0;
function createThumbnail(file) {
  if (
    file.type != "text/plain" &&
    !file.type.startsWith("image/") &&
    file.type != "application/vnd.ms-excel"
  ) {
    console.log(file);
    alert("Unsupported format");
    return false;
  } else if (file.type == "text/plain") {
    fileCount += 1;
    return `<div class="nail col col-2 col-xl-3 col-lg-4 col-md-6 col-sm-6 d-flex align-items-center justify-content-center" draggable="true" id="c${fileCount}">    
      <div class="thumb-nail" data-label="${file.name}">
        <i class="fas fa-window-close thumb-nail__close"></i>
        <div class="txt"></div>
      </div>
    </div>`;
  } else if (file.type == "application/vnd.ms-excel") {
    fileCount += 1;
    return `<div class="nail col col-2 col-xl-3 col-lg-4 col-md-6 col-sm-6 d-flex align-items-center justify-content-center" draggable="true" id="c${fileCount}">    
      <div class="thumb-nail" data-label="${file.name}">
        <i class="fas fa-window-close thumb-nail__close"></i>
        <div class="csv"></div>
      </div>
    </div>`;
  } else if (file.type.startsWith("image/")) {
    fileCount += 1;
    return `<div class="nail col col-2 col-xl-3 col-lg-4 col-md-6 col-sm-6 d-flex align-items-center justify-content-center" draggable="true" id="c${fileCount}">    
        <div class="thumb-nail" data-label="${file.name}">
          <i class="fas fa-window-close thumb-nail__close"></i>
          <div class="thumb-nail__img" style="--background: url(${URL.createObjectURL(file)}"></div>
        </div>
      </div>`;
  }
}

function createArrow() {
  return `<div class="arrow-block d-block margin-auto-x">
    <div class="arrow arrow-block__img margin-auto-x"></div>
    <p class="arrow-block__desq">You can drag and drop files here to add them (you can also click to load) <p>                       
  </div>`;
}
