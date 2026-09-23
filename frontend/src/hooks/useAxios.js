import { useState, useEffect } from "react";
import api from "../api/api";

export function useAxios({ url, method = "GET", body = null, headers = null }) {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await api[method.toLowerCase()](url, body, headers);
      setResponse(res.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (url) {
      fetchData();
    }
  }, [url]);

  return { response, error, loading, refetch: fetchData };
}

export default useAxios;

