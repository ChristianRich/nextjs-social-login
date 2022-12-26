import { useSession } from "next-auth/react";
import { signIn, getCsrfToken, getProviders } from "next-auth/react";
import Image, { ImageLoaderProps } from "next/image";
import styles from "../styles/Signin.module.css";

const Account = (props: any) => {
  const { data: session } = useSession();

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
            {/* <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
            <input placeholder="Email" />
            <button className={styles.primaryBtn}>Submit</button>
            <hr />
            {providers &&
              Object.values(providers).map((provider) => (
                <div key={provider.name} style={{ marginBottom: 0 }}>
                  <button onClick={() => signIn(provider.id)}>
                    Register or Sign in with {provider.name}
                  </button>
                </div>
              ))} */}
          </div>
        </div>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {/* <img
        src="/login_pattern.svg"
        alt="Pattern Background"
        className={styles.styledPattern}
      /> */}
    </div>
  );
};

export default Account;

export async function getServerSideProps(context: any) {
  // Pull user profile using the Bearer token
  return {
    props: {},
  };
}
