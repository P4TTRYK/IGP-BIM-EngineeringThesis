import {Link} from "react-router";
import {UploadFile} from "../components/UploadFile.jsx";

export const ProjectsList = () => {
    return (
        <>
            <h1>Lista projektów</h1>

            <Link to={"project/HolterTower.ifc.xkt"}>Przykładowy projekt</Link>

            <p>Utwórz nowy projekt przesyłając plik IFC</p>
            <UploadFile/>
        </>
    )
}
