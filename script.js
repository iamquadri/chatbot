

const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbotCloseBtn = document.querySelector(".close-btn");




let userMessage; 
const API_KEY = "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"
// const API_KEY = "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";
const inputInitHeight = chatInput.scrollHeight;

const createChaLi  = (message, className) => {
    // create a chat <li> element with passed and className 
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p>${message}</p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;

}

const generateResponse = (incomingChatLi) => {
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const messaageElement = incomingChatLi.querySelector("p");

    const requestOPtions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{role: "user", content: userMessage }],

        })
    }

    // Send POST request to API, get response 
    fetch(API_URL, requestOPtions).then(res => res.json()).then(data => {
        messaageElement.textContent = data.choices[0].message.content;
    }).catch((error) => {
        messaageElement.classList.add("error");
        messaageElement.textContent = "Oops! Something went wrong. Please try again.";
    }).finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
}

const handlechat = () => {
    userMessage = chatInput.value.trim();
    if(!userMessage) return;
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;

    // Append the users message to the chatbox
    chatbox.appendChild(createChaLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    setTimeout(() => {
        // Display "Thinking..." messaage while waiting for the response
        const incomingChatLi = createChaLi("Thinking....", "incoming")
        chatbox.appendChild(incomingChatLi)
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600);
    
    // chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
}

chatInput.addEventListener("input", () => {
    // Adjust the height of the input textarea based on its content
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
})


chatInput.addEventListener("keydown", (e) => {
    // if Enter key is pressed without Shift key and the window
    // Width is greater than 800px, handle the chat
    if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handlechat()
    }
    
    
})


sendChatBtn.addEventListener("click", handlechat);
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
chatbotCloseBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));

























