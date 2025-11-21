import {useParams} from "react-router";
import {Xeokit} from "../components/Xeokit.jsx";
import {useProjectModelQuery} from "../services/api.js";

export const Project = () => {
    const {projectId} = useParams();
    const {data: model, isFetching, error} = useProjectModelQuery(projectId);

    return (
        <>
            {isFetching && <div>Loading model...</div>}
            {error && <div>Error loading model: {error.status}</div>}
            {!isFetching && !error && model && <Xeokit model={model}/>}
        </>
    );
}
