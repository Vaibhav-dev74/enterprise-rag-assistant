import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {

  const [dark, setDark] = useState(() => {
    return localStorage.getItem("theme") !== "light";
  });

  useEffect(() => {

    const root =
      document.documentElement;

    if (dark) {
      root.classList.add("dark");
      root.style.colorScheme = "dark";

      localStorage.setItem(
        "theme",
        "dark"
      );
    } else {
      root.classList.remove("dark");
      root.style.colorScheme = "light";

      localStorage.setItem(
        "theme",
        "light"
      );
    }

  }, [dark]);

  const toggleTheme = () => {
    setDark((current) => !current);
  };

  return (
    <ThemeContext.Provider
      value={{
        dark,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {

  const context =
    useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useTheme must be used inside ThemeProvider"
    );
  }

  return context;
}