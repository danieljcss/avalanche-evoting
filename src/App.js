import React, { Component } from "react"
import { web3Connect, web3Load } from './utils/web3Connect'
import { Routes, Route } from "react-router-dom"
import Navbar from "./components/navbar"
import ActiveVotings from "./pages/activeVotings"


class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      account: null,
      provider: null,
      mainInstance: null,
      isConnecting: true,
    }
  }

  async componentDidMount() {
    const connect = await web3Connect()
    this.setState({
      provider: connect.provider,
      mainInstance: connect.contract,
      isConnecting: false,
    })
    if (typeof connect.account != "undefined") {
      this.setState(
        { account: connect.account }
      )
    }
  }

  async connect(e) {
    e.preventDefault()
    try {
      const connect = await web3Load()
      this.setState({
        account: connect.account,
        provider: connect.provider,
        mainInstance: connect.contract
      })
    } catch (error) {
      console.log('Wallet connection failed: ', error)
    }
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} connect={this.connect.bind(this)} />
        {/*For routing through the react application*/}
        <Routes>
          {/* Route to Active voting page */}
          <Route
            path="/"
            element={<ActiveVotings
              account={this.state.account}
              provider={this.state.provider}
              mainInstance={this.state.mainInstance}
              isConnecting={this.state.isConnecting}
            />}
          />
        </Routes>
      </div>
    );
  }
}



export default App;