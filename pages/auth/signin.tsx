import { signIn, getCsrfToken, getProviders } from "next-auth/react";
import Image, { ImageLoaderProps } from "next/image";
import styles from "../../styles/Signin.module.css";
import { useSession } from "next-auth/react";
import {
  GoogleLoginButton,
  GithubLoginButton,
  AppleLoginButton,
} from "react-social-login-buttons";
import { Inter } from "@next/font/google";

const inter = Inter({ subsets: ["latin"] });
interface SocialButtonProps {
  provider: string;
  onClick?: () => any;
}

export const SocialButton = (props: SocialButtonProps): React.ReactElement => {
  const { provider, onClick } = props;

  let btn;

  if (provider === "google") {
    btn = <GoogleLoginButton style={{ fontSize: "16px" }} onClick={onClick} />;
  } else if (provider === "apple") {
    btn = <AppleLoginButton style={{ fontSize: "16px" }} onClick={onClick} />;
  } else if (provider === "github") {
    btn = <GithubLoginButton style={{ fontSize: "16px" }} onClick={onClick} />;
  } else {
    throw new Error(`Unknown provider ${provider}`);
  }

  return btn;
};

const Signin = ({ csrfToken, providers }) => {
  const { data: session } = useSession();

  if (session) {
    console.log(session);
  }

  return (
    <div style={{ overflow: "hidden", position: "relative" }}>
      <div className={styles.wrapper} />
      <div className={styles.content}>
        <div className={styles.cardWrapper}>
          {/* <Image
            loader={({ src }: ImageLoaderProps) => src}
            src="/logo-generic.svg"
            width={196}
            height={64}
            alt="App Logo"
            style={{ height: "85px", marginBottom: "20px" }}
          /> */}

          <div className={styles.cardContent}>
            <input name="csrfToken" type="hidden" defaultValue={csrfToken} />

            <p
              style={{
                color: "#000",
                fontSize: "16px",
                padding: "8px",
                height: "50px",
                fontWeight: "normal",
              }}
              className={inter.className}
            >
              Register or log in with your email
            </p>
            <input style={{ height: "50px" }} placeholder="Email" />
            <button className={styles.primaryBtn}>Submit</button>
            <hr />
            <p
              style={{
                color: "#000",
                fontSize: "16px",
                padding: "8px",
                fontWeight: "normal",
              }}
              className={inter.className}
            >
              Or log in with a social identity provider
            </p>
            {providers &&
              Object.values(providers).map((provider: any) => (
                <div key={provider.name} style={{ marginBottom: "16px" }}>
                  <SocialButton
                    onClick={() => signIn(provider.id)}
                    provider={provider.id}
                  />
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

  return {
    props: {
      providers,
      csrfToken,
    },
  };
}
