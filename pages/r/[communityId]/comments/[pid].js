import PageContent from "../../../../components/Layout/PageContent";
import About from "../../../../components/community/About";
import SinglePostItemView from "../../../../components/Posts/SinglePostItemView";
import CommentInput from "../../../../components/Posts/Comments/CommentInput";
import Comments from "../../../../components/Posts/Comments/Comments";

import { useRouter } from "next/router";

import {
  fetchSinglePost,
  fetchUserPostVotes,
} from "../../../../firebase/firebaseFunctions";
// query
import { useUserAuth } from "../../../../store/reactQueryHooks";
import { useQueryClient, useQuery } from "@tanstack/react-query";

// on refresh need to fetch user, userspostVotes, the post itself
const PostPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const routerPostId = router.query.pid;

  const selectedPost = queryClient.getQueryData(["posts", routerPostId]);
  // selectedPost is a single object inside a array; Its to maintain the array methods inside postitem. for example the vote function expects an array
  // const { selectedPost } = useSelectedContext();

  const { data: user } = useUserAuth();

  const { data: singlePost, isLoading } = useQuery(
    ["posts", `${routerPostId}`],
    () => fetchSinglePost(routerPostId),
    {
      // only run once the router has data, if we receive props thats the initial data
      enabled: Boolean(router),
      initialData: selectedPost && [{ ...selectedPost }],
    }
  );

  const { data: userPostVotes } = useQuery(
    ["userPostVotes"],
    () => fetchUserPostVotes(user.uid),
    {
      enabled: Boolean(user),
    }
  );

  // testing out composition structure for comments component

  return (
    <div>
      <PageContent>
        {!isLoading && (
          <>
            {singlePost.map((post) => {
              return (
                <SinglePostItemView
                  key={post.id}
                  post={post}
                  user={user?.uid}
                  userIsCreator={user?.uid === singlePost[0]?.creatorId}
                  existingVoteValue={
                    userPostVotes?.find((item) => item.id === post?.id)
                      ?.voteValue ?? null
                  }
                />
              );
            })}

            <Comments postId={routerPostId} user={user}>
              <CommentInput
                // required info to create the comment
                user={user}
                communityId={router?.query?.communityId}
                selectedPost={singlePost[0]}
              />
            </Comments>
          </>
        )}
        <>
          <About />
        </>
      </PageContent>
    </div>
  );
};

export default PostPage;

// export async function getServerSideProps(context) {
//   const queryId = context.query;

//   return {
//     props: {
//       // queryId,
//     },
//   };
// }
