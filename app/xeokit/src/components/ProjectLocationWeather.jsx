import styles from "./ProjectLocationWeather.module.css";
import {useProjectWeatherQuery} from "../services/api.js";

export const ProjectLocationWeather = ({project}) => {
    const {data, isFetching, error} = useProjectWeatherQuery(project);

    const {
        main: {temp: temperature = null} = {},
        name: locationName = null,
        weather: [{icon: weatherIcon = null, description: conditions = null} = {}] = [],
    } = data || {};

    console.log(temperature, locationName, weatherIcon, conditions);

    return (
        <div
            className={styles['location-weather']}
        >
            {isFetching && <span>Ładowanie...</span>}
            {error && <span>Błąd ładowania</span>}
            {data && (<>
                <span>{locationName}</span>
                <img
                    src={`https://openweathermap.org/img/wn/${weatherIcon}@4x.png`}
                    alt={conditions}
                />
                <span>{Math.round(temperature)}&deg;C</span>
            </>)}
        </div>
    )
}
