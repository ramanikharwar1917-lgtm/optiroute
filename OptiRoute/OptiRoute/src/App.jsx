import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// --------------------------------------------------
// LEAFLET MARKER FIX
// --------------------------------------------------

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// --------------------------------------------------
// MAP CLICK HANDLER
// --------------------------------------------------

function MapClickHandler({ addLocation, disabled }) {
  useMapEvents({
    click(e) {
      if (!disabled) {
        addLocation([e.latlng.lat, e.latlng.lng]);
      }
    },
  });

  return null;
}

// --------------------------------------------------
// APP
// --------------------------------------------------

function App() {
  const [locations, setLocations] = useState([]);
  const [optimizedRoute, setOptimizedRoute] = useState([]);

  const [initialDistance, setInitialDistance] =
    useState(null);

  const [optimizedDistance, setOptimizedDistance] =
    useState(null);

  const [distanceSaved, setDistanceSaved] =
    useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const mapCenter = [26.8467, 80.9462];

  // ------------------------------------------------
  // ADD LOCATION
  // ------------------------------------------------

  const addLocation = (location) => {
    if (locations.length >= 5) return;

    setLocations((prev) => [...prev, location]);

    setOptimizedRoute([]);
    setInitialDistance(null);
    setOptimizedDistance(null);
    setDistanceSaved(null);
    setError("");
  };

  // ------------------------------------------------
  // REMOVE LOCATION
  // ------------------------------------------------

  const removeLocation = (index) => {
    setLocations((prev) =>
      prev.filter((_, i) => i !== index)
    );

    setOptimizedRoute([]);
    setInitialDistance(null);
    setOptimizedDistance(null);
    setDistanceSaved(null);
  };

  // ------------------------------------------------
  // CLEAR
  // ------------------------------------------------

  const clearLocations = () => {
    setLocations([]);
    setOptimizedRoute([]);
    setInitialDistance(null);
    setOptimizedDistance(null);
    setDistanceSaved(null);
    setError("");
    setLoading(false);
  };

  // ------------------------------------------------
  // OPTIMIZE ROUTE
  // ------------------------------------------------

  const optimizeRoute = async () => {
    if (locations.length < 2) {
      setError("Add at least 2 locations to optimize.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/optimize",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            locations: locations,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Backend response error");
      }

      const data = await response.json();

      setInitialDistance(
        data.initial_distance ?? 0
      );

      setOptimizedDistance(
        data.optimized_distance ?? 0
      );

      setDistanceSaved(
        data.distance_saved ?? 0
      );

      if (
        data.optimized_route &&
        Array.isArray(data.optimized_route)
      ) {
        const route = data.optimized_route.map(
          (index) => {
            if (typeof index === "number") {
              return locations[index];
            }

            return index;
          }
        );

        setOptimizedRoute(route);
      } else {
        setOptimizedRoute(locations);
      }
    } catch (err) {
      console.error(err);

      setError(
        "Unable to connect with the optimization server."
      );
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------------------------
  // STYLES
  // ------------------------------------------------

  const styles = {
    page: {
      minHeight: "100vh",
      background: "#b983b8",
      color: "#0b162e",
      fontFamily:
        "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif",
    },

    header: {
      height: "70px",
      background: "#cf0d8f",
      borderBottom: "1px solid #e5e7eb",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 32px",
      position: "relative",
      zIndex: 10,
    },

    logoArea: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },

    logo: {
      width: "38px",
      height: "38px",
      borderRadius: "9px",
      background: "#040a1f",
      color: "#f4f7f3",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: "800",
      fontSize: "14px",
      letterSpacing: "0.5px",
    },

    brand: {
      fontSize: "19px",
      fontWeight: "750",
      color: "#2f4269",
      margin: 0,
    },

    subtitle: {
      fontSize: "11px",
      color: "#426596",
      marginTop: "2px",
    },

    nav: {
      display: "flex",
      alignItems: "center",
      gap: "28px",
      fontSize: "13px",
      color: "#24436e",
    },

    activeNav: {
      color: "#1d4ed8",
      fontWeight: "650",
    },

    status: {
      display: "flex",
      alignItems: "center",
      gap: "7px",
      padding: "7px 11px",
      borderRadius: "20px",
      background: "#ebe2e6",
      color: "#041f0e",
      border: "1px solid #dcfce7",
      fontSize: "11px",
      fontWeight: "650",
    },

    dot: {
      width: "7px",
      height: "7px",
      borderRadius: "50%",
      background: "#d34a8a",
    },

    container: {
      maxWidth: "1480px",
      margin: "0 auto",
      padding: "26px 30px 40px",
    },

    pageTitle: {
      marginBottom: "22px",
    },

    title: {
      margin: 0,
      fontSize: "24px",
      fontWeight: "750",
      letterSpacing: "-0.4px",
      color: "#4a68a8",
    },

    pageDescription: {
      margin: "6px 0 0",
      color: "#03080f",
      fontSize: "13px",
    },

    layout: {
      display: "grid",
      gridTemplateColumns: "340px 1fr",
      gap: "20px",
    },

    card: {
      background: "#346491",
      border: "1px solid #e5e7eb",
      borderRadius: "12px",
      boxShadow:
        "0 2px 8px rgba(15,23,42,0.04)",
    },

    sidebar: {
      padding: "22px",
      height: "fit-content",
    },

    sectionTitle: {
      fontSize: "14px",
      fontWeight: "700",
      color: "#111827",
      margin: 0,
    },

    sectionDescription: {
      fontSize: "12px",
      color: "#64748b",
      lineHeight: "1.5",
      marginTop: "6px",
      marginBottom: "20px",
    },

    stopHeader: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "10px",
    },

    count: {
      fontSize: "11px",
      color: "#475569",
      background: "#f1f5f9",
      padding: "5px 9px",
      borderRadius: "6px",
      fontWeight: "650",
    },

    empty: {
      padding: "24px 15px",
      textAlign: "center",
      background: "#f8fafc",
      border: "1px dashed #cbd5e1",
      borderRadius: "9px",
      marginBottom: "16px",
    },

    emptyIcon: {
      fontSize: "24px",
      marginBottom: "8px",
    },

    emptyTitle: {
      fontSize: "12px",
      fontWeight: "650",
      color: "#334155",
    },

    emptyText: {
      fontSize: "11px",
      color: "#94a3b8",
      marginTop: "4px",
    },

    location: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "11px",
      border: "1px solid #e5e7eb",
      borderRadius: "8px",
      marginBottom: "8px",
      background: "#ffffff",
    },

    locationLeft: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },

    locationNumber: {
      width: "27px",
      height: "27px",
      borderRadius: "7px",
      background: "#eff6ff",
      color: "#2563eb",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "11px",
      fontWeight: "750",
    },

    locationName: {
      fontSize: "12px",
      fontWeight: "650",
      color: "#334155",
    },

    coordinates: {
      fontSize: "9px",
      color: "#94a3b8",
      marginTop: "2px",
    },

    removeButton: {
      border: "none",
      background: "transparent",
      color: "#94a3b8",
      cursor: "pointer",
      fontSize: "18px",
      width: "26px",
      height: "26px",
      borderRadius: "6px",
    },

    buttons: {
      display: "flex",
      gap: "8px",
      marginTop: "18px",
    },

    optimizeButton: {
      flex: 1,
      border: "none",
      borderRadius: "8px",
      padding: "12px",
      background: "#1d4ed8",
      color: "#ffffff",
      fontSize: "12px",
      fontWeight: "700",
      cursor: "pointer",
    },

    clearButton: {
      border: "1px solid #d1d5db",
      borderRadius: "8px",
      padding: "12px 15px",
      background: "#ffffff",
      color: "#475569",
      fontSize: "12px",
      fontWeight: "650",
      cursor: "pointer",
    },

    mapCard: {
      overflow: "hidden",
    },

    mapHeader: {
      height: "65px",
      padding: "0 18px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      borderBottom: "1px solid #e5e7eb",
    },

    mapTitle: {
      fontSize: "14px",
      fontWeight: "700",
      margin: 0,
      color: "#111827",
    },

    mapSubtitle: {
      fontSize: "11px",
      color: "#94a3b8",
      marginTop: "3px",
    },

    mapHint: {
      fontSize: "10px",
      color: "#64748b",
      padding: "6px 9px",
      background: "#f8fafc",
      borderRadius: "6px",
      border: "1px solid #e5e7eb",
    },

    map: {
      width: "100%",
      height: "590px",
    },

    results: {
      marginTop: "20px",
    },

    resultHeader: {
      padding: "18px 20px",
      borderBottom: "1px solid #e5e7eb",
    },

    resultTitle: {
      margin: 0,
      fontSize: "14px",
      fontWeight: "700",
    },

    resultGrid: {
      display: "grid",
      gridTemplateColumns:
        "repeat(3, 1fr)",
      gap: "12px",
      padding: "18px",
    },

    metric: {
      border: "1px solid #e5e7eb",
      borderRadius: "9px",
      padding: "16px",
      background: "#ffffff",
    },

    metricLabel: {
      fontSize: "10px",
      color: "#64748b",
      fontWeight: "600",
    },

    metricValue: {
      marginTop: "7px",
      fontSize: "21px",
      fontWeight: "750",
      color: "#111827",
    },

    error: {
      marginTop: "13px",
      padding: "10px",
      borderRadius: "7px",
      background: "#fff7ed",
      border: "1px solid #fed7aa",
      color: "#c2410c",
      fontSize: "11px",
    },
  };

  return (
    <div style={styles.page}>

      {/* ============================================= */}
      {/* HEADER */}
      {/* ============================================= */}

      <header style={styles.header}>

        <div style={styles.logoArea}>

          <div style={styles.logo}>
            OR
          </div>

          <div>
            <h1 style={styles.brand}>
              OptiRoute
            </h1>

            <div style={styles.subtitle}>
              Route Optimization Platform
            </div>
          </div>

        </div>

        <nav style={styles.nav}>

          <span style={styles.activeNav}>
            Dashboard
          </span>

          <span>
            Route Planner
          </span>

          <span>
            Analytics
          </span>

        </nav>

        <div style={styles.status}>
          <span style={styles.dot}></span>
          System operational
        </div>

      </header>

      {/* ============================================= */}
      {/* MAIN */}
      {/* ============================================= */}

      <div style={styles.container}>

        <div style={styles.pageTitle}>

          <h2 style={styles.title}>
            Route Planning Dashboard
          </h2>

          <p style={styles.pageDescription}>
            Build efficient multi-stop routes using
            intelligent optimization algorithms.
          </p>

        </div>

        <div style={styles.layout}>

          {/* ======================================= */}
          {/* SIDEBAR */}
          {/* ======================================= */}

          <aside
            style={{
              ...styles.card,
              ...styles.sidebar,
            }}
          >

            <h3 style={styles.sectionTitle}>
              Route Planner
            </h3>

            <p style={styles.sectionDescription}>
              Add up to 5 locations by clicking
              directly on the map.
            </p>

            <div style={styles.stopHeader}>

              <span style={styles.sectionTitle}>
                Selected stops
              </span>

              <span style={styles.count}>
                {locations.length} / 5
              </span>

            </div>

            {/* EMPTY */}

            {locations.length === 0 && (
              <div style={styles.empty}>

                <div style={styles.emptyIcon}>
                  ⊙
                </div>

                <div style={styles.emptyTitle}>
                  No stops selected
                </div>

                <div style={styles.emptyText}>
                  Click on the map to add your
                  first destination
                </div>

              </div>
            )}

            {/* LOCATIONS */}

            {locations.map((location, index) => (
              <div
                key={index}
                style={styles.location}
              >

                <div style={styles.locationLeft}>

                  <div style={styles.locationNumber}>
                    {index + 1}
                  </div>

                  <div>

                    <div style={styles.locationName}>
                      Stop {index + 1}
                    </div>

                    <div style={styles.coordinates}>
                      {location[0].toFixed(4)},{" "}
                      {location[1].toFixed(4)}
                    </div>

                  </div>

                </div>

                <button
                  onClick={() =>
                    removeLocation(index)
                  }
                  style={styles.removeButton}
                  title="Remove stop"
                >
                  ×
                </button>

              </div>
            ))}

            {/* BUTTONS */}

            <div style={styles.buttons}>

              <button
                onClick={optimizeRoute}
                disabled={
                  loading ||
                  locations.length < 2
                }
                style={{
                  ...styles.optimizeButton,
                  background:
                    loading ||
                    locations.length < 2
                      ? "#94a3b8"
                      : "#1d4ed8",
                  cursor:
                    loading ||
                    locations.length < 2
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                {loading
                  ? "Optimizing..."
                  : "Optimize Route"}
              </button>

              <button
                onClick={clearLocations}
                disabled={
                  locations.length === 0 &&
                  optimizedRoute.length === 0
                }
                style={styles.clearButton}
              >
                Clear
              </button>

            </div>

            {error && (
              <div style={styles.error}>
                ⚠ {error}
              </div>
            )}

            {/* ALGORITHM INFO */}

            <div
              style={{
                marginTop: "22px",
                paddingTop: "18px",
                borderTop:
                  "1px solid #e5e7eb",
              }}
            >

              <div
                style={{
                  fontSize: "10px",
                  color: "#94a3b8",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  marginBottom: "10px",
                }}
              >
                Optimization engine
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "7px",
                  flexWrap: "wrap",
                }}
              >

                <span
                  style={{
                    padding: "5px 8px",
                    background: "#f1f5f9",
                    borderRadius: "5px",
                    fontSize: "10px",
                    color: "#475569",
                  }}
                >
                  Dijkstra
                </span>

                <span
                  style={{
                    padding: "5px 8px",
                    background: "#f1f5f9",
                    borderRadius: "5px",
                    fontSize: "10px",
                    color: "#475569",
                  }}
                >
                  A*
                </span>

                <span
                  style={{
                    padding: "5px 8px",
                    background: "#f1f5f9",
                    borderRadius: "5px",
                    fontSize: "10px",
                    color: "#475569",
                  }}
                >
                  TSP
                </span>

                <span
                  style={{
                    padding: "5px 8px",
                    background: "#f1f5f9",
                    borderRadius: "5px",
                    fontSize: "10px",
                    color: "#475569",
                  }}
                >
                  2-Opt
                </span>

              </div>

            </div>

          </aside>

          {/* ======================================= */}
          {/* MAP */}
          {/* ======================================= */}

          <section
            style={{
              ...styles.card,
              ...styles.mapCard,
            }}
          >

            <div style={styles.mapHeader}>

              <div>

                <h3 style={styles.mapTitle}>
                  Interactive Route Map
                </h3>

                <div style={styles.mapSubtitle}>
                  Lucknow • OpenStreetMap
                </div>

              </div>

              <div style={styles.mapHint}>
                Click map to add stops
              </div>

            </div>

            <MapContainer
              center={mapCenter}
              zoom={11}
              style={styles.map}
            >

              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <MapClickHandler
                addLocation={addLocation}
                disabled={
                  locations.length >= 5
                }
              />

              {/* MARKERS */}

              {locations.map(
                (position, index) => (
                  <Marker
                    key={index}
                    position={position}
                  >
                    <Popup>

                      <strong>
                        Stop {index + 1}
                      </strong>

                      <br />

                      {position[0].toFixed(5)},{" "}
                      {position[1].toFixed(5)}

                    </Popup>
                  </Marker>
                )
              )}

              {/* ORIGINAL ROUTE */}

              {locations.length >= 2 && (
                <Polyline
                  positions={[
                    ...locations,
                    locations[0],
                  ]}
                  pathOptions={{
                    color: "#94a3b8",
                    weight: 3,
                    dashArray: "7 7",
                  }}
                />
              )}

              {/* OPTIMIZED ROUTE */}

              {optimizedRoute.length >= 2 && (
                <Polyline
                  positions={[
                    ...optimizedRoute,
                    optimizedRoute[0],
                  ]}
                  pathOptions={{
                    color: "#2563eb",
                    weight: 5,
                  }}
                />
              )}

            </MapContainer>

          </section>

        </div>

        {/* ============================================= */}
        {/* RESULTS */}
        {/* ============================================= */}

        {(initialDistance !== null ||
          optimizedDistance !== null) && (

          <section
            style={{
              ...styles.card,
              ...styles.results,
            }}
          >

            <div style={styles.resultHeader}>

              <h3 style={styles.resultTitle}>
                Optimization Summary
              </h3>

              <div
                style={{
                  fontSize: "10px",
                  color: "#94a3b8",
                  marginTop: "3px",
                }}
              >
                Route performance after optimization
              </div>

            </div>

            <div style={styles.resultGrid}>

              {/* INITIAL */}

              <div style={styles.metric}>

                <div style={styles.metricLabel}>
                  INITIAL DISTANCE
                </div>

                <div style={styles.metricValue}>
                  {Number(
                    initialDistance
                  ).toFixed(3)}{" "}
                  <span
                    style={{
                      fontSize: "12px",
                      color: "#94a3b8",
                    }}
                  >
                    km
                  </span>
                </div>

              </div>

              {/* OPTIMIZED */}

              <div
                style={{
                  ...styles.metric,
                  background: "#f8fbff",
                  borderColor: "#dbeafe",
                }}
              >

                <div style={styles.metricLabel}>
                  OPTIMIZED DISTANCE
                </div>

                <div
                  style={{
                    ...styles.metricValue,
                    color: "#1d4ed8",
                  }}
                >
                  {Number(
                    optimizedDistance
                  ).toFixed(3)}{" "}
                  <span
                    style={{
                      fontSize: "12px",
                      color: "#94a3b8",
                    }}
                  >
                    km
                  </span>
                </div>

              </div>

              {/* SAVED */}

              <div
                style={{
                  ...styles.metric,
                  background: "#f7fdf9",
                  borderColor: "#dcfce7",
                }}
              >

                <div style={styles.metricLabel}>
                  DISTANCE SAVED
                </div>

                <div
                  style={{
                    ...styles.metricValue,
                    color: "#15803d",
                  }}
                >
                  {Number(
                    distanceSaved
                  ).toFixed(3)}{" "}
                  <span
                    style={{
                      fontSize: "12px",
                      color: "#94a3b8",
                    }}
                  >
                    km
                  </span>
                </div>

              </div>

            </div>

          </section>
        )}

      </div>

      {/* ============================================= */}
      {/* FOOTER */}
      {/* ============================================= */}

      <footer
        style={{
          textAlign: "center",
          padding: "18px",
          borderTop:
            "1px solid #e5e7eb",
          background: "#ffffff",
          color: "#94a3b8",
          fontSize: "10px",
        }}
      >
        OptiRoute • Intelligent Route Optimization
      </footer>

    </div>
  );
}

export default App;