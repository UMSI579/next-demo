import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import {useState, useEffect, createContext} from "react";
import EventsListing from "../components/EventsListing";
import Image from "next/image";

export const EventContext = createContext();

// The staticData prop only has a value during static rendering.
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
            <h2>This is just here to demo how images work in Next.</h2>
            {/* Look at the network tab on initial page load and notice these
              images aren't loaded until they are within viewing range.

              Load the page with the browser narrow and notice that smaller
              images are loaded - not just resized versions of the larger
              images. If the viewport is widened, larger images automatically
              replace the smaller ones so the image quality is maintained.
              */}
            <div className='image-demo'>
                <Image
                    src="/images/pic1.png"
                    width={800}
                    height={400}
                    alt='joe pera'
                    sizes="(max-width: 800px) 100vw,800px"
                />
                <Image
                    src="/images/pic2.webp"
                    width={931}
                    height={524}
                    alt='runnin with the devil'
                    sizes="(max-width: 931px) 100vw,931px"

                />
                <Image
                    src="/images/pic3.webp"
                    width={780}
                    height={520}
                    alt='hut dog'
                    sizes="(max-width: 780px) 100vw,780px"

                />
                <Image
                    src="/images/pic4.jpeg"
                    height={700}
                    width={700}
                    alt='i care because you do'
                    sizes="(max-width: 700px) 100vw,700px"

                />
                <Image
                    src="/images/pic5.webp"
                    height={700}
                    width={700}
                    alt='legion'
                    sizes="(max-width: 700px) 100vw,700px"
                />
            </div>
        </Layout>
      </EventContext.Provider>
  )
}

// THIS POINT FORWARD IS FOR STATIC SITE RENDERING
// This creates props to be sent to the default export component `Home` during
// static rendering. These are props that are only present when `build` is
// called.
export async function getStaticProps({ params }) {
    const eventCall = await fetch('https://events.umich.edu/day/json')
    const theStaticValue = await eventCall.json()

    return { props: {staticData: theStaticValue}};
}
