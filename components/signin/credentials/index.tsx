import React, { useState } from "react";
import { Inter } from "@next/font/google";
import CaptureEmailForm from "./form-elements/capture-email";
import LoginWithCredentialsForm from "./form-elements/login-with-credentials";
import RegistrationForm from "./form-elements/registration";
import Spinner from "react-svg-spinner";

const inter = Inter({ subsets: ["latin"] });

export enum ACTION {
  CAPTURE_EMAIL = "CAPTURE_EMAIL",
  SIGN_IN = "SIGN_IN",
  REGISTRATION = "REGISTRATION",
}

const Credentials = (): React.ReactElement<void> => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [action, setAction] = useState<ACTION>(ACTION.CAPTURE_EMAIL);
  const [validEmail, setValidEmail] = useState<string>();
  const [error, setError] = useState<string>();

  // https://cloudcoders.xyz/blog/nextauth-credentials-provider-with-external-api-and-login-page/
  return (
    <>
      {isLoading && (
        <div style={{ float: "right" }}>
          <Spinner thickness={4} />
        </div>
      )}
      {action === ACTION.CAPTURE_EMAIL && (
        <CaptureEmailForm
          setAction={(action: ACTION, email: string) => {
            setValidEmail(email);
            setAction(action);
          }}
          setError={setError}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      )}
      {action === ACTION.REGISTRATION && (
        <RegistrationForm
          email={validEmail}
          setError={setError}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      )}
      {action === ACTION.SIGN_IN && (
        <LoginWithCredentialsForm
          setError={setError}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          existingUserEmail={validEmail!}
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
