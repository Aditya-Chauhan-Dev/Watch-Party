const canControlPlayback = (role) => {
  return role === "host" || role === "moderator";
};

const isHost = (role) => {
  return role === "host";
};

module.exports = {
  canControlPlayback,
  isHost,
};
