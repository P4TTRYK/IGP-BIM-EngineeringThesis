import styles from './UploadFile.module.css';
import {fileSizeFormat} from "../utils/fileSizeFormat.js";
import {useEffect, useRef, useState} from "react";

export const UploadFile = (
    {
        inputProps = {
            type: 'file',
            accept: '*',
            capture: false,
        },
        children = null,
        className = '',
        file = null,
        fileRegex = /.*/,
        setFile = (file) => {
        },
    }) => {
    const dropZone = useRef(null)
    const [dragStyle, setDragStyle] = useState(false);

    // https://stackoverflow.com/questions/32896624/react-js-best-practice-regarding-listening-to-window-events-from-components
    useEffect(() => {
        // Prevent default browser behavior for file drag and drop outside drop zone
        const onDrop = (e) => {
            if ([...e.dataTransfer.items].some((item) => item.kind === "file")) {
                e.preventDefault();
            }
        }

        // Handle dragover to provide visual feedback only when dragging files
        const dragover = (e) => {
            const fileItems = [...e.dataTransfer.items].filter(
                (item) => item.kind === "file",
            );
            if (fileItems.length > 0) {
                e.preventDefault();

                // Only allow drop effect when over the drop zone
                if (!dropZone.current.contains(e.target)) {
                    e.dataTransfer.dropEffect = "none";
                }
            }
        }

        window.addEventListener("drop", onDrop);
        window.addEventListener("dragover", dragover);

        return () => {
            window.removeEventListener('drop', onDrop);
            window.removeEventListener("dragover", dragover);
        }
    }, []);

    const handleFileDragover = (e) => {
        const fileItems = [...e.dataTransfer.items].filter(
            (item) => item.kind === "file",
        );
        if (fileItems.length > 0) {
            e.preventDefault();
            e.dataTransfer.dropEffect = "copy";
            setDragStyle(true);
        }
    }

    const handleFileDragleave = () => {
        setDragStyle(false);
    }

    const handleFileDrop = (e) => {
        e.preventDefault();
        setDragStyle(false);

        const droppedFiles = [...e.dataTransfer.files];

        if (droppedFiles.length > 0 && droppedFiles[0].name.match(fileRegex)) {
            setFile(droppedFiles[0]);
        }
    }

    const handleFileChange = (e) => {
        setFile(e.target.files[0])
    }


    // https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/File_drag_and_drop
    return (
        <div className={`${styles['upload-container']} ${className}`}>
            <label
                className={`${styles['drop-zone']} ${dragStyle ? styles['drag-over'] : ''}`}
                onChange={handleFileChange}
                onDragOver={handleFileDragover}
                onDragLeave={handleFileDragleave}
                onDrop={handleFileDrop}
                ref={dropZone}
            >
                Upuść lub kliknij, aby wybrać plik
                {file && <p>Wybrano plik<br/><b>{file.name}</b> ({fileSizeFormat(file.size)})</p>}
                <input
                    type={inputProps.type}
                    accept={inputProps.accept}
                    capture={inputProps.capture}
                    className={styles['file-input']}
                />
            </label>
            {children}
        </div>
    );
}
