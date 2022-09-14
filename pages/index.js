import { Fragment } from "react";
import Head from "next/head";
import { MongoClient } from "mongodb";
import MeetupList from "../components/meetups/MeetupList";

function HomePage(props) {
  return (
    <Fragment>
      <Head>
        <title>React Meetups</title>
        <meta name="description" content="Browse a list of React meetups" />
      </Head>
      <MeetupList meetups={props.meetups} />;
    </Fragment>
  );
}

// export async function getServerSideProps(context) {
//   const req = context.req;
//   const res = context.res;
//   //fetch data from an API
//   return {
//     props: {
//       meetups: DUMMY_MEETUPS,
//     },
//   };
// } // runs on server after deployment slower than getStaticProps only use getServerSideProps if we need acces to req object or if data change multiple times a sec

// export async function getStaticProps() {
//   //fetch data from an API
//   const client = await MongoClient.connect(
//     "mongodb+srv://theshoguns:KiCWYgZm5lFKOPTI@cluster0.rgz4dah.mongodb.net/meetups?retryWrites=true&w=majority"
//   );
//   const db = client.db();
//   const meetupsCollection = db.collection("meetups");

//   const meetups = await meetupsCollection.find().toArray();

//   client.close();

//   return {
//     props: {
//       meetups: meetups.map((meetup) => ({
//         title: meetup.title,
//         address: meetup.address,
//         image: meetup.image,
//         id: meetup._id.toString(),
//       })),
//     },
//     revalidate: 1, // will regenerated every second if there is a request, data will never be older that 1sec
//   }; // always needs to return an object with a props property
// } //executed during build process not executed by the client. Fills the page source from the beginning - good for SEO

export async function getStaticProps() {
  // fetch data from an API
  const client = await MongoClient.connect(
    "mongodb+srv://theshoguns:KiCWYgZm5lFKOPTI@cluster0.rgz4dah.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const meetups = await meetupsCollection.find().toArray();
  console.log(meetups);

  client.close();

  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.data.title,
        address: meetup.data.address,
        image: meetup.data.image,
        id: meetup._id.toString(),
      })),
    },
    revalidate: 1,
  };
}

export default HomePage;
