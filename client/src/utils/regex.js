export const parseIngredients = (ingredients) => {
  return ingredients
    .replace(/C\s*\(/, "") // "C (" kısmını kaldır
    .replace(")", "") // Sonundaki ")" kısmını kaldır
    .split(",") // Virgüllere göre ayır
    .map((item) => `𐤟 ${item.replace(/"/g, "").trim()}`); // Her bir öğenin başına 𐤟 ekle
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
    .replace(/^c\(/, "") // "c(" ifadesini kaldır
    .replace(/\)$/, "") // Kapanış parantezini kaldır
    .split(/,\s*(?=https?:\/\/)/) // URL'leri virgülle ayır
    .map((url) => url.trim()); // Her URL'yi temizle
};