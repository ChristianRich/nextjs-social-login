import { useState } from "react";
import { Inter } from "@next/font/google";
import styles from "../../../../styles/Signin.module.css";
import { isValidEmail } from "../../../../utils/string";

const inter = Inter({ subsets: ["latin"] });

type Props = {
  submit(email: string, password: string): void;
  isSubmitting: boolean;
  setError(message: string): void;
  email: string;
};

const LoginWithCredentialsForm = (props: Props): React.ReactElement<Props> => {
  const { isSubmitting, setError, submit, email } = props;

  // const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();

  return (
    <>
      <input
        name="email"
        style={{ height: "50px" }}
        disabled={true}
        className={inter.className}
        value={email}
      />
      <input
        name="password"
        onChange={(e) => setPassword(e.target.value.trim())}
        style={{ height: "50px" }}
        placeholder="Email"
        disabled={true}
        className={inter.className}
      />
      <button
        disabled={isSubmitting}
        onClick={() => {
          if (!isValidEmail(email)) {
            setError("Invalid email");
            return;
          }

          setError("");
          submit(String(email), String(password));
        }}
        className={styles.primaryBtn}
      >
        Submit
      </button>
    </>
  );
};

export default LoginWithCredentialsForm;
