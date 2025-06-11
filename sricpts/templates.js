// ------------------------------- Create Type Elements -------------------------------

function createTypeElements(types) {
  let typeHtml = "";

  for (let type of types) {
    const backgroundColor = colours[type];
    const textColor = getTextColor(backgroundColor);
    typeHtml += `<span class="min-w-[56px] px-2 py-1 rounded text-xs ${textColor} text-center" style="background-color: ${backgroundColor};">${capitalizeFirstLetter(type)}</span>`;
  }

  return typeHtml;
}

// ------------------------------- Create Pokemon card -------------------------------

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

// ------------------------------- Create overlay tab components -------------------------------

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

// --------    Create abilities tab    --------

function createAbilitiesTab(abilities) {
  return `
    <p>${abilities.map((ability) => capitalizeFirstLetter(ability.ability.name)).join(", ")}</p>
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

  // contains evolution object
  return evoToJson.chain;
}

function createEvolutionsTab(evoChain) {
  let html = "";
  const base = evoChain.species.name;
  html += `<div class="evo-stage base">${base}</div>`;

  evoChain.evolves_to.forEach((stage1) => {
    html += `<div class="evo-stage">${stage1.species.name}</div>`;
    stage1.evolves_to.forEach((stage2) => {
      html += `<div class="evo-stage">${stage2.species.name}</div>`;
    });
  });

  return `<div class="evolution-tab">${html}</div>`;
}

async function showPokemon(pokemon) {
  const evolutionChain = await loadEvolutions(pokemon);
  const evolutionTabHtml = createEvolutionsTab(evolutionChain);

  return evolutionTabHtml;
}

// ------------------------------- Create overlay -------------------------------

async function createOverlayTemplate(pokemon) {
  const evolutionTabHtml = await showPokemon(pokemon);

  return `
    <div class="max-w-sm h-auto border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-center">
      <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100 p-4">${capitalizeFirstLetter(pokemon.name)} <span class="text-gray-500">#${String(pokemon.id).padStart(3, "0")}</span></h2>
      
      <div class="relative">
        <img src="${pokemon.sprites.other["official-artwork"].front_default}" alt="${pokemon.name}" class="w-full h-auto object-contain p-8" style="background-color: ${getBackgroundColor(pokemon)};">
        <button id="prev-button" class="absolute left-0 top-1/2 transform -translate-y-1/2 p-2 rounded-full cursor-pointer">←</button>
        <button id="next-button" class="absolute right-0 top-1/2 transform -translate-y-1/2 p-2 rounded-full cursor-pointer">→</button>
      </div>
      
      <div class="flex justify-around bg-neutral-50 dark:bg-gray-900">
        <button class="tab-button flex-grow py-2 border-b-2 border-gray-400 hover:border-gray-400 cursor-pointer text-center" data-tab="stats">Stats</button>
        <button class="tab-button flex-grow py-2 border-b-2 border-transparent border-gray-400 hover:border-gray-400 cursor-pointer text-center" data-tab="abilities">Abilities</button>
        <button class="tab-button flex-grow py-2 border-b-2 border-transparent border-gray-400 hover:border-gray-400 cursor-pointer text-center" data-tab="evolutions">Evolutions</button>
      </div>

      <div class="tab-content min-h-[200px] max-h-[200px] overflow-auto mt-4">
        <div class="tab-panel" id="stats">
          ${createStatsTab(pokemon.stats)}
        </div>
        <div class="tab-panel hidden" id="abilities">
          ${createAbilitiesTab(pokemon.abilities)}
        </div>
        <div class="tab-panel hidden" id="evolutions">
          ${evolutionTabHtml}
        </div>
      </div>

      <button id="close-overlay">Close</button>
    </div>
  `;
}
