// https://xeokit.github.io/xeokit-sdk/examples/slicing/#SectionPlanesPlugin_Duplex_FastNavPlugin
import {useEffect, useRef, useState} from "react";
import {math, SectionPlanesPlugin} from "@xeokit/xeokit-sdk";

export function SectionPlane({viewer, enabled}) {
    const sectionPlanesRef = useRef(null);
    const sectionPlaneRef = useRef(null);
    const [sectionId, setSectionId] = useState(null);

    useEffect(() => {
        if (!viewer) return;

        const sectionPlanes = new SectionPlanesPlugin(viewer, {
            overviewCanvasId: "mySectionPlanesOverviewCanvas",
            overviewVisible: false
        });

        const sectionPlane = sectionPlanes.createSectionPlane({
            id: "mySectionPlane",
            pos: viewer.scene.center,
            dir: math.normalizeVec3([1.0, 0.01, -1.0])
        });

        sectionPlanesRef.current = sectionPlanes;
        sectionPlaneRef.current = sectionPlane;

        setSectionId(sectionPlane.id);
        return () => {
            sectionPlanes.clear();
        };
    }, [viewer]);

    useEffect(() => {
        if (sectionPlaneRef.current && sectionPlanesRef.current && sectionId) {
            if (enabled) {
                console.log(sectionId);
                sectionPlaneRef.current.active = true;
                sectionPlanesRef.current.showControl("mySectionPlane");
                sectionPlanesRef.current.setOverviewVisible(true);
            } else {
                sectionPlaneRef.current.active = false;
                sectionPlanesRef.current.hideControl();
                sectionPlanesRef.current.setOverviewVisible(false);
            }
        }
    }, [enabled, sectionId]);

    return null;
}
