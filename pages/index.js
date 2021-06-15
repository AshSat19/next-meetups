import { MongoClient } from "mongodb";

import Head from "next/head";
import { Fragment } from "react-is";

import MeetupList from "../components/meetups/MeetupList";

function HomePage(props) {
  return (
    <Fragment>
      <Head>
        <title>React Meetups</title>
      </Head>
      <MeetupList meetups={props.meetups} />
    </Fragment>
  );
}

export async function getStaticProps() {
  const client = await MongoClient.connect(
    "mongodb://localhost:27017/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");
  const meetups = await meetupsCollection.find().toArray();

  client.close();

  return {
    props: {
      meetups: meetups?.map((m) => ({
        id: m._id.toString(),
        title: m.title,
        image: m.image,
        address: m.address,
      })),
    },
    revalidate: 10,
  };
}

export default HomePage;
