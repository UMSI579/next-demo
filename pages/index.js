import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import {useState, useEffect, createContext, useContext} from "react";
import EventsListing from "../components/EventsListing";

export const EventContext = createContext();

export default function Home({staticData}) {
    const [umichEvents, setUmichEvents] = useState([]);
    useEffect(() => {
        fetch('https://events.umich.edu/day/json')
            .then((response) => response.json())
            .then((json) => setUmichEvents(json));
    }, []);

  return (
      <EventContext.Provider value={umichEvents}>
        <Layout home>
          <Head>
            <title>Event List</title>
          </Head>
              <EventsListing staticData={staticData} />
        </Layout>
      </EventContext.Provider>
  )
}

// THIS POINT FORWARD IS FOR STATIC SITE RENDERING

let theStaticValue = null;

export async function getStaticProps({ params }) {
    if (!theStaticValue) {
        const eventCall = await fetch('https://events.umich.edu/day/json')
        theStaticValue = await eventCall.json()
    }

    return { props: {staticData: theStaticValue}};
}
