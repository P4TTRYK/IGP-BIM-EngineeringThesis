import {useEffect, useRef, useState} from "react";
import {NavCubePlugin, TreeViewPlugin, Viewer, XKTLoaderPlugin} from "@xeokit/xeokit-sdk";
import styles from "./Xeokit.module.css";

// https://xeokit.io/sdk-v2/api-doc/xeokit-sdk/
// https://xeokit.github.io/xeokit-sdk/docs/class/src/plugins/NavCubePlugin/NavCubePlugin.js~NavCubePlugin.html

export function Xeokit({model}) {
    const canvasRef = useRef(null);
    const navCubeRef = useRef(null);
    const treeViewRef = useRef(null);
    const [picked, setPicked] = useState(null);

    useEffect(() => {
        const viewer = new Viewer({
            canvasId: "xeokit_canvas",
            transparent: true,
            dtxEnabled: true,
            pbrEnabled: true,
        });

        viewer.camera.eye = [-10, 10, 10];

        const navCube = new NavCubePlugin(viewer, {
            canvasId: "myNavCubeCanvas",
            cameraFlyDuration: 1,
            synchProjection: true
        });

        new TreeViewPlugin(viewer, {
            containerElement: treeViewRef.current,
            hierarchy: "types",
            autoExpandDepth: 1
        });

        const xktLoader = new XKTLoaderPlugin(viewer);

        const sceneModel = xktLoader.load({
            id: "myModel",
            xkt: model,
            saoEnabled: true,
            edges: true,
            dtxEnabled: true,
            pbrEnabled: true,
            // objectDefaults: {
            //     "IfcPlate": {
            //         opacity: 0.3
            //     },
            // }
        });

        // https://github.com/xeokit/xeokit-sdk/blob/master/examples/navigation/camera_fitToModel.html
        sceneModel.on("loaded", function () {
            viewer.cameraFlight.flyTo(sceneModel);
        });

        // Elements picking
        // https://github.com/xeokit/xeokit-sdk/blob/master/examples/picking/hover_entity.html
        // https://github.com/xeokit/xeokit-sdk/blob/master/examples/picking/doubleClick_entity.html
        let lastEntity = null;

        viewer.cameraControl.on("picked", (pickResult) => {
            if (lastEntity) {
                lastEntity.highlighted = false;
            }

            if (!lastEntity || pickResult.entity.id !== lastEntity.id) {
                lastEntity = pickResult.entity;
                pickResult.entity.highlighted = true;
                setPicked(pickResult.entity.id);

                // Fly to selected object
                viewer.cameraFlight.flyTo({
                    aabb: pickResult.entity.aabb,
                    duration: 0.5
                });
            } else {
                lastEntity = null;
            }
        });
    }, [model]);

    return (
        <>
            <div
                className={styles.elementInfo}
            >
                Picked Entity: {picked ? picked : "None"}
            </div>
            <canvas
                id="xeokit_canvas"
                ref={canvasRef}
                className={styles.xeokit_canvas}
            />
            <canvas
                id="myNavCubeCanvas"
                ref={navCubeRef}
                className={styles.myNavCubeCanvas}
            />
            <div
                id="treeViewContainer"
                ref={treeViewRef}
                className={styles.treeViewContainer}
            ></div>
        </>
    );
}
