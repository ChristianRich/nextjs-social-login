import { useEffect, useState } from "react";
import { Inter } from "@next/font/google";
import styles from "../../../../styles/Signin.module.css";
import { ACTION } from "..";
import { collapseSpaces, isValidEmail } from "../../../../utils/string";
import { signIn } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

type Props = {
  isLoading: boolean;
  setIsLoading(isLoading: boolean): void;
  setAction(action: ACTION, email: string | undefined): void;
  setError(message: string): void;
};

const CaptureEmailForm = (props: Props): React.ReactElement<Props> => {
  const { setError, setAction, isLoading, setIsLoading } = props;

  const [email, setEmail] = useState<string>("");
  const [validEmail, setValidEmail] = useState<string | undefined>(undefined);
  const [userExists, setUserExists] = useState<boolean | undefined>(undefined);

  const [isSocialProviderAccount, setIsSocialProviderAccount] =
    useState<boolean>();

  useEffect(() => {
    const checkUserExistsByEmail = async () => {
      if (isLoading) {
        return;
      }

      setIsLoading(true);

      const controller: AbortController = new AbortController();
      const { signal, abort } = controller;
      const headers: Headers = new Headers();
      headers.append("x-api-key", String(process.env.NEXT_PUBLIC_USER_API_KEY));

      const requestOptions: RequestInit = {
        signal,
        headers,
      };

      fetch(
        `${
          process.env.NEXT_PUBLIC_USER_API_URL
        }/user/exists/email/${encodeURIComponent(email)}`,
        requestOptions
      )
        .then((response) => {
          if (!response.ok) {
            setError("Username check error");
            throw new Error("HTTP status " + response.status);
          }
          return response.json();
        })
        .then((data) => {
          setUserExists(data.userExists);

          if (data.accountType === "SOCIAL_PROVIDER") {
            setIsSocialProviderAccount(true);

            if (data.provider) {
              signIn(data.provider);
            } else {
              setError(
                "Unable to sign-in. Please login using your social provider"
              );
              setIsLoading(false);
            }
          } else {
            setIsLoading(false);
            setIsSocialProviderAccount(false);
          }
        })
        .catch((error) => {
          console.error(error);
        });

      return () => abort();
    };

    if (
      !isLoading &&
      userExists === undefined &&
      validEmail &&
      !isSocialProviderAccount
    ) {
      checkUserExistsByEmail();
    }
  }, [
    email,
    validEmail,
    isLoading,
    setError,
    userExists,
    setIsLoading,
    isSocialProviderAccount,
  ]);

  useEffect(() => {
    if (userExists !== undefined && !isSocialProviderAccount) {
      setAction(userExists ? ACTION.SIGN_IN : ACTION.REGISTRATION, validEmail);
    }
  }, [isSocialProviderAccount, setAction, userExists, validEmail]);

  return (
    <>
      <input
        name="email"
        onChange={(e) => setEmail(collapseSpaces(e.target.value, true))}
        value={email}
        style={{ height: "50px" }}
        placeholder="Email"
        disabled={isLoading}
        className={inter.className}
      />
      <button
        disabled={isLoading}
        onClick={() => {
          if (!isValidEmail(email)) {
            setError("Please enter a valid email");
            return;
          }

          setError("");
          setValidEmail(email);
        }}
        className={styles.primaryBtn}
      >
        Submit
      </button>
    </>
  );
};

export default CaptureEmailForm;
