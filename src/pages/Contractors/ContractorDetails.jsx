import { Navigate } from "react-router-dom";
import { paths } from "../../routes/pathnames";

const ContractorDetails = () => <Navigate to={paths.contractors} replace />;

export default ContractorDetails;
