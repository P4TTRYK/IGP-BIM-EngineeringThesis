import { Link } from "react-router";
import styles from './Project_card.module.css';

// TODO: Podłącz prawdziwe dane z API

export const ProjectCard = ({ project }) => {
    return (
        <div className={styles.card}>
            <div className={styles.cardContent}>
                <h2 className={styles.projectName}>{project.name}</h2>

                <p className={styles.projectDescription}>
                    {project.description}
                </p>

                <div className={styles.cardFooter}>
                    <Link to={`project/${project.id}`}>
                        <button className={styles.projectButton}>
                            Przejdź do projektu
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}