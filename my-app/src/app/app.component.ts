import { Component, inject } from '@angular/core';
import { BigNumber, Contract, ethers, providers, Signer, Wallet } from 'ethers';
import tokenJson from '../assets/MyToken.json';
import tokenJson2 from "../assets/TokenizedBallot.json"
import { Bytes, BytesLike, formatBytes32String, formatEther, formatUnits, getAddress, hexValue, parseBytes32String } from 'ethers/lib/utils';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Token } from '@angular/compiler';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {


  tokenContractAddress: string | any;
  wallet: ethers.Wallet | undefined 
  provider: ethers.providers.InfuraProvider| any
  etherBalance: number | undefined
  tokenBalance: number | undefined
  votePower: number | undefined
  tokenContract: ethers.Contract | any |string
  ballotContract: ethers.Contract |  any
  
  
  
  
  signer: ethers.providers.JsonRpcSigner | undefined 
  winner: string | undefined
  voteBaBn: string | undefined
  voteBa: string | undefined

  proposals: BigNumber| undefined;
  winnerProposal: string | undefined
  proposals1: BigNumber| undefined;
  proposals2: BigNumber| undefined;
  proposals3: string | undefined;
  voteBalance: number|undefined
  accounts: string | undefined;
  convertToBytes: string | undefined
  // accounts: ethers.Wallet | undefined
  // formattedArray: any | undefined
  proposals5: BigNumber | undefined
  propppp: Promise<any> | undefined;
  proposalNames: [] | undefined;
  proposalName: Promise<string> | undefined
  proposals0: BigNumber| undefined;
  // proposalNames: undefined
  // proposalN1: undefined

 
  

  constructor(private http: HttpClient){}
  
  async createWallet() {
  
    // this.wallet = ethers.Wallet.createRandom().connect(this.provider)
    // this.signer = (this.wallet).connect(this.provider)
    // this.provider = new ethers.providers.InfuraProvider("goerli", { infura: 'INFURA_API_KEY' })
  // this.wallet = new ethers.Wallet((this.PRIVATE_KEY))
 
  this.provider = new ethers.providers.Web3Provider(window.ethereum)
// const accounts = await this.provider.send("eth_requestAccounts", [])
  // console.log(accounts);
  const signer = this.provider.getSigner()
 this.wallet = await  signer.getAddress()

  
  // this.wallet = await window.ethereum.request({ method: "eth_accounts" });
  // this.provider = new ethers.providers.Web3Provider(window.ethereum);
  // this.signer = await this.provider.getSigner();

 console.log( signer, this.provider, this.wallet, "222")
  
 this.http
    .get<any>("http://localhost:3000/token-address")
    .subscribe((ans) => {
     this.tokenContractAddress = ans.result;
    if (this.tokenContractAddress && this.wallet) {
    this.tokenContract = new ethers.Contract(
    this.tokenContractAddress,
    tokenJson.abi,
    signer 
    );
    // this.tokenContract = this.tokenContract.attach(environment.tokenContract).connect(signer)
    const ans = this.tokenContract
  signer.getBalance().then((balanceBn: ethers.BigNumberish) => {
    this.etherBalance = parseFloat(ethers.utils.formatEther(balanceBn))
    
  });

  
  this.tokenContract["balanceOf"](signer.getAddress()).then(
    (tokenBalanceBn: BigNumber) => {
    this.tokenBalance = parseFloat(
      ethers.utils.formatEther(tokenBalanceBn)
      );
  });
  this.tokenContract["getPastVotes"](signer.getAddress(), 7941800).then(
    (votePowerBn: BigNumber) => {
    this.votePower = parseFloat(ethers.utils.formatEther(votePowerBn)
    );
    });
    }
   })
    
    this.ballotContract = new ethers.Contract(
      environment.ballotContract,
      tokenJson2.abi,
      signer
    )

    this.ballotContract = this.ballotContract.attach(environment.ballotContract).connect(signer)
    
    this.ballotContract["winnerName"]().then(
      (winners: string) => {
        this.winner = parseBytes32String(winners)
        })
      this.ballotContract["winningProposal"]().then(
          (winnerProposal: string) => {
            this.winnerProposal = (winnerProposal)
            }) 

            this.ballotContract["proposals"]([0]).then(
              (proposals0: any) => {
                proposals0 = ethers.utils.parseBytes32String(proposals0.name);
                console.log(proposals0)
                this.proposals0 = proposals0
               })
      this.ballotContract["proposals"]([1]).then(
        (proposals1: any) => {
          proposals1 = ethers.utils.parseBytes32String(proposals1.name);
          this.proposals1 = proposals1
         })
      this.ballotContract["proposals"]([2]).then(
        (proposals2: any) => {
          proposals2 = ethers.utils.parseBytes32String(proposals2.name);
          this.proposals2 = proposals2
         })
        this.ballotContract["proposals"]([3]).then(
              (proposals3: any) => {
                proposals3 = ethers.utils.parseBytes32String(proposals3.name);
                this.proposals3 = proposals3
               })

             

              //  function convertToBytes(proposalsArray: string[]) {
              //   let formattedArray = []
              //   for (let i = 0; i < proposalsArray.length; i++) {
              //        formattedArray.push(ethers.utils.formatBytes32String(proposalsArray[i]))
              //        console.log(formattedArray)
              //   }
                
                          
              // }
                   
              this.getProposals() 
                const ballotContract = this.ballotContract
                  .attach(environment.ballotContract)
                  .connect(this.provider);
             
                const viewProposals = (numberOfProposals: number) => {
                  const proposalNames = [];
                  for (let i = 0; i <= 4 - 1; i++) {
                    let proposalName = ballotContract.proposals(i);
                    proposalName = ethers.utils.parseBytes32String(proposalName.name);
                    proposalNames.push(proposalName);
                    
                    // this.proposalNames =


                    console.log(proposalName)
                    // console.log(viewProposals(1))
                    // console.log(proposalNames)
                    
                  }
                  
                    return proposalNames;
                  }
                  
                  // const proposals = viewProposals(3);
                  // return proposals;
                      
                

              }
             



              async getProposals() {
                const ballotContract = this.ballotContract
                  .attach(environment.ballotContract)
                  .connect(this.provider);
                async function viewProposals(numberOfProposals: number) {
                  const proposalNames = [];
                  for (let i = 0; i <= 4 - 1; i++) {
                    let proposalName = await ballotContract.proposals(i);
                    proposalName = ethers.utils.parseBytes32String(proposalName.name);
                    proposalNames.push(proposalName);
                    console.log(proposalName)
                    // console.log(viewProposals)
                    // console.log(proposalNames)
                  }
                  console.log(proposalNames)  
                  return proposalNames;
                    
                  }
                  const proposals = viewProposals(3);
                  return proposals;
                  
                }
          
              
      

  request(mintAmount: string){
                // console.log("Trying to mint to " + this.signer?._address, this.wallet?.address, this.accounts, this.signer?.connect);
                this.http
                .post<any>('http://localhost:3000/request-tokens', {address: this.wallet?.address, amount: mintAmount})
                .subscribe((ans) => {
                  console.log(ans);
                });

  }
  
  async vote(voteId: string) {
  const vote = await this.ballotContract["vote"](3, 1)  
  console.log("trying to vote for " + voteId);
  await vote.wait()
  const voteTx = vote.hash
  console.log("hash of Vote" + voteTx)
  }


  async connectWallet() {
    const MetaMaskprovider = new ethers.providers.Web3Provider(window.ethereum)

await MetaMaskprovider.send("eth_requestAccounts", []);
  
const signer = MetaMaskprovider.getSigner();
  await signer.getAddress().then((address) => {
  // console.log(signer.getBalance(), "11111")
    
    const accounts = address
    console.log(address, accounts, signer);
  
  } )
}
}


// async getProposals() {
//   const props = await this.ballotContract['proposals'];
 
//   this.proposals.forEach((element:string, index:number) => {
//     console.log(`Proposal ${index}: ${element}`)
//   });
//   return this.proposals;
// }











//   async function proposal(proposalsArray: string[]) {

//   const proposal = await this.ballotContract['proposals'][num].name.then(()=>{
//   (proposal: string) => {
//     this.proposal = (proposal)
//    }
//                console.log(proposal(1));
//                return proposal
// })}
// proposal(1)