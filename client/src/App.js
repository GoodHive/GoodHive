import React, { Component } from "react";
import { Button, Card, Form, Container, Row, Col } from 'react-bootstrap';
import EscrowContract from "./contracts/Escrow.json";
import GoodHoneyTokenContract from "./contracts/GoodHoneyToken.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { storageValue: '', web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = EscrowContract.networks[networkId];
      const instance = new web3.eth.Contract(
        EscrowContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
	  
	  
	  
	  console.log(deployedNetwork.address);

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, contract } = this.state;

    // Get the value from the contract to prove it worked.
    const response = 'test'; //await contract.methods.tokenGHN().call();
	console.log(1);
	let price = await contract.methods.getUsdPrice(1).call({from: accounts[0]});
	console.log(price);
	
	this.addressDeposit.value = "0x8514F67A9445584A11e9dfed90a2323aD7A78662";
	let moneyDeposit = await contract.methods.payments(this.addressDeposit.value).call({from: accounts[0]});

	this.MoneyDeposit.value = moneyDeposit / 1000000000000000000;

	// Update state with the result.
    this.setState({ storageValue: response });
  };
  
  sendMoneyToEscrow = async() => {
	const { accounts, contract } = this.state; 
	await contract.methods.SendMoneyTo(this.addressToDepose.value,this.ethMoney.value).send({from: accounts[0]});	
  }
  
  SendMoneyToAdress = async() => {
	  const { accounts, contract } = this.state; 
	  await contract.methods.withdrawPaymentsUSDC(this.addressDeposit.value).send({from: accounts[0]});	
	  
  }

  render() {
    return (
		<div>	
			<Container>
				<Form.Group as={Row} >
						<Form.Label column sm="3"></Form.Label>
					</Form.Group>
				<Form>
					<Form.Group as={Row} >	
						<Form.Label column sm="3"></Form.Label>						
						<Col sm="2"> Money : 
						  <Form.Control type="text" id="ethMoney" 
					      ref={(input) => { this.ethMoney = input }}
						  />
						</Col>
						<Col sm="2"> Address : 
						  <Form.Control type="text" id="addressToDepose" 
					      ref={(input) => { this.addressToDepose = input }}
						  />
						</Col>
					</Form.Group>
					<Form.Group as={Row} >	
						<Form.Label column sm="3"></Form.Label>						
						<Col sm="2">
						  <Button onClick={ this.sendMoneyToEscrow }>Depose money on Escrow</Button> 
						</Col>
						<Col sm="2"> Address with money : 
						  <Form.Control type="text" id="addressDeposit" 
					      ref={(input) => { this.addressDeposit = input }}
						  />
						</Col>
						<Col sm="2"> Money on this address: 
						  <Form.Control type="text" id="MoneyDeposit" 
					      ref={(input) => { this.MoneyDeposit = input }}
						  /> $
						</Col>
						<Col sm="2">
						  <Button onClick={ this.SendMoneyToAdress }>Send Money to Adress</Button> 
						</Col>
					</Form.Group>
					<Form.Group as={Row} >	
						<img src={this.state.imageUrl}/>
						<div id="diplomasImage"></div>
					</Form.Group>
					
					
				</Form>
			</Container>
		</div>
		
			
		);
  }
}

export default App;
