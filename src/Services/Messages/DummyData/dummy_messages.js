const messages = [
  /******************************** ROOM #1 Messages ***********************************/
  {
    room_id: 5001,
    messages: [
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
          name: "User One",
          avatar: "https://placeimg.com/140/140/any",
        },
      },
      {
        _id: 3,
        text: "Hi! I work from home today!",
        createdAt: new Date(Date.UTC(2016, 5, 13, 17, 20, 0)),
        user: {
          _id: 5,
          name: "Aaron",
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
          _id: 5,
          name: "Aaron",
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
    ],
  },

  /******************************** ROOM #2 Messages ***********************************/
  {
    room_id: 5002,
    messages: [
      {
        _id: 1,
        text: "System is running great so far!",
        createdAt: new Date(Date.UTC(2016, 5, 11, 17, 20, 0)),
        system: true,
      },
      {
        _id: 2,
        text: "Don't forget to keep notifications on!",
        createdAt: new Date(Date.UTC(2017, 7, 12, 17, 20, 0)),
        system: true,
      },

      {
        _id: 3,
        text: "Hello developer",
        createdAt: new Date(Date.UTC(2016, 5, 12, 17, 20, 0)),
        user: {
          _id: 2,
          name: "User One",
          avatar: "https://placeimg.com/140/140/any",
        },
      },
      {
        _id: 4,
        text: "Hi! I work from home today!",
        createdAt: new Date(Date.UTC(2016, 5, 13, 17, 20, 0)),
        user: {
          _id: 5,
          name: "Aaron",
          avatar: "https://placeimg.com/140/140/any",
        },
        image: "https://placeimg.com/960/540/any",
      },
      {
        _id: 5,
        text: "I told you that this would work!",
        createdAt: new Date(Date.UTC(2012, 3, 14, 9, 20, 0)),
        user: {
          _id: 5,
          name: "Aaron",
          avatar: "https://placeimg.com/140/140/any",
        },
        image: "https://placeimg.com/960/540/any",
      },
      {
        _id: 6,
        text: "Please tell me that you guys finished the homework 😔",
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
        _id: 7,
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
        _id: 8,
        text: "Come on!",
        createdAt: new Date(Date.UTC(2016, 5, 15, 18, 20, 0)),
        user: {
          _id: 2,
          name: "User Two",
          avatar: "https://placeimg.com/140/140/any",
        },
      },
      {
        _id: 9,
        text: "Have you guys done the reading?",
        createdAt: new Date(Date.UTC(2016, 7, 15, 18, 21, 0)),
        user: {
          _id: 2,
          name: "User Two",
          avatar: "https://placeimg.com/140/140/any",
        },
      },
      {
        _id: 10,
        text: "When you text consecutively!",
        createdAt: new Date(Date.UTC(2016, 7, 15, 18, 22, 0)),
        user: {
          _id: 2,
          name: "User Two",
          avatar: "https://placeimg.com/140/140/any",
        },
      },
      {
        _id: 11,
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
        _id: 12,
        text: `Hello this is an example of the ParsedText, links like http://www.google.com or http://www.facebook.com are clickable and phone number 444-555-6666 can call too.
        But you can also do more with this package, for example Bob will change style and David too. foo@gmail.com
        And the magic number is 42!
        #react #react-native`,
        createdAt: new Date(Date.UTC(2016, 5, 13, 17, 20, 4)),
        user: {
          _id: 5,
          name: "Aaron",
          avatar: "https://placeimg.com/140/140/any",
        },
      },
      {
        _id: 13,
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
        _id: 14,
        text:
          "I always knew that this would work. People doubted that this wouldn't work but I did it!",
        createdAt: new Date(Date.UTC(2018, 7, 13, 17, 20, 3)),
        user: {
          _id: 3,
          name: "User Three",
          avatar: "https://placeimg.com/140/140/any",
        },
      },
    ],
  },

  /******************************** ROOM #3 Messages ***********************************/
  {
    room_id: 5003,
    messages: [
      {
        _id: 1,
        text: "Yessir",
        createdAt: new Date(Date.UTC(2016, 5, 12, 17, 20, 0)),
        user: {
          _id: 2,
          name: "User One",
          avatar: "https://placeimg.com/140/140/any",
        },
      },
      {
        _id: 2,
        text:
          "Every day when you're walking down the street. EVerybody that you meet, has an original point of view!",
        createdAt: new Date(Date.UTC(2016, 5, 13, 17, 20, 0)),
        user: {
          _id: 5,
          name: "Aaron",
          avatar: "https://placeimg.com/140/140/any",
        },
        image: "https://placeimg.com/960/540/any",
      },
      {
        _id: 3,
        text: "I really didn't know about this",
        createdAt: new Date(Date.UTC(2012, 3, 14, 9, 20, 0)),
        user: {
          _id: 5,
          name: "Aaron",
          avatar: "https://placeimg.com/140/140/any",
        },
        image: "https://placeimg.com/960/540/any",
      },
      {
        _id: 4,
        text: "It's okay though because I think this works! 💯",
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
    ],
  },

  /******************************** ROOM #4 Messages ***********************************/
  {
    room_id: 5004,
    messages: [
      {
        _id: 1,
        text: "Ice cream is the best!",
        createdAt: new Date(Date.UTC(2016, 5, 12, 17, 20, 0)),
        user: {
          _id: 2,
          name: "User One",
          avatar: "https://placeimg.com/140/140/any",
        },
      },
      {
        _id: 2,
        text: "Do you know what's funnier than 24......25!",
        createdAt: new Date(Date.UTC(2016, 5, 13, 17, 20, 0)),
        user: {
          _id: 5,
          name: "Aaron",
          avatar: "https://placeimg.com/140/140/any",
        },
        image: "https://placeimg.com/960/540/any",
      },
      {
        _id: 3,
        text: "This was really cool!",
        createdAt: new Date(Date.UTC(2012, 3, 14, 9, 20, 0)),
        user: {
          _id: 5,
          name: "Aaron",
          avatar: "https://placeimg.com/140/140/any",
        },
        image: "https://placeimg.com/960/540/any",
      },
      {
        _id: 4,
        text: "We out to McDonald's later?",
        createdAt: new Date(Date.UTC(2017, 5, 14, 17, 20, 0)),
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
        text: "I'm Starving!",
        createdAt: new Date(Date.UTC(2016, 5, 15, 18, 20, 0)),
        user: {
          _id: 2,
          name: "User Two",
          avatar: "https://placeimg.com/140/140/any",
        },
      },
    ],
  },
  /******************************** ROOM #5 Messages ***********************************/
  {
    room_id: 5005,
    messages: [
      {
        _id: 1,
        text: "Still though, it's an important story",
        createdAt: new Date(Date.UTC(2016, 5, 12, 17, 20, 0)),
        user: {
          _id: 2,
          name: "User One",
          avatar: "https://placeimg.com/140/140/any",
        },
      },
      {
        _id: 2,
        text: "Every one of us has been created in the image of God",
        createdAt: new Date(Date.UTC(2016, 5, 13, 17, 20, 0)),
        user: {
          _id: 5,
          name: "Aaron",
          avatar: "https://placeimg.com/140/140/any",
        },
        image: "https://placeimg.com/960/540/any",
      },
      {
        _id: 3,
        text:
          "Asking someone for their name is extremely practical and important!",
        createdAt: new Date(Date.UTC(2012, 3, 14, 9, 20, 0)),
        user: {
          _id: 5,
          name: "Aaron",
          avatar: "https://placeimg.com/140/140/any",
        },
        image: "https://placeimg.com/960/540/any",
      },
      {
        _id: 4,
        text: "Taco Bell doesn't make my stomach well 😏",
        createdAt: new Date(Date.UTC(2017, 5, 14, 17, 20, 0)),
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
        createdAt: new Date(Date.UTC(2016, 6, 15, 17, 20, 0)),
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
        text: "I'm gone 🏃🏾‍♂️💨",
        createdAt: new Date(Date.UTC(2016, 5, 15, 18, 20, 0)),
        user: {
          _id: 2,
          name: "User Two",
          avatar: "https://placeimg.com/140/140/any",
        },
      },
    ],
  },
  /******************************** ROOM #6 Messages ***********************************/
  {
    room_id: 5006,
    messages: [
      {
        _id: 1,
        text: "For sure bro",
        createdAt: new Date(Date.UTC(2016, 5, 12, 17, 20, 0)),
        user: {
          _id: 2,
          name: "User One",
          avatar: "https://placeimg.com/140/140/any",
        },
      },
      {
        _id: 2,
        text: "Mini golfing is soooo fun!",
        createdAt: new Date(Date.UTC(2016, 9, 13, 17, 20, 0)),
        user: {
          _id: 5,
          name: "Aaron",
          avatar: "https://placeimg.com/140/140/any",
        },
        image: "https://placeimg.com/960/540/any",
      },
      {
        _id: 3,
        text: "I heard the other day that LeBron is the GOAT 🔥",
        createdAt: new Date(Date.UTC(2012, 3, 14, 9, 20, 0)),
        user: {
          _id: 5,
          name: "Aaron",
          avatar: "https://placeimg.com/140/140/any",
        },
        image: "https://placeimg.com/960/540/any",
      },
      {
        _id: 4,
        text: "I'm about to get some Jordan retros 😍",
        createdAt: new Date(Date.UTC(2017, 5, 14, 17, 20, 0)),
        user: {
          _id: 2,
          name: "User Two",
          avatar: "https://placeimg.com/140/140/any",
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
        text: "Straight facts!",
        createdAt: new Date(Date.UTC(2016, 5, 15, 18, 20, 0)),
        user: {
          _id: 2,
          name: "User Two",
          avatar: "https://placeimg.com/140/140/any",
        },
      },
    ],
  },
];

export default messages;
