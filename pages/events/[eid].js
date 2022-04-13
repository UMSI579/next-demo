import { useRouter } from 'next/router'
import {EventsContext} from "../../store/EventsContext";
import Layout from '../../components/layout'
import Image from 'next/image'

// It would be simpler than passing staticValue if I weren't also
// demoing Context.
const anEvent = ({staticValue}) => {
    const router = useRouter()
    const {eid} = router.query;

    const eventInfo = (events) => {
        const thisEvent = events[eid];
        return (
            <>
                <h1>{thisEvent.event_title}</h1>
                <h2>{thisEvent.event_subtitle}</h2>
                {thisEvent.image_url && <div><Image src={thisEvent.image_url}  width="100%" height="100%" layout="responsive" /></div>}
                <p>{thisEvent.description}</p>
                {thisEvent.image_url && <div><Image src={thisEvent.image_url}  width={200} height={200}  /></div>}
            </>
        )
    }

    // This rendering only happens when we're generating statically.
    if (staticValue) {
        return (
            <Layout>
                <>
                    {Object.keys(staticValue).length === 0 && <h2>Loadang...</h2>}
                    {Object.keys(staticValue).length > 0 && eventInfo(staticValue)}
                </>
            </Layout>)
    }

    // This is the "live" render.
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

// THIS POINT FORWARD IS FOR STATIC SITE RENDERING


let theStaticValue = null;

export async function getStaticPaths() {
    // Get the current events returned by the Umich API
    const eventCall = await fetch('https://events.umich.edu/day/json')
    const eventJson = await eventCall.json()
    // Get the event IDs used to see posts
    const paths = Object.keys(eventJson).map((eventId) => ({
        params: { eid: eventId },
    }))
    // Return the event IDs that should have pages pre-rendered.
    return { paths, fallback: false }
}

export async function getStaticProps({ params }) {
    if (!theStaticValue) {
        const eventCall = await fetch('https://events.umich.edu/day/json')
        theStaticValue = await eventCall.json()
    }

    return { props: {staticValue: theStaticValue}};
}

export default anEvent;