import React, { Component } from "react"
import { web3Connect } from './web3Connect'
import { Routes, Route, Link, Outlet } from "react-router-dom"
import CreateVoting from "./createVoting"
import ActiveVotings from "./activeVotings"


class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      account: "",
      mainInstance: null,
    }
  }

  componentDidMount() {
    this.init()
  }

  async init() {
    try {
      const connect = await web3Connect()
      const account = await connect.account.getAddress()
      this.setState({
        account: account,
        mainInstance: connect.contract
      })
    } catch (error) {
      console.log('Wallet connection failed: ', error)
    }
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        {/*For routing through the react application*/}
        <Routes>
          {/* Default route to ActiveVotings component 
          <Route path="/" exact>
            <Route path="/active" element={<ActiveVotings account={this.state.account} />
          </Route>*/}

          {/* Route to CreateVoting page */}
          <Route
            path="/createVoting"
            element={<CreateVoting account={this.state.account} />}
          />

          {/* Route to Active voting page */}
          <Route
            path="/active"
            element={<ActiveVotings account={this.state.account} />}
          />
        </Routes>
      </div>
    );
  }
}

class Navbar extends Component {
  render() {
    return (
      <nav
        className="navbar navbar-dark shadow"
        id="navbar"
      >
        {/* Logo and Title  */}
        <div className="col-8 align-middle">
          <img src="/logo.svg" alt="" height="50px" width="50px" id="logo" className="inline-block align-middle" />
          <span className="inline-block align-middle" id="logo-title">
            <Link to="/active" >
              Avalanche Votings
            </Link>
          </span>
        </div>

        {/* Account address on the right side of the navbar  */}
        <div className="col-4">
          <div id="address" className="d-flex justify-content-end">
            <a
              href={`https://testnet.snowtrace.io/address/${this.props.account}`}
              target="_blank" rel="noopener noreferrer"
            >
              {`${this.props.account.slice(0, 10)}...`}
            </a>
          </div>
        </div>

      </nav >
    );
  }
}

export default App;