export const getTodayString = () => {
    const d = new Date(); //2022-03-18
    const year = d.getFullYear()
    const month = `${d.getMonth() + 1}`.padStart(2, "0")
    const day = `${d.getDate()}`.padStart(2, "0")
    return [year,month, day].join("-")
}