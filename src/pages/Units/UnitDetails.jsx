import { Navigate } from "react-router-dom";
import { paths } from "../../routes/pathnames";

const UnitDetails = () => <Navigate to={paths.units} replace />;

export default UnitDetails;
