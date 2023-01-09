import React, { useState } from "react";
import { Inter } from "@next/font/google";
import SocialProviders from "./social-provider";
import styles from "../../styles/Signin.module.css";
import Credentials from "./credentials";
import Spinner from "react-svg-spinner";

const inter = Inter({ subsets: ["latin"] });

type Props = {
  csrfToken?: string;
};

const SignInRegister = (props: Props): React.ReactElement<void> => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { csrfToken } = props;

  return (
    <>
      <div style={{ overflow: "hidden", position: "relative" }}>
        <div className={styles.wrapper} />

        <div className={styles.content}>
          <div className={styles.cardWrapper}>
            <h1 className={inter.className}>Sign-in or register</h1>

            <div className={styles.cardContent}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                {csrfToken && (
                  <input
                    name="csrfToken"
                    type="hidden"
                    defaultValue={csrfToken}
                  />
                )}

                {isLoading && (
                  <div style={{ float: "right", padding: "10px" }}>
                    <Spinner
                      thickness={2}
                      size="24px"
                      speed="fast"
                      color="#000"
                    />
                  </div>
                )}

                <Credentials
                  setIsLoading={setIsLoading}
                  isLoading={isLoading}
                />
              </form>
              <hr />
              <SocialProviders setIsLoading={setIsLoading} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignInRegister;
