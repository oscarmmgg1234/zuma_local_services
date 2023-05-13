const date = require("date-and-time");

class pdf_request_model {
  range_start = null;
  range_end = null;
  e_id = null;
  constructor(args) {
    const date_pattern = date.compile("YYYY-MM-DD");

    const start_compare = date
      .format(new Date(args[0]), date_pattern)
      .localeCompare(new Date(args[0]));
    const end_compare = date
      .format(new Date(args[1]), date_pattern)
      .localeCompare(new Date(args[1]));

    this.range_start = new Date(args[0]);
    if (start_compare == -1) {
      this.range_start = date.addDays(this.range_start, 1);
    } else if (start_compare == 1) {
      this.range_start = date.addDays(this.range_start, -1);
    }
    this.range_end = new Date(args[1]);
    if (end_compare == -1) {
      this.range_end = date.addDays(this.range_end, 1);
    } else if (start_compare == 1) {
      this.range_end = date.addDays(this.range_end, -1);
    }

    this.e_id = args[2] ? args[2] : null;
  }
  validate() {
    if (
      this.range_start == null ||
      this.range_end == null ||
      this.e_id == null ||
      this.range_start == "" ||
      this.range_end == "" ||
      this.e_id == ""
    ) {
      return false;
    }
    return true;
  }
  validate_multiple() {
    if (
      this.range_start == null ||
      this.range_end == null ||
      this.range_start == "" ||
      this.range_end == ""
    ) {
      return false;
    }
    return true;
  }
  map() {
    return [this.range_start, this.range_end, this.e_id];
  }
}
const pdfRequestModel = (args) => {
  return new pdf_request_model([
    args.shift_start_range,
    args.shift_end_range,
    args.employee_id,
  ]);
};

exports.pdfRequestModel = pdfRequestModel;
