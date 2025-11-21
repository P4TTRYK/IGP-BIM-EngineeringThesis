import {useState} from "react";
import {Link} from "react-router";
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';
import styles from './Project_card.module.css';

export const ProjectCard = ({project}) => {
    const [imgError, setImgError] = useState(false);

    const {
        id,
        name = null,
        description = null,
        created_at = null,
        updated_at = null
    } = project;

    return (
        <Link
            to={`project/${id}`}
            className={styles.card}
        >
            <h2 className={styles.name}>{name}</h2>

            {/*https://stackoverflow.com/questions/7995080/html-if-image-is-not-found*/}
            <div className={styles.thumbnail}>
                {!imgError && <img
                    src={`http://127.0.0.1:5000/projects/${id}/thumbnail`}
                    onError={() => setImgError(true)}
                    alt={`${name} thumbnail`}
                />}
                {imgError && <ImageNotSupportedIcon className={styles["no-thumbnail"]} aria-label="No thumbnail"/>}
            </div>

            <p className={styles.description}>
                {description}
            </p>
            <p className={styles.dates}>
                Utworzono: {created_at}<br/>
                Zmieniono: {updated_at}
            </p>
        </Link>
    );
}
