const messages = [
  {
    _id: 1,
    text: "This is a system message",
    createdAt: new Date(Date.UTC(2016, 5, 11, 17, 20, 0)),
    system: true,
  },
  {
    _id: 2,
    text: "Hello developer",
    createdAt: new Date(Date.UTC(2016, 5, 12, 17, 20, 0)),
    user: {
      _id: 2,
      name: "User Two",
      avatar: "https://placeimg.com/140/140/any",
    },
  },
  {
    _id: 3,
    text: "Hi! I work from home today!",
    createdAt: new Date(Date.UTC(2016, 5, 13, 17, 20, 0)),
    user: {
      _id: 0,
      name: "OG User",
      avatar: "https://placeimg.com/140/140/any",
    },
    image: "https://placeimg.com/960/540/any",
  },
  {
    _id: 4,
    text: "This is a quick reply. Do you love Gifted Chat? (radio) KEEP IT",
    createdAt: new Date(Date.UTC(2016, 5, 14, 17, 20, 0)),
    user: {
      _id: 2,
      name: "User Two",
      avatar: "https://placeimg.com/140/140/any",
    },
    quickReplies: {
      type: "radio", // or 'checkbox',
      keepIt: true,
      values: [
        {
          title: "😋 Yes",
          value: "yes",
        },
        {
          title: "📷 Yes, let me show you with a picture!",
          value: "yes_picture",
        },
        {
          title: "😞 Nope. What?",
          value: "no",
        },
      ],
    },
  },
  {
    _id: 5,
    text: "This is a quick reply. Do you love Gifted Chat? (checkbox)",
    createdAt: new Date(Date.UTC(2016, 5, 15, 17, 20, 0)),
    user: {
      _id: 2,
      name: "User Two",
      avatar: "https://placeimg.com/140/140/any",
    },
    quickReplies: {
      type: "checkbox", // or 'radio',
      values: [
        {
          title: "Yes",
          value: "yes",
        },
        {
          title: "Yes, let me show you with a picture!",
          value: "yes_picture",
        },
        {
          title: "Nope. What?",
          value: "no",
        },
      ],
    },
  },
  {
    _id: 6,
    text: "Come on!",
    createdAt: new Date(Date.UTC(2016, 5, 15, 18, 20, 0)),
    user: {
      _id: 2,
      name: "User Two",
      avatar: "https://placeimg.com/140/140/any",
    },
  },
  {
    _id: 7,
    text: "This is just an example of what happens.",
    createdAt: new Date(Date.UTC(2016, 7, 15, 18, 21, 0)),
    user: {
      _id: 2,
      name: "User Two",
      avatar: "https://placeimg.com/140/140/any",
    },
  },
  {
    _id: 8,
    text: "When you text consecutively!",
    createdAt: new Date(Date.UTC(2016, 7, 15, 18, 22, 0)),
    user: {
      _id: 2,
      name: "User Two",
      avatar: "https://placeimg.com/140/140/any",
    },
  },
  {
    _id: 9,
    text:
      "You should see my name either at the bottom or the top of these consecutive texts!",
    createdAt: new Date(Date.UTC(2016, 7, 15, 18, 22, 2)),
    user: {
      _id: 2,
      name: "User Two",
      avatar: "https://placeimg.com/140/140/any",
    },
  },
  {
    _id: 10,
    text: `Hello this is an example of the ParsedText, links like http://www.google.com or http://www.facebook.com are clickable and phone number 444-555-6666 can call too.
        But you can also do more with this package, for example Bob will change style and David too. foo@gmail.com
        And the magic number is 42!
        #react #react-native`,
    createdAt: new Date(Date.UTC(2016, 5, 13, 17, 20, 4)),
    user: {
      _id: 0,
      name: "OG User",
      avatar: "https://placeimg.com/140/140/any",
    },
  },
  {
    _id: 11,
    text: "This is another example of a grouped text from one user",
    createdAt: new Date(Date.UTC(2018, 7, 13, 17, 20, 2)),
    user: {
      _id: 3,
      name: "User Three",
      avatar: "https://placeimg.com/140/140/any",
    },
    image: "https://placeimg.com/960/540/any",
  },
  {
    _id: 12,
    text:
      "Everything should be working in order over here. You should see my name at the bottom or top of these consecutive texts",
    createdAt: new Date(Date.UTC(2018, 7, 13, 17, 20, 3)),
    user: {
      _id: 3,
      name: "User Three",
      avatar: "https://placeimg.com/140/140/any",
    },
  },
];

export default messages;
