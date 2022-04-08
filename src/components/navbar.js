import React, { Component } from "react"
import { Link } from "react-router-dom"
import { Button } from 'rimble-ui'

export default class Navbar extends Component {

    render() {
        return (
            <nav
                className="navbar navbar-dark shadow"
                id="navbar"
            >
                {/* Logo and Title  */}
                <div className="col-8 align-middle">
                    <img src="/logoAV.svg" alt="" height="50px" width="50px" id="logo" className="inline-block align-middle" />
                    <span className="inline-block align-middle" id="logo-title">
                        <Link to="/" >
                            Avalanche Votings
                        </Link>
                    </span>
                </div>

                {/* Account address on the right side of the navbar  */}
                <div className="col-4">
                    <div className="d-flex justify-content-end">
                        {this.props.account == null ? (
                            <Button onClick={e => this.props.connect(e)}>
                                Connect Wallet
                            </Button>
                        ) : (
                            <div id="address-nav" className="hidden link-address">
                                <a
                                    href={`https://testnet.snowtrace.io/address/${this.props.account}`}
                                    target="_blank" rel="noopener noreferrer"
                                >
                                    {`${this.props.account.slice(0, 10)}...`}
                                </a>
                            </div>
                        )}
                    </div>
                </div>

            </nav >
        );
    }
}