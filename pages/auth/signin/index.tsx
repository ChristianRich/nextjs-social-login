import { signIn, getCsrfToken } from "next-auth/react";
import styles from "../../../styles/Signin.module.css";
import {
  GoogleLoginButton,
  GithubLoginButton,
  AppleLoginButton,
} from "react-social-login-buttons";
import { Inter } from "@next/font/google";
import Credentials from "../../../components/signin/credentials";

const inter = Inter({ subsets: ["latin"] });

// https://cloudcoders.xyz/blog/nextauth-credentials-provider-with-external-api-and-login-page/
const Signin = ({ csrfToken }) => {
  return (
    <div style={{ overflow: "hidden", position: "relative" }}>
      <div className={styles.wrapper} />
      <div className={styles.content}>
        <div className={styles.cardWrapper}>
          <h1 className={inter.className}>Login or register</h1>
          <div className={styles.cardContent}>
            <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
            <Credentials />
            <hr />
            <GithubLoginButton
              style={{ fontSize: "16px", marginBottom: "20px" }}
              onClick={() => signIn("github")}
            />
            <GoogleLoginButton
              style={{ fontSize: "16px", marginBottom: "20px" }}
              onClick={() => signIn("google")}
            />
            <AppleLoginButton
              style={{ fontSize: "16px", marginBottom: "20px" }}
              onClick={() => signIn("apple")}
            />
          </div>
        </div>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/login_pattern.svg"
        alt="Pattern Background"
        className={styles.styledPattern}
      />
    </div>
  );
};

export default Signin;

export async function getServerSideProps(context) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}
