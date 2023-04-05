document.addEventListener("DOMContentLoaded", function () {
	
    const inputBox = document.getElementById("inputBox");
    const sendButton = document.getElementById("sendButton");
    const chatHistory = document.getElementById("chatHistory");

	//add a function to toggle the inputBox event listeners so that they are deactived while ajax is running

    // Send message on pressing 'Enter'
    inputBox.addEventListener("keydown", function (event) {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    });

    // Send message on clicking the send button
    sendButton.addEventListener("click", sendMessage);

    function sendMessage() {
        const message = inputBox.value.trim();
        if (message.length > 0) {
            addMessageToChat("user", message);
            inputBox.value = "";
            inputBox.style.height = "auto";
			document.querySelector(".spinner").classList.toggle("spinner-hidden");
			$.ajax({
				type: "POST",
				url: "/btnSubmit",
				data: {
					query: message
				},
				dataType: "json",
				success: function(response) {
					document.querySelector(".spinner").classList.toggle("spinner-hidden");
					const q = response.query;
					const r = response.response;
					const dataAsString = JSON.stringify({query: q, response: r});
					addMessageToChat("response", r);
				},
				error: function(xhr, status, error) {
					console.log(error);
				}
			});
        }
    }

    function addMessageToChat(type, messageText) {
        const messageElement = document.createElement("div");
        messageElement.classList.add("message");
        messageElement.classList.add(type === "user" ? "user-message" : "response-message");
        messageElement.textContent = messageText;
        chatHistory.appendChild(messageElement);
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    // Adjust the height of the input box as the user types
    inputBox.addEventListener("input", function () {
        inputBox.style.height = "auto";
        inputBox.style.height = inputBox.scrollHeight + "px";
    });
	
});
