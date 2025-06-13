// ------------------------------------------------------------------------------------
// ------------------------------- Create Type Elements -------------------------------
// ------------------------------------------------------------------------------------

function createTypeElements(types) {
  let typeHtml = "";

  for (let type of types) {
    const backgroundColor = colours[type];
    const textColor = getTextColor(backgroundColor);
    typeHtml += `<span class="min-w-[56px] px-2 py-1 rounded text-xs ${textColor} text-center" style="background-color: ${backgroundColor};">${capitalizeFirstLetter(type)}</span>`;
  }

  return typeHtml;
}

// -----------------------------------------------------------------------------------
// ------------------------------- Create Pokemon card -------------------------------
// -----------------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------------------------
// ------------------------------- Create overlay tab components -------------------------------
// ---------------------------------------------------------------------------------------------

// --------    Create stats tab    --------

function createStatsTab(stats) {
  return `
    <div class="space-y-2 px-4">
      ${stats
        .map(
          (stat) => `
        <div>
          <div class="flex justify-between text-xs mb-1">
            <span>${capitalizeFirstLetter(stat.stat.name)}</span>
            <span>${stat.base_stat}</span>
          </div>
          <div class="w-full bg-gray-200 rounded h-3 dark:bg-gray-700">
            <div class="h-3 rounded bg-blue-500" style="width: ${Math.min(stat.base_stat, 150) / 1.5}%;"></div>
          </div>
        </div>
        `
        )
        .join("")}
    </div>
  `;
}

// --------    Create types tab    --------

function createTypesTab(types) {
  let strengths = new Set();
  let weaknesses = new Set();

  types.forEach((type) => {
    const typeInfo = typeChart[type];
    if (typeInfo) {
      typeInfo.strongAgainst.forEach((strong) => strengths.add(strong));
      typeInfo.weakAgainst.forEach((weak) => weaknesses.add(weak));
    }
  });

  return `
    <div class="space-y-4 px-4">
      <div>
        <h3 class="text-sm font-semibold">Types:</h3>
        <p>${types.map((type) => capitalizeFirstLetter(type)).join(", ")}</p>
      </div>
      <div>
        <h3 class="text-sm font-semibold">Strengths:</h3>
        <p>${
          Array.from(strengths)
            .map((type) => capitalizeFirstLetter(type))
            .join(", ") || "None"
        }</p>
      </div>
      <div>
        <h3 class="text-sm font-semibold">Weaknesses:</h3>
        <p>${
          Array.from(weaknesses)
            .map((type) => capitalizeFirstLetter(type))
            .join(", ") || "None"
        }</p>
      </div>
    </div>
  `;
}

// --------    Create evolutions tab    --------

async function loadEvolutions(pokemon) {
  // 1. get species link
  const speciesResponse = await fetch(pokemon.species.url);
  const speciesToJson = await speciesResponse.json();

  // 2. get evolution chain link
  const evoResponse = await fetch(speciesToJson.evolution_chain.url);
  const evoToJson = await evoResponse.json();

  return evoToJson.chain;
}

function createEvolutionsTab(evolutionChain, allRenderedPokemonArr) {
  let html = "";

  // Base evolution stage
  const base = evolutionChain.species.name;
  const basePokemon = findPokemonByName(base, allRenderedPokemonArr);
  if (basePokemon) {
    html += `<div class="flex flex-col items-center">
               <img src="${basePokemon.sprites.other["official-artwork"].front_default}" alt="${basePokemon.name}" class="h-full object-contain">
               <span class="text-sm font-medium">${capitalizeFirstLetter(basePokemon.name)}</span>
             </div>`;
  }

  // First evolution stage
  evolutionChain.evolves_to.forEach((stage1, index1) => {
    const stage1Pokemon = findPokemonByName(stage1.species.name, allRenderedPokemonArr);
    if (stage1Pokemon) {
      // Add arrow between stages
      if (index1 > 0 || basePokemon) {
        html += `<span class="flex items-center justify-center text-gray-500">→</span>`;
      }

      html += `<div class="flex flex-col items-center">
                 <img src="${stage1Pokemon.sprites.other["official-artwork"].front_default}" alt="${stage1Pokemon.name}" class="h-full object-contain">
                 <span class="text-sm font-medium">${capitalizeFirstLetter(stage1Pokemon.name)}</span>
               </div>`;
    }

    // Second evolution stage
    stage1.evolves_to.forEach((stage2, index2) => {
      const stage2Pokemon = findPokemonByName(stage2.species.name, allRenderedPokemonArr);
      if (stage2Pokemon) {
        // Add arrow between stages
        if (index2 > 0 || stage1Pokemon) {
          html += `<span class="flex items-center justify-center text-gray-500">→</span>`;
        }

        html += `<div class="flex flex-col items-center">
                   <img src="${stage2Pokemon.sprites.other["official-artwork"].front_default}" alt="${stage2Pokemon.name}" class="h-full object-contain">
                   <span class="text-sm font-medium">${capitalizeFirstLetter(stage2Pokemon.name)}</span>
                 </div>`;
      }
    });
  });

  // Wrap all stages in a flex container
  return `<div class="flex gap-x-4 justify-center items-center px-4">
            ${html}
          </div>`;
}

async function showPokemon(pokemon, allRenderedPokemonArr) {
  const evolutionChain = await loadEvolutions(pokemon);
  const evolutionTabHtml = createEvolutionsTab(evolutionChain, allRenderedPokemonArr);

  return evolutionTabHtml;
}

// ------------------------------------------------------------------------------
// ------------------------------- Create overlay -------------------------------
// ------------------------------------------------------------------------------

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
          ${createStatsTab(pokemon.stats)}
        </div>
        <div id="types" class="tab-panel flex justify-center items-center h-full hidden">
          ${createTypesTab(types)}
        </div>
        <div id="evolutions" class="tab-panel flex justify-center items-center h-full hidden">
          ${evolutionTabHtml}
        </div>
      </div>

      <button id="close-overlay" class="my-4">Close</button>
    </div>
  `;
}
