# Drawer navigation example

<p>
  <!-- iOS -->
  <img alt="Supports Expo iOS" longdesc="Supports Expo iOS" src="https://img.shields.io/badge/iOS-4630EB.svg?style=flat-square&logo=APPLE&labelColor=999999&logoColor=fff" />
  <!-- Android -->
  <img alt="Supports Expo Android" longdesc="Supports Expo Android" src="https://img.shields.io/badge/Android-4630EB.svg?style=flat-square&logo=ANDROID&labelColor=A4C639&logoColor=fff" />
  <!-- Web -->
  <img alt="Supports Expo Web" longdesc="Supports Expo Web" src="https://img.shields.io/badge/web-4630EB.svg?style=flat-square&logo=GOOGLE-CHROME&labelColor=4285F4&logoColor=fff" />
</p>

## 💻&nbsp;&nbsp;&nbsp;How to Use

1. First install dependencies with `yarn` or `npm install`.
2. Install WebView using any of the following commands (If using npm, make sure to run "npm audit fix" after installation)
   - `npm i react-native-webview`
   - `yarn add react-native-webview`
3. Install GiftedChat using any of the following commands (If using npm, make sure to run "npm audit fix" after installation)
   - `npm i react-native-gifted-chat`
   - `yarn add react-native-gifted-chat`
4. You can open your application using any of the following commands depending on your preference
   - Start the server only:
     - `expo start`
   - Start the server and open application in Android simulator (Android Studio must be installed)
     - `expo start --android`
   - Start the server and open application in iOS simulator (Only for Mac and Xcode must be installed)
     - `expo start --ios`

<br/><br/>

## 🐛 ⚠️&nbsp;&nbsp;&nbsp;Known Bugs and Warnings

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
      Unfortunately, since this error is in node modules, any time that an "npm install" occurs, you will have to manually change the same file again. More information can be found <a href="https://github.com/oblador/react-native-lightbox/issues/129">here</a>. To fix this warning, follow the steps below.
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
      node_modules/react-native-lightbox/LightboxOverlay.js
    </td>
  </tr>
</table>
