import { Navigate } from "react-router-dom";
import { paths } from "../../routes/pathnames";

const CreateContractor = () => <Navigate to={paths.contractors} replace />;

export default CreateContractor;
