import {UploadFile} from "./UploadFile.jsx";
import styles from "./UploadSurveyPhoto.module.css";
import ifc_styles from "./UploadIfcFile.module.css";
import {ProgressBar} from "./ProgressBar.jsx";
import {useState} from "react";

export const UploadSurveyPhoto = ({project, survey}) => {
    const [file, setFile] = useState(null)
    const [previewUrl, setPreviewUrl] = useState(null)

    const [uploadProgress, setUploadProgress] = useState(null);
    const [uploadMessage, setUploadMessage] = useState('...');
    const [uploadError, setUploadError] = useState(false);

    const handleFileChange = (file) => {
        setFile(file)

        if (file && file.type.startsWith("image/")) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        } else {
            setPreviewUrl(null);
        }
    }

    const handleUpload = () => {
        if (!file) return;

        const formData = new FormData()
        formData.append('file', file);

        setUploadError(false);
        setUploadProgress(0);

        const xhr = new XMLHttpRequest();

        xhr.open("POST", `${import.meta.env.VITE_API_SERVER}/project/${project}/survey/${survey}/image`);

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
                setPreviewUrl(null);

                // TODO: update project survey photos list
                // const image_name = JSON.parse(xhr.response);

                setUploadMessage("Przesłano");
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

    return (
        <div className={styles.container}>
            <UploadFile
                inputProps={{
                    type: 'file',
                    accept: 'image/*',
                    capture: true,
                }}
                file={file}
                fileRegex={/\.(png|jpe?g|webp)$/i}
                setFile={handleFileChange}
                className={styles['upload-container']}
            />

            {previewUrl && (
                <div className={styles['preview-container']}>
                    <img
                        src={previewUrl}
                        alt={file?.name || 'Podgląd zdjęcia'}
                        className={styles['preview-image']}
                    />
                </div>
            )}

            {uploadError ? <span className={ifc_styles['error-text']}>Błąd wysyłania pliku</span> : uploadMessage}
            <ProgressBar progress={uploadProgress} error={uploadError}/>

            <button
                onClick={handleUpload}
                disabled={!file || uploadProgress > 0}
                className={ifc_styles['upload-button']}
            >
                Prześlij{!file ? ` (najpierw dodaj plik)` : ''}
            </button>
        </div>
    );
}
