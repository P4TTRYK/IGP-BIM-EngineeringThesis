import styles from "./MenuTile.module.css";

export default function MenuTile({children, icon, label, enabled, onClick}) {
    return (
        <button className={`${styles.tile} ${enabled ? styles.enabled : ''}`} onClick={onClick}>
            {children}
            {icon}
            {label}
        </button>
    );
}
