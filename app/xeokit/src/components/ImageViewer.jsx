import styles from './ImageViewer.module.css';
import {Icon} from "./Icon.jsx";

export const ImageViewer = ({visible, imageLink, onHide}) => {
    return (
        <>
            <div
                className={`${styles.background} ${visible ? styles.visible : ''}`}
                onClick={onHide}
            >
                {visible &&
                    <img
                        className={styles.image}
                        onClick={e => e.stopPropagation()}
                        src={imageLink} alt="Image"
                    />
                }

                <div className={styles.close}>
                    <Icon.close/>
                </div>
            </div>
        </>
    )
}
