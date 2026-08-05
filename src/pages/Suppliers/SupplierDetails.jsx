import { Navigate } from "react-router-dom";
import { paths } from "../../routes/pathnames";

const SupplierDetails = () => <Navigate to={paths.suppliers} replace />;

export default SupplierDetails;
