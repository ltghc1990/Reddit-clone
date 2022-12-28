import { VStack, Stack } from "@chakra-ui/react";
import {
  fetchPosts,
  fetchUserPostVotes,
} from "../../firebase/firebaseFunctions";

import PostItem from "./PostItem";
import PostLoader from "./PostLoader";
import { useQuery } from "@tanstack/react-query";
import { useUserAuth } from "../../store/reactQueryHooks";

const Posts = ({ communityData }) => {
  const { data, isLoading, error } = useQuery(["posts"], () =>
    fetchPosts(communityData)
  );

  // need to know if the user created the post by matching id
  // also needed to fetch users post votes
  const { data: user } = useUserAuth();

  const { data: userPostVotes } = useQuery(
    ["userPostVotes"],
    fetchUserPostVotes,
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
                user={user}
                userIsCreator={user?.uid === post.creatorId}
                userVoteValue={undefined}
                existingVote={
                  userPostVotes.find((item) => item.id === post.id) ?? null
                }
                // onVote={onVote}
                // onSelectPost={onSelectPost}
              />
            );
          })}
        </Stack>
      )}
    </>
  );
};

export default Posts;
