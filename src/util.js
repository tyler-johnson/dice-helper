import React from 'react';

export class Data {
  constructor(store, key) {
    if (typeof store === "string") [key,store] = [store,null];
    if (store == null) store = window.localStorage;
    if (typeof key !== "string" || !key) key = "data"

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

  get(def) {
    if (!this._fetched) this.fetch();
    return typeof this.data === "undefined" ? def : this.data;
  }
  
  save(data) {
    if (typeof data === "undefined") {
      delete this.data;
      this.store.removeItem(this.key);
    } else {
      this.data = data;
      this.store.setItem(this.key, JSON.stringify(data));
    }

    return this;
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
    const bet = getPrev("bet") ? getPrev("bet") * settings.factor : settings.bet;
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

export function formatNumber(n, unit) {
  return <span>
    {n.toLocaleString(void 0, {
      maximumFractionDigits: 3
    })}
    &nbsp;
    <small className="text-muted">{unit}</small>
  </span>;
}