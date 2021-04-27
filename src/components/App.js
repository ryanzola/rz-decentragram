import React, { Component } from 'react';
import Web3 from 'web3';
import Decentragram from '../abis/Decentragram.json';
import '../assets/main.css'
import Main from './Main';
import Navbar from './Navbar';

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })

class App extends Component {

  async componentDidMount() {
    await this.loadWeb3();
    await this.loadBlockChainData();
  }

  async loadWeb3() {
    if(window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable();
    } else if(window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    } else {
      window.alert('Non-ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockChainData() {
    const accounts = await window.web3.eth.getAccounts();
    this.setState({ account: accounts[0] })

    // newtowk id
    const networkId = await window.web3.eth.net.getId();
    const networkData = Decentragram.networks[networkId];

    if(!networkData) {
      window.alert('Decentragram contract not deployed to detected network.')
      return;
    } 

    const decentragram = new window.web3.eth.Contract(Decentragram.abi, networkData.address);
    this.setState({ decentragram })

    const imagesCount = await decentragram.methods.imageCount().call()
    this.setState({ imagesCount })


    for(let i = 0; i < imagesCount; i++) {
      const image = await decentragram.methods.images(i).call()
      this.setState({
        images: [...this.state.images, image]
      })
    }

    // Sort images. Show highest tipped images first
    this.setState({
      images: this.state.images.sort((a, b) => b.tipAmount - a.tipAmount)
    })

    this.setState({ loading: false })
  }

  captureFile = event => {
    event.preventDefault()
    const file = event.target.files[0];
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file);

    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) })
      console.log('buffer', this.state.buffer)
    }
  }

  uploadImage = async description => {
    console.log('submitting file to ipfs...')

    this.setState({ loading: true })
    const file = await ipfs.add(this.state.buffer)

    if(!file) {
      console.log('oh...');
      return;
    }

    console.log('ipfs result', file.path)

    this.state.decentragram.methods.uploadImage(file.path, description).send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.setState({ loading: false })
    })
  }

  tipImageOwner = (id, tipAmount) => {
    this.setState({ loading: true});
    this.state.decentragram.methods.tipImageOwner(id).send({ from: this.state.account, value: tipAmount }).on('transactionHash', (hash) => {
      this.setState({ loading: false});
    })
  }
  
  constructor(props) {
    super(props);
    this.state = {
      account: '',
      decentragram: null,
      images: [],
      imagesCount: 0,
      loading: true
    }
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        { this.state.loading
          ? <div id="loader" className="text-center mt-5"><p>Loading...</p></div>
          : <Main 
            images={this.state.images}
            captureFile={this.captureFile}
            uploadImage={this.uploadImage}
            tipImageOwner={this.tipImageOwner}
            />

        }
      </div>
    )
  };
}

export default App;
