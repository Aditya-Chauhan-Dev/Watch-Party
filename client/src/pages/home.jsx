import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ImUsers } from "react-icons/im";

export default function Home() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");

  const [roomId, setRoomId] = useState("");

  const joinRoom = () => {
    if (!username || !roomId) {
      alert("Fill all fields");
      return;
    }

    navigate(`/room/${roomId}`, {
      state: {
        username,
      },
    });
  };

  return (
    <div className="login_page flex flex-col justify-evenly items-center">
      <div className="text-white flex flex-col items-center gap-2 text-center">
        <h1 className="text-4xl font-semibold">
          Watch Together.
          <span className="block bg-gradient-to-b from-[#FF5E8A] via-[#FF4D7A] to-[#E63E6D] bg-clip-text text-transparent">
            Anywhere.
          </span>
        </h1>
        <h4 className="">Create or join a room and enjoy together</h4>
      </div>

      <div className="login_form rounded-3xl w-[30%] h-1/2 flex flex-col justify-evenly items-center text-white ">
        <div className="flex flex-col items-center">
          <div className="flex flex-col items-center gap-3">
            <div className="border-2 rounded-full h-15 w-15 flex items-center justify-center">
              <ImUsers className="text-4xl" />
            </div>
            <h1 className="text-3xl">Join Room</h1>
          </div>
          <h4 className="text-m text-gray-400 ">
            Enter your details to get started
          </h4>
        </div>

        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          placeholder="Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />

        <button onClick={joinRoom}>Join Room</button>
      </div>
    </div>
  );
}
