import { createBrowserRouter } from "react-router-dom";
import Home from "./views/Home";
import Projects from "./views/Projects";
import CreateProject from "./views/CreateProject";
import Template from "./views/Template";
import Detail from "./views/Detail";
import Checklist from "./views/Checklist";
import DefaultLayout from "./components/DefaultLayout";
import Timeline from "./components/Timeline";
import Login from "./views/Login";

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
        path: "/test",
        element: <Timeline />,
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
