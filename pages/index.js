import { useState, useEffect } from "react";
import { Text, Stack } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import CreatePostLink from "../components/community/CreatePostLink";

// components
import PageContent from "../components/Layout/PageContent";
import PostLoader from "../components/Posts/PostLoader";
import PostItem from "../components/Posts/PostItem";
import Reccomendations from "../components/community/Reccomendations";
import Premium from "../components/community/Premium";
import PersonalHome from "../components/community/PersonalHome";

// functions
import { fetchUserPostVotes } from "../firebase/firebaseFunctions";
import { useUserAuth } from "../store/reactQueryHooks";
import {
  fetchPopularPosts,
  fetchUserHomeFeed,
} from "../firebase/firebaseFunctions";

// testing auth
import { auth } from "../firebase/clientApp";
import { onAuthStateChanged } from "firebase/auth";

export default function Home(props) {
  const [currentUser, setCurrentUser] = useState(undefined);
  const [loadingCurrentUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoadingUser(false);
    });
    return () => unSub();
  }, [currentUser]);
  const { data: user, isLoading: loadingUser } = useUserAuth();

  // the  useUserAuth function in reatQueryHooks returns undefined --> null --> data when data is fetched, causing the fetchpopularPost function to always run even though we are logged in.
  // using onAuthChange with useEffect allows it to work correctly

  // currentuser/user are the same user object

  const { data: homePagePosts, isLoading: loadingPosts } = useQuery(
    ["posts"],
    user ? () => fetchUserHomeFeed(user.uid) : fetchPopularPosts,
    {
      enabled: Boolean(!loadingCurrentUser),
      onSuccess: (response) => {
        console.log(response);
      },
      onError: (error) => console.log(error),
    }
  );

  const { data: userPostVotes } = useQuery(
    ["userPostVotes"],
    () => fetchUserPostVotes(user.uid),
    {
      enabled: Boolean(user?.uid),
    }
  );

  return (
    <PageContent>
      <>
        <CreatePostLink />
        {loadingPosts ? (
          <PostLoader />
        ) : (
          <Stack>
            {homePagePosts?.map((post) => {
              return (
                <PostItem
                  key={post.id}
                  post={post}
                  user={user?.uid}
                  userIsCreator={user?.uid === post.creatorId}
                  existingVoteValue={
                    userPostVotes?.find((item) => item.id === post.id)
                      ?.voteValue ?? null
                  }
                  homePage
                />
              );
            })}
          </Stack>
        )}
      </>
      <Stack spacing={6}>
        <Reccomendations />
        <Premium />
        {user && <PersonalHome />}
      </Stack>
    </PageContent>
  );
}

// export async function getServerSideProps(context) {
//   const queryId = context.query?.communityId;
//   console.log(queryId);
//   return {
//     props: {
//       queryId: queryId ? queryId : null,
//     },
//   };
// }
