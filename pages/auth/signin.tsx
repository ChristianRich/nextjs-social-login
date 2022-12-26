import { signIn, getCsrfToken, getProviders } from "next-auth/react";
import Image, { ImageLoaderProps } from "next/image";
import styles from "../../styles/Signin.module.css";
import { useSession } from "next-auth/react";
import { getEnvVars } from "../../utils/env";

export const doSignIn = (provider: string) => {
  try {
    console.log("Signin to " + provider);
    signIn(provider);
  } catch (e) {
    console.log("SignIn Error");
    console.log(e);
  }
};

const Signin = ({ csrfToken, providers, processVars }) => {
  const { data: session } = useSession();

  if (session) {
    console.log(session);
  } else {
    console.log("No session");
  }

  console.log(processVars);

  return (
    <div style={{ overflow: "hidden", position: "relative" }}>
      <div className={styles.wrapper} />
      <div className={styles.content}>
        <div className={styles.cardWrapper}>
          <Image
            loader={({ src }: ImageLoaderProps) => src}
            src="/logo-generic.svg"
            width={196}
            height={64}
            alt="App Logo"
            style={{ height: "85px", marginBottom: "20px" }}
          />
          <div className={styles.cardContent}>
            <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
            <input placeholder="Email" />
            <button className={styles.primaryBtn}>Submit</button>
            <hr />
            {providers &&
              Object.values(providers).map((provider: any) => (
                <div key={provider.name} style={{ marginBottom: 0 }}>
                  <button onClick={() => doSignIn(provider.id)}>
                    Register or Sign in with {provider.name}
                  </button>
                </div>
              ))}
          </div>
        </div>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/login_pattern.svg"
        alt="Pattern Background"
        className={styles.styledPattern}
      />
    </div>
  );
};

export default Signin;

export async function getServerSideProps(context) {
  const providers = await getProviders();
  const csrfToken = await getCsrfToken(context);
  const processVars = getEnvVars();

  return {
    props: {
      providers,
      csrfToken,
      processVars,
    },
  };
}
