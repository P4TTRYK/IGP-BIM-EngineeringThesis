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

    const [selectedPanel, setSelectedPanel] = useState("info");

    useEffect(() => {
        setLocalSurveyData(surveyData || []);
    }, [surveyData]);

    useEffect(() => {
        if (picked) {
            setSelectedPanel("survey");
        } else {
            if (selectedPanel === "survey") setSelectedPanel("info");
        }
    }, [picked]);

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

    const handlePanelChange = (e) => {
        setSelectedPanel(e.target.value);
    }

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

            <section className={styles.panel}>
                <div
                    className={styles['panel-header']}
                >
                    <input
                        type="radio"
                        name="panelView"
                        value="info"
                        id="panel-info"
                        checked={selectedPanel === "info"}
                        onChange={handlePanelChange}
                    />
                    <label htmlFor="panel-info">Info</label>

                    <input
                        type="radio"
                        name="panelView"
                        value="tree"
                        id="panel-tree"
                        checked={selectedPanel === "tree"}
                        onChange={handlePanelChange}
                    />
                    <label htmlFor="panel-tree">Tree</label>

                    {picked &&
                        <>
                            <input
                                type="radio"
                                name="panelView"
                                value="survey"
                                id="panel-survey"
                                checked={selectedPanel === "survey"}
                                onChange={handlePanelChange}
                            />
                            <label htmlFor="panel-survey">Survey</label>
                        </>
                    }
                </div>

                <section
                    className={selectedPanel === "tree" ? styles['tree-panel-active'] : styles['tree-panel-hidden']}>
                    <div
                        id="tree_view_container"
                        ref={treeViewRef}
                        className={xeokit_styles['tree-view-container']}
                    ></div>
                </section>

                {selectedPanel === "info" &&
                    <section className={styles['project-details']}>
                        <h4>Informacje o projekcie</h4>
                        <p><strong>Nazwa:</strong> {projectInfo.name ?? '...'}</p>
                        <p><strong>GUID:</strong> {projectInfo.guid ?? '...'}</p>
                        <p><strong>ID:</strong> {projectInfo.id ?? '...'}</p>
                        <p><strong>Opis:</strong> {projectInfo.description ?? 'Brak opisu'}</p>

                        {picked && <div>
                            <hr/>
                            <h4>Informacje o elemencie</h4>
                            <p><strong>ID elementu:</strong> {picked.id}</p>
                            <p><strong>Nazwa elementu:</strong> {picked.name ?? 'Brak nazwy'}</p>
                            <p><strong>Typ elementu:</strong> {picked.type ?? 'Brak typu'}</p>
                            <p><strong>Ilość PSet:</strong> {picked.psets ? picked.psets.length : 0}</p>
                        </div>}
                    </section>
                }

                {picked && selectedPanel === "survey" &&
                    <section>
                        <ElementSurvey
                            element={picked}
                            surveyData={localSurveyData}
                            onUpdateSurvey={handleUpdateSurvey}
                        />
                    </section>
                }
            </section>

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
