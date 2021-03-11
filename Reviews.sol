// SPDX-License-Identifier: MIT
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
        mapping(address => uint8) reviews;
    }

    mapping(address => Profile) public profiles; // stores all profiles. key=profileID , value=profile struct
    uint256 public profilesCount; // amount of profiles in the mapping

    function addProfile(string memory _desc) public { // sender adds new profile
         profilesCount++;
         Profile storage p = profiles[_adrs];
         p.id = profilesCount;
         p.adrs = msg.sender;
         p.description = _desc;
         p.reviewsCount = 0;
     }

    function editProfile(address _inputAdrs, string memory _desc) public {
        require(_inputAdrs == msg.sender);

        profiles[_inputAdrs].description = _desc;
    }

    function addReview(address _profileAdrs,uint8 _review) public { // sender adds new review
        require(_review > 0 && _review < 6); // valid review from 1 to 5
        require(profiles[_profileAdrs].reviews[msg.sender] == 0); // sender can rate someone else only once

        profiles[_profileAdrs].reviews[msg.sender] = _review;
        profiles[_profileAdrs].reviewsCount++;
        profiles[_profileAdrs].reviewsSum += _review;
        profiles[_profileAdrs].average = uint8(
            profiles[_profileAdrs].reviewsSum /
                profiles[_profileAdrs].reviewsCount
        );
    }
    constructor() public {
    }
}
