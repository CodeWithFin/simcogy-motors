"use client";

export function LogoutButton() {
  return (
    <button
      type="button"
      className="text-xs text-muted hover:text-accent transition-colors text-left"
      onClick={async () => {
        await fetch("/api/admin/login", { method: "DELETE" });
        window.location.href = "/admin/login";
      }}
    >
      Sign out
    </button>
  );
}
