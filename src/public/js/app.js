const messageList = document.querySelector("ul");
const massageForm = document.querySelector("#message");
const nickForm = document.querySelector("#nick");

const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener("open", () => {
  console.log("Connected to Server ✅");
});

socket.addEventListener("message", (message) => {
  const li = document.createElement("li");
  li.innerText = message.data;
  messageList.append(li);
  console.log("New massage : ", message.data);
});

socket.addEventListener("close", () => {
  console.log("Disconnected from Server 🚫");
});

setTimeout(() => {
  socket.send("hello from the browser!");
}, 5000);

const handleSubmit = (event) => {
  event.preventDefault();
  const input = massageForm.querySelector("input");
  socket.send(input.value);
  input.value = "";
};

const handleNickSubmit = (event) => {
  event.preventDefault();
  const input = nickForm.querySelector("input");
  socket.send(input.value);
  input.value = "";
};

massageForm.addEventListener("submit", handleSubmit);
nickForm.addEventListener("submit", handleNickSubmit);
