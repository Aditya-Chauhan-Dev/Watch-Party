import { useEffect, useState, useRef } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { socket } from "../socket/socket";
import YouTube from "react-youtube";
import { PiUsersThreeBold } from "react-icons/pi";

export default function Room() {
  const { id } = useParams();

  const location = useLocation();
  const navigate = useNavigate();

  const username = location.state?.username;

  const [participants, setParticipants] = useState([]);
  const playerRef = useRef(null);

  const [roomState, setRoomState] = useState(null);
  const [videoId, setVideoId] = useState("xeXV1KoX034");
  const [newVideoId, setNewVideoId] = useState("");
  const [myRole, setMyRole] = useState("participant");
  const lastTime = useRef(0);

  const joinedRef = useRef(false);

  const onReady = (event) => {
    playerRef.current = event.target;
  };

  const onStateChange = (event) => {
    if (myRole === "participant") {
      if (event.data === 1) {
        if (!roomState?.isPlaying) {
          playerRef.current?.pauseVideo();
        }
      }

      if (event.data === 2) {
        if (roomState?.isPlaying) {
          playerRef.current?.playVideo();
        }
      }

      return;
    }

    if (event.data === 1) {
      socket.emit("play", {
        roomId: id,
      });
    }

    if (event.data === 2) {
      socket.emit("pause", {
        roomId: id,
      });
    }
  };

  const extractVideoId = (input) => {
    try {
      if (input.length === 11 && !input.includes("http")) {
        return input.trim();
      }

      const url = new URL(input);

      const v = url.searchParams.get("v");
      if (v) return v;

      if (url.hostname.includes("youtu.be")) {
        return url.pathname.slice(1);
      }

      return input.trim();
    } catch {
      return input.trim();
    }
  };

  useEffect(() => {
    if (!joinedRef.current) {
      joinedRef.current = true;

      socket.emit("join_room", {
        roomId: id,
        username,
      });
    }

    socket.on("user_joined", (data) => {
      setParticipants(data);

      const me = data.find((user) => user.username === username);

      if (me) {
        setMyRole(me.role);
      }
    });

    socket.on("sync_state", (data) => {
      setRoomState(data);

      if (data?.videoId) {
        setVideoId(data.videoId);
      }
    });

    socket.on("play", () => {
      playerRef.current?.playVideo();

      setRoomState((prev) => ({
        ...(prev || {}),
        isPlaying: true,
      }));
    });

    socket.on("pause", () => {
      playerRef.current?.pauseVideo();

      setRoomState((prev) => ({
        ...(prev || {}),
        isPlaying: false,
      }));
    });

    socket.on("seek", (time) => {
      playerRef.current?.seekTo(time, true);

      setRoomState((prev) => ({
        ...(prev || {}),
        currentTime: time,
      }));
    });

    socket.on("change_video", (newVideoId) => {
      setVideoId(newVideoId);

      setRoomState((prev) => ({
        ...prev,
        videoId: newVideoId,
      }));
    });

    socket.on("role_assigned", (participants) => {
      setParticipants(participants);

      const me = participants.find((user) => user.username === username);

      if (me) {
        setMyRole(me.role);
      }
    });

    socket.on("participant_removed", (participants) => {
      setParticipants(participants);
    });

    socket.on("kicked", () => {
      alert("You were removed by host");
      navigate("/");
    });

    return () => {
      socket.off("user_joined");
      socket.off("sync_state");
      socket.off("play");
      socket.off("pause");
      socket.off("seek");
      socket.off("change_video");
      socket.off("role_assigned");
      socket.off("participant_removed");
      socket.off("kicked");
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if ((myRole === "host" || myRole === "moderator") && playerRef.current) {
        const currentTime = playerRef.current.getCurrentTime();

        if (Math.abs(currentTime - lastTime.current) > 3) {
          socket.emit("seek", {
            roomId: id,
            time: currentTime,
          });
        }

        lastTime.current = currentTime;
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [id, myRole]);

  if (!username) {
    return <h2>Please Join From Home Page</h2>;
  }

  return (
    <div className="room flex flex-col items-center justify-evenly ">
      <h2 className="text-4xl">Room : {id}</h2>

      <div className="main_frame flex flex-col lg:flex-row gap-5 w-full">
        {/* Participants */}
        <div className="flex flex-col w-full lg:w-[400px]">
          <div className="flex items-center justify-center gap-2 text-2xl w-full">
            <h3>Participants</h3>
            <PiUsersThreeBold className="text-4xl" />
          </div>

          <div className="h-full border-2 px-3 py-2 rounded border-gray-500">
            {participants.map((user) => (
              <div
                key={user._id}
                className="details flex flex-wrap items-center gap-2 py-1"
              >
                {user.username} - {user.role}
                {myRole === "host" && user.role !== "host" && (
                  <button
                    onClick={() =>
                      socket.emit("remove_participant", {
                        roomId: id,
                        targetSocketId: user.socketId,
                      })
                    }
                  >
                    Remove
                  </button>
                )}
                {myRole === "host" && user.role === "participant" && (
                  <button
                    onClick={() =>
                      socket.emit("assign_role", {
                        roomId: id,
                        targetSocketId: user.socketId,
                        role: "moderator",
                      })
                    }
                  >
                    Make Moderator
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Video Section */}
        <div className="flex-1 w-full">
          <div className="w-full max-w-[900px] mx-auto aspect-video">
            <YouTube
              className="youtube"
              key={videoId}
              videoId={videoId}
              onReady={onReady}
              onStateChange={onStateChange}
              opts={{
                width: "100%",
                height: "100%",
                playerVars: {
                  controls: myRole === "participant" ? 0 : 1,
                  disablekb: myRole === "participant" ? 1 : 0,
                },
              }}
            />
          </div>

          {/* Controls */}
          <div className="controls flex flex-wrap items-center justify-center gap-3 pt-3 pb-3">
            <button
              disabled={myRole === "participant"}
              onClick={() =>
                socket.emit("play", {
                  roomId: id,
                })
              }
            >
              Play
            </button>

            <button
              disabled={myRole === "participant"}
              onClick={() =>
                socket.emit("pause", {
                  roomId: id,
                })
              }
            >
              Pause
            </button>

            <button
              disabled={myRole === "participant"}
              onClick={() =>
                socket.emit("seek", {
                  roomId: id,
                  time: 120,
                })
              }
            >
              Seek 120s
            </button>

            <div className="border-2 flex w-full md:w-auto overflow-hidden rounded">
              <input
                className="px-3 py-2 flex-1 min-w-0"
                placeholder="YouTube Video ID"
                value={newVideoId}
                onChange={(e) => setNewVideoId(e.target.value)}
              />

              <button
                className="border-l-2 px-3"
                disabled={myRole === "participant"}
                onClick={() => {
                  if (!newVideoId.trim()) {
                    alert("Enter YouTube URL or Video ID");
                    return;
                  }

                  const extractedVideoId = extractVideoId(newVideoId);

                  socket.emit("change_video", {
                    roomId: id,
                    videoId: extractedVideoId,
                  });
                }}
              >
                Change Video
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
