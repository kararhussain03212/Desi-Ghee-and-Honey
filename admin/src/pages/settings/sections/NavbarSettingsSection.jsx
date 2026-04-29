import ImageUpload from "../../../components/ImageUpload";
import FieldRows from "./FieldRows";

export default function NavbarSettingsSection({
  fieldKeys,
  form,
  setField,
  toLabel,
  toImageUrl,
  uploadToSetting,
  navLinks,
  setNavLinks,
}) {
  return (
    <>
      <FieldRows keys={fieldKeys} form={form} setField={setField} toLabel={toLabel} />

      <div className="grid grid-cols-1 gap-2 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-card-elevated)] p-3 md:grid-cols-[280px_1fr] md:items-start">
        <label className="pt-2 text-sm font-semibold text-[var(--admin-ink)]">Navbar Logo</label>
        <ImageUpload
          value={toImageUrl(form.nav_logo)}
          onFileSelect={(file) => uploadToSetting("nav_logo", file, "settings")}
          label="Upload Navbar Logo"
          helperText="PNG, JPG, SVG"
        />
      </div>

      <div className="space-y-3 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-card-elevated)] p-4">
        <h4 className="text-sm font-semibold text-[var(--admin-ink)]">Navbar Links</h4>
        {navLinks.map((item, index) => (
          <div key={`nav-${index}`} className="grid grid-cols-1 gap-2 md:grid-cols-[1fr_1fr_auto]">
            <input
              type="text"
              placeholder="Label"
              value={item.label}
              onChange={(event) =>
                setNavLinks((prev) => prev.map((x, i) => (i === index ? { ...x, label: event.target.value } : x)))
              }
              className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-bg)] px-3 py-2 text-[var(--admin-ink)]"
            />
            <input
              type="text"
              placeholder="Path"
              value={item.path}
              onChange={(event) =>
                setNavLinks((prev) => prev.map((x, i) => (i === index ? { ...x, path: event.target.value } : x)))
              }
              className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-bg)] px-3 py-2 text-[var(--admin-ink)]"
            />
            <button
              type="button"
              onClick={() => setNavLinks((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev))}
              className="rounded-lg border border-red-500 bg-red-500/10 px-3 py-2 font-medium text-red-400 hover:bg-red-500/20"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setNavLinks((prev) => [...prev, { label: "", path: "" }])}
          className="rounded-lg bg-[var(--admin-accent)] px-3 py-2 text-sm font-semibold text-black hover:bg-[var(--admin-accent-strong)]"
        >
          + Add Link
        </button>
      </div>
    </>
  );
}
