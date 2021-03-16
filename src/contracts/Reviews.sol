// SPDX-License-Identifier: MIT
pragma solidity >=0.4.0 <=0.8.0;
pragma experimental ABIEncoderV2;

contract Reviews {
    struct Profile {
        // store
        address adrs; // address of profile
        uint256 id; // profiles id
        uint256 reviewsCount; // reviews total amount
        uint256 reviewsSum; // all reviews sum
        uint8 average; // average score
        string description; // profile description
        mapping(address => uint8) reviews; // stores the rating int value of a user's review
        string[] reviewsString; // stores the rating string value of a user's review
    }

    mapping(address => Profile) public profiles; // stores all profiles. key=profileID , value=profile struct
    uint256 public profilesCount; // amount of profiles in the mapping

    function addProfile(string memory _stringAddress) public { // sender adds new profile
        profilesCount++;
        address _address = parseAddr(_stringAddress);
        Profile storage p = profiles[_address];
        p.id = profilesCount;
        p.adrs = msg.sender;
        p.description = "Empty Description";
        p.reviewsCount = 0;
    }

    string[] profileStrings; // Stores profile details
    
    function getProfile(string memory _stringAddress) public returns (string [] memory){
        
        uint length = profileStrings.length;
        for (uint i = 0; i<length; i++){ //Emptying array
            profileStrings.pop();
        }

        address _address = parseAddr(_stringAddress);
        Profile storage p = profiles[_address];

        profileStrings.push(p.description); // Profile description
        profileStrings.push(uint2str(p.average)); // Profile average review score

        return profileStrings;
    }


    function getReviewStrings(string memory _stringAddress) public view returns (string [] memory){

        address _address = parseAddr(_stringAddress);
        Profile storage p = profiles[_address];

        return p.reviewsString;
    }

    function editProfile (string memory _stringAddress, string memory _desc) public {
        address _inputAdrs = parseAddr(_stringAddress);
        require(_inputAdrs == msg.sender);

        profiles[_inputAdrs].description = _desc;
    }

     function addReview(string memory _stringAddress, uint8 _review, string memory _reviewString) public { // sender adds new review
         require(_review > 0 && _review < 6, 'Score must be between 1-5'); // valid review from 1 to 5
         address _profileAdrs = parseAddr(_stringAddress);
         require(profiles[_profileAdrs].reviews[msg.sender] == 0, 'You have reviewed this user already'); // sender can rate someone else only once
         require(_profileAdrs != msg.sender, 'You cant leave a review on your profile');

         profiles[_profileAdrs].reviews[msg.sender] = _review;
         profiles[_profileAdrs].reviewsString.push(_reviewString);
         profiles[_profileAdrs].reviewsCount++;
         profiles[_profileAdrs].reviewsSum += _review;
         profiles[_profileAdrs].average = uint8(
             profiles[_profileAdrs].reviewsSum /
                 profiles[_profileAdrs].reviewsCount
         );
     }

    constructor() public{

    }

    function uint2str(uint _i) internal pure returns (string memory _uintAsString) {
        if (_i == 0) {
            return "0";
        }
        uint j = _i;
        uint len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint k = len - 1;
        while (_i != 0) {
            bstr[k--] = byte(uint8(48 + _i % 10));
            _i /= 10;
        }
        return string(bstr);
    }

    function parseAddr(string memory _a) internal pure returns (address _parsedAddress) {
    bytes memory tmp = bytes(_a);
    uint160 iaddr = 0;
    uint160 b1;
    uint160 b2;
    for (uint i = 2; i < 2 + 2 * 20; i += 2) {
        iaddr *= 256;
        b1 = uint160(uint8(tmp[i]));
        b2 = uint160(uint8(tmp[i + 1]));
        if ((b1 >= 97) && (b1 <= 102)) {
            b1 -= 87;
        } else if ((b1 >= 65) && (b1 <= 70)) {
            b1 -= 55;
        } else if ((b1 >= 48) && (b1 <= 57)) {
            b1 -= 48;
        }
        if ((b2 >= 97) && (b2 <= 102)) {
            b2 -= 87;
        } else if ((b2 >= 65) && (b2 <= 70)) {
            b2 -= 55;
        } else if ((b2 >= 48) && (b2 <= 57)) {
            b2 -= 48;
        }
        iaddr += (b1 * 16 + b2);
    }
    return address(iaddr);
}
}
