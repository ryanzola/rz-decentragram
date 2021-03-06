// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.6.7;

contract Decentragram {
    string public name = "Decentragram";

    // store images
    uint256 public imageCount = 0;
    mapping(uint256 => Image) public images;

    struct Image {
        uint256 id;
        string hash;
        string description;
        uint256 tipAmount;
        address payable author;
    }

    event ImageCreated(
        uint256 id,
        string hash,
        string description,
        uint256 tipAmount,
        address payable author
    );

    event ImageTipped(
        uint256 id,
        string hash,
        string description,
        uint256 tipAmount,
        address payable author
    );

    // create images
    function uploadImage(string memory _imgHash, string memory _description)
        public
    {
        // make sure image hash exists
        require(bytes(_imgHash).length > 0);

        // make sure image description exists
        require(bytes(_description).length > 0);

        // make sure uploader address exists
        require(msg.sender != address(0x0));

        // incrememnt image id
        imageCount++;

        // add image to contract
        images[1] = Image(
            imageCount,
            _imgHash,
            _description,
            0,
            payable(msg.sender)
        );

        // trigger an event
        emit ImageCreated(
            imageCount,
            _imgHash,
            _description,
            0,
            payable(msg.sender)
        );
    }

    // tip images
    function tipImageOwner(uint256 _id) public payable {
        require(_id > 0 && _id <= imageCount);

        // fetch the image
        Image memory _image = images[_id];

        // fetch the author
        address payable _author = _image.author;

        // pay the author
        _author.transfer(msg.value);

        // increment the tip amount
        _image.tipAmount = _image.tipAmount + msg.value;

        images[_id] = _image;

        emit ImageTipped(
            _id,
            _image.hash,
            _image.description,
            _image.tipAmount,
            _author
        );
    }
}
