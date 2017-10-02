export const convertBrazlianStringDateToDate = stringDate => {
  const parsedDate = stringDate.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

  let day = +parsedDate[1];
  let month = +parsedDate[2];
  let year = +parsedDate[3];

  return new Date(`${month}/${day}/${year}`);
};

export const isValidKeyCode = e => {
  let boolKeyCodeNumber =
    (e.keyCode >= 96 && e.keyCode <= 105) || (e.keyCode >= 48 && e.keyCode <= 57 && e.shiftKey === false);
  let boolKeyCodeBackSpaceOrDelete = (e.keyCode === 8 || e.keyCode === 46) && e.shiftKey === false;
  let boolKeyCodeDirectional = e.keyCode >= 37 && e.keyCode <= 40 && e.shiftKey === false;
  let boolKeyCodeHomeOrEnd = (e.keyCode === 36 || e.keyCode === 45) && e.shiftKey === false;
  let boolKeyCodeTab = e.keyCode === 9;
  let boolCtrlA = e.keyCode === 65 && e.ctrlKey === true;
  let bollCtrlC = e.keyCode === 67 && e.ctrlKey === true;
  let bollCtrlV = e.keyCode === 86 && e.ctrlKey === true;

  return (
    boolKeyCodeNumber ||
    boolKeyCodeBackSpaceOrDelete ||
    boolKeyCodeDirectional ||
    boolKeyCodeHomeOrEnd ||
    boolKeyCodeTab ||
    boolCtrlA ||
    bollCtrlC ||
    bollCtrlV
  );
};

export const validateStringBrazilianDate = stringDate => {
  const isLeapYear = year => {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  };

  const parsedDate = stringDate.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (parsedDate === null) {
    return false;
  }

  const day = +parsedDate[1];
  const month = +parsedDate[2];
  const year = +parsedDate[3];

  const long = [1, 3, 5, 7, 8, 10, 12];
  const normal = [4, 6, 9, 11];
  const short = [2];

  let dayExpression;

  if (long.indexOf(month) !== -1) {
    dayExpression = day >= 1 && day <= 31;
  } else if (normal.indexOf(month) !== -1) {
    dayExpression = day >= 1 && day <= 30;
  } else if (short.indexOf(month) !== -1) {
    dayExpression = isLeapYear(year) ? day >= 1 && day <= 29 : day >= 1 && day <= 28;
  } else {
    return false;
  }

  return month >= 1 && month <= 12 && dayExpression && year >= 0 && year <= 9999;
};
