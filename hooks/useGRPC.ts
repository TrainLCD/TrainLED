import { useAtom } from "jotai";
import { useEffect } from "react";
import { grpcAtom } from "../atoms/grpc";
import { StationAPIClient } from "../generated/StationapiServiceClientPb";

const API_URL = process.env.NEXT_PUBLIC_SAPI_URL;

const useGRPC = () => {
  const [{ cachedClient }, setGRPC] = useAtom(grpcAtom);

  useEffect(() => {
    if (cachedClient || !API_URL) {
      return;
    }

    const client = new StationAPIClient(API_URL);
    setGRPC((prev) => ({
      ...prev,
      cachedClient: client,
    }));
  }, [cachedClient, setGRPC]);

  return cachedClient;
};

export default useGRPC;
