import React, { useState, useEffect } from "react";
import Axios from "axios";
import { Marker, Polygon } from "react-leaflet";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { Grid } from "@mui/material";
import styles from "./CSS_Modules/AddProperty.module.css";

import { useGeoData } from "./GeoDataContext";
import API_URL from "../plugins/BaseUrl";
// import TheMapComponent from "./TheMapComponent";

// Boroughs border coordinates imports
import Camden from "./Assets/Boroughs/Camden";
import Greenwich from "./Assets/Boroughs/Greenwich";
import Hackney from "./Assets/Boroughs/Hackney";
import Hammersmith from "./Assets/Boroughs/Hammersmith";
import Islington from "./Assets/Boroughs/Islington";
import Kensington from "./Assets/Boroughs/Kensington";
import Lambeth from "./Assets/Boroughs/Lambeth";
import Lewisham from "./Assets/Boroughs/Lewisham";
import Southwark from "./Assets/Boroughs/Southwark";
import Hamlets from "./Assets/Boroughs/Hamlets";
import Wandsworth from "./Assets/Boroughs/Wandsworth";
import Westminster from "./Assets/Boroughs/Westminster";
import City_of_London from "./Assets/Boroughs/City_of_London";
import Barking from "./Assets/Boroughs/Barking";
import Barnet from "./Assets/Boroughs/Barnet";
import Bexley from "./Assets/Boroughs/Bexley";
import Brent from "./Assets/Boroughs/Brent";
import Bromley from "./Assets/Boroughs/Bromley";
import Croydon from "./Assets/Boroughs/Croydon";
import Ealing from "./Assets/Boroughs/Ealing";
import Enfield from "./Assets/Boroughs/Enfield";
import Haringey from "./Assets/Boroughs/Haringey";
import Harrow from "./Assets/Boroughs/Harrow";
import Havering from "./Assets/Boroughs/Havering";
import Hillingdon from "./Assets/Boroughs/Hillingdon";
import Hounslow from "./Assets/Boroughs/Hounslow";
import Kingston from "./Assets/Boroughs/Kingston";
import Merton from "./Assets/Boroughs/Merton";
import Newham from "./Assets/Boroughs/Newham";
import Redbridge from "./Assets/Boroughs/Redbridge";
import Richmond from "./Assets/Boroughs/Richmond";
import Sutton from "./Assets/Boroughs/Sutton";
import Waltham from "./Assets/Boroughs/Waltham";

import { allLondonOptions, allBoroughsCoordinates } from "./boroughData";

function BoroughPositions(borough) {
  if (borough === "Camden") {
    return Camden;
  } else if (borough === "Greenwich") {
    return Greenwich;
  } else if (borough === "Hackney") {
    return Hackney;
  } else if (borough === "Hammersmith and Fulham") {
    return Hammersmith;
  } else if (borough === "Islington") {
    return Islington;
  } else if (borough === "Kensington and Chelsea") {
    return Kensington;
  } else if (borough === "Lambeth") {
    return Lambeth;
  } else if (borough === "Lewisham") {
    return Lewisham;
  } else if (borough === "Southwark") {
    return Southwark;
  } else if (borough === "Tower Hamlets") {
    return Hamlets;
  } else if (borough === "Wandsworth") {
    return Wandsworth;
  } else if (borough === "Westminster") {
    return Westminster;
  } else if (borough === "City of London") {
    return City_of_London;
  } else if (borough === "Barking and Dagenham") {
    return Barking;
  } else if (borough === "Barnet") {
    return Barnet;
  } else if (borough === "Bexley") {
    return Bexley;
  } else if (borough === "Brent") {
    return Brent;
  } else if (borough === "Bromley") {
    return Bromley;
  } else if (borough === "Croydon") {
    return Croydon;
  } else if (borough === "Ealing") {
    return Ealing;
  } else if (borough === "Enfield") {
    return Enfield;
  } else if (borough === "Haringey") {
    return Haringey;
  } else if (borough === "Harrow") {
    return Harrow;
  } else if (borough === "Havering") {
    return Havering;
  } else if (borough === "Hillingdon") {
    return Hillingdon;
  } else if (borough === "Hounslow") {
    return Hounslow;
  } else if (borough === "Kingston upon Thames") {
    return Kingston;
  } else if (borough === "Merton") {
    return Merton;
  } else if (borough === "Newham") {
    return Newham;
  } else if (borough === "Redbridge") {
    return Redbridge;
  } else if (borough === "Richmond upon Thames") {
    return Richmond;
  } else if (borough === "Sutton") {
    return Sutton;
  } else if (borough === "Waltham Forest") {
    return Waltham;
  }
}

const Borough = () => {
  const [areaOptions, setAreaOptions] = useState([]);
  const { geoData, geoDataAreLoading, geoDataError, reloadGeoData } =
    useGeoData();

  // 🔁 Главный эффект: полная цепочка действий
  useEffect(() => {
    const syncGeoData = async () => {
      try {
        console.log("🧹 Удаляем старые записи...");
        // await Axios.delete("http://localhost:8000/api/boroughs/delete_all/");
        await Axios.delete(API_URL("boroughs/delete_all/"));
        while (true) {
          const checkRes = await Axios.get(
            // "http://localhost:8000/api/boroughs/"
            API_URL("boroughs/")
          );
          if (checkRes.data.length === 0) break;
          console.log("⏳ Ожидание удаления...");
        }

        console.log("✅ Все boroughs удалены");

        console.log("📦 Загружаем areas...");
        // const areaRes = await Axios.get("http://localhost:8000/api/areas/");
        const areaRes = await Axios.get(API_URL("areas/"));
        const areas = areaRes.data;
        setAreaOptions(areas);
        console.log("✅ Areas загружены:", areas);

        console.log("🏗️ Создаём boroughs...");
        for (const area of areas) {
          const boroughs =
            allLondonOptions[area.name]?.map((b) => ({ name: b.label })) || [];

          for (const borough of boroughs) {
            const coords = allBoroughsCoordinates[borough.name];
            if (!coords) {
              console.warn("⚠️ Нет координат для", borough.name);
              continue;
            }

            let borderCoordinates = BoroughPositions(borough.name).map(
              (coord) => [coord[1], coord[0]]
            );

            // закрываем полигон, если не замкнут
            if (
              borderCoordinates.length > 0 &&
              (borderCoordinates[0][0] !== borderCoordinates.at(-1)[0] ||
                borderCoordinates[0][1] !== borderCoordinates.at(-1)[1])
            ) {
              borderCoordinates.push(borderCoordinates[0]);
            }

            const formData = new FormData();
            formData.append("name", borough.name);
            formData.append("area", area.name);
            formData.append("latitude", coords[0]);
            formData.append("longitude", coords[1]);
            formData.append("border", JSON.stringify(borderCoordinates));

            try {
              const boroughRes = await Axios.post(
                // "http://localhost:8000/api/boroughs/create/",
                API_URL("boroughs/create/"),
                formData
              );

              const borderPayload = {
                borough: boroughRes.data.id,
                border: {
                  type: "MultiPolygon",
                  coordinates: [[borderCoordinates]],
                },
              };

              await Axios.post(
                // "http://localhost:8000/api/boroughborders/",
                API_URL("boroughborders/"),
                borderPayload
              );

              // console.log(`✅ Добавлен ${area.name} → ${borough.name}`);
            } catch (err) {
              console.error(
                "❌ Ошибка при добавлении borough:",
                err.response || err
              );
            }
          }
        }

        console.log("♻️ Обновляем geoData...");
        await reloadGeoData();
        console.log("✅ geoData загружены:", geoData);
      } catch (err) {
        console.error("🔥 Ошибка в процессе синхронизации данных:", err);
      }
    };

    syncGeoData();
  }, [reloadGeoData]);

  console.log("GEO DATA:", geoData);

  // return (
  //   <div>
  //     <h3>Boroughs Sync</h3>
  //     <p>Количество областей: {areaOptions.length}</p>
  //     <p>Количество геоданных: {geoData?.length || 0}</p>
  //   </div>
  // );

  return (
    <>
      <h1>Borough</h1>
      <h2>Area list</h2>
      <ul>
        {geoData.map((area, index) => (
          <li key={index}>
            {area.name}
            <ul>
              {area.boroughs.map((borough, bIndex) => (
                <li key={bIndex}>
                  {borough.name}
                  <Grid item container>
                    <MapContainer
                      className={styles.map}
                      center={
                        allBoroughsCoordinates[borough.name] || [51.505, -0.09]
                      }
                      zoom={12}
                      scrollWheelZoom={true}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <Polygon
                        positions={borough.border}
                        color="blue"
                      />
                      <Marker
                        position={
                          allBoroughsCoordinates[borough.name] || [
                            51.505, -0.09,
                          ]
                        }
                      />
                    </MapContainer>
                  </Grid>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Borough;
