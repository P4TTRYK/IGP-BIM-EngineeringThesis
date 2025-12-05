import styles from "./MenuTile.module.css";

export default function MenuTile({children,icon: IconSVG, label, onClick }) {
    return (
        <button className={styles.tile} onClick={onClick}>
            {children}
            <div className={styles.iconBox}>
                {IconSVG && <IconSVG />}
            </div>
            <span className={styles.label}>{label}</span>
        </button>
    );
}
