import Inferno from 'inferno';
import Card from '../../components/Card';

export default function () {
	const styles = require('../../../styles/containers/errors/404.sass');
	
	return (
		<div className="page page__404">
			<Card>
				<h1>404 Page</h1>
				<p>Looks like you were given a bad link ;-)</p>
			</Card>
		</div>
	);
}
