/**
 * Testing Roblox API Wrapper™
 * By LocalSimp#0001
 * With help(endpoint for csrf token) and getcurrentuser endpoint) from noblox.js
 * The endpoints that require captcha have been skipped, such as follow, send friend request etc.
 * NOTE: ALL IDS MUST BE INPUT AS STRING
 * COOKIE MUST INCLUDE THE WARNING PART TOO.
 * UNIVERSEID !== PLACEID. 
 * ASSETID !== GAMEPASSID which is also !== VIPSERVERID
 * VIPSERVER AND PRIVATE SERVER MAY BE DIFFERENT THINGS SINCE ROBLOX IS WEIRD
 * Asset types: https://roblox.fandom.com/wiki/Asset_types
 * most limits are capable of 10,25,50,100
 */

 const fetch = require("node-fetch");
 class RobloxClient {
     constructor(){}
     async Initialize(cookie){
        const isvalid = await this.IsValidCookie(cookie)
        if(isvalid===false)throw new Error("COOKIE PROVIDED IS INVALID.")
         this.cookie = cookie
         this.csrf = await this.#GetCSRFToken();
         return this
     }
     async IsValidCookie(cookiee){
         const r = await fetch("https://www.roblox.com/mobileapi/userinfo",{
             headers:{
                 "Accept":"application/json",
                 "Content-Type":"application/json",
                 "Cookie":".ROBLOSECURITY="+ cookiee,
                 "X-CSRF-TOKEN":(this.csrf)
             },
         })
         const p = await r.text()
         try {
             JSON.parse(p);
         } catch (e) {
             return false;
         }
         return true;
     }
 
     async #GetCSRFToken(){
         if(!this.cookie)throw new Error("Please initialize the client with a valid cookie before using this method.");
         const r = await fetch("https://auth.roblox.com/v2/logout",{
             method:"POST",
             headers :{
                 "Accept":"application/json",
                 "Content-Type":"application/json",
                 "Cookie":".ROBLOSECURITY="+ this.cookie
             }
         })
         const p = r.headers.get("x-csrf-token");
           return p || new Error("No CSRF Token found. Invalid cookie?");
     }
     async GetGameInfo(universeId){
         if(universeId === null)throw new Error("NO UNIVERSEID PROVIDED")
         const r = await fetch(`https://games.roblox.com/v1/games?universeIds=${universeId}`)
         const p = await r.json()
         if(r.status !==200)throw new Error(JSON.stringify(p))
  
           return p.data.length > 0 ? p.data[0] : new Error("Invalid UniverseId provided")
     }
     async GetUniverseID(placeId){
         if(placeId === null)throw new Error("NO PLACEID PROVIDED")
         const r = await fetch(`https://api.roblox.com/universes/get-universe-containing-place?placeId=${placeId}`)
         const p = await r.json();
         if(r.status !==200)throw new Error(JSON.stringify(p))
  
           return p.UniverseId
     }
     async GetIncomingAlerts(){
         if(!this.cookie)throw new Error("No cookie provided. Set cookie first.")
         const r = await fetch("https://api.roblox.com/incoming-items/counts",{
             headers:{
                 "Accept":"application/json",
                 "Content-Type":"application/json",
                 "Cookie":".ROBLOSECURITY="+ this.cookie
             }
         })
         const p = await r.json();
         if(r.status !==200)throw new Error(JSON.stringify(p))
  
           return p;
     }
     async GetAssetInfo(assetID){
         if(assetID === null)throw new Error("NO ASSETID PROVIDED.")
         const r = await fetch(`https://api.roblox.com/marketplace/productinfo?assetId=${assetID}`);
         const p = await r.json();
         if(r.status !==200)throw new Error(JSON.stringify(p))
           return p;
     }
     async GetGamepassInfo(gamepassID){
         if(gamepassID === null)throw new Error("NO GAMEPASSID PROVIDED.")
         const r = await fetch(`https://api.roblox.com/marketplace/game-pass-product-info?gamePassId=${gamepassID}`)
         const p = await r.json();
         if(r.status !==200)throw new Error(JSON.stringify(p))
  
           return p;
     }
     async UserOwnsAsset(assetID,userId){
         if(userId === null)throw new Error("NO USER ID PROVIDED.")
         if(assetID === null)throw new Error("NO ASSET ID PROVIDED.")
         const r = await fetch(`https://api.roblox.com/ownership/hasasset?userId=${userId}&assetId=${assetID}`);
         const p = await r.text();
         if(r.status !==200)throw new Error(JSON.stringify(p))
        return p === "true" ? true : false
     }
     async GetDeviceInfo(){
         if(!this.cookie)throw new Error("Please initialize the client with a valid cookie before using this method.");
         const r = await fetch(`https://api.roblox.com/reference/deviceinfo`,{
             headers:{
                 "Accept":"application/json",
                 "Content-Type":"application/json",
                 "Cookie":".ROBLOSECURITY="+ this.cookie
             }
         })
         const p = await r.json();
         if(r.status !==200)throw new Error(JSON.stringify(p))
  
           return p;
     }
     async Block(userId){
         if(!this.cookie)throw new Error("Please initialize the client with a valid cookie before using this method.");
         const r = await fetch("https://api.roblox.com/userblock/block",{
             method:"POST",
             headers:{
                 "Accept":"application/json",
                 "Content-Type":"application/json",
                 "Cookie":".ROBLOSECURITY="+ this.cookie,
                 "X-CSRF-TOKEN":(this.csrf)
             },
             body:JSON.stringify({"userId":parseInt(userId)})
         })
         const p = await r.json();
         if(r.status !==200)throw new Error(JSON.stringify(p))
  
           return p;
     }
     async Unblock(UserId){
         if(!this.cookie)throw new Error("Please initialize the client with a valid cookie before using this method.");
         const r = await fetch("https://api.roblox.com/userblock/unblock",{
             method:"POST",
             headers:{
                 "Accept":"application/json",
                 "Content-Type":"application/json",
                 "Cookie":".ROBLOSECURITY="+ this.cookie,
                 "X-CSRF-TOKEN":(this.csrf)
             },
             body:JSON.stringify({"userId":parseInt(UserId)})
         })
         const p = await r.json();
         if(r.status !==200)throw new Error(JSON.stringify(p))
  
           return p;
     }
     async GetUserFromID(userId){
         if(userId === null)throw new Error("NO USERID PROVIDED")
         const r = await fetch(`https://users.roblox.com/v1/users/${userId}`);
         if(r.status !== 200)throw new Error("Invalid userid - Not found")
         const p = await r.json();
         if(r.status !==200)throw new Error(JSON.stringify(p))
           return p;
     }
     async GetUserFromName(username){
         if(username === null)throw new Error("NO USERNAME PROVIDED")
         const r = await fetch(`https://api.roblox.com/users/get-by-username?username=${username}`)
         if(r.status !==200)throw new Error(JSON.stringify("Invalid Username - Not found"))
         let p = await r.json()
         if(r.status !==200)throw new Error(JSON.stringify(p))
         const o = await this.GetUserFromID(p.Id)
        return o
     }
     async CanManageAsset(UserId,assetID){
         if(UserId === null)throw new Error("NO USERID PROVIDED")
         if(assetID === null)throw new Error("NO ASSETID PROVIDED")
         const r = await fetch(`https://api.roblox.com/users/${UserId}/canmanage/${assetID}`)
         const p = await r.json();
         if(r.status !==200)throw new Error(JSON.stringify(p))
  
           return p.CanManage || p
     }
     async GetUserPresence(userId){
         if(userId === null)throw new Error("NO USERID PROVIDED")
         const r = await fetch("https://presence.roblox.com/v1/presence/users",{
             method:"POST",
             headers:{
                 "Accept":"application/json",
                 "Content-Type":"application/json",
             },
             body:JSON.stringify({"userIds":[parseInt(userId)]})
         })
         const p = await r.json();
         if(r.status !==200)throw new Error(JSON.stringify(p))
  
           return p.userPresences[0]
     }
     async FriendCount(userId){
         if(userId === null)throw new Error("NO USERID PROVIDED")
         const r = await fetch(`https://friends.roblox.com/v1/users/${userId}/friends/count`)
         const p = await r.json();
         if(r.status !==200)throw new Error(JSON.stringify(p))
  
           return p.count
 
     }
     async GetFriends(userId){
         if(userId === null)throw new Error("NO USERID PROVIDED")
         const r = await fetch(`https://friends.roblox.com/v1/users/${userId}/friends`)
         const p = await r.json();
         if(r.status !==200)throw new Error(JSON.stringify(p))
  
           return p.data
     }
     async FollowerCount(userId){
         if(userId === null)throw new Error("NO USERID PROVIDED")
         const r = await fetch(`https://friends.roblox.com/v1/users/${userId}/followers/count`)
         const p = await r.json();
         if(r.status !==200)throw new Error(JSON.stringify(p))
  
           return p.count;
     }
     async GetFollowers(userId,limit){
         if(userId === null)throw new Error("NO USERID PROVIDED")
         if(limit === null)limit = 10
         const r = await fetch(`https://friends.roblox.com/v1/users/${userId}/followers?limit=${limit}`)
         const p = await r.json();
         if(r.status !==200)throw new Error(JSON.stringify(p))
  
           return p.data
     }
     async FollowingCount(userId){
         if(userId === null)throw new Error("NO USERID PROVIDED")
         const r = await fetch(`https://friends.roblox.com/v1/users/${userId}/followers/count`)
         const p = await r.json();
         if(r.status !==200)throw new Error(JSON.stringify(p))
  
           return p.count || p
     }
     async GetFollowings(userId,limit){
         if(userId === null)throw new Error("NO USERID PROVIDED")
         if(limit === null)limit = 10
         const r = await fetch(`https://friends.roblox.com/v1/users/${userId}/followers?limit=${limit}`)
         const p = await r.json();
         if(r.status !==200)throw new Error(JSON.stringify(p))
  
           return p.data
     }
    async GetCurrentUser(){
         if(!this.cookie)throw new Error("Please initialize the client with a valid cookie before using this method.");
        const h = {};
         const r = await fetch("https://www.roblox.com/mobileapi/userinfo",{
             headers:{
                 "Accept":"application/json",
                 "Content-Type":"application/json",
                 "Cookie":".ROBLOSECURITY="+ this.cookie,
                 "X-CSRF-TOKEN":this.csrf
             }
         })
         const r2 = await fetch("https://users.roblox.com/v1/users/authenticated",{
             headers:{
                 "Accept":"application/json",
                 "Content-Type":"application/json",
                 "Cookie":".ROBLOSECURITY="+ this.cookie,
             }
         })
         if(r.status !==200)throw new Error(JSON.stringify(p))
         const p2 = await r2.json();
         const p = await r.json();
         p.DisplayName = p2.displayName
         return p
     }
     async GetOnlineFriends(){
         if(!this.cookie)throw new Error("Please initialize the client with a valid cookie before using this method.");
         const myuserId = (await this.GetCurrentUser()).userId
         const r = await fetch(`https://friends.roblox.com/v1/users/${myuserId}/friends/online`,{
             headers:{
             "Accept":"application/json",
             "Content-Type":"application/json",
             "Cookie":".ROBLOSECURITY="+ this.cookie,
             }
         })
         const p = await r.json();
         if(r.status !==200)throw new Error(JSON.stringify(p))
  
           return p.data 
     }
     async DeclineAllPendingFriendRequests(){
         if(!this.cookie)throw new Error("Please initialize the client with a valid cookie before using this method.");
         const r = await fetch(`https://friends.roblox.com/v1/user/friend-requests/decline-all`,{
             method :"POST",
             headers:{
             "Accept":"application/json",
             "Content-Type":"application/json",
             "Cookie":".ROBLOSECURITY="+ this.cookie,
             "X-CSRF-TOKEN":(this.csrf)
             }
         })
         const p = await r.json();
         if(r.status !==200)throw new Error(JSON.stringify(p))
  
           return p
     }
     async AcceptFriendRequest(requesterId){
         if(!this.cookie)throw new Error("Please initialize the client with a valid cookie before using this method.");
         if(requesterId === null)throw new Error("NO REQUESTER ID PROVIDED")
         const r = await fetch(`https://friends.roblox.com/v1/users/${requesterId}/accept-friend-request`,{
             method :"POST",
             headers:{
             "Accept":"application/json",
             "Content-Type":"application/json",
             "Cookie":".ROBLOSECURITY="+ this.cookie,
             "X-CSRF-TOKEN":(this.csrf)
             },
         })        
         const p = await r.json();
         if(r.status !==200)throw new Error(JSON.stringify(p))
  
           return p
     }
     async DeclineFriendRequest(requesterId){
         if(!this.cookie)throw new Error("Please initialize the client with a valid cookie before using this method.");
         if(requesterId === null)throw new Error("NO REQUESTER ID PROVIDED")
         const r = await fetch(`https://friends.roblox.com/v1/users/${requesterId}/decline-friend-request`,{
             method :"POST",
             headers:{
             "Accept":"application/json",
             "Content-Type":"application/json",
             "Cookie":".ROBLOSECURITY="+ this.cookie,
             "X-CSRF-TOKEN":(this.csrf)
             },
         })        
         const p = await r.json();
         if(r.status !==200)throw new Error(JSON.stringify(p))
  
           return p
     }
     async Unfollow(userId){
         if(!this.cookie)throw new Error("Please initialize the client with a valid cookie before using this method.");
         if(userId === null)throw new Error("NO USER ID PROVIDED")
         const r = await fetch(`https://friends.roblox.com/v1/users/${userId}/unfollow`,{
             method :"POST",
             headers:{
             "Accept":"application/json",
             "Content-Type":"application/json",
             "Cookie":".ROBLOSECURITY="+ this.cookie,
             "X-CSRF-TOKEN":(this.csrf)
             },
         })        
         const p = await r.json();
         if(r.status !==200)throw new Error(JSON.stringify(p))
  
           return p
     }
     async Unfriend(userId){
         if(!this.cookie)throw new Error("Please initialize the client with a valid cookie before using this method.");
         if(userId === null)throw new Error("NO USER ID PROVIDED")
 
         const r = await fetch(`https://friends.roblox.com/v1/users/${userId}/unfriend`,{
             method :"POST",
             headers:{
             "Accept":"application/json",
             "Content-Type":"application/json",
             "Cookie":".ROBLOSECURITY="+ this.cookie,
             "X-CSRF-TOKEN":(this.csrf)
             },
         })        
         const p = await r.json();
         if(r.status !==200)throw new Error(JSON.stringify(p))
  
           return p
     }
     async IsFollowing(userId){
         if(!this.cookie)throw new Error("Please initialize the client with a valid cookie before using this method.");
         if(userId === null)throw new Error("NO USER ID PROVIDED")
         const r = await fetch(`https://friends.roblox.com/v1/user/following-exists`,{
             method :"POST",
             headers:{
             "Accept":"application/json",
             "Content-Type":"application/json",
             "Cookie":".ROBLOSECURITY="+ this.cookie,
             "X-CSRF-TOKEN":(this.csrf)
             },
             body:JSON.stringify({"targetUserIds":[parseInt(userId)]})
         })        
         const p = await r.json();
         if(r.status !==200)throw new Error(JSON.stringify(p))
  
           return p.followings.isFollowing || p
     }
     async GetGameMedia(universeId){
         if(universeId === null)throw new Error("NO UNIVERSEID PROVIDED")
         const r = await fetch(`https://games.roblox.com/v2/games/${universeId}/media`)
         const p = await r.json();
         if(r.status !==200)throw new Error(JSON.stringify(p))
  
           return p.data[0] || p
 
     }
     async GetGamesByGroup(groupId,limit){
         if(groupId === null)throw new Error("NO GROUPID PROVIDED")
         if(limit === null)limit = 10
         const r = await fetch(`https://games.roblox.com/v2/groups/${groupId}/games?limit=${limit}`)
         const p = await r.json();
         if(r.status !==200)throw new Error(JSON.stringify(p))
  
           return p.data
     }
     async GetfavoriteGames(userId,limit){
         if(userId === null)throw new Error("NO USERID PROVIDED")
         if(limit === null)limit = 10
         const r = await fetch(`https://games.roblox.com/v2/users/${userId}/favorite/games?&limit=${limit}`)
         const p = await r.json();
         if(r.status !==200)throw new Error(JSON.stringify(p))
  
           return p.data
     }
     async GetGamesByUser(userId,limit){
         if(userId === null)throw new Error("NO USERID PROVIDED")
         if(limit === null)limit = 10
         const r = await fetch(`https://games.roblox.com/v2/users/${userId}/games?limit=${limit}`)
         const p = await r.json();
         if(r.status !==200)throw new Error(JSON.stringify(p))
  
           return p.data
     }
     async GetGameServerList(placeId,serverType,limit){
         if(placeId === null)throw new Error("NO PLACEID PROVIDED")
         if(serverType === null)serverType = "Public"
         if(limit === null)limit = 10
         if(serverType.toLowerCase() === "vip"){
             if(!this.cookie)throw new Error("You must have authorization to see vip servers that you can access")
         }
         const r = await fetch(`https://games.roblox.com/v1/games/${placeId}/servers/${serverType}?limit=${limit}`,{
            headers:{
                "Accept":"application/json",
                "Content-Type":"application/json",
                "Cookie":".ROBLOSECURITY="+ this.cookie,
                "X-CSRF-TOKEN":(this.csrf)
                }
         })
         const p = await r.json();
         if(r.status !==200)throw new Error(JSON.stringify(p))
  
           return p.data
     }
     async GetGameProductInfo(universeId){   
         if(universeId === null)throw new Error("NO UNIVERSEID PROVIDED")
         const r = await fetch(`https://games.roblox.com/v1/games/games-product-info?universeIds=${universeId}`)
         const p = await r.json();
         if(r.status !==200)throw new Error(JSON.stringify(p))
  
           return p.data[0] || p
     }
     async GetPlaceInfo(placeId){
         if(!this.cookie)throw new Error("Please initialize the client with a valid cookie before using this method.");
         if(placeId === null)throw new Error("NO PLACEID PROVIDED")
         const r = await fetch(`https://games.roblox.com/v1/games/multiget-place-details?placeIds=${placeId}`,{
             headers:{
                 "Accept":"application/json",
                 "Content-Type":"application/json",
                 "Cookie":".ROBLOSECURITY="+ this.cookie,
                 "X-CSRF-TOKEN":(this.csrf)
                 },
         })
         const p = await r.text() 
         return JSON.parse((new Array(p.replace(/\]/,"").replace(/\[/,"")))[0]) || new Error("Something went wrong. Invalid Place Id?")
     }
     async SearchGames(keyword,maxRows){
         if(keyword === null)throw new Error("NO KEYWORD PROVIDED")
         if(maxRows === null)maxRows = 1
         const r = await fetch(`https://games.roblox.com/v1/games/list?keyword=${keyword}&maxRows=${maxRows}`)
         const p = await r.json();
         if(r.status !==200)throw new Error(JSON.stringify(p))
  
           return p.games || p
     }
     async IsPlayable(universeId){
         if(universeId === null)throw new Error("NO UNIVERSEID PROVIDED")
         const r = await fetch(`https://games.roblox.com/v1/games/multiget-playability-status?universeIds=${universeId}`)
         const p = await r.json();
         return JSON.parse((new Array(p.replace(/\]/,"").replace(/\[/,"")))[0]).isPlayable
     } 
     async GetRecommendations(universeId,maxRows){
         if(universeId === null)throw new Error("NO UNIVERSEID PROVIDED")
         if(maxRows === null)maxRows = 10
         const r = await fetch(`https://games.roblox.com/v1/games/recommendations/game/${universeId}?maxRows=${maxRows}`)
         const p = await r.json();
         if(r.status !==200)throw new Error(JSON.stringify(p))

           return p.games || p
     }
     async IsFavorited(universeId){
         if(!this.cookie)throw new Error("Please initialize the client with a valid cookie before using this method.");
         if(universeId === null)throw new Error("NO UNIVERSEID PROVIDED")
         const r = await fetch(`https://games.roblox.com/v1/games/${universeId}/favorites`,{
             headers:{
                 "Accept":"application/json",
                 "Content-Type":"application/json",
                 "Cookie":".ROBLOSECURITY="+ this.cookie,
                 "X-CSRF-TOKEN":this.csrf
                 },
         })
         const p = await r.json();
         if(r.status !==200)throw new Error(JSON.stringify(p))
  
           return p.isFavorited || p
     }
     async Favorite(universeId,bool){
         if(universeId === null)throw new Error("NO UNIVERSEID PROVIDED")
         if(!this.cookie)throw new Error("Please initialize the client with a valid cookie before using this method.");
         if(bool === null)throw new Error("NO BOOL PROVIDED")
         if(typeof bool !== "boolean")throw new Error("INVALID ARGUMENT bool. EXPECTED TRUE OR FALSE.")
         const r = await fetch(`https://games.roblox.com/v1/games/${universeId}/favorites`,{
             method :"POST",
             headers:{
             "Accept":"application/json",
             "Content-Type":"application/json",
             "Cookie":".ROBLOSECURITY="+ this.cookie,
             "X-CSRF-TOKEN":(this.csrf)
             },
             body:JSON.stringify({"isFavorited":bool})
         })
         const p = await r.json();
         if(r.status !==200)throw new Error(JSON.stringify(p))
  
           return p
     }
     async GetFavoriteCount(universeId){
         if(universeId === null)throw new Error("NO UNIVERSEID PROVIDED")
         const r = await fetch(`https://games.roblox.com/v1/games/${universeId}/favorites/count`)
         const p = await r.json()
         if(r.status !==200)throw new Error(JSON.stringify(p))
  
           return p.favoritesCount || p
     }
     async GetGamepasses(universeId,limit){
         if(universeId === null)throw new Error("NO UNIVERSEID PROVIDED")
         if(limit === null)limit=10
         const r = await fetch(`https://games.roblox.com/v1/games/${universeId}/game-passes?limit=${limit}`)
         const p = await r.json()
         if(r.status !==200)throw new Error(JSON.stringify(p))
  
           return p.data
     }
     async GetUserVoteStatus(universeId){
         if(!this.cookie)throw new Error("Please initialize the client with a valid cookie before using this method.");
         if(universeId === null)throw new Error("NO UNIVERSEID PROVIDED")
         const r = await fetch(`https://games.roblox.com/v1/games/${universeId}/votes/user`)
         const p = await r.json()
         if(r.status !==200)throw new Error(JSON.stringify(p))
  
           return p.userVote // can be null if they have not voted
     }
     async VoteGame(universeId,bool){
         if(!this.cookie)throw new Error("Please initialize the client with a valid cookie before using this method.");
         if(bool === null)throw new Error("NO BOOL PROVIDED")
         if(universeId === null)throw new Error("NO UNIVERSEID PROVIDED")
         if(typeof bool !== "boolean")throw new Error("INVALID ARGUMENT bool. EXPECTED TRUE OR FALSE.")
         const r = await fetch(`https://games.roblox.com/v1/games/${universeId}/user-votes`,{
             method:"PATCH",
             headers:{
                 "Accept":"application/json",
                 "Content-Type":"application/json",
                 "Cookie":".ROBLOSECURITY="+ this.cookie,
                 "X-CSRF-TOKEN":(this.csrf)
                 },
             body:JSON.stringify({"vote":bool})
         })
         const p = await r.json();
         if(r.status !==200)throw new Error(JSON.stringify(p))
  
           return p
     }

     async CanBeInvitedToVIP(userId){
         if(!this.cookie)throw new Error("Please initialize the client with a valid cookie before using this method.");
         if(userId === null)throw new Error("NO USERID PROVIDED")
         const r = await fetch(`https://games.roblox.com/v1/vip-server/can-invite/${userId}`,{            
             headers:{
                 "Accept":"application/json",
                 "Content-Type":"application/json",
                 "Cookie":".ROBLOSECURITY="+ this.cookie,
                 "X-CSRF-TOKEN":(this.csrf)
             }
         })
         const p = await r.json();
         if(r.status !==200)throw new Error(JSON.stringify(p))
  
           return p.canInvite || p
     }
     async GetVIPServer(vipserverId){
         if(vipserverId === null)throw new Error("NO VIPSERVERID PROVIDED")
         if(!this.cookie)throw new Error("Please initialize the client with a valid cookie before using this method.");
         const r = await fetch(`https://games.roblox.com/v1/vip-servers/${vipserverId}`,{            
             headers:{
                 "Accept":"application/json",
                 "Content-Type":"application/json",
                 "Cookie":".ROBLOSECURITY="+ this.cookie,
                 "X-CSRF-TOKEN":(this.csrf)
             }
         })
         const p = await r.json();
         if(r.status !==200)throw new Error(JSON.stringify(p))
  
           return p 
     }
     async UpdateVIPServer(vipserverId,name,newJoinCode,active){
         if(vipserverId === null)throw new Error("NO VIPSERVERID PROVIDED")
         if(!this.cookie)throw new Error("Please initialize the client with a valid cookie before using this method.");
         console.log(newJoinCode)
         if(typeof newJoinCode!== "boolean")throw new Error("INVALID ARGUMENT newJoinCode. EXPECTED TRUE OR FALSE.")
         if(typeof active!== "boolean")throw new Error("INVALID ARGUMENT active. EXPECTED TRUE OR FALSE.")
 
         const r = await fetch(`https://games.roblox.com/v1/vip-servers/${vipserverId}`,{   
             method:"PATCH",         
             headers:{
                 "Accept":"application/json",
                 "Content-Type":"application/json",
                 "Cookie":".ROBLOSECURITY="+ this.cookie,
                 "X-CSRF-TOKEN":(this.csrf)
             },
             body:JSON.stringify({"name":name,"newJoinCode":newJoinCode,"active":active})
         })
         const p = await r.json();
         if(r.status !==200)throw new Error(JSON.stringify(p))
  
           return p 
     }
     async PurchaseVIPServer(universeId,name,expectedPrice){
         if(universeId === null)throw new Error("NO UNIVERSEID PROVIDED")
         if(name === null)throw new Error("NO NAME PROVIDED")
         if(expectedPrice === null)throw new Error("NO EXPECTEDPRICE PROVIDED")
         if(!this.cookie)throw new Error("Please initialize the client with a valid cookie before using this method.");
 
 
         const r = await fetch(`https://games.roblox.com/v1/games/vip-servers/${universeId}`,{
             method:"POST",
             body:JSON.stringify({"name":name,"expectedPrice":parseInt(expectedPrice)}),
             headers:{
                 "Accept":"application/json",
                 "Content-Type":"application/json",
                 "Cookie":".ROBLOSECURITY="+ this.cookie,
                 "X-CSRF-TOKEN":(this.csrf)
             }
         })
         const p = await r.json();
         if(r.status !==200)throw new Error(JSON.stringify(p))
  
           return p
     }
     async UpdateVIPSubscription(vipServerId,active,price){
         if(!this.cookie)throw new Error("Please initialize the client with a valid cookie before using this method.");
 
         if(vipServerId === null)throw new Error("NO VIPSERVERID PROVIDED")
         if(price === null)throw new Error("NO PRICE PROVIDED")
         if(typeof active!== "boolean")throw new Error("INVALID ARGUMENT active. EXPECTED TRUE OR FALSE.")
         const r = await fetch(`https://games.roblox.com/v1/vip-servers/${vipServerId}/subscription`,{
             method:"PATCH",
             body:JSON.stringify({"active":active,"price":parseInt(price)}),
             headers:{
                 "Accept":"application/json",
                 "Content-Type":"application/json",
                 "Cookie":".ROBLOSECURITY="+ this.cookie,
                 "X-CSRF-TOKEN":(this.csrf)
             },
         })
         const p = await r.json();
         if(r.status !==200)throw new Error(JSON.stringify(p))
  
           return p
     }
     async UpdateUserStatus(userId,newStatus){
         if(!this.cookie)throw new Error("Please initialize the client with a valid cookie before using this method.");
        
         if(userId === null)throw new Error("NO USERID PROVIDED")
         if(newStatus === null)throw new Error("NO NEWSTATUS PROVIDED")
         const r = await fetch(`https://users.roblox.com/v1/users/${userId}/status`,{
             method:"PATCH",
             body:JSON.stringify({"status":newStatus}),
             headers:{
                 "Accept":"application/json",
                 "Content-Type":"application/json",
                 "Cookie":".ROBLOSECURITY="+ this.cookie,
                 "X-CSRF-TOKEN":(this.csrf)
             },
         })
         const p = await r.json();
         if(r.status !==200)throw new Error(JSON.stringify(p))
  
           return p.status || p
     }
     async GetUserStatus(userId){
         if(userId === null)throw new Error("NO USERID PROVIDED")
         const r = await fetch(`https://users.roblox.com/v1/users/${userId}/status`)
         const p = await r.json();
         if(r.status !==200)throw new Error(JSON.stringify(p))
  
           return p.status || p
     }
     async SearchUsers(keyword,limit){
         if(keyword === null)throw new Error("NO KEYWORD PROVIDED")
         if(limit === null)limit = 10
         const r = await fetch(`https://users.roblox.com/v1/users/search?keyword=${keyword}&limit=${limit}`)
         const p = await r.json();
         if(r.status !==200)throw new Error(JSON.stringify(p))
  
           return p.data
     }
     async GetUserUsernameHistory(userId,limit){
         if(userId === null)throw new Error("NO USERID PROVIDED")
         if(limit === null)throw new Error("NO LIMIT PROVIDED")
         const r = await fetch(`https://users.roblox.com/v1/users/${userId}/username-history?limit=${limit}`)
         const p = await r.json();
         if(r.status !==200)throw new Error(JSON.stringify(p))
  
           return p.data
     }
     async GetAvatarImage(userId,size){
         if(userId === null)throw new Error("NO USERID PROVIDED")
         if(size === null)throw new Error("NO SIZE PROVIDED.")
         const r = await fetch(`https://thumbnails.roblox.com/v1/users/avatar?userIds=${userId}&size=${size}x${size}&format=png`)
         const p = await r.json();
         if(r.status !==200)throw new Error(JSON.stringify(p))
  
           return p.data ? p.data[0].imageUrl : p
     }
     async GetAvatarHeadshot(userId,size,isCircular){
         if(userId === null)throw new Error("NO USERID PROVIDED")
         if(size === null)throw new Error("NO SIZE PROVIDED.")
         if(isCircular === null)isCircular = false
         if(typeof isCircular!== "boolean")throw new Error("INVALID ARGUMENT isCircular. EXPECTED TRUE OR FALSE.")
         const r = await fetch(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=${size}x${size}&format=Png&isCircular=${isCircular}`)
         const p = await r.json();
         if(r.status !==200)throw new Error(JSON.stringify(p))
  
           return p.data ? p.data[0].imageUrl : p
     }
     async GetOutfits(userId){
         if(userId === null)throw new Error("NO USERID PROVIDED")
         const r = await fetch(`https://avatar.roblox.com/v1/users/${userId}/outfits`)
         const p = await r.json();
         if(r.status !==200)throw new Error(JSON.stringify(p))
        
           return p.data  
     }
     async GetAvatarRules(){
         const r = await fetch(`https://avatar.roblox.com/v1/avatar-rules`)
         const p = await r.json();
         if(r.status !==200)throw new Error(JSON.stringify(p))
  
           return p
     }
     async GetAvatarInfo(userId){
         if(userId === null)throw new Error("NO USERID PROVIDED")
         const r = await fetch(`https://avatar.roblox.com/v1/users/${userId}/avatar`)
         const p = await r.json();
         if(r.status !==200)throw new Error(JSON.stringify(p))
  
           return p
     }
     async RemoveAssetFromAvatar(assetId){
         if(!this.cookie)throw new Error("Please initialize the client with a valid cookie before using this method.");
         if(assetId === null)throw new Error("NO ASSETID PROVIDED")
         const r = await fetch(`https://avatar.roblox.com/v1/avatar/assets/${assetId}/remove`,{
             method:"POST",
             headers:{
                 "Accept":"application/json",
                 "Content-Type":"application/json",
                 "Cookie":".ROBLOSECURITY="+ this.cookie,
                 "X-CSRF-TOKEN":(this.csrf)
             }
         })
         const p = await r.json();
         if(r.status !==200)throw new Error(JSON.stringify(p))
  
           return p.success || p
     }
     async WearAssetForAvatar(assetId){
         if(!this.cookie)throw new Error("Please initialize the client with a valid cookie before using this method.");
         if(assetId === null)throw new Error("NO ASSETID PROVIDED")
         const r = await fetch(`https://avatar.roblox.com/v1/avatar/assets/${assetId}/wear`,{
             method:"POST",
             headers:{
                 "Accept":"application/json",
                 "Content-Type":"application/json",
                 "Cookie":".ROBLOSECURITY="+ this.cookie,
                 "X-CSRF-TOKEN":(this.csrf)
             }
         })
         const p = await r.json();
         if(r.status !==200)throw new Error(JSON.stringify(p))
  
           return p.success || p
     }
     async RedrawThumbnail(){
         if(!this.cookie)throw new Error("Please initialize the client with a valid cookie before using this method.");
         const r = await fetch(`https://avatar.roblox.com/v1/avatar/redraw-thumbnail`,{
             method:"POST",
             headers:{
                 "Accept":"application/json",
                 "Content-Type":"application/json",
                 "Cookie":".ROBLOSECURITY="+ this.cookie,
                 "X-CSRF-TOKEN":(this.csrf)
             }
         })
         const p = await r.json();
         if(r.status !==200)throw new Error(JSON.stringify(p))
  
           return p
     }
     async SetAvatarRig(type){
         if(!this.cookie)throw new Error("Please initialize the client with a valid cookie before using this method.");
         if(type === null)throw new Error("NO TYPE OF NEW RIG PROVIDED")
         const r = await fetch(`https://avatar.roblox.com/v1/avatar/set-player-avatar-type`,{
             method:"POST",
             headers:{
                 "Accept":"application/json",
                 "Content-Type":"application/json",
                 "Cookie":".ROBLOSECURITY="+ this.cookie,
                 "X-CSRF-TOKEN":(this.csrf)
             },
             body:JSON.stringify({"playerAvatarType":type})
         })
         const p = await r.json();
         if(r.status !==200)throw new Error(JSON.stringify(p))
  
           return p.success || p
     }
     async SetAvatarScales(height,width,{head,depth,proportion,bodyType}){
         if(!this.cookie)throw new Error("Please initialize the client with a valid cookie before using this method.");
         if(height === null)throw new Error("HEIGHT MUST BE PROVIDED")
         if(width === null)throw new Error("WIDTH MUST BE PROVIDED")
         const r = await fetch(`https://avatar.roblox.com/v1/avatar/set-scales`,{
             method:"POST",
             headers:{
                 "Accept":"application/json",
                 "Content-Type":"application/json",
                 "Cookie":".ROBLOSECURITY="+ this.cookie,
                 "X-CSRF-TOKEN":(this.csrf)
             },
             body:JSON.stringify({"height":parseInt(height),"width":parseInt(width),"head":parseInt(head),"depth":parseInt(depth),"proportion":parseInt(proportion),"bodyType":bodyType})
         })
         const p = await r.json();
         if(r.status !==200)throw new Error(JSON.stringify(p))
  
           return p.success || p
     }
     async GetResellers(assetId,limit){
         if(!this.cookie)throw new Error("Please initialize the client with a valid cookie before using this method.");
         if(assetId === null)throw new Error("NO ASSETID PROVIDED")
         if(limit === null)limit=10
         const r = await fetch(`https://economy.roblox.com/v1/assets/${assetId}/resellers?limit=${limit}`,{
             headers:{
                 "Accept":"application/json",
                 "Content-Type":"application/json",
                 "Cookie":".ROBLOSECURITY="+ this.cookie,
                 "X-CSRF-TOKEN":(this.csrf)
             },
         })
         const p = await r.json();
         if(r.status !==200)throw new Error(JSON.stringify(p))
  
           return p.data 
     }
     async GroupPayout(groupId,targetId,amount){
         if(!this.cookie)throw new Error("Please initialize the client with a valid cookie before using this method.");
         if(groupId === null)throw new Error("NO GROUPID PROVIDED")
         if(targetId === null)throw new Error("NO TARGET USERID PROVIDED")
         if(amount === null)throw new Error("NO AMOUNT PROVIDED")
         const r = await fetch(`https://groups.roblox.com/v1/groups/${groupId}/payouts`,{
             method:"POST",
             headers:{
                 "Accept":"application/json",
                 "Content-Type":"application/json",
                 "Cookie":".ROBLOSECURITY="+ this.cookie,
                 "X-CSRF-TOKEN":(this.csrf)
             },
             body:JSON.stringify({
                 "PayoutType": "FixedAmount",
                 "Recipients": [
                   {
                     "recipientId": parseInt(targetId),
                     "recipientType": "User",
                     "amount": parseInt(amount)
                   }
                 ]
               })
         })
         const p = await r.json();
         if(r.status !==200)throw new Error(JSON.stringify(p))
  
           return p
     }
     async ClaimGroupOwnership(groupId){
         if(!this.cookie)throw new Error("Please initialize the client with a valid cookie before using this method.");
         if(groupId === null)throw new Error("NO GROUPID PROVIDED")
         const r= await fetch(`https://groups.roblox.com/v1/groups/${groupId}/claim-ownership`,{
             method:"POST",
             headers:{
                 "Accept":"application/json",
                 "Content-Type":"application/json",
                 "Cookie":".ROBLOSECURITY="+ this.cookie,
                 "X-CSRF-TOKEN":(this.csrf)
             },
         })
         const p = await r.json();
         if(r.status !==200)throw new Error(JSON.stringify(p))
  
           return p
     }
     async ChangeGroupOwner(groupId,newOwnerUserId){
         if(!this.cookie)throw new Error("Please initialize the client with a valid cookie before using this method.");
         if(groupId === null)throw new Error("NO GROUPID PROVIDED")
         if(newOwnerUserId === null)throw new Error("NO NEW OWNER SPECIFIED")
         const r = await fetch(`https://groups.roblox.com/v1/groups/${groupId}/change-owner`,{
             method:"POST",
             headers:{
                 "Accept":"application/json",
                 "Content-Type":"application/json",
                 "Cookie":".ROBLOSECURITY="+ this.cookie,
                 "X-CSRF-TOKEN":(this.csrf)
             },
             body:JSON.stringify({"userId":parseInt(newOwnerUserId)})
         })
         const p = await r.json()
         if(r.status !==200)throw new Error(JSON.stringify(p))
  
           return p
     }
     async GetGroupInfo(groupId){
         if(!this.cookie)throw new Error("Please initialize the client with a valid cookie before using this method.");
         if(groupId === null)throw new Error("NO GROUPID PROVIDED")
         const r = await fetch(`https://groups.roblox.com/v1/groups/${groupId}`)
         const p = await r.json()
         if(r.status !==200)throw new Error(JSON.stringify(p))
         return p
     }
     async GetGroupFunds(groupId){
         if(!this.cookie)throw new Error("Please initialize the client with a valid cookie before using this method.");
         if(groupId === null)throw new Error("NO GROUPID PROVIDED")
         const r = await fetch(`https://economy.roblox.com/v1/groups/${groupId}/currency`,{
             headers:{
                 "Accept":"application/json",
                 "Content-Type":"application/json",
                 "Cookie":".ROBLOSECURITY="+ this.cookie,
                 "X-CSRF-TOKEN":(this.csrf)
             },
         })
         const p = await r.json()
         if(r.status !==200)throw new Error(JSON.stringify(p))
         return p.robux
     }
     async CreateGroup({name,description,publicGroup,buildersClubMembersOnly,icon}){
         if(!this.cookie)throw new Error("Please initialize the client with a valid cookie before using this method.");
         if(name === null)throw new Error("NO NAME PROVIDED")
         if(description === null)throw new Error("NO DESCRIPTION PROVIDED")
         if(publicGroup === null)publicGroup = true;
         if(buildersClubMembersOnly === null)buildersClubMembersOnly = false;
         if(icon === null) throw new Error("NO ICON SPECIFIED");
         const r = await fetch(`https://groups.roblox.com/v1/groups/create`,{
             method:"POST",
             headers:{
                 "Accept":"application/json",
                 "Content-Type":"application/json",
                 "Cookie":".ROBLOSECURITY="+ this.cookie,
                 "X-CSRF-TOKEN":(this.csrf)
             },
             body:JSON.stringify({"name":name,"description":description,"publicGroup":publicGroup,"buildersClubMembersOnly":buildersClubMembersOnly,"files":icon})
         })
         const p = await r.json()
         if(r.status !==200)throw new Error(JSON.stringify(p))
         return p
     }
     async UpdateGroupDescription(groupId,description){
         if(!this.cookie)throw new Error("Please initialize the client with a valid cookie before using this method.");
         if(groupId === null)throw new Error("NO GROUPID PROVIDED")
         if(description === null)throw new Error("NO NEW DESCRIPTION PROVIDED")
         const r = await fetch(`https://groups.roblox.com/v1/groups/${groupId}/description`,{
             method:"PATCH",
             headers:{
                 "Accept":"application/json",
                 "Content-Type":"application/json",
                 "Cookie":".ROBLOSECURITY="+ this.cookie,
                 "X-CSRF-TOKEN":(this.csrf)
             },
             body:JSON.stringify({"description":description})
         })
         const p = await r.json()
         if(r.status !==200)throw new Error(JSON.stringify(p))
         return p.newDescription
     }
     async UpdateGroupStatus(groupId,status){
         if(!this.cookie)throw new Error("Please initialize the client with a valid cookie before using this method.");
         if(groupId === null)throw new Error("NO GROUPID PROVIDED")
         if(status === null)throw new Error("NO STATUS PROVIDED")
         const r = await fetch(`https://groups.roblox.com/v1/groups/${groupId}/status`,{
             method:"PATCH",
             headers:{
                 "Accept":"application/json",
                 "Content-Type":"application/json",
                 "Cookie":".ROBLOSECURITY="+ this.cookie,
                 "X-CSRF-TOKEN":(this.csrf)
             },
             body:JSON.stringify({"message":status})
         })
         const p = await r.json()
         if(r.status !==200)throw new Error(JSON.stringify(p))
         return p.body;
     }
     async UpdateGroupIcon(groupId,newIcon){
         if(!this.cookie)throw new Error("Please initialize the client with a valid cookie before using this method.");
         if(groupId === null)throw new Error("NO GROUPID PROVIDED")
         if(newIcon === null)throw new Error("NO NEW ICON FILE PROVIDED")
         const r = await fetch(`https://groups.roblox.com/v1/groups/icon?groupId=${groupId}`,{
             method:"PATCH",
             headers:{
                 "Accept":"application/json",
                 "Content-Type":"application/json",
                 "Cookie":".ROBLOSECURITY="+ this.cookie,
                 "X-CSRF-TOKEN":(this.csrf)
             },
             body:JSON.stringify({"files":newIcon})
         })
         const p = await r.json()
         if(r.status !==200)throw new Error(JSON.stringify(p))
         return p;
     }
     async SetRole(userId,groupId,roleId){
         if(!this.cookie)throw new Error("Please initialize the client with a valid cookie before using this method.");
         if(groupId === null)throw new Error("NO GROUPID PROVIDED")
         if(userId === null)throw new Error("NO USERID PROVIDED")
         const r = await fetch(`https://groups.roblox.com/v1/groups/${groupId}/users/${userId}`,{
             method:"PATCH",
             headers:{
                 "Accept":"application/json",
                 "Content-Type":"application/json",
                 "Cookie":".ROBLOSECURITY="+ this.cookie,
                 "X-CSRF-TOKEN":(this.csrf)
             },
             body:JSON.stringify({"roleId":parseInt(roleId)})
         })
         const p = await r.json()
         if(r.status !==200)throw new Error(JSON.stringify(p))
         return p;
     }
     async GetRoles(groupId){
         if(groupId === null)throw new Error("NO GROUPID PROVIDED")
         const r = await fetch(`https://groups.roblox.com/v1/groups/${groupId}/roles`)
         const p = await r.json()
         if(r.status !==200)throw new Error(JSON.stringify(p))
         return p.roles;
     }
     async GetSocialLinks(groupId){
         if(groupId === null)throw new Error("NO GROUPID PROVIDED")
         const r = await fetch(`https://groups.roblox.com/v1/groups/${groupId}/social-links`)
         const p = await r.json()
         if(r.status !==200)throw new Error(JSON.stringify(p))
         return p.data
     }
     async SearchGroups(keyword,limit){
         if(keyword === null)throw new Error("NO KEYWORD PROVIDED")
         if(limit === null)limit = 10
         const r = await fetch(`https://groups.roblox.com/v1/groups/search?keyword=${keyword}&limit=${limit}`)
         const p = await r.json();
         if(r.status !==200)throw new Error(JSON.stringify(p))
         return p.data
     }
     async SearchForGroup(groupName){
         if(groupName === null)throw new Error("NO GROUP NAME PROVIDED")
         const r = await fetch(`https://groups.roblox.com/v1/groups/search/lookup?groupName=${groupName}`)
         const p = await r.json();
         if(r.status !==200)throw new Error(JSON.stringify(p))
         return p.data[0]
     }
     async SetPrimaryGroup(groupId){
         if(!this.cookie)throw new Error("Please initialize the client with a valid cookie before using this method.")
         if(groupId === null)throw new Error("NO GROUPID PROVIDED")
         const r = await fetch(`https://groups.roblox.com/v1/user/groups/primary`,{
             method:"POST",
             headers:{
                 "Accept":"application/json",
                 "Content-Type":"application/json",
                 "Cookie":".ROBLOSECURITY="+ this.cookie,
                 "X-CSRF-TOKEN":(this.csrf)
             },
             body:JSON.stringify({"groupId":parseInt(groupId)})
         })
         const p = await r.json();
         if(r.status !==200)throw new Error(JSON.stringify(p))
         return p
     }
     // asset types CANNOT include GamePass and Badges.
     async GetUserInventory(userId,assetTypes,limit){
         if(userId === null)throw new Error("NO USERID PROVIDED")
         if(assetTypes === null)throw new Error("NO ASSET TYPES PROVIDED")
         if(limit === null)limit = 10;
         const r = await fetch(`https://inventory.roblox.com/v2/users/${userId}/inventory?assetTypes=${assetTypes.join(",")}&limit=${limit}`)
         const p = await r.json();
         if(r.status !==200)throw new Error(JSON.stringify(p))
         return p.data
 
     }
     async GetCollectibles(userId,assetType,limit){
 
         if(userId === null)throw new Error("NO USERID PROVIDED")
         if(assetType === null)throw new Error("NO ASSET TYPE PROVIDED")
         if(limit === null)limit = 10;
         const r = await fetch(`https://inventory.roblox.com/v1/users/${userId}/assets/collectibles?assetType=${assetType}&limit=${limit}`)
         const p = await r.json();
         if(r.status !==200)throw new Error(JSON.stringify(p))
         return p.data
     }
     async SendTrade(targetUserId,sendingOffer,receivingOffer){
        if(!this.cookie)throw new Error("Please initialize the client with a valid cookie before using this method.")
        if(targetUserId === null)throw new Error("NO TARGET USER ID PROVIDED")
        if(sendingOffer.userAssetIds === null)throw new Error("Please provide asset ids in the sending offer like: {userAssetIds:[\"1\",\"2\"]}")
        if(!receivingOffer.userAssetIds === null)throw new Error("Please provide asset ids in the receiving offer like: {userAssetIds:[\"1\",\"2\"]}")
        if(sendingOffer.robux === null){
            sendingOffer.robux = 0
        }
        if(receivingOffer.robux === null){
            receivingOffer.robux = 0
        }
        const r = await fetch(`https://trades.roblox.com/v1/trades/send`,{
            method:"POST",
            headers:{
                "Accept":"application/json",
                "Content-Type":"application/json",
                "Cookie":".ROBLOSECURITY="+ this.cookie,
                "X-CSRF-TOKEN":(this.csrf)
            },
            body:JSON.stringify({
                "offers":[
                    {
                        "userId": parseInt(targetUserId),
                        ... receivingOffer
                    },
                    {
                        "userId":this.UserId,
                        ... sendingOffer
                    }
                ]
            })
        })
        const p = await r.json();
        if(r.status !==200)throw new Error(JSON.stringify(p))
        return p.id //trade id
    }
    async CanTradeWith(userId){
        if(!this.cookie)throw new Error("Please initialize the client with a valid cookie before using this method.")
        if(userId === null)throw new Error("NO USERID PROVIDED")
        const r = await fetch(`https://trades.roblox.com/v1/users/${userId}/can-trade-with`,{
            headers:{
                "Accept":"application/json",
                "Content-Type":"application/json",
                "Cookie":".ROBLOSECURITY="+ this.cookie,
                "X-CSRF-TOKEN":(this.csrf)
            }
        })
        const p = await r.json();
        if(r.status !==200)throw new Error(JSON.stringify(p))
        return p.canTrade
    }
    async AcceptTrade(tradeId){
        if(!this.cookie)throw new Error("Please initialize the client with a valid cookie before using this method.")
        if(tradeId === null)throw new Error("NO TRADE ID PROVIDED")
        const r = await fetch(`https://trades.roblox.com/v1/trades/${tradeId}/accept`,{
            method:"POST",
            headers:{
                "Accept":"application/json",
                "Content-Type":"application/json",
                "Cookie":".ROBLOSECURITY="+ this.cookie,
                "X-CSRF-TOKEN":(this.csrf)
            }
        })
        const p = await r.json();
        if(r.status !==200)throw new Error(JSON.stringify(p))
        return p
    }
    async DeclineTrade(tradeId){
        if(!this.cookie)throw new Error("Please initialize the client with a valid cookie before using this method.")
        if(tradeId === null)throw new Error("NO TRADE ID PROVIDED")
        const r = await fetch(`https://trades.roblox.com/v1/trades/${tradeId}/decline`,{
            method:"POST",
            headers:{
                "Accept":"application/json",
                "Content-Type":"application/json",
                "Cookie":".ROBLOSECURITY="+ this.cookie,
                "X-CSRF-TOKEN":(this.csrf)
            }
        })
        const p = await r.json();
        if(r.status !==200)throw new Error(JSON.stringify(p))
        return p
    }
    async GetTradeInfo(tradeId){
        if(!this.cookie)throw new Error("Please initialize the client with a valid cookie before using this method.")
        if(tradeId === null)throw new Error("NO TRADE ID PROVIDED")
        const r = await fetch(`https://trades.roblox.com/v1/trades/${tradeId}`,{
            headers:{
                "Accept":"application/json",
                "Content-Type":"application/json",
                "Cookie":".ROBLOSECURITY="+ this.cookie,
                "X-CSRF-TOKEN":(this.csrf)
            }

        })
        const p = await r.json();
        if(r.status !==200)throw new Error(JSON.stringify(p))
        return p
    }
    async SendPrivateMessage(recipientId,subject,body){
        if(!this.cookie)throw new Error("Please initialize the client with a valid cookie before using this method.")
        if(recipientId === null)throw new Error("NO RECIPIENT ID PROVIDED")
        if(subject === null)throw new Error("NO MESSAGE SUBJECT PROVIDED")
        if(body === null )throw new Error("NO MESSAGE BODY PROVIDED")
        const r = await fetch(`https://privatemessages.roblox.com/v1/messages/send`,{
            method:"POST",
            headers:{
                "Accept":"application/json",
                "Content-Type":"application/json",
                "Cookie":".ROBLOSECURITY="+ this.cookie,
                "X-CSRF-TOKEN":(this.csrf)
            },
            body:JSON.stringify({
                "userId": this.UserId,
                "subject": subject,
                "body": body,
                "recipientId": parseInt(recipientId),
            })
        })
        const p = await r.json();
        if(r.status !==200)throw new Error(JSON.stringify(p))
        return p.success
    }
    async SendChatMessage(coversationId,message){
        if(!this.cookie)throw new Error("Please initialize the client with a valid cookie before using this method.")
        if(coversationId === null)throw new Error("NO CONVERSATION ID PROVIDED")
        if(message === null)throw new Error("NO MESSAGE PROVIDED")
        const r = await fetch(`https://chat.roblox.com/v2/send-message`,{
            method:"POST",
            headers:{
                "Accept":"application/json",
                "Content-Type":"application/json",
                "Cookie":".ROBLOSECURITY="+ this.cookie,
                "X-CSRF-TOKEN":(this.csrf)
            },
            body:JSON.stringify({
                "message":message,
                "conversationId":parseInt(conversationId)
            })
        })
        const p = await r.json();
        if(r.status !==200)throw new Error(JSON.stringify(p))
        return p.resultType
    }
    async CreateChatWithUser(participantUserId){
        if(!this.cookie)throw new Error("Please initialize the client with a valid cookie before using this method.")
        if(participantUserId === null)throw new Error("NO PARTICIPANT USER ID PROVIDED")
        const r = await fetch(`https://chat.roblox.com/v2/start-one-to-one-conversation`,{
            method:"POST",
            headers:{
                "Accept":"application/json",
                "Content-Type":"application/json",
                "Cookie":".ROBLOSECURITY="+ this.cookie,
                "X-CSRF-TOKEN":(this.csrf)
            },
            body:JSON.stringify({
                "participantUserId":parseInt(participantUserId)
            })
        })
        const p = await r.json();
        if(r.status !==200)throw new Error(JSON.stringify(p))
        return p.conversation
    }
    async CreateGroupChat(title,participantIds){
        if(title === null)throw new Error("NO TITLE PROVIDED")
        if(!this.cookie)throw new Error("Please initialize the client with a valid cookie before using this method.")
        if(participantUserIds === null)throw new Error("NO PARTICIPANT USER IDS PROVIDED")
        const r = await fetch(`https://chat.roblox.com/v2/start-group-conversation`,{
            method:"POST",
            headers:{
                "Accept":"application/json",
                "Content-Type":"application/json",
                "Cookie":".ROBLOSECURITY="+ this.cookie,
                "X-CSRF-TOKEN":(this.csrf)
            },
            body:JSON.stringify({
                    "participantUserIds":participantIds,
                    "title": title
            })
        })
        const p = await r.json();
        if(r.status !==200)throw new Error(JSON.stringify(p))
        return p.resultType
    }
    async AddToGroupChat(conversationId,participantIds){
        if(!this.cookie)throw new Error("Please initialize the client with a valid cookie before using this method.")
        if(participantIds === null)throw new Error("NO PARTICIPANT USER IDS PROVIDED")
        if(conversationId === null)throw new Error("NO CONVERSATION ID PROVIDED")
        const r = await fetch(`https://chat.roblox.com/v2/add-to-conversation`,{
            method:"POST",
            headers:{
                "Accept":"application/json",
                "Content-Type":"application/json",
                "Cookie":".ROBLOSECURITY="+ this.cookie,
                "X-CSRF-TOKEN":(this.csrf)
            },
            body:JSON.stringify({
                    "participantUserIds":participantIds,
                    "conversationId":parseInt(conversationId)
            })
        })
        const p = await r.json();
        if(r.status !==200)throw new Error(JSON.stringify(p))
        return p.resultType
    }
    async RemoveUserFromGroupChat(participantUserId,conversationId){
        if(conversationId === null)throw new Error("NO CONVERSATION ID PROVIDED")
        if(!this.cookie)throw new Error("Please initialize the client with a valid cookie before using this method.")
        if(participantUserId === null)throw new Error("NO PARTICIPANT USER ID PROVIDED")
        const r = await fetch(`https://chat.roblox.com/v2/remove-from-conversation`,{
            method:"POST",
            headers:{
                "Accept":"application/json",
                "Content-Type":"application/json",
                "Cookie":".ROBLOSECURITY="+ this.cookie,
                "X-CSRF-TOKEN":(this.csrf)
            },
            body:JSON.stringify({
                "conversationId":parseInt(conversationId),
                "participantUserId":parseInt(participantUserId)
            })
        })
        const p = await r.json();
        if(r.status !==200)throw new Error(JSON.stringify(p))
        return p.resultType
    }
    async RenameGroupChat(conversationId,newTitle){
        if(conversationId === null)throw new Error("NO CONVERSATION ID PROVIDED")
        if(!this.cookie)throw new Error("Please initialize the client with a valid cookie before using this method.")
        if(newTitle === null)throw new Error("NO NEW TITLE PROVIDED")
        const r = await fetch(`https://chat.roblox.com/v2/rename-group-conversation`,{
            method:"POST",
            headers:{
                "Accept":"application/json",
                "Content-Type":"application/json",
                "Cookie":".ROBLOSECURITY="+ this.cookie,
                "X-CSRF-TOKEN":(this.csrf)
            },
            body:JSON.stringify({
                "conversationId":parseInt(conversationId),
                "newTitle":newTitle
            })
        })
        const p = await r.json();
        if(r.status !==200)throw new Error(JSON.stringify(p))
        return p.resultType
    }
    async SetConversationUniverse(conversationId,universeId){
        if(!this.cookie)throw new Error("Please initialize the client with a valid cookie before using this method.")
        if(conversationId === null)throw new Error("NO CONVERSATION ID PROVIDED")
        if(universeId === null)throw new Error("NO UNIVERSE ID PROVIDED")
        const r = await fetch(`https://chat.roblox.com/v2/set-conversation-universe`,{
            method:"POST",
            headers:{
                "Accept":"application/json",
                "Content-Type":"application/json",
                "Cookie":".ROBLOSECURITY="+ this.cookie,
                "X-CSRF-TOKEN":(this.csrf)
            },
            body:JSON.stringify({
                "conversationId":parseInt(conversationId),
                "universeId":parseInt(universeId)
            })
        })
        const p = await r.json();
        if(r.status !==200)throw new Error(JSON.stringify(p))
        return p.statusMessage
    }
    async ResetConversationUniverse(conversationId){
        if(!this.cookie)throw new Error("Please initialize the client with a valid cookie before using this method.")
        if(conversationId === null)throw new Error("NO CONVERSATION ID PROVIDED")
        const r = await fetch(`https://chat.roblox.com/v2/reset-conversation-universe`,{
            method:"POST",
            headers:{
                "Accept":"application/json",
                "Content-Type":"application/json",
                "Cookie":".ROBLOSECURITY="+ this.cookie,
                "X-CSRF-TOKEN":(this.csrf)
            },
            body:JSON.stringify({
                "conversationId":parseInt(conversationId),
            })
        })
        const p = await r.json();
        if(r.status !==200)throw new Error(JSON.stringify(p))
        return p.statusMessage
    }
    async GetPlacesFromUniverse(universeId,limit){
        if(universeId===null)throw new Error("NO UNIVERSEID PROVIDED")
        if(limit === null)limit = 10;
        const r = await fetch(`https://develop.roblox.com/v1/universes/${universeId}/places?limit=${limit}`)
        const p = await r.json();
        if(r.status !==200)throw new Error(JSON.stringify(p))
        return p.data
    }
    // make public
    async ActivateUniverse(universeId){
        if(!this.cookie)throw new Error("Please initialize the client with a valid cookie before using this method.")
        if(universeId===null)throw new Error("NO UNIVERSEID PROVIDED")
        const r = await fetch(`https://develop.roblox.com/v1/universes/${universeId}/activate`,{
            method:"POST",
            headers:{
                "Accept":"application/json",
                "Content-Type":"application/json",
                "Cookie":".ROBLOSECURITY="+ this.cookie,
                "X-CSRF-TOKEN":(this.csrf)
            },
        })
        const p = await r.json();
        if(r.status !==200)throw new Error(JSON.stringify(p))
        return p
    }
    // make private
    async DectivateUniverse(universeId){
        if(!this.cookie)throw new Error("Please initialize the client with a valid cookie before using this method.")
        if(universeId===null)throw new Error("NO UNIVERSEID PROVIDED")
        const r = await fetch(`https://develop.roblox.com/v1/universes/${universeId}/deactivate`,{
            method:"POST",
            headers:{
                "Accept":"application/json",
                "Content-Type":"application/json",
                "Cookie":".ROBLOSECURITY="+ this.cookie,
                "X-CSRF-TOKEN":(this.csrf)
            },
        })
        const p = await r.json();
        if(r.status !==200)throw new Error(JSON.stringify(p))
        return p
    }
    async CreateDeveloperProduct(universeId,name,description,price,iconAssetId){
        if(!this.cookie)throw new Error("Please initialize the client with a valid cookie before using this method.")
        if(universeId===null)throw new Error("NO UNIVERSEID PROVIDED")
        if(name===null)throw new Error("NO NAME PROVIDED")
        if(description===null)throw new Error("NO DESCRIPTION PROVIDED")
        if(price===null)price=0
        iconAssetId = iconAssetId ? "&iconImageAssetId="+iconAssetId :""
        const r = await fetch(`https://develop.roblox.com/v1/universes/${universeId}/developerproducts?name=${name}&description=${description}&priceInRobux=${price}${iconAssetId}`,{
            method:"POST",
            headers:{
                "Accept":"application/json",
                "Content-Type":"application/json",
                "Cookie":".ROBLOSECURITY="+ this.cookie,
                "X-CSRF-TOKEN":(this.csrf)
            },
        })
        const p = await r.json();
        if(r.status !==200)throw new Error(JSON.stringify(p))
        return p
    }
    async UserOwnsGamepass(userId,gamePassId){
        if(userId === null)throw new Error("NO USERID PROVIDED")
        if(gamePassId === null)throw new Error("NO GAMEPASS ID PROVIDED")
        const r = await fetch(`https://inventory.roblox.com/v1/users/${userId}/items/GamePass/${gamePassId}`)
        const p = await r.json();
        if(r.status !==200)throw new Error(JSON.stringify(p))
        return p.data.length > 0 ? true : false
    }    
    async GetBundleInfo(bundleId){
        if(bundleId === null)throw new Error("NO BUNDLEID PROVIDED")
        const r = await fetch(`https://catalog.roblox.com/v1/bundles/${bundleId}/details`)
        const p = await r.json();
        if(r.status !==200)throw new Error(JSON.stringify(p))
        return p
    }
    async PurchaseAsset(assetId){
        if(!this.cookie)throw new Error("Please initialize the client with a valid cookie before using this method.")
        if(assetId === null)throw new Error("NO ASSETID PROVIDED")
        const mybal = await this.GetBalance();
        const assetInfo = (await this.GetAssetInfo(assetId))
        let price = assetInfo.PriceInRobux
        if(price === null)price = 0;
        if(price > mybal)throw new Error(`The asset costs ${price} and you have ${mybal} so you cannot purchase this.`)
        const creatorId = assetInfo.Creator.Id;
        const productid = assetInfo.ProductId
        const r = await fetch(`https://economy.roblox.com/v1/purchases/products/${productid}`,{
            method:"POST",
            headers:{
                "Accept":"application/json",
                "Content-Type":"application/json",
                "Cookie":".ROBLOSECURITY="+ this.cookie,
                "X-CSRF-TOKEN":(this.csrf)
            },
            body:JSON.stringify({
                "expectedSellerId":creatorId,
                "expectedCurrency":1,
                "expectedPrice":price
            })
        })
        const p = await r.json();
        if(r.status !==200)throw new Error(JSON.stringify(p))
        return p.reason 
    }
    async GetGameSocialLinks(universeId){
        if(universeId === null)throw new Error("NO UNIVERSEID PROVIDED")
        const r = await fetch(`https://games.roblox.com/v1/games/${universeId}/social-links/list`,{
            headers:{
                "Accept":"application/json",
                "Content-Type":"application/json",
                "Cookie":".ROBLOSECURITY="+ this.cookie,
                "X-CSRF-TOKEN":(this.csrf)
            }
        })
        const p = await r.json();
        if(r.status !==200)throw new Error(JSON.stringify(p))
        return p.data
    }
    async GetGroupTransactions(groupId,transactionType,limit)
    {
        if(!this.cookie)throw new Error("Please initialize the client with a valid cookie before using this method.")
        if(groupId === null)throw new Error("NO GROUPID PROVIDED")
        if(limit === null)limit = 10
        const r = await fetch(`https://economy.roblox.com/v1/groups/${groupId}/transactions?transactionType=${transactionType}&limit=${limit}`,{
            headers:{
                "Accept":"application/json",
                "Content-Type":"application/json",
                "Cookie":".ROBLOSECURITY="+ this.cookie,
                "X-CSRF-TOKEN":(this.csrf)
            },
        })
        const p = await r.json();
        if(r.status !==200)throw new Error(JSON.stringify(p))
        return p.data
    }
 }
 module.exports.RobloxClient = RobloxClient