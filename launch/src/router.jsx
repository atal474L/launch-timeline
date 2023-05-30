import { createBrowserRouter } from "react-router-dom";
import Home from "./views/Home";
import Projects from "./views/Projects";
import CreateProject from "./views/CreateProject";
import Template from "./views/Template";
import Detail from "./views/Detail";
import Checklist from "./views/Checklist";
import DefaultLayout from "./components/DefaultLayout";
import Login from "./views/Login";
import UpdateProject from "./views/UpdateProject";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DefaultLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/projecten",
        element: <Projects />,
      },
      {
        path: "/projecten/toevoegen",
        element: <CreateProject />,
      },
      {
        path: "/projecten/toevoegen/:id/template",
        element: <Template />,
      },
      {
        path: "/projecten/:id",
        element: <Detail />,
      },
      {
        path: "/projecten/:id/bewerken",
        element: <UpdateProject />,
      },
      {
        path: "/projecten/:projectId/checklist/:checklistId",
        element: <Checklist />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login></Login>,
  },
]);

export default router;
