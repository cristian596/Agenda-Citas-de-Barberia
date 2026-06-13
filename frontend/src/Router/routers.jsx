import { createBrowserRouter } from "react-router-dom";
import VistaCliente from "../components/vistaCliente";
import vistaBarbero from "../components/vistaBarbero";

const router = createBrowserRouter([
  {
    path: "/",
    element: <VistaCliente />,
  },
]);

export default router;