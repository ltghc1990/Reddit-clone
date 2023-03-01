import { Text, Stack } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import CreatePostLink from "../components/community/CreatePostLink";

// components
import PageContent from "../components/Layout/PageContent";
import PostLoader from "../components/Posts/PostLoader";
import PostItem from "../components/Posts/PostItem";
import Reccomendations from "../components/community/Reccomendations";

// functions
import { fetchUserPostVotes } from "../firebase/firebaseFunctions";
import { useUserAuth } from "../store/reactQueryHooks";
import {
  fetchPopularPosts,
  fetchUserHomeFeed,
} from "../firebase/firebaseFunctions";

export default function Home(props) {
  const { data: user, isLoading: loadingUser } = useUserAuth();

  let fetchFunction = null;

  // 2 different data scenarios
  // one where the user is logged in, one without

  // this isUserLoggedIn function might not be nessary

  // const IsUserLoggedIn = loadingUser === false && user;

  const { data: homePagePosts, isLoading: loadingPosts } = useQuery(
    ["posts"],
    user ? () => fetchUserHomeFeed(user.uid) : fetchPopularPosts,

    fetchFunction,
    {
      enabled: !loadingUser ? true : null,
      onSuccess: (response) => {},
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
      <>
        <Reccomendations />
      </>
    </PageContent>
  );
}

export async function getServerSideProps(context) {
  const queryId = context.query?.communityId;
  console.log(queryId);
  return {
    props: {
      queryId: queryId ? queryId : null,
    },
  };
}
