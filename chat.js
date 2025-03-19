// Firebase Configuration

  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  
  /* ---------------- Chat Functionality ---------------- */
  // Send message to Firestore
  async function sendMessage(state, message) {
    if (!state || !message) {
      alert("State and message are required!");
      return;
    }
  
    await db.collection("chatrooms").doc(state).collection("messages").add({
      text: message,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
  
    console.log("Message sent!");
  }
  
  // Load messages for a state
  async function loadMessages(state) {
    const messagesRef = db.collection("chatrooms").doc(state).collection("messages").orderBy("timestamp");
    const snapshot = await messagesRef.get();
  
    let chatBox = document.getElementById("chatBox");
    chatBox.innerHTML = ""; // Clear previous messages
  
    snapshot.forEach((doc) => {
      let message = doc.data().text;
      chatBox.innerHTML += `<p>${message}</p>`;
    });
  }
  
  /* ---------------- Leaderboard Functionality ---------------- */
  async function loadLeaderboard() {
    const leaderboardRef = db.collection("leaderboard").orderBy("points", "desc");
    const snapshot = await leaderboardRef.get();
  
    let leaderboardBox = document.getElementById("leaderboard");
    leaderboardBox.innerHTML = ""; // Clear previous leaderboard
  
    snapshot.forEach((doc) => {
      let user = doc.data();
      leaderboardBox.innerHTML += `<p>${user.name}: ${user.points} points</p>`;
    });
  }
  
  /* ---------------- Donation Functionality ---------------- */
  async function donate(amount) {
    const stripePublicKey = "YOUR_STRIPE_PUBLIC_KEY"; // Replace with your Stripe public key
  
    const response = await fetch("https://api.stripe.com/v1/payment_intents", {
      method: "POST",
      headers: {
        "Authorization": `Bearer YOUR_STRIPE_SECRET_KEY`, // Replace with your Stripe secret key
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        amount: amount * 100, // Convert to cents
        currency: "usd",
        payment_method_types: ["card"],
      }),
    });
  
    const paymentIntent = await response.json();
    console.log("Payment initiated:", paymentIntent);
  }
  
  /* ---------------- UI Event Listeners ---------------- */
  document.getElementById("sendMessageBtn").addEventListener("click", () => {
    let state = document.getElementById("stateSelect").value;
    let message = document.getElementById("messageInput").value;
    sendMessage(state, message);
  });
  
  document.getElementById("donateButton").addEventListener("click", () => {
    let amount = prompt("Enter donation amount:");
    if (amount) donate(amount);
  });
  
  // Load leaderboard on page load
  window.onload = () => {
    loadLeaderboard();
  };
  