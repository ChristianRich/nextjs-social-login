import React from "react";
import { signIn } from "next-auth/react";
import {
  GoogleLoginButton,
  GithubLoginButton,
  AppleLoginButton,
} from "react-social-login-buttons";

type Props = {
  setIsLoading(isLoading: boolean): void;
};

const SocialProviders = (props: Props): React.ReactElement<Props> => {
  const { setIsLoading } = props;

  const doSignIn = (provider) => {
    setIsLoading(true);
    signIn(provider);
  };
  // https://cloudcoders.xyz/blog/nextauth-credentials-provider-with-external-api-and-login-page/
  return (
    <>
      <GithubLoginButton
        style={{ fontSize: "16px", marginBottom: "20px" }}
        onClick={() => doSignIn("github")}
      />
      <GoogleLoginButton
        style={{ fontSize: "16px", marginBottom: "20px" }}
        onClick={() => doSignIn("google")}
      />
      <AppleLoginButton
        style={{ fontSize: "16px", marginBottom: "20px" }}
        onClick={() => doSignIn("apple")}
      />
    </>
  );
};

export default SocialProviders;
