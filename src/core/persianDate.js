
const persianDate = require('persian-date');
persianDate.toLocale('en');

function toIranTimeZone(dateObject) {
  const dateString = (dateObject.toLocaleDateString("en-US", { timeZone: "Asia/Tehran", hour12: false }))
  const timeString = (dateObject.toLocaleTimeString("en-US", { timeZone: "Asia/Tehran", hour12: false }))
  let datePersian = new persianDate(new Date(dateString)).format('l')

  return { time: timeString, date: datePersian }

}
async function makePersian(objects, dateElement) {
  try {
    objects = JSON.parse(JSON.stringify(objects))
    if (Array.isArray(objects)) {

      objects.map(element => {
        element.date = addDateToObject(element)
        dateElement.map(time => {
          let mData = new Date(element[time])
          element[time] =toIranTimeZone(mData).time
           
        })
      });

    }
    else {
      objects.date = addDateToObject(objects)
      dateElement.forEach(time => {
        let mData = new Date(objects[time])

        objects[time] =
        toIranTimeZone(mData).time
      })
    }
    return objects
  } catch (err) {
    console.log(err)
  }
}

function addDateToObject(object) {
  let mData = new Date(object.time)
  return toIranTimeZone(mData).date
}


module.exports = {
  addDateToObject,
  makePersian,
  toIranTimeZone

};
