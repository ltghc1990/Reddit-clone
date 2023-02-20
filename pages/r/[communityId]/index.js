import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../../../firebase/clientApp";

// components
import NotFound from "../../../components/community/NotFound";
import Header from "../../../components/community/Header";
import PageContent from "../../../components/Layout/PageContent";
import CreatePostLink from "../../../components/community/CreatePostLink";
import Posts from "../../../components/Posts/Posts";
import About from "../../../components/community/About";

const CommunityPage = ({ communityData }) => {
  if (!communityData) {
    return <NotFound />;
  }

  return (
    <>
      <Header communityData={communityData} />
      <PageContent>
        <>
          <CreatePostLink />

          <Posts communityData={communityData} />
        </>
        <About communityData={communityData} />
      </PageContent>
    </>
  );
};

export default CommunityPage;

// get community data from firebase, will serve as initial props for react query
export async function getServerSideProps(context) {
  // grab the query param from the context
  try {
    const queryId = context.query.communityId;
    const communityDocRef = doc(firestore, "communities", queryId);

    const communityDoc = await getDoc(communityDocRef);
    // this fixes the serialize error
    const data = JSON.parse(
      JSON.stringify({ id: communityDoc.id, ...communityDoc.data() })
    );

    return {
      props: {
        communityData: data.creatorId ? data : null,
      },
    };
  } catch (error) {
    console.log("getServerSideProps error", error);
  }
}
