import {useParams} from "react-router";
import {Xeokit_v1} from "../Xeokit_v1.jsx";

export const Project = () => {
    const {projectId} = useParams();

    // TODO: check if project exists, or just overhaul this

    return (
        <>
            <Xeokit_v1 model={projectId}/>
        </>
    )
}
