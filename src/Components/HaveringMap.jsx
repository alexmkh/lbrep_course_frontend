import {
  MapContainer,
  TileLayer,
  Polygon,
  useMap,
  Marker,
} from "react-leaflet";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";

// 🔹 Пример: первые ~20 точек из твоего массива Havering
const haveringCoords = [
  [51.5121859623417, 0.158692873497345],
  [51.5122387886397, 0.158705459703474],
  [51.5125009905471, 0.158775506163394],
  [51.512773367551, 0.158830180860369],
  [51.5130559963854, 0.158914166156612],
  [51.5131982253672, 0.15890647893959],
  [51.513339473475, 0.15895207214797],
  [51.5134477713238, 0.158931250376333],
  [51.5135461325874, 0.158912841194666],
  [51.513635665018, 0.158934370168595],
  [51.5138406568206, 0.158936857252437],
  [51.5141057101767, 0.159047398751606],
  [51.5143549084653, 0.159139896171555],
  [51.5143784522489, 0.159179924689717],
  [51.5144652890922, 0.159201327145201],
  [51.5145040603381, 0.159146949992418],
  [51.515477043657, 0.159491322720153],
  [51.5159200766774, 0.159654972880062],
  [51.5160588908671, 0.15973504869249],
];

// 🔹 Компонент, автоматически подгоняющий карту под полигон
function FitToPolygon({ positions }) {
  const map = useMap();
  useEffect(() => {
    if (positions?.length > 0) map.fitBounds(positions);
  }, [positions, map]);
  return null;
}

export default function HaveringMap() {
  return (
    <div style={{ height: "500px", width: "100%" }}>
      <MapContainer
        style={{ height: "100%", width: "100%" }}
        center={[51.505, -0.09]} // временно
        zoom={14}
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Polygon
          positions={haveringCoords}
          pathOptions={{ color: "red", weight: 2, fillOpacity: 0.3 }}
        />
        <FitToPolygon positions={haveringCoords} />
                              <Marker
                                position={
                                  [51.57399823, 0.18302671]
                                } />

      </MapContainer>
    </div>
  );
}
