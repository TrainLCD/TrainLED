'use client'
import { useAtomValue } from "jotai";
import { useMemo } from "react";
import { navigationAtom } from "../atoms/navigation";
import { useThreshold } from "../hooks/useThreshold";
import { Container, Typography } from "./DevOverlay.styled";

export const DevOverlay = () => {
    const { location } = useAtomValue(navigationAtom);

    const { approachingThreshold, arrivedThreshold } = useThreshold();

    const speedKMH = useMemo(
        () =>
            (location?.coords.speed &&
                Math.round((location.coords.speed * 3600) / 1000)) ?? 0,
        [location?.coords.speed],
    );

    return (
        <Container>
            <Typography>
                TrainLED DO
            </Typography>
            <Typography>
                {`Latitude: ${location?.coords.latitude ?? ""}`}
            </Typography>
            <Typography>
                {`Longitude: ${location?.coords.longitude ?? ""}`}
            </Typography>

            <Typography>
                {`Accuracy: ${location?.coords.accuracy ?? ""}m`}
            </Typography>

            <Typography>
                Speed: {speedKMH}
                km/h
            </Typography>

            <Typography>
                Approaching: {approachingThreshold.toLocaleString()}m
            </Typography>
            <Typography>
                Arrived: {arrivedThreshold.toLocaleString()}m
            </Typography>
        </Container>
    );
};
