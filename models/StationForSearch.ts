import { Station } from "./grpc";

type StationForSearch = Station & {
  nameForSearch?: string;
};

export default StationForSearch;
