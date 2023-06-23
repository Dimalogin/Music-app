function formatTime(time: number): string {
  if (time > 0) {
    const restSec = time % 60;
    const min = (time - restSec) / 60;

    return `${String(min).padStart(2, "0")}:${String(restSec).padStart(
      2,
      "0"
    )}`;
  }

  return "00:00";
}

export default formatTime;
