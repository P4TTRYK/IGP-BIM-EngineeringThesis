import styles from './ProgressBar.module.css';

export const ProgressBar = ({progress = 0, error = false}) => {
    const clampedProgress = Math.min(100, Math.max(0, progress));
    let procent = clampedProgress.toFixed(2);

    if (error) procent = 100;

    return (
        <>
            <div className={styles["progress"]}>
                <div
                    className={`${styles["progress-bar"]} ${error ? styles["progress-bar-error"] : ''}`}
                    style={{width: `${procent}%`}}
                    aria-valuenow={procent}
                    aria-valuemin="0"
                    aria-valuemax="100"
                    role="progressbar"
                ></div>
            </div>
        </>
    )
}
