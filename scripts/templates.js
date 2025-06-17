// ------------------------------- Create Type Elements -------------------------------

function createTypeElements(type, backgroundColor, textColor) {
  return `
    <span class="min-w-[56px] px-2 py-1 rounded text-xs ${textColor} text-center" style="background-color: ${backgroundColor};">${capitalizeFirstLetter(type)}</span>
  `;
}

// ------------------------------- Create Pokemon card -------------------------------

function createPokemonTemplate(pokemon, types) {
  return `
    <div class="max-w-xs border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm bg-white dark:bg-gray-800 transition-transform hover:scale-103 cursor-pointer">
      <div class="p-4">
        <h1 class="text-lg font-semibold text-gray-800 dark:text-gray-100">${capitalizeFirstLetter(pokemon.name)}</h1>
      </div>
      <img src="${pokemon.sprites.other["official-artwork"].front_default}" alt="${pokemon.name}" class="w-full h-auto object-contain p-4" style="background-color: ${getBackgroundColor(pokemon)};"/>
      <div class="pt-1 px-4 pb-4 space-y-2">
        <h3 class="mb-3 text-sm text-gray-800 dark:text-gray-100">#${String(pokemon.id).padStart(3, "0")}</h3>
        <div class="flex gap-2">
          ${getTypeElements(types)}
        </div>
      </div>
    </div>
  `;
}

// ------------------------------- Create overlay tab components -------------------------------

function createStatsTemplate(stat) {
  return `
    <div>
      <div class="flex justify-between text-xs mb-1">
        <span>${stat.name}</span>
        <span>${stat.value}</span>
      </div>
      <div class="w-full bg-gray-200 rounded h-3 dark:bg-gray-700">
        <div class="h-3 rounded bg-blue-500" style="width: ${stat.width}%;"></div>
      </div>
    </div>
  `;
}

function createTypesTemplate(strengths, weaknesses, types) {
  return `
    <div class="space-y-4 px-4">
      <div>
        <h3 class="text-sm font-semibold">Types:</h3>
        <p class="text-sm">${types.map((type) => capitalizeFirstLetter(type)).join(", ")}</p>
      </div>
      <div>
        <h3 class="text-sm font-semibold">Strengths:</h3>
        <p class="text-sm">${
          Array.from(strengths)
            .map((type) => capitalizeFirstLetter(type))
            .join(", ") || "None"
        }</p>
      </div>
      <div>
        <h3 class="text-sm font-semibold">Weaknesses:</h3>
        <p class="text-sm">${
          Array.from(weaknesses)
            .map((type) => capitalizeFirstLetter(type))
            .join(", ") || "None"
        }</p>
      </div>
    </div>
  `;
}

// Evolution template functions
function createEvolutionTemplate(pokemon) {
  return `
    <div class="flex flex-col items-center">
      <img src="${pokemon.sprites.other["official-artwork"].front_default}" 
           alt="${pokemon.name}" 
           class="w-24 h-24 object-contain">
      <span class="text-sm font-medium">${capitalizeFirstLetter(pokemon.name)}</span>
    </div>
  `;
}

function createEvolutionArrowTemplate() {
  return `<span class="flex items-center justify-center text-gray-500">→</span>`;
}

// ------------------------------- Create overlay template -------------------------------

async function createOverlayTemplate(pokemon, allRenderedPokemonArr) {
  const evolutionTabHtml = await showPokemon(pokemon, allRenderedPokemonArr);
  const types = pokemon.types.map((typeObj) => typeObj.type.name);

  return `
    <div class="max-w-sm h-auto border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-center">
      <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100 p-4">${capitalizeFirstLetter(pokemon.name)} <span class="text-gray-500">#${String(pokemon.id).padStart(3, "0")}</span></h2>
      
      <div class="relative">
        <img src="${pokemon.sprites.other["official-artwork"].front_default}" alt="${pokemon.name}" class="w-full h-auto object-contain p-12" style="background-color: ${getBackgroundColor(pokemon)};">
        <button id="prev-button" 
                class="absolute text-gray-800 left-0 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center cursor-pointer">
          <img src="./img/icons8-back-50.png" alt="Previous" class="w-6 h-6 object-contain">
        </button>
        <button id="next-button" 
                class="absolute text-gray-800 right-0 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center cursor-pointer">
          <img src="./img/icons8-forward-50.png" alt="Next" class="w-6 h-6 object-contain">
        </button>        
      </div>
      
      <div class="grid grid-cols-3 bg-gray-200 dark:bg-gray-900">
        <button class="tab-button py-2 border-b-2 border-gray-400 hover:border-gray-400 cursor-pointer text-center" data-tab="stats">Stats</button>
        <button class="tab-button py-2 border-b-2 border-transparent border-gray-400 hover:border-gray-400 cursor-pointer text-center" data-tab="types">Types</button>
        <button class="tab-button py-2 border-b-2 border-transparent border-gray-400 hover:border-gray-400 cursor-pointer text-center" data-tab="evolutions">Evolutions</button>
      </div>

      <div class="tab-content h-[180px] overflow-auto mt-4">
        <div id="stats" class="tab-panel">
          <div class="space-y-2 px-4">
            ${createStatsTab(pokemon.stats)}
          </div>
        </div>
        <div id="types" class="tab-panel flex justify-center items-center h-full hidden">
          ${createTypesTab(types)}
        </div>
        <div id="evolutions" class="tab-panel flex justify-center items-center h-full hidden">
          <div class="flex gap-x-4 justify-center items-center px-4">
            ${evolutionTabHtml}
          </div>
        </div>
      </div>

      <button id="close-overlay" class="my-4">Close</button>
    </div>
  `;
}
