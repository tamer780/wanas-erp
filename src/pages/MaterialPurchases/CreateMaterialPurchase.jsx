import { Navigate } from "react-router-dom";
import { paths } from "../../routes/pathnames";

const CreateMaterialPurchase = () => (
  <Navigate to={paths.materialPurchases} replace />
);

export default CreateMaterialPurchase;
