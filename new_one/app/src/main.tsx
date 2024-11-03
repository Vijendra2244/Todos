import { lazy } from "react";
import ReactDOM from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router-dom";
import "./scss/base.scss";
import * as Sentry from "@sentry/react";

const PopupPage = lazy(() => import("./pages/Popup"));
const SideBarPage = lazy(() => import("./pages/SideBar"));
const AnalyticPage = lazy(() => import("./pages/Analytic"));
const Catchup = lazy(() => import("./pages/Catchup"));
const OuterSidebar = lazy(() => import("./pages/OuterSidebar"));
const LandingPage = lazy(() => import("./pages/LandingPage"));
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Nudges from "./components/Nudges";
import GlobalContextProvider from "./contextAPI/GlobalContextProvider";



const theme = createTheme({
  direction: "ltr",
  components: {
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontFamily: "Poppins",
        },
      },
    },
  },
});

const router = createHashRouter([
  {
    path: "/popup",
    element: <PopupPage />,
  },
  {
    path: "/sidebar",
    element: <SideBarPage />,
  },
  {
    path: "/analytic-page",
    element: <AnalyticPage />,
  },
  {
    path: "/catchup-page",
    element: <Catchup />,
  },
  {
    path: "/outer-sidebar",
    element: <OuterSidebar />,
  },
  {
    path: "/landing-page",
    element: <LandingPage />,
  },
  {
    path: "/nudges",
    element: <Nudges />,
  },
  
 
]);

Sentry.init({
  dsn: "https://1ba2e2765b7fa7b6effbab0764f4dd3c@o4506856607580160.ingest.us.sentry.io/4506856870313984",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <GlobalContextProvider>
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  </GlobalContextProvider>
);
