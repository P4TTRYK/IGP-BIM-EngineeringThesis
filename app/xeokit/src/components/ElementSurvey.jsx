import React, {useEffect, useMemo, useState} from 'react';
import styles from './ElementSurvey.module.css';
import {UploadFile} from "./UploadFile.jsx";
import {useUpdateSurveyMutation} from "../services/api.js";

const emptyForm = {
    uszkodzenia: '',
    stan: '',
    czyEkspertyza: '',
    trybEkspertyza: ''
};

export const ElementSurvey = ({element, surveyData, onUpdateSurvey}) => {
    const [updateSurvey, mutationState] = useUpdateSurveyMutation();
    const [formValues, setFormValues] = useState(emptyForm);

    const elementSurveyData = surveyData?.find((survey) => survey.guid === element.id);
    const elementMetadata = useMemo(
        () => (elementSurveyData ? JSON.parse(elementSurveyData.metadata) : null),
        [elementSurveyData]
    );

    useEffect(() => {
        setFormValues({
            uszkodzenia: elementMetadata?.kodyUszkodzen || '',
            stan: elementMetadata?.ocenaStanu || '',
            czyEkspertyza: elementMetadata?.czyEkspertyza || '',
            trybEkspertyza: elementMetadata?.trybEkspertyza || ''
        });
    }, [element.id, elementMetadata]);

    const handleChange = ({target}) => {
        const {name, value} = target;
        setFormValues((prev) => ({...prev, [name]: value}));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const metadata = JSON.stringify({
            kodyUszkodzen: formValues.uszkodzenia,
            ocenaStanu: formValues.stan,
            czyEkspertyza: formValues.czyEkspertyza,
            trybEkspertyza: formValues.trybEkspertyza
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
            <form key={element.id} onSubmit={handleSubmit}>
                <h3>Ocena stanu technicznego</h3>
                <h4>Kody uszkodzeń</h4>
                <textarea
                    name="uszkodzenia"
                    className={styles.uszkodzenia}
                    value={formValues.uszkodzenia}
                    onChange={handleChange}
                />

                <h4>Ocena stanu</h4>
                <div className={styles.selector}>
                    {['0', '1', '2', '3', '4', '5'].map((val) => (
                        <React.Fragment key={val}>
                            <input
                                type="radio"
                                name="stan"
                                value={val}
                                id={`stan-${val}`}
                                checked={formValues.stan === val}
                                onChange={handleChange}
                            />
                            <label htmlFor={`stan-${val}`}> {val} </label>
                        </React.Fragment>
                    ))}
                </div>

                <h4>Potrzeba wykonania ekspertyzy</h4>
                <div className={styles.selector}>
                    {['TAK', 'NIE'].map((val) => (
                        <React.Fragment key={val}>
                            <input
                                type="radio"
                                name="czyEkspertyza"
                                value={val}
                                id={`czyEksptertyza-${val}`}
                                checked={formValues.czyEkspertyza === val}
                                onChange={handleChange}
                            />
                            <label htmlFor={`czyEksptertyza-${val}`}> {val === 'TAK' ? 'Tak' : 'Nie'} </label>
                        </React.Fragment>
                    ))}
                </div>

                <h4>Tryb wykonania ekspertyzy</h4>
                <div className={styles.selector}>
                    {['A', '1', '2', '3'].map((val) => (
                        <React.Fragment key={val}>
                            <input
                                type="radio"
                                name="trybEkspertyza"
                                value={val}
                                id={`trybEkspertyza-${val}`}
                                checked={formValues.trybEkspertyza === val}
                                onChange={handleChange}
                            />
                            <label htmlFor={`trybEkspertyza-${val}`}> {val} </label>
                        </React.Fragment>
                    ))}
                </div>

                <button type="submit">Zapisz</button>

                {mutationState.isFetching && <p>Wysyłanie...</p>}
                {mutationState.error && <p>Wystąpił błąd: {mutationState.error.status}</p>}
                {mutationState.isSuccess && <p>Dane zostały zapisane</p>}
            </form>

            <hr/>

            <h4>Zdjęcia</h4>
            <UploadFile/>
        </div>
    );
}
