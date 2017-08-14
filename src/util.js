import React, {Component} from 'react';
import EventEmitter from "events";
import {object,any,func} from "prop-types";

export class Data extends EventEmitter {
  constructor(store, key) {
    super();

    if (typeof store === "string") [key,store] = [store,null];
    if (store == null) store = window.localStorage;
    if (typeof key !== "string" || !key) key = "dice-helper-data";

    this.store = store;
    this.key = key;
    this.fetch();
  }

  fetch() {
    this._fetched = true;

    try {
      const val = this.store.getItem(this.key);
      if (val != null) this.data = JSON.parse(val);
    } catch(e) {
      console.warn(e);
    }

    return this.data;
  }

  toJSON() {
    if (!this._fetched) this.fetch();
    return this.data;
  }
  
  save(data) {
    if (typeof data === "undefined") {
      delete this.data;
      this.store.removeItem(this.key);
    } else {
      this.data = data;
      this.store.setItem(this.key, JSON.stringify(data));
    }

    this.emit("change", this.data);
    return this;
  }
}

export function WatchData(Comp, prop) {
  if (!Comp.propTypes) Comp.propTypes = {};
  if (!Comp.propTypes.data) Comp.propTypes.data = any;
  if (!Comp.propTypes.onChange) Comp.propTypes.onChange = func;

  return class WatchData extends Component {
    static propTypes = {
      [prop]: object
    };

    componentDidMount() {
      this.addListener(this.props);
    }

    componentWillReceiveProps(props) {
      this.removeListener();
      this.addListener(props);
    }

    componentWillUnmount() {
      this.removeListener();
    }

    addListener(props=this.props) {
      props[prop].on("change", this.listener = () => {
        this.setState({});
      });
    }

    removeListener(props=this.props) {
      props[prop].removeListener("change", this.listener);
    }

    render() {
      const data = this.props[prop].toJSON();
      return <Comp
        {...this.props}
        data={data}
        onChange={this.onChange} />;
    }

    onChange = (val) => {
      this.props[prop].save(val);
    }
  }
}

export function calcResults(settings, rounds, its) {
  settings = Object.assign({
    bet: 1,
    factor: 2,
    fee: 0.01,
    prob: 0.5
  }, settings);

  if (typeof rounds === "number") [its,rounds] = [rounds,null];
  if (rounds == null) rounds = [];
  if (typeof its !== "number" || isNaN(its) || its < 0) its = 10;

  const results = [];
  const baseProb = rounds.reduce((m,r) => {
    return m * (1-r.prob);
  }, 1);

  for (let i = 0; i < its; i++) {
    const prev = !i ? rounds[rounds.length - 1] : results[i - 1];
    const getPrev = (key) => prev && typeof prev[key] === "number" ? prev[key] : 0;
    const bet = i && getPrev("bet") ? getPrev("bet") * settings.factor : settings.bet;
    const prob = baseProb * Math.pow(1 - settings.prob, i) * settings.prob;
    const payout = ((1 - settings.prob - settings.fee) / settings.prob) * bet;
    
    results.push({
      bet,
      payout: bet + payout,
      prob: settings.prob,
      losses: getPrev("losses") + bet,
      adjprob: getPrev("adjprob") + prob
    });
  }

  return results;
}

export function displayNumber(n, unit) {
  return <span>
    {formatNumber(n)}
    &nbsp;
    <small className="text-muted">{unit}</small>
  </span>;
}

export function formatNumber(n, opts) {
  return typeof n === "number" ? n.toLocaleString(void 0, {
    maximumFractionDigits: 3,
    ...opts
  }) : n;
}