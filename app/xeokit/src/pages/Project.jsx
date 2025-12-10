import {useRef} from "react";
import {Link, useParams} from "react-router";
import {Xeokit} from "../components/Xeokit.jsx";
import UI_menu from "../components/UI_menu.jsx";
import {useProjectListQuery, useProjectModelQuery, useProjectSurveyQuery} from "../services/api.js";
import styles from "./Project.module.css";
import xeokit_styles from "../components/Xeokit.module.css";
import {Icon} from "../components/Icon.jsx";
import {ProjectMapLocation} from "../components/ProjectMapLocation.jsx";
import {ProjectLocationWeather} from "../components/ProjectLocationWeather.jsx";

export const Project = () => {
    const {projectId} = useParams();
    const treeViewRef = useRef(null);
    const {data: model, isFetching: fetchingModel, error: errorModel} = useProjectModelQuery(projectId);
    const {data: surveyData, isFetching: fetchingSurveyData, error: errorSurveyData} = useProjectSurveyQuery(projectId);
    const {data: projectsList} = useProjectListQuery();

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
                        survey={surveyData}
                        project={projectId}
                        treeViewRef={treeViewRef}
                    />}
            </div>
        </div>
    );
}
