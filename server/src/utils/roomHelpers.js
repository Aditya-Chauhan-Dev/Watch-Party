const getParticipant = (room, socketId) => {
  return room.participants.find(
    (participant) => participant.socketId === socketId,
  );
};

const getRole = (room, socketId) => {
  const participant = getParticipant(room, socketId);

  if (!participant) return null;

  return participant.role;
};

module.exports = {
  getParticipant,
  getRole,
};
