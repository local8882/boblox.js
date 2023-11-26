**boblox.js**


--------- Update log -------------
+ GetGroupTransactions() (v1.3.5)
+ Added response typings for purchasing vip server and updating vip server and updating vip server subscription(v1.2.5)
+ Made typings a LOT easier to use and understand. Expect intellisense to be super helpful. Change endpoint for getting users. Fixed many small bugs i overlooked. The only properties of the robloxclient is now cookie and csrf. Use RobloxClient#GetCurrentUser to get your info.(v1.2.0)
+ Fixed error handling (v1.1.1)


-------------Details--------------
 + By LocalSimp#0001
 + With help(endpoint for csrf token) and mobileapi endpoint) from noblox.js
 + The endpoints that require captcha have been skipped, such as follow, send friend request etc.
 + COOKIE MUST INCLUDE THE WARNING PART TOO.
 + UNIVERSEID !== PLACEID. Use await RobloxClient#GetUniverseID(placeid)
 + ASSETID !== GAMEPASSID which is also !== VIPSERVERID
 + VIPSERVER AND PRIVATE SERVER MAY BE DIFFERENT THINGS SINCE ROBLOX IS WEIRD
 + Asset types are specified in index.d.ts
 + Any parameter called "limit" can only have a few number values. Specified in index.d.ts
 + 100+ Methods :pog:

```Examples Code Snippets```
+ With a cookie:
```js
const Roblox = require("boblox.js")
const Client = new Roblox.RobloxClient();
const Cookie = "A .ROBLOSECURITY cookie including the warning part." 
await Client.Initialize(Cookie)
const amIFollowingROBLOX = await Client.IsFollowing(1)
console.log(amIFollowingROBLOX)
```
+ Without a cookie:
```js
const Roblox = require("boblox.js")
const Client = new Roblox.RobloxClient();
const OwnsGamepass = await Client.UserOwnsGamepass(someuserId,someGamepassId)
if(OwnsGamepass === true){
    console.log("The user owns this gamepass")
} else {
    console.log("The user does not own this gamepass")
}
```
*Got any bugs/suggestions? let me know at: https://dsc.gg/localdevelopment*

