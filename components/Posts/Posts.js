import { VStack, Stack } from "@chakra-ui/react";
import {
  fetchPosts,
  fetchUserPostVotes,
} from "../../firebase/firebaseFunctions";

import PostItem from "./PostItem";
import PostLoader from "./PostLoader";
import { useQuery } from "@tanstack/react-query";
import { useUserAuth } from "../../store/reactQueryHooks";

//  Post needs the curent community id to fetch posts
// the only way we get serverside communityData is if we are on the /r/[communityid] page.
//  the fix is to have a if statement where if communitydata is empty we use the router instead

const Posts = ({ communityData }) => {
  const { data, isLoading, error } = useQuery(
    ["posts"],
    () => fetchPosts(communityData),
    {
      enabled: Boolean(communityData),
    }
  );

  // need to know if the user created the post by matching id
  // also needed to fetch users post votes
  const { data: user } = useUserAuth();

  const { data: userPostVotes } = useQuery(
    ["userPostVotes"],
    () => fetchUserPostVotes(user.uid),
    {
      enabled: Boolean(user?.uid),
    }
  );

  return (
    <>
      {isLoading ? (
        <PostLoader />
      ) : (
        <Stack>
          {data.map((post) => {
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
              />
            );
          })}
        </Stack>
      )}
    </>
  );
};

export default Posts;
