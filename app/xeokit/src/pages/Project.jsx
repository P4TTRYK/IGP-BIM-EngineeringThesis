import {Link, useParams} from "react-router";
import {Xeokit} from "../components/Xeokit.jsx";
import {useProjectListQuery, useProjectModelQuery} from "../services/api.js";
import styles from "./Project.module.css";
import {Icon} from "../components/Icon.jsx";

export const Project = () => {
    const {projectId} = useParams();
    const {data: model, isFetching: fetchingModel, error: errorModel} = useProjectModelQuery(projectId);
    const {data: projectsList} = useProjectListQuery();

    let projectInfo = {};
    if (projectsList && projectsList.length > 0) {
        const foundProject = projectsList.find(proj => proj.id.toString() === projectId);
        if (foundProject) {
            projectInfo = foundProject;
        }
    }

    return (
        <div className={styles.projectContainer}>
            <nav className={styles['top-bar']}>
                <Link to={"/"}>
                    <button className={styles['back-button']}><Icon.left_arrow/> Lista projektów</button>
                </Link>
                <h3 title={projectInfo.guid}>Projekt: {projectInfo.name ?? '...'}</h3>
            </nav>

            <div className={styles['xeokit-container']}>
                {fetchingModel && <div>Ładowanie modelu...</div>}
                {errorModel && <div className={styles['error-text']}>Wystąpił błąd: {errorModel.status}</div>}
                {!fetchingModel && !errorModel && model && <Xeokit model={model}/>}
            </div>
        </div>
    );
}
