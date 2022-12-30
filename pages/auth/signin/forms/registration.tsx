import { useState } from "react";
import { Inter } from "@next/font/google";
import styles from "../../../../styles/Signin.module.css";
import { collapseSpaces, toPascalCase } from "../../../../utils/string";

const inter = Inter({ subsets: ["latin"] });

type Props = {
  isSubmitting: boolean;
  submit(username: string, password: string, repeatPassword: string): void;
  setError(message: string): void;
  email: string | undefined;
};

const RegistrationForm = (props: Props): React.ReactElement<Props> => {
  const { submit, isSubmitting, setError, email } = props;

  const [username, setUsername] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [repeatPassword, setRepeatPassword] = useState<string>();

  const resolveUserHandle = () =>
    username && username.length > 3 ? `@${toPascalCase(username)}` : email;

  const validate = (): boolean => {
    // TODO Async check username for collisions
    if (!username) {
      setError("Please enter a username");
      return false;
    }

    if (!password) {
      setError("Please enter a password");
      return false;
    }

    if (!repeatPassword) {
      setError("Please repeat the password");
      return false;
    }

    if (password !== repeatPassword) {
      setError("Passwords do not match");
      return false;
    }

    return true;
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
        Welcome <strong>{resolveUserHandle()}</strong>. Let&apos;s get you
        setup.
      </p>
      <input
        id="username"
        name="username"
        onBlur={() => {
          console.log(username);
        }}
        onChange={(e) => setUsername(collapseSpaces(e.target.value, true))}
        value={username}
        style={{ height: "50px" }}
        placeholder="Username"
        disabled={isSubmitting}
        className={inter.className}
      />

      <input
        name="password"
        onChange={(e) => setPassword(e.target.value.trim())}
        style={{ height: "50px" }}
        placeholder="Password"
        disabled={isSubmitting}
        className={inter.className}
      />
      <input
        name="repeatPassword"
        onChange={(e) => setRepeatPassword(e.target.value.trim())}
        style={{ height: "50px" }}
        placeholder="Repeat password"
        disabled={isSubmitting}
        className={inter.className}
      />
      <button
        disabled={isSubmitting}
        onClick={() => {
          const valid = validate();

          if (valid) {
            submit(String(username), String(password), String(repeatPassword));
          }
        }}
        className={styles.primaryBtn}
      >
        Register Account
      </button>
    </>
  );
};

export default RegistrationForm;
