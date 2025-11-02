import Axios from "axios";



let areaOptions = [
  { value: "", label: "" },
  // { value: "Inner London", label: "Inner London" },
  // { value: "Outer London", label: "Outer London" },
];

const GetAreaList = async () => {
  try {
    const response = await Axios.get(
      // "http://localhost:8000/api/areas/"
      API_URL("areas/")
    );
    console.log("Response data received");
    console.log(response.data);
    response.data.map((areaObject) => {
      areaOptions.push({ value: areaObject.name, label: areaObject.name });
    });
    // console.log("areaOptions in function", areaOptions);
    return areaOptions;
  } catch (error) {
    console.log("There was an error");
    console.log(error.response);
    return [];
  }
};

export { GetAreaList };

const GetBoroughList = async () => {
  try {
    const response = await Axios.get(
      // "http://localhost:8000/api/boroughs/"
      API_URL("boroughs/")
    );
    console.log("Borough' data received");
    console.log(response.data);
    // const filteredBoroughs = response.data.filter((borough) => borough.area === area);
    // console.log("Filtered Boroughs:", filteredBoroughs);
    return response.data || [];
  } catch (error) {
    console.log("There was an error");
    console.log(error.response);
    return [];
  }
};

export { GetBoroughList };
