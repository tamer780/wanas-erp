import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageScaffold from "../../components/common/PageScaffold";
import Button from "../../components/ui/Button";
import UnitSaleForm from "../../components/unit-sales/UnitSaleForm";
import UnitSalesErrorState from "../../components/unit-sales/UnitSalesErrorState";
import { useToast } from "../../context/ToastContext";
import { clientsService, unitSalesService, unitsService } from "../../services";
import {
  emptyUnitSaleForm,
  formValuesToFormData,
  formValuesToPayload,
  shouldUseFormData,
  unitSaleToFormValues,
  validateUnitSaleForm,
} from "../../utils/unitSaleValidation";

const extractList = (response) => {
  const body = response?.data;
  const paginated = body?.data ?? body;
  if (Array.isArray(paginated?.data)) return paginated.data;
  if (Array.isArray(paginated)) return paginated;
  return [];
};

const EditUnitSale = () => {
  const { id } = useParams();
  const toast = useToast();
  const navigate = useNavigate();

  const [values, setValues] = useState(emptyUnitSaleForm);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [loadError, setLoadError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [unitOptions, setUnitOptions] = useState([]);
  const [clientOptions, setClientOptions] = useState([]);

  const loadSale = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setLoadError("");

    try {
      const [saleRes, unitsRes, clientsRes] = await Promise.all([
        unitSalesService.getById(id),
        unitsService.getAll(),
        clientsService.getAll(),
      ]);

      const sale = saleRes?.data?.data ?? saleRes?.data;
      if (!sale) {
        throw new Error("Unit sale not found.");
      }

      setValues(unitSaleToFormValues(sale));

      const units = extractList(unitsRes);
      const clients = extractList(clientsRes);

      // Ensure current unit/client remain selectable even if sold/inactive.
      if (sale.unit && !units.some((u) => String(u.id) === String(sale.unit.id))) {
        units.unshift(sale.unit);
      }
      if (
        sale.client &&
        !clients.some((c) => String(c.id) === String(sale.client.id))
      ) {
        clients.unshift(sale.client);
      }

      setUnitOptions(units);
      setClientOptions(clients);
    } catch (err) {
      setLoadError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load unit sale.",
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadSale();
  }, [loadSale]);

  const handleChange = (field, value) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError("");

    const nextErrors = validateUnitSaleForm(values, { mode: "edit" });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      const payload = shouldUseFormData(values)
        ? formValuesToFormData(values, { mode: "edit" })
        : formValuesToPayload(values, { mode: "edit" });

      await unitSalesService.update(id, payload);
      toast.success("Unit sale updated successfully.");
      navigate(`/unit-sales/${id}`);
    } catch (err) {
      setSubmitError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to update unit sale.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageScaffold
      title="Edit Unit Sale"
      description="Update contract and sale information."
      breadcrumbs={[
        { label: "Dashboard", to: "/dashboard" },
        { label: "Unit Sales", to: "/unit-sales" },
        { label: "Edit" },
      ]}
      actions={
        !loading && !loadError ? (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="md"
              disabled={submitting}
              onClick={() => navigate(`/unit-sales/${id}`)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="unit-sale-form"
              size="md"
              loading={submitting}
            >
              Save Changes
            </Button>
          </div>
        ) : null
      }
    >
      {loading ? (
        <div className="space-y-4 rounded-2xl border border-border bg-surface p-6 shadow-card">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-24 animate-pulse rounded-xl bg-surface-muted"
            />
          ))}
        </div>
      ) : null}

      {!loading && loadError ? (
        <UnitSalesErrorState message={loadError} onRetry={loadSale} />
      ) : null}

      {!loading && !loadError ? (
        <div className="rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-6">
          {submitError ? (
            <div
              role="alert"
              className="mb-4 rounded-xl border border-danger-100 bg-danger-50 px-4 py-3 text-sm text-danger-700"
            >
              {submitError}
            </div>
          ) : null}

          <UnitSaleForm
            mode="edit"
            values={values}
            errors={errors}
            disabled={submitting}
            unitOptions={unitOptions}
            clientOptions={clientOptions}
            lockUnitAndClient
            onChange={handleChange}
            onSubmit={handleSubmit}
          />
        </div>
      ) : null}
    </PageScaffold>
  );
};

export default EditUnitSale;
