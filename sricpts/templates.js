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

  return `
    <div class="card bg-base-100 shadow-md">
      <figure style="background-color: ${backgroundColor};" >
      <img src="${pokemon.sprites.other["official-artwork"].front_default}" alt="${pokemon.name}" />
      </figure>
      <div class="card-body">
      <h1 class="card-title">${pokemon.name}</h1>
      <p>A card component has a figure, a body part, and inside body there are title and actions parts</p>
      <div class="card-actions justify-start">
        <div class="badge badge-outline">Fashion</div>
        <div class="badge badge-outline">Products</div>
      </div>
      </div>
    </div>
  `;
}
