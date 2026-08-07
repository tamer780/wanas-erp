export const USER_ROLE_OPTIONS = [
  { value: "super_admin", label: "Super Admin" },
  { value: "admin", label: "Admin" },
  { value: "accountant", label: "Accountant" },
  { value: "data_entry", label: "Data Entry" },
];

export const USER_STATUS_OPTIONS = [
  { value: "true", label: "Active" },
  { value: "false", label: "Inactive" },
];

export const formatRoleLabel = (role) => {
  if (!role) return "—";
  const match = USER_ROLE_OPTIONS.find((option) => option.value === role);
  return match?.label ?? role.replace(/_/g, " ");
};

export const getUserPrimaryRole = (user) => {
  if (!user) return "";
  if (typeof user.role === "string") return user.role;
  return user.roles?.[0]?.name ?? "";
};

export const emptyUserForm = () => ({
  name: "",
  email: "",
  password: "",
  role: "",
  is_active: true,
});

export const userToFormValues = (user) => {
  if (!user) return emptyUserForm();

  return {
    name: user.name ?? "",
    email: user.email ?? "",
    password: "",
    role: getUserPrimaryRole(user),
    is_active: Boolean(user.is_active),
  };
};

export const formValuesToPayload = (values, { mode = "create" } = {}) => {
  const payload = {
    name: values.name.trim(),
    email: values.email.trim(),
    role: values.role,
    is_active: Boolean(values.is_active),
  };

  const password = values.password.trim();
  if (mode === "create" || password) {
    payload.password = password;
  }

  return payload;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

export const validateUserForm = (values, { mode = "create" } = {}) => {
  const errors = {};

  if (!values.name.trim()) {
    errors.name = "Name is required.";
  }

  if (!values.email.trim()) {
    errors.email = "Email is required.";
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  const password = values.password.trim();
  if (mode === "create") {
    if (!password) {
      errors.password = "Password is required.";
    } else if (password.length < MIN_PASSWORD_LENGTH) {
      errors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
    }
  } else if (password && password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }

  if (!values.role) {
    errors.role = "Role is required.";
  }

  return errors;
};
