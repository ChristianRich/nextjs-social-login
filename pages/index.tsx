import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "../styles/Home.module.css";
import stylesSignIn from "../styles/Signin.module.css";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next";
import { DefaultPageProps } from "./_app";
import { getEnvVars } from "../utils/env";

const inter = Inter({ subsets: ["latin"] });

export interface Props extends DefaultPageProps {
  envVars?: any; // For debugging
}

export default function Home(props: Props) {
  const {
    locals: {
      location: { origin },
    },
  } = props;

  const { data: session } = useSession();

  return (
    <>
      <Head>
        <title>Cloud-function marketplace | slshub.com</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div style={{ position: "absolute", left: 0, top: 0, padding: "10px" }}>
        <span className={inter.className}>v1.0.6</span>
      </div>
      <main className={styles.main}>
        <div className={styles.description}>
          {!session && (
            <div className={styles.grid}>
              <Link
                href={{
                  pathname: `${origin}/auth/signin`,
                  query: { redirectURL: `${origin}/account` },
                }}
              >
                <div
                  style={{ border: "1px solid", padding: "16px" }}
                  className={stylesSignIn.primaryBtn}
                >
                  Login / Register
                </div>
              </Link>
            </div>
          )}
          <div>
            <a
              href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              By{" "}
              <Image
                src="/vercel.svg"
                alt="Vercel Logo"
                className={styles.vercelLogo}
                width={100}
                height={24}
                priority
              />
            </a>
          </div>
        </div>

        <div className={styles.center}>
          <Image
            className={styles.logo}
            src="/next.svg"
            alt="Next.js Logo"
            width={180}
            height={37}
            priority
          />
          <div className={styles.thirteen}>
            <Image
              src="/thirteen.svg"
              alt="13"
              width={40}
              height={31}
              priority
            />
          </div>
        </div>

        <div className={styles.grid}>
          <a
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className={inter.className}>
              Docs <span>-&gt;</span>
            </h2>
            <p className={inter.className}>
              Find in-depth information about Next.js features and&nbsp;API.
            </p>
          </a>

          <a
            href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className={inter.className}>
              Learn <span>-&gt;</span>
            </h2>
            <p className={inter.className}>
              Learn about Next.js in an interactive course with&nbsp;quizzes!
            </p>
          </a>

          <a
            href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className={inter.className}>
              Templates <span>-&gt;</span>
            </h2>
            <p className={inter.className}>
              Discover and deploy boilerplate example Next.js&nbsp;projects.
            </p>
          </a>

          <a
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className={inter.className}>
              Deploy <span>-&gt;</span>
            </h2>
            <p className={inter.className}>
              Instantly deploy your Next.js site to a shareable URL
              with&nbsp;Vercel.
            </p>
          </a>
        </div>
      </main>
    </>
  );
}

// https://nextjs.org/docs/basic-features/data-fetching/get-server-side-props
export const getServerSideProps: GetServerSideProps<any> = async ({
  req: _req,
}: GetServerSidePropsContext): Promise<GetServerSidePropsResult<any>> => {
  return {
    props: {
      // envVars: getEnvVars(),
      featuredProducts: [{ id: "1" }, { id: 2 }],
    },
  };
};
