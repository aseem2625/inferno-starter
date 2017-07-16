import Inferno from 'inferno';
import { Link } from 'inferno-router';

import WithStyles from '../WithStyles';
import s from '../../styles/components/card-link.sass';

const CardLink = function (props) {
	return (
		<Link to={ props.to } className="card">{ props.children }</Link>
	)
};

export default WithStyles(s)(CardLink);
