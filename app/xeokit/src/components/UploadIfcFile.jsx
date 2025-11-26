import {useState} from "react";
import {Link} from "react-router";
import {UploadFile} from "./UploadFile.jsx";
import styles from "./UploadIfcFile.module.css";
import {ProgressBar} from "./ProgressBar.jsx";

export const UploadIfcFile = ({onUpload}) => {
    const [file, setFile] = useState(null)

    const [uploadProgress, setUploadProgress] = useState(null);
    const [uploadMessage, setUploadMessage] = useState('...');
    const [uploadError, setUploadError] = useState(false);

    const handleFileChange = (file) => {
        setFile(file)
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

                onUpload();

                setUploadMessage(
                    <>
                        <span>
                            Stworzono projekt
                            {projectName && <b> {projectName}</b>}
                        </span>
                        {projectId && <Link to={`/project/${projectId}`}>Przejdź do projektu</Link>}
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
            setUploadProgress(0);
            setUploadError(true);
        });

        xhr.send(formData);
    }

    // https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/File_drag_and_drop
    return (
        <UploadFile
            inputProps={{
                type: 'file',
                accept: '.ifc',
            }}
            file={file}
            setFile={handleFileChange}
        >
            {uploadError ? <span className={styles['error-text']}>Błąd wysyłania pliku</span> : uploadMessage}
            <ProgressBar progress={uploadProgress} error={uploadError}/>

            <button
                onClick={handleUpload}
                disabled={!file || uploadProgress > 0}
                className={styles['upload-button']}
            >
                Utwórz projekt{!file ? ` (najpierw dodaj plik)` : ''}
            </button>
        </UploadFile>
    );
}
