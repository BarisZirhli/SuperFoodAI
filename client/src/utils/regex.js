export const parseIngredients = (ingredients) => {
    return ingredients
      .replace(/C\s*\(/, "")
      .replace(")", "")
      .split(",")
      .map((item) => item.replace(/"/g, "").trim());
  };
  
  export const parseInstructions = (instructions) => {
    return instructions
      .replace(/^C\s*\(/, "")
      .replace(/\)$/, "")
      .split(/",\s*"/)
      .map((step) => step.replace(/"/g, "").trim());
  };
  
  export const parseImageUrls = (image) => {
    if (image.startsWith("c(")) {
      return image
        .replace(/^c\(/, "")
        .replace(/\)$/, "")
        .split(/",\s*"/)
        .map((url) => url.replace(/"/g, "").trim());
    }
    return [image.trim()];
  };