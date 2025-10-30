import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import Axios from "axios";

export const GeoDataContext = createContext(null);


export const GeoDataProvider = ({ children }) => {
  const [geoData, setGeoData] = useState([]);
  const [geoDataAreLoading, setGeoDataAreLoading] = useState(true);
  const [geoDataError, setGeoDataError] = useState(null);

  const boroughBorder = (borough) => {
    let border = borough?.border?.border?.coordinates[0][0];
    border = border?.map(coord => [coord[1], coord[0]]);
    return border;
  }

  // ссылка на resolve-функцию промиса, которую вызовем после обновления geoData
  const pendingResolve = useRef(null);

  // следим за изменением geoData и уведомляем, если кто-то ждет
  useEffect(() => {
    if (pendingResolve.current) {
      pendingResolve.current(); // сказать "данные обновились"
      pendingResolve.current = null; // очистить
    }
  }, [geoData]);

  const reloadGeoData = useCallback(async () => {
    setGeoDataAreLoading(true);
    setGeoDataError(null);

    try {
      const res = await Axios.get("http://localhost:8000/api/areas/");

      // создаем промис, который разрешится после обновления состояния
      const stateUpdated = new Promise((resolve) => {
        pendingResolve.current = resolve;
      });

      // обновляем состояние
      setGeoData(res.data);

      // ждем, пока React применит обновление (а useEffect это поймает)
      await stateUpdated;
      // console.log("✅ Геоданные обновлены:", res.data);
      res.data.map(area => {
        area.boroughs.map((borough) => {
          const new_border = boroughBorder(borough)
          borough.border = new_border;
        });
      });
      return res.data;
    } catch (err) {
      const errorMsg =
        err.response?.data?.detail ||
        err.message ||
        "Ошибка при загрузке данных";
      setGeoDataError(errorMsg);
      console.error("❌ Ошибка загрузки геоданных:", errorMsg);
      throw err;
    } finally {
      setGeoDataAreLoading(false);
    }
  }, []);

  useEffect(() => {
    reloadGeoData();
  }, [reloadGeoData]);


  return (
    <GeoDataContext.Provider
      value={{ geoData, geoDataAreLoading, geoDataError, reloadGeoData }}
    >
      {children}
    </GeoDataContext.Provider>
  );
};

export const useGeoData = () => useContext(GeoDataContext);
