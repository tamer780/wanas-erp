import { useCallback, useEffect, useMemo, useState } from "react";
import PageScaffold from "../../components/common/PageScaffold";
import Button from "../../components/ui/Button";
import PayablePaymentForm from "../../components/payable-payments/PayablePaymentForm";
import { useToast } from "../../context/ToastContext";
import { paths } from "../../routes/pathnames";
import {
  contractorsService,
  materialPurchasesService,
  payablePaymentsService,
  suppliersService,
  workItemsService,
} from "../../services";
import {
  defaultReferenceType,
  emptyPayablePaymentForm,
  formValuesToPayload,
  validatePayablePaymentForm,
} from "../../utils/payablePaymentValidation";

const extractList = (response) => {
  const body = response?.data;
  const paginated = body?.data ?? body;
  if (Array.isArray(paginated?.data)) return paginated.data;
  if (Array.isArray(paginated)) return paginated;
  return [];
};

const extractDetail = (response) =>
  response?.data?.data ?? response?.data ?? null;

const CreatePayablePayment = () => {
  const toast = useToast();

  const [values, setValues] = useState(emptyPayablePaymentForm);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [suppliers, setSuppliers] = useState([]);
  const [contractors, setContractors] = useState([]);
  const [materialPurchases, setMaterialPurchases] = useState([]);
  const [workItems, setWorkItems] = useState([]);
  const [scheduleOptions, setScheduleOptions] = useState([]);
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [schedulesLoading, setSchedulesLoading] = useState(false);

  const loadOptions = useCallback(async () => {
    setOptionsLoading(true);
    try {
      const [suppliersRes, contractorsRes, purchasesRes, workItemsRes] =
        await Promise.all([
          suppliersService.getAll(),
          contractorsService.getAll(),
          materialPurchasesService.getAll(),
          workItemsService.getAll(),
        ]);
      setSuppliers(extractList(suppliersRes));
      setContractors(extractList(contractorsRes));
      setMaterialPurchases(extractList(purchasesRes));
      setWorkItems(extractList(workItemsRes));
    } catch {
      setSuppliers([]);
      setContractors([]);
      setMaterialPurchases([]);
      setWorkItems([]);
    } finally {
      setOptionsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOptions();
  }, [loadOptions]);

  useEffect(() => {
    const { reference_type: referenceType, reference_id: referenceId } =
      values;

    if (!referenceType || !referenceId) {
      setScheduleOptions([]);
      setSchedulesLoading(false);
      return undefined;
    }

    let cancelled = false;

    const loadSchedules = async () => {
      setSchedulesLoading(true);
      try {
        const response =
          referenceType === "work_item"
            ? await workItemsService.getById(referenceId)
            : await materialPurchasesService.getById(referenceId);
        const detail = extractDetail(response);
        if (!cancelled) {
          setScheduleOptions(
            Array.isArray(detail?.payment_schedules)
              ? detail.payment_schedules
              : [],
          );
        }
      } catch {
        if (!cancelled) setScheduleOptions([]);
      } finally {
        if (!cancelled) setSchedulesLoading(false);
      }
    };

    loadSchedules();

    return () => {
      cancelled = true;
    };
  }, [values.reference_type, values.reference_id]);

  const payableOptions = useMemo(() => {
    if (values.payable_type === "contractor") return contractors;
    if (values.payable_type === "supplier") return suppliers;
    return [];
  }, [values.payable_type, suppliers, contractors]);

  const referenceOptions = useMemo(() => {
    const payableId = values.payable_id;

    if (values.reference_type === "material_purchase") {
      if (!payableId) return materialPurchases;
      const matched = materialPurchases.filter(
        (item) =>
          String(item.supplier_id ?? item.supplier?.id) === String(payableId),
      );
      return matched.length > 0 ? matched : materialPurchases;
    }

    if (values.reference_type === "work_item") {
      if (!payableId) return workItems;
      const matched = workItems.filter(
        (item) =>
          String(item.contractor_id ?? item.contractor?.id) ===
          String(payableId),
      );
      return matched.length > 0 ? matched : workItems;
    }

    return [];
  }, [
    values.reference_type,
    values.payable_id,
    materialPurchases,
    workItems,
  ]);

  const clearFieldError = (field) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleChange = (field, value) => {
    setValues((prev) => {
      const next = { ...prev, [field]: value };

      if (field === "payable_type") {
        next.payable_id = "";
        next.reference_type = defaultReferenceType(value);
        next.reference_id = "";
        next.payment_schedule_id = "";
      }

      if (field === "payable_id") {
        next.reference_id = "";
        next.payment_schedule_id = "";
      }

      if (field === "reference_type") {
        next.reference_id = "";
        next.payment_schedule_id = "";
      }

      if (field === "reference_id") {
        next.payment_schedule_id = "";
      }

      return next;
    });

    clearFieldError(field);

    if (field === "payable_type") {
      clearFieldError("payable_id");
      clearFieldError("reference_type");
      clearFieldError("reference_id");
      clearFieldError("payment_schedule_id");
    } else if (field === "payable_id" || field === "reference_type") {
      clearFieldError("reference_id");
      clearFieldError("payment_schedule_id");
    } else if (field === "reference_id") {
      clearFieldError("payment_schedule_id");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError("");

    const scheduleIds = scheduleOptions.map((schedule) => schedule.id);
    const nextErrors = validatePayablePaymentForm(values, { scheduleIds });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      await payablePaymentsService.create(formValuesToPayload(values));
      toast.success("Payable payment recorded successfully.");
      setValues(emptyPayablePaymentForm());
      setErrors({});
      setScheduleOptions([]);
    } catch (err) {
      const apiErrors = err?.response?.data?.errors;
      if (apiErrors && typeof apiErrors === "object") {
        const fieldErrors = {};
        Object.entries(apiErrors).forEach(([key, messages]) => {
          fieldErrors[key] = Array.isArray(messages)
            ? messages[0]
            : String(messages);
        });
        setErrors((prev) => ({ ...prev, ...fieldErrors }));
      }
      setSubmitError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to create payable payment.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageScaffold
      title="Create Payable Payment"
      description="Record a payment to a supplier or contractor."
      breadcrumbs={[
        { label: "Dashboard", to: paths.dashboard },
        { label: "Payable Payments" },
      ]}
      actions={
        <Button
          type="submit"
          form="payable-payment-form"
          size="md"
          loading={submitting}
          disabled={optionsLoading}
        >
          Save Payment
        </Button>
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

            <PayablePaymentForm
              values={values}
              errors={errors}
              disabled={submitting}
              payableOptions={payableOptions}
              referenceOptions={referenceOptions}
              scheduleOptions={scheduleOptions}
              schedulesLoading={schedulesLoading}
              onChange={handleChange}
              onSubmit={handleSubmit}
            />
          </>
        )}
      </div>
    </PageScaffold>
  );
};

export default CreatePayablePayment;
