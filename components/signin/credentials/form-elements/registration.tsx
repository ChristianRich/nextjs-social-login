import { useEffect, useState } from "react";
import { Inter } from "@next/font/google";
import styles from "../../../../styles/Signin.module.css";
import { collapseSpaces, toPascalCase } from "../../../../utils/string";
import { useRouter } from "next/router";
import { signIn, SignInResponse } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

type Props = {
  isLoading: boolean;
  setIsLoading(isLoading: boolean): void;
  setError(message: string): void;
  email: string | undefined;
};

export const validCharacters = (username: string): boolean =>
  /^[-_.a-zA-Z0-9]+$/.test(username);

const RegistrationForm = (props: Props): React.ReactElement<Props> => {
  const { isLoading, setIsLoading, setError, email } = props;

  const [lastValidatedUsername, setLastValidatedUsername] =
    useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [verifiedUsername, setVerifiedUsername] = useState<boolean | undefined>(
    undefined
  );

  const [password, setPassword] = useState<string>();
  const [repeatPassword, setRepeatPassword] = useState<string>();
  const [doValidateUsername, setDoValidateUsername] = useState<Boolean>(false);
  const [doSubmit, setDoSubmit] = useState<Boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const submitForm = async () => {
      if (isLoading || !doSubmit) {
        return;
      }

      setDoSubmit(false);
      setIsLoading(true);

      const controller: AbortController = new AbortController();
      const { signal, abort } = controller;

      fetch(`${process.env.NEXT_PUBLIC_USER_API_URL}/user`, {
        method: "POST",
        signal,
        mode: "cors",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
          "x-api-key": String(process.env.NEXT_PUBLIC_USER_API_KEY),
        },
        body: JSON.stringify({
          name: username,
          email,
          password,
          repeatPassword,
          sourceSystem: "slshub.com",
        }),
      })
        .then(async (response) => {
          if (!response.ok) {
            return response.json();
          } else {
            console.log("User created");

            const res: SignInResponse | undefined = await signIn(
              "credentials",
              {
                redirect: false,
                email,
                password,
              }
            );

            if (!res || !res.ok || res.error) {
              setError("Sign-in after sign-up failed");
              return;
            }

            console.log("signin res", res);
            router.push("/account");
          }
        })
        .then((data) => {
          data?.message && setError(data.message);
        })
        .catch((e) => {
          const { message } = e as Error;

          if (message) {
            setError(message);
          }
        })
        .finally(() => setIsLoading(false));

      return () => abort();
    };

    if (doSubmit && !isLoading) {
      submitForm();
    }
  }, [
    doSubmit,
    email,
    isLoading,
    password,
    repeatPassword,
    setError,
    setIsLoading,
    username,
    router,
  ]);

  // Verify username hook
  useEffect(() => {
    const validateUsernameApiRequest = async () => {
      if (isLoading || !doValidateUsername) {
        return;
      }

      if (!validCharacters(username)) {
        setError(
          "Username may contain letters (a-z), numbers (0-9), underscores, dots and dashes. Spaces and special characters are not permitted."
        );
        setVerifiedUsername(false);
        return;
      }

      setDoValidateUsername(false);
      setIsLoading(true);

      const controller: AbortController = new AbortController();
      const { signal, abort } = controller;

      fetch(
        `${process.env.NEXT_PUBLIC_USER_API_URL}/username/${encodeURIComponent(
          username
        )}/verify`,
        {
          method: "GET",
          signal,
          headers: {
            "x-api-key": String(process.env.NEXT_PUBLIC_USER_API_KEY),
          },
        }
      )
        .then((response) => {
          setIsLoading(false);
          setVerifiedUsername(response.ok);
          setLastValidatedUsername(username);

          if (!response.ok) {
            return response.json();
          } else {
            setError("");
          }
        })
        .then((data) => {
          if (data?.message) {
            setVerifiedUsername(false);
            setError(data?.message);
          }
        })
        .catch((error) => {
          console.error(error);
        });

      return () => abort();
    };

    if (doValidateUsername) {
      validateUsernameApiRequest();
    }
  }, [isLoading, setError, username, doValidateUsername, setIsLoading]);

  const resolveUserHandle = (): string | undefined =>
    verifiedUsername ? `@${toPascalCase(username)}` : email;

  const getUsernameInputCSS = (): Record<string, string> => {
    if (verifiedUsername === undefined) {
      return {};
    }

    return {
      border: `2px solid ${verifiedUsername === true ? "green" : "red"}`,
    };
  };

  const onUsernameInputChange = (
    e: React.FormEvent<HTMLInputElement>
  ): void => {
    const { currentTarget } = e;

    if (currentTarget.value.length) {
      setUsername(collapseSpaces(currentTarget.value, true));
    }
  };

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
        Welcome <strong>{resolveUserHandle()}</strong>. Let&apos;s get you setup
      </p>
      <input
        type="string"
        minLength={5}
        maxLength={32}
        id="username"
        name="username"
        onBlur={() => {
          if (username && username !== lastValidatedUsername) {
            setDoValidateUsername(true);
          }
        }}
        onChange={(e) => onUsernameInputChange(e)}
        value={username}
        style={{ height: "50px", ...getUsernameInputCSS() }}
        placeholder="Username"
        disabled={isLoading}
        className={inter.className}
      />
      <input
        type="password"
        name="password"
        onChange={(e) => setPassword(e.target.value.trim())}
        style={{ height: "50px" }}
        placeholder="Password"
        disabled={isLoading}
        className={inter.className}
      />
      <input
        type="password"
        name="repeatPassword"
        onChange={(e) => setRepeatPassword(e.target.value.trim())}
        style={{ height: "50px" }}
        placeholder="Repeat password"
        disabled={isLoading}
        className={inter.className}
      />
      <button
        disabled={isLoading}
        onClick={() => {
          // TODO Validate form
          setDoSubmit(true);
        }}
        className={styles.primaryBtn}
      >
        Register Account
      </button>
    </>
  );
};

export default RegistrationForm;
