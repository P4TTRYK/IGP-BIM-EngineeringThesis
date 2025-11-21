import {Link} from "react-router";
import {UploadFile} from "../components/UploadFile.jsx";
import {ProjectCard} from "../components/Project_card.jsx";
import { useProjectListQuery } from "../services/api.js";

export const ProjectsList = () => {
    const {data, isFetching, error} = useProjectListQuery();
    return (
        <>
            <h1>Lista projektów</h1>
            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                {isFetching && <div>Loading Project List</div>}
                {error && <div>Error Project List: {error.status}</div>}
                {!isFetching && !error && !data && <div>No data</div>}
                {!isFetching && !error && data && <>{data.map(project => <ProjectCard project={project}/>)} </> }
            </div>
            
            <p>Utwórz nowy projekt przesyłając plik IFC</p>
            <UploadFile/>
        </>
    )
}
