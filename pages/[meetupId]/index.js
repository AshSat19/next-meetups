import { MongoClient, ObjectId } from "mongodb";

import Head from "next/head";
import { Fragment } from "react-is";

import MeetupDetail from "../../components/meetups/MeetupDetail";

function MeetupDetailsPage(props) {
  return (
    <Fragment>
      <Head>
        <title>{props.meetupData?.title}</title>
        <meta name="description" content={props.meetupData?.description}></meta>
      </Head>
      <MeetupDetail
        image={props.meetupData?.image}
        title={props.meetupData?.title}
        address={props.meetupData?.address}
        description={props.meetupData?.description}
      />
    </Fragment>
  );
}

export async function getStaticPaths() {
  const client = await MongoClient.connect(
    "mongodb://localhost:27017/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");
  const meetupIds = await meetupsCollection.find({}, { _id: 1 }).toArray();

  client.close();

  return {
    fallback: false,
    paths: meetupIds?.map((m) => ({ params: { meetupId: m._id.toString() } })),
  };
}

export async function getStaticProps(context) {
  const meetupId = context.params?.meetupId;

  const client = await MongoClient.connect(
    "mongodb://localhost:27017/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");
  const meetup = await meetupsCollection.findOne({ _id: ObjectId(meetupId) });

  client.close();

  return {
    props: {
      meetupData: {
        id: meetupId,
        title: meetup?.title,
        image: meetup?.image,
        address: meetup?.address,
        description: meetup?.description,
      },
    },
    revalidate: 10,
  };
}

export default MeetupDetailsPage;
