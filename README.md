# Drawer navigation example

<p>
  <!-- iOS -->
  <img alt="Supports Expo iOS" longdesc="Supports Expo iOS" src="https://img.shields.io/badge/iOS-4630EB.svg?style=flat-square&logo=APPLE&labelColor=999999&logoColor=fff" />
  <!-- Android -->
  <img alt="Supports Expo Android" longdesc="Supports Expo Android" src="https://img.shields.io/badge/Android-4630EB.svg?style=flat-square&logo=ANDROID&labelColor=A4C639&logoColor=fff" />
  <!-- Web -->
  <img alt="Supports Expo Web" longdesc="Supports Expo Web" src="https://img.shields.io/badge/web-4630EB.svg?style=flat-square&logo=GOOGLE-CHROME&labelColor=4285F4&logoColor=fff" />
</p>

## 📜&nbsp;&nbsp;&nbsp;User Stories

- https://drive.google.com/file/d/192zBSbFHV8dkPMFZv7GNuCI4L0jPgu6s/view?usp=sharing.

<br/>

## 📜&nbsp;&nbsp;&nbsp;Tools Proposal

- https://docs.google.com/document/d/11XzF7SbY94uw0OCi_q1oCgfPXNCJib9uiFnjfBa6mM4/edit?usp=sharing

<br/>

## 👥&nbsp;&nbsp;&nbsp;Lofi User Study

- https://drive.google.com/file/d/12QNG491fKHFfJucT3vYGnumR7fiu1lyG/view?usp=sharing.

<br/>

## 📱&nbsp;&nbsp;&nbsp;Adobe XD Sketch

- https://xd.adobe.com/view/73f200d1-a075-4d62-9ddf-e2480d14bb2d-26a1/

<br/>

## 🤔&nbsp;&nbsp;&nbsp;Problem Statement

- https://docs.google.com/presentation/d/1KAvq2Z2kaWoHd6xHDp5utLFS6qgmR5O2uCL2YME8aqc/edit?usp=sharing`.

<br/>

## 👷&nbsp;&nbsp;&nbsp;Purpose

- Chris Carlson who’s our customer is the Dean of Student Success. He oversees operations and resources that would promote a student’s involvement and success while attending Gordon College. While there are many information-based Gordon websites currently accessible to students, it's a known fact that a student's primary resource for information is their smartphone. Mobile apps power our daily lives. Gordon 360 is one of Gordon’s web platforms that was made by students, for students. It's a central place for students to view personal information, join new clubs, and find activities throughout campus. Our goal is to use this platform to allow students and faculty to connect as we've become more socially distant due to Covid-19. As Gordon 360's environment exists solely on the web, there are many limitations put into place for mobile devices. We intend to create a mobile application that would help individuals stay in touch while incorporating Gordon 360's current web ecosystem.

<br/><br/>

## 💻&nbsp;&nbsp;&nbsp;How to Use

1. First install Yarn or NPM with `yarn` or `npm install`. It's HIGHLY recommended to use Yarn rather than NPM due to NPM package dependencies that gives many warnings due to different version capability. The amount of warnings from installing with Yarn is substantially smaller than installing with NPM. Yarn links packages better than NPM.

   - To install all dependencies in one command, use any of the following commands. If using npm, make sure to run `npm audit fix` after installation.

     - `npm i --save expo-cli react-native-webview react-native-elements react-native-vector-icons @react-navigation/stack react-native-gifted-chat @react-native-community/async-storage && expo install expo-linear-gradient @react-native-community/netinfo`
     - `yarn add expo-cli react-native-webview react-native-elements react-native-vector-icons @react-navigation/stack react-native-gifted-chat @react-native-community/async-storage && expo install expo-linear-gradient @react-native-community/netinfo`

   - To install dependencies separately, use any of the following commands. If using npm, make sure to run `npm audit fix` after installation.
     - Install Expo using any of the following commands.
       - `npm i expo-cli`
       - `yarn add expo-cli`
     - Install WebView using any of the following commands.
       - `npm i react-native-webview`
       - `yarn add react-native-webview`
     - Install React Native Elements using any of the following commands.
       - `npm i react-native-elements`
       - `yarn add react-native-elements`
     - Install React Native Vector Icons using any of the following commands.
       - `npm i react-native-vector-icons`
       - `yarn add react-native-vector-icons`
     - Install React Native Stack Navigation using any of the following commands.
       - `npm i @react-navigation/stack`
       - `yarn add @react-navigation/stack`
     - Install GiftedChat using any of the following commands.
       - `npm i react-native-gifted-chat`
       - `yarn add react-native-gifted-chat`
     - Install Expo Linear Gradient using the following command.
       - `expo install expo-linear-gradient`
     - Install React Native AsyncStorage using any of the following commands.
       - `npm i @react-native-community/async-storage`
       - `yarn add @react-native-community/async-storage`
     - Install React Native Image-Viewer using any of the following commands.
       - `npm i react-native-image-zoom-viewer`
       - `yarn add react-native-image-zoom-viewer`
     - Install Moment (Used for Date) using any of the following commands.
       - `npm i moment`
       - `yarn add moment`
     - Install NetInfo using the following command.
       - `expo install @react-native-community/netinfo`

2. You can open your application using any of the following commands depending on your preference.
   - Start the server only:
     - `expo start`
   - Start the server and open application in Android simulator (Android Studio must be installed).
     - `expo start --android`
   - Start the server and open application in iOS simulator (Only for Mac and Xcode must be installed).
     - `expo start --ios`

<br/><br/>

## 🐛&nbsp;⚠️&nbsp;&nbsp;&nbsp;Known Bugs and Warnings

<table>
<!------------------------------------------------ Table Headers ------------------------------------------------>
  <tr style="text-align: left; -webkit-text-stroke: 1px black; font-size: 20px">
    <th style="color: #ECC100">#</th>
    <th style="color: #ECC100">Code Reference</th>
    <th style="color: #FF6454">Description</th>
    <th style="color: #31A6FF">Solution</th>
    <th style="color: #ECC100">Files Impacted</th>
  </tr>

  <!---------------------------------------------------- # 1 ---------------------------------------------------->
  <tr align="left" valign="top" style="border-bottom: 1px solid grey">
    <td style="color: #FFE266"> 
      1
    </td>
    <td style="color: #FFE266"> 
      iOS_Text_Input
    </td>
    <td style="color: #FC9186"> 
      This bug only occurs on iOS. The TextInput component inside of the InputToolbar has an issue with the textfield growing along with text. In other words, if there are multiple lines in the textfield, the textfield should be big enough to where all lines of text are visible. On iOS, if you’re backspacing a line, right before the line is fully erased, the height of the text field becomes smaller as if the full line was deleted. This causes for the last line that’s still there to either disappear from the view, or have only the top half of the letters visible. This is due to the onContentSizeChange (which handles the change of width and height of the textfield) firing incorrectly.
    </td>
    <td style="color: #82C9FF"> 
      There were 2 things that caused this issue. The first cause was the font size. The font size is originally 14. Upon changing to 16, this caused for the onContentSizeChange event listener to misfire. The second cause of this misfire was padding. In the textfield itself, there was a paddingTop set. Once this paddingTop was set to 0, onContentSizeChange fired correctly.
    </td>
    <td style="color: #FFE266"> 
      <ol>
        <li> node_modules/react-native-gifted-chat/lib/InputToolbar.js </li>
        <br/>
        <li> src/Views/Chat/Chat.js </li>
      </ol>
    </td>
  </tr>

  <!-------------------------------------------------- # 2 -------------------------------------------------->
  <tr align="left" valign="top" style="border-bottom: 1px solid grey">
    <td style="color: #FFE266"> 
      2
    </td>
    <td style="color: #FFE266"> 
      Animated_Native_Driver
    </td>
    <td style="color: #FC9186"> 
      This warning occurs on both iOS and Android. This warning is due to a component inside of GiftedChat that uses Lightbox (a component from node modules). Inside the code for Lightbox, there's a call made incorrectly with React Native's Animated component. Due to this, a warning appears every time a "Reload" (not refresh) of the application is done.
    </td>
    <td style="color: #82C9FF"> 
      Unfortunately, since this error is in node modules, any time that an "npm install" occurs, you will have to patch the same file again. More information can be found <a href="https://github.com/oblador/react-native-lightbox/issues/129">here</a>. There are two ways to fix this. If you've installed all the dependencies above, you can automatically solve this issue with the command: <strong>"npx patch-package react-native-lightbox"</strong>. To fix this warning manually (must have installed dependencies using NPM and not Yarn), follow the steps below.
      <ol>
        <br/>
        <li> Open the file <span style="color: #AEDCFF"><i>node_modules/react-native-lightbox/LightboxOverlay.js</i></span></li>
        <br/>
        <li> Look inside the constructor for the words "<span style="color: #AEDCFF"><i>onPanResponderMove</i></span>"</li>
        <br/>
        <li> The original code is around the lines 99-102: <br/>
          <code>
            onPanResponderMove: Animated.event([
              null,
              { dy: this.state.pan }
            ]),
            </code>
        </li>
        <br/>
        <li> Add <br/><code>{ useNativeDriver: false, }</code><br/> to the code after the end of the list bracket "<code>]</code>".</li>
        <br/>
        <li> After adding the code above, the resulting code should look like this: <br/>
          <code>
            onPanResponderMove: Animated.event([
              null,
              { dy: this.state.pan }
            ],{
              useNativeDriver: false,
            }),
          </code>
        </li>
      </ol>
    </td>
    <td style="color: #FFE266">
      <ol>
      <li> node_modules/react-native-lightbox/LightboxOverlay.js </li>
      </ol>
    </td>
  </tr>

  <!-------------------------------------------------- # 3 -------------------------------------------------->
  <tr align="left" valign="top" style="border-bottom: 1px solid grey">
    <td style="color: #FFE266"> 
      2
    </td>
    <td style="color: #FFE266"> 
      Modal_Closing_State_Unchanged
    </td>
    <td style="color: #FC9186"> 
      This bug only occurs on iOS. After opening the modal, if the gesture of sliding the modal down is done to dismiss the modal, the onDismiss function doesn't fire. Due to this, this causes the modal to not be visible and leaves its parent component (the Appbar) in a frozen state where you cannot click on anything in the Appbar. 
    </td>
    <td style="color: #82C9FF"> 
      Upon looking online, this is a known issue that many are having with React Native. They've created a patch for it but it requires manually installing another package to install the patch. Looking further, a person has found that by using a TouchableWithoutFeedback component and checking to see if the event's nativeEvent's <code>locationY < 0</code>. If this is true, then the modal has been dismissed successfully. This fix was found <a href="https://github.com/facebook/react-native/issues/26892#issuecomment-646196617">here</a> Also, the component Button shouldn't be used in the modal. While this solution might fix the issue with the modal itself, it doesn't work when the user click's on a Button and slides down to dismiss the modal. To solve this, use TouchableOpacity instead of a Button.
    </td>
    <td style="color: #FFE266">
      <ol>
      <li> src/Views/Chat/ChatInfo/index.js </li>
      </ol>
    </td>
  </tr>
</table>

## 🏭&nbsp;&nbsp;&nbsp;Data Structures

1. Structure of the Room Object. All rooms are arranged together in a list.

```javascript
  Object {
    _id: String | Number,
    name: String | null,
    group: Boolean,
    createdAt: Date,
    lastUpdated: Date,
    roomImage: "Not Available - Image type to be determined",
    users: [
      {
        _id: Number,
        name: String,
        avatar: "Not Available - Image type to be determined",
      },
    ],
  };
```

- <strong>\_id:</strong> The ID of the room. <br />
- <strong>name:</strong> The name of the room. If the room is not a group, then no room name is available. <br/>
- <strong>group:</strong> Determines if a room is group. A room is a group if the room has more than 1 user (apart from the main user). <br/>
- <strong>createdAt:</strong> Determines the date the room was created. Format is in Coordinated Universal Time (UTC). <br/>
- <strong>lastUpdated:</strong> Determines the date the room was last updated. In other words, the date and time of the last text made in the room. Format is in Coordinated Universal Time. <br/>
- <strong>roomImage:</strong> The image of the room. <br/>
- <strong>users:</strong> A list of all users in the chat. <br/>

  <br/>

2. Structure of the Message Object. All messages are arranged together in a list.

```javascript
  Object {
    _id: String | Number,
    text: String,
    createdAt: Date | Number,
    user: {
      _id: Number,
      name: String,
      avatar: "Not Available - Image type to be determined",
    },
    image: "Not Available - Image type to be determined",
    video: "Not Available - Video type to be determined",
    audio: "Not Available - Audio type to be determined",
    system: Boolean,
    sent: Boolean,
    received: Boolean,
    pending: Boolean,
    quickReplies: {
      type: "radio" | "checkbox",
      values: [
        {
          title: String,
          value: String,
          messageId: String | Number,
        },
      ],
      keepIt: Boolean,
    },
  };
```

- <strong>\_id:</strong> The ID of the message. <br />
- <strong>text:</strong> The text of the message. <br/>
- <strong>createdAt:</strong> Determines the date the room was created. Format is in Coordinated Universal Time (UTC). <br/>
- <strong>user:</strong> The user who sent the text message. <br/>
- <strong>image:</strong> Source of an image file. <br/>
- <strong>video:</strong> Source of a video file. <br/>
- <strong>audio:</strong> Source of an audio file. <br/>
- <strong>system:</strong> Determines if the message is from the system or a user. <br/>
- <strong>sent:</strong> Determines if the message has been sent. In other words, received by the server. <br/>
- <strong>received:</strong> Determines if the user received the message. Only available for non-group rooms. <br/>
- <strong>pending:</strong> Determines if a message hasn't been received by the server from device submisssion. <br/>
- <strong>quickReplies:</strong> A quick reply message. <br/>
  - <strong>type:</strong> Either a radio or checkbox. In other words, a user can either choose one message (radio) or multiple messages which are combined together as one (checkbox) for their response. <br/>
  - <strong>values:</strong> A list of quick replies messages available <br/>
    - <strong>title:</strong> The text of the quick reply message <br/>
    - <strong>value:</strong> The value of the quick reply message <br/>
    - <strong>messageId:</strong> The ID of the quick reply message <br/>
  - <strong>keepIt:</strong> Not known - To be determined. <br/>
