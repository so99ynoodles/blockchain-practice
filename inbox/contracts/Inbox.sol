// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Inbox {
    bytes32 public message;

    constructor (bytes32 _message) {
        message = _message;
    }

    function setMessage(bytes32 newMessage) public {
        message = newMessage;
    }
}