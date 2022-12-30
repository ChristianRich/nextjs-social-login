import React, { useState } from "react";
import { Inter } from "@next/font/google";
import CaptureEmailForm from "./forms/capture-email";
import LoginWithCredentialsForm from "./forms/login-with-credentials";
import RegistrationForm from "./forms/registration";
import { signIn } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

export enum ACTION {
  SIGN_IN = "SIGN_IN", // Email exists in DB, this is a sign in
  REGISTRATION = "REGISTRATION", // Email is unknown, treat a new registration
}

type Props = {};

const Credentials = (_props: Props): React.ReactElement<Props> => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [action, setAction] = useState<ACTION | undefined>();
  const [validEmail, setValidEmail] = useState<string>();
  const [error, setError] = useState<string>();

  // https://cloudcoders.xyz/blog/nextauth-credentials-provider-with-external-api-and-login-page/
  const handleSubmit = async (): Promise<void> => {
    if (isSubmitting) {
      return;
    }
    setError("");
    setIsSubmitting(true);

    if (action === ACTION.SIGN_IN) {
      // TODO
    }

    if (action === ACTION.REGISTRATION) {
      // TODO
    }

    setIsSubmitting(false);
  };

  const submitToSignIn = async () => {
    const res = await signIn("credentials", {
      redirect: false,
      email: "john@bob.com",
      password: "12345678",
      passwordRepeat: "12345678",
      callbackUrl: `${window.location.origin}`,
    });

    if (res?.error) {
      setError(res.error);
    } else {
      setError("");
    }
    // if (res?.url) router.push(res.url);
    setIsSubmitting(false);
  };

  return (
    <>
      Action={action}
      {!action && (
        <CaptureEmailForm
          setAction={(action: ACTION, email: string) => {
            console.log("set action " + action);
            setValidEmail(email);
            setAction(action);
          }}
          setError={(message) => setError(message)}
        />
      )}
      {action === ACTION.REGISTRATION && (
        <RegistrationForm
          submit={async () => {
            console.log("submit registration");
            // TODO How to handle registrations?
          }}
          email={validEmail}
          isSubmitting={isSubmitting}
          setError={(message) => setError(message)}
        />
      )}
      {action === ACTION.SIGN_IN && (
        <LoginWithCredentialsForm
          submit={handleSubmit}
          isSubmitting={isSubmitting}
          setError={setError}
          email={"thor@world.com"}
        />
      )}
      {error && (
        <p
          className={inter.className}
          style={{ color: "#000", fontWeight: "normal" }}
        >
          {error}
        </p>
      )}
    </>
  );
};

export default Credentials;
