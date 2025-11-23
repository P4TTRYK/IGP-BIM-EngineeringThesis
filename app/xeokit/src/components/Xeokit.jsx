import {useEffect, useRef, useState} from "react";
import {NavCubePlugin, TreeViewPlugin, Viewer, XKTLoaderPlugin} from "@xeokit/xeokit-sdk";
import styles from "./Xeokit.module.css";
import {ElementSurvey} from "./ElementSurvey.jsx";

// https://xeokit.io/sdk-v2/api-doc/xeokit-sdk/
// https://xeokit.github.io/xeokit-sdk/docs/class/src/plugins/NavCubePlugin/NavCubePlugin.js~NavCubePlugin.html

export function Xeokit({model, survey, project}) {
    const canvasRef = useRef(null);
    const navCubeRef = useRef(null);
    const treeViewRef = useRef(null);
    const [picked, setPicked] = useState(null);
    const [surveyData, setSurveyData] = useState(survey || []);

    const handlePick = (metaObject) => {
        if (!metaObject) {
            setPicked(null);
            return;
        }

        console.log(metaObject);

        const elementInfo = {
            project: project,
            id: metaObject.id,
            type: metaObject.type,
            name: metaObject.name,
            psets: metaObject.propertySets
        };
        setPicked(elementInfo);
    };

    const handleUpdateSurvey = (newSurvey) => {
        const updatedSurvey = survey.filter(s => s.guid !== newSurvey.guid);
        updatedSurvey.push(newSurvey);

        setSurveyData(updatedSurvey);
    }

    useEffect(() => {
        if (!model || !canvasRef.current || !navCubeRef.current || !treeViewRef.current) {
            return;
        }

        const viewer = new Viewer({
            canvasElement: canvasRef.current,
            transparent: true,
            dtxEnabled: true,
            pbrEnabled: true,
        });

        viewer.camera.eye = [-10, 10, 10];

        const navCube = new NavCubePlugin(viewer, {
            canvasElement: navCubeRef.current,
            cameraFlyDuration: 1,
            synchProjection: true,
            color: "#333333",
            hoverColor: "rgba(0,0.5,0,0.4)",
            textColor: "white",
        });

        const treeView = new TreeViewPlugin(viewer, {
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

                // Fly to selected object
                viewer.cameraFlight.flyTo({
                    aabb: pickResult.entity.aabb,
                    duration: 0.5
                });

                const metaObject = viewer.metaScene.metaObjects[pickResult.entity.id];
                handlePick(metaObject);
            } else {
                lastEntity = null;
                handlePick(null);
            }
        };

        viewer.cameraControl.on("picked", handlePicked);

        return () => {
            viewer.cameraControl.off("picked", handlePicked);
            viewer.scene.clear();
            viewer.destroy();
            navCube.destroy();
            treeView.destroy?.();
            setPicked(null);
        };
    }, [model, project]);

    return (
        <>
            <div
                className={styles.elementInfo}
            >
                {picked ? <>{picked.name} ({picked.type})</> : "..."}
            </div>
            {picked && <ElementSurvey element={picked} surveyData={surveyData} onUpdateSurvey={handleUpdateSurvey}/>}
            <canvas
                id="xeokit_canvas"
                ref={canvasRef}
                className={styles.xeokit_canvas}
            />
            <canvas
                id="myNavCubeCanvas"
                ref={navCubeRef}
                className={`${styles.myNavCubeCanvas} ${picked ? styles['picked-element'] : ''}`}
            />
            <div
                id="treeViewContainer"
                ref={treeViewRef}
                className={styles.treeViewContainer}
            ></div>
        </>
    );
}
