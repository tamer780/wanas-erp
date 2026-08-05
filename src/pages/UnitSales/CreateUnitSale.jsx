import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageScaffold from "../../components/common/PageScaffold";
import Button from "../../components/ui/Button";
import UnitSaleForm from "../../components/unit-sales/UnitSaleForm";
import { useToast } from "../../context/ToastContext";
import { clientsService, unitSalesService, unitsService } from "../../services";
import {
  emptyUnitSaleForm,
  formValuesToFormData,
  formValuesToPayload,
  shouldUseFormData,
  validateUnitSaleForm,
} from "../../utils/unitSaleValidation";

const extractList = (response) => {
  const body = response?.data;
  const paginated = body?.data ?? body;
  if (Array.isArray(paginated?.data)) return paginated.data;
  if (Array.isArray(paginated)) return paginated;
  return [];
};

const CreateUnitSale = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const [values, setValues] = useState(emptyUnitSaleForm);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [unitOptions, setUnitOptions] = useState([]);
  const [clientOptions, setClientOptions] = useState([]);
  const [optionsLoading, setOptionsLoading] = useState(true);

  const loadOptions = useCallback(async () => {
    setOptionsLoading(true);
    try {
      const [unitsRes, clientsRes] = await Promise.all([
        unitsService.getAll(),
        clientsService.getAll(),
      ]);
      setUnitOptions(extractList(unitsRes));
      setClientOptions(extractList(clientsRes));
    } catch {
      setUnitOptions([]);
      setClientOptions([]);
    } finally {
      setOptionsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOptions();
  }, [loadOptions]);

  const availableUnits = useMemo(() => {
    const available = unitOptions.filter(
      (unit) => String(unit.status).toLowerCase() === "available",
    );
    return available.length > 0 ? available : unitOptions;
  }, [unitOptions]);

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

    const nextErrors = validateUnitSaleForm(values, { mode: "create" });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      const payload = shouldUseFormData(values)
        ? formValuesToFormData(values, { mode: "create" })
        : formValuesToPayload(values, { mode: "create" });

      const response = await unitSalesService.create(payload);
      const created = response?.data?.data ?? response?.data;
      toast.success("Unit sale created successfully.");
      if (created?.id) {
        navigate(`/unit-sales/${created.id}`);
      } else {
        navigate("/unit-sales");
      }
    } catch (err) {
      setSubmitError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to create unit sale.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageScaffold
      title="Create Unit Sale"
      description="Add a new unit sale with contract and payment details."
      breadcrumbs={[
        { label: "Dashboard", to: "/dashboard" },
        { label: "Unit Sales", to: "/unit-sales" },
        { label: "Create" },
      ]}
      actions={
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="md"
            disabled={submitting}
            onClick={() => navigate("/unit-sales")}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="unit-sale-form"
            size="md"
            loading={submitting}
            disabled={optionsLoading}
          >
            Create Sale
          </Button>
        </div>
      }
    >
      <div className="rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-6">
        {optionsLoading ? (
          <div className="space-y-4" aria-busy="true">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-24 animate-pulse rounded-xl bg-surface-muted"
              />
            ))}
          </div>
        ) : (
          <>
            {submitError ? (
              <div
                role="alert"
                className="mb-4 rounded-xl border border-danger-100 bg-danger-50 px-4 py-3 text-sm text-danger-700"
              >
                {submitError}
              </div>
            ) : null}

            <UnitSaleForm
              mode="create"
              values={values}
              errors={errors}
              disabled={submitting}
              unitOptions={availableUnits}
              clientOptions={clientOptions}
              onChange={handleChange}
              onSubmit={handleSubmit}
            />

            <p className="mt-4 text-xs text-text-muted">
              Need a client first?{" "}
              <Link
                to="/clients"
                className="font-medium text-wanas-700 hover:underline"
              >
                Manage clients
              </Link>
            </p>
          </>
        )}
      </div>
    </PageScaffold>
  );
};

export default CreateUnitSale;
