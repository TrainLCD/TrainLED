import computeDestinationPoint from "geolib/es/computeDestinationPoint";
import getDistance from "geolib/es/getDistance";
import getRhumbLineBearing from "geolib/es/getRhumbLineBearing";
import { useAtomValue, useSetAtom } from "jotai";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useInterval } from "react-use";
import { lineAtom } from "../atoms/line";
import { navigationAtom } from "../atoms/navigation";
import { stationAtom } from "../atoms/station";
import {
    LINE_TYPE_MAX_ACCELERATION_IN_KM_H_S,
    LINE_TYPE_MAX_SPEEDS_IN_KM_H,
} from "../constants/simulationMode";
import { LineType } from "../generated/proto/stationapi_pb";
import { dropEitherJunctionStation } from "../utils";
import getIsPass from "../utils/isPass";
import { useCurrentLine } from "./useCurrentLine";

export const useSimulationMode = (enabled: boolean): void => {
    const { stations: rawStations, station } = useAtomValue(stationAtom);
    const { selectedDirection, selectedLine } = useAtomValue(lineAtom);
    const setNavigationState = useSetAtom(navigationAtom);

    const currentLine = useCurrentLine();

    const stations = useMemo(
        () => dropEitherJunctionStation(rawStations, selectedDirection),
        [rawStations, selectedDirection],
    );

    const [index, setIndex] = useState(
        Math.max(
            stations.findIndex((s) => s.groupId === station?.groupId),
            0,
        ),
    );

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        if (enabled) {
            setNavigationState((prev) => ({
                ...prev,
                location: {
                    timestamp: new Date().getTime(),
                    coords: {
                        accuracy: 0,
                        altitude: null,
                        altitudeAccuracy: null,
                        speed: null,
                        heading: null,
                        latitude: stations[index].latitude,
                        longitude: stations[index].longitude,
                        toJSON: () => undefined,
                    },
                    toJSON: () => undefined,
                },
            }));
        }
    }, [enabled]);

    const currentLineType = useMemo(
        () => currentLine?.lineType ?? LineType.Normal,
        [currentLine],
    );

    const maxSpeedInMetersSec = useMemo(
        () => LINE_TYPE_MAX_SPEEDS_IN_KM_H[currentLineType] / 3.6,
        [currentLineType],
    );
    const maxAccelerationInMS2 = useMemo(
        () => LINE_TYPE_MAX_ACCELERATION_IN_KM_H_S[currentLineType] / 3.6,
        [currentLineType],
    );

    const [isDeceleration, setIsDeceleration] = useState(false);

    const step = useCallback(() => {
        if (!enabled || !selectedDirection || !selectedLine) {
            return;
        }

        const cur = stations[index];
        const next = selectedDirection === "INBOUND"
            ? stations[index + 1]
            : stations[index - 1];

        if (!next) {
            setIndex(0);
            setNavigationState((prev) => ({
                ...prev,
                location: {
                    timestamp: new Date().getTime(),
                    coords: {
                        accuracy: 0,
                        altitude: null,
                        altitudeAccuracy: null,
                        speed: null,
                        heading: null,
                        latitude: stations[0].latitude,
                        longitude: stations[0].longitude,
                        toJSON: () => undefined,
                    },
                    toJSON: () => undefined,
                },
            }));
            return;
        }

        if (cur) {
            setNavigationState((prev) => {
                const currentDistanceForNextStation = getDistance(
                    {
                        lat: prev?.location?.coords?.latitude ?? 0,
                        lon: prev?.location?.coords?.longitude ?? 0,
                    },
                    {
                        lat: next?.latitude ?? 0,
                        lon: next?.longitude ?? 0,
                    },
                );

                const speedInMh = (() => {
                    const prevSpeed = prev?.location?.coords.speed ?? 0;

                    const isAcceleration = (prev?.location?.coords.speed ?? 0) <
                        maxSpeedInMetersSec;

                    if (Math.floor(prevSpeed) > 0) {
                        const isStoppable = Math.floor(
                            currentDistanceForNextStation / prevSpeed,
                        ) > 0;
                        if (!isStoppable) {
                            setIsDeceleration(true);
                        }
                    }

                    if (isDeceleration && !getIsPass(next)) {
                        const nextSpeed = prevSpeed - maxAccelerationInMS2;
                        if (nextSpeed < 0) {
                            setIndex((prev) =>
                                selectedDirection === "INBOUND"
                                    ? prev + 1
                                    : prev - 1
                            );
                            setIsDeceleration(false);

                            return 0;
                        }
                        return nextSpeed;
                    }

                    if (isAcceleration) {
                        return prevSpeed + maxAccelerationInMS2;
                    }

                    return maxSpeedInMetersSec;
                })();

                const nextBearing = getRhumbLineBearing(
                    {
                        latitude: prev?.location?.coords.latitude ?? 0,
                        longitude: prev?.location?.coords.longitude ?? 0,
                    },
                    {
                        latitude: next?.latitude ?? 0,
                        longitude: next?.longitude ?? 0,
                    },
                );

                const nextPoint = computeDestinationPoint(
                    {
                        lat: prev?.location?.coords.latitude ?? 0,
                        lon: prev?.location?.coords.longitude ?? 0,
                    },
                    speedInMh,
                    nextBearing,
                );

                return {
                    ...prev,
                    location: {
                        timestamp: new Date().getTime(),
                        coords: {
                            ...nextPoint,
                            accuracy: 0,
                            altitude: null,
                            altitudeAccuracy: null,
                            speed: speedInMh,
                            heading: null,
                            toJSON: () => undefined,
                        },
                        toJSON: () => undefined,
                    },
                };
            });
        }
    }, [
        enabled,
        selectedDirection,
        selectedLine,
        stations,
        index,
        setNavigationState,
        maxSpeedInMetersSec,
        isDeceleration,
        maxAccelerationInMS2,
    ]);

    useInterval(step, 1000);
};
