import DateFormat from "dateformat";

interface Filters {
  dateFormat: (date: any, format: string) => string;
}

const filters: Filters = {
  dateFormat(date, format = "yyyy-mm-dd HH:MM:ss") {
    if (!date) return "";
    const dateObj = new Date(date);
    if (dateObj.toString() === "Invalid Date") {
      return "";
    }
    return DateFormat(dateObj, format);
  }
};

export default filters;
