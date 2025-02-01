"use client";
import { useAtomValue } from "jotai";
import { FC, useMemo } from "react";
import { navigationAtom } from "../atoms/navigation";
import { useThreshold } from "../hooks/useThreshold";
import { Container, Typography } from "./DevOverlay.styled";

export const DevOverlay: FC = () => {
    const { location } = useAtomValue(navigationAtom);

    const { approachingThreshold, arrivedThreshold } = useThreshold();
    const speedKMH = useMemo(
        () => (location?.coords.speed &&
            Math.round((location.coords.speed * 3600) / 1000)),
        [location?.coords.speed],
    );

    if (!process.env.NEXT_PUBLIC_CANARY) {
        return null;
    }

    return (
        <Container>
            <Typography role="heading" aria-level={1}>
                TrainLED DO
            </Typography>

            <Typography aria-label="Latitude">
                Latitude: {location?.coords.latitude ?? "N/A"}
            </Typography>

            <Typography aria-label="Longitude">
                Longitude: {location?.coords.longitude ?? "N/A"}
            </Typography>

            <Typography aria-label="Speed(km/h)">
                Speed: {speedKMH ? `${speedKMH}km/h` : "N/A"}
            </Typography>

            <Typography aria-label="Approaching threshold(m)">
                Approaching: {approachingThreshold.toLocaleString()}m
            </Typography>

            <Typography aria-label="Arrived threshold(m)">
                Arrived: {arrivedThreshold.toLocaleString()}m
            </Typography>
        </Container>
    );
};
