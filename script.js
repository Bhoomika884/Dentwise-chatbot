let prompt = document.querySelector("#prompt");
let chatContainer = document.querySelector(".chat-container");
let submitBtn = document.querySelector("#submit");

// Gemini API setup
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";
const API_KEY = "your api Key"; // 🔒 Replace with your API key

let user = {
  data: null,
};

// Generate AI response restricted to dental topics
async function generateResponse(aiChatBox) {
  let text = aiChatBox.querySelector(".ai-chat-area");

  const systemPrompt = `
  You are Dentwise AI — a professional dental assistant chatbot.
  Your role is to provide information and guidance ONLY about:
  - Dental health
  - Oral hygiene
  - Common dental problems (toothache, cavities, gum issues, etc.)
  - Dental treatments, appointments, and prevention tips.
  If a user asks about any non-dental topic, respond with:
  "I'm sorry, but I can only help with dental or oral health-related questions."
  Keep responses friendly, short, and professional.
  `;

  let requestBody = {
    contents: [
      {
        parts: [
          { text: systemPrompt },
          { text: user.data },
        ],
      },
    ],
  };

  try {
    let response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    let data = await response.json();

    if (!data.candidates || !data.candidates[0]) {
      text.innerHTML = "⚠️ No response from AI. Please try again.";
      return;
    }

    let apiResponse = data.candidates[0].content.parts[0].text
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .trim();

    text.innerHTML = apiResponse;
  } catch (error) {
    console.error(error);
    text.innerHTML = "⚠️ Server error (503). Please try again later.";
  } finally {
    chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" });
  }
}

// Create chat box element
function createChatBox(html, classes) {
  let div = document.createElement("div");
  div.innerHTML = html;
  div.classList.add(classes);
  return div;
}

// Handle user input
function handleChatResponse(message) {
  if (!message.trim()) return;

  user.data = message;

 let userHtml = `
    <div class="user-chat-box">
      <img src="user2-removebg-preview.png" alt="User" id="userImage" width="50">
      <div class="user-chat-area">${user.data}</div>
    </div>`;

  chatContainer.insertAdjacentHTML("beforeend", userHtml);
  prompt.value = "";
  chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" });

  // Add AI response box
  setTimeout(() => {
    let aiHtml = `
      <div class="ai-chat-box">
        <img src="bot3-removebg-preview.png" alt="AI Bot" id="aiImage" width="70">
        <div class="ai-chat-area">⏳ Typing...</div>
      </div>`;
    chatContainer.insertAdjacentHTML("beforeend", aiHtml);
    generateResponse(chatContainer.lastElementChild);
  }, 500);
}

// Event listeners
submitBtn.addEventListener("click", () => handleChatResponse(prompt.value));
prompt.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleChatResponse(prompt.value);
});


