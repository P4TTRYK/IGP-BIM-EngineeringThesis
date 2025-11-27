import {useState} from "react";
import {Link} from "react-router";
import styles from './Project_card.module.css';
import {convertGMTToLocal, formatDateTime, textRelativeTime} from "../utils/timeManipulation.js";
import {Icon} from "./Icon.jsx";

export const ProjectCard = ({project, style = {}}) => {
    const [imgError, setImgError] = useState(false);

    const {
        id,
        name = null,
        description = null,
        created_at = null,
        updated_at = null
    } = project;

    const updatedAtLocal = convertGMTToLocal(updated_at);
    const createdAtLocal = convertGMTToLocal(created_at);

    return (
        <Link
            to={`project/${id}`}
            className={styles.card}
            style={style}
        >
            <h2 className={styles.name}>{name}</h2>

            {/*https://stackoverflow.com/questions/7995080/html-if-image-is-not-found*/}
            <div className={styles.thumbnail}>
                {!imgError && <img
                    src={`${import.meta.env.VITE_API_SERVER}/projects/${id}/thumbnail`}
                    onError={() => setImgError(true)}
                    alt={`${name} thumbnail`}
                />}
                {imgError && <Icon.no_image className={styles["no-thumbnail"]} aria-label="No thumbnail"/>}
            </div>

            <p className={styles.description}>
                {description}
            </p>
            <p className={styles.dates}>
                <span data-title={formatDateTime(updatedAtLocal)}>
                    Zmieniono: {textRelativeTime(updatedAtLocal)}
                </span>
                <br/>
                <span data-title={formatDateTime(createdAtLocal)}>
                    Utworzono: {textRelativeTime(createdAtLocal)}
                </span>
            </p>
        </Link>
    );
}
