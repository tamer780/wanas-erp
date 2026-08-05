import { Navigate } from "react-router-dom";
import { paths } from "../../routes/pathnames";

const EditContractor = () => <Navigate to={paths.contractors} replace />;

export default EditContractor;
