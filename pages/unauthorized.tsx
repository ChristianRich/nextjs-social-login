import { useRouter } from "next/router";

function Error({ statusCode }) {
  const router = useRouter();
  const { query } = router;
  const { error } = query;

  return (
    <>
      <h1>Unauthorized</h1>
      {error && <h2>{decodeURIComponent(error.toString())}</h2>}
      <p>
        {statusCode
          ? `An error ${statusCode} occurred on server`
          : "An error occurred on client"}
      </p>
    </>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
