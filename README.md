<p>
  <!-- iOS -->
  <img alt="Supports Expo iOS" longdesc="Supports Expo iOS" src="https://img.shields.io/badge/iOS-4630EB.svg?style=flat-square&logo=APPLE&labelColor=999999&logoColor=fff" />
  <!-- Android -->
  <img alt="Supports Expo Android" longdesc="Supports Expo Android" src="https://img.shields.io/badge/Android-4630EB.svg?style=flat-square&logo=ANDROID&labelColor=A4C639&logoColor=fff" />
</p>

## 👷&nbsp;&nbsp;&nbsp;Purpose

- Chris Carlson who’s our customer is the Dean of Student Success. He oversees operations and resources that would promote a student’s involvement and success while attending Gordon College. While there are many information-based Gordon websites currently accessible to students, it's a known fact that a student's primary resource for information is their smartphone. Mobile apps power our daily lives. Gordon 360 is one of Gordon’s web platforms that was made by students, for students. It's a central place for students to view personal information, join new clubs, and find activities throughout campus. Our goal is to use this platform to allow students and faculty to connect as we've become more socially distant due to Covid-19. As Gordon 360's environment exists solely on the web, there are many limitations put into place for mobile devices. We intend to create a mobile application that would help individuals stay in touch while incorporating Gordon 360's current web ecosystem.

## 📜&nbsp;&nbsp;&nbsp;Design Document

- https://docs.google.com/document/d/19ZKxjMTd3x-V4B5TIUYO3TishPf5Bvb245_4jhe7xGs/edit?usp=sharing

<br/>

## 📜&nbsp;&nbsp;&nbsp;User Stories

- https://drive.google.com/file/d/192zBSbFHV8dkPMFZv7GNuCI4L0jPgu6s/view?usp=sharing

<br/>

## 📜&nbsp;&nbsp;&nbsp;Tools Proposal

- https://docs.google.com/document/d/11XzF7SbY94uw0OCi_q1oCgfPXNCJib9uiFnjfBa6mM4/edit?usp=sharing

<br/>

## 👥&nbsp;&nbsp;&nbsp;Lofi User Study

- https://drive.google.com/file/d/12QNG491fKHFfJucT3vYGnumR7fiu1lyG/view?usp=sharing

<br/>

## 📱&nbsp;&nbsp;&nbsp;Adobe XD Sketch

- https://xd.adobe.com/view/73f200d1-a075-4d62-9ddf-e2480d14bb2d-26a1/

<br/>

## 🤔&nbsp;&nbsp;&nbsp;Problem Statement

- https://docs.google.com/presentation/d/1KAvq2Z2kaWoHd6xHDp5utLFS6qgmR5O2uCL2YME8aqc/edit?usp=sharing

<br/>

## &nbsp;&nbsp;&nbsp;Final Presentation Slides

- https://docs.google.com/presentation/d/1Y_X6unoZz11H5mlaSbJKe4WA6ddGGzveeY4cRbUIoYk/edit?usp=sharing

<br/>

## 💿&nbsp;&nbsp;&nbsp;API - How the back-end is setup

- https://github.com/gordon-cs/gordon-360-api

<br/>

## ![icons8-redux](https://user-images.githubusercontent.com/47061482/112046016-e2c9f500-8b21-11eb-96e8-413f4d4e1cdb.png)&nbsp;&nbsp;&nbsp;Redux

- This application uses Redux alongside React to manage the state. You can learn more about redux <a href="https://redux.js.org/tutorials/fundamentals/part-1-overview">here<a/>.
- Some actions that are used with Redux is from Redux's Toolkit. You can learn more about these actions <a href="https://redux-toolkit.js.org/introduction/getting-started#whats-included">here</a>.
- You can debug the application through Redux using React Native Debugger. You can find the instructions on how to install it on your machine <a href="https://medium.com/@tetsuyahasegawa/how-to-integrate-react-native-debugger-to-your-expo-react-native-project-db1d631fad02">here</a>. Skip steps 4 and 5 as they have already been completed in the application. Make sure to install all dependencies below as a few of them are required for Redux and React Native Debugger to work. After following the steps, you will be able to debug the application using the Redux and React Dev Tools that come along with it. When connecting the application to the React Native Debugger, you must make sure that you are using the correct port number. The default is "19001". However, if you see a new tab open up in your browser instead of connecting to React Native Debugger, make sure to look at the port number of the tab's URL. In the example of, "http://localhost:19000/debugger-ui/", we can see that the debug port number is "19000". Therefore, we must open a new window in React Native Debugger and set the port number as "19000". After doing so, reload the application and it should connected to React Native Debugger successfully.

<br/>

## &nbsp;&nbsp;&nbsp;Expo Push Notification Service

- Push Notification Tool:
  - https://expo.io/notifications
- Sending Notifications with Expo's Push API:
  - https://docs.expo.io/push-notifications/sending-notifications/#push-tickets
- Expo Notifications (JS API):
  - https://docs.expo.io/versions/latest/sdk/notifications/#types
- Push Notifications Overview:
  - https://docs.expo.io/push-notifications/overview/

<br/>

## &nbsp;&nbsp;&nbsp;Building the App with Expo

- Building the app:
  - https://docs.expo.io/distribution/building-standalone-apps/
- What you should make sure of before distributing the app
  - https://docs.expo.io/distribution/app-stores/
    <br/>

### Make sure to follow these steps exactly or else you may run into random bugs and glitches! To upgrade Expo, you must have "expo" as a command. That command should be available if you have `expo-cli` installed.

- Update Expo's CLI using the command, '`npm install expo-cli`' if using NPM and, '`yarn add expo-cli`' if using Yarn.
- After the CLI finishes installing, MAKE SURE to upgrade Expo. Not doing so can lead to hours and hours of debugging and not finding the answers to why a bug or glitch is occuring. This is due to Expo's upgraded CLI not finding the correct dependencies it needs to run correctly. If you have changes in your project and haven't pushed it yet to Github, it's best to stash it before upgrading Expo. This can be done with the command, '`git stash`'. Afterward, you can upgrade Expo with the command, '`expo upgrade`'. After everything installs correctly, the project manifest files such as '<i>package.json</i>' will have updated. You have upgraded Expo successfully! If you stashed changes before running '`expo upgrade`', continue reading below to recover your changes successfully. Otherwise, you are all set! 🎉
- Due to git seeing the modified files such as '<i>package.json</i>' as "changes", you will be required to run the command '`git stash`' again. Your stack should be similar to the example below. You may view your stack with the command, '`git stash list`'.

---

| Stash #   | What's Contained in the Stash                                                                  |
| --------- | ---------------------------------------------------------------------------------------------- |
| stash@{0} | The modified files after executing the command, '`expo upgrade`' (aka yarn.lock, package.json) |
| stash@{1} | The modified files before executing the command, '`expo upgrade`'                              |
| stash@{x} | Other stashes you may have had in the stack before from other coding sessions.                 |

---

- To successfully recover your files, first recover the files you made changes to before upgrading Expo. This can be done with the command, '`git stash pop stash@{1}`'. Now, commit these files with the command, '`git add .`'. You have to commit the files first because git won't allow you to recover your files from a stash in your stack unless you commit the changes. After commiting the changes, now execute the command, '`git stash pop`'. This will recover the files that changed after upgrading Expo. Lastly, to bring all changes together, run the command, '`git add .`' once more. It's recommended to push your changes to your branch immediately so that if an unclear error occurs while coding, you can checkout all the files without having to re-upgrade Expo. If you're not in a branch that you wanted to push the changes to, or wanted to create a new branch, you can uncommit your changes with the command, '`git reset head`' and continue on doing so.

<br/><br/>

## 💻&nbsp;&nbsp;&nbsp;How to Use

1. First install Yarn or NPM with `yarn` or `npm install`. It's HIGHLY recommended to use Yarn rather than NPM due to NPM giving off many warnings about not being able to link different packages. The amount of warnings from installing with Yarn is substantially smaller than installing with NPM. Yarn links packages better than NPM.

   - To install all dependencies in one command, use any of the following commands. If using npm, make sure to run `npm audit fix` after installation.

     - `npm i --save expo-cli react-native-webview react-native-elements react-native-vector-icons @react-navigation/stack react-native-gifted-chat react-native-gesture-handler @react-native-community/async-storage bluebird react-native-offline reselect @reduxjs/toolkit redux redux-devtools-extension moment react-error-boundary react-native-exception-handler && expo install expo-linear-gradient @react-native-community/netinfo expo-image-picker expo-haptics expo-file-system sentry-expo`
     - `yarn add expo-cli react-native-webview react-native-elements react-native-vector-icons @react-navigation/stack react-native-gifted-chat react-native-gesture-handler @react-native-community/async-storage bluebird react-native-offline reselect @reduxjs/toolkit redux redux-devtools-extension moment react-error-boundary react-native-exception-handler && expo install expo-linear-gradient @react-native-community/netinfo expo-image-picker expo-haptics expo-file-system sentry-expo`

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
     - Install React Native Gesture Handler using any of the following commands.
       - `npm i react-native-gesture-handler`
       - `yarn add react-native-gesture-handler`
     - Install React Native AsyncStorage using any of the following commands.
       - `npm i @react-native-community/async-storage`
       - `yarn add @react-native-community/async-storage`
     - Install Bluebird using any of the following commands.
       - `npm i bluebird`
       - `yarn add bluebird`
     - Install React Native Offline using any of the following commands.
       - `npm i react-native-offline`
       - `yarn add react-native-offline`
     - Install Reselect using any of the following commands.
       - `npm i reselect`
       - `yarn add reselect`
     - Install Redux using any of the following commands.
       - `npm i redux`
       - `yarn add redux`
     - Install Redux Toolkit using any of the following commands.
       - `npm i @reduxjs/toolkit`
       - `yarn add @reduxjs/toolkit`
     - Install Redux Dev Tools Extension using any of the following commands.
       - `npm i redux-devtools-extension`
       - `yarn add redux-devtools-extension`
     - Install Moment (Used for Date) using any of the following commands.
       - `npm i moment`
       - `yarn add moment`
     - Install React Error Boundary using any of the following commands.
       - `npm i react-error-boundary`
       - `yarn add react-error-boundary`
     - Install React Native Exception Handler using any of the following commands.
       - `npm i react-native-exception-handler`
       - `yarn add react-native-exception-handler`
     - Install Expo Linear Gradient using the following command.
       - `expo install expo-linear-gradient`
     - Install NetInfo using the following command.
       - `expo install @react-native-community/netinfo`
     - Install Expo Image Picker using the following command.
       - `expo install expo-image-picker`
     - Install Expo Haptics using the following command.
       - `expo install expo-haptics`
     - Install Expo File System using the following command.
       - `expo install expo-file-system`
     - Install Expo Sentry using the following command.
       - `expo install sentry-expo`
     - Install Expo Screen Orientation using the following command.
       - `expo install expo-screen-orientation`

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
        <li> src/Views/Chat/Chats/Components/InputToolbar/Components/Composer/index.js </li>
      </ol>
    </td>
  </tr>

  <!-------------------------------------------------- # 2 -------------------------------------------------->
  <tr align="left" valign="top" style="border-bottom: 1px solid grey">
    <td style="color: #FFE266"> 
      2
    </td>
    <td style="color: #FFE266"> 
      Text_Input
    </td>
    <td style="color: #FC9186"> 
     Upon typing multiple lines inside the textfield located in the input toolbar inside a chat, a spacing between the keyboard and the input toolbar will appear. It's impact is not great but causes a UI disturbance and removes space available to the input toolbar to grow.
    </td>
    <td style="color: #82C9FF"> 
      This is due to the input toolbar not having a correct minimum height. GiftedChat requires a minimum height for the input toolbar. When the minimum height given is lower than the actual height of the input toolbar, GiftedChat fails to calculate the correct spacing allocated for the input toolbar. As long as the correct height of the input is given (by calculating the height of each component and their respective spacing), the input toolbar is displayed correctly without spacing appearing between the input toolbar and keyboard.
    </td>
    <td style="color: #FFE266">
      <ol>
      <li> src/Views/Chat/Chats/index.js </li>
      </ol>
    </td>
  </tr>

  <!-------------------------------------------------- # 3 -------------------------------------------------->
  <tr align="left" valign="top" style="border-bottom: 1px solid grey">
    <td style="color: #FFE266"> 
      3
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

  <!-------------------------------------------------- # 4 -------------------------------------------------->
  <tr align="left" valign="top" style="border-bottom: 1px solid grey">
    <td style="color: #FFE266"> 
      4
    </td>
    <td style="color: #FFE266"> 
      GiftedChat_InputToolbar_Rerender
    </td>
    <td style="color: #FC9186"> 
      This is a warning for any changes made to the input toolbar. Upon displaying each component in the input toolbar, GiftedChat automatically calculates the height of the input toolbar to display it correctly and prevent the keyboard from covering over it. If you add or a remove a component in the input toolbar that results in a change of its height, GiftedChat's initial calculations of the height will no longer work. This will cause a bug where the input toolbar will be incorrectly placed on the screen. In most cases, you will see the input toolbar displayed and trail off the bottom of the screen. You will also see the keyboard (when invoked) appear above the input toolbar making it impossible to see what you're typing.
    </td>
    <td style="color: #82C9FF"> 
    GiftedChat has to be prompted to re-render itself. After extensively looking at GiftedChat's source code, there's not a simple function that can be called. Adding or removing a component from the input toolbar after it has already been displayed will not trigger GiftedChat to re-render. The only things that will trigger GiftedChat to re-render (that's in OUR CONTROL to invoke) is the visibility of the keyboard and the change of the content size of the textfield in the input toolbar. As it would be a terrible UI idea to invoke the keyboard and remove it in order to re-render GiftedChat, we use the content size of the textfield instead.<br/><br/>This is done by always having a reference to the content size of the textfield (or known as the component "<span style="color: #AEDCFF"><strong>Composer</strong></span>"). Upon changing the height of the input toolbar (by adding or removing a component), we pass the content size of the textfield to GiftedChat. Even though we're passing the same content size that GiftedChat already calculated, passing in a content size causes GiftedChat to re-render. Unfortunately, this requires for props to be passed all the way to the <span style="color: #AEDCFF"><strong>Composer</strong></span> component to have the logic present for the Composer to determine if it should invoke GiftedChat to re-render.<br/><br/>Therefore, while it's highly unusual, using the textfield is the only way to ensure that all components in the input toolbar are displayed correctly.<br/><br/>When developing, in order to add the logic of having the Composer component trigger GiftedChat to re-render, you must do 3 important things.<br/><ol><li>Whatever you compare to have GiftedChat re-render the input toolbar, make sure that it's <span style="color: #AEDCFF"><strong>passed through props to the "Composer" component</strong></span>.</li><li><span style="color: #AEDCFF"><strong>Use a ref</strong></span> to hold the initial value of your prop in order to do a logical comparison for changes in the useEffect hook.<br/><span style="color: #AEDCFF"><strong>REMEMBER to update the ref</strong></span> to hold the new prop value after doing your comparison so that it always has the correct value passed in.</li><li>Make sure to <span style="color: #AEDCFF"><strong>add logic for your prop inside of React.memo</strong></span>! This is important as React.memo handles the re-rendering of the Composer component (it prevents unnecessary re-renders). If you forget to add the logic for your prop to React.memo, the Composer component will never recognize any changes to your prop.</li></ol>
    </td>
    <td style="color: #FFE266">
      <ol>
      <li> src/Views/Chat/Chats/Components/InputToolbar/Components/Composer/index.js </li>
      </ol>
    </td>
  </tr>

  <!-------------------------------------------------- # 5 -------------------------------------------------->
  <tr align="left" valign="top" style="border-bottom: 1px solid grey">
    <td style="color: #FFE266"> 
      5
    </td>
    <td style="color: #FFE266"> 
      InputToolbar_Class
    </td>
    <td style="color: #FC9186"> 
      This is a warning to avoid changing the InputToolBar component to a functional hook component. Due to GiftedChat only using class components, if you create the input toolbar using a functional hook, a bug may occur where the keyboard (when invoked) will cover over the input toolbar making it invisible. The reason for this occuring is not known.
    </td>
    <td style="color: #82C9FF"> 
    Simply leave the InputToolbar as a class component. While you may make all components used by InputToolbar functional hooks, the InputToolbar component itself must remain as a class.
    </td>
    <td style="color: #FFE266">
      <ol>
      <li> src/Views/Chat/Chats/Components/InputToolbar/index.js </li>
      </ol>
    </td>
  </tr>
  <!-------------------------------------------------- # 6 -------------------------------------------------->
  <tr align="left" valign="top" style="border-bottom: 1px solid grey">
    <td style="color: #FFE266"> 
      6
    </td>
    <td style="color: #FFE266"> 
    NO CODE REFERENCE
    </td>
    <td style="color: #FC9186"> 
      This is a BIG WARNING when updating Expo's CLI. If you update Expo's CLI using `npm -g install expo-cli` or `yarn add expo-cli `, this can cause serious glitches with the app as the CLI has updated but the rest of Expo's dependencies hasn't. Even if the glitches may not happen right away, you may experience things such as random network requests going missing. LITERALLY. You would invoke a network request and you will never get a response back. You won't get an error either to indicate that the network request timed out. 
    </td>
    <td style="color: #82C9FF"> 
    In order to prevent glitches from happening, make sure to upgrade Expo after upgrading the 
    </td>
    <td style="color: #FFE266">
      <ol>
      <li> src/Views/Chat/Chats/Components/InputToolbar/index.js </li>
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
