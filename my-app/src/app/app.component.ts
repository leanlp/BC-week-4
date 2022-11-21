import { Component, inject } from '@angular/core';
import { BigNumber, Contract, ethers, providers, Signer, Wallet } from 'ethers';
import { Provider } from '@ethersproject/abstract-provider';
import { Injectable } from '@angular/core';

import tokenJson from '../assets/MyToken.json';
import tokenJson2 from "../assets/TokenizedBallot.json"

import { Bytes, BytesLike, formatBytes32String, formatEther, formatUnits, getAddress, hexValue, parseBytes32String } from 'ethers/lib/utils';
import { HttpClient } from '@angular/common/http';
import { __values } from 'tslib';


// const ERC20VOTES = "0x3A4a8459f38e131fa5071a3E0444E64313F7343E"

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'my-app';
  
  tokenContractAddress: string | undefined;

  wallet: ethers.Wallet | undefined
  provider: ethers.providers.BaseProvider| any
  etherBalance: number | undefined
  tokenBalance: number | undefined
  votePower: number | undefined
  tokenContract: ethers.Contract | undefined
  ballotContract: ethers.Contract |  any
  

 
  
  ballotContractAddress = "0x06157a790bc1b3f4f337859686c32f0123084331"
  ballotContractAddressN="0x1f755883bcfb37434168c6f1af16db083dd73b60"
 
  account: any;
  signer: ethers.Wallet | undefined;

  winner: string | undefined
  voteBaBn: string | undefined
  voteBa: string | undefined
  MMaddress: string| undefined
  proposals:  BigNumber | undefined
  winnerProposal: string | undefined
  proposals1: BigNumber| undefined;
  proposals2: BigNumber| undefined;
  proposals3: string | undefined;
  
 
  

  constructor(private http: HttpClient){}
  
  createWallet() {
  
  
  this.provider = new ethers.providers.InfuraProvider("goerli", { infura: 'INFURA_API_KEY' })
  // this.wallet = new ethers.Wallet((this.PRIVATE_KEY))
  this.wallet = ethers.Wallet.createRandom().connect(this.provider)
  this.signer = (this.wallet).connect(this.provider)
  
 
  this.http
    .get<any>("http://localhost:3000/token-address")
    .subscribe((ans) => {
     this.tokenContractAddress = ans.result;
    if (this.tokenContractAddress && this.wallet) {
    this.tokenContract = new ethers.Contract(
    this.tokenContractAddress,
    tokenJson.abi,
    this.signer 
    );
  
    
  this.signer?.getBalance().then((balanceBn) => {
    this.etherBalance = parseFloat(ethers.utils.formatEther(balanceBn))
  });

  this.tokenContract["balanceOf"](this.signer?.address).then(
    (tokenBalanceBn: BigNumber) => {
    this.tokenBalance = parseFloat(
      ethers.utils.formatEther(tokenBalanceBn)
      );
  });
  this.tokenContract["getPastVotes"](this.signer?.address, 7941876).then(
    (votePowerBn: BigNumber) => {
    this.votePower = parseFloat(ethers.utils.formatEther(votePowerBn)
    );
    });
    }
   })
    
    this.ballotContract = new ethers.Contract(
      this.ballotContractAddress,
      tokenJson2.abi,
      this.signer
    )

    this.ballotContract = this.ballotContract.attach(this.ballotContractAddress).connect(this.signer)
    
    this.ballotContract["winnerName"]().then(
      (winners: string) => {
        this.winner = parseBytes32String(winners)
        })
      this.ballotContract["winningProposal"]().then(
          (winnerProposal: string) => {
            this.winnerProposal = (winnerProposal)
            }) 

        this.ballotContract["proposals"]([0]).then(
       (proposals: BigNumber) => {
         this.proposals = (proposals)
        })
        this.ballotContract["proposals"]([1]).then(
          (proposals1: BigNumber) => {
            this.proposals1 = (proposals1)
           })
        this.ballotContract["proposals"]([2]).then(
            (proposals2: BigNumber) => {
              this.proposals2 = (proposals2)
             })
        this.ballotContract["proposals"]([3]).then(
              (proposals3: string) => {
                this.proposals3 = (proposals3)
               })
               
// async function proposal(this: any, num: number) {

//   const proposal = await this.ballotContract['proposals'][num].name.then(()=>{
//   (proposal: string) => {
//     this.proposal = (proposal)
//    }
//                console.log(proposal(1));
//                return proposal
// })}
// proposal(1)

// async function convertToBytes(proposalsArray: string[]) {
//   let formattedArray = []
//   for (let i = 0; i < proposalsArray.length; i++) {
//        formattedArray.push(ethers.utils.formatBytes32String(proposalsArray[i]))
//   }
//   return formattedArray
// }

  }

  request(){
    console.log("Trying to mint to " + this.wallet?.address);
    this.http
    .post<any>('http://localhost:3000/request-tokens', {address: this.wallet?.address})
    .subscribe((ans) => {
      console.log(ans);
    });

  }
  
  async vote(voteId: string) {
  const vote = await this.ballotContract["vote"](3, 0.1)  
  console.log("trying to vote for " + voteId);
  await vote.wait()
  const voteTx = vote.hash
  console.log("hash of Vote" + voteTx)
  }

  async connectWallet() {
    // A Web3Provider wraps a standard Web3 provider, which is
// what MetaMask injects as window.ethereum into each page
const MetaMaskprovider = new ethers.providers.Web3Provider(window.ethereum)
// MetaMask requires requesting permission to connect users accounts
await MetaMaskprovider.send("eth_requestAccounts", []);
// The MetaMask plugin also allows signing transactions to
// send ether and pay to change state within the blockchain.
// For this, you need the account signer...
  const signer = MetaMaskprovider.getSigner();
  this.MMaddress = await signer._address
  console.log(this.signer?.address);
  }  


}



