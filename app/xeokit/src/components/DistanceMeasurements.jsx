// Measurement plugin
// https://github.com/xeokit/xeokit-sdk/blob/master/examples/measurement/distance_createWithMouse_snapping.html
import {useEffect, useRef} from "react";
import {DistanceMeasurementsMouseControl, DistanceMeasurementsPlugin} from "@xeokit/xeokit-sdk";

export function DistanceMeasurements({viewer, measurement}) {
    const clearMeasurementRef = useRef(null);
    const enableMeasurementRef = useRef(null);

    useEffect(() => {
        if (!viewer) return;

        const distanceMeasurementsPlugin = new DistanceMeasurementsPlugin(viewer);
        clearMeasurementRef.current = distanceMeasurementsPlugin;

        distanceMeasurementsPlugin.on("measurementStart", () => {
        });
        distanceMeasurementsPlugin.on("measurementEnd", () => {
        });
        distanceMeasurementsPlugin.on("measurementCancel", () => {
        });

        const distanceMeasurementsMouseControl = new DistanceMeasurementsMouseControl(distanceMeasurementsPlugin, {
            pointerLens: null,
            snapping: true,
        });

        enableMeasurementRef.current = distanceMeasurementsMouseControl;

        return () => {
            distanceMeasurementsPlugin.clear();
            distanceMeasurementsMouseControl.destroy();
        };
    }, [viewer]);

    useEffect(() => {
        if (enableMeasurementRef.current && clearMeasurementRef.current) {
            if (measurement) {
                enableMeasurementRef.current.activate();
            } else {
                clearMeasurementRef.current.clear();
                enableMeasurementRef.current.deactivate();
            }
        }
    }, [measurement]);

    return null;
}
