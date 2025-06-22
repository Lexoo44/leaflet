// Initialize the map and set the view to a default location
const map = L.map("map", { center: [47.8, 13.04], zoom: 12 });

// Add OpenStreetMap tile layer
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  maxZoom: 19,
}).addTo(map);

// Add scale control to the map
L.control.scale({ position: "bottomright", imperial: false }).addTo(map);

// Add GeoJSON layer for memorials with custom styles and popups
const memorialLayer = L.geoJSON(memorials, {
  style: (f) =>
    ["Polygon", "MultiPolygon"].includes(f.geometry.type)
      ? {
          color: getColor(f.properties.memorial),
          weight: 2,
          fillOpacity: 0.5,
        }
      : undefined,
  pointToLayer: (f, latlng) =>
    L.circleMarker(latlng, getMarkerOptions(f.properties.memorial)),
  onEachFeature: (f, layer) => {
    const p = f.properties;
    // Bind popup with memorial details
    layer.bindPopup(
      `<b>${p.name || "Unbenanntes Denkmal"}</b>
      
      <br>Typ: ${getMemorialTypeName(p.memorial || "Unbekannt") || ""}
      ${p.start_date ? `<br>Jahr: ${p.start_date}` : ""}
      ${p["addr:full"] ? `<br>Adresse: ${p["addr:full"]}` : ""}
      ${p.description ? `<br>${p.description}` : ""}
      ${
        p.website
          ? `<br><a href="${p.website}" target="_blank">Mehr Info</a>`
          : ""
      }`
    );
  },
}).addTo(map);

// Add a legend to the map (grouped by memorial group)
const legendControl = L.control({ position: "bottomleft" });
legendControl.onAdd = () => {
  const div = L.DomUtil.create("div", "info legend");
  div.style =
    "background:rgba(255,255,255,0.6);padding:8px;border-radius:6px;box-shadow:0 1px 5px rgba(0,0,0,0.2)";
  div.innerHTML =
    "<b>Legende</b><br>" +
    Object.entries(groupColors)
      .map(
        ([group, color]) =>
          `<i style="background:${color};width:18px;height:18px;display:inline-block;margin-right:6px;border-radius:3px;"></i>${getGroupName(
            group
          )}<br>`
      )
      .join("");
  return div;
};
legendControl.addTo(map);

// Highlight features on mouseover
function highlightFeature(e) {
  e.target.setStyle?.({ weight: 4, color: "#FFD700", fillOpacity: 0.7 });
  e.target.bringToFront?.();
}
function resetHighlight(e) {
  memorialLayer.resetStyle(e.target);
}
memorialLayer.eachLayer((layer) =>
  layer.on({ mouseover: highlightFeature, mouseout: resetHighlight })
);

// Highlight sidebar entry when hovering a map feature
function highlightSidebar(idx) {
  document.querySelectorAll(".memorial-sidebar li").forEach((el, i) => {
    el.style.fontWeight = i === idx ? "bold" : "normal";
    el.style.background = i === idx ? "rgba(255,215,0,0.2)" : "transparent";
  });
}
memorialLayer.eachLayer((layer, idx) => {
  layer.on("mouseover", () => highlightSidebar(idx));
  layer.on("mouseout", () => highlightSidebar(-1));
});

// Add a button to reset the map view
const resetControl = L.control({ position: "topleft" });
resetControl.onAdd = () => {
  const div = L.DomUtil.create("div", "reset-view");
  div.innerHTML = `<button style="padding:4px 10px;border-radius:4px;border:1px solid #ccc;background:#fff;cursor:pointer;">Karte zurücksetzen</button>`;
  div.onclick = () => map.setView([47.8, 13.04], 12);
  return div;
};
resetControl.addTo(map);

// Add a sidebar with a searchable list of memorials
const sidebarControl = L.control({ position: "topright" });
sidebarControl.onAdd = () => {
  const div = L.DomUtil.create("div", "memorial-sidebar");
  div.style = "background:white;padding:8px;width:260px;box-sizing:border-box";
  div.innerHTML = `
    <input id="memorialSearch" type="text" placeholder="Suche Denkmal..." style="padding:4px;width:96%;border-radius:4px;border:1px solid #ccc;margin-bottom:8px;">
    <b>Denkmal-Liste</b>
    <ul id="memorialList" style="padding-left:16px; max-height:320px; overflow-y:auto; margin:0;">
      ${memorials.features
        .map(
          (f, i) =>
            `<li data-idx="${i}" style="cursor:pointer;color:${getColor(
              f.properties.memorial
            )};padding:2px 0;">${
              f.properties.name || "Unbenanntes Denkmal"
            }</li>`
        )
        .join("")}
    </ul>`;
  setTimeout(() => {
    const list = div.querySelector("#memorialList");
    if (list) L.DomEvent.disableScrollPropagation(list);
  }, 0);
  L.DomEvent.disableClickPropagation(div);
  return div;
};
sidebarControl.addTo(map);

// Enable search and click events for the sidebar list
setTimeout(() => {
  const searchInput = document.getElementById("memorialSearch");
  const list = document.getElementById("memorialList");
  if (searchInput && list) {
    // Filter list items based on search input
    searchInput.addEventListener("input", function () {
      const val = this.value.toLowerCase();
      Array.from(list.children).forEach((li) => {
        li.style.display = li.textContent.toLowerCase().includes(val)
          ? ""
          : "none";
      });
    });
    // If only one result, select it on Enter
    searchInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        const visibleLis = Array.from(list.children).filter(
          (li) => li.style.display !== "none"
        );
        if (visibleLis.length === 1) visibleLis[0].click();
      }
    });
    // Click on a list item zooms to the memorial
    Array.from(list.children).forEach((li) => {
      li.onclick = function () {
        window._zoomToMemorial(parseInt(this.getAttribute("data-idx")));
      };
    });
  }
}, 500);

// Zoom to a memorial and open its popup
window._zoomToMemorial = function (idx) {
  const f = memorials.features[idx];
  let bounds;
  if (f.geometry.type === "Point") {
    const latlng = [f.geometry.coordinates[1], f.geometry.coordinates[0]];
    bounds = L.latLngBounds([latlng, latlng]);
  } else if (["Polygon", "MultiPolygon"].includes(f.geometry.type)) {
    let coords =
      f.geometry.type === "Polygon"
        ? f.geometry.coordinates[0].map((c) => [c[1], c[0]])
        : f.geometry.coordinates.flat(2).reduce((arr, val, i, src) => {
            if (i % 2 === 0) arr.push([src[i + 1], val]);
            return arr;
          }, []);
    bounds = L.latLngBounds(coords);
  }
  if (bounds) map.fitBounds(bounds);
  const layer = memorialLayer.getLayers()[idx];
  if (layer) layer.openPopup();
};
