import { Navigate } from "react-router-dom";
import { paths } from "../../routes/pathnames";

const WorkItemDetails = () => <Navigate to={paths.workItems} replace />;

export default WorkItemDetails;
