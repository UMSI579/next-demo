import Link from 'next/link'
import {EventsContext} from "../store/EventsContext";

const EventsListing = ({staticData}) => {
    // staticData only has a value during static rendering. In a normal
    // browser request, staticData is undefined and this condition does
    // not execute.
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
            {/* 👇 `value` is the value of EventsContext (the full events object)
              It is available here because this is a `.Consumer` of the context.

              Notice that we are not directly returning JSX, but a function with the
              argument `value` that does the JSX returning.
              */}
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
