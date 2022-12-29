import React, { useEffect, useState } from "react";
import styles from "../../../styles/Signin.module.css";
import { Inter } from "@next/font/google";
import { collapseSpaces, isValidEmail } from "../../../utils/string";
import Spinner from "react-svg-spinner";

const inter = Inter({ subsets: ["latin"] });

const USER_API_BASE_URL =
  "https://bdkoxnaupk.execute-api.ap-southeast-2.amazonaws.com/dev";

enum ACTION {
  SIGN_IN = "SIGN_IN", // Email exists in DB, this is a sign in
  REGISTRATION = "REGISTRATION", // Email is unknown, treat a new registration
}

type Props = {};

const Credentials = (props: Props): React.ReactElement<Props> => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [user, setUser] = useState();
  const [email, setEmail] = useState<string>();
  const [validEmail, setValidEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [repeatPassword, setRepeatPassword] = useState<string>();

  const [showPasswordField, setShowPasswordField] = useState<boolean>(false);
  const [showRepeatPasswordField, setShowRepeatPasswordField] =
    useState<boolean>(false);
  const [action, setAction] = useState<ACTION | undefined>();
  const [errorMessage, setErrorMessage] = useState<string>();

  useEffect(() => {
    const getUser = async () => {
      const controller = new AbortController();
      const { signal } = controller;

      fetch("https://api.publicapis.org/entries", {
        signal,
      })
        .then((response) => response.json())
        .then((response) => {
          setUser(response);
          setIsLoading(false);
        })
        .catch((error) => {
          const { message } = error;
          setErrorMessage(message);
          setIsLoading(false);
        });

      return () => controller.abort();
    };

    if (!isLoading && validEmail && user === undefined) {
      setIsLoading(true);
      getUser();
    }
  }, [user, isLoading, validEmail]);

  useEffect(() => {
    if (user) {
      console.log("got user ", user);
      setAction(ACTION.SIGN_IN);
      setShowPasswordField(true);
    }
  }, [user]);

  const handleSubmit = async (): Promise<void> => {
    if (isSubmitting) {
      return;
    }
    setErrorMessage("");
    setIsSubmitting(true);

    if (!isValidEmail(email)) {
      setErrorMessage("Please enter a valid email");
      setIsSubmitting(false);
      return;
    }

    if (showPasswordField && !password) {
      setErrorMessage("Please enter your password");
      setIsSubmitting(false);
      return;
    }

    if (
      showPasswordField &&
      showRepeatPasswordField &&
      password !== repeatPassword
    ) {
      setErrorMessage("Passwords must match");
      setIsSubmitting(false);
      return;
    }

    setValidEmail(email); // Kick off GET request to verify user exists before deciding on sign-in or register mode
    // setIsSubmitting(false);

    // UI state: When we have confirmed that the email exists in our system, show Show password input

    // Check for existing user, if found we're performing a login otherwise signup
    // const user = await
    // void getUserByEmail(credentialsUsername as string);

    // if (!user) {
    //   console.log("No such user");
    // } else {
    //   console.log(user);
    //   setShowPasswordField(true);
    //   setIsSubmitting(false);
    // }
  };

  return (
    <>
      <input
        name="email"
        onChange={(e) => setEmail(collapseSpaces(e.target.value, true))}
        style={{ height: "50px" }}
        placeholder="Email"
        disabled={isSubmitting}
        className={inter.className}
        // value="foo@baz.com"
      />
      {showPasswordField && (
        <input
          autoFocus
          name="password"
          onChange={(e) => setPassword(e.target.value.trim())}
          style={{ height: "50px" }}
          placeholder="Password"
          disabled={isSubmitting}
          className={inter.className}
        />
      )}
      {showRepeatPasswordField && (
        <input
          autoFocus
          name="repeatPassword"
          onChange={(e) => setRepeatPassword(e.target.value.trim())}
          style={{ height: "50px" }}
          placeholder="Repeat password"
          disabled={isSubmitting}
          className={inter.className}
        />
      )}

      {isLoading && <Spinner thickness={3} />}
      {errorMessage && (
        <p
          className={inter.className}
          style={{ color: "#000", fontWeight: "normal" }}
        >
          {errorMessage}
        </p>
      )}
      <button
        disabled={isSubmitting}
        onClick={handleSubmit}
        className={styles.primaryBtn}
      >
        Submit
      </button>
    </>
  );
};

export default Credentials;
