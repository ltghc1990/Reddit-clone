import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../../../firebase/clientApp";

// components
import NotFound from "../../../components/community/NotFound";
import Header from "../../../components/community/Header";
import PageContent from "../../../components/Layout/PageContent";

const CommunityPage = ({ communityData }) => {
  console.log(communityData);

  if (!communityData) {
    return <NotFound />;
  }
  return (
    <>
      <Header communityData={communityData} />;
      <PageContent>
        <>
          <div>Hello world 1</div>
          <div>Hello world 1</div>
          <div>Hello world 1</div>
          <div>Hello world 1</div>
          <div>Hello world 1</div>
        </>
        <>Hello world 2</>
      </PageContent>
    </>
  );
};

export default CommunityPage;

// get community data from firebase
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
