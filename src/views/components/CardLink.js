import Inferno from 'inferno';
import { Link } from 'inferno-router';

export default function (props) {
	const styles = require('../../styles/components/card-link.sass');

	return (
		<Link to={ props.to } className="card">{ props.children }</Link>
	)
};
