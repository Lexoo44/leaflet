# Memorials Map Visualization

## Overview

This project is an interactive web map visualizing memorials in Salzburg, Austria, using [Leaflet.js](https://leafletjs.com/) and OpenStreetMap data. It provides users with an intuitive interface to explore, search, and learn about various memorials, such as war memorials, sculptures, plaques, and more.

---

## Target User

- **General Public**: Residents and tourists interested in local history and memorials.
- **Students & Educators**: For educational purposes, to explore historical sites.

---

## Data Sources
- **Primary Source**: [OpenStreetMap](https://www.openstreetmap.org/) (data extracted using [Overpass Turbo](https://overpass-turbo.eu/) with the [Overpass API](https://overpass-api.de/api/interpreter)).  
    - Query: All features with `historic=memorial` within the Salzburg, Austria bounding box.
- **Data Format**: GeoJSON, provided as `data/memorials.geojson` and as a JavaScript object in `data/memorials.js`.

---

## Methodology

- **Visualization**: 
  - Points are shown as colored circle markers.
  - Polygons (e.g., larger memorials) are rendered with custom colors.
- **Interactivity**:
  - Popups display detailed information for each memorial.
  - A sidebar lists all memorials and provides a search function.
  - Hovering over a map feature highlights the corresponding sidebar entry and vice versa.
  - A legend explains the color coding for different memorial types.
  - A reset button returns the map to its default view.

---

## Design Choices

- **Color Palette**: Each memorial type is assigned a unique color for easy visual distinction.
- **Sidebar Search**: Enhances usability, allowing users to quickly find memorials by name.

---

## Analysis

- **Spatial Distribution**: Users can visually analyze the distribution of memorials across Salzburg.
- **Type Diversity**: The legend and color coding reveal the variety of memorial types.
- **Accessibility**: The search and highlight features make it easy to locate and learn about specific memorials.

---

## Potential Improvements

- **Mobile Optimization**: Enhance the UI for smaller screens.
- **Filter by Type**: Allow users to filter memorials by type (e.g., only show war memorials).
- **User Contributions**: Allow users to suggest corrections or add new memorials.

---

## Reflection

- **Performance**: Rendering a large number of features can impact performance; optimizations may be needed for larger datasets.
- **User Experience**: The current design is intuitive for desktop users but could be improved for mobile devices.