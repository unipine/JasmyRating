import { Tabs, Tab } from 'react-bootstrap'
import React, { Component } from 'react';
import Reviews from '../abis/Reviews.json'
import Web3 from 'web3';
import './App.css';
import { ThemeConsumer } from 'react-bootstrap/esm/ThemeProvider';


class App extends Component {

  async componentWillMount() {
    await this.loadBlockchainData(this.props.dispatch)
  }

  async loadBlockchainData(dispatch) {
    // Checking if metamask exists and loading account info

    let ethereum = window.ethereum;
    let web3 = window.web3;
    if (typeof ethereum !== 'undefined') {
      await ethereum.enable();
      web3 = new Web3(ethereum);
    }

    if(typeof window.ethereum !== "undefined"){
      let ethereum = window.ethereum;
      await ethereum.enable();
      const web3 = new Web3(ethereum)
      const networkId = await web3.eth.net.getId()
      const accounts = await web3.eth.getAccounts() // returns all accounts user is connected with
    

      if(typeof accounts[0] !== 'undefined'){
        this.setState({ account: accounts[0], web3: web3})
        console.log(accounts)
      } else {
        console.log(accounts)
        window.alert('Please login using MetaMask')
      }

      // Loading contract
      try {
        const reviews = new web3.eth.Contract(Reviews.abi, Reviews.networks[networkId].address)
        this.setState({reviews: reviews})
      }
      catch (error){
        console.log('Error', error)
        window.alert('Error while attempting to deploy contract to current network')
      }

    } 
    else {
      window.alert('You must install MetaMask')
    }
    
  }

  async searchProfile(address) {
    console.log('searchProfile with value: ' + address)
    const profileInfo = await this.state.reviews.methods.getProfile(address).call()

    if(!profileInfo[0] == ""){ // Case profile returned
      console.log(profileInfo)
      document.getElementById('search_profile_desc').innerHTML = "Description: " + profileInfo[0]
      document.getElementById('search_profile_rating').innerHTML = "Average Rating: " + profileInfo[1]
      
      document.getElementById('rate_user').style.display = 'block'
      document.getElementById('rating').style.display = 'block'
      document.getElementById('review').style.display = 'block'
      document.getElementById('btn_rate').style.display = 'block'
      this.setState({searchAddress: address})
      
      const profileReviews = await this.state.reviews.methods.getReviewStrings(address).call() // Fetching array of reviews
      console.log(profileReviews)
      if(profileReviews.length > 0){ // Case reviews exist

        await this.setState({profileReviewArray: profileReviews})
        document.getElementById('profile_reviews').style.display = 'block'

        document.getElementById('review_tv').innerHTML = '"'+this.state.profileReviewArray[0]+'"' // Showing first review
        this.setState({profileReviewArrayIndex: 0})
      }
      else { // Case no prior reviews
        document.getElementById('search_profile_rating').innerHTML = "There are no reviews on this user."
      }

    }
    else{ // Case null profile
      console.log('Null address')
      document.getElementById('search_profile_desc').innerHTML = "Error: Profile not found"
    }
  }

  async myProfile() {
    console.log('loading my profile with address: ' + this.state.account)
    const profileInfo = await this.state.reviews.methods.getProfile(this.state.account).call()

    if(!profileInfo[0] == ""){ // Case profile returned
      console.log(profileInfo)
      document.getElementById('my_profile_desc').innerHTML = "Description: " + profileInfo[0]
      document.getElementById('my_profile_rating').innerHTML = "Average Rating: " + profileInfo[1]
      document.getElementById('your_profile').innerHTML = "Your profile"
      document.getElementById('newDesc').style.display = 'block'
      document.getElementById('btn_desc').style.display = 'block'
      document.getElementById('update_desc').style.display = 'block'
    }
    else{ // Case null profile we create a profile for the user
      console.log('Profile not found attempting to create profile: ' + this.state.account)
      await this.state.reviews.methods.addProfile(this.state.account).send({from: this.state.account})
      const profileInfo2 = await this.state.reviews.methods.getProfile(this.state.account).call()
      
      document.getElementById('my_profile_desc').innerHTML = "Description: " + profileInfo2[0]
      document.getElementById('my_profile_rating').innerHTML = "Average Rating: " + profileInfo2[1]
      document.getElementById('newDesc').style.display = 'block'
      document.getElementById('your_profile').innerHTML = "Your profile"
      document.getElementById('btn_desc').style.display = 'block'
      document.getElementById('update_desc').style.display = 'block'

    }

    const profileReviews = await this.state.reviews.methods.getReviewStrings(this.state.account).call() // Fetching array of reviews
    console.log(profileReviews)
      if(profileReviews.length > 0){ // Case reviews exist

        this.setState({profileReviewArray: profileReviews})
        document.getElementById('my_profile_reviews').style.display = 'block'

        document.getElementById('my_review_tv').innerHTML = '"'+this.state.profileReviewArray[0]+'"' // Showing first review
        this.setState({profileReviewArrayIndex: 0})
      }
      else { // Case no prior reviews
        document.getElementById('my_profile_rating').innerHTML = "There are no reviews on this user."
      }
  }

  async rateProfile(rating, review) {
    console.log('rateProfile called, received rating: ' + rating + ' and review: ' + review)
    
    await this.state.reviews.methods.addReview(this.state.searchAddress, rating, review).send({from: this.state.account})
    this.searchProfile(this.state.searchAddress)
  }

  async updateDescription(description) {
    console.log('Updating description to: ' + description)
    await this.state.reviews.methods.editProfile(this.state.account, description).send({from: this.state.account})
    document.getElementById('my_profile_desc').innerHTML = "Description: " + description
  }

  async nextReview() {
    console.log('next review' + this.state)
    var index = this.state.profileReviewArrayIndex
    index++

    if(index == this.state.profileReviewArray.length){ // Case end of array we circle back
      index = 0;
    }
    
    document.getElementById('review_tv').innerHTML = '"'+this.state.profileReviewArray[index]+'"'
    this.setState({profileReviewArrayIndex: index})
  }

  async myNextReview() {
    console.log('next review' + this.state)
    var index = this.state.profileReviewArrayIndex
    index++

    if(index == this.state.profileReviewArray.length){ // Case end of array we circle back
      index = 0;
    }
    
    document.getElementById('my_review_tv').innerHTML = '"'+this.state.profileReviewArray[index]+'"'
    this.setState({profileReviewArrayIndex: index})
  }

  constructor(props) {
    super(props)
    this.state = {
      web3: 'undefined',
      account: '',
      reviews: null,
      searchAddress: null,
      profileReviewArray : null,
      profileReviewArrayIndex : 1
    }
  }

  render() {
    return (
      <div className='text-monospace'>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href=""
            target="_blank"
            rel="noopener noreferrer"
          >
          <b>Rating Chain by Mishel and Dima</b>
        </a>
        </nav>
        <div className="container-fluid mt-5 text-center">
        <br></br>
          <h1>Welcome to RateChain</h1>
          <h2>You can search for users using their public key or view your own profile rating</h2>
          <h8>Connected from address: {this.state.account}</h8>
          <br></br>
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
              <Tabs 
              defaultActiveKey="profile" 
              id="uncontrolled-tab-example"
              onSelect={(k) => {
                if(k == 'myProfile'){
                  document.getElementById('my_profile_desc').innerHTML = ""
                  document.getElementById('my_profile_rating').innerHTML = ""
                  document.getElementById('newDesc').style.display = 'none'
                  document.getElementById('btn_desc').style.display = 'none'
                  document.getElementById('update_desc').style.display = 'none'
                  document.getElementById('my_profile_reviews').style.display = 'none'
                  this.myProfile()
                }
                if(k == 'Search'){
                  document.getElementById('rate_user').style.display = 'none'
                  document.getElementById('rating').style.display = 'none'
                  document.getElementById('review').style.display = 'none'
                  document.getElementById('btn_rate').style.display = 'none'
                  document.getElementById('profile_reviews').style.display = 'none'
                  document.getElementById('search_profile_desc').innerHTML = ""
                  document.getElementById('search_profile_rating').innerHTML = ""
                  
                }
              }}>

                <Tab eventKey="myProfile" title="My Profile">
                  <div>
                    <p>&nbsp;</p> 
                    <p id="your_profile">You have no profile, accept the contract to create one.</p>
                    <p>&nbsp;</p> 
                    <p id="my_profile_desc"></p>
                    <p id="my_profile_rating"></p>

                    <form onSubmit={(e) => {
                      e.preventDefault()
                      console.log("call next")
                      this.myNextReview()
                    }}>
                    <div id='my_profile_reviews'>
                      <p>&nbsp;</p> 
                      <p id="review_title"> My profile reviews: </p>
                      <p id="my_review_tv"> </p>
                      <button id='btn_review_next' type='submit' className='btn btn-primary' >Next</button>
                      <p>&nbsp;</p> 
                    </div>
                    </form>

                    <p>&nbsp;</p>
                    <p id='update_desc'>Update your profile's description below</p>
                    <form onSubmit={(e) => {
                      e.preventDefault()
                      this.updateDescription(this.newDesc.value)
                    }}>
                      <div className='form-group mr-sm-2'>
                        <input 
                        id='newDesc'
                        type='text'
                        placeholder='New Description...'
                        required
                        ref={(input) => { this.newDesc = input }}
                        />
                        <button id='btn_desc' type='submit' className='btn btn-primary'>Update</button>
                      </div>
                    </form>
                  </div>
                </Tab>

                <Tab eventKey="Search" title="Search">
                <div>
                    <br></br>Search for profiles
                    <form onSubmit={(e) => {
                      e.preventDefault()
                      document.getElementById('search_profile_desc').innerHTML = ""
                      document.getElementById('search_profile_rating').innerHTML = ""
                      let searchAddress = this.searchKey.value
                      this.searchProfile(searchAddress)
                    }}>
                      <div className='form-group mr-sm-2'>
                        <br></br>
                        <input 
                        id='searchKey'
                        type='text'
                        placeholder='Public Address...'
                        required
                        ref={(input) => { this.searchKey = input }}
                        />
                        <button type='submit' className='btn btn-primary'>Search</button>
                      </div>
                    </form>
                    <p id="search_profile_desc"></p>
                    <p id="search_profile_rating"></p>

                    <form onSubmit={(e) => {
                      e.preventDefault()
                      console.log("call next")
                      this.nextReview()
                    }}>
                    <div id='profile_reviews'>
                      <p>&nbsp;</p> 
                      <p id="review_title"> This user's reviews: </p>
                      <p id="review_tv"> </p>
                      <button id='btn_review_next' type='submit' className='btn btn-primary' >Next</button>
                      <p>&nbsp;</p> 
                    </div>
                    </form>
                    
                    <form onSubmit={(e) => {
                      e.preventDefault()
                      console.log(this.rating.value)
                      this.rateProfile(this.rating.value, this.review.value)
                    }}>
                      <div className='form-group mr-sm-2'
                      class="vertical-center">
                        <br></br>
                        <p id="rate_user">Rate this user</p>
                        <input // Integer score
                        id='rating'
                        type='number'
                        step='0'
                        min='1'
                        max='5'
                        className="form-control form-control-md"
                        placeholder='Your rating...'
                        required
                        ref={(input) => { this.rating = input }}
                        />
                        <input // String review 
                        id='review'
                        type='text'
                        className="form-control form-control-md"
                        placeholder='Write a review...'
                        required
                        ref={(input) => { this.review = input }}
                        />
                      </div>
                      <div class="container">
                        <div class="center">
                        <button id='btn_rate' type='submit' className='btn btn-primary'>Rate</button>
                          </div>
                          </div>
                    </form>
                 </div>
                </Tab>

              </Tabs>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;