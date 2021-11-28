# Agora RTC Assignment

create a simple web application(Live Video Room) with agora RTC and RTM SDK
integrated into it for the video/audio and messaging services respectively.

## Use case

Live Video Room, with up to four users in the room, allow each user to take part in and listen to
discussions.

### Prerequisites

HTML Supported Browser

```
[ Desktop ] Chrome , Firefox, Safari
[ Mobile ] Chrome , Firefox, Safari
```


### How To generate Token

Follow step1.jpg and step2.jpg

```
Go to 
https://console.agora.io/token/
Genarate Temp Token
```

### Features

All the users in the room should have the below privileges.

```
Join/leave the channel
Mute / unmute audio
Enable / disable video
Send Message to the channel
```

### Assumptions

You can have a static channel name, however, each user should have a unique user ID in the
channel.



### Installing

Install the Javascript SDK only Once in top of your page

```
<script type="text/javascript" src="chatsdk.js">  </script>
```


## Running the tests

```
1) //localhost/index.html
```



## Deployment

Include SDK in HTML Files and Call SDK methods

## Built With

- [Javascript]
- [agora RTC SDK]



## Whats New
## v1.0.0
Relase Date 15/11
```
1. Basic Chat Demo
2. No UI for Media Permission
```

## v1.0.1
Relase Date 16/11
```
1. Chat Demo for 4 Users
2. Permission to Enable/Disable Video Streams
3. Permission to Enable/Disable Audio Streams
```

## v1.0.2
Relase Date 17/11
```
1. Pre Call UI
2. CSS improvement
```

## v1.0.3
Relase Date 18/11
```
1. Chat UI
2. RTM SDK integration
```

## v1.0.4
Relase Date 28/11
```
1. Migration to Agora 4.X SDK
2. Active User Detection
```

## Authors

```
Naveen Jaiswal
```


## Acknowledgments

- agora RTC SDK

