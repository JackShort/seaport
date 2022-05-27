const opensea = require('opensea-js')
const { WyvernSchemaName } = require('opensea-js/lib/types')
const OpenSeaPort = opensea.OpenSeaPort
const Network = opensea.Network
const MnemonicWalletSubprovider = require('@0x/subproviders').MnemonicWalletSubprovider
const RPCSubprovider = require('web3-provider-engine/subproviders/rpc')
const Web3ProviderEngine = require('web3-provider-engine')
const { PrivateKeyWalletSubprovider } = require('@0x/subproviders')
require('dotenv').config()

const MNEMONIC = process.env.MNEMONIC
const NODE_API_KEY = process.env.INFURA_KEY
const OWNER_ADDRESS = process.env.OWNER_ADDRESS
const PRIVATE_KEY = process.env.PRIVATE_KEY

if (!NODE_API_KEY || !OWNER_ADDRESS) {
    throw new Error('Please set a mnemonic, Alchemy/Infura key, owner, network, API key, nft contract, and factory contract address.')
}

const BASE_DERIVATION_PATH = `44'/60'/0'/0`

const privateSub = new PrivateKeyWalletSubprovider(PRIVATE_KEY, 4)

const mnemonicWalletSubprovider = new MnemonicWalletSubprovider({
    mnemonic: MNEMONIC,
    baseDerivationPath: BASE_DERIVATION_PATH,
})
const network = 'rinkeby'
const infuraRpcSubprovider = new RPCSubprovider({
    rpcUrl: 'https://eth-rinkeby.alchemyapi.io/v2/I5yx8gywaNv99D37RzyCeLUw-42ubKOs',
})

const providerEngine = new Web3ProviderEngine()
providerEngine.addProvider(privateSub)
providerEngine.addProvider(infuraRpcSubprovider)
providerEngine.start()

const seaport = new OpenSeaPort(providerEngine, {
    networkName: Network.Rinkeby,
})

async function main() {
    // Expire this auction one day from now.
    const expirationTime = Math.round(Date.now() / 1000 + 60 * 60 * 24)

    const NFT_CONTRACT_ADDRESS = '0x3eC9C3cB29Ed95A396A48a4fBDb6b8546d001D5A'
    const TOKEN_ID = '281'

    console.log('Listing token:', NFT_CONTRACT_ADDRESS + '/' + TOKEN_ID)
    const listing = ''
    try {
        listing = await seaport.createSellOrder({
            asset: {
                tokenId: TOKEN_ID,
                tokenAddress: NFT_CONTRACT_ADDRESS,
                schemaName: WyvernSchemaName.ERC721,
            },
            startAmount: 0.05,
            expirationTime: expirationTime,
            accountAddress: OWNER_ADDRESS,
        })
    } catch (e) {
        throw new Error(JSON.stringify(e))
    }
    console.log(`Successfully created a sell order! ${listing.asset.openseaLink}\n`)
}

main()
