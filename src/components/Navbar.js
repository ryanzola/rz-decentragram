import React, { Component } from 'react';
import Identicon from 'identicon.js';

import '../assets/main.css'

class Navbar extends Component {

  render() {
    return (
      <nav className="bg-gray-900 text-white flex justify-between p-4 shadow-md">
        <a
          className="text-2xl font-bold flex items-center"
          href="http://www.ryanzola.dev"
          target="_blank"
          rel="noopender noreferrer">
          <svg className="inline-block h-6 w-6 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
          Decentragram
        </a>
        <ul className="px-3">
          <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
            <small className="inline-block">
              <small id="account">
                { this.props.account }
              </small>
            </small>
            { this.props.account 
              ? <img 
                  className="ml-2 inline-block"
                  width="30"
                  height="30" 
                  src={ `data:image/png;base64,${ new Identicon(this.props.account, 30).toString() }`}
                  alt="identicon icon"
                />
              : <span></span>
            }
          </li>
        </ul>
      </nav>
    );
  }
}

export default Navbar;
