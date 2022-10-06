const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");

const room = document.getElementById("room");
room.hidden = true;

let roomName;

const addMassage = (message) => {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
};

const showRoom = () => {
  room.hidden = false;
  welcome.hidden = true;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName}`;

  const msgForm = room.querySelector("#msg");
  const nameForm = room.querySelector("#name");
  msgForm.addEventListener("submit", handleMassageSubmit);
  nameForm.addEventListener("submit", handleNicknameSubmit);
};

const handleMassageSubmit = (event) => {
  event.preventDefault();
  const input = room.querySelector("#msg input");
  const value = input.value;
  socket.emit("new_massage", input.value, roomName, () => {
    addMassage(`You: ${value}`);
  });
};

const handleNicknameSubmit = (event) => {
  event.preventDefault();
  const input = room.querySelector("#name input");
  const value = input.value;
  socket.emit("nickname", input.value);
};

const handleRoomSubmit = (event) => {
  event.preventDefault();
  const input = form.querySelector("input");
  socket.emit("enter_room", input.value, showRoom);
  roomName = input.value;
  input.value = "";
};

form.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", (user) => {
  addMassage(`${user} arrived!`);
});

socket.on("bye", (left) => {
  addMassage(`${left} someone left ㅜㅜ`);
});

socket.on("new_massage", addMassage);
