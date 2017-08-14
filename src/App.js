import React, { Component } from 'react';
import {SettingsForm} from "./Form";
import {ResultTable} from "./Table";
import {object} from "prop-types";
import {WatchData,calcResults} from "./util";
import {set} from "lodash";
import classnames from "classnames";

const defaultSettings = {
  unit: "💰",
  bet: 1,
  factor: 2,
  prob: 0.5,
  fee: 0.01,
  sidebarOpen: true
};

class App extends Component {
  static propTypes = {
    data: object
  };

  static defaultProps = {
    data: {
      rounds: [],
      settings: defaultSettings
    }
  };

  render() {
    const {data} = this.props;
    const classes = ["main"];
    const sidebarOpen = data.settings.sidebarOpen;
    if (sidebarOpen) classes.push("sidebar-open");

    return <div className={classnames(classes)}>
      <div className="btn-group open-settings-button-group">
        <button
          className="btn btn-link"
          onClick={this.openSidebar}
        >
          <i className="fa fa-pencil-square-o"></i> Edit
        </button>
        <button
          className="btn btn-link text-danger"
          onClick={this.onClear}
        >
          <i className="fa fa-trash-o"></i> Clear
        </button>
      </div>
      <div className="settings-container">
        <div className="btn-group float-right">
          <button
            className="btn btn-link text-danger btn-sm"
            onClick={this.onClear}
          >
            <i className="fa fa-trash-o"></i> Clear
          </button>
        </div>
        <div className="btn-group mb-4">
          <button
            className="btn btn-link text-muted btn-sm"
            onClick={this.closeSidebar}
          >
            <i className="fa fa-times"></i>
          </button>
        </div>
        <SettingsForm
          value={data.settings}
          onChange={this.onChangeSettings} />
      </div>
      <div className="table-container">
        <ResultTable
          rounds={data.rounds}
          settings={data.settings}
          onLock={this.onLock}
          onUnlock={this.onUnlock} />
      </div>
    </div>;
  }

  setData(key, val) {
    let data = this.props.data;

    if (arguments.length >= 2) {
      set(data, key, val);
    } else if (key != null) {
      data = key;
    }
    
    this.props.onChange(data);
  }

  openSidebar = () => {
    const {settings} = this.props.data;
    settings.sidebarOpen = true;
    this.setData("settings", settings);
  }
  
  closeSidebar = () => {
    const {settings} = this.props.data;
    settings.sidebarOpen = false;
    this.setData("settings", settings);
  }

  onChangeSettings = (settings) => {
    this.setData("settings", settings);
  }

  onClear = () => {
    const {settings,rounds} = this.props.data;
    if (rounds.length) settings.bet = rounds[0].bet;
    this.setData({ settings, rounds: [] });
  }

  onLock = () => {
    const {settings,rounds} = this.props.data;
    const results = calcResults(settings, rounds, 2);

    settings.bet = results[1].bet;
    rounds.push(results[0]);
    this.setData();
  }
  
  onUnlock = () => {
    const {settings,rounds} = this.props.data;
    const unlocked = rounds.pop();
    settings.bet = unlocked.bet;
    this.setData();
  }
}

export default WatchData(App, "data");
