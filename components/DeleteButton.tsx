"use client";

// A submit button that confirms before firing its parent form's server action.
export function DeleteButton({
  label = "Delete",
  confirm = "Delete this item? This cannot be undone.",
  className = "btn-danger",
}: {
  label?: string;
  confirm?: string;
  className?: string;
}) {
  return (
    <button
      type="submit"
      className={className}
      onClick={(e) => {
        if (!window.confirm(confirm)) e.preventDefault();
      }}
    >
      {label}
    </button>
  );
}
