import { Fragment } from "react";
import Head from "next/head";
import { MongoClient, ObjectId } from "mongodb";
import MeetupDetail from "../../components/meetups/MeetupDetail";

function MeetupDetails(props) {
  return (
    <Fragment>
      <Head>
        <title>{props.meetupData.title}</title>
        <meta name="description" content={props.meetupData.description} />
      </Head>
      <MeetupDetail
        image={props.meetupData.image}
        title={props.meetupData.title}
        address={props.meetupData.address}
        description={props.meetupData.description}
      />
    </Fragment>
  );
}

export async function getStaticPaths() {
  const client = await MongoClient.connect(
    "mongodb+srv://theshoguns:KiCWYgZm5lFKOPTI@cluster0.rgz4dah.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();

  client.close();

  return {
    fallback: false,
    paths: meetups.map((meetup) => ({
      params: { meetupId: meetup._id.toString() },
    })),
  };
}

export async function getStaticProps(cxt) {
  // fetch data for a single meetup

  const meetUpId = cxt.params.meetupId;

  const client = await MongoClient.connect(
    "mongodb+srv://theshoguns:KiCWYgZm5lFKOPTI@cluster0.rgz4dah.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const selectedmeetup = await meetupsCollection.findOne({
    _id: ObjectId(meetUpId),
  });

  client.close();

  return {
    props: {
      meetupData: {
        id: selectedmeetup._id.toString(),
        title: selectedmeetup.data.title,
        address: selectedmeetup.data.address,
        description: selectedmeetup.data.description,
        image: selectedmeetup.data.image,
      },
    },
  };
}

export default MeetupDetails;
