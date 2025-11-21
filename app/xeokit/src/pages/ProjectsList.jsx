import {Link} from "react-router";
import {UploadFile} from "../components/UploadFile.jsx";
import { ProjectCard } from "../components/Project_card.jsx";

const test_proj = {
        id: 1,
        guid: "abc-123",
        name: "Holter Tower",
        description: "Model budynku w formacie IFC/XKT.",
        created_at: "2024-01-01",
        updated_at: "2024-01-02"
    };

export const ProjectsList = () => {
    return (
        <>
            <h1>Lista projektów</h1>
            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                <ProjectCard project={test_proj} />
            </div>
            <Link to={"project/HolterTower.ifc.xkt"}>Przykładowy projekt</Link>
            
            <p>Utwórz nowy projekt przesyłając plik IFC</p>
            <UploadFile/>
        </>
    )
}
