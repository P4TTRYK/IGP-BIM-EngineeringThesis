// Angle Measurement plugin
//https://github.com/xeokit/xeokit-sdk/blob/master/examples/measurement/angle_createWithMouse_snapping.html
import { useEffect, useRef } from "react";
import {
    AngleMeasurementsMouseControl,
    AngleMeasurementsPlugin
} from "@xeokit/xeokit-sdk";

export function AngleMeasurements({ viewer, angleMeasurement }) {
    const clearMeasurementRef = useRef(null);
    const enableMeasurementRef = useRef(null);

    useEffect(() => {
        if (!viewer) return;

        const angleMeasurementsPlugin = new AngleMeasurementsPlugin(viewer);
        clearMeasurementRef.current = angleMeasurementsPlugin;

        angleMeasurementsPlugin.on("measurementStart", () => {});
        angleMeasurementsPlugin.on("measurementEnd", () => {});
        angleMeasurementsPlugin.on("measurementCancel", () => {});

        const angleMeasurementsMouseControl = new AngleMeasurementsMouseControl(angleMeasurementsPlugin, {
            pointerLens: null,
            snapping: true,
        });

        enableMeasurementRef.current = angleMeasurementsMouseControl;

        return () => {
            angleMeasurementsPlugin.clear();
            angleMeasurementsMouseControl.destroy();
        };
    }, [viewer]);

    useEffect(() => {
        if (enableMeasurementRef.current && clearMeasurementRef.current) {
            if (angleMeasurement) {
                enableMeasurementRef.current.activate();
            } else {
                clearMeasurementRef.current.clear();
                enableMeasurementRef.current.deactivate();
            }
        }
    }, [angleMeasurement]);

    return null;
}