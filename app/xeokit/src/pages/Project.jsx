import {Link, useParams} from "react-router";
import {Xeokit} from "../components/Xeokit.jsx";
import {useProjectListQuery, useProjectModelQuery} from "../services/api.js";
import styles from "./Project.module.css";

export const Project = () => {
    const {projectId} = useParams();
    const {data: model, isFetching: fetchingModel, error: errorModel} = useProjectModelQuery(projectId);
    const {data: projectsList} = useProjectListQuery();

    let projectInfo = {};
    if (projectsList && projectsList.length > 0) {
        projectInfo = projectsList.find(proj => proj.id.toString() === projectId);
    }

    return (
        <div className={styles.projectContainer}>
            <nav className={styles['top-bar']}>
                <Link to={"/"}>
                    <button className={styles['back-button']}>&lt; Lista projektów</button>
                </Link>
                <h3>Projekt: {projectInfo.name ?? '...'}</h3>
                <div className={styles['model-info']}>
                    <span>{projectInfo.guid ?? '...'}</span>
                    <span>{projectInfo.description ?? ''}</span>
                </div>
            </nav>

            <div className={styles['xeokit-container']}>
                {fetchingModel && <div>Ładowanie modelu...</div>}
                {errorModel && <div className={styles['error-text']}>Wystąpił błąd: {errorModel.status}</div>}
                {!fetchingModel && !errorModel && model && <Xeokit model={model}/>}
            </div>
        </div>
    );
}
