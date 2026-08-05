import { Navigate } from "react-router-dom";
import { paths } from "../../routes/pathnames";

const MaterialPurchaseDetails = () => (
  <Navigate to={paths.materialPurchases} replace />
);

export default MaterialPurchaseDetails;
