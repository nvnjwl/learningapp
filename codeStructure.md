# Agora RTC Assignment

This SDK Code is Bases on Agora RTC SDK and RTM SDK

## Structure

We are using Webpack to Bundle Our Code


### Integration

we need Agora App Id, Channal Id and Token before Running SDK.
Following Things have been Provided in a middleware.js File

```
	let agoraAppId = '1eb1dd97c1104a58a773116df9494cdd';
	let agoraToken = '0061eb1dd97c1104a58a773116df9494cddIAAYFQPmTSJEmbth1YgD3NCHwqdEIjg7TunH9moAc70NDf+vWnwAAAAAEABw2xAIUsKYYQEAAQBswphh';
	let agoraChannel = 'learning101';
	let RTMToken = '0061eb1dd97c1104a58a773116df9494cddIACaDtLjSD54QqIWu15LqHXC2sNjCxH/W7ycIoRP9igUZmLWbU8AAAAAEAAJlZGjKgyZYQEA6AMqDJlh';
	let RTMToken2 = '0061eb1dd97c1104a58a773116df9494cddIABAo6vnGDLGsLtLJJi1Ycql1lBw1FbOSCvftq7yTXJ657E681kAAAAAEAA7DHR';
	let appCertificate = '954cef76a2ea48a09cef01092299e0c5';
```
To invoke Class, 
We are creating New Object of AgoraVideoCall Class
```
	let agoraVideoCallObj = new AgoraVideoCall(applicationConfig);
```

### Features
This Make Sure that we can Use Multiple version Togetehr if needed Ever



### Components

Application can be breakdoen in Following Comonents
```
	Permission  Menu 		:  Render the Form (TODO Can be Used as Layer to Grant Permission from User )
	Communication Menu 	: Render the Video UI Here
	Chat Menu 					: Render the Chat Component here
```
```
This Pattern is Somewhat Same as React Pattern , but based on Vanila Js and DOM layer
I Have Used Jquey in many Places to Fasten up the Pure function, But they can be seemlesly translated to Vanilla Util Function
```

Communication Menu

```
	This  act as a UI layer, which saperate the responsibility from RTC interface  
	RTC interface Can Communicate to Ui via Broadacasting Events or by Callling Methods of Communication Object
```


Chat Menu

```
	Chat Menu Also Act  as a UI layer, which saperate the responsibility from RTM interface  
	RTM interface  Can Communicate to Ui via Broadacasting Events or by Callling Methods of Chat Object
```


### Installing

Install the Javascript SDK only Once in top of your page

```
<script type="text/javascript" src="chatsdk.js">  </script>

```
we Can simply open html File by Running any Server Locally


## Code Samples
Following Git Repo has been Used in getting understanding of Inner Functioning of SDK's 
Minor UI Components and Pure function have also been re used from original Repo
```
https://download.agora.io/sdk/release/Agora_Web_SDK_v3_6_6_FULL.zip
https://download.agora.io/rtmsdk/release/Agora_RTM_SDK_for_Web_v1.4.3.zip
```

## Authors
```
Naveen Jaiswal
```


## Acknowledgments
```
Agora RTC SDK
Agora RTM SDK
```
