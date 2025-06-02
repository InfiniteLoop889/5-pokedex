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
  bug: "#729f3f",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD",
};

function createPokemonCard(pokemon) {
  const primaryType = pokemon.types[0].type.name;
  const backgroundColor = colours[primaryType] || "#777";

  // return `
  //   <div class="rounded-lg bg-white dark:bg-gray-800 shadow-md p-4">
  //     <figure class="rounded-t-lg overflow-hidden" style="background-color: ${backgroundColor};">
  //       <img src="${pokemon.sprites.other["official-artwork"].front_default}" alt="${pokemon.name}" class="w-full h-auto object-contain" />
  //     </figure>
  //     <div class="mt-4 space-y-2">
  //       <h1 class="text-lg font-semibold text-gray-800 dark:text-gray-100">${pokemon.name}</h1>
  //       <p class="text-sm text-gray-600 dark:text-gray-300">A card component has a figure, a body part, and inside body there are title and actions parts</p>
  //       <div class="flex gap-2">
  //         <span class="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-xs text-gray-700 dark:text-gray-200">Fashion</span>
  //         <span class="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-xs text-gray-700 dark:text-gray-200">Products</span>
  //       </div>
  //     </div>
  //   </div>
  // `;

  return `
    <div class="max-w-xs bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-none">
        <img src="${pokemon.sprites.other["official-artwork"].front_default}" alt="${
    pokemon.name
  }" class="rounded-t-lg w-full h-auto object-contain p-4" style="background-color: ${backgroundColor};"/>
      <div class="p-4 space-y-2">
        <h1 class="text-lg font-semibold text-gray-800 dark:text-gray-100">${capitalizeFirstLetter(pokemon.name)}</h1>
        <!-- <p class="text-sm text-gray-600 dark:text-gray-300">A card component has a figure, a body part, and inside body there are title and actions parts</p> -->
        <div class="flex gap-2">
          <span class="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-xs text-gray-700 dark:text-gray-200">Fashion</span>
          <span class="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-xs text-gray-700 dark:text-gray-200">Products</span>
        </div>
      </div>
    </div>
  `;
}
