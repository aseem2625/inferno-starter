import Inferno from 'inferno';
import Component from 'inferno-component';


export default function WithStyles(...styles) {
	return WrappedComponent =>
		class WithStyles extends Component {
			componentWillMount() {
				if (__SERVER__) {
					this.removeCss = this.context.insertCss.apply(undefined, styles);
				}
			}
			componentWillUnmount() {
				if (__SERVER__) {
					setTimeout(this.removeCss, 0);
				}
			}
			render(props) {
				return <WrappedComponent {...props} />;
			}
		};
}
