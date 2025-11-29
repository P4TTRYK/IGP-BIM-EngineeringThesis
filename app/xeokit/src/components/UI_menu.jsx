import {useState} from "react";
import styles from "./UI_menu.module.css";

export default function UI_menu({children}) {
    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = () => {
        setIsOpen((prev) => !prev);
    };

    return (
        <>
            <button
                type="button"
                aria-expanded={isOpen}
                className={`${styles['toggle-button']} ${isOpen ? styles.open : ""}`}
                onClick={handleToggle}
            >
                <span></span>
                <span></span>
                <span></span>
            </button>
            <div className={`${styles.panel} ${isOpen ? "" : styles.hidden}`}>
                {children}
            </div>
        </>
    );
}
