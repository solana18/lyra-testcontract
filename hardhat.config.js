require('dotenv').config();
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require('hardhat-deploy');
require('hardhat-dependency-compiler');
const { lyraContractPaths } = require('@lyrafinance/protocol/dist/test/utils/package/index-paths');

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
	const accounts = await hre.ethers.getSigners();

	for (const account of accounts) {
		console.log("accounts", account.address);
	}
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
	networks: {
		localhost: {
			url: "http://127.0.0.1:8545"
		},
		ganache: {
			url: "http://127.0.0.1:7545",
			accounts: [process.env.PRIVATEKEY]
		},
		ethereum: {
			url: "https://main-light.eth.linkpool.io/",
			accounts: [process.env.PRIVATEKEY]
		},

	},
	solidity: {
		compilers: [
			{
				version: "0.6.12",
				settings: {
					optimizer: {
						enabled: true,
						runs: 200,
					},
				}
			},
			{
				version: "0.4.17",
				settings: {
					optimizer: {
						enabled: true,
						runs: 200,
					},
				}
			},
			{
				version: "0.5.16",
				settings: {
					optimizer: {
						enabled: true,
						runs: 200,
					},
				}
			},
			{
				version: "0.7.6",
				settings: {
					optimizer: {
						enabled: true,
						runs: 200,
					},
				}
			},
			{
				version: "0.8.9",
				settings: {
					optimizer: {
						enabled: true,
						runs: 200,
					},
				}
			},
		]
	},
	dependencyCompiler: {
		paths: lyraContractPaths,
	},
	mocha: {
		timeout: 200000
	}
};
