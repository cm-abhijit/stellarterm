const React = window.React = require('react');
import AddTrustRow from './AddTrustRow.jsx';
import Stellarify from '../../lib/Stellarify';
import MessageRow from '../MessageRow.jsx';
import _ from 'lodash';

export default class AddTrustFromFederation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      federation: '',
      currencies: [],
      state: 'initial', // States: initial, pending, found, notfound
    };

    this.handleInputFederation = event => {
      let fedValue = event.target.value;
      this.setState({
        federation: fedValue,
        state: 'pending',
        currencies: [],
      });

      StellarSdk.StellarTomlResolver.resolve(fedValue)
      .then(res => {
        if (fedValue !== this.state.federation) {
          return;
        }
        this.setState({
          federation: fedValue,
          state: 'found',
          currencies: res.CURRENCIES,
        });
      })
      .catch(err => {
        if (fedValue !== this.state.federation) {
          return;
        }
        this.setState({
          federation: fedValue,
          state: 'notfound',
          currencies: [],
        });
      });
    }
  }

  render() {
    let results;
    if (this.state.state === 'pending') {
      results = <MessageRow>Loading currencies for {this.state.federation}...</MessageRow>
    } else if (this.state.state === 'notfound') {
      results = <MessageRow>Unable to find currencies for {this.state.federation}</MessageRow>
    } else if (this.state.state === 'found') {
      results = _.map(this.state.currencies, currency => {
        let asset = Stellarify.assetToml(currency);
        const key = currency.code + currency.issuer;
        return <AddTrustRow key={key} d={this.props.d} asset={asset}></AddTrustRow>;
      });
    }

    return <div className="island">
      <div className="island__header">
        Add trust via federation
      </div>
      <div className="island__paddedContent">
        <p>You can add trust using the federation url.</p>
        <label className="s-inputGroup AddTrust__inputGroup">
          <span className="s-inputGroup__item s-inputGroup__item--tag S-flexItem-1of4">
            <span>Federation URL</span>
          </span>
          <input className="s-inputGroup__item S-flexItem-share" type="text" value={this.state.federation} onChange={this.handleInputFederation} placeholder="example: coins.asia" />
        </label>
      </div>
      {results}
    </div>
  }
}
