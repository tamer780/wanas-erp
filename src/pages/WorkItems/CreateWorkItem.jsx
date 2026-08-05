import { Navigate } from "react-router-dom";
import { paths } from "../../routes/pathnames";

const CreateWorkItem = () => <Navigate to={paths.workItems} replace />;

export default CreateWorkItem;
