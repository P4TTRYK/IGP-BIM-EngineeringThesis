import {Link} from "react-router";

export const ProjectsList = () => {
    return (
        <>
            Lista projektów

            <Link to={"project/HolterTower.ifc.xkt"}>Przykładowy projekt</Link>
        </>
    )
}
