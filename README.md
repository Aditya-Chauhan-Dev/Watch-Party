# 🎬 Watch Party

A real-time YouTube Watch Party platform where multiple users can watch videos together in sync. The host controls video playback while participants experience synchronized play, pause, seek, and video changes instantly through Socket.IO.

## 🚀 Live Demo

🔗 **Frontend:** https://watch-party-frontend-5x08.onrender.com


> Replace the above URLs with your deployed frontend and backend links.

---

## ✨ Features

### 🎥 Real-Time Video Synchronization
- Synchronized YouTube playback for all users
- Play/Pause synchronization
- Seek synchronization
- Video change synchronization

### 👑 Host Controls
- Only the host can control playback
- Participants automatically receive updates
- Prevents unauthorized video actions

### 👥 Room Management
- Create watch rooms instantly
- Join rooms using room codes
- Real-time participant tracking
- Automatic state sync for newly joined users

### ⚡ Real-Time Communication
- Powered by Socket.IO
- Instant updates across all connected users
- Low-latency synchronization

### 📱 Responsive UI
- Mobile-friendly design
- Modern and clean interface
- Optimized viewing experience

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Tailwind CSS
- React Router
- React YouTube

### Backend
- Node.js
- Express.js
- Socket.IO

### Real-Time Communication
- WebSockets (Socket.IO)

### Video Integration
- YouTube IFrame Player API

---

## 📂 Project Structure

```bash
Watch-Party/
│
├── client/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/
│   ├── src/
│   └── package.json
│
└── README.md
```

---

## 📥 Installation

### 1. Clone Repository

```bash
git clone https://github.com/Aditya-Chauhan-Dev/Watch-Party.git
```

### 2. Move Into Project

```bash
cd Watch-Party
```

---

## 🔧 Backend Setup

```bash
cd Backend
npm install
```

Create a `.env` file:

```env
PORT=5000
CLIENT_URL=http://localhost:5173
```

Run backend:

```bash
npm run dev
```

---

## 🎨 Frontend Setup

```bash
cd Frontend
npm install
```

Run frontend:

```bash
npm run dev
```

---

## 🚀 Usage

### Create a Room
1. Open the application
2. Click **Create Room**
3. Share the generated room code

### Join a Room
1. Enter your name
2. Enter the room code
3. Click **Join Room**

### Watch Together
- Host controls the video
- Participants stay synchronized automatically
- Any play, pause, seek, or video change is reflected instantly for everyone

---

## 🔄 Supported Synchronization Events

- ✅ Play Video
- ✅ Pause Video
- ✅ Seek Video
- ✅ Change Video
- ✅ Join Room State Sync
- ✅ Participant Updates

---


## 🤝 Contributing

Contributions, issues, and feature requests are welcome.

Fork the repository and create a pull request.

---

## 📜 License

This project is licensed under the MIT License.

---

## 👨‍💻 Developer

**Aditya Chauhan**

GitHub: https://github.com/Aditya-Chauhan-Dev

If you like this project, consider giving it a ⭐ on GitHub.