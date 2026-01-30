const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');
const conversation = [];

form.addEventListener('submit', async function (e) {
  e.preventDefault();
  
  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendMessage('user', userMessage);
  conversation.push({ role: 'user', text: userMessage });
  input.value = '';

  // Show temporary bot message
  const botMessageElement = appendMessage('bot', 'Thinking...');

  try {
    const response = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ conversation })
    });

    if (!response.ok) throw new Error('Network response was not ok');

    const data = await response.json();

    if (data.result) {
      botMessageElement.textContent = data.result;
    } else {
      botMessageElement.textContent = 'Sorry, no response received.';
    }
  } catch (error) {
    console.error('Error:', error);
    botMessageElement.textContent = 'Failed to get response from server.';
  }

  chatBox.scrollTop = chatBox.scrollHeight;
});

function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;

  return msg;
}
