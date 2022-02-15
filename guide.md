# Integration guide

## Step 1

_Test in demo mode: your address and API key are not required._

- Add the JS file (https://github.com/ATO-nft/api-client/blob/main/ato-api-form.js) into your project.
- Integrate the HTML part:

```html
<script>
datasLoad(param1) {
  document.getElementById("CreatorName").value=param1;
  document.getElementById("CreatorAddress").value=param2;
}
</script>

<div><!-- user inputs fields –>
<input id=”FileName”>
</div>

<form>

<div style=”display: none”> <!-- invisible fields –>

<input id="FileType" value="png">
<input id="FileSize" value="24000">
<input id="ListNetwork" value="Polygon">
<input id="RightLevel" value="3">
<input id="RightAdapt" value="false">
<input id="RightLogo" value="false">
<input id="RightMerch" value="false">
<input id="RightDuration" value="70">
<input id="SupplyNumber" value="1">
<input id="RightExclusive" value="true">
<input id="NonReissuance" value="true">
<input id="ResaleRight" value="8%">
<input id="VersionApi" value="v1.0">
<input id="NftLicense" value="art">
<input id="NftStandard" value="ERC-721">

</div>

<div>
<button type="submit">
</div>

</form>
```

In the example above, we can see 3 different ways to set the required parameters:

- JS
- HTML input
- Hidden HTML input

## Step 2

_Add your address and API key to test the production mode._

1. Get your API key ([contact us directly](https://github.com/ATO-nft/api-client#support))
2. Send Rinkeby ETH to this address: `0xf1eeb16879a7ecbda10675dcdebeb27db96f1b87` (testnet)
3. Add your address in the `User address` field:

```html
<input
  id="userKey"
  name="userKey"
  type="text"
  value="0x0000000000000000000000000000000000000001"
  type="text"
  minlength="42"
  maxlength="42"
  size="50"
/>
```

4. Load your API key file:

```html
<input id="signature" name="signature" type="text" value="" hidden />
```

The value of `signature` is your API key.

## Step 3

_Multi-user mode._

- Add the [api-server](https://github.com/ATO-nft/api-core/blob/main/api-server.js) file in your Nodejs server
- Add your key file
