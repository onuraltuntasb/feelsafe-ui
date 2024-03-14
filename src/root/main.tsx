import { createRoot } from "react-dom/client"
import { Provider } from "react-redux"
import { store } from "../redux/store"
import "./style/index.css"
import { RouterProvider, createBrowserRouter } from "react-router-dom"

import "@fontsource/roboto/300.css"
import "@fontsource/roboto/400.css"
import "@fontsource/roboto/500.css"
import "@fontsource/roboto/700.css"
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material"
import getLPTheme from "./style/theme/themes"
import LandingPage from "../pages/LandingPage"
import ErrorPage from "../pages/ErrorPage"
import SignupPage from "../pages/auth/SignupPage"
import SigninPage from "../pages/auth/SigninPage"
import DashboardPage from "../pages/DashboardPage"
import PrivateRoute from "../comps/PrivateRoute"
import { SnackbarProvider } from "notistack"
import ListDiaryPage from "../pages/ListDiaryPage"

const mode = "light"

const LPtheme = createTheme(getLPTheme(mode))

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivateRoute notRedirect={true}>
        <LandingPage />
      </PrivateRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "signup",
    element: <SignupPage />,
  },
  {
    path: "signin",
    element: <SigninPage />,
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute notRedirect={false}>
        <DashboardPage />
      </PrivateRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: "diary",
        element: <ListDiaryPage />,
      },
    ],
  },
])

const container = document.getElementById("root")

if (container) {
  const root = createRoot(container)

  root.render(
    <SnackbarProvider>
      <ThemeProvider theme={LPtheme}>
        <Provider store={store}>
          <RouterProvider router={router} />
          <CssBaseline />
        </Provider>
      </ThemeProvider>
    </SnackbarProvider>,
  )
} else {
  throw new Error(
    "Root element with ID 'root' was not found in the document. Ensure there is a corresponding HTML element with the ID 'root' in your HTML file.",
  )
}
