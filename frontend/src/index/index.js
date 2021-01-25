import React from 'react';
// import * as PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { Navbar, Footer } from '../UILibrary/components';

function AnagramButton(props) {
    // eslint-disable-next-line react/prop-types
    const { id, pos } = props;
    return (
        <Button id="anagram-button" href={`/anagram/${id}/${pos}`} variant="outline-primary">
            {pos} Anagram for Text {id}
        </Button>
    );
}

const PARTS_OF_SPEECH = ['noun', 'verb', 'adjective', 'adverb'];

export class IndexView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
        };
    }

    async componentDidMount() {
        try {
            const response = await fetch('/api/all_text');
            const data = await response.json();
            this.setState({ data });
        } catch (e) {
            console.log(e);
        }
    }

    render() {
        if (!this.state.data) {
            return (<>
                Loading!
            </>);
        }

        return (<React.Fragment>
            <Navbar />
            <div className="page">
                {this.state.data.map((text) => (
                    <>
                        {PARTS_OF_SPEECH.map((pos) => (
                            <AnagramButton key={`${text.id}/${pos}`} id={text.id} pos={pos}/>
                        ))}
                    </>
                ))}
            </div>
            <Footer />
        </React.Fragment>);
    }
}
export default IndexView;
