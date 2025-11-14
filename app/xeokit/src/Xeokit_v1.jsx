import {useEffect, useRef} from "react";
import {NavCubePlugin, TreeViewPlugin, Viewer, XKTLoaderPlugin} from "@xeokit/xeokit-sdk";
import styles from "./Xeokit.module.css";

// https://xeokit.io/sdk-v2/api-doc/xeokit-sdk/
// https://xeokit.github.io/xeokit-sdk/docs/class/src/plugins/NavCubePlugin/NavCubePlugin.js~NavCubePlugin.html

export function Xeokit_v1({model}) {
    const canvasRef = useRef(null);
    const navCubeRef = useRef(null);
    const treeViewRef = useRef(null);

    useEffect(() => {
        const viewer = new Viewer({
            canvasId: "xeokit_canvas",
            transparent: true,
            dtxEnabled: true,
            pbrEnabled: true,
        });

        viewer.camera.eye = [-3.933, 2.855, 27.018];
        viewer.camera.look = [4.400, 3.724, 8.899];
        viewer.camera.up = [-0.018, 0.999, 0.039];

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

        xktLoader.load({
            id: "myModel",
            src: "http://localhost:5000/get_xkt/" + model,
            saoEnabled: true,
            edges: true,
            dtxEnabled: true,
            pbrEnabled: true,
        });
    }, []);

    return (
        <>
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
