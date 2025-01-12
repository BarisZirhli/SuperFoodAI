export const parseIngredients = (ingredients) => {
  return ingredients
    .replace(/C\s*\(/, "") // "C (" kısmını kaldır
    .replace(")", "") // Sonundaki ")" kısmını kaldır
    .split(",") // Virgüllere göre ayır
    .map((item) => `𐤟 ${item.replace(/"/g, "").trim()}`); // Her bir öğenin başına 𐤟 ekle
};


export const parseInstructions = (instructions) => {
  return instructions
    .replace(/^C\s*\(/, "") // Başındaki "C (" kısmını kaldır
    .replace(/\)$/, "") // Sonundaki ")" kısmını kaldır
    .replace(/,\s*$/, "") // Cümle sonlarındaki gereksiz virgülleri kaldır
    .replace(/([a-zA-Z0-9])\./g, "$1.") // Noktalama hatalarını düzelt
    .split(/\.(?!\s*\d)/) // Noktalara göre ayır
    .map((step) => step.trim()) // Başlangıç ve son boşlukları temizle
    .filter((step) => step.length >= 1); // Boş maddeleri kaldır
};

export const parseImageUrls = (image) => {
  if (!image || typeof image !== 'string') {
    console.warn('Invalid input passed to parseImageUrls:', image);
    return []; // Varsayılan olarak boş bir dizi döndür
  }

  return image
    .replace(/^c\(/, "") // Başındaki "c(" kısmını kaldır
    .replace(/\)$/, "")  // Sonundaki ")" kısmını kaldır
    .split(/",\s*"/)     // Çift tırnak ve virgülle böl
    .map((url) => url.replace(/"/g, "").trim()); // Her bir URL'yi temizle
};