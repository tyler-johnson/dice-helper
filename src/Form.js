import React, { Component } from "react";
import {oneOf,string,any,func} from "prop-types";
import classnames from "classnames";
import {omit} from "lodash";
import {formatNumber} from "./util";

export class SettingsForm extends Component {
  static propTypes = {
    value: any,
    onChange: func.isRequired,
    className: string
  };
  
  render() {
    const value = this.props.value || {};

    return <div className="row">
      <Input
        className="col-12 col-sm-4"
        label="Currency Unit"
        help="for display purposes"
        type="text"
        value={value.unit}
        onChange={this.onChange("unit")} />
      <Input
        className="col-12 col-sm-4"
        label="Initial Bet"
        help="amount of ETH to bet in first round"
        type="number"
        value={value.bet}
        onChange={this.onChange("bet")} />
      <Input
        className="col-12 col-sm-4"
        label="Bet Factor"
        help="increase the bet by this amount every round"
        type="number"
        value={value.factor}
        onChange={this.onChange("factor")} />
      <Input
        className="col-12 col-sm-6"
        label="Chance to Win"
        help="must roll a number at or below this one to win"
        type="range"
        min="0.01"
        max="0.99"
        step="0.01"
        value={value.prob}
        onChange={this.onChange("prob")}
        format={(v) => formatNumber(v * 100, "%")} />
      <Input
        className="col-12 col-sm-6"
        label="House Edge"
        help="commission the house takes off the top of your bet"
        type="range"
        min="0"
        max="0.1"
        step="0.001"
        value={value.fee}
        onChange={this.onChange("fee")}
        format={(v) => formatNumber(v * 100, "%")} />
    </div>;
  }

  onChange(key) {
    return (val) => {
      this.props.onChange({
        ...this.props.value,
        [key]: val
      });
    };
  }
}

export class Input extends Component {
  static propTypes = {
    type: oneOf([
      "range",
      "text",
      "number"
    ]),
    label: string,
    help: string,
    value: any,
    defaultValue: any,
    onChange: func,
    className: string,
    format: func
  };

  static defaultProps = {
    type: "text",
    format: (v) => v
  };

  state = {};

  get value() {
    if (typeof this.props.value !== "undefined") {
      return this.props.value;
    } else if (typeof this.state.value !== "undefined") {
      return this.state.value;
    } else if (typeof this.props.defaultValue !== "undefined") {
      return this.props.defaultValue;
    } else {
      return "";
    }
  }

  set value(val) {
    if (typeof this.props.value === "undefined") {
      this.setState({ value: val }, () => this._onChange(val));
    } else {
      this._onChange(val);
    }
  }

  _onChange(val) {
    if (this.props.onChange) {
      this.props.onChange(val);
    }
  }

  render() {
    const value = this.value;
    const {type,help,label,className,format,...props} = omit(this.props, "defaultValue");
    const classes = classnames(className, "form-group");

    return <div className={classes}>
      <label>{label}</label>
      {type === "range" ?
        <span className="float-right">{format(value)}</span> : null}
      <input
        {...props}
        className="form-control"
        type={type}
        value={value}
        onChange={(e) => this.value = e.target[type === "text" ? "value" : "valueAsNumber"]} />
      <div>
        <small className="text-muted">{help}</small>
      </div>
    </div>;
  }
}