import React from 'react';
// import * as PropTypes from 'prop-types';
// import { Button } from 'react-bootstrap';
import { Navbar, Footer } from '../UILibrary/components';

// function AnagramButton(props) {
//     // eslint-disable-next-line react/prop-types
//     const { id, pos } = props;
//     return (
//         <Button id="anagram-button" href={`/anagram/${id}/${pos}`} variant="outline-primary">
//             {pos} Anagram for Text {id}
//         </Button>
//     );
// }

const PARTS_OF_SPEECH = ['Noun', 'Verb', 'Adjective', 'Adverb'];

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
                <table border="2" width="1300px">
                    <tbody>
                        <tr>
                            <th>Title</th>
                            <th className="text-td">Text</th>
                            <th>Anagram Links</th>
                        </tr>
                        {this.state.data.map((text, k) => (
                            <tr key={k}>
                                <td>{text.title}</td>
                                <td className="text-td">{text.text}</td>
                                <td>
                                    {PARTS_OF_SPEECH.map((pos) => {
                                        const posLink = pos.toLowerCase();
                                        return (
                                            <>
                                                <a href={`/anagram/${text.id}/${posLink}`}>
                                                    {pos} Anagram
                                                </a>
                                                <br/>
                                                <a href={`/flashcard/${text.id}/${posLink}`}>
                                                    {pos} Flashcards
                                                </a>
                                                <br/>
                                            </>
                                        );
                                    })}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Footer />
        </React.Fragment>);
    }
}
export default IndexView;
