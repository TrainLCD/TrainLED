import * as jspb from 'google-protobuf'



export class GetStationByIdRequest extends jspb.Message {
  getId(): number;
  setId(value: number): GetStationByIdRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetStationByIdRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetStationByIdRequest): GetStationByIdRequest.AsObject;
  static serializeBinaryToWriter(message: GetStationByIdRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetStationByIdRequest;
  static deserializeBinaryFromReader(message: GetStationByIdRequest, reader: jspb.BinaryReader): GetStationByIdRequest;
}

export namespace GetStationByIdRequest {
  export type AsObject = {
    id: number,
  }
}

export class GetStationByGroupIdRequest extends jspb.Message {
  getGroupId(): number;
  setGroupId(value: number): GetStationByGroupIdRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetStationByGroupIdRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetStationByGroupIdRequest): GetStationByGroupIdRequest.AsObject;
  static serializeBinaryToWriter(message: GetStationByGroupIdRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetStationByGroupIdRequest;
  static deserializeBinaryFromReader(message: GetStationByGroupIdRequest, reader: jspb.BinaryReader): GetStationByGroupIdRequest;
}

export namespace GetStationByGroupIdRequest {
  export type AsObject = {
    groupId: number,
  }
}

export class GetStationByCoordinatesRequest extends jspb.Message {
  getLatitude(): number;
  setLatitude(value: number): GetStationByCoordinatesRequest;

  getLongitude(): number;
  setLongitude(value: number): GetStationByCoordinatesRequest;

  getLimit(): number;
  setLimit(value: number): GetStationByCoordinatesRequest;
  hasLimit(): boolean;
  clearLimit(): GetStationByCoordinatesRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetStationByCoordinatesRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetStationByCoordinatesRequest): GetStationByCoordinatesRequest.AsObject;
  static serializeBinaryToWriter(message: GetStationByCoordinatesRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetStationByCoordinatesRequest;
  static deserializeBinaryFromReader(message: GetStationByCoordinatesRequest, reader: jspb.BinaryReader): GetStationByCoordinatesRequest;
}

export namespace GetStationByCoordinatesRequest {
  export type AsObject = {
    latitude: number,
    longitude: number,
    limit?: number,
  }

  export enum LimitCase { 
    _LIMIT_NOT_SET = 0,
    LIMIT = 3,
  }
}

export class GetStationByLineIdRequest extends jspb.Message {
  getLineId(): number;
  setLineId(value: number): GetStationByLineIdRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetStationByLineIdRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetStationByLineIdRequest): GetStationByLineIdRequest.AsObject;
  static serializeBinaryToWriter(message: GetStationByLineIdRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetStationByLineIdRequest;
  static deserializeBinaryFromReader(message: GetStationByLineIdRequest, reader: jspb.BinaryReader): GetStationByLineIdRequest;
}

export namespace GetStationByLineIdRequest {
  export type AsObject = {
    lineId: number,
  }
}

export class GetStationsByNameRequest extends jspb.Message {
  getStationName(): string;
  setStationName(value: string): GetStationsByNameRequest;

  getLimit(): number;
  setLimit(value: number): GetStationsByNameRequest;
  hasLimit(): boolean;
  clearLimit(): GetStationsByNameRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetStationsByNameRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetStationsByNameRequest): GetStationsByNameRequest.AsObject;
  static serializeBinaryToWriter(message: GetStationsByNameRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetStationsByNameRequest;
  static deserializeBinaryFromReader(message: GetStationsByNameRequest, reader: jspb.BinaryReader): GetStationsByNameRequest;
}

export namespace GetStationsByNameRequest {
  export type AsObject = {
    stationName: string,
    limit?: number,
  }

  export enum LimitCase { 
    _LIMIT_NOT_SET = 0,
    LIMIT = 2,
  }
}

export class GetStationsByLineGroupIdRequest extends jspb.Message {
  getLineGroupId(): number;
  setLineGroupId(value: number): GetStationsByLineGroupIdRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetStationsByLineGroupIdRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetStationsByLineGroupIdRequest): GetStationsByLineGroupIdRequest.AsObject;
  static serializeBinaryToWriter(message: GetStationsByLineGroupIdRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetStationsByLineGroupIdRequest;
  static deserializeBinaryFromReader(message: GetStationsByLineGroupIdRequest, reader: jspb.BinaryReader): GetStationsByLineGroupIdRequest;
}

export namespace GetStationsByLineGroupIdRequest {
  export type AsObject = {
    lineGroupId: number,
  }
}

export class GetTrainTypesByStationIdRequest extends jspb.Message {
  getStationId(): number;
  setStationId(value: number): GetTrainTypesByStationIdRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetTrainTypesByStationIdRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetTrainTypesByStationIdRequest): GetTrainTypesByStationIdRequest.AsObject;
  static serializeBinaryToWriter(message: GetTrainTypesByStationIdRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetTrainTypesByStationIdRequest;
  static deserializeBinaryFromReader(message: GetTrainTypesByStationIdRequest, reader: jspb.BinaryReader): GetTrainTypesByStationIdRequest;
}

export namespace GetTrainTypesByStationIdRequest {
  export type AsObject = {
    stationId: number,
  }
}

export class StationNumber extends jspb.Message {
  getLineSymbol(): string;
  setLineSymbol(value: string): StationNumber;

  getLineSymbolColor(): string;
  setLineSymbolColor(value: string): StationNumber;

  getLineSymbolShape(): string;
  setLineSymbolShape(value: string): StationNumber;

  getStationNumber(): string;
  setStationNumber(value: string): StationNumber;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): StationNumber.AsObject;
  static toObject(includeInstance: boolean, msg: StationNumber): StationNumber.AsObject;
  static serializeBinaryToWriter(message: StationNumber, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): StationNumber;
  static deserializeBinaryFromReader(message: StationNumber, reader: jspb.BinaryReader): StationNumber;
}

export namespace StationNumber {
  export type AsObject = {
    lineSymbol: string,
    lineSymbolColor: string,
    lineSymbolShape: string,
    stationNumber: string,
  }
}

export class TrainType extends jspb.Message {
  getId(): number;
  setId(value: number): TrainType;

  getTypeId(): number;
  setTypeId(value: number): TrainType;

  getGroupId(): number;
  setGroupId(value: number): TrainType;

  getName(): string;
  setName(value: string): TrainType;

  getNameKatakana(): string;
  setNameKatakana(value: string): TrainType;

  getNameRoman(): string;
  setNameRoman(value: string): TrainType;

  getNameChinese(): string;
  setNameChinese(value: string): TrainType;

  getNameKorean(): string;
  setNameKorean(value: string): TrainType;

  getColor(): string;
  setColor(value: string): TrainType;

  getLinesList(): Array<Line>;
  setLinesList(value: Array<Line>): TrainType;
  clearLinesList(): TrainType;
  addLines(value?: Line, index?: number): Line;

  getLine(): Line | undefined;
  setLine(value?: Line): TrainType;
  hasLine(): boolean;
  clearLine(): TrainType;

  getDirection(): TrainDirection;
  setDirection(value: TrainDirection): TrainType;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TrainType.AsObject;
  static toObject(includeInstance: boolean, msg: TrainType): TrainType.AsObject;
  static serializeBinaryToWriter(message: TrainType, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TrainType;
  static deserializeBinaryFromReader(message: TrainType, reader: jspb.BinaryReader): TrainType;
}

export namespace TrainType {
  export type AsObject = {
    id: number,
    typeId: number,
    groupId: number,
    name: string,
    nameKatakana: string,
    nameRoman: string,
    nameChinese: string,
    nameKorean: string,
    color: string,
    linesList: Array<Line.AsObject>,
    line?: Line.AsObject,
    direction: TrainDirection,
  }

  export enum LineCase { 
    _LINE_NOT_SET = 0,
    LINE = 11,
  }
}

export class Station extends jspb.Message {
  getId(): number;
  setId(value: number): Station;

  getGroupId(): number;
  setGroupId(value: number): Station;

  getName(): string;
  setName(value: string): Station;

  getNameKatakana(): string;
  setNameKatakana(value: string): Station;

  getNameRoman(): string;
  setNameRoman(value: string): Station;

  getNameChinese(): string;
  setNameChinese(value: string): Station;

  getNameKorean(): string;
  setNameKorean(value: string): Station;

  getThreeLetterCode(): string;
  setThreeLetterCode(value: string): Station;
  hasThreeLetterCode(): boolean;
  clearThreeLetterCode(): Station;

  getLinesList(): Array<Line>;
  setLinesList(value: Array<Line>): Station;
  clearLinesList(): Station;
  addLines(value?: Line, index?: number): Line;

  getLine(): Line | undefined;
  setLine(value?: Line): Station;
  hasLine(): boolean;
  clearLine(): Station;

  getPrefectureId(): number;
  setPrefectureId(value: number): Station;

  getPostalCode(): string;
  setPostalCode(value: string): Station;

  getAddress(): string;
  setAddress(value: string): Station;

  getLatitude(): number;
  setLatitude(value: number): Station;

  getLongitude(): number;
  setLongitude(value: number): Station;

  getOpenedAt(): string;
  setOpenedAt(value: string): Station;

  getClosedAt(): string;
  setClosedAt(value: string): Station;

  getStatus(): OperationStatus;
  setStatus(value: OperationStatus): Station;

  getStationNumbersList(): Array<StationNumber>;
  setStationNumbersList(value: Array<StationNumber>): Station;
  clearStationNumbersList(): Station;
  addStationNumbers(value?: StationNumber, index?: number): StationNumber;

  getStopCondition(): StopCondition;
  setStopCondition(value: StopCondition): Station;

  getDistance(): number;
  setDistance(value: number): Station;
  hasDistance(): boolean;
  clearDistance(): Station;

  getHasTrainTypes(): boolean;
  setHasTrainTypes(value: boolean): Station;
  hasHasTrainTypes(): boolean;
  clearHasTrainTypes(): Station;

  getPass(): boolean;
  setPass(value: boolean): Station;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Station.AsObject;
  static toObject(includeInstance: boolean, msg: Station): Station.AsObject;
  static serializeBinaryToWriter(message: Station, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Station;
  static deserializeBinaryFromReader(message: Station, reader: jspb.BinaryReader): Station;
}

export namespace Station {
  export type AsObject = {
    id: number,
    groupId: number,
    name: string,
    nameKatakana: string,
    nameRoman: string,
    nameChinese: string,
    nameKorean: string,
    threeLetterCode?: string,
    linesList: Array<Line.AsObject>,
    line?: Line.AsObject,
    prefectureId: number,
    postalCode: string,
    address: string,
    latitude: number,
    longitude: number,
    openedAt: string,
    closedAt: string,
    status: OperationStatus,
    stationNumbersList: Array<StationNumber.AsObject>,
    stopCondition: StopCondition,
    distance?: number,
    hasTrainTypes?: boolean,
    pass: boolean,
  }

  export enum ThreeLetterCodeCase { 
    _THREE_LETTER_CODE_NOT_SET = 0,
    THREE_LETTER_CODE = 8,
  }

  export enum LineCase { 
    _LINE_NOT_SET = 0,
    LINE = 10,
  }

  export enum DistanceCase { 
    _DISTANCE_NOT_SET = 0,
    DISTANCE = 21,
  }

  export enum HasTrainTypesCase { 
    _HAS_TRAIN_TYPES_NOT_SET = 0,
    HAS_TRAIN_TYPES = 22,
  }
}

export class SingleStationResponse extends jspb.Message {
  getStation(): Station | undefined;
  setStation(value?: Station): SingleStationResponse;
  hasStation(): boolean;
  clearStation(): SingleStationResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SingleStationResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SingleStationResponse): SingleStationResponse.AsObject;
  static serializeBinaryToWriter(message: SingleStationResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SingleStationResponse;
  static deserializeBinaryFromReader(message: SingleStationResponse, reader: jspb.BinaryReader): SingleStationResponse;
}

export namespace SingleStationResponse {
  export type AsObject = {
    station?: Station.AsObject,
  }
}

export class MultipleStationResponse extends jspb.Message {
  getStationsList(): Array<Station>;
  setStationsList(value: Array<Station>): MultipleStationResponse;
  clearStationsList(): MultipleStationResponse;
  addStations(value?: Station, index?: number): Station;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MultipleStationResponse.AsObject;
  static toObject(includeInstance: boolean, msg: MultipleStationResponse): MultipleStationResponse.AsObject;
  static serializeBinaryToWriter(message: MultipleStationResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MultipleStationResponse;
  static deserializeBinaryFromReader(message: MultipleStationResponse, reader: jspb.BinaryReader): MultipleStationResponse;
}

export namespace MultipleStationResponse {
  export type AsObject = {
    stationsList: Array<Station.AsObject>,
  }
}

export class MultipleTrainTypeResponse extends jspb.Message {
  getTrainTypesList(): Array<TrainType>;
  setTrainTypesList(value: Array<TrainType>): MultipleTrainTypeResponse;
  clearTrainTypesList(): MultipleTrainTypeResponse;
  addTrainTypes(value?: TrainType, index?: number): TrainType;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MultipleTrainTypeResponse.AsObject;
  static toObject(includeInstance: boolean, msg: MultipleTrainTypeResponse): MultipleTrainTypeResponse.AsObject;
  static serializeBinaryToWriter(message: MultipleTrainTypeResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MultipleTrainTypeResponse;
  static deserializeBinaryFromReader(message: MultipleTrainTypeResponse, reader: jspb.BinaryReader): MultipleTrainTypeResponse;
}

export namespace MultipleTrainTypeResponse {
  export type AsObject = {
    trainTypesList: Array<TrainType.AsObject>,
  }
}

export class LineSymbol extends jspb.Message {
  getSymbol(): string;
  setSymbol(value: string): LineSymbol;

  getColor(): string;
  setColor(value: string): LineSymbol;

  getShape(): string;
  setShape(value: string): LineSymbol;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LineSymbol.AsObject;
  static toObject(includeInstance: boolean, msg: LineSymbol): LineSymbol.AsObject;
  static serializeBinaryToWriter(message: LineSymbol, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LineSymbol;
  static deserializeBinaryFromReader(message: LineSymbol, reader: jspb.BinaryReader): LineSymbol;
}

export namespace LineSymbol {
  export type AsObject = {
    symbol: string,
    color: string,
    shape: string,
  }
}

export class Company extends jspb.Message {
  getId(): number;
  setId(value: number): Company;

  getRailroadId(): number;
  setRailroadId(value: number): Company;

  getNameShort(): string;
  setNameShort(value: string): Company;

  getNameKatakana(): string;
  setNameKatakana(value: string): Company;

  getNameFull(): string;
  setNameFull(value: string): Company;

  getNameEnglishShort(): string;
  setNameEnglishShort(value: string): Company;

  getNameEnglishFull(): string;
  setNameEnglishFull(value: string): Company;

  getUrl(): string;
  setUrl(value: string): Company;

  getType(): CompanyType;
  setType(value: CompanyType): Company;

  getStatus(): OperationStatus;
  setStatus(value: OperationStatus): Company;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Company.AsObject;
  static toObject(includeInstance: boolean, msg: Company): Company.AsObject;
  static serializeBinaryToWriter(message: Company, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Company;
  static deserializeBinaryFromReader(message: Company, reader: jspb.BinaryReader): Company;
}

export namespace Company {
  export type AsObject = {
    id: number,
    railroadId: number,
    nameShort: string,
    nameKatakana: string,
    nameFull: string,
    nameEnglishShort: string,
    nameEnglishFull: string,
    url: string,
    type: CompanyType,
    status: OperationStatus,
  }
}

export class Line extends jspb.Message {
  getId(): number;
  setId(value: number): Line;

  getNameShort(): string;
  setNameShort(value: string): Line;

  getNameKatakana(): string;
  setNameKatakana(value: string): Line;

  getNameFull(): string;
  setNameFull(value: string): Line;

  getNameRoman(): string;
  setNameRoman(value: string): Line;

  getNameChinese(): string;
  setNameChinese(value: string): Line;

  getNameKorean(): string;
  setNameKorean(value: string): Line;

  getColor(): string;
  setColor(value: string): Line;

  getLineType(): LineType;
  setLineType(value: LineType): Line;

  getLineSymbolsList(): Array<LineSymbol>;
  setLineSymbolsList(value: Array<LineSymbol>): Line;
  clearLineSymbolsList(): Line;
  addLineSymbols(value?: LineSymbol, index?: number): LineSymbol;

  getStatus(): OperationStatus;
  setStatus(value: OperationStatus): Line;

  getStation(): Station | undefined;
  setStation(value?: Station): Line;
  hasStation(): boolean;
  clearStation(): Line;

  getCompany(): Company | undefined;
  setCompany(value?: Company): Line;
  hasCompany(): boolean;
  clearCompany(): Line;

  getTrainType(): TrainType | undefined;
  setTrainType(value?: TrainType): Line;
  hasTrainType(): boolean;
  clearTrainType(): Line;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Line.AsObject;
  static toObject(includeInstance: boolean, msg: Line): Line.AsObject;
  static serializeBinaryToWriter(message: Line, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Line;
  static deserializeBinaryFromReader(message: Line, reader: jspb.BinaryReader): Line;
}

export namespace Line {
  export type AsObject = {
    id: number,
    nameShort: string,
    nameKatakana: string,
    nameFull: string,
    nameRoman: string,
    nameChinese: string,
    nameKorean: string,
    color: string,
    lineType: LineType,
    lineSymbolsList: Array<LineSymbol.AsObject>,
    status: OperationStatus,
    station?: Station.AsObject,
    company?: Company.AsObject,
    trainType?: TrainType.AsObject,
  }

  export enum StationCase { 
    _STATION_NOT_SET = 0,
    STATION = 12,
  }

  export enum CompanyCase { 
    _COMPANY_NOT_SET = 0,
    COMPANY = 13,
  }

  export enum TrainTypeCase { 
    _TRAIN_TYPE_NOT_SET = 0,
    TRAIN_TYPE = 14,
  }
}

export class SingleLine extends jspb.Message {
  getLine(): Line | undefined;
  setLine(value?: Line): SingleLine;
  hasLine(): boolean;
  clearLine(): SingleLine;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SingleLine.AsObject;
  static toObject(includeInstance: boolean, msg: SingleLine): SingleLine.AsObject;
  static serializeBinaryToWriter(message: SingleLine, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SingleLine;
  static deserializeBinaryFromReader(message: SingleLine, reader: jspb.BinaryReader): SingleLine;
}

export namespace SingleLine {
  export type AsObject = {
    line?: Line.AsObject,
  }
}

export class MultipleLine extends jspb.Message {
  getLinesList(): Array<Line>;
  setLinesList(value: Array<Line>): MultipleLine;
  clearLinesList(): MultipleLine;
  addLines(value?: Line, index?: number): Line;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MultipleLine.AsObject;
  static toObject(includeInstance: boolean, msg: MultipleLine): MultipleLine.AsObject;
  static serializeBinaryToWriter(message: MultipleLine, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MultipleLine;
  static deserializeBinaryFromReader(message: MultipleLine, reader: jspb.BinaryReader): MultipleLine;
}

export namespace MultipleLine {
  export type AsObject = {
    linesList: Array<Line.AsObject>,
  }
}

export enum OperationStatus { 
  INOPERATION = 0,
  NOTOPENED = 1,
  CLOSED = 2,
}
export enum StopCondition { 
  ALL = 0,
  NOT = 1,
  PARTIAL = 2,
  WEEKDAY = 3,
  HOLIDAY = 4,
  PARTIALSTOP = 5,
}
export enum TrainDirection { 
  BOTH = 0,
  INBOUND = 1,
  OUTBOUND = 2,
}
export enum LineType { 
  OTHERLINETYPE = 0,
  BULLETTRAIN = 1,
  NORMAL = 2,
  SUBWAY = 3,
  TRAM = 4,
  MONORAILORAGT = 5,
}
export enum CompanyType { 
  OTHERCOMPANY = 0,
  JR = 1,
  PRIVATE = 2,
  MAJOR = 3,
  SEMIMAJOR = 4,
}
