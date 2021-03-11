// SPDX-License-Identifier: MIT
// ----------------------
// Reviews smart contract
// ----------------------
pragma solidity >=0.4.0 <0.8.0;

contract Reviews {
    struct Profile {
        // store
        address adrs; // address of profile
        uint256 id; // profiles id
        uint256 reviewsCount; // reviews total amount
        uint256 reviewsSum; // all reviews sum
        uint8 average; // average score
        string description; // profile description
        mapping(address => uint8) reviews; // array of addresses and the review they left on this profile 
    }

    mapping(address => Profile) public profiles; // stores all profiles. key=address , value=profile struct
    uint256 public profilesCount; // amount of profiles in the mapping

    // adds new profile with description and address of sender
    function addProfile(string memory _desc) public {
         profilesCount++; 
         Profile storage p = profiles[_adrs]; // new profile
         p.id = profilesCount; // set id of profile
         p.adrs = msg.sender; // set address
         p.description = _desc; // set description
         p.reviewsCount = 0; // set reviews count
     }

    // edits profile description of given address
    function editProfile(address _inputAdrs, string memory _desc) public {
        require(_inputAdrs == msg.sender); // requires profile to belong to sender
        profiles[_inputAdrs].description = _desc; // sets new description
    }

    // adds profile review
    function addReview(address _profileAdrs,uint8 _review) public { // gets address to review and the review int
        require(_review > 0 && _review < 6); // valid review from 1 to 5
        require(profiles[_profileAdrs].reviews[msg.sender] == 0); // sender can rate someone else only once

        profiles[_profileAdrs].reviews[msg.sender] = _review; // saves sender to profile's reviews
        profiles[_profileAdrs].reviewsCount++; // +1 review
        profiles[_profileAdrs].reviewsSum += _review; // sums review
        profiles[_profileAdrs].average = uint8( // calculates average: sum/amount
            profiles[_profileAdrs].reviewsSum /
                profiles[_profileAdrs].reviewsCount
        );
    }
    constructor() public {
    }
}
