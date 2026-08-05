import { Navigate } from "react-router-dom";
import { paths } from "../../routes/pathnames";

const EditWorkItem = () => <Navigate to={paths.workItems} replace />;

export default EditWorkItem;
