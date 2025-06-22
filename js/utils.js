// Get data
const memorialTypes = Array.from(
  new Set(memorials.features.map((f) => f.properties.memorial || "unknown"))
);

// Group similar memorial types
const memorialGroups = {
  Kunstobjekte: ["statue", "bust", "sculpture", "column", "stele", "obelisk"],
  Gedenkstätten: [
    "war_memorial",
    "plaque",
    "memorial",
    "stone",
    "wall",
    "cross",
    "richtstätte",
    "tree",
  ],
  Sonstiges: ["unknown", "ghost_bike", "stolperstein"],
};

// Assign a color to each group
const groupColors = {
  Kunstobjekte: "#377eb8",
  Gedenkstätten: "#e41a1c",
  Sonstiges: "#999999",
};

// Map each type to its group
const typeToGroup = {};
Object.entries(memorialGroups).forEach(([group, types]) => {
  types.forEach((type) => {
    typeToGroup[type] = group;
  });
});

// Get the color for a given memorial type (by group)
function getColor(type) {
  const group = typeToGroup[type] || "Sonstiges";
  return groupColors[group] || "#000";
}

// Get readable group name for legend
function getGroupName(group) {
  return group;
}

// ...existing code...

// Get marker options for a given memorial type
function getMarkerOptions(type) {
  return {
    radius: 6,
    fillColor: getColor(type),
    color: "#222",
    weight: 2,
    opacity: 1,
    fillOpacity: 0.85,
  };
}

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
    stolperstein: "Stolperstein",
    unknown: "Unbekannt",
  };
  return typeNames[type];
}
