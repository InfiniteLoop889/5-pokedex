async function init() {
  const BASE_URL = "https://pokeapi.co/api/v2/pokemon/?offset=0&limit=8";
  getData(BASE_URL);
}

async function getData(url) {
  try {
    let response = await fetch(url);
    const responseToJson = await response.json();
    const dataArray = responseToJson.results;
    const detailedDataArray = [];

    for (const pokemon of dataArray) {
      const detailedData = await fetchPokemonDetails(pokemon.url);
      detailedDataArray.push(detailedData);
    }

    displayData(detailedDataArray);
  } catch (error) {
    console.error(error);
  }
}

async function fetchPokemonDetails(url) {
  try {
    let response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.error(error);
  }
}

function displayData(detailedDataArray) {
  const cardTitleRef = document.querySelectorAll(".card-title");
  const imgRef = document.querySelectorAll(".pokemon-img");

  cardTitleRef.forEach((element, index) => {
    element.innerText = detailedDataArray[index].name;
  });
  imgRef.forEach((element, index) => {
    element.src = detailedDataArray[index].sprites.other["official-artwork"].front_default;
    // element.src = detailedDataArray[index].sprites.other.home.front_default;
    element.alt = detailedDataArray[index].name;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  init();
});
