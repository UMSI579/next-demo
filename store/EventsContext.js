import React, {useState, useEffect, createContext} from 'react';

// Create a context - works the same as state data but doesn't
// need to be passed from component to component. It is grabbed
// by components that need it.
const EventsContext = createContext({});

// Components that use a given context need to be wrapped in a
// provider component that provides that context. That component
// is being created here, but the provider(s) don't have to be
// in the same file as where the components are created.
const EventsProvider = (props) => {
    // Inside the provider, we have state like we are accustomed to seeing.
    // What makes context unique is that this state can be used by other
    // components without having to pass it as a prop.
    const [umichEvents, setUmichEvents] = useState([]);

    // Here, we just update the state like we usually would..
    useEffect(() => {
        fetch('https://events.umich.edu/day/json')
            .then((response) => response.json())
            .then((json) => setUmichEvents(json)    );
    }, []);

    // By using the <ContextName>.Provider, we can add `umichEvents` as
    // the value provided by that context. Anything wrapped in `EventsProvider`
    // will have access to the full umichEvents state data.
    return (
        <EventsContext.Provider value={umichEvents}>
            {props.children}
        </EventsContext.Provider>
    )
}

export { EventsContext, EventsProvider };