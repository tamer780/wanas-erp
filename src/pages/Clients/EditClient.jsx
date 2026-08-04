import { Navigate } from "react-router-dom";
import { paths } from "../../routes/pathnames";

const EditClient = () => <Navigate to={paths.clients} replace />;

export default EditClient;
