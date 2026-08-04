import { Navigate } from "react-router-dom";
import { paths } from "../../routes/pathnames";

const CreateBuilding = () => <Navigate to={paths.buildings} replace />;

export default CreateBuilding;
