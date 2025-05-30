import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { signIn, signOut } from "next-auth/react";

import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
} from "@chakra-ui/react";
import StyledText from "../../components/styled/text";

// Use SSR to prevent loading handling on client.
export async function getServerSideProps({ req, res, query }) {
  return {
    props: {
      loggedIn: !!(await getServerSession(req, res, authOptions)),
      page: query.page,
    },
  };
}

const Error = ({ loggedIn, page }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* credits: https://gist.github.com/dmurawsky/d45f068097d181c733a53687edce1919 */}
      <style global jsx>{`
        html,
        body,
        div#__next,
        div#__next > div {
          height: 100%;
        }
      `}</style>
      <Card>
        <CardHeader
          background="brand"
          backgroundClip="text"
          fill="transparent"
          fontSize="4xl"
          alignSelf="center"
        >
          Authorization failed
        </CardHeader>
        <CardBody fontSize="2xl">
          Please login with an authorized account to access this bytecrowd
        </CardBody>
        <CardFooter justifyContent="center">
          {loggedIn ? (
            <Button variant="ghost" onClick={() => signOut()} fontSize="xl">
              <StyledText>sign out</StyledText>
            </Button>
          ) : (
            <Button
              variant="ghost"
              fontSize="xl"
              onClick={() => signIn("github", { callbackUrl: `/${page}` })}
            >
              <StyledText>sign in</StyledText>
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default Error;
