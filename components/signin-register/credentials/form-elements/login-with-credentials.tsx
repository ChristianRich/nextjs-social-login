import { useState } from "react";
import { Inter } from "@next/font/google";
import styles from "../../../../styles/Signin.module.css";
import { signIn, SignInResponse } from "next-auth/react";
import { useRouter } from "next/router";

const inter = Inter({ subsets: ["latin"] });

type Props = {
  isLoading: boolean;
  setIsLoading(isLoading: boolean): void;
  setError(message: string): void;
  existingUserEmail: string;
};

// https://cloudcoders.xyz/blog/nextauth-credentials-provider-with-external-api-and-login-page/
const LoginWithCredentialsForm = (props: Props): React.ReactElement<Props> => {
  const router = useRouter();
  const { setError, existingUserEmail, isLoading, setIsLoading } = props;
  const [password, setPassword] = useState<string>();

  return (
    <>
      <p
        className={inter.className}
        style={{
          color: "#000",
          fontWeight: "normal",
          fontSize: "16px",
          margin: "16px",
        }}
      >
        Please enter your password
      </p>

      <input
        name="email"
        style={{ height: "50px" }}
        disabled={true}
        className={inter.className}
        value={existingUserEmail}
      />
      <input
        autoFocus
        name="password"
        type="password"
        onChange={(e) => setPassword(e.target.value.trim())}
        style={{ height: "50px" }}
        placeholder="Password"
        disabled={isLoading}
        className={inter.className}
      />
      <button
        disabled={isLoading}
        onClick={async () => {
          if (isLoading) {
            return;
          }

          setIsLoading(true);

          let res: SignInResponse | undefined;

          try {
            // https://stackoverflow.com/questions/70165993/how-to-handle-login-failed-error-in-nextauth-js
            res = await signIn("credentials", {
              redirect: false,
              email: existingUserEmail,
              password,
            });
          } catch (e) {
            setError(
              "Unable to sign-in. Our Apologies, but it seems we're having some technical difficulties on our end"
            );
            setIsLoading(false);
            return;
          }

          setIsLoading(false);

          if (!res?.ok || res.error) {
            setError(`${res?.status} ${res?.error}`);
            return;
          }

          const { redirectURL } = router.query;

          if (redirectURL) {
            console.log("router push redirectURL=", redirectURL);
            router.push(redirectURL as string);
            return;
          }

          router.push("/");
        }}
        className={styles.primaryBtn}
      >
        Sign in
      </button>
    </>
  );
};

export default LoginWithCredentialsForm;
