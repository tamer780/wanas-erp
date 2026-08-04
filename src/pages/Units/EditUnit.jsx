import { Navigate } from "react-router-dom";
import { paths } from "../../routes/pathnames";

const EditUnit = () => <Navigate to={paths.units} replace />;

export default EditUnit;
