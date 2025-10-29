const destinations = [
  {name: 'Manali', type: 'mountains', cost: 15000, img: 'https://images.unsplash.com/photo-1505761671935-60b3a7427bad', lat: 32.2396, lng: 77.1887},
  {name: 'Goa', type: 'beach', cost: 20000, img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e', lat: 15.2993, lng: 74.1240},
  {name: 'Delhi', type: 'city', cost: 12000, img: 'https://images.unsplash.com/photo-1582622064825-2c2a5ee1a978', lat: 28.6139, lng: 77.2090},
  {name: 'Agra', type: 'historical', cost: 10000, img: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1', lat: 27.1767, lng: 78.0081}
];

let map;

function initMap() {
  map = new google.maps.Map(document.getElementById('map-view'), {
    center: { lat: 20.5937, lng: 78.9629 },
    zoom: 5
  });
}
window.onload = initMap;

// Recommendation logic
document.getElementById('recommend-btn').addEventListener('click', () => {
  const budget = document.getElementById('budget').value;
  const preference = document.getElementById('preference').value;
  const list = document.getElementById('recommendation-list');
  list.innerHTML = '';

  const filtered = destinations.filter(d => d.cost <= budget && d.type === preference);

  if (filtered.length === 0) {
    list.innerHTML = '<p>No destinations match your criteria. Try adjusting budget or preference.</p>';
    return;
  }

  filtered.forEach(dest => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
      <img src="${dest.img}" alt="${dest.name}">
      <div class="card-content">
        <h3>${dest.name}</h3>
        <p>Approx. Cost: ₹${dest.cost}</p>
        <button onclick="viewOnMap(${dest.lat}, ${dest.lng}, '${dest.name}')">View on Map</button>
      </div>
    `;
    list.appendChild(card);
  });
});

function viewOnMap(lat, lng, name) {
  map.setCenter({lat, lng});
  map.setZoom(10);
  new google.maps.Marker({
    position: {lat, lng},
    map,
    title: name
  });
}

// Review module
const reviewForm = document.getElementById('review-form');
const reviewList = document.getElementById('review-list');
reviewForm.addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('username').value;
  const text = document.getElementById('userreview').value;

  const reviewItem = document.createElement('div');
  reviewItem.classList.add('review-item');
  reviewItem.innerHTML = `<strong>${name}</strong><p>${text}</p>`;
  reviewList.appendChild(reviewItem);
  reviewForm.reset();
  localStorage.setItem('reviews', reviewList.innerHTML);
});
window.addEventListener('load', () => {
  initMap();
  reviewList.innerHTML = localStorage.getItem('reviews') || '';
});

// ------------------------------
// 💬 Chatbot Logic
// ------------------------------
const toggleBtn = document.getElementById('chatbot-toggle');
const chatContainer = document.getElementById('chatbot-container');
const closeBtn = document.getElementById('chatbot-close');
const sendBtn = document.getElementById('chatbot-send');
const inputField = document.getElementById('chatbot-input');
const chatMessages = document.getElementById('chatbot-messages');

toggleBtn.onclick = () => chatContainer.style.display = 'flex';
closeBtn.onclick = () => chatContainer.style.display = 'none';

sendBtn.onclick = sendMessage;
inputField.addEventListener('keypress', e => {
  if (e.key === 'Enter') sendMessage();
});

function sendMessage() {
  const text = inputField.value.trim();
  if (!text) return;
  appendMessage('user', text);
  inputField.value = '';
  setTimeout(() => botReply(text), 800);
}

function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender === 'user' ? 'user-message' : 'bot-message');
  msg.textContent = text;
  chatMessages.appendChild(msg);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Basic AI responses
function botReply(text) {
  text = text.toLowerCase();
  let reply = "I'm here to help you plan your trip!";

  if (text.includes('hello') || text.includes('hi')) reply = "Hi there! 👋 How can I assist your travel today?";
  else if (text.includes('beach')) reply = "You’ll love Goa or Pondicherry for great beach vibes under ₹20,000.";
  else if (text.includes('mountain')) reply = "Manali, Shimla, or Darjeeling are great for mountain lovers!";
  else if (text.includes('historical')) reply = "Agra and Jaipur are full of heritage spots and rich culture!";
  else if (text.includes('cheap') || text.includes('low budget')) reply = "Try exploring Agra or Delhi — affordable and rich in attractions.";
  else if (text.includes('recommend')) reply = "Tell me your budget and preference — I’ll suggest places!";
  else if (text.includes('map')) reply = "Use the map section below to view routes and nearby spots.";
  else reply = "Hmm... could you tell me your preference (mountains, beach, city, or historical)?";

  appendMessage('bot', reply);
}
