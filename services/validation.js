module.exports.str = (str, res) => {
  const trimmedStr = str.map((item) => {
    return item.trim();
  });

  trimmedStr.forEach((element) => {
    if (!element || element.length === 0) {
      res.sendStatus(400);
    }
  });

  return trimmedStr;
};
