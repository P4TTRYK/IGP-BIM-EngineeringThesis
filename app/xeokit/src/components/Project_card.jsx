import { Link } from "react-router";
import styles from './Project_card.module.css';

//https://flowbite-react.com/docs/components/card
export const ProjectCard = ({ project }) => {
    return (
        <div className={styles.card}>
            <div className={styles.cardContent}>
                <h2 className={styles.projectName}>{project.name}</h2>

                <p className={styles.projectDescription}>
                    {project.description}
                </p>
                <p className={styles.projectDates}>
                    {project.created_at} - {project.updated_at}
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