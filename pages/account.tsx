import { getSession, useSession } from "next-auth/react";
import styles from "../styles/Signin.module.css";
import { Inter } from "@next/font/google";
import { Session } from "next-auth";
import { GetServerSidePropsContext } from "next";
import { DefaultPageProps } from "./_app";
import absoluteUrl from "next-absolute-url";
import Spinner from "react-svg-spinner";
import { getUserByEmail } from "../services/user-api";

const inter = Inter({ subsets: ["latin"] });

export interface Props extends DefaultPageProps {
  userProfileData: any;
  session: any;
}

const Account = (props: Props) => {
  const { userProfileData, session } = props;
  // const { data: session, status } = useSession();

  // if (status === "loading") {
  //   return (
  //     <div
  //       style={{
  //         float: "left",
  //         position: "absolute",
  //         top: 0,
  //         left: 0,
  //         padding: "10px",
  //       }}
  //     >
  //       <Spinner thickness={2} size="40px" speed="fast" color={"#fff"} />
  //     </div>
  //   );
  // }

  console.log(session);
  console.log(userProfileData);

  return (
    <>
      <h1>Account</h1>
      <div style={{ overflow: "hidden", position: "relative" }}>
        <div className={styles.wrapper} />
        <div className={styles.content}>
          <div className={styles.cardWrapper}>
            <div className={styles.cardContent}>
              <p className={inter.className} style={{ color: "black" }}>
                Logged in as {session?.user?.email && session.user.email}
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
    const redirectURL = encodeURIComponent(
      `${absoluteUrl(context.req).origin}/account`
    );

    return {
      redirect: {
        destination: `/auth/signin?redirectURL=${redirectURL}`,
        permanent: false,
      },
    };
  }

  let userProfileData: any;

  if (session.user?.email) {
    userProfileData = await getUserByEmail(session.user.email);
  }

  return {
    props: {
      userProfileData,
      session,
    },
  };
}
