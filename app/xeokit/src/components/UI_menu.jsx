import {useState} from "react";
import styles from "./UI_menu.module.css";

export default function UI_menu() {
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

            {isOpen && <div className={styles.panel}/>}
        </div>
    );
}