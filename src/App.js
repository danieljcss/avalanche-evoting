import React, { Component } from "react"
import { web3Connect } from './web3Connect'
import { Routes, Route, Link, Outlet } from "react-router-dom"
import CreateVoting from "./createVoting"
import ActiveVotings from "./activeVotings"


class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      account: null,
      mainInstance: null,
    }
  }

  componentDidMount() {
    this.init()
  }

  async init() {
    try {
      const connect = await web3Connect()
      this.setState({
        account: connect.account,
        mainInstance: connect.contract
      })
    } catch (error) {
      console.log('Wallet connection failed: ', error)
    }
  }

  render() {
    return (
      <div>
        {/*For routing through the react application*/}
        <Routes>
          {/* Navbar */}

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

// class Navbar extends Component {
//   render() {
//     return (
//       <nav
//         className="navbar navbar-dark shadow"
//         style={{
//           backgroundColor: "#1b2021",
//           height: "60px",
//           color: "white",
//           marginBottom: "50px"
//         }}
//       >
//         {/* Link to Active voting page (nav-header) */}
//         <Link to="/active"><b style={{ cursor: "pointer", color: "white" }}>Avalanche Votings</b></Link>

//         {/* Account address on the right side of the navbar  */}
//         <span style={{ float: "right" }}>{this.state.account}</span>
//       </nav>
//     );
//   }
// }

export default App;