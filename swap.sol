
//SPDX-License-Identifier:Unlicensed
pragma solidity ^0.6.2;

interface IUniswap {
  function swapETHForExactTokens(uint amountOut, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts);
  function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts);
  function getAmountsOut(uint amountIn, address[] memory path) external view returns (uint[] memory amounts);
  function getAmountsIn(uint amountOut, address[] memory path) external view returns (uint[] memory amounts);
  function WETH() external pure returns (address);
}

/**
 * @title Swap
 * @dev Swap Contract to swap exact token in reference to ETH  
 */
contract swap {

  // variable to store uniswap router contract Address
  address internal constant UNISWAP_ROUTER_ADDRESS = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;

  //address private constant WETH = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
  
  IUniswap public uniswap;

    uint256 public sellPrice;
    uint256 public buyPrice;

  constructor() public {
    uniswap = IUniswap(UNISWAP_ROUTER_ADDRESS);
  }

  /// @param newBuyPrice Price users can buy from the contract
    function setPrices(uint256 newBuyPrice) public {
        buyPrice = newBuyPrice;
    }

    /// @notice Buy tokens from contract by sending ether
    function buy() payable public {
        uint amount = msg.value / buyPrice;               // calculates the amount
        _transfer(this, msg.sender);              // makes the transfers
    }

    
  function ethAmount(uint amounts, address token) public view returns(uint256[] memory){
    address[] memory path = new address[](2);
    path[0] = uniswap.WETH();
    path[1] = token;
    return uniswap.getAmountsIn(amounts,path);
  }

  function testSwapExactETHForTokens(uint amountOut, address token) external payable {
    require(token != address(0), "Invalid Token Address, Please Try Again");
    require(amountOut > 0,"Amount is zero or invalid, Please Try Again!!!");
    //IERC20(token).transferFrom(msg.sender, address(this), amountOut);
    //IERC20(token).approve(UNISWAP_ROUTER_ADDRESS, amountOut);
    address[] memory path = new address[](2);
    path[0] = uniswap.WETH();
    path[1] = token;
    uniswap.swapExactETHForTokens{value: msg.value}(amountOut, path, msg.sender, now+3600);
  }

  receive() external payable {}
  fallback() external payable {}
  
}
