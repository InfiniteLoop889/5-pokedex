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

const typeChart = {
  normal: { strongAgainst: [], weakAgainst: ["fighting"] },
  fire: { strongAgainst: ["grass", "ice", "bug", "steel"], weakAgainst: ["water", "rock", "fire"] },
  water: { strongAgainst: ["fire", "ground", "rock"], weakAgainst: ["electric", "grass"] },
  electric: { strongAgainst: ["water", "flying"], weakAgainst: ["ground"] },
  grass: { strongAgainst: ["water", "ground", "rock"], weakAgainst: ["fire", "ice", "poison", "flying", "bug"] },
  ice: { strongAgainst: ["grass", "ground", "flying", "dragon"], weakAgainst: ["fire", "fighting", "rock", "steel"] },
  fighting: { strongAgainst: ["normal", "ice", "rock", "dark", "steel"], weakAgainst: ["flying", "psychic", "fairy"] },
  poison: { strongAgainst: ["grass", "fairy"], weakAgainst: ["ground", "psychic"] },
  ground: { strongAgainst: ["fire", "electric", "poison", "rock", "steel"], weakAgainst: ["water", "grass", "ice"] },
  flying: { strongAgainst: ["grass", "fighting", "bug"], weakAgainst: ["electric", "ice", "rock"] },
  psychic: { strongAgainst: ["fighting", "poison"], weakAgainst: ["bug", "ghost", "dark"] },
  bug: { strongAgainst: ["grass", "psychic", "dark"], weakAgainst: ["fire", "flying", "rock"] },
  rock: { strongAgainst: ["fire", "ice", "flying", "bug"], weakAgainst: ["water", "grass", "fighting", "ground", "steel"] },
  ghost: { strongAgainst: ["psychic", "ghost"], weakAgainst: ["ghost", "dark"] },
  dragon: { strongAgainst: ["dragon"], weakAgainst: ["ice", "dragon", "fairy"] },
  dark: { strongAgainst: ["psychic", "ghost"], weakAgainst: ["fighting", "bug", "fairy"] },
  steel: { strongAgainst: ["ice", "rock", "fairy"], weakAgainst: ["fire", "fighting", "ground"] },
  fairy: { strongAgainst: ["fighting", "dragon", "dark"], weakAgainst: ["poison", "steel"] },
};
