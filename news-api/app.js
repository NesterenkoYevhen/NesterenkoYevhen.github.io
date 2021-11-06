// Custom Http Module
function customHttp() {
  return {
    async get(url) {
      try {
        const response = await fetch(url).then((res) => res.json());
        return response;
      } catch (err) {
        console.log(err);
        return Promise.reject(err);
      }
    },
    async post(url, newHeaders = {}, data = {}) {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }).then((res) => res.json());
      if (newHeaders != {}) {
        Object.entries(newHeaders).forEach(([key, value]) => {
          response.headers = [key, value];
        });
      }
      return response;
    },
    async put(url, newHeaders = {}, data = {}) {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }).then((res) => res.json());
      if (newHeaders != {}) {
        Object.entries(newHeaders).forEach(([key, value]) => {
          response.headers = [key, value];
        });
      }
      return response;
    },
    async delete(url, newHeaders = {}) {
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());
      if (newHeaders != {}) {
        Object.entries(newHeaders).forEach(([key, value]) => {
          response.headers = [key, value];
        });
      }
      return response;
    },
  };
}
// Init http module
const http = customHttp();

const newsService = (function () {
  const apiKey = "b7bbb24c4dbb4db8a2d17fdbddac3286";
  const apiUrl = "http://newsapi.org/v2";

  return {
    topHeadlines(country = "ua", category = "technology") {
      http
        .get(
          `${apiUrl}/top-headlines?country=${country}&category=${category}&apiKey=${apiKey}`
        )
        .then((data) => onGetResponse(data))
        .catch((err) => console.log(err));
    },
    everything(query) {
      http
        .get(`${apiUrl}/everything?q=${query}&apiKey=${apiKey}`)
        .then((data) => onGetResponse(data))
        .catch((err) => console.log(err));
    },
  };
})();

//Elements
const form = document.forms["newsControls"];
const countrySelect = form.elements["country"];
const categorySelect = form.elements["category"];
const searchInput = form.elements["search"];

form.addEventListener("submit", (e) => {
  e.preventDefault();
  loadNews();
});

//  init selects
document.addEventListener("DOMContentLoaded", function () {
  M.AutoInit();
  loadNews();
});

// load news function
function loadNews() {
  showLoader();
  const country = countrySelect.value;
  const category = categorySelect.value;
  const searchText = searchInput.value;
  if (!searchText) {
    newsService.topHeadlines(country, category);
  } else {
    newsService.everything(searchText);
  }
}

//function on get response from server
function onGetResponse(res) {
  const newsContainer = document.querySelector(".news-container .row");
  removePreloader();
  if (!res.articles.length) {
    clearContainer(newsContainer);
    showEmptyMsg(newsContainer);
    return;
  }
  renderNews(res.articles);
}

//function render news
function renderNews(news) {
  const newsContainer = document.querySelector(".news-container .row");
  if (newsContainer.children.length) {
    clearContainer(newsContainer);
  }
  let fragment = "";
  news.forEach((newsItem) => {
    const el = newsTemplate(newsItem);
    fragment += el;
  });
  newsContainer.insertAdjacentHTML("afterbegin", fragment);
}

//function clear container
function clearContainer(container) {
  // container.innerHTML = '';
  let child = container.lastElementChild;
  while (child) {
    container.removeChild(child);
    child = container.lastElementChild;
  }
}

//news item template function
function newsTemplate({ urlToImage, title, url, description }) {
  let img = urlToImage;
  if (!urlToImage) {
    img = `not-available.png`;
  }
  return `
    <div class="col s12">
      <div class="card">
        <div class="card-image">
          <img src="${img}" height = "400px">
          <span class="card-title">${title || ""}</span>
        </div>
        <div class="card-content">
          <p>${description || ""}</p>
        </div>
        <div class="card-action">
          <a href="${url}">Read more</a>
        </div>
      </div>
    </div>
  `;
}

function showAlert(msg, type = "success") {
  M.toast({ html: msg, class: type });
}

//show loader function

function showLoader() {
  document.body.insertAdjacentHTML(
    "afterbegin",
    `
    <div class="progress">
      <div class="indeterminate"></div>
    </div>
    `
  );
}

// Remove loader function
function removePreloader() {
  const loader = document.querySelector(".progress");
  if (loader) {
    loader.remove();
  }
}

function showEmptyMsg(container) {
  container.insertAdjacentHTML(
    "afterbegin",
    `
    <div class="card blue-grey darken-1">
      <div class="card-content white-text">
        <span class="card-title">Error!</span>
        <p>No news found for this query!</p>
      </div>
      <div class="card-action">
        <a href="#">Try search again</a>
      </div>
    </div> 
  `
  );
}
