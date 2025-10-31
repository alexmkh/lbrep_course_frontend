const BaseURL = () => {
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:8000/api/";
  } else if (process.env.NODE_ENV === "production") {
    return "https://lbrep.alexmkh.com.es/api/";
  }
};

const API_URL = (URL) => {
  let fullUrl = BaseURL() + URL;
  if (!(fullUrl.endsWith("/"))) {
    fullUrl += '/';
  }
  return fullUrl;
}

export default API_URL;
