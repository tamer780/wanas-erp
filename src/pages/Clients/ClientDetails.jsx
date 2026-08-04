import { Navigate } from "react-router-dom";
import { paths } from "../../routes/pathnames";

const ClientDetails = () => <Navigate to={paths.clients} replace />;

export default ClientDetails;
