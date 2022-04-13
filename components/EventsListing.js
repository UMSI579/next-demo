
import Link from 'next/link'
import {EventsContext} from "../store/EventsContext";

const EventsListing = ({staticData}) => {
    if (staticData) {
        return  (<ul>
            {Object.keys(staticData).length === 0 && <h2>Loading!</h2>}
            {Object.entries(staticData).map(([eventKey, eventInfo]) =>
                <li key={eventKey}>
                    <Link key={eventKey} href={`/events/${eventKey}`} >{eventInfo.event_title}</Link>
                </li>)
            }
        </ul>)
    }

    return (
        <EventsContext.Consumer>
            {value =>
                <ul>
                    {Object.keys(value).length === 0 && <h2>Loading...</h2>}
                    {Object.entries(value).map(([eventKey, eventInfo]) =>
                         <li key={eventKey}>
                             <Link href={`/events/${eventKey}`} >{eventInfo.event_title}</Link>
                         </li>)
                    }
                </ul>
            }
        </EventsContext.Consumer>
    )
}

export default EventsListing
