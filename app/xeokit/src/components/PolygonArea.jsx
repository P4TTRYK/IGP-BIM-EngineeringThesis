// PolygonArea plugin
//https://xeokit.github.io/xeokit-sdk/examples/measurement/#polygonArea
import { useEffect, useRef } from "react";
import {
    PolygonAreaPlugin,
    PolygonAreaMouseControl
} from "@xeokit/xeokit-sdk";

export function PolygonArea({ viewer, polygonArea }) {
    const clearMeasurementRef = useRef(null);
    const enableMeasurementRef = useRef(null);

    useEffect(() => {
        if (!viewer) return;

        const polygonAreaPlugin = new PolygonAreaPlugin(viewer);
        clearMeasurementRef.current = polygonAreaPlugin;

        polygonAreaPlugin.on("measurementStart", () => {});
        polygonAreaPlugin.on("measurementEnd", () => {});
        polygonAreaPlugin.on("measurementCancel", () => {});

        const polygonAreaMouseControl = new PolygonAreaMouseControl(polygonAreaPlugin, {
            snapping: true,
        });

        enableMeasurementRef.current = polygonAreaMouseControl;

        return () => {
            polygonAreaPlugin.clear();
            polygonAreaMouseControl.destroy();
        };
    }, [viewer]);

    useEffect(() => {
        if (enableMeasurementRef.current && clearMeasurementRef.current) {
            if (polygonArea) {
                enableMeasurementRef.current.activate();
            } else {
                clearMeasurementRef.current.clear();
                enableMeasurementRef.current.deactivate();
            }
        }
    }, [polygonArea]);

    return null;
}