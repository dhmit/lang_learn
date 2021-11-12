import React, { useState } from 'react';

export const InstructorViewContext = React.createContext({
    'showModal': false,
    'resourceAmount': 0,
    'setShowModal': () => {},
    'setResourceAmount': () => {},
});

export default function InstructorViewContextProvider(props) {
    const [showModal, setShowModal] = useState(false);
    // used to keep track how many resources to be added
    const [resourceAmount, setResourceAmount] = useState(0);
    const contextState = {
        showModal,
        setShowModal,
        resourceAmount,
        setResourceAmount,
    };

    return (
        <InstructorViewContext.Provider value={contextState}>
            { props.children }
        </InstructorViewContext.Provider>
    );
}
InstructorViewContextProvider.propTypes = {
    children: React.Component,
};



