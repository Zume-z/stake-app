// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';

contract TokenFarm {
  string public name = 'Reward Token Farm';
  address public owner;
  IERC20 public rewToken;
  IERC20 public ethToken;
  uint256 public totalTokensStaked;

  address[] public stakers;
  mapping(address => uint256) public stakeBalance;
  mapping(address => bool) public isStaking;
  mapping(address => uint256) public stakeStart;
  mapping(address => uint256) public yieldBalance;

  constructor(address _rewTokenAddress, address _ethTokenAddress) {
    rewToken = IERC20(_rewTokenAddress);
    ethToken = IERC20(_ethTokenAddress);
    owner = msg.sender;
  }

  //1. Stake tokens
  function stake(uint256 _amount) public {
    require(_amount > 0 && ethToken.balanceOf(msg.sender) >= _amount, 'Amount cannont be 0');

    if (isStaking[msg.sender] == true) {
      uint256 transferYield = calculateYieldTotal(msg.sender);
      yieldBalance[msg.sender] = yieldBalance[msg.sender] + transferYield;
    }

    ethToken.transferFrom(msg.sender, address(this), _amount);
    stakeBalance[msg.sender] = stakeBalance[msg.sender] + _amount;
    totalTokensStaked = totalTokensStaked + _amount;
    stakeStart[msg.sender] = block.number;
    isStaking[msg.sender] = true;
  }

  //2. UnStake tokens
  function unstake(uint256 _unStakeamount) public {
    uint256 balance = stakeBalance[msg.sender];
    require(balance > 0, 'Amount cannont be 0');
    require(_unStakeamount <= balance, 'Ammount cannot be more than balance');

    uint256 transferYield = calculateYieldTotal(msg.sender);
    yieldBalance[msg.sender] = yieldBalance[msg.sender] + transferYield;
    ethToken.transfer(msg.sender, _unStakeamount);
    stakeBalance[msg.sender] = balance - _unStakeamount;
    totalTokensStaked = totalTokensStaked - _unStakeamount;
    stakeStart[msg.sender] = block.number;
    if (stakeBalance[msg.sender] == 0) {
      isStaking[msg.sender] = false;
    }
  }

  // 3. Calc Yield Time
  function calculateYieldTime(address _sender) public view returns (uint256) {
    uint256 stakeEnd = block.number;
    uint256 totalStakedTime = stakeEnd - stakeStart[_sender];
    return totalStakedTime;
  }

  // 4. Calculate Yield
  function calculateYieldTotal(address _sender) public view returns (uint256) {
    uint256 stakedTime = calculateYieldTime(_sender);
    uint256 yieldPerBlock = 1;
    uint256 rateTime = stakedTime * yieldPerBlock;
    uint256 yield = stakeBalance[_sender] * rateTime;
    return yield;
  }

  // 5. WithDraw Yield
  function withdrawYield() public {
    uint256 totalYield = calculateYieldTotal(msg.sender) + yieldBalance[msg.sender];
    require(totalYield > 0, 'Nothing to withdraw');
    yieldBalance[msg.sender] = 0;
    stakeStart[msg.sender] = block.number;
    rewToken.transfer(msg.sender, totalYield);
  }

  function unstakeAll() public {
    uint256 balance = stakeBalance[msg.sender];
    uint256 totalYield = calculateYieldTotal(msg.sender) + yieldBalance[msg.sender];
    require(balance > 0, 'Balance is 0');
    require(totalYield > 0, 'Yield is 0');
    stakeBalance[msg.sender] = 0;
    yieldBalance[msg.sender] = 0;
    stakeStart[msg.sender] = block.number;
    totalTokensStaked = totalTokensStaked - balance;
    rewToken.transfer(msg.sender, totalYield);
    ethToken.transfer(msg.sender, balance);
    if (stakeBalance[msg.sender] == 0) {
      isStaking[msg.sender] = false;
    }
  }

  function claimMockEth() public {
    uint256 ethClaim = 10000000000000000000;
    ethToken.transfer(msg.sender, ethClaim);
  }
}


