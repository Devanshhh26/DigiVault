import Storage from '../abis/Storage.json'
import React, { Component } from 'react';
import Navbar from './Navbar'
import Main from './Main'
import Web3 from 'web3';
import './App.css';
import {create as IPFSHTTPClient} from 'ipfs-http-client';

const ipfsClient=require('ipfs-http-client')

const projectId='2Fd0PqxApihyfvP6wLGk4ayF8cy'
const projectSecret='53b27a2717c1b7e4fc5f578959cfdab0'
const auth= 'Basic ' + Buffer.from(projectId + ":" + projectSecret).toString('base64')
const ipfs = ipfsClient({host:'ipfs.infura.io',port:5001,protocol:'https',headers:{
  authorization: auth
}})


class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if(window.ethereum){
      window.web3=new Web3(window.ethereum)
      await window.ethereum.enable() 
    }
    else if (window.web3){
      window.web3=new Web3(window.web3.currentProvider)
    }
    else{
      window.alert('Non-Ethereum browser detected. You should consider trying Metamask!')
    }
  }

  async loadBlockchainData() {
    const web3 =window.web3;
    console.log(web3)

    
    const accounts= await web3.eth.getAccounts()
    this.setState({account:accounts[0]})

    const networkId = await web3.eth.net.getId()
    const networkData = Storage.networks[networkId]
    if(networkData) {
      
      const storage = new web3.eth.Contract(Storage.abi, networkData.address);
      this.setState({ storage })
   
      const filesCount = await storage.methods.fileCount().call()
      this.setState({ filesCount })
   
      for (var i = filesCount; i >= 1; i--) {
        const file = await storage.methods.files(i).call()
        this.setState({
          files: [...this.state.files, file]
        })
      }
    } else {
      window.alert('Storage contract not deployed to detected network.')
    }
  }

 
  captureFile = event => {
    event.preventDefault()

    const file = event.target.files[0]
    const reader = new window.FileReader()

    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      this.setState({
        buffer: Buffer(reader.result),
        type: file.type,
        name: file.name
      })
      console.log('buffer', this.state.buffer)
    }
  }


 
  uploadFile = description => {
    console.log("Submitting file to IPFS...")
   
    ipfs.add(this.state.buffer,(error, result)=>{
      console.log('IPFS result', result)
      if(error)
      {
        console.error(error)
        return 
      }
      this.setState({loading:true})

      if(this.state.type===''){
        this.setState({type:'none'})
      }
      this.state.storage.methods.uploadFile(result[0].hash, result[0].size, this.state.type, this.state.name, description).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({
         loading: false,
         type: null,
         name: null
       })
       window.location.reload()
      }).on('error', (e) =>{
        window.alert('Error')
        this.setState({loading: false})
      })
    })
  }

 
  constructor(props) {
    super(props)
    this.state = {
      account:'',
      storage: null,
      files:[],
      loading: false,
      type: null,
      name: null
      
    }


  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        { this.state.loading
          ? <div id="loader" className="text-center mt-5"><p>Loading...</p></div>
          : <Main
              files={this.state.files}
              captureFile={this.captureFile}
              uploadFile={this.uploadFile}
            />
        }
      </div>
    );
  }
}

export default App;