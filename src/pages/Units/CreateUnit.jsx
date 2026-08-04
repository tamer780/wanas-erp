import { Navigate } from "react-router-dom";
import { paths } from "../../routes/pathnames";

const CreateUnit = () => <Navigate to={paths.units} replace />;

export default CreateUnit;
