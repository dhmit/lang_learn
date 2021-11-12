import React from 'react';

export const InstructorViewContext = React.createContext({
    'showModal': false,
    'resourceAmount': 0,
    'setShowModal': () => {},
    'setResourceAmount': () => {},
});


