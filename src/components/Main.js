import React, { Component } from 'react';
import Identicon from 'identicon.js';

class Main extends Component {
  render() {
    return (
      <div className="container-fluid mt-5">
        <div className="row">
          <main role="main" className="col-lg-12 mx-auto max-w-lg">
            <div className="content mx-auto">
              <p>&nbsp;</p>
              <h2 className="text-3xl font-bold">Share Image</h2>

              <form onSubmit={(event) => {
                event.preventDefault();
                const description = this.imageDescription.value
                this.props.uploadImage(description)
              }}>
                <input type='file' accept=".jpg, .jpeg, .png, .bmp, .gif" onChange={this.props.captureFile} />
                <div className="">
                  <br />
                  <input 
                    id="imageDescription"
                    type="text" 
                    ref={(input) => { this.imageDescription = input }} 
                    className="h-10 w-full border p-4 mb-4 rounded-md" 
                    placeholder="Image description" 
                    required
                  />
                </div>
                <button type="submit" className='w-full p-4 bg-blue-600 text-white rounded-md'>Upload</button>
              </form>

              <p>&nbsp;</p>

              {
                this.props.images.map((image, key) => {
                  return (
                    <div className="mb-4 bg-white shadow-md rounded-lg p-4" key={key}>
                      <div className="card-header mb-4">
                        <img className="mr-2 inline-block" width="30" height="30" src={`data:image/png;base64,${new Identicon(image.author, 30).toString() }`} alt="account icon" />
                        <small>{ image.author }</small>
                      </div>
                      <ul id="imageList">
                        <li>
                          <p><img src={`https://ipfs.infura.io/ipfs/${image.hash}`} alt="cool pics" /></p>
                          <p className="py-2">{ image.description }</p>
                        </li>
                        <li key={key} className="flex justify-between items-center">
                          <small className="mt-1">
                            TIPS: {window.web3.utils.fromWei(image.tipAmount.toString(), 'Ether')} ETH
                          </small>
                          <button className="bg-gray-100 py-1 px-2 rounded-md" name={image.id} onClick={(event) => {
                            let tipAmount = window.web3.utils.toWei('0.1', 'Ether');
                            console.log(event.target.name, tipAmount);
                            this.props.tipImageOwner(event.target.name, tipAmount);
                          }}>
                          <svg className='w-4 h-4 mr-2 inline-block' viewBox="0 0 256 417" preserveAspectRatio="xMidYMid">
                            <g>
                              <polygon fill="#343434" points="127.9611 0 125.1661 9.5 125.1661 285.168 127.9611 287.958 255.9231 212.32"/>
                              <polygon fill="#8C8C8C" points="127.962 0 0 212.32 127.962 287.959 127.962 154.158"/>
                              <polygon fill="#3C3C3B" points="127.9611 312.1866 126.3861 314.1066 126.3861 412.3056 127.9611 416.9066 255.9991 236.5866"/>
                              <polygon fill="#8C8C8C" points="127.962 416.9052 127.962 312.1852 0 236.5852"/>
                              <polygon fill="#141414" points="127.9611 287.9577 255.9211 212.3207 127.9611 154.1587"/>
                              <polygon fill="#393939" points="0.0009 212.3208 127.9609 287.9578 127.9609 154.1588"/>
                            </g>
                          </svg>
                            TIP 0.1 ETH
                          </button>
                        </li>
                      </ul>
                    </div>
                  )
                })
              }
            </div>
          </main>
        </div>
      </div>
    );
  }
}

export default Main;