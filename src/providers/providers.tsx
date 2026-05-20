import { useEffect } from "react";
import { ThemeProvider } from "flowbite-react";
import { customTheme } from "../config/flowbite";
import { RouterProvider } from "react-router-dom";
import { routes } from "../routes/routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import { useThemeStore } from "../store/theme.store";

interface Props {}

const queryClient = new QueryClient();

const Providers = ({}: Props) => {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    const isDark = theme === "dark";
    document.documentElement.classList.toggle("dark", isDark);
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  return (
    <QueryClientProvider client={queryClient}>
      <ToastContainer />
      <ThemeProvider theme={customTheme}>
        <RouterProvider router={routes} />
      </ThemeProvider>
    </QueryClientProvider>
  );
};
export default Providers;
