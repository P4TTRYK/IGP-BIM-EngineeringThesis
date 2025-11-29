import styles from './SurveyPhotos.module.css'
import {ImageViewer} from "./ImageViewer.jsx";
import {useState} from "react";

export const SurveyPhotos = ({project, survey, photos}) => {
    const links = photos?.filter(photo => photo) || [];

    const [photoLink, setPhotoLink] = useState(null);
    const [showViewer, setShowViewer] = useState(false);

    const hideViewerHandler = () => {
        setPhotoLink(null);
        setShowViewer(false);
    };

    const showViewerHandler = (link) => {
        setPhotoLink(link);
        setShowViewer(true);
    }

    return (
        <>
            <div className={styles.photos}>
                {links && links.length > 0 ? (
                    links.map((photo, index) => (
                        <div
                            key={index}
                            className={styles['photo-container']}
                            onClick={() => showViewerHandler(photo)}
                        >
                            <img
                                src={`${import.meta.env.VITE_API_SERVER}/project/${project}/survey/${survey}/image/${photo}/small`}
                                alt={`Survey Photo ${index + 1}`}
                                className={styles.photo}
                            />
                        </div>)
                    )
                ) : (
                    <p className={styles['no-photos']}>Brak zdjęć</p>
                )}
            </div>
            <ImageViewer
                visible={showViewer}
                imageLink={`${import.meta.env.VITE_API_SERVER}/project/${project}/survey/${survey}/image/${photoLink}`}
                onHide={hideViewerHandler}
            />
        </>
    )
}
