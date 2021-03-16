### Overview:

__Goals:__ Creating reviews decentralized application which puts the reviews on the blockchain, making them unchangeable.  <br />
<br />

![front_page](/imgs/front_pg.png) <br />
---
### General info: <br />

<br />
Users can make a profile, find another profiles, and review other profiles. <br />
Each profile contains a description of the profile (type of services that the profile is offering). <br />
Find profiles by searching their public key. Then its possible to read all the reviews that other users left, or review the profile. <br />
<br />
 
Main 2 files in this project are `Reviews.sol` and `App.js`:   <br />
- `Reviews.sol`: The smart contract, written in Solidity, contains all the logic of the app. <br />
- `App.js`: The front end. using react, html, and web3, connects the smart contract with the app. <br />


Actions that require generating a new block in the blockcahin (like editing profile or leaving a review) will require a payment using the MetaMask wallet.

![metamask](/imgs/metamask.PNG) <br />

---
### installs:

Node.js: <br />
https://nodejs.org/en/download/ <br />

Truffle:

```
npm install –g truffle
```

Ganache: <br />
https://www.trufflesuite.com/ganache <br />

MetaMask: <br />
https://metamask.io/download <br />

---

- made by [Dimnir](https://github.com/Dimnir) &  [MishelK](https://github.com/MishelK) <br />

