import Inferno from 'inferno';

export default function (props) {
	const styles = require('../../styles/components/card.sass');

	return <div className="card">{ props.children }</div>
}
