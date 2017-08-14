import React, { Component } from 'react';
import {SettingsForm} from "./Form";
import {ResultTable} from "./Table";
import {object} from "prop-types";
import {Data,calcResults} from "./util";
import {dropRight} from "lodash";

const defaultSettings = {
  unit: "💰",
  bet: 1,
  factor: 2,
  prob: 0.5,
  fee: 0.01
};

class App extends Component {
  static propTypes = {
    settings: object,
    rounds: object
  };

  static defaultProps = {
    settings: new Data("dice-helper-settings"),
    rounds: new Data("dice-helper-rounds")
  };

  constructor(props, ...args) {
    super(props, ...args);
    this.state = {
      rounds: props.rounds.get([]),
      settings: props.settings.get(defaultSettings)
    };
  }

  render() {
    const {settings,rounds} = this.state;

    return <div className="container my-4">
      <SettingsForm
        value={settings}
        onChange={this.onChangeSettings} />
      <ResultTable
        rounds={rounds}
        settings={settings}
        onClear={this.onClear}
        onLock={this.onLock}
        onUnlock={this.onUnlock} />
    </div>;
  }

  onChangeSettings = (settings) => {
    this.props.settings.save(settings);
    this.setState({ settings });
  }

  onClear = () => {
    this.props.rounds.save([]);
    this.setState({ rounds: [] });
  }

  onLock = () => {
    const {settings,rounds} = this.state;
    const round = calcResults(settings, rounds, 1)[0];
    const result = rounds.concat(round);
    this.props.rounds.save(result);
    this.setState({ rounds: result });
  }
  
  onUnlock = () => {
    const rounds = dropRight(this.state.rounds);
    this.props.rounds.save(rounds);
    this.setState({ rounds });
  }
}

export default App;
