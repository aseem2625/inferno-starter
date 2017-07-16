import Inferno from 'inferno';

import WithStyles from '../WithStyles';
import s from '../../styles/components/card.sass';

const Card = function (props) {
	// const styles = require('../../styles/components/card.sass');

	return <div className="card">{ props.children }</div>
};

export default WithStyles(s)(Card);
