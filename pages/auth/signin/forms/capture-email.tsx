import { useEffect, useState } from "react";
import { Inter } from "@next/font/google";
import styles from "../../../../styles/Signin.module.css";
import { ACTION } from "../credentials";
import { isValidEmail } from "../../../../utils/string";
import Spinner from "react-svg-spinner";

const inter = Inter({ subsets: ["latin"] });

type Props = {
  setAction(action: ACTION, email: string | undefined): void;
  setError(message: string): void;
};

const CaptureEmailForm = (props: Props): React.ReactElement<Props> => {
  const { setError, setAction } = props;

  const [email, setEmail] = useState<string>();
  const [validEmail, setValidEmail] = useState<string | undefined>(undefined);
  const [userExists, setUserExists] = useState<boolean | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const checkUserExists = async () => {
      if (isLoading) {
        return;
      }

      setIsLoading(true);

      const controller = new AbortController();
      const { signal, abort } = controller;

      fetch(
        `${process.env.NEXT_PUBLIC_USER_API_URL}/user/exists/email/${email}`,
        {
          signal,
          headers: {
            "X-Api-Key": String(process.env.NEXT_PUBLIC_USER_API_KEY),
          },
        }
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
          setIsLoading(false);
        })
        .catch((error) => {
          console.error(error);
        });

      return () => abort();
    };

    if (!isLoading && userExists === undefined && validEmail) {
      checkUserExists();
    }
  }, [email, validEmail, isLoading, setError, userExists]);

  useEffect(() => {
    if (userExists !== undefined) {
      console.log("userExists? " + userExists);
      setAction(userExists ? ACTION.SIGN_IN : ACTION.REGISTRATION, validEmail);
    }
  }, [setAction, userExists, validEmail]);

  return (
    <>
      <input
        name="email"
        onChange={(e) => setEmail(e.target.value)}
        style={{ height: "50px" }}
        placeholder="Email"
        disabled={isLoading}
        className={inter.className}
      />
      {isLoading && <Spinner thickness={3} />}
      <button
        disabled={isLoading}
        onClick={() => {
          const result = String(email).trim().toLowerCase();

          if (!isValidEmail(result)) {
            setError("Invalid email");
            return;
          }

          setError("");
          setValidEmail(result);
        }}
        className={styles.primaryBtn}
      >
        Submit
      </button>
    </>
  );
};

export default CaptureEmailForm;
