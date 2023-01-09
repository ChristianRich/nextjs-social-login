import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import Header from "../components/header";
import absoluteUrl from "next-absolute-url";
import { AppContext } from "next/app";
import { ReactElement } from "react";
import { getEnvVars } from "../utils/env";

interface CustomAppProps {
  Component: AppProps["Component"];
  pageProps: AppProps["pageProps"];
  session: any; // TODO Must be typed
  locals: Locals;
}

// Locals are passed to all pages by default
interface Locals {
  location: Location;
}

export interface Location {
  host: string; // "localhost:3000"
  origin: string; // "http://localhost:3000"
  protocol: string; // "http"
}

export interface DefaultPageProps {
  locals: Locals;
}

/**
 * https://nextjs.org/docs/advanced-features/custom-app
 * @param {T} Component The Component prop is the active page  any props you send to Component will be received by the page
 * @param {T} pageProps Object with the initial props that were preloaded for your page by one of our data fetching methods, otherwise empty
 * @returns
 */
export default function App(props: CustomAppProps): ReactElement {
  const { Component, pageProps, session, locals } = props;

  return (
    <SessionProvider session={session}>
      <Header />
      <Component {...pageProps} locals={locals} />
    </SessionProvider>
  );
}

// Local variables pinned to all pages
App.getInitialProps = async (
  appContext: AppContext
): Promise<Partial<CustomAppProps>> => {
  const {
    ctx: { req },
  } = appContext;

  console.log("console.log");
  console.info("console.info");
  console.error("console.error");
  console.debug("console.debug");

  console.debug(getEnvVars());

  return {
    locals: {
      location: absoluteUrl(req),
    },
  };
};
