import {
  Children,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";

const EASE_OUT = [0.22, 1, 0.36, 1];

const getOptionLabel = (child) => {
  const { children: label } = child.props;
  if (label == null || label === false) return "";
  if (typeof label === "string" || typeof label === "number") {
    return String(label);
  }
  return Children.toArray(label)
    .map((node) => {
      if (typeof node === "string" || typeof node === "number") return String(node);
      return "";
    })
    .join("")
    .trim();
};

const parseOptions = (children) => {
  const options = [];

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    if (child.type !== "option") return;

    options.push({
      value: child.props.value == null ? "" : String(child.props.value),
      label: getOptionLabel(child),
      disabled: Boolean(child.props.disabled),
    });
  });

  return options;
};

const Select = ({
  id,
  label,
  error,
  disabled = false,
  className = "",
  children,
  size = "default",
  value,
  onChange,
  name,
  ...props
}) => {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const listboxId = `${selectId}-listbox`;
  const errorId = error ? `${selectId}-error` : undefined;

  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const listRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [menuStyle, setMenuStyle] = useState(null);

  const reduceMotion = useReducedMotion();
  const options = useMemo(() => parseOptions(children), [children]);

  const selectedIndex = useMemo(() => {
    const normalized = value == null ? "" : String(value);
    return options.findIndex((option) => option.value === normalized);
  }, [options, value]);

  const selectedOption = selectedIndex >= 0 ? options[selectedIndex] : null;
  const displayLabel = selectedOption?.label ?? "";
  const isPlaceholder = !selectedOption || selectedOption.value === "";

  const heightClass = size === "sm" ? "h-11 text-sm" : "h-14 text-base";
  const optionTextClass = size === "sm" ? "text-sm" : "text-base";

  const updateMenuPosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    const viewportPadding = 8;
    const gap = 6;
    const estimatedMaxHeight = 240;
    const spaceBelow = window.innerHeight - rect.bottom - viewportPadding;
    const spaceAbove = rect.top - viewportPadding;
    const openUpward =
      spaceBelow < Math.min(estimatedMaxHeight, 160) && spaceAbove > spaceBelow;

    const maxHeight = Math.max(
      120,
      Math.min(estimatedMaxHeight, openUpward ? spaceAbove - gap : spaceBelow - gap),
    );

    setMenuStyle({
      position: "fixed",
      left: rect.left,
      width: rect.width,
      maxHeight,
      zIndex: 80,
      ...(openUpward
        ? { bottom: window.innerHeight - rect.top + gap }
        : { top: rect.bottom + gap }),
    });
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    setHighlightedIndex(-1);
  }, []);

  const emitChange = useCallback(
    (nextValue) => {
      onChange?.({
        target: {
          value: nextValue,
          name: name ?? selectId,
        },
        currentTarget: {
          value: nextValue,
          name: name ?? selectId,
        },
      });
    },
    [name, onChange, selectId],
  );

  const selectOption = useCallback(
    (option) => {
      if (!option || option.disabled) return;
      emitChange(option.value);
      close();
      triggerRef.current?.focus();
    },
    [close, emitChange],
  );

  const openMenu = useCallback(() => {
    if (disabled) return;
    updateMenuPosition();
    setOpen(true);
    const startIndex =
      selectedIndex >= 0
        ? selectedIndex
        : options.findIndex((option) => !option.disabled);
    setHighlightedIndex(startIndex);
  }, [disabled, options, selectedIndex, updateMenuPosition]);

  const toggleMenu = () => {
    if (open) {
      close();
    } else {
      openMenu();
    }
  };

  useEffect(() => {
    if (!open) return undefined;

    updateMenuPosition();

    const handlePointerDown = (event) => {
      const target = event.target;
      if (rootRef.current?.contains(target)) return;
      if (listRef.current?.contains(target)) return;
      close();
    };

    const handleReposition = () => {
      updateMenuPosition();
    };

    document.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("resize", handleReposition);
    window.addEventListener("scroll", handleReposition, true);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("resize", handleReposition);
      window.removeEventListener("scroll", handleReposition, true);
    };
  }, [close, open, updateMenuPosition]);

  useEffect(() => {
    if (!open || highlightedIndex < 0) return;
    const optionEl = listRef.current?.querySelector(
      `[data-option-index="${highlightedIndex}"]`,
    );
    optionEl?.scrollIntoView?.({ block: "nearest" });
  }, [highlightedIndex, open]);

  const moveHighlight = (direction) => {
    if (!options.length) return;

    let index = highlightedIndex;
    for (let step = 0; step < options.length; step += 1) {
      index =
        direction === "down"
          ? (index + 1) % options.length
          : (index - 1 + options.length) % options.length;
      if (!options[index]?.disabled) {
        setHighlightedIndex(index);
        return;
      }
    }
  };

  const handleTriggerKeyDown = (event) => {
    if (disabled) return;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (!open) {
          openMenu();
        } else {
          moveHighlight("down");
        }
        break;
      case "ArrowUp":
        event.preventDefault();
        if (!open) {
          openMenu();
        } else {
          moveHighlight("up");
        }
        break;
      case "Home":
        if (open) {
          event.preventDefault();
          setHighlightedIndex(options.findIndex((option) => !option.disabled));
        }
        break;
      case "End":
        if (open) {
          event.preventDefault();
          for (let i = options.length - 1; i >= 0; i -= 1) {
            if (!options[i].disabled) {
              setHighlightedIndex(i);
              break;
            }
          }
        }
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        if (!open) {
          openMenu();
        } else if (highlightedIndex >= 0) {
          selectOption(options[highlightedIndex]);
        }
        break;
      case "Escape":
        if (open) {
          event.preventDefault();
          close();
        }
        break;
      case "Tab":
        if (open) close();
        break;
      default:
        break;
    }
  };

  const activeDescendant =
    open && highlightedIndex >= 0
      ? `${selectId}-option-${highlightedIndex}`
      : undefined;

  const duration = reduceMotion ? 0.01 : 0.16;
  const menuInitial = reduceMotion ? { opacity: 0 } : { opacity: 0, y: -4 };
  const menuAnimate = reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 };
  const menuExit = reduceMotion ? { opacity: 0 } : { opacity: 0, y: -4 };

  const {
    onBlur: _onBlur,
    onFocus: _onFocus,
    defaultValue: _defaultValue,
    ...restProps
  } = props;

  return (
    <div
      ref={rootRef}
      className={`flex flex-col gap-1.5 ${className}`.trim()}
    >
      {label ? (
        <label
          htmlFor={selectId}
          className="text-sm font-semibold text-text-primary"
        >
          {label}
        </label>
      ) : null}

      <div className="relative">
        <button
          {...restProps}
          ref={triggerRef}
          id={selectId}
          type="button"
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={open ? listboxId : undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId}
          aria-activedescendant={activeDescendant}
          onClick={toggleMenu}
          onKeyDown={handleTriggerKeyDown}
          className={`
            relative flex w-full items-center rounded-xl border bg-surface pl-4 pr-11 text-left
            transition-[border-color,box-shadow] duration-200
            focus:outline-none focus:ring-2 focus:ring-wanas-600/20 focus:border-wanas-600
            disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-text-disabled
            ${heightClass}
            ${error ? "border-danger-500 focus:border-danger-500 focus:ring-danger-500/20" : "border-border"}
            ${open && !error ? "border-wanas-600 ring-2 ring-wanas-600/20" : ""}
          `.trim()}
        >
          <span
            className={`truncate ${
              isPlaceholder || !displayLabel
                ? "text-text-muted"
                : "text-text-primary"
            } ${disabled ? "text-text-disabled" : ""}`}
          >
            {displayLabel || "Select…"}
          </span>
          <span
            className={`pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-text-muted transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
            aria-hidden="true"
          >
            <ChevronDown className="size-4" />
          </span>
        </button>

        {typeof document !== "undefined"
          ? createPortal(
              <AnimatePresence>
                {open && menuStyle ? (
                  <motion.ul
                    ref={listRef}
                    id={listboxId}
                    role="listbox"
                    tabIndex={-1}
                    aria-labelledby={selectId}
                    initial={menuInitial}
                    animate={menuAnimate}
                    exit={menuExit}
                    transition={{ duration, ease: EASE_OUT }}
                    style={menuStyle}
                    className="overflow-y-auto rounded-xl border border-border bg-surface p-1.5 shadow-dropdown"
                  >
                    {options.map((option, index) => {
                      const isSelected =
                        selectedOption?.value === option.value &&
                        selectedIndex === index;
                      const isHighlighted = highlightedIndex === index;

                      return (
                        <li
                          key={`${option.value}-${index}`}
                          id={`${selectId}-option-${index}`}
                          role="option"
                          data-option-index={index}
                          aria-selected={isSelected}
                          aria-disabled={option.disabled || undefined}
                          onMouseEnter={() => {
                            if (!option.disabled) setHighlightedIndex(index);
                          }}
                          onMouseDown={(event) => {
                            event.preventDefault();
                          }}
                          onClick={() => selectOption(option)}
                          className={`
                            flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2.5
                            ${optionTextClass}
                            ${
                              option.disabled
                                ? "cursor-not-allowed text-text-disabled"
                                : isSelected
                                  ? "bg-wanas-50 font-medium text-wanas-700"
                                  : isHighlighted
                                    ? "bg-surface-soft text-text-primary"
                                    : "text-text-primary"
                            }
                          `.trim()}
                        >
                          <span className="min-w-0 truncate">{option.label}</span>
                          {isSelected ? (
                            <Check
                              className="size-4 shrink-0 text-wanas-700"
                              aria-hidden="true"
                            />
                          ) : null}
                        </li>
                      );
                    })}
                  </motion.ul>
                ) : null}
              </AnimatePresence>,
              document.body,
            )
          : null}
      </div>

      {error ? (
        <p id={errorId} role="alert" className="text-sm text-danger-600">
          {error}
        </p>
      ) : null}
    </div>
  );
};

export default Select;
