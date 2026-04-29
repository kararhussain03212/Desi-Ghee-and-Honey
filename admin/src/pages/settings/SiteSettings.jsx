import { useEffect, useMemo, useState } from "react";
import { uploadImage } from "../../api/uploadApi";
import { getSettings, updateSettings } from "../../api/settingApi";
import NavbarSettingsSection from "./sections/NavbarSettingsSection";
import HomeAboutSettingsSection from "./sections/HomeAboutSettingsSection";
import HomeCompanySettingsSection from "./sections/HomeCompanySettingsSection";
import HomeOfferSettingsSection from "./sections/HomeOfferSettingsSection";
import FooterSettingsSection from "./sections/FooterSettingsSection";
import ProductSettingsSection from "./sections/ProductSettingsSection";
import ContactSettingsSection from "./sections/ContactSettingsSection";

const textFieldConfig = [
  { key: "site_brand_text", section: "navbar" },
  { key: "nav_cart_label", section: "navbar" },
  { key: "nav_cart_path", section: "navbar" },
  { key: "nav_logo", section: "navbar" },
  { key: "home_about_kicker", section: "home.about" },
  { key: "home_about_title", section: "home.about" },
  { key: "home_about_description", section: "home.about" },
  { key: "home_about_button_text", section: "home.about" },
  { key: "home_about_button_link", section: "home.about" },
  { key: "home_about_image", section: "home.about" },
  { key: "home_about_properties_title", section: "home.about" },
  { key: "home_company_kicker", section: "home.company" },
  { key: "home_company_title", section: "home.company" },
  { key: "home_company_accent", section: "home.company" },
  { key: "home_company_suffix", section: "home.company" },
  { key: "home_company_text", section: "home.company" },
  { key: "home_company_button_text", section: "home.company" },
  { key: "home_company_button_link", section: "home.company" },
  { key: "home_company_image", section: "home.company" },
  { key: "home_products_title", section: "home.company" },
  { key: "home_products_description", section: "home.company" },
  { key: "home_offer_title", section: "home.offer" },
  { key: "home_offer_accent", section: "home.offer" },
  { key: "home_offer_description", section: "home.offer" },
  { key: "home_offer_button_text", section: "home.offer" },
  { key: "home_offer_button_link", section: "home.offer" },
  { key: "home_offer_image", section: "home.offer" },
  { key: "home_testimonials_title", section: "home.offer" },
  { key: "home_testimonials_description", section: "home.offer" },
  { key: "home_newsletter_title", section: "home.offer" },
  { key: "home_newsletter_description", section: "home.offer" },
  { key: "home_newsletter_button_text", section: "home.offer" },
  { key: "home_newsletter_placeholder", section: "home.offer" },
  { key: "home_newsletter_success", section: "home.offer" },
  { key: "home_newsletter_error", section: "home.offer" },
  { key: "footer_logo", section: "footer" },
  { key: "footer_description", section: "footer" },
  { key: "footer_account_title", section: "footer" },
  { key: "footer_newsletter_title", section: "footer" },
  { key: "footer_newsletter_description", section: "footer" },
  { key: "footer_copyright", section: "footer" },
  { key: "footer_credit_text", section: "footer" },
  { key: "footer_credit_url", section: "footer" },
  { key: "product_page_hero_image", section: "product" },
  { key: "product_page_title", section: "product" },
  { key: "product_page_breadcrumb_home", section: "product" },
  { key: "product_page_breadcrumb_current", section: "product" },
  { key: "product_showcase_kicker", section: "product" },
  { key: "product_showcase_title", section: "product" },
  { key: "product_showcase_text", section: "product" },
  { key: "product_catalog_title", section: "product" },
  { key: "product_catalog_title_highlight", section: "product" },
  { key: "product_catalog_description", section: "product" },
  { key: "contact_page_hero_image", section: "contact" },
  { key: "contact_page_title", section: "contact" },
  { key: "contact_page_breadcrumb_home", section: "contact" },
  { key: "contact_page_breadcrumb_current", section: "contact" },
  { key: "contact_section_title", section: "contact" },
  { key: "contact_section_description", section: "contact" },
  { key: "contact_location_title", section: "contact" },
  { key: "contact_location_text", section: "contact" },
  { key: "contact_phone_title", section: "contact" },
  { key: "contact_phone_text", section: "contact" },
  { key: "contact_email_title", section: "contact" },
  { key: "contact_email_text", section: "contact" },
  { key: "contact_form_title", section: "contact" },
  { key: "contact_form_button_text", section: "contact" },
  { key: "contact_form_whatsapp_prefix", section: "contact" },
  { key: "contact_map_embed_url", section: "contact" },
  { key: "contact_map_title", section: "contact" },
  { key: "whatsapp_number", section: "contact" },
  { key: "whatsapp_tooltip", section: "contact" },
];

const imageSettingKeys = new Set([
  "nav_logo",
  "footer_logo",
  "product_page_hero_image",
  "contact_page_hero_image",
  "home_about_image",
  "home_company_image",
  "home_offer_image",
]);

const createEmptyTextForm = () =>
  textFieldConfig.reduce((acc, field) => {
    acc[field.key] = "";
    return acc;
  }, {});

const parseJsonArray = (value, fallback) => {
  if (typeof value !== "string" || !value.trim()) return fallback;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
};

const decodeHtmlEntities = (value) =>
  String(value ?? "")
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#039;", "'");

const toLabel = (key) =>
  key
    .replaceAll("_", " ")
    .replace(/\b\w/g, (m) => m.toUpperCase());

export default function SiteSettings({ forcedMainSection = "", forcedHomeSection = "" }) {
  const [activeMainSection, setActiveMainSection] = useState(forcedMainSection || "navbar");
  const [activeHomeSection, setActiveHomeSection] = useState(forcedHomeSection || "about");
  const [form, setForm] = useState(createEmptyTextForm);
  const [navLinks, setNavLinks] = useState([{ label: "", path: "" }]);
  const [aboutProperties, setAboutProperties] = useState([""]);
  const [gheeCards, setGheeCards] = useState([{ icon: "cow", icon_url: "", title: "", description: "" }]);
  const [footerLinks, setFooterLinks] = useState([{ label: "", path: "" }]);
  const [footerSocialLinks, setFooterSocialLinks] = useState([{ label: "", url: "", icon: "facebook" }]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [sectionStatus, setSectionStatus] = useState({
    navbar: "active",
    home_about: "active",
    home_company: "active",
    home_offer: "active",
    footer: "active",
    product: "active",
    contact: "active",
  });

  const apiRoot = useMemo(() => {
    const base = import.meta.env.VITE_API_URL || "";
    return base.replace(/\/api\/?$/, "");
  }, []);

  const fieldSectionMap = useMemo(
    () => textFieldConfig.reduce((acc, field) => ({ ...acc, [field.key]: field.section }), {}),
    [],
  );

  const headerTitle = useMemo(() => {
    if (activeMainSection === "home") {
      if (activeHomeSection === "about") return "Home - About Settings";
      if (activeHomeSection === "company") return "Home - Company & Products Settings";
      if (activeHomeSection === "offer") return "Home - Offer / Testimonial / Newsletter Settings";
    }
    if (activeMainSection === "navbar") return "Navbar Settings";
    if (activeMainSection === "footer") return "Footer Settings";
    if (activeMainSection === "product") return "Product Page Settings";
    if (activeMainSection === "contact") return "Contact & WhatsApp Settings";
    return "Site Settings";
  }, [activeHomeSection, activeMainSection]);

  const currentStatusKey = useMemo(() => {
    if (activeMainSection === "home") return `home_${activeHomeSection}`;
    if (["navbar", "footer", "product", "contact"].includes(activeMainSection)) return activeMainSection;
    return "navbar";
  }, [activeHomeSection, activeMainSection]);

  const toImageUrl = (value) => {
    if (!value) return "";
    if (value.startsWith("http")) return value;
    if (value.startsWith("/uploads/")) return apiRoot + value;
    if (value.startsWith("/")) return apiRoot + value;
    return apiRoot + "/uploads/" + value;
  };

  useEffect(() => {
    if (forcedMainSection) setActiveMainSection(forcedMainSection);
    if (forcedHomeSection) setActiveHomeSection(forcedHomeSection);
  }, [forcedHomeSection, forcedMainSection]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await getSettings();
        const rows = Array.isArray(res?.data?.data) ? res.data.data : [];

        const next = createEmptyTextForm();
        let nextNavLinks = [{ label: "", path: "" }];
        let nextAboutProperties = [""];
        let nextGheeCards = [{ icon: "cow", icon_url: "", title: "", description: "" }];
        let nextFooterLinks = [{ label: "", path: "" }];
        let nextFooterSocialLinks = [{ label: "", url: "", icon: "facebook" }];
        const nextSectionStatus = { ...sectionStatus };

        rows.forEach((row) => {
          const key = String(row?.setting_key || "").trim();
          if (!key) return;
          const rawValue = decodeHtmlEntities(row?.setting_value ?? "");

          if (key.startsWith("section_status_")) {
            const statusKey = key.replace("section_status_", "");
            nextSectionStatus[statusKey] = rawValue === "inactive" ? "inactive" : "active";
            return;
          }

          if (key === "nav_links") {
            const parsed = parseJsonArray(rawValue, []);
            const normalized = parsed
              .map((item) => ({ label: String(item?.label || ""), path: String(item?.path || "") }))
              .filter((item) => item.label || item.path);
            if (normalized.length) nextNavLinks = normalized;
            return;
          }

          if (key === "home_about_properties") {
            const parsed = parseJsonArray(rawValue, []);
            const normalized = parsed.map((item) => String(item || "")).filter(Boolean);
            if (normalized.length) nextAboutProperties = normalized;
            return;
          }

          if (key === "home_ghee_cards") {
            const parsed = parseJsonArray(rawValue, []);
            const normalized = parsed
              .map((item) => ({
                icon: String(item?.icon || "cow"),
                icon_url: String(item?.icon_url || ""),
                title: String(item?.title || ""),
                description: String(item?.description || ""),
              }))
              .filter((item) => item.title || item.description || item.icon_url);
            if (normalized.length) nextGheeCards = normalized;
            return;
          }

          if (key === "footer_links") {
            const parsed = parseJsonArray(rawValue, []);
            const normalized = parsed
              .map((item) => ({ label: String(item?.label || ""), path: String(item?.path || "") }))
              .filter((item) => item.label || item.path);
            if (normalized.length) nextFooterLinks = normalized;
            return;
          }

          if (key === "footer_social_links") {
            const parsed = parseJsonArray(rawValue, []);
            const normalized = parsed
              .map((item) => ({
                label: String(item?.label || ""),
                url: String(item?.url || ""),
                icon: String(item?.icon || "facebook"),
              }))
              .filter((item) => item.label || item.url);
            if (normalized.length) nextFooterSocialLinks = normalized;
            return;
          }

          if (Object.prototype.hasOwnProperty.call(next, key)) next[key] = String(rawValue);
        });

        setForm(next);
        setNavLinks(nextNavLinks);
        setAboutProperties(nextAboutProperties);
        setGheeCards(nextGheeCards);
        setFooterLinks(nextFooterLinks);
        setFooterSocialLinks(nextFooterSocialLinks);
        setSectionStatus(nextSectionStatus);
      } catch (err) {
        console.error(err);
        setError("Failed to load settings from backend.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (error) setError("");
    if (success) setSuccess("");
  };

  const uploadToSetting = async (settingKey, file, folder = "settings") => {
    try {
      setUploading(true);
      const path = await uploadImage(file, folder);
      if (path) setField(settingKey, path);
    } catch (err) {
      console.error(err);
      setError("Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const uploadCardIcon = async (index, file) => {
    try {
      setUploading(true);
      const path = await uploadImage(file, "icons");
      if (!path) return;
      setGheeCards((prev) =>
        prev.map((item, i) => (i === index ? { ...item, icon_url: path } : item)),
      );
    } catch (err) {
      console.error(err);
      setError("Icon upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const payload = {};
      Object.keys(form).forEach((key) => {
        payload[key] = String(form[key] ?? "");
      });

      payload.nav_links = JSON.stringify(
        navLinks
          .map((item) => ({ label: String(item.label || "").trim(), path: String(item.path || "").trim() }))
          .filter((item) => item.label && item.path),
      );
      payload.home_about_properties = JSON.stringify(
        aboutProperties.map((item) => String(item || "").trim()).filter(Boolean),
      );
      payload.home_ghee_cards = JSON.stringify(
        gheeCards
          .map((item) => ({
            icon: String(item.icon || "cow").trim(),
            icon_url: String(item.icon_url || "").trim(),
            title: String(item.title || "").trim(),
            description: String(item.description || "").trim(),
          }))
          .filter((item) => item.title || item.description || item.icon_url),
      );
      payload.footer_links = JSON.stringify(
        footerLinks
          .map((item) => ({ label: String(item.label || "").trim(), path: String(item.path || "").trim() }))
          .filter((item) => item.label && item.path),
      );
      payload.footer_social_links = JSON.stringify(
        footerSocialLinks
          .map((item) => ({
            label: String(item.label || "").trim(),
            url: String(item.url || "").trim(),
            icon: String(item.icon || "facebook").trim(),
          }))
          .filter((item) => item.label && item.url),
      );
      Object.entries(sectionStatus).forEach(([statusKey, statusValue]) => {
        payload[`section_status_${statusKey}`] = statusValue;
      });

      await updateSettings(payload);
      setSuccess("Settings saved successfully.");
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    const onKeyDown = (event) => {
      const isSaveCombo = (event.ctrlKey || event.metaKey) && String(event.key || "").toLowerCase() === "s";
      if (!isSaveCombo) return;
      event.preventDefault();
      if (!loading && !saving && !uploading) handleSave();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [loading, saving, uploading, form, navLinks, aboutProperties, gheeCards, footerLinks, footerSocialLinks]);

  if (loading) return <p className="text-white/70">Loading settings...</p>;

  const getKeysFor = (sectionName) =>
    Object.keys(form).filter((key) => {
      if (imageSettingKeys.has(key)) return false;
      return fieldSectionMap[key] === sectionName;
    });

  return (
    <section className="space-y-4">
      <header className="rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-card)] px-4 py-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h2 className="text-2xl font-bold text-white">{headerTitle}</h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSectionStatus((prev) => ({ ...prev, [currentStatusKey]: "active" }))}
              className={
                sectionStatus[currentStatusKey] === "active"
                  ? "rounded-lg border border-[var(--admin-accent)] bg-[var(--admin-accent)] px-3 py-1.5 text-sm font-semibold text-black"
                  : "rounded-lg border border-[var(--admin-border)] bg-[var(--admin-bg-deep)] px-3 py-1.5 text-sm font-semibold text-[var(--admin-muted)] hover:bg-[var(--admin-card-elevated)]"
              }
            >
              Active
            </button>
            <button
              type="button"
              onClick={() => setSectionStatus((prev) => ({ ...prev, [currentStatusKey]: "inactive" }))}
              className={
                sectionStatus[currentStatusKey] === "inactive"
                  ? "rounded-lg border border-red-900 bg-red-900 px-3 py-1.5 text-sm font-semibold text-red-200"
                  : "rounded-lg border border-[var(--admin-border)] bg-[var(--admin-bg-deep)] px-3 py-1.5 text-sm font-semibold text-[var(--admin-muted)] hover:bg-[var(--admin-card-elevated)]"
              }
            >
              Inactive
            </button>
          </div>
        </div>
      </header>

      {error ? (
        <div className="rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-red-700">{error}</div>
      ) : null}
      {success ? (
        <div className="rounded-xl border border-green-500/25 bg-green-500/10 px-4 py-3 text-green-700">{success}</div>
      ) : null}

      <article className="space-y-4 rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-card)] p-4 shadow-sm md:p-5">
        {activeMainSection === "navbar" ? (
          <NavbarSettingsSection
            fieldKeys={getKeysFor("navbar")}
            form={form}
            setField={setField}
            toLabel={toLabel}
            toImageUrl={toImageUrl}
            uploadToSetting={uploadToSetting}
            navLinks={navLinks}
            setNavLinks={setNavLinks}
          />
        ) : null}

        {activeMainSection === "home" && activeHomeSection === "about" ? (
          <HomeAboutSettingsSection
            fieldKeys={getKeysFor("home.about")}
            form={form}
            setField={setField}
            toLabel={toLabel}
            toImageUrl={toImageUrl}
            uploadToSetting={uploadToSetting}
            aboutProperties={aboutProperties}
            setAboutProperties={setAboutProperties}
            gheeCards={gheeCards}
            setGheeCards={setGheeCards}
            uploadCardIcon={uploadCardIcon}
          />
        ) : null}

        {activeMainSection === "home" && activeHomeSection === "company" ? (
          <HomeCompanySettingsSection
            fieldKeys={getKeysFor("home.company")}
            form={form}
            setField={setField}
            toLabel={toLabel}
            toImageUrl={toImageUrl}
            uploadToSetting={uploadToSetting}
          />
        ) : null}

        {activeMainSection === "home" && activeHomeSection === "offer" ? (
          <HomeOfferSettingsSection
            fieldKeys={getKeysFor("home.offer")}
            form={form}
            setField={setField}
            toLabel={toLabel}
            toImageUrl={toImageUrl}
            uploadToSetting={uploadToSetting}
          />
        ) : null}

        {activeMainSection === "footer" ? (
          <FooterSettingsSection
            fieldKeys={getKeysFor("footer")}
            form={form}
            setField={setField}
            toLabel={toLabel}
            toImageUrl={toImageUrl}
            uploadToSetting={uploadToSetting}
            footerLinks={footerLinks}
            setFooterLinks={setFooterLinks}
            footerSocialLinks={footerSocialLinks}
            setFooterSocialLinks={setFooterSocialLinks}
          />
        ) : null}

        {activeMainSection === "product" ? (
          <ProductSettingsSection
            fieldKeys={getKeysFor("product")}
            form={form}
            setField={setField}
            toLabel={toLabel}
            toImageUrl={toImageUrl}
            uploadToSetting={uploadToSetting}
          />
        ) : null}

        {activeMainSection === "contact" ? (
          <ContactSettingsSection
            fieldKeys={getKeysFor("contact")}
            form={form}
            setField={setField}
            toLabel={toLabel}
            toImageUrl={toImageUrl}
            uploadToSetting={uploadToSetting}
          />
        ) : null}
      </article>

      <div className="sticky bottom-4 z-10 flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || uploading}
          className="rounded-xl bg-[var(--admin-primary)] px-5 py-2.5 text-white shadow-sm hover:bg-[var(--admin-primary-strong)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving..." : uploading ? "Uploading..." : "Save Settings"}
        </button>
      </div>
    </section>
  );
}
