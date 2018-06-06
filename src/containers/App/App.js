import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Cell, Column, ColumnGroup, Table } from 'fixed-data-table';
import '../../../node_modules/fixed-data-table/dist/fixed-data-table.css';
import _ from 'lodash';
import markArrayTrend from '../../helpers/markArrayTrend';

@connect(
    state => ({rows: state.rows, cols: state.cols || new Array(10)})
)
export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      rows: [],
      cols: new Array(10)
    };
    this.onSnapshotReceived = this.onSnapshotReceived.bind(this);
    this.onUpdateReceived = this.onUpdateReceived.bind(this);
    this._cell = this._cell.bind(this);
    this._headerCell = this._headerCell.bind(this);
    this._generateCols = this._generateCols.bind(this);
  }

  componentDidMount() {
    if (socket) {
      socket.on('snapshot', this.onSnapshotReceived);
      socket.on('updates', this.onUpdateReceived);
    }
  }

  componentWillUnmount() {
    if (socket) {
      socket.removeListener('snapshot', this.onSnapshotReceived);
      socket.removeListener('updates', this.onUpdateReceived);
    }
  }

  onSnapshotReceived(data) {
    const rows = [];
    data.forEach(row => {
      rows[row.id] = row;
    });
    // const rows = this.state.rows.concat(data);
    console.log('snapshot' + rows);
    const cols = Object.keys(rows[0]);
    // bring in a new state once receive the snapshot
    // this stateTime will record the last view data updated time
    const stateTime = Date.now();
    // because need to keep the original data and update data, just bring in another state transferredRows used for display
    this.setState({ rows, cols, stateTime, transferredRows: markArrayTrend(data, []) });
  }

  onUpdateReceived(data) {
    // const rows = this.state.rows.concat(data);

    const { rows, stateTime } = this.state;
    const currentTime = Date.now();
    // since the function is firing from websocket event
    // only update the data once the current time meet the requirements
    // based on the requirements, set the threshold to be 500ms
    if (currentTime - stateTime >= 500) {
      const originalRows = [].concat(rows);
      data.forEach(newRow => {
        originalRows[newRow.id] = newRow;
      });
      const updatedRow = markArrayTrend(rows, data);
      console.log(`update component after ${currentTime - stateTime} milliseconds`); // record the update interval
      // because need to keep the original data and update data, just bring in another state transferredRows used for display
      this.setState({ rows: originalRows, stateTime: currentTime, transferredRows: updatedRow });
    }
  }

  _cell(cellProps) {
    const rowIndex = cellProps.rowIndex;
    const rowData = this.state.transferredRows[rowIndex];
    const col = this.state.cols[cellProps.columnKey];
    const targetData = rowData[col];
    const content = targetData.value;
    // assign class name based on the value comparison
    const valueDifference = targetData.value - targetData.preValue;
    let trendClass = '';
    if (valueDifference > 0) {
      trendClass = 'increasing';
    } else if (valueDifference < 0) {
      trendClass = 'decreasing';
    }
    return (
      <Cell className={trendClass}>{content}</Cell>
    );
  }

  _headerCell(cellProps) {
    const col = this.state.cols[cellProps.columnKey];
    return (
      <Cell>{col}</Cell>
    );
  }

  _generateCols() {
    console.log('generating...');
    const cols = [];
    this.state.cols.forEach((row, index) => {
      cols.push(
        <Column
          width={100}
          flexGrow={1}
          cell={this._cell}
          header={this._headerCell}
          columnKey={index}
          />
      );
    });
    console.log(cols);
    return cols;
  }

  render() {
    const columns = this._generateCols();
    return (
      <Table
        rowHeight={30}
        width={window.innerWidth}
        maxHeight={window.innerHeight}
        headerHeight={35}
        rowsCount={this.state.rows.length}
        >
        {columns}
      </Table>
    );
  }
}
