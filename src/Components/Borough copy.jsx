import React, { useState, useEffect } from "react";
import Axios from "axios";
import { Marker, Polygon } from "react-leaflet";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { Grid } from "@mui/material";
import styles from "./CSS_Modules/AddProperty.module.css";

import { useGeoData } from "./GeoDataContext";
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

const innerLondonOptions = [
  {
    value: "Camden",
    label: "Camden",
  },
  {
    value: "Greenwich",
    label: "Greenwich",
  },
  {
    value: "Hackney",
    label: "Hackney",
  },
  {
    value: "Hammersmith and Fulham",
    label: "Hammersmith and Fulham",
  },
  {
    value: "Islington",
    label: "Islington",
  },
  {
    value: "Kensington and Chelsea",
    label: "Kensington and Chelsea",
  },
  {
    value: "Lambeth",
    label: "Lambeth",
  },
  {
    value: "Lewisham",
    label: "Lewisham",
  },
  {
    value: "Southwark",
    label: "Southwark",
  },
  {
    value: "Tower Hamlets",
    label: "Tower Hamlets",
  },
  {
    value: "Wandsworth",
    label: "Wandsworth",
  },
  {
    value: "Westminster",
    label: "Westminster",
  },
  {
    value: "City of London",
    label: "City of London",
  },
];

const outerLondonOptions = [
  {
    value: "Barking and Dagenham",
    label: "Barking and Dagenham",
  },
  {
    value: "Barnet",
    label: "Barnet",
  },
  {
    value: "Bexley",
    label: "Bexley",
  },
  {
    value: "Brent",
    label: "Brent",
  },
  {
    value: "Bromley",
    label: "Bromley",
  },
  {
    value: "Croydon",
    label: "Croydon",
  },
  {
    value: "Ealing",
    label: "Ealing",
  },
  {
    value: "Enfield",
    label: "Enfield",
  },
  {
    value: "Haringey",
    label: "Haringey",
  },
  {
    value: "Harrow",
    label: "Harrow",
  },
  {
    value: "Havering",
    label: "Havering",
  },
  {
    value: "Hillingdon",
    label: "Hillingdon",
  },
  {
    value: "Hounslow",
    label: "Hounslow",
  },
  {
    value: "Kingston upon Thames",
    label: "Kingston upon Thames",
  },
  {
    value: "Merton",
    label: "Merton",
  },
  {
    value: "Newham",
    label: "Newham",
  },
  {
    value: "Redbridge",
    label: "Redbridge",
  },
  {
    value: "Richmond upon Thames",
    label: "Richmond upon Thames",
  },
  {
    value: "Sutton",
    label: "Sutton",
  },
  {
    value: "Waltham Forest",
    label: "Waltham Forest",
  },
];

const allLondonOptions = {
  "Inner London": [...innerLondonOptions],
  "Outer London": [...outerLondonOptions],
};

const allBoroughsCoordinates = {
  "City of London": [51.51561705, -0.09199861],
  "Barking and Dagenham": [51.54406997, 0.15513952],
  Barnet: [51.6251506, -0.19472798],
  Bexley: [51.45340971, 0.1505043],
  Brent: [51.55882364, -0.28170788],
  Bromley: [51.40362961, 0.01881988],
  Camden: [51.54404344, -0.15372038],
  Croydon: [51.37260225, -0.10900078],
  Ealing: [51.51304467, -0.30891304],
  Enfield: [51.66200283, -0.08151234],
  Greenwich: [51.48213667, 0.02083948],
  Hackney: [51.54504124, -0.05503783],
  "Hammersmith and Fulham": [51.49269582, -0.23396022],
  Haringey: [51.59081369, -0.11100523],
  Harrow: [51.58899856, -0.33398724],
  Havering: [51.57399823, 0.18302671],
  Hillingdon: [51.53299988, -0.45198654],
  Hounslow: [51.46701603, -0.36099372],
  Islington: [51.54652294, -0.10578897],
  "Kensington and Chelsea": [51.49632495, -0.19678642],
  "Kingston upon Thames": [51.39266728, -0.30037754],
  Lambeth: [51.46073417, -0.11600892],
  Lewisham: [51.44517903, -0.02085669],
  Merton: [51.40983273, -0.20045389],
  Newham: [51.52548295, 0.03516613],
  Redbridge: [51.57614027, 0.04536871],
  "Richmond upon Thames": [51.44789233, -0.32668278],
  Southwark: [51.50351817, -0.08040712],
  Sutton: [51.36179973, -0.19446688],
  "Tower Hamlets": [51.51555639, -0.04018888],
  "Waltham Forest": [51.59182376, -0.01179341],
  Wandsworth: [51.45719281, -0.19271445],
  Westminster: [51.49750205, -0.13724342],
};

const Borough = () => {
  const [areaOptions, setAreaOptions] = useState([]);
  const {
    geoData,
    geoDataAreLoading,
    geoDataError,
    reloadGeoData,
    boroughBorder,
  } = useGeoData();


  // 1️⃣ Delete all boroughs first to avoid duplicates
  useEffect(() => {
    const deleteAllBoroughs = async () => {
      try {await Axios.delete("http://localhost:8000/api/boroughs/delete_all/")
          console.log("All boroughs deleted");
        } catch(error)  {
          console.log("Error deleting boroughs:", error.response);
        };
    }
    deleteAllBoroughs();
  }, []);

  // 2️⃣ Потом — загрузить areaOptions
  useEffect(() => {
  const loadAreas = async () => {
    try {
      const response = await Axios.get("http://localhost:8000/api/areas/");
      console.log("Areas response.data", response.data);
      setAreaOptions(response.data);
    } catch (error) {
      console.log("There was an error fetching the area list!", error.response);
    }
  };
  loadAreas();
}, []);

  // return null;
  // console.log("areaOptions outside", areaOptions);

  useEffect(() => {
    console.log("areaOptions inside useEffect", areaOptions);
    areaOptions.map((area) => {
      // console.log("area:", area.name);
      const boroughs = allLondonOptions[area.name].map((borough) => ({
        name: borough.label,
      }));
      // const boroughs = allLondonOptions[area.name];
      // console.log("boroughs", boroughs);
      area.boroughs = boroughs || [];
      area.boroughs.map((borough) => {
        borough.area = area.name;
        const formData = new FormData();
        formData.append("name", borough.name);
        formData.append("area", borough.area);
        // console.log(
        //   "Coordinates for ",
        //   borough.name,
        //   allBoroughsCoordinates[borough.name]
        // );
        formData.append("latitude", allBoroughsCoordinates[borough.name][0]);
        formData.append("longitude", allBoroughsCoordinates[borough.name][1]);
        if (!allBoroughsCoordinates[borough.name]) {
          // console.log("No coordinates for ", borough.name);
        }
        // console.log("border for ", borough.name, BoroughPositions(borough.name));
        let borderCoordinates = BoroughPositions(borough.name);
        borderCoordinates = borderCoordinates.map((coord) => [
          coord[1],
          coord[0],
        ]);
        // Close the polygon by adding the first coordinate at the end if not already closed
        if (
          borderCoordinates.length > 0 &&
          (borderCoordinates[0][0] !==
            borderCoordinates[borderCoordinates.length - 1][0] ||
            borderCoordinates[0][1] !==
              borderCoordinates[borderCoordinates.length - 1][1])
        ) {
          borderCoordinates.push(borderCoordinates[0]);
        }

        // console.log("borderCoordinates for ", borough.name, borderCoordinates);

        formData.append("border", JSON.stringify(borderCoordinates));
        Axios.post("http://localhost:8000/api/boroughs/create/", formData)
          .then((response) => {
            // console.log(
            //   `${borough.area} --- ${borough.name} added`,
            //   response.data
            // );
            // console.log("borough", borough);
            // Add any additional actions after successful submission here
            // Boundary binding
            // A new formdata must be created to avoid appending to the previous one
            const borderFormData = new FormData();
            borderFormData.append("border", {
              type: "MultiPolygon",
              coordinates: [[borderCoordinates]],
            });
            borderFormData.append("borough", response.data.id);
            // console.log("response.data.id", response.data.id);
            Axios.post("http://localhost:8000/api/boroughborders/", {
              borough: response.data.id,
              border: {
                type: "MultiPolygon",
                coordinates: [[borderCoordinates]],
              },
            })
              .then((borderResponse) => {
                // console.log(
                //   `Border for ${borough.name} added`,
              //   borderResponse.data

                // );
              })
              .catch((borderError) => {
                console.log("Error adding border:", borderError);
              });
          })
          .catch((error) => {
            console.log("Error adding borough:", error.response);
          });
      });
      console.log("area", area);
    });
  }, [areaOptions]);

  useEffect(() => {
    const fetchData = async () => {
      await reloadGeoData();
      console.log("✅ geoData загружены в Borough:", geoData);
    };
    fetchData();
  }, [reloadGeoData]);
  // function BoroughDisplay(borough) {
  //   if (borough === "Camden") {
  //     return <Polygon positions={Camden} />;
  //   } else if (borough === "Greenwich") {
  //     return <Polygon positions={Greenwich} />;
  //   } else if (borough === "Hackney") {
  //     return <Polygon positions={Hackney} />;
  //   } else if (borough === "Hammersmith and Fulham") {
  //     return <Polygon positions={Hammersmith} />;
  //   } else if (borough === "Islington") {
  //     return <Polygon positions={Islington} />;
  //   } else if (borough === "Kensington and Chelsea") {
  //     return <Polygon positions={Kensington} />;
  //   } else if (borough === "Lambeth") {
  //     return <Polygon positions={Lambeth} />;
  //   } else if (borough === "Lewisham") {
  //     return <Polygon positions={Lewisham} />;
  //   } else if (borough === "Southwark") {
  //     return <Polygon positions={Southwark} />;
  //   } else if (borough === "Tower Hamlets") {
  //     return <Polygon positions={Hamlets} />;
  //   } else if (borough === "Wandsworth") {
  //     return <Polygon positions={Wandsworth} />;
  //   } else if (borough === "Westminster") {
  //     return <Polygon positions={Westminster} />;
  //   } else if (borough === "City of London") {
  //     return <Polygon positions={City_of_London} />;
  //   } else if (borough === "Barking and Dagenham") {
  //     return <Polygon positions={Barking} />;
  //   } else if (borough === "Barnet") {
  //     return <Polygon positions={Barnet} />;
  //   } else if (borough === "Bexley") {
  //     return <Polygon positions={Bexley} />;
  //   } else if (borough === "Brent") {
  //     return <Polygon positions={Brent} />;
  //   } else if (borough === "Bromley") {
  //     return <Polygon positions={Bromley} />;
  //   } else if (borough === "Croydon") {
  //     return <Polygon positions={Croydon} />;
  //   } else if (borough === "Ealing") {
  //     return <Polygon positions={Ealing} />;
  //   } else if (borough === "Enfield") {
  //     return <Polygon positions={Enfield} />;
  //   } else if (borough === "Haringey") {
  //     return <Polygon positions={Haringey} />;
  //   } else if (borough === "Harrow") {
  //     return <Polygon positions={Harrow} />;
  //   } else if (borough === "Havering") {
  //     return <Polygon positions={Havering} />;
  //   } else if (borough === "Hillingdon") {
  //     return <Polygon positions={Hillingdon} />;
  //   } else if (borough === "Hounslow") {
  //     return <Polygon positions={Hounslow} />;
  //   } else if (borough === "Kingston upon Thames") {
  //     return <Polygon positions={Kingston} />;
  //   } else if (borough === "Merton") {
  //     return <Polygon positions={Merton} />;
  //   } else if (borough === "Newham") {
  //     return <Polygon positions={Newham} />;
  //   } else if (borough === "Redbridge") {
  //     return <Polygon positions={Redbridge} />;
  //   } else if (borough === "Richmond upon Thames") {
  //     return <Polygon positions={Richmond} />;
  //   } else if (borough === "Sutton") {
  //     return <Polygon positions={Sutton} />;
  //   } else if (borough === "Waltham Forest") {
  //     return <Polygon positions={Waltham} />;
  //   }
  // }
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

  // return <h1>Borough Component Loaded</h1>;
  // setAreaOptions(geoData);

  return (
    <>
      <h1>Borough</h1>
      <h2>Area list</h2>
      <ul>
        {geoData.map((area, index) => (
          <li key={index}>
            {area.name}
            <ul>
              {console.log(
                "Rendering boroughs for area:",
                area.name,
                area.boroughs
              )}

              {area.boroughs.map((borough, bIndex) => (
                <li key={bIndex}>
                  {borough.name}
                  {borough}
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
                      {/* {BoroughDisplay(borough.name)} */}
                      {/* {console.log(
                        "Borough for ",
                        borough.name,
                        borough
                      )} */}
                      {/* <Polygon
                        // positions={BoroughPositions(borough.name)}
                        // position={boroughBorder(borough)}
                        positions={borough.coordinates[0][0].map((coord) => [
                          coord[1],
                          coord[0],
                        ])}
                        pathOptions={{
                        color: "blue",
                        weight: 2,
                        fillOpacity: 0.3,
                        }} */}
                      {/* /> */}
                      {/* <FitToPolygon positions={BoroughDisplay(borough.name)} /> */}
                      {/* {console.log(
                        "BoroughDisplay for ",
                        borough.name,
                        BoroughDisplay(borough.name)
                      )} */}
                      <Marker
                        position={
                          allBoroughsCoordinates[borough.name] || [
                            51.505, -0.09,
                          ]
                        }
                      />
                      {/* <TheMapComponent /> */}

                      {/* {BoroughDisplay(borough.name)} */}
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
