export const parseIngredients = (ingredients) => {
  return ingredients
    .replace(/C\s*\(/, "")
    .replace(")", "")
    .split(",")
    .map((item) => `𐤟 ${item.replace(/"/g, "").trim()}`);
};

export const parseInstructions = (instructions) => {
  return instructions
    .replace(/^C\s*\(/, "")
    .replace(/\)$/, "")
    .replace(/,\s*$/, "")
    .replace(/([a-zA-Z0-9])\./g, "$1.")
    .split(/\.(?!\s*\d)/)
    .map((step) => step.trim())
    .filter((step) => step.length >= 1);
};

export const parseImageUrls = (image) => {
  return image
    .replace(/^c\(/, "")
    .replace(/\)$/, "")
    .split(/,\s*(?=https?:\/\/)/)
    .map((url) => url.trim());
};

export const convertCookingTime = (time) => {
  const regex = /PT(\d+)H(\d+)M/;
  const regexMinutes = /PT(\d+)M/;

  let match = time.match(regex);
  if (match) {
    const hours = match[1];
    const minutes = match[2];
    return `${hours} saat ${minutes} dk`;
  }

  match = time.match(regexMinutes);
  if (match) {
    const minutes = match[1];
    return `${minutes} dk`;
  }

  return time;
};
