import {useEffect, useRef, useState} from "react";
import {Link, useParams} from "react-router";
import {Xeokit} from "../components/Xeokit.jsx";
import UI_menu from "../components/UI_menu.jsx";
import {useProjectListQuery, useProjectModelQuery, useProjectSurveyQuery} from "../services/api.js";
import styles from "./Project.module.css";
import MenuTile from "../components/MenuTile.jsx";
import {Icon} from "../components/Icon.jsx";
import xeokit_styles from "../components/Xeokit.module.css";
import {ProjectMapLocation} from "../components/ProjectMapLocation.jsx";
import {ProjectLocationWeather} from "../components/ProjectLocationWeather.jsx";
import {ElementSurvey} from "../components/ElementSurvey.jsx";

const Tool = {
    NONE: 'none',
    MEASUREMENT: 'enabled',
    ANGLE_MEASUREMENT: 'angle_measurement',
    SECTION_PLANE: 'section_plane',
}

export const Project = () => {
    const {projectId} = useParams();
    const treeViewRef = useRef(null);
    const {data: model, isFetching: fetchingModel, error: errorModel} = useProjectModelQuery(projectId);
    const {data: surveyData, isFetching: fetchingSurveyData, error: errorSurveyData} = useProjectSurveyQuery(projectId);
    const {data: projectsList} = useProjectListQuery();

    const [selectedTool, setSelectedTool] = useState(Tool.NONE);
    const [picked, setPicked] = useState(null);
    const [localSurveyData, setLocalSurveyData] = useState([]);
    const [newSurveyData, setNewSurveyData] = useState([]);

    useEffect(() => {
        setLocalSurveyData(surveyData || []);
    }, [surveyData]);

    const handleToolToggle = (tool) => {
        setSelectedTool((prevTool) => (prevTool === tool ? Tool.NONE : tool));
    }

    const handleUpdateSurvey = (newSurvey) => {
        setLocalSurveyData((prev) => {
            const next = prev.filter((s) => s.guid !== newSurvey.guid);
            next.push(newSurvey);
            return next;
        });

        setNewSurveyData(newSurvey);
    };

    let projectInfo = {};
    if (projectsList && projectsList.length > 0) {
        const foundProject = projectsList.find(proj => proj.id.toString() === projectId);
        if (foundProject) {
            projectInfo = foundProject;
        }
    }

    const projectLocation = JSON.parse(projectInfo.location ?? "[0,0]");

    return (
        <div className={styles.projectContainer}>
            <nav className={styles['top-bar']}>
                <Link to={"/"}>
                    <button className={styles['back-button']}><Icon.left_arrow/> Lista projektów</button>
                </Link>
                <h3 title={projectInfo.guid}>Projekt: {projectInfo.name ?? '...'}</h3>
                <UI_menu>
                    <div
                        id="tree_view_container"
                        ref={treeViewRef}
                        className={xeokit_styles['tree-view-container']}
                    ></div>
                </UI_menu>
            </nav>

            <div className={styles['project-info']}>
                {(projectLocation[0] !== 0 || projectLocation[1] !== 0) ? (
                    <>
                        <div className={styles['map-location']}>
                            <ProjectMapLocation
                                location={[projectLocation[1], projectLocation[0]]}
                            />
                        </div>

                        <ProjectLocationWeather project={projectId}/>
                    </>
                ) : (<span>Brak informacji o lokalizacji</span>)}
            </div>

            <UI_menu>
                <MenuTile
                    icon={<Icon.distance_measurement/>}
                    onClick={() => handleToolToggle(Tool.MEASUREMENT)}
                    enabled={selectedTool === Tool.MEASUREMENT}
                />
                <MenuTile
                    icon={<Icon.angle_measurement/>}
                    onClick={() => handleToolToggle(Tool.ANGLE_MEASUREMENT)}
                    enabled={selectedTool === Tool.ANGLE_MEASUREMENT}
                />
                <MenuTile
                    icon={<Icon.content_cut/>}
                    onClick={() => handleToolToggle(Tool.SECTION_PLANE)}
                    enabled={selectedTool === Tool.SECTION_PLANE}
                />
            </UI_menu>

            <div className={styles['xeokit-container']}>
                <pre>
                    {fetchingModel && <div>Ładowanie modelu...</div>}
                    {fetchingSurveyData && <div>Ładowanie zmian...</div>}

                    {errorModel && <div className={styles['error-text']}>Wystąpił błąd: {errorModel.status}</div>}
                    {errorSurveyData &&
                        <div className={styles['error-text']}>Wystąpił błąd: {errorSurveyData.status}</div>
                    }
                </pre>

                {(!fetchingModel && !errorModel && model) && (!fetchingSurveyData && !errorSurveyData && surveyData) &&
                    <Xeokit
                        model={model}
                        survey={localSurveyData}
                        project={projectId}
                        treeViewRef={treeViewRef}
                        measurement={selectedTool === Tool.MEASUREMENT}
                        angleMeasurement={selectedTool === Tool.ANGLE_MEASUREMENT}
                        sectionPlane={selectedTool === Tool.SECTION_PLANE}
                        onPicked={setPicked}
                        newSurvey={newSurveyData}
                    />}
            </div>
        </div>
    );
}
