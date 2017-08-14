import React, { Component } from 'react';
import {object,number,arrayOf,func,string,node} from "prop-types";
import {displayNumber,calcResults} from "./util";
import classnames from "classnames";

export class ResultTable extends Component {
  static propTypes = {
    settings: object,
    rounds: arrayOf(object),
    onLock: func,
    onUnlock: func
  };

  render() {
    const {settings,rounds,onLock,onUnlock} = this.props;
    const results = calcResults(settings, rounds);

    return <table className="table">
      <thead>
        <tr key="i">
          <th>#</th>
          <th>Chance</th>
          <th>Adj. Prob.</th>
          <th>Bet</th>
          <th>Losses</th>
          <th>Payout</th>
          <th>Profit</th>
          <th>PPR</th>
          <th>Return</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {rounds.map((row,i) => {
          return <ResultRow
            key={i}
            index={i+1}
            data={row}
            className="table-secondary"
            settings={settings}
          >
            {(i+1) === rounds.length ? <button
              className="btn btn-link btn-sm"
              onClick={() => onUnlock ? onUnlock() : null}
            >
              <i className="fa fa-unlock"></i> Unlock
            </button> : null}
          </ResultRow>
        })}
        {results.map((row,i) => {
          return <ResultRow
            key={i}
            index={rounds.length + (i+1)}
            data={row}
            className={!i ? "table-primary" : ""}
            settings={settings}
          >
            {!i ? <button
              className="btn btn-link btn-sm"
              onClick={() => onLock ? onLock() : null}
            >
              <i className="fa fa-lock"></i> Lock
            </button> : null}
          </ResultRow>
        })}
      </tbody>
    </table>;
  }
}

export class ResultRow extends Component {
  static propTypes = {
    settings: object,
    data: object,
    index: number,
    children: node,
    className: string
  };

  render() {
    const {settings,data,index,locked,className,children,...props} = this.props;
    const classes = [ className ];
    const profit = data.payout - data.losses;

    return <tr {...props} className={classnames(classes)}>
      <td>{index}</td>
      <td>{displayNumber(data.prob*100, "%")}</td>
      <td>{displayNumber(data.adjprob*100, "%")}</td>
      <td>
        {/* <input type="number" value={data.bet} className="form-control form-control-sm" /> */}
        {displayNumber(data.bet, settings.unit)}
        </td>
      <td>{displayNumber(data.losses, settings.unit)}</td>
      <td>{displayNumber(data.payout, settings.unit)}</td>
      <td>{displayNumber(profit, settings.unit)}</td>
      <td>{displayNumber(profit / index, settings.unit)}</td>
      <td>{displayNumber((profit / data.losses)*100, "%")}</td>
      <td style={{width: "100%"}}>{children}</td>
    </tr>;
  }
}