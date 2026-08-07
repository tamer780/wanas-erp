import { Navigate } from "react-router-dom";
import { paths } from "../../routes/pathnames";

const UserDetails = () => <Navigate to={paths.users} replace />;

export default UserDetails;
