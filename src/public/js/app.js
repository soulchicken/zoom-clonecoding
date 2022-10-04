const messageList = document.querySelector("ul");
const massageForm = document.querySelector("#message");
const nickForm = document.querySelector("#nick");

const socket = new WebSocket(`ws://${window.location.host}`);

const makeMassage = (type, payload) => {
  return JSON.stringify({ type, payload });
};

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

const handleMassageSubmit = (event) => {
  event.preventDefault();
  const input = massageForm.querySelector("input");
  socket.send(makeMassage("new_massage", input.value));
  input.value = "";
};

const handleNickSubmit = (event) => {
  event.preventDefault();
  const input = nickForm.querySelector("input");
  socket.send(makeMassage("nickname", input.value));
  input.value = "";
};

massageForm.addEventListener("submit", handleMassageSubmit);
nickForm.addEventListener("submit", handleNickSubmit);
