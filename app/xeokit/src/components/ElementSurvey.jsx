import React from 'react';
import styles from './ElementSurvey.module.css';
import {UploadFile} from "./UploadFile.jsx";

export const ElementSurvey = ({element, surveyData}) => {
    console.log(element);
    console.log(surveyData);

    const handleSubmit = (formData) => {
        console.log(formData);
        // upload data to server
        // update surveyData to reflect changes
    }

    return (
        <div className={styles.container}>
            <form action={handleSubmit}>
                <h3>Ocena stanu technicznego</h3>
                <h4>Kody uszkodzeń</h4>
                <textarea name="uszkodzenia" className={styles.uszkodzenia}
                          defaultValue={surveyData?.kodyUszkodzen || ''}/>

                <h4>Ocena stanu</h4>
                <div className={styles.selector}>
                    {
                        ['0', '1', '2', '3', '4', '5'].map((val, idx) =>
                            <React.Fragment key={idx}>
                                <input type="radio" name="stan" value={val} id={`stan-${idx}`}/>
                                <label htmlFor={`stan-${idx}`}> {val} </label>
                            </React.Fragment>
                        )
                    }
                </div>

                <h4>Potrzeba wykonania ekspertyzy</h4>
                <div className={styles.selector}>
                    <input type="radio" name="czyEksptertyza" value="NIE" id={`czyEksptertyza-tak`}/>
                    <label htmlFor={`czyEksptertyza-tak`}> Tak </label>

                    <input type="radio" name="czyEksptertyza" value="TAK" id={`czyEksptertyza-nie`}/>
                    <label htmlFor={`czyEksptertyza-nie`}> Nie </label>
                </div>

                <h4>Tryb wykonania ekspertyzy</h4>
                <div className={styles.selector}>
                    {
                        ['A', '1', '2', '3'].map((val, idx) =>
                            <React.Fragment key={idx}>
                                <input type="radio" name="trybEkspertyza" value={val} id={`trybEkspertyza-${idx}`}/>
                                <label htmlFor={`trybEkspertyza-${idx}`}> {val} </label>
                            </React.Fragment>
                        )
                    }
                </div>

                <button type="submit">Zapisz</button>
            </form>

            <hr/>

            <h4>Zdjęcia</h4>
            <UploadFile/>
        </div>
    )
}
