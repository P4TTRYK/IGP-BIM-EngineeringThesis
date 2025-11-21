import {UploadFile} from "../components/UploadFile.jsx";
import {ProjectCard} from "../components/Project_card.jsx";
import {useProjectListQuery} from "../services/api.js";
import styles from './ProjectsList.module.css';

export const ProjectsList = () => {
    const {data, isFetching, error} = useProjectListQuery();
    return (
        <div className={styles['projects-list-page']}>
            <h1>Lista projektów</h1>
            <div className={styles['project-list']}>
                {isFetching && <h3>Ładowanie projektów...</h3>}
                {error && <h3 className={styles['error-text']}>Wystąpił błąd: {error.status}</h3>}
                {!isFetching && !error && (
                    (!data || data.length === 0)
                        ? <h3>Brak projektów</h3>
                        : data.map((project, idx) =>
                            <ProjectCard
                                key={idx}
                                project={project}
                                style={{animationDelay: `${idx * 50}ms`}}
                            />
                        )
                )}
            </div>

            <h2>Utwórz nowy projekt przesyłając plik IFC</h2>
            <UploadFile/>
        </div>
    )
}
