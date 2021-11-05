import React, {useState} from "react";

const [showModal, setShowModal] = useState(false);
// used to keep track how many resources to be added
const [resourceAmount, setResourceAmount] = useState(0);

export const InstructorViewContext = React.useContext({
    "showModal" : false,
    "resourceAmount" : 0,
    setShowModal,
    resourceAmount,
    setResourceAmount,
});
