import styles from './SurveyPhotos.module.css'

export const SurveyPhotos = ({project, survey, photos}) => {
    const links = photos?.filter(photo => photo) || [];

    return (
        <div className={styles.photos}>
            {links && links.length > 0 ? (
                links.map((photo, index) => (
                    <div key={index} className={styles['photo-container']}>
                        <img
                            src={`${import.meta.env.VITE_API_SERVER}/project/${project}/survey/${survey}/image/${photo}`}
                            alt={`Survey Photo ${index + 1}`}
                            className={styles.photo}
                        />
                    </div>)
                )
            ) : (
                <p className={styles['no-photos']}>Brak zdjęć</p>
            )}
        </div>
    )
}
