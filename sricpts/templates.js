const colours = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD",
};

function getBackgroundColor(pokemon) {
  const primaryType = pokemon.types[0].type.name;
  const backgroundColor = colours[primaryType] || "#777";
  return backgroundColor;
}

function getTextColor(backgroundColor) {
  // Extracting RGB-Values
  const r = parseInt(backgroundColor.slice(1, 3), 16);
  const g = parseInt(backgroundColor.slice(3, 5), 16);
  const b = parseInt(backgroundColor.slice(5, 7), 16);

  // Calculate relative brightness (Luminance)
  const brightness = r * 0.299 + g * 0.587 + b * 0.114;

  return brightness > 163 ? "dark:text-gray-800" : "text-white";
}

function createTypeElements(types) {
  let typeHtml = "";

  for (let type of types) {
    const backgroundColor = colours[type];
    const textColor = getTextColor(backgroundColor);
    typeHtml += `<span class="min-w-[56px] px-2 py-1 rounded text-xs ${textColor} text-center" style="background-color: ${backgroundColor};">${capitalizeFirstLetter(type)}</span>`;
  }

  return typeHtml;
}

function createPokemonCard(pokemon) {
  const types = pokemon.types.map((typeObj) => typeObj.type.name);

  return `
    <div class="max-w-xs border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm bg-white dark:bg-gray-800 transition-transform hover:scale-103 cursor-pointer">
      <div class="p-4">
        <h1 class="text-lg font-semibold text-gray-800 dark:text-gray-100">${capitalizeFirstLetter(pokemon.name)}</h1>
      </div>
      <img src="${pokemon.sprites.other["official-artwork"].front_default}" alt="${pokemon.name}" class="w-full h-auto object-contain p-4" style="background-color: ${getBackgroundColor(pokemon)};"/>
      <div class="pt-1 px-4 pb-4 space-y-2">
        <h3 class="mb-3 text-sm text-gray-800 dark:text-gray-100">#${String(pokemon.id).padStart(3, "0")}</h3>
        <div class="flex gap-2">
          ${createTypeElements(types)}
        </div>
      </div>
    </div>
  `;
}

function createOverlayTemplate(pokemon) {
  return `
    <div class="relative max-w-md border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-center">
      <h2 class="p-4">${capitalizeFirstLetter(pokemon.name)}</h2>
      <img src="${pokemon.sprites.other["official-artwork"].front_default}" alt="${pokemon.name}" style="background-color: ${getBackgroundColor(pokemon)};">
      
      <div class="flex justify-around bg-neutral-50 dark:bg-gray-900">
        <button class="tab-button flex-grow py-2 border-b-2 border-transparent border-gray-400 hover:border-gray-400 cursor-pointer text-center" data-tab="stats">Stats</button>
        <button class="tab-button flex-grow py-2 border-b-2 border-transparent border-gray-400 hover:border-gray-400 cursor-pointer text-center" data-tab="abilities">Abilities</button>
        <button class="tab-button flex-grow py-2 border-b-2 border-transparent border-gray-400 hover:border-gray-400 cursor-pointer text-center" data-tab="moves">Moves</button>
      </div>

      <div class="tab-content mt-4">
        <div class="tab-panel" id="stats">
          <p>Height: ${pokemon.height}</p>
          <p>Weight: ${pokemon.weight}</p>
          <p>Base Experience: ${pokemon.base_experience}</p>
        </div>
        <div class="tab-panel hidden" id="abilities">
          <p>${pokemon.abilities.map((ability) => capitalizeFirstLetter(ability.ability.name)).join(", ")}</p>
        </div>
        <div class="tab-panel hidden" id="moves">
          <p>${pokemon.moves
            .slice(0, 5)
            .map((move) => capitalizeFirstLetter(move.move.name))
            .join(", ")}</p>
        </div>
      </div>

      <button id="prev-button" class="absolute left-0 top-1/2 transform -translate-y-1/2 p-2 rounded-full cursor-pointer">←</button>
      <button id="next-button" class="absolute right-0 top-1/2 transform -translate-y-1/2 p-2 rounded-full cursor-pointer">→</button>
      <button id="close-overlay">Close</button>
    </div>
  `;
}
