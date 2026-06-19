import { createBrowserRouter } from "react-router-dom";
import VistaCliente from "../components/VistaCliente";
import VistaBarbero from "../components/VistaBarbero";

const router = createBrowserRouter([
  {
    path: "/",
    element: <VistaCliente />,
  },
  {
    path:"/barbero",
    element: <VistaBarbero/>
  }
]);

export default router;