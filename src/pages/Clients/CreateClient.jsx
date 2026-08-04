import { Navigate } from "react-router-dom";
import { paths } from "../../routes/pathnames";

const CreateClient = () => <Navigate to={paths.clients} replace />;

export default CreateClient;
