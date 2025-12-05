import {useEffect, useRef, useState} from "react";
import {AnnotationsPlugin, NavCubePlugin, TreeViewPlugin, Viewer, XKTLoaderPlugin} from "@xeokit/xeokit-sdk";
import styles from "./Xeokit.module.css";
import {ElementSurvey} from "./ElementSurvey.jsx";

// https://xeokit.io/sdk-v2/api-doc/xeokit-sdk/
// https://xeokit.github.io/xeokit-sdk/docs/class/src/plugins/NavCubePlugin/NavCubePlugin.js~NavCubePlugin.html

export function Xeokit({model, survey, project, treeViewRef}) {
    const canvasRef = useRef(null);
    const navCubeRef = useRef(null);
    const markersRef = useRef(null);
    const [picked, setPicked] = useState(null);
    const [surveyData, setSurveyData] = useState(survey || []);

    const viewerRef = useRef(null);
    const sceneModelRef = useRef(null);
    const annotationsRef = useRef(null);

    useEffect(() => {
        setSurveyData(survey || []);
    }, [survey]);

    const handlePick = (metaObject) => {
        if (!metaObject) {
            setPicked(null);
            return;
        }
        setPicked({
            project,
            id: metaObject.id,
            type: metaObject.type,
            name: metaObject.name,
            psets: metaObject.propertySets
        });
    };

    const createAnnotationForSurvey = (surveyItem) => {
        if (!sceneModelRef.current || !viewerRef.current || !annotationsRef.current) return;

        const guid = surveyItem.guid ?? null;
        if (!guid || !sceneModelRef.current.objects[guid]) return;

        const annotationId = `a_${guid}`;

        const center = getCenter(sceneModelRef.current.objects[guid].aabb);

        if (annotationsRef.current.annotations[annotationId]) {
            annotationsRef.current.destroyAnnotation(annotationId);
        }

        annotationsRef.current.createAnnotation({
            id: annotationId,
            entity: viewerRef.current.scene.objects[guid],
            worldPos: center,
            occludable: false,
            markerShown: true,
            values: {
                glyph: guid.slice(0, 2).toUpperCase(),
                markerBGColor: "#180a1e",
            }
        });
    };

    const handleUpdateSurvey = (newSurvey) => {
        setSurveyData((prev) => {
            const next = prev.filter((s) => s.guid !== newSurvey.guid);
            next.push(newSurvey);
            return next;
        });

        createAnnotationForSurvey(newSurvey);
    };

    // https://github.com/xeokit/xeokit-sdk/pull/1347
    // https://xeokit.github.io/xeokit-sdk/examples/cad/#OBJ_SportsCar_ExplodeModel
    function getCenter(aabb) {
        return [
            (aabb[0] + aabb[3]) / 2,
            (aabb[1] + aabb[4]) / 2,
            (aabb[2] + aabb[5]) / 2,
        ];
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
        viewerRef.current = viewer;

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
            id: `model-${project}`,
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
        sceneModelRef.current = sceneModel;

        // https://github.com/xeokit/xeokit-sdk/blob/master/examples/annotations/annotations_clickShowLabels.html
        const annotations = new AnnotationsPlugin(viewer, {
            markerHTML: "<div class='annotation-marker' style='background-color: {{markerBGColor}};'>{{glyph}}</div>",
            values: {
                markerBGColor: "red",
                glyph: "",
            },
            container: markersRef.current
        });
        annotationsRef.current = annotations;

        sceneModel.on("loaded", () => {
            // https://github.com/xeokit/xeokit-sdk/blob/master/examples/navigation/camera_fitToModel.html
            viewer.cameraFlight.flyTo(sceneModel);

            surveyData.forEach((change) => {
                createAnnotationForSurvey(change);
            });
        });

        // Elements picking
        // https://github.com/xeokit/xeokit-sdk/blob/master/examples/picking/hover_entity.html
        // https://github.com/xeokit/xeokit-sdk/blob/master/examples/picking/doubleClick_entity.html
        let lastEntity = null;
        const handlePicked = (pickResult) => {
            if (lastEntity) {
                lastEntity.highlighted = false;
            }

            if (!pickResult || !pickResult.entity) {
                lastEntity = null;
                handlePick(null);
                return;
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
            viewer.scene.clear();
            navCube.destroy();
            treeView.destroy();
            viewer.destroy();
            viewerRef.current = null;
            sceneModelRef.current = null;
            annotationsRef.current = null;
            setPicked(null);
        };
    }, [model, project]);

    return (
        <div className={styles['xeokit-container']}>
            <div
                ref={markersRef}
                id="annotationMarkersContainer"
            ></div>
            <div className={styles['element-info']}>
                {picked ? <>{picked.name} ({picked.type}) / {picked.id}</> : "..."}
            </div>
            {picked && <ElementSurvey element={picked} surveyData={surveyData} onUpdateSurvey={handleUpdateSurvey}/>}
            <canvas
                id="xeokit_canvas"
                ref={canvasRef}
                className={styles['xeokit-canvas']}
            />
            <canvas
                id="nav_cube_canvas"
                ref={navCubeRef}
                className={`${styles['nav-cube-canvas']} ${picked ? styles['picked-element'] : ''}`}
            />
        </div>
    );
}
