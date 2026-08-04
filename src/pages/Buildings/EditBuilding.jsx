import { Navigate } from "react-router-dom";
import { paths } from "../../routes/pathnames";

const EditBuilding = () => <Navigate to={paths.buildings} replace />;

export default EditBuilding;
