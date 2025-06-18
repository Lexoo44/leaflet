// Get data
const memorialTypes = Array.from(
  new Set(memorials.features.map((f) => f.properties.memorial || "unknown"))
);

// Define a color palette for different memorial types
const colorPalette = [
  "#377eb8",
  "#e41a1c",
  "#4daf4a",
  "#ff7f00",
  "#984ea3",
  "#ffff33",
  "#a65628",
  "#f781bf",
  "#999999",
  "#1b9e77",
  "#d95f02",
  "#7570b3",
  "#e7298a",
  "#66a61e",
  "#e6ab02",
  "#a6761d",
];

// Map memorial type keys to readable names
function getMemorialTypeName(type) {
  const typeNames = {
    war_memorial: "Kriegerdenkmal",
    sculpture: "Skulptur",
    plaque: "Gedenktafel",
    statue: "Statue",
    stele: "Stele",
    cross: "Kreuz",
    stone: "Gedenkstein",
    obelisk: "Obelisk",
    bust: "Büste",
    column: "Säule",
    wall: "Mauer",
    tree: "Gedenkbaum",
    richtstätte: "Richtstätte",
    memorial: "Denkmal",
    ghost_bike: "Geisterrad",
    unknown: "Unbekannt",
  };
  return typeNames[type];
}

// Assign a color to each memorial type
const typeColors = {};
memorialTypes.forEach((type, i) => {
  typeColors[type] = colorPalette[i % colorPalette.length];
});

// Get the color for a given memorial type
function getColor(type) {
  return typeColors[type] || "#000";
}

// Get marker options for a given memorial type
function getMarkerOptions(type) {
  return {
    radius: 8,
    fillColor: getColor(type),
    color: "#222",
    weight: 2,
    opacity: 1,
    fillOpacity: 0.85,
  };
}
