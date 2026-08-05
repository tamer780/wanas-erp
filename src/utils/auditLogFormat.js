import { translationText } from "./format";

const tryParseJson = (value) => {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) return null;
  try {
    return JSON.parse(trimmed);
  } catch {
    return null;
  }
};

export const formatAuditValue = (value) => {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "number") return String(value);

  if (typeof value === "object") {
    if ("en" in value || "ar" in value) {
      const en = translationText(value, "en");
      const ar = translationText(value, "ar");
      if (en !== "—" && ar !== "—" && en !== ar) return `${en} / ${ar}`;
      return en !== "—" ? en : ar;
    }
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return String(value);
    }
  }

  const parsed = tryParseJson(value);
  if (parsed !== null) return formatAuditValue(parsed);

  return String(value);
};

export const entriesFromValues = (values) => {
  if (!values || typeof values !== "object" || Array.isArray(values)) {
    return [];
  }
  return Object.entries(values);
};
