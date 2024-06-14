// SPDX-License-Identifier: Unlicensed

pragma solidity >=0.7.0;

contract share {
    event transactions(address indexed from, address to, uint amount, string symbol);
    event recipeints(address indexed reecipientOf, address recipient, string recipientName);

    function _transfer(address payable _to, string memory symbol) public payable {
        _to.transfer(msg.value);
        emit transactions(msg.sender, _to, msg.value, symbol);
    }

    function saveTx(address from, address to, uint amount, string memory symbol) public {
        emit transactions(from, to, amount, symbol);
    }

    function addRecipient(address recipient, string memory name) public {
        emit recipeints(msg.sender, recipient, name);
    } 
}

//0x05afE8E09CD728E702f0FDC86A3A78F5990a55C3-amoy
//0xc18f92fB6e01A70516B6B62869899E80d3c800aA-sepolia