import { atom } from "jotai";
import { StationAPIClient } from "../generated/StationapiServiceClientPb";

type GrpcAtom = { cachedClient: StationAPIClient | null };

export const grpcAtom = atom<GrpcAtom>({ cachedClient: null });
