import { Navigate } from "react-router-dom";
import { paths } from "../../routes/pathnames";

const BuildingDetails = () => <Navigate to={paths.buildings} replace />;

export default BuildingDetails;
