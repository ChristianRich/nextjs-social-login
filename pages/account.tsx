import { getSession, useSession } from "next-auth/react";
import Image, { ImageLoaderProps } from "next/image";
import styles from "../styles/Signin.module.css";
import { Inter } from "@next/font/google";
import { Session } from "next-auth";
import { GetServerSidePropsContext } from "next";
import { DefaultPageProps } from "./_app";
import absoluteUrl from "next-absolute-url";
import type { Location } from "./_app";
const inter = Inter({ subsets: ["latin"] });

export interface Props extends DefaultPageProps {
  userProfileData: any[];
}

const Account = (props: Props) => {
  const { userProfileData } = props;
  const { data: session } = useSession();

  console.log(userProfileData);

  return (
    <>
      <h1>Account</h1>
      <div style={{ overflow: "hidden", position: "relative" }}>
        <div className={styles.wrapper} />
        <div className={styles.content}>
          <div className={styles.cardWrapper}>
            {session?.user?.image && (
              <Image
                loader={({ src }: ImageLoaderProps) => src}
                src={session.user.image}
                width={196}
                height={64}
                alt="App Logo"
                style={{ height: "85px", marginBottom: "20px" }}
              />
            )}
            <div className={styles.cardContent}>
              <h2 className={inter.className} style={{ color: "black" }}>
                Account page <span>-&gt;</span>
              </h2>
              <p className={inter.className} style={{ color: "black" }}>
                {session?.user?.email && session.user.email}
              </p>
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
    </>
  );
};

export default Account;

// Server-side protected route with redirect to login page
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session: Session | null = await getSession(context);

  if (!session) {
    const location: Location = absoluteUrl(context.req);
    const redirectURL = encodeURIComponent(`${location.origin}/account`);

    return {
      redirect: {
        destination: `/auth/signin?redirectURL=${redirectURL}`,
        permanent: false,
      },
    };
  }

  // TODO Retrieve user profile
  return {
    props: {
      userProfileData: [{ name: "foo" }, { city: "Barcelona" }],
    },
  };
}
