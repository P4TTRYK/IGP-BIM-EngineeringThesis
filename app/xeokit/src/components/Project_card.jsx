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
        updated_at = null,
        changes = null,
        photos = null,
    } = project;

    const updatedAtLocal = convertGMTToLocal(updated_at);
    const createdAtLocal = convertGMTToLocal(created_at);

    return (
        <div
            className={styles.card}
            style={style}
        >
            <h2 className={styles.name}>{name}</h2>

            {/*https://stackoverflow.com/questions/7995080/html-if-image-is-not-found*/}
            <Link
                to={`project/${id}`}
                className={styles.thumbnail}
            >
                {!imgError && <img
                    src={`${import.meta.env.VITE_API_SERVER}/project/${id}/image`}
                    onError={() => setImgError(true)}
                    alt={`${name} thumbnail`}
                />}
                {imgError && <Icon.no_image className={styles["no-thumbnail"]} aria-label="No thumbnail"/>}
            </Link>

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
                <br/>
                <span>
                    Zmian: {changes ?? 'N/A'} |
                    Zdjęć: {photos ?? 'N/A'}
                </span>
            </p>

            <div className={styles["download-project"]}>
                <Icon.download/>
                <a
                    data-title="Pobierz zmieniony model IFC"
                    href={`${import.meta.env.VITE_API_SERVER}/project/${id}/export`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <Icon.model/>
                </a>
                {photos ?
                    <a
                        data-title="Pobierz zdjęcia projektu"
                        href={`${import.meta.env.VITE_API_SERVER}/project/${id}/export_photos`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Icon.image/>
                    </a>
                    :
                    <a
                        data-title="Brak zdjęć"
                        className={styles['no-photo-link']}
                    >
                        <Icon.no_image/>
                    </a>
                }
            </div>
        </div>
    );
}
