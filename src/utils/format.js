const moneyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

const numberFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
});

export const toNumber = (value) => {
  if (value === null || value === undefined || value === "") return 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const formatMoney = (value) => moneyFormatter.format(toNumber(value));

export const formatNumber = (value) => numberFormatter.format(toNumber(value));

export const formatArea = (value) => `${formatNumber(value)} sqm`;

export const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

export const translationText = (value, locale = "en") => {
  if (!value) return "—";
  if (typeof value === "string") return value;
  return value[locale] || value.en || value.ar || "—";
};
