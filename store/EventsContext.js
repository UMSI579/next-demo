import React, {useState, useEffect} from 'react';

const EventsContext = React.createContext({});

const EventsProvider = (props) => {
    const [umichEvents, setUmichEvents] = useState([]);
    useEffect(() => {
        fetch('https://events.umich.edu/day/json')
            .then((response) => response.json())
            .then((json) => setUmichEvents(json));
    }, []);

    return (
        <EventsContext.Provider value={umichEvents}>
            {props.children}
        </EventsContext.Provider>
    )
}

export { EventsContext, EventsProvider };