// Angle Measurement plugin
//https://github.com/xeokit/xeokit-sdk/blob/master/examples/measurement/angle_createWithMouse_snapping.html
import {useEffect, useRef} from "react";
import {AngleMeasurementsMouseControl, AngleMeasurementsPlugin} from "@xeokit/xeokit-sdk";

export function AngleMeasurements({viewer, enabled}) {
    const clearMeasurementRef = useRef(null);
    const enableMeasurementRef = useRef(null);

    useEffect(() => {
        if (!viewer) return;

        const angleMeasurementsPlugin = new AngleMeasurementsPlugin(viewer);
        clearMeasurementRef.current = angleMeasurementsPlugin;

        angleMeasurementsPlugin.on("measurementStart", () => {
        });

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
            if (enabled) {
                enableMeasurementRef.current.activate();
            } else {
                clearMeasurementRef.current.clear();
                enableMeasurementRef.current.deactivate();
            }
        }
    }, [enabled]);

    return null;
}
