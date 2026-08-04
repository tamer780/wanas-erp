import { Navigate } from "react-router-dom";
import { paths } from "../../routes/pathnames";

const LandDetails = () => <Navigate to={paths.lands} replace />;

export default LandDetails;
