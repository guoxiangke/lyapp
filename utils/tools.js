export const getTodayString = () => {
    const d = new Date(); //2022-03-18
    const year = d.getFullYear()
    const month = `${d.getMonth() + 1}`.padStart(2, "0")
    const day = `${d.getDate()}`.padStart(2, "0")
    return [year,month, day].join("-")
}

export const msToTime = (d) => {
  var seconds = Math.floor((d / 1000) % 60),
    minutes = Math.floor((d / (1000 * 60)) % 60);

  return minutes + ":" + (seconds < 10 ? `0${seconds}` : seconds);
}
