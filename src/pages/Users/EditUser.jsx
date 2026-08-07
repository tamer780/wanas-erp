import { Navigate } from "react-router-dom";
import { paths } from "../../routes/pathnames";

const EditUser = () => <Navigate to={paths.users} replace />;

export default EditUser;
