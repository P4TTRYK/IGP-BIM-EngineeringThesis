import {useEffect, useRef, useState} from "react";
import styles from "./UploadFile.module.css";
import {fileSizeFormat} from "../utils/fileSizeFormat.js";
import {ProgressBar} from "./ProgressBar.jsx";
import {Link} from "react-router";

// TODO: make component more generic for photo upload.
export const UploadFile = () => {
    const [file, setFile] = useState(null)
    const [dragStyle, setDragStyle] = useState(false);
    const dropZone = useRef(null)

    const [uploadProgress, setUploadProgress] = useState(null);
    const [uploadMessage, setUploadMessage] = useState(null);
    const [uploadError, setUploadError] = useState(false);

    const handleFileDragover = (e) => {
        const fileItems = [...e.dataTransfer.items].filter(
            (item) => item.kind === "file",
        );
        if (fileItems.length > 0) {
            e.preventDefault();
            if (fileItems.some((item) => item.type.startsWith("application/p21"))) {
                e.dataTransfer.dropEffect = "copy";
                setDragStyle(true);
            } else {
                e.dataTransfer.dropEffect = "none";
                setDragStyle(false);
            }
        }
    }

    const handleFileDragleave = () => {
        setDragStyle(false);
    }

    const handleFileDrop = (e) => {
        e.preventDefault();
        setDragStyle(false);

        const droppedFiles = [...e.dataTransfer.files];
        if (droppedFiles.length > 0) {
            setFile(droppedFiles[0]);
        }
    }

    const handleFileChange = (e) => {
        setFile(e.target.files[0])
    }

    const handleUpload = () => {
        if (!file) return;

        // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest_API
        const formData = new FormData()
        formData.append('file', file);

        setUploadError(false);
        setUploadProgress(0);

        const xhr = new XMLHttpRequest();

        xhr.open("POST", "http://127.0.0.1:5000/upload_ifc");

        xhr.upload.addEventListener("progress", (e) => {
            if (e.lengthComputable) {
                const percentComplete = (e.loaded / e.total) * 100;
                setUploadProgress(percentComplete);

                if (percentComplete === 100) {
                    setUploadMessage('Przetwarzanie...');
                } else {
                    setUploadMessage(`Wysyłanie... ${Math.round(percentComplete)}%`);
                }
            }
        });

        xhr.addEventListener("load", () => {
            setUploadProgress(0);
            if (xhr.status >= 200 && xhr.status < 300) {

                setFile(null);

                const {id: projectId = null, name: projectName = null} = JSON.parse(xhr.response);

                setUploadMessage(
                    <>
                        Zakończono!
                        {projectName && <><br/>Stworzono projekt <b>{projectName}</b></>}
                        {projectId && <><br/><Link to={`/project/${projectId}`}>Przejdź do projektu</Link></>}
                    </>
                );
            } else {
                try {
                    const response = JSON.parse(xhr.responseText);
                    setUploadMessage(response.status || 'Błąd');
                    console.log(response.status);
                } catch (error) {
                    console.log(error);
                }
                setUploadError(true);
            }
        });

        xhr.addEventListener('error', (e) => {
            console.log(e);
            setUploadProgress(null);
            setUploadError(true);
        });

        xhr.send(formData);
    }

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

    // https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/File_drag_and_drop
    return (
        <div className={styles['upload-container']}>
            <label
                className={`${styles['drop-zone']} ${dragStyle ? styles['drag-over'] : ''}`}
                onChange={handleFileChange}
                onDragOver={handleFileDragover}
                onDragLeave={handleFileDragleave}
                onDrop={handleFileDrop}
                ref={dropZone}
            >
                Upuść lub kliknij, aby wybrać plik IFC
                {file && <p>Wybrano plik<br/><b>{file.name}</b> ({fileSizeFormat(file.size)})</p>}
                <input
                    type="file"
                    accept=".ifc"
                    className={styles['file-input']}
                />
            </label>

            {uploadProgress !== null &&
                <>
                    {uploadError ? <span className={styles['error-text']}>Błąd wysyłania pliku</span> : uploadMessage}
                    <ProgressBar progress={uploadProgress} error={uploadError}/>
                </>
            }

            <button
                onClick={handleUpload}
                disabled={!file || uploadProgress > 0}
                className={styles['upload-button']}
            >
                Utwórz projekt{!file ? ` (najpierw dodaj plik)` : ''}
            </button>
        </div>
    );
}
