import {createHashRouter, RouterProvider} from "react-router";
import {ProjectsList} from "./pages/ProjectsList.jsx";
import {Project} from "./pages/Project.jsx";

const router = createHashRouter([
    {
        path: '/',
        // element: <RootLayout/>,
        children: [
            {
                index: true,
                element: <ProjectsList/> // or sth different
            },
            {
                path: 'project',
                // element: <EventsRootLayout/>,
                children: [
                    {
                        path: '',
                        element: <ProjectsList/>,
                    },
                    {
                        path: ':projectId',
                        children: [
                            {
                                index: true,
                                element: <Project/>
                            },
                            // {path: 'details', element: <ProjectDetails/>},
                        ]
                    },
                ]
            },
        ],
        errorElement: <ProjectsList/>
    },
]);

function App() {
    return <RouterProvider router={router}/>
}

export default App
