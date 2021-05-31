import React, { Component } from "react";
import { Container, Nav } from "./styled-components";

// fusioncharts
import FusionCharts, { items } from "fusioncharts";
import Charts from "fusioncharts/fusioncharts.charts";
import Maps from "fusioncharts/fusioncharts.maps";
import USARegion from "fusionmaps/maps/es/fusioncharts.usaregion";
import ReactFC from "react-fusioncharts";
import "./charts-theme";

import config from "./config";
//import Dropdown from "react-dropdown";
import formatNum from "./format-number";

import UserImg from "../assets/images/user-img-placeholder.jpeg";

ReactFC.fcRoot(FusionCharts, Charts, Maps, USARegion);

const url = `https://sheets.googleapis.com/v4/spreadsheets/${ config.spreadsheetId }/values:batchGet?ranges=Sheet1&majorDimension=ROWS&key=${ config.apiKey }`;


class App extends Component {
  constructor() {
    super();
    this.state = {
      items: [],
      /*dropdownOptions: [],
      selectedValue: null,*/
      totalIncome: 0,
      totalExpense: 0,
      balance: 0,
      totalBalance: 0,
      transactions: []
    };
  }

  getData() {
    // google sheets data
    const arr = this.state.items;
    const arrLen = arr.length;

    // kpi's
    // All income
    let totalIncome = 0;
    // All expense
    let totalExpense = 0;
    // etsy revenue
    let balance = 0;
    // total balance
    let totalBalance = 0;
    let transactions = []
    

    for (let i = 0; i < arrLen; i++) {
     /* if (arg === arr[i].ID) { */
        if (arr[i]["Type"] === "CR") {
          totalIncome+= parseInt(arr[i].Amount);
          console.log("inside get")
          transactions.push({
            label: "Income",
            value: arr[i].Amount,
            displayValue: `${arr[i].Amount} balance`
          });
        } else if (arr[i]["Type"] === "DR") {
          totalExpense += parseInt(arr[i].Amount);
          transactions.push({
            label: "Expense",
            value: arr[i].Amount,
            displayValue: `${arr[i].Amount} balance`
          });
        /*} else if (arr[i]["source"] === "ET") {
          balance += parseInt(arr[i].revenue);
          ordersTrendStore.push({
            label: "Etsy",
            value: arr[i].orders,
            displayValue: `${arr[i].orders} orders`
          });*/
        
      }
    }

    totalBalance = totalIncome - totalExpense ;
    balance = parseInt(arr[arrLen-1].Amount)


    // setting state
    this.setState({
      totalIncome: formatNum(totalIncome),
      totalExpense: formatNum(totalExpense),
      balance: formatNum(balance),
      totalBalance: formatNum(totalBalance),
      transactions: transactions
    });
  };

 updateDashboard = event => {
    this.getData(event.value);
    this.setState({ selectedValue: event.value });
    console.log(event.value);
  };

  componentDidMount() {
    fetch(url).then(response => response.json()).then(data => {
      let batchRowValues = data.valueRanges[0].values;

      const rows = [];
      for (let i = 1; i < batchRowValues.length; i++) {
        let rowObject = {};
        for (let j = 0; j < batchRowValues[i].length; j++) {
          rowObject[batchRowValues[0][j]] = batchRowValues[i][j];
        }
        rows.push(rowObject);
      }

        this.setState({ items: rows });
        console.log(this.state.items);
       this.getData();
    });
  }

  render() {
    return (
      console.log(this.state),
      <Container   onload={this.updateDashboard}>
        {/* static navbar - top */}
        <Nav className="navbar navbar-expand-lg fixed-top is-white is-dark-text">
          <Container className="navbar-brand h1 mb-0 text-large font-medium">
            MoneyU Payments
          </Container>
          <Container className="navbar-nav ml-auto">
            <Container className="user-detail-section">
              <span className="pr-2">Hello, User</span>
              <span className="img-container">
                <img src={UserImg} className="rounded-circle" alt="user" />
              </span>
            </Container>
          </Container>
        </Nav>

        {/* static navbar - bottom */}
        <Nav className="navbar fixed-top nav-secondary is-dark is-light-text">
          <Container className="text-medium">Dashboard</Container>
          <Container className="navbar-nav ml-auto">
            {/*<Dropdown
              className="pr-2 custom-dropdown"
              options={this.state.dropdownOptions}
              onChange={this.updateDashboard}
              value={this.state.selectedValue}
              placeholder="Select an option"
            />*/}
          </Container>
        </Nav>

        {/* content area start */}
        <Container className="container-fluid pr-5 pl-5 pt-5 pb-5">
          {/* row 1 - revenue */}
          <Container className="row">
            <Container className="col-lg-3 col-sm-6 is-light-text mb-4">
              <Container className="card grid-card is-card-dark">
                <Container className="card-heading">
                  <Container className="is-dark-text-light letter-spacing text-small">
                    Total Balance
                  </Container>
                </Container>

                <Container className="card-value pt-4 text-x-large">
                  <span className="text-large pr-1">₹</span>
                  {this.state.totalBalance}
                </Container>
              </Container>
            </Container>

            <Container className="col-lg-3 col-sm-6 is-light-text mb-4">
              <Container className="card grid-card is-card-dark">
                <Container className="card-heading">
                  <Container className="is-dark-text-light letter-spacing text-small">
                    Last Transaction
                  </Container>
                 {/* <Container className="card-heading-brand">
                    <i className="fab fa-amazon text-large" />
    </Container>*/}
                </Container>

                <Container className="card-value pt-4 text-x-large">
                  <span className="text-large pr-1">₹</span>
                  {this.state.balance}
                </Container>
              </Container>
            </Container>

            <Container className="col-lg-3 col-sm-6 is-light-text mb-4">
              <Container className="card grid-card is-card-dark">
                <Container className="card-heading">
                  <Container className="is-dark-text-light letter-spacing text-small">
                    Total Income
                  </Container>
                 {/*} <Container className="card-heading-brand">
                    <i className="fab fa-ebay text-x-large logo-adjust" />
  </Container>*/}
                </Container>

                <Container className="card-value pt-4 text-x-large">
                  <span className="text-large pr-1">₹</span>
                  {this.state.totalIncome}
                </Container>
              </Container>
            </Container>

            <Container className="col-lg-3 col-sm-6 is-light-text mb-4">
              <Container className="card grid-card is-card-dark">
                <Container className="card-heading">
                  <Container className="is-dark-text-light letter-spacing text-small">
                    Total Expenditure
                  </Container>
                  {/*<Container className="card-heading-brand">
                    <i className="fab fa-etsy text-medium" />
</Container>*/}
                </Container>

                <Container className="card-value pt-4 text-x-large">
                  <span className="text-large pr-1">₹</span>
                  {this.state.totalExpense}
                </Container>
              </Container>
            </Container>
          </Container>

          {/* row 2 - Income Vs Expense */}
          <Container className="row" style={{ minHeight: "400px" }}>
            <Container className="col-md-6 mb-4">
              <Container className="card is-card-dark chart-card">
                <Container className="chart-container large full-height">
                  <ReactFC
                    {...{
                      type: "column2d",
                      width: "100%",
                      height: "100%",
                      dataFormat: "json",
                      containerBackgroundOpacity: "0",
                      dataEmptyMessage: "Loading Data...",
                      dataSource: {
                        chart: {
                          theme: "ecommerce",
                          caption: "Income Trend",
                          subCaption: "By Stores"
                        },
                        data: this.state.transactions
                      }
                    }}
                  />
                </Container>
              </Container>
            </Container>

            <Container className="col-md-6 mb-4">
              <Container className="card is-card-dark chart-card">
                <Container className="chart-container large full-height">
                  <ReactFC
                    {...{
                      type: "column2d",
                      width: "100%",
                      height: "100%",
                      dataFormat: "json",
                      containerBackgroundOpacity: "0",
                      dataEmptyMessage: "Loading Data...",
                      dataSource: {
                        chart: {
                          theme: "ecommerce",
                          caption: "Income Trend",
                          subCaption: "Per Week"
                        },
                        colorrange: {
                          code: "#F64F4B",
                          minvalue: "0",
                          gradient: "1",
                          color: [
                            {
                              minValue: "10",
                              maxvalue: "25",
                              code: "#EDF8B1"
                            },
                            {
                              minvalue: "25",
                              maxvalue: "50",
                              code: "#18D380"
                            }
                          ]
                        },
                        data: this.state.transactions
                      }
                    }}
                  />
                </Container>
              </Container>
            </Container>
          </Container>
        

          {/* row 3 - orders trend */}
          <Container className="row" style={{ minHeight: "400px" }}>
            <Container className="col-md-6 mb-4">
              <Container className="card is-card-dark chart-card">
                <Container className="chart-container large full-height">
                  <ReactFC
                    {...{
                      type: "bar2d",
                      width: "100%",
                      height: "100%",
                      dataFormat: "json",
                      containerBackgroundOpacity: "0",
                     /* dataEmptyMessage: "Loading Data...",*/
                      dataSource: {
                        chart: {
                          theme: "ecommerce",
                          caption: "Expenditure Trend",
                          subCaption: "By Week"
                        },
                        data: this.state.transactions
                      }
                    }}
                  />
                </Container>
              </Container>
            </Container>

            <Container className="col-md-6 mb-4">
              <Container className="card is-card-dark chart-card">
                <Container className="chart-container large full-height">
                  <ReactFC
                    {...{
                      type: "line",
                      width: "100%",
                      height: "100%",
                      dataFormat: "json",
                      containerBackgroundOpacity: "0",
                      dataEmptyMessage: "Loading Data...",
                      dataSource: {
                        chart: {
                          theme: "ecommerce",
                          caption: "Orders Trend",
                          subCaption: "By Region"
                        },
                        colorrange: {
                          code: "#F64F4B",
                          minvalue: "0",
                          gradient: "1",
                          color: [
                            {
                              minValue: "10",
                              maxvalue: "25",
                              code: "#EDF8B1"
                            },
                            {
                              minvalue: "25",
                              maxvalue: "50",
                              code: "#18D380"
                            }
                          ]
                        },
                        data: this.state.transactions
                      }
                    }}
                  />
                </Container>
              </Container>
            </Container>
          </Container>
        </Container>
        {/* content area end */}
      </Container>
    );
  }
};

export default App;
