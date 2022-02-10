//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.11;

contract Contract {
    uint256 public x;
    event Doubled(address indexed doubler, uint256 x);

    constructor(uint256 _x) {
        x = _x;
    }

    function double() external {
        x *= 2;
        emit Doubled(msg.sender, x);
    }
}
