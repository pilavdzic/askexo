document.addEventListener("DOMContentLoaded", function () {
	
	var queryInProcess = false;
	
    const inputBox = document.getElementById("inputBox");
    const sendButton = document.getElementById("sendButton");
    const chatHistory = document.getElementById("chatHistory");

    // Send message on pressing 'Enter'
    inputBox.addEventListener("keydown", function (event) {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
			if (!queryInProcess){
				sendMessage();
				queryInProcess = true;	
			}
        }
    });

    // Send message on clicking the send button
    sendButton.addEventListener("click", function(){
		if (!queryInProcess){
				sendMessage();
				queryInProcess = true;	
			}
	});

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
					queryInProcess = false;
					//const q = response.query;
					const r = response.response;
					if (Object.keys(response.frontendDiagnostics).length !== 0){
					  console.log('tokens: ' + response.frontendDiagnostics.tokens);
					  console.log('finish reason: ' + response.frontendDiagnostics.finishReason);
					}
					//const dataAsString = JSON.stringify({query: q, response: r});
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
	
	
	var alternate = true;
	var counter = 0;
	function addComment(){
		counter += 1;
		var type = alternate ? 'user' : 'not_user';
		addMessageToChat(type, 'test message ' + counter)
		if (alternate){
			alternate = false;
		}
		else {
			alternate = true;
		}
	}
	setInterval(addComment,2000)
	////////////////
});
