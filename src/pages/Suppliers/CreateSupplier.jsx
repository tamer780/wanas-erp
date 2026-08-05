import { Navigate } from "react-router-dom";
import { paths } from "../../routes/pathnames";

const CreateSupplier = () => <Navigate to={paths.suppliers} replace />;

export default CreateSupplier;
