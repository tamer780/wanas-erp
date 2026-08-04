import { Navigate } from "react-router-dom";
import { paths } from "../../routes/pathnames";

const CreateLand = () => <Navigate to={paths.lands} replace />;

export default CreateLand;
