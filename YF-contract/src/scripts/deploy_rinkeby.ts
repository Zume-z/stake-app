import { run } from 'hardhat'
import { ethers } from 'hardhat'
import deploy from '../functions/deploy'
import { parseUnits } from 'ethers/lib/utils'
import { Contract } from '@ethersproject/contracts'
import { logSuccess, logInfo, logTrace } from '../utils/logger'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'

let wallet1: SignerWithAddress
let wallet2: SignerWithAddress
let wallet3: SignerWithAddress

const func = async () => {
  ;[wallet1, wallet2, wallet3] = await ethers.getSigners()

  logInfo('Deploying...')
  const EthTokenContract = (await deploy('EthToken')).contract
  const RewTokenContract = (await deploy('RewToken')).contract
  const TokenFarmContract = (await deploy('TokenFarm', [RewTokenContract.address, EthTokenContract.address])).contract

  logSuccess('Deploy success')
  logTrace('TokenFarm contract:', TokenFarmContract.address)
  logTrace('RewToken contract:', RewTokenContract.address)
  logTrace('EthToken contract:', EthTokenContract.address)

  const txResponse1 = await RewTokenContract.transfer(TokenFarmContract.address, parseUnits('1000000', 'ether'))
  await txResponse1.wait()

  const txResponse2 = await EthTokenContract.transfer(TokenFarmContract.address, parseUnits('1000000', 'ether'))
  await txResponse2.wait()

  logTrace('Succesful Transfer, TokenFarm Rew token:', await RewTokenContract.balanceOf(TokenFarmContract.address))
  logTrace('Succesful Transfer, TokenFarm Eth token:', await EthTokenContract.balanceOf(TokenFarmContract.address))
  logTrace('Succesful Deployed to Rinkeby')
}

func()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
