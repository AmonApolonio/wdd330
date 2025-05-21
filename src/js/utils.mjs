// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const product = urlParams.get(param);
  return product
}

export function renderListWithTemplate(template, parentElement, list, position = "afterbegin", clear = false) {
  const htmlStrings = list.map(template);
  if (clear) {
    parentElement.innerHTML = "";
  }
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

export function renderWithTemplate(template, parentElement, data, callback, position = "afterbegin") {
  parentElement.insertAdjacentHTML(position, template);
  if (callback) {
    callback(data);
  }
}

export async function loadTemplate(path) {
  const res = await fetch(path);
  const template = await res.text();
  return template;
}

export async function loadHeaderFooter() {
  const headerTemplate = await loadTemplate("/partials/header.html");
  const footerTemplate = await loadTemplate("/partials/footer.html");

  const headerElement = document.querySelector("#main-header");
  const footerElement = document.querySelector("#main-footer");

  if (headerElement) {
    renderWithTemplate(headerTemplate, headerElement);
    import("./cart-badge.js").then(module => {
      if (module.updateCartCount) module.updateCartCount();
    });
  }
  if (footerElement) {
    renderWithTemplate(footerTemplate, footerElement);
  }
}

export function alertMessage(message, scroll = true) {
  const alert = document.createElement('div');
  alert.classList.add('alert');

  alert.innerHTML = `
    <span class="alert__text">${message}</span>
    <button class="alert__close" aria-label="Close">&times;</button>
  `;

  alert.addEventListener('click', function(e) {
    if (e.target.classList.contains('alert__close')) {
      const main = document.querySelector('main');
      if (main && main.contains(alert)) {
        main.removeChild(alert);
      }
    }
  });

  setTimeout(() => {
    alert.classList.add('fade-out');
    setTimeout(() => {
      const main = document.querySelector('main');
      if (main && main.contains(alert)) {
        main.removeChild(alert);
      }
    }, 500);
  }, 7000);

  const main = document.querySelector('main');
  if (main) {
    main.prepend(alert);
  }
  
  if (scroll) window.scrollTo(0, 0);
}