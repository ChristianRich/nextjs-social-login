/* eslint-disable @next/next/no-img-element */
import { getCsrfToken } from "next-auth/react";
import styles from "../../../styles/Signin.module.css";
import SignInRegister from "../../../components/signin-register";

// https://cloudcoders.xyz/blog/nextauth-credentials-provider-with-external-api-and-login-page/
const Signin = ({ csrfToken }) => {
  return (
    <>
      <SignInRegister csrfToken={csrfToken} />
      <img
        src="/login_pattern.svg"
        alt="Pattern Background"
        className={styles.styledPattern}
      />
    </>
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
