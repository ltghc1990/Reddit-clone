import { Text } from "@chakra-ui/react";
import PageContent from "../../../../components/Layout/PageContent";
import PostItem from "../../../../components/Posts/PostItem";

import { useRouter } from "next/router";

import {
  fetchSinglePost,
  fetchUserPostVotes,
} from "../../../../firebase/firebaseFunctions";
// query
import { useUserAuth } from "../../../../store/reactQueryHooks";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useSelectedContext } from "../../../../store/SelectedPostProvider";

// when we click on a post item its going to route to a different page so props arent passed. basically its going to be a new page and we have to pull data again unless it lives in top level state

// problem where when we refresh the props get removed from state

// on refetch need to fetch user, userspostVotes,the post itself
const PostPage = () => {
  const { selectedPost } = useSelectedContext();
  const router = useRouter();
  const routerPostId = router.query.pid;

  const { data: user } = useUserAuth();
  console.log(user);

  const { data: singlePost, isLoading } = useQuery(
    ["post", `${routerPostId}`],
    () => fetchSinglePost(routerPostId),
    {
      // only run once the router has data, if we receive props thats the initial data
      enabled: Boolean(router),
      initialData: selectedPost,
    }
  );

  return (
    <div>
      <PageContent>
        {!isLoading && (
          <>
            {
              <PostItem
                post={singlePost}
                user={user?.uid}
                userIsCreator={user?.uid === singlePost.creatorId}
                // existingVoteValue={}
              />
            }
          </>
        )}
        <></>
      </PageContent>
    </div>
  );
};

export default PostPage;
