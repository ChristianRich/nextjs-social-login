import React, { useState } from "react";
import { Inter } from "@next/font/google";
import CaptureEmailForm from "./form-elements/capture-email";
import LoginWithCredentialsForm from "./form-elements/login-with-credentials";
import RegistrationForm from "./form-elements/registration";

const inter = Inter({ subsets: ["latin"] });

type Props = {
  isLoading: boolean;
  setIsLoading(isLoading: boolean): void;
};

export enum ACTION {
  CAPTURE_EMAIL = "CAPTURE_EMAIL",
  SIGN_IN = "SIGN_IN",
  REGISTRATION = "REGISTRATION",
}

const Credentials = (props: Props): React.ReactElement<Props> => {
  const { isLoading, setIsLoading } = props;

  const [action, setAction] = useState<ACTION>(ACTION.CAPTURE_EMAIL);
  const [validEmail, setValidEmail] = useState<string>();
  const [error, setError] = useState<string>();

  // https://cloudcoders.xyz/blog/nextauth-credentials-provider-with-external-api-and-login-page/
  return (
    <>
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
