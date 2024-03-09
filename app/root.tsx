import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction, MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import styles from "./tailwind.css";
import { NavBar } from "./components/NavBar";
import { useDataStore } from "./stores/useDataStore";
import { useEffect } from "react";

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  { rel: "stylesheet", href: styles },
];

export const meta: MetaFunction = () => {
  return [
    { title: "HN Offline" },
    {
      name: "description",
      content: "Hacker News client built for offline usage",
    },
    {
      name: "manifest",
      content: "/manifest.json",
    },
    {
      name: "apple-mobile-web-app-capable",
      content: "yes",
    },
    {
      name: "apple-mobile-web-app-status-bar-style",
      content: "black",
    },
    {
      name: "apple-mobile-web-app-title",
      content: "HN Offline",
    },
  ];
};

export default function App() {
  // initialize local storage at top
  const initLocalForage = useDataStore((s) => s.initializeFromLocalForage);

  useEffect(() => {
    initLocalForage();
  }, [initLocalForage]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-orange-50">
        <main className="bg-white mx-auto flex min-h-screen flex-col items-center justify-between pb-24 max-w-[640px] w-full ">
          <NavBar />

          <div className="border flex-1 w-full p-1">
            <Outlet />
          </div>
        </main>

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
