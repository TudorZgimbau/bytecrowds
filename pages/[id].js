import Head from "next/head";

import { getServerSession } from "next-auth";
import { isAuthorized } from "../utils/server/authorization";
import { authOptions } from "../lib/auth";
import redis from "../database/redis";

import dynamic from "next/dynamic";
// Import the Editor client-side only to avoid initializing providers multiple times.
const Editor = dynamic(() => import("../components/editor"), {
  ssr: false,
  loading: () => <p>Loading editor…</p>,
});

export async function getServerSideProps({ req, res, query }) {
  const session = await getServerSession(req, res, authOptions);
  const { id } = query;

  const bytecrowd = await redis.hgetall(`bytecrowd:${id}`);
  const presenceResponse = await fetch(
    `https://rest.ably.io/channels/${id}/presence`,
    {
      headers: {
        Authorization: `Basic ${Buffer.from(process.env.ABLY_API_KEY).toString(
          "base64"
        )}`,
      },
    }
  );
  /*
    If there are no other connected peers, the text will be inserted from the database.
    Otherwise, it will be fetched from peers.
   */
  const insertInitialTextFromDatabase =
    (await presenceResponse.json()).length === 0;

  // If the bytecrowd doesn't exist, return the default values.
  if (!bytecrowd)
    return {
      props: {
        editorInitialText: "",
        editorInitialLanguage: "javascript",
        insertInitialTextFromDatabase,
        login: "successful",
        id,
      },
    };

  // Check if the user is authorized.
  if (!isAuthorized(bytecrowd.authorizedEmails, session))
    return {
      redirect: {
        destination: `/error/authorization?page=${id}`,
        permanent: false,
      },
    };

  return {
    props: {
      editorInitialText: bytecrowd.text,
      editorInitialLanguage: bytecrowd.language,
      insertInitialTextFromDatabase,
      id,
    },
  };
}

const Bytecrowd = ({
  editorInitialText,
  editorInitialLanguage,
  insertInitialTextFromDatabase,
  id,
}) => {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="application-name" content="Bytecrowds" />
      </Head>
      <Editor
        id={id}
        editorInitialText={editorInitialText}
        editorInitialLanguage={editorInitialLanguage}
        insertInitialTextFromDatabase={insertInitialTextFromDatabase}
      />
    </>
  );
};

export default Bytecrowd;
