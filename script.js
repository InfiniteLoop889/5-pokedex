const BASE_URL = "https://pokeapi.co/api/v2/pokemon/ditto";

async function init() {
  console.log(BASE_URL);
}

// to implement:
// GET
// POST
// PUT
// DELETE

async function getData(url) {
  try {
    let response = await fetch(url);
    const responseToJson = await response.json();
    console.log(responseToJson);
  } catch (error) {
    console.error(error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  init();
  getData(BASE_URL);
});
