---
order: -4000
---

# NFT smart contracts

- Āto Classic
- Āto Redeemable
- Āto Unique
- Āto votes

### NFT contracts

#### Āto Classic

_View source code of **Ato.sol** on [Github](https://github.com/ATO-nft/ato/blob/main/contracts/Ato.sol) or [Etherscan](https://goerli.etherscan.io/address/0xaf33c584bcfec5a2513c184568be871d19a98ffc#code)._

```solidity
// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.15;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import './ERC2981ContractWideRoyalties.sol';
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

/// @title NFT contract

contract Ato is ERC721, ERC721URIStorage, ERC721Burnable, Ownable, ERC2981ContractWideRoyalties {

	using Counters for Counters.Counter;
	Counters.Counter private _tokenIdCounter;

	/// @notice constructor
	/// @param _name name of ERC-721 token
	/// @param _symbol symbol of ERC-721 token
	/// @param _mintNumber number of NFT to mint
	/// @param _uri metadata of NFT when redeeemable
	/// @param _royalties resale rights percentage (using 2 decimals: 10000 = 100%, 150 = 1.5%, 0 = 0%)
	constructor(
		string memory _name,
		string memory _symbol,
		uint _mintNumber,
		string memory _uri,
		uint256 _royalties
	)
	ERC721(_name, _symbol)
	{
		_mintBatch(_mintNumber, _uri);
		_setRoyalties(owner(), _royalties);
	}

	function _baseURI() internal pure override returns (string memory) {
        return "https://ipfs.io/ipfs/";
    }

	function totalSupply()
		public
		view
		returns (uint256)
	{
		return _tokenIdCounter.current();
	}

	/// @notice mint in batch
	/// @param _number number of NFTs to mint
	function _mintBatch(uint _number, string memory _uri)
		internal
	{
		uint current = _tokenIdCounter.current();
		uint last = current + _number;

		for (uint i = current; i < last; i++) {
			_mintNFT(_uri);
		}
	}

	/// @notice mint NFT
	function _mintNFT(string memory _uri)
		internal
	{
		_tokenIdCounter.increment();
		_safeMint(owner(), _tokenIdCounter.current());
		_setTokenURI(_tokenIdCounter.current(), _uri);
	}

	function _beforeTokenTransfer(address from, address to, uint256 tokenId)
		internal
		override(ERC721)
	{
		super._beforeTokenTransfer(from, to, tokenId);
	}

	function _afterTokenTransfer(address from, address to, uint256 tokenId)
		internal
		override(ERC721)
	{
		super._afterTokenTransfer(from, to, tokenId);
	}

	function _burn(uint256 tokenId)
		internal
		override(ERC721, ERC721URIStorage)
	{
		super._burn(tokenId);
	}

	function tokenURI(uint256 tokenId)
		public
		view
		override(ERC721, ERC721URIStorage)
		returns (string memory)
	{
		return super.tokenURI(tokenId);
	}

	function supportsInterface(bytes4 interfaceId)
		public
		view
		override(ERC721, ERC2981ContractWideRoyalties)
		returns (bool)
	{
		return super.supportsInterface(interfaceId);
	}
}

```

This is a standard ERC-721 that can be transferred or burnt. It mints a series of NFTs at deployment and transfer them all to the deployer. The minting function is triggered only once. It is not accessible afterwards, meaning no one can mint ever again.

---

_Feel free to contact us directly via [Element](https://matrix.to/#/@julienbrg:matrix.org), [Twitter](https://twitter.com/julienbrg), [Discord](https://discord.gg/xw9dCeQ94Y), [LinkedIn](https://www.linkedin.com/in/julienberanger/) or [email](mailto:julien@ato.network)._
