import React from 'react';

export const InstructorViewContext = React.createContext({
    'setTextData': () => {},
    'textData': '',
    'showModal': false,
    'resourceAmount': 0,
    'setShowModal': () => {},
    'setResourceAmount': () => {},
});


