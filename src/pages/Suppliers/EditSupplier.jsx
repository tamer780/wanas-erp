import { Navigate } from "react-router-dom";
import { paths } from "../../routes/pathnames";

const EditSupplier = () => <Navigate to={paths.suppliers} replace />;

export default EditSupplier;
