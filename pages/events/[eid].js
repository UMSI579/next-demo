import { useRouter } from 'next/router'
import {EventsContext} from "../../store/EventsContext";
import Layout from '../../components/layout'
import Image from 'next/image'
import { promises as fs } from 'fs'
import path from 'path'

// It would be simpler than passing staticValue if I weren't also
// demoing Context.
const anEvent = ({staticValue}) => {
    const router = useRouter();
    // Because the filename is [eid] with the square brackets, the `eid` is a
    // dynamic value that we use to populate the page with details of the event
    // with that id/
    const {eid} = router.query;

    // This provides JSX output for a given event.
    const eventInfo = (events) => {
        // Get the event with the id `eid`, acquired from the URL.
        const thisEvent = events[eid];
        return (
            <>
                <h1>{thisEvent.event_title}</h1>
                <h2>{thisEvent.event_subtitle}</h2>
                <div>{new Date(thisEvent.date_start).toLocaleDateString()} {thisEvent.time_start}</div>
                {thisEvent.styled_images &&
                    thisEvent.styled_images.event_feature_large &&
                        <Image src={thisEvent.styled_images.event_feature_large}
                               layout="responsive"
                               width={760}
                               height={512}
                               priority
                        />
                }
                <p>{thisEvent.description}</p>
            </>
        )
    }

    // staticValue only has a value when generating statically.
    if (staticValue) {
        return (
            <Layout>
                {Object.keys(staticValue).length > 0 && eventInfo(staticValue)}
            </Layout>)
    }


    // This is what renders during a normal browser request i.e. not static
    return (
        <Layout>
            <EventsContext.Consumer>
                {value =>
                    <>
                    {Object.keys(value).length === 0 && <h2>Loading...</h2>}
                        {Object.keys(value).length > 0 && eventInfo(value)}
                    </>
                }
            </EventsContext.Consumer>
        </Layout>)
}




// getStaticProps (below) is called for each Umich event that exists in the
// API response. To avoid re-requesting the Umich events data every time, we
// cache that response in the filesuystem
const cache = {
    get: async () => {
        try {
            const data = await fs.readFile(path.join(process.cwd(), 'events.db'));
            return JSON.parse(data);
        } catch (e) {
            return null;
        }

    },
    set: async (events) => {
        return fs.writeFile(path.join(process.cwd(), 'events.db'), JSON.stringify(events));
    },
    clear: async () => {
        return fs.unlink(path.join(process.cwd(), 'events.db'))
    },
}

// This component can have as many different URLs as there are event ids.
// This function gets all the current event ids and tells static rendering
// to create a page for each.
export async function getStaticPaths() {
    // Get the current events returned by the Umich API
    const eventCall = await fetch('https://events.umich.edu/day/json')
    const eventJson = await eventCall.json()
    // Get the event IDs used to see posts
    const paths = Object.keys(eventJson).map((eventId) => ({
        params: { eid: eventId },
    }))

    // Clear the cache so the static build has the most recent events.
    await cache.clear();

    // Return the event IDs that should have pages pre-rendered.
    return { paths, fallback: false }
}

export async function getStaticProps({ params }) {
    // Check to see if the Events API values are cached so we don't have to
    // fetch the same events endpoint multiple times.
    let theStaticValue = await cache.get();
    if(!theStaticValue) {
        theStaticValue = {};
        const eventCall = await fetch('https://events.umich.edu/day/json')
        const eventJson = await eventCall.json();
         Object.entries(eventJson).forEach(([index, eventData]) => {
             theStaticValue[index] = (({event_title, event_subtitle, date_start, time_start, styled_images, description}) => ({event_title, event_subtitle, date_start, time_start, styled_images, description}))(eventData);
         });
        cache.set(theStaticValue);

    }

    return {
        props: {
            staticValue: {
                    [params.eid]: theStaticValue[params.eid]
            },
        },
    };
}

export default anEvent;