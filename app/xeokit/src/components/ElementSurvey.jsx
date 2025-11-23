import React from 'react';
import styles from './ElementSurvey.module.css';
import {UploadFile} from "./UploadFile.jsx";
import {useUpdateSurveyMutation} from "../services/api.js";

export const ElementSurvey = ({element, surveyData, onUpdateSurvey}) => {
    const [updateSurvey, {
        isFetching: isUpdatingSurveyData,
        error: errorUpdatingSurvey,
        isSuccess: isUpdatingSurveySuccess
    }] = useUpdateSurveyMutation();

    const elementSurveyData = surveyData?.find((survey) => survey.guid === element.id);
    const elementMetadata = elementSurveyData ? JSON.parse(elementSurveyData.metadata) : null;

    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);

        const metadata = JSON.stringify({
            kodyUszkodzen: form.get('uszkodzenia'),
            ocenaStanu: form.get('stan'),
            czyEkspertyza: form.get('czyEksptertyza'),
            trybEkspertyza: form.get('trybEkspertyza')
        });

        const surveyFormData = new FormData();
        surveyFormData.append('guid', element.id);
        surveyFormData.append('metadata', metadata);

        onUpdateSurvey({
            guid: element.id,
            metadata,
            updated_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
        });

        await updateSurvey({project: element.project, formSurveyData: surveyFormData});
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit}>
                <h3>Ocena stanu technicznego</h3>
                <h4>Kody uszkodzeń</h4>
                <textarea
                    name="uszkodzenia"
                    className={styles.uszkodzenia}
                    defaultValue={elementMetadata?.kodyUszkodzen || ''}
                />

                <h4>Ocena stanu</h4>
                <div className={styles.selector}>
                    {
                        ['0', '1', '2', '3', '4', '5'].map((val, idx) =>
                            <React.Fragment key={idx}>
                                <input
                                    type="radio"
                                    name="stan"
                                    value={val}
                                    id={`stan-${idx}`}
                                    defaultChecked={elementMetadata?.ocenaStanu === val}
                                />
                                <label htmlFor={`stan-${idx}`}> {val} </label>
                            </React.Fragment>
                        )
                    }
                </div>

                <h4>Potrzeba wykonania ekspertyzy</h4>
                <div className={styles.selector}>
                    <input
                        type="radio"
                        name="czyEksptertyza"
                        value="TAK"
                        id={`czyEksptertyza-tak`}
                        defaultChecked={elementMetadata?.czyEkspertyza === 'TAK'}
                    />
                    <label htmlFor={`czyEksptertyza-tak`}> Tak </label>

                    <input
                        type="radio"
                        name="czyEksptertyza"
                        value="NIE"
                        id={`czyEksptertyza-nie`}
                        defaultChecked={elementMetadata?.czyEkspertyza === 'NIE'}
                    />
                    <label htmlFor={`czyEksptertyza-nie`}> Nie </label>
                </div>

                <h4>Tryb wykonania ekspertyzy</h4>
                <div className={styles.selector}>
                    {
                        ['A', '1', '2', '3'].map((val, idx) =>
                            <React.Fragment key={idx}>
                                <input
                                    type="radio"
                                    name="trybEkspertyza"
                                    value={val}
                                    id={`trybEkspertyza-${idx}`}
                                    defaultChecked={elementMetadata?.trybEkspertyza === val}
                                />
                                <label htmlFor={`trybEkspertyza-${idx}`}> {val} </label>
                            </React.Fragment>
                        )
                    }
                </div>

                <button type="submit">Zapisz</button>

                {isUpdatingSurveyData && <p>Wysyłanie...</p>}
                {errorUpdatingSurvey && <p>Wystąpił błąd: {errorUpdatingSurvey.status}</p>}
                {isUpdatingSurveySuccess && <p>Dane zostały zapisane</p>}
            </form>

            <hr/>

            <h4>Zdjęcia</h4>
            <UploadFile/>
        </div>
    );
}
