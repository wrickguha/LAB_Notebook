// --- UI Primitives ---
import { Button } from "@/components/tiptap-ui-primitive/button"

// --- Icons ---
import { MoonStarIcon } from "@/components/tiptap-icons/moon-star-icon"
import { SunIcon } from "@/components/tiptap-icons/sun-icon"
import { useApp } from "@/context/AppContext"

export function ThemeToggle() {
  const { themePreference, setThemePreference } = useApp()
  const isDarkMode = themePreference === "dark"

  return (
    <Button
      onClick={() => setThemePreference(isDarkMode ? "light" : "dark")}
      aria-label={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
      variant="ghost"
    >
      {isDarkMode ? (
        <MoonStarIcon className="tiptap-button-icon" />
      ) : (
        <SunIcon className="tiptap-button-icon" />
      )}
    </Button>
  )
}
