const rooms = [
  /******************************** ROOM #1 ***********************************/
  {
    _id: 5001,
    name: null,
    group: false,
    createdAt: new Date(Date.UTC(2016, 5, 12, 17, 20, 0)),
    lastUpdated: new Date(Date.UTC(2016, 5, 12, 17, 20, 0)),
    roomImage: "https://placeimg.com/140/140/any",
    users: [
      {
        _id: 1,
        name: "Ari DosPassos",
        avatar: "https://placeimg.com/140/140/any",
      },
    ],
  },
  /******************************** ROOM #2 ***********************************/
  {
    _id: 5002,
    name: null,
    createdAt: new Date(Date.UTC(2016, 5, 13, 17, 20, 0)),
    lastUpdated: new Date(Date.UTC(2016, 5, 13, 23, 20, 0)),
    roomImage: "https://placeimg.com/140/140/any",
    group: true,
    users: [
      {
        _id: 2,
        name: "Jahnuel Dorelus",
        avatar: "https://placeimg.com/140/140/any",
      },
      {
        _id: 3,
        name: "Dr.Tuck",
        avatar: "https://placeimg.com/140/140/any",
      },
      {
        _id: 6,
        name: "Harvard",
        avatar: "https://placeimg.com/140/140/any",
      },
      {
        _id: 6,
        name: "Dr. Senning",
        avatar: "https://placeimg.com/140/140/any",
      },
      {
        _id: 6,
        name: "Dr. Crisman",
        avatar: "https://placeimg.com/140/140/any",
      },
    ],
    image: "https://placeimg.com/960/540/any",
  },
  /******************************** ROOM #3 ***********************************/
  {
    _id: 5003,
    name: null,
    createdAt: new Date(Date.UTC(2016, 3, 12, 17, 20, 0)),
    lastUpdated: new Date(Date.UTC(2016, 5, 14, 17, 20, 0)),
    roomImage: "https://placeimg.com/140/140/any",
    group: false,
    users: [
      {
        _id: 3,
        name: "Dr.Tuck",
        avatar: "https://placeimg.com/140/140/any",
      },
    ],
  },
  /******************************** ROOM #4 ***********************************/
  {
    _id: 5004,
    name: "Internet Programming",
    createdAt: new Date(Date.UTC(2016, 5, 15, 17, 20, 0)),
    lastUpdated: new Date(Date.UTC(2016, 5, 17, 6, 20, 0)),
    roomImage: "https://placeimg.com/140/140/any",
    group: true,
    users: [
      {
        _id: 4,
        name: "Suzy Williams",
        avatar: "https://placeimg.com/140/140/any",
      },
      {
        _id: 6,
        name: "Harvard",
        avatar: "https://placeimg.com/140/140/any",
      },
    ],
  },
  /******************************** ROOM #5 ***********************************/
  {
    _id: 5005,
    name: null,
    createdAt: new Date(Date.UTC(2016, 7, 12, 17, 20, 0)),
    lastUpdated: new Date(Date.UTC(2016, 8, 15, 18, 20, 0)),
    roomImage: "https://placeimg.com/140/140/any",
    group: false,
    users: [
      {
        _id: 5,
        name: "Steve Jobs",
        avatar: "https://placeimg.com/140/140/any",
      },
    ],
  },
  /******************************** ROOM #6 ***********************************/
  {
    _id: 5006,
    name: null,
    createdAt: new Date(Date.UTC(2016, 5, 13, 17, 25, 0)),
    lastUpdated: new Date(Date.UTC(2016, 10, 4, 6, 20, 0)),
    roomImage: "https://placeimg.com/140/140/any",
    group: false,
    users: [
      {
        _id: 6,
        name: "Harvard",
        avatar: "https://placeimg.com/140/140/any",
      },
    ],
  },
];

export default rooms;
