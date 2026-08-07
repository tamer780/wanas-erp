import { Navigate } from "react-router-dom";
import { paths } from "../../routes/pathnames";

const CreateUser = () => <Navigate to={paths.users} replace />;

export default CreateUser;
