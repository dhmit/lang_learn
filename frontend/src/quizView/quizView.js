import React, {useState} from 'react';
// import ReactTooltipDefaultExport from 'react-tooltip';
import * as PropTypes from 'prop-types';
import {
  ButtonGroup,
  ToggleButton,
 } from 'react-bootstrap';
// import { Navbar, Footer } from '../UILibrary/components';

function ButtonChoices() {
  const [radioValue, setRadioValue] = useState('1');

  const radios = [
    { name: 'Choice 1', value: '1' },
    { name: 'Choice 2', value: '2' },
    { name: 'Choice 3', value: '3' },
    { name: 'Choice 4', value: '4' },
  ];

  return (
    <>
      <ButtonGroup toggle>
        {radios.map((radio, idx) => (
          <ToggleButton
            key={idx}
            type="radio"
            variant="secondary"
            name="radio"
            value={radio.value}
            checked={radioValue === radio.value}
            onChange={(e) => setRadioValue(e.currentTarget.value)}
          >
            {radio.name}
          </ToggleButton>
        ))}
      </ButtonGroup>
    </>
  );
}

export class QuizView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    try {
      const response = await fetch('/api/ENDPOINT/');
      const data = await response.json();
      this.setState({data});
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    return (
      <React.Fragment>
        {/* <Navbar /> */}
        <div className="page">
          <h1>Verb Conjugation Quiz</h1>
          <p>by Takako Aikawa</p>
          <div className="col shaded-box">
            <ul>
              {/* list of questions for this quiz */}
            </ul>
          </div>
          <div className="col-6 shaded-box">
            <h3>Question</h3>
            <p>Select the correct conjugation for </p>
            {/* insert word */}
            {/* sentence with blank */}
            <ButtonChoices />
          </div>
        </div>
        {/* <Footer /> */}
      </React.Fragment>);
  }
}

export default QuizView;
