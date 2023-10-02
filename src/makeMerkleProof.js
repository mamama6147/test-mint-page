// 参考URL
// https://zenn.dev/pokena/scraps/1b8c3e9d1b2e6e

// npm install merkletreejs, npm install keccak256 でモジュールをインストールする必要あり

// モジュールのインポート
let { MerkleTree } = require("merkletreejs");
let keccak256 = require("keccak256");

// WLの読み込み
let whitelist = require("./allowlist.json");

// マークルツリーとマークルルートを生成
let hashedAddresses = whitelist.map((addr) => keccak256(addr));
let merkleTree = new MerkleTree(hashedAddresses, keccak256, {
  sortPairs: true,
});
let root = merkleTree.getHexRoot(); // これがGoldのMerkleRoot
console.log(merkleTree.toString()); // Goldのマークルツリーをログ出力


console.log("マークルルート")
console.log(root)

// リストされているか確認する対象のアドレスを変数に代入、ハッシュ化
let address = "0xC7ec777ad0d39B2e88D8278dB79212C06032B6B2";
// let address = "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4";
// let address = "0x637d25D0769f747B2742A04d249802dA85395970";
// let address = blockchain.account; // FEへの組み込み時はコネクトしているアドレスを指定
let hashedAddress = keccak256(address);

// マークルプルーフを生成
let proof = merkleTree.getHexProof(hashedAddress);
// let proofS = merkleTreeS.getHexProof(hashedAddress);
// let proofB = merkleTreeB.getHexProof(hashedAddress);
console.log("マークルプルーフ")
console.log(proof)
// console.log("platinumのマークルプルーフ")
// console.log(proofS)
// console.log("blackのマークルプルーフ")
// console.log(proofB)

if (merkleTree.verify(proof, hashedAddress, root)) {
  console.log("リストされています");
// } else if (merkleTreeG.verify(proofS, hashedAddress, rootS)) {
//   console.log("Silverにリストされています");
// } else if (merkleTreeG.verify(proofB, hashedAddress, rootB)) {
//   console.log("Bronzにリストされています");
} else {
  console.log("リストされていません");
}
