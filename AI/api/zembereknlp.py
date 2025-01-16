import re
from difflib import get_close_matches

food_related_words = []
try:
    with open("../utils/nlpWords.txt", "r", encoding="utf-8") as file:
        food_related_words = [line.strip().lower() for line in file if line.strip()]
except FileNotFoundError:
    print("Hata: 'nlpWords.txt' dosyası bulunamadı.")
    exit()
food_related_words = list(set(food_related_words))


def normalize_word(word):

    word = word.lower()
    word = re.sub(r"\d+", "", word)

    return word


word = "saker"
normalized_word = normalize_word(word)
suggestions = get_close_matches(normalized_word, food_related_words, n=3, cutoff=0.65)


if not suggestions:
    print(f"'{word}' yanlış yazılmış ancak yiyeceklerle ilgili öneri bulunamadı.")
else:
    print(f"'{word}' yanlış yazılmış. Yiyeceklerle ilgili öneriler:")
    for suggestion in suggestions:
        print(f"- {suggestion}")
