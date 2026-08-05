import { Navigate } from "react-router-dom";
import { paths } from "../../routes/pathnames";

const EditMaterialPurchase = () => (
  <Navigate to={paths.materialPurchases} replace />
);

export default EditMaterialPurchase;
