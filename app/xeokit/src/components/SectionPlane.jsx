// https://xeokit.github.io/xeokit-sdk/examples/slicing/#SectionPlanesPlugin_Duplex_FastNavPlugin
import {useEffect, useRef} from "react";
import {math, SectionPlanesPlugin} from "@xeokit/xeokit-sdk";

export function SectionPlane({viewer, enabled}) {
    const sectionPlanesRef = useRef(null);

    useEffect(() => {
        if (!viewer) return;

        const sectionPlanes = new SectionPlanesPlugin(viewer, {
            overviewCanvasId: "mySectionPlanesOverviewCanvas"
        });

        sectionPlanesRef.current = sectionPlanes;

        return () => {
            sectionPlanes.clear();
        };
    }, [viewer]);

    useEffect(() => {
        const sectionPlanes = sectionPlanesRef.current;
        if (sectionPlanes && viewer) {
            if (enabled) {
                sectionPlanes.createSectionPlane({
                    id: "mySectionPlane",
                    pos: viewer.scene.center,
                    dir: math.normalizeVec3([1.0, 0.01, -1.0])
                });

                sectionPlanes.showControl("mySectionPlane");
                sectionPlanes.setOverviewVisible(true);
            } else {
                sectionPlanes.clear();
                sectionPlanes.hideControl();
                sectionPlanes.setOverviewVisible(false);
            }
        }
    }, [enabled, viewer]);

    return null;
}
