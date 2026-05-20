import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useThemeStore } from "../store/theme.store";
import { useUserStore } from "../store/user.store";
import { removeItem } from "../utils/localstorage";

const SETTINGS_STORAGE_KEY = "bookhaven-settings";

const defaultSettings = {
  appearance: "light",
  language: "English",
  emailNotifications: true,
  newArrivals: true,
  priceDropAlerts: false,
  weeklyDigest: true,
} as const;

type SettingsState = {
  appearance: "light" | "dark";
  language: string;
  emailNotifications: boolean;
  newArrivals: boolean;
  priceDropAlerts: boolean;
  weeklyDigest: boolean;
};

const languageOptions = ["English", "Uzbek", "Russian"];

const loadSettings = (): SettingsState => {
  if (typeof window === "undefined") return { ...defaultSettings };
  const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
  if (!saved) return { ...defaultSettings };

  try {
    const parsed = JSON.parse(saved) as Partial<SettingsState>;
    return {
      ...defaultSettings,
      ...parsed,
    };
  } catch {
    return { ...defaultSettings };
  }
};

const saveSettings = (settings: SettingsState) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
};

const Settings = () => {
  const navigate = useNavigate();
  const userStore = useUserStore();
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const [settings, setSettings] = useState<SettingsState>(loadSettings);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    setSettings((prev) => ({ ...prev, appearance: theme }));
  }, [theme]);

  const isDarkMode = theme === "dark";

  const pageClasses = useMemo(
    () =>
      isDarkMode
        ? "min-h-screen bg-[#0F1B15] text-[#EBF3E8]"
        : "min-h-screen bg-[#F8FAF5] text-[#1F2F28]",
    [isDarkMode],
  );

  const sectionClasses = useMemo(
    () =>
      isDarkMode
        ? "bg-[#15261F] border-[#23412F] text-[#EBF3E8]"
        : "bg-white border-[#E6E0D7] text-[#1F2F28]",
    [isDarkMode],
  );

  const updateSetting = <K extends keyof SettingsState>(
    key: K,
    value: SettingsState[K],
  ) => {
    if (key === "appearance") {
      setTheme(value as "light" | "dark");
    }

    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleDeleteAccount = () => {
    userStore.logOut();
    removeItem("token");
    setConfirmDeleteOpen(false);
    navigate("/sign-in");
  };

  return (
    <div className={pageClasses}>
      <div className="container py-12">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <p className="text-sm uppercase tracking-[0.22em] text-[#7A7A7A]">
              Settings
            </p>
            <h1 className="mt-3 text-3xl font-semibold">
              Manage your preferences
            </h1>
            <p className="mt-2 text-sm text-[#6B6B6B] max-w-2xl">
              Customize your BookHaven experience, control notifications, and
              secure your account.
            </p>
          </div>

          <div className="grid gap-6">
            <section
              className={`rounded-[28px] border p-6 shadow-sm ${sectionClasses}`}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Appearance</h2>
                  <p className="mt-2 text-sm text-[#6B6B6B]">
                    Choose your preferred theme.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {(["light", "dark"] as const).map((theme) => (
                  <button
                    key={theme}
                    type="button"
                    onClick={() => updateSetting("appearance", theme)}
                    className={`rounded-2xl border px-5 py-4 text-left transition-all duration-150 focus:outline-none ${
                      settings.appearance === theme
                        ? "border-[#1F2F28] bg-[#F8F2E8]"
                        : "border-[#D9D9D9] bg-transparent hover:border-[#1F2F28]"
                    }`}
                  >
                    <p className="font-semibold capitalize">{theme}</p>
                    <p className="mt-2 text-sm text-[#6B6B6B]">
                      {theme === "light"
                        ? "Bright and calm reading mode."
                        : "Soft and focused dark mode."}
                    </p>
                  </button>
                ))}
              </div>
            </section>

            <section
              className={`rounded-[28px] border p-6 shadow-sm ${sectionClasses}`}
            >
              <div>
                <h2 className="text-xl font-semibold">Language</h2>
                <p className="mt-2 text-sm text-[#6B6B6B]">
                  Choose your preferred language.
                </p>
              </div>
              <div className="mt-6 max-w-sm">
                <label className="block text-sm font-medium mb-2">
                  Language
                </label>
                <select
                  value={settings.language}
                  onChange={(event) =>
                    updateSetting("language", event.target.value)
                  }
                  className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] focus:outline-none"
                >
                  {languageOptions.map((language) => (
                    <option key={language} value={language}>
                      {language}
                    </option>
                  ))}
                </select>
              </div>
            </section>

            <section
              className={`rounded-[28px] border p-6 shadow-sm ${sectionClasses}`}
            >
              <div>
                <h2 className="text-xl font-semibold">Notifications</h2>
                <p className="mt-2 text-sm text-[#6B6B6B]">
                  Manage how you receive notifications.
                </p>
              </div>

              <div className="mt-6 grid gap-4">
                {[
                  {
                    label: "Email notifications",
                    description: "Receive updates about new books and offers.",
                    key: "emailNotifications" as const,
                  },
                  {
                    label: "New arrivals from followed authors",
                    description:
                      "Get notified when a favorite author publishes.",
                    key: "newArrivals" as const,
                  },
                  {
                    label: "Price drop alerts",
                    description:
                      "Notifications when favorited books go on sale.",
                    key: "priceDropAlerts" as const,
                  },
                  {
                    label: "Weekly reading digest",
                    description:
                      "A curated list of recommended books each week.",
                    key: "weeklyDigest" as const,
                  },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-4"
                  >
                    <div>
                      <p className="font-medium text-[#1F2F28]">{item.label}</p>
                      <p className="mt-1 text-sm text-[#6B6B6B]">
                        {item.description}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings[item.key]}
                        onChange={(event) =>
                          updateSetting(item.key, event.target.checked)
                        }
                        className="peer sr-only"
                      />
                      <div className="h-6 w-11 rounded-full bg-[#D9D9D9] peer-checked:bg-[#1F2F28] transition-colors" />
                      <span
                        className={`absolute left-1 top-1 h-4 w-4 rounded-full bg-[var(--surface)] shadow transition-transform peer-checked:translate-x-5`}
                      />
                    </label>
                  </div>
                ))}
              </div>
            </section>

            <section
              className={`rounded-[28px] border p-6 shadow-sm ${sectionClasses}`}
            >
              <div>
                <h2 className="text-xl font-semibold">Danger Zone</h2>
                <p className="mt-2 text-sm text-[#6B6B6B]">
                  Once you delete your account, there is no going back. All your
                  data will be removed.
                </p>
              </div>
              <div className="mt-6 rounded-3xl border border-[#F2C1BF] bg-[#FFF1F0] p-6">
                <p className="text-base font-semibold text-[#A32D2D]">
                  Delete Account
                </p>
                <p className="mt-2 text-sm text-[#7A3A3A]">
                  Once you delete your account, there is no going back. Your
                  profile and preferences will be permanently removed.
                </p>
                <button
                  type="button"
                  onClick={() => setConfirmDeleteOpen(true)}
                  className="mt-5 inline-flex items-center justify-center rounded-full bg-[#C0392B] px-5 py-3 text-sm font-semibold text-white hover:bg-[#992827] transition-colors"
                >
                  Delete My Account
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>

      {confirmDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg rounded-[28px] bg-[var(--surface)] p-8 shadow-2xl">
            <h3 className="text-2xl font-semibold text-[#1F2F28]">
              Delete your account
            </h3>
            <p className="mt-3 text-sm text-[#6B6B6B]">
              This action cannot be undone. If you delete your account, your
              current session will end and your preferences will be cleared.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-5 py-3 text-sm font-medium text-[var(--text)] hover:bg-[var(--surface-strong)] transition-colors"
                onClick={() => setConfirmDeleteOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded-full bg-[#C0392B] px-5 py-3 text-sm font-semibold text-white hover:bg-[#992827] transition-colors"
                onClick={handleDeleteAccount}
              >
                Yes, delete account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
