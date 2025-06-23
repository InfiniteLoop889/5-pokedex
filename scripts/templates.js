function createTypeElements(type, backgroundColor, textColor) {
  return `
      <span class="min-w-[56px] px-2 py-1 rounded text-xs ${textColor} text-center" style="background-color: ${backgroundColor};">${capitalizeFirstLetter(type)}</span>
    `;
}

function createPokemonTemplate(pokemon, types) {
  return `
      <div class="max-w-xs border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm bg-white dark:bg-gray-800 transition-transform hover:scale-103 cursor-pointer" onclick="renderSelectedPokemon(${pokemon.id});">
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
        <p class="text-sm">${strengths.map((type) => capitalizeFirstLetter(type)).join(", ") || "None"}</p>
      </div>
      <div>
        <h3 class="text-sm font-semibold">Weaknesses:</h3>
        <p class="text-sm">${weaknesses.map((type) => capitalizeFirstLetter(type)).join(", ") || "None"}</p>
      </div>
    </div>
  `;
}

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

function createOverlayTemplate(pokemon, types) {
  return `
      <div class="max-w-sm h-auto border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-center" onclick="onclickProtection(event)">
        <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100 p-4">${capitalizeFirstLetter(pokemon.name)} <span class="text-gray-500">#${String(pokemon.id).padStart(3, "0")}</span></h2>
        
        <div class="relative">
          <img src="${pokemon.sprites.other["official-artwork"].front_default}" alt="${pokemon.name}" class="w-full h-auto object-contain p-12" style="background-color: ${getBackgroundColor(pokemon)};">
          <button id="prev-button" 
                  class="absolute text-gray-800 left-0 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center cursor-pointer"
                  onclick="prevPokemonBtn(${pokemon.id})">
            <img src="./img/icons8-back-50.png" alt="Previous" class="w-6 h-6 object-contain">
          </button>
          <button id="next-button" 
                  class="absolute text-gray-800 right-0 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center cursor-pointer"
                  onclick="nextPokemonBtn(${pokemon.id})">
            <img src="./img/icons8-forward-50.png" alt="Next" class="w-6 h-6 object-contain">
          </button>        
        </div>
        
        <div class="grid grid-cols-3 bg-gray-200 dark:bg-gray-900">
          <button class="tab-button py-2 border-b-2 border-gray-400 hover:border-gray-400 cursor-pointer text-center" data-tab="stats">Stats</button>
          <button class="tab-button py-2 border-b-2 border-transparent border-gray-400 hover:border-gray-400 cursor-pointer text-center" data-tab="types">Types</button>
          <button class="tab-button py-2 border-b-2 border-transparent border-gray-400 hover:border-gray-400 cursor-pointer text-center" data-tab="evolutions" onclick="showEvolutionsTab(${pokemon.id})">Evolutions</button>
        </div>

        <div class="tab-content h-[240px]  overflow-auto mt-4">
          <div id="stats" class="tab-panel">
            <div class="space-y-2 px-4">
              ${createStatsTab(pokemon.stats)}
            </div>
          </div>
          <div id="types" class="tab-panel flex justify-center items-center h-full hidden">
            ${createTypesTab(types)}
          </div>
          <div id="evolutions" class="tab-panel relative flex justify-center items-center h-full hidden">
            <div id="evolutions-wrapper" class="flex gap-x-4 justify-center items-center px-4">
            </div>
            <div id="evo-loading-spinner" role="status" class="hidden absolute inset-0 flex items-center justify-center">
              <svg aria-hidden="true" class="inline w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                  viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor" />
                  <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill" />
              </svg>
              <span class="sr-only">Loading...</span>
            </div>
          </div>
        </div>
        <button id="close-overlay" class="my-4 cursor-pointer" onclick="closeOverlay()">Close</button>
    `;
}
