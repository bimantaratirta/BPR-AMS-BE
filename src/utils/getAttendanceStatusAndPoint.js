function getAttendanceStatusAndPoint(checkInTime) {
  const hour = checkInTime.getHours();
  const minute = checkInTime.getMinutes();
  const totalMinutes = hour * 60 + minute;

  const eightAM = 8 * 60;
  const eightThirty = 8 * 60 + 30;

  if (totalMinutes <= eightAM) {
    return { status: "HADIR", points: 1 };
  }

  if (totalMinutes <= eightThirty) {
    return { status: "TERLAMBAT", points: 0.5 };
  }

  return { status: "TERLAMBAT", points: 0 };
}

export default getAttendanceStatusAndPoint;
