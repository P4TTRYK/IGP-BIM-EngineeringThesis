import {useState} from "react";
import styles from "./UI_menu.module.css";

export default function UI_menu({children}) {
    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = () => {
        setIsOpen((prev) => !prev);
    };

    return (
        <div className={styles.menuWrapper}>
            <button
                type="button"
                aria-expanded={isOpen}
                className={`${styles.toggleButton} ${isOpen ? styles.open : ""}`}
                onClick={handleToggle}
            >
                <span className={styles.iconStripe}/>
                <span className={styles.iconStripe}/>
                <span className={styles.iconStripe}/>
            </button>
            <div className={`${styles.panel} ${isOpen ? "" : styles.hidden}`}>{children}</div>
        </div>
    );
}