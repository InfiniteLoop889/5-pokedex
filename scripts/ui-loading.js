function showLoadButton() {
  document.getElementById("button-wrapper").classList.remove("hidden");
}

function hideLoadButton() {
  document.getElementById("button-wrapper").classList.add("hidden");
}

function showLoadingButton() {
  document.getElementById("loading-button").classList.remove("hidden");
}

function hideLoadingButton() {
  document.getElementById("loading-button").classList.add("hidden");
}

function showMainLoadingSpinner() {
  document.getElementById("grid-wrapper").classList.add("hidden");
  document.getElementById("main-loading-spinner").classList.remove("hidden");
}

function hideMainLoadingSpinner() {
  document.getElementById("main-loading-spinner").classList.add("hidden");
  document.getElementById("grid-wrapper").classList.remove("hidden");
}

function showEvoLoadingSpinner() {
  document.getElementById("evolutions-wrapper").classList.add("hidden");
  document.getElementById("evo-loading-spinner").classList.remove("hidden");
}

function hideEvoLoadingSpinner() {
  document.getElementById("evo-loading-spinner").classList.add("hidden");
  document.getElementById("evolutions-wrapper").classList.remove("hidden");
}

function showSearchLoadingSpinner() {
  document.getElementById("grid-wrapper-search").classList.add("hidden");
  document.getElementById("main-loading-spinner").classList.remove("hidden");
}

function hideSearchLoadingSpinner() {
  document.getElementById("main-loading-spinner").classList.add("hidden");
  document.getElementById("grid-wrapper-search").classList.remove("hidden");
}
