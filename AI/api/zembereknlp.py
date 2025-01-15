from zemberek.morphology import TurkishMorphology
from zemberek.normalization import TurkishSpellChecker

# Türkçe morfolojik analiz için Zemberek başlatılıyor.
morphology = TurkishMorphology.create_with_defaults()

# Yazım denetleyicisi oluşturuluyor.
spell_checker = TurkishSpellChecker(morphology)

# Kullanıcının girdiği kelime.
word = "saker"

# 'nlpWords.txt' dosyasından yiyecek ile ilgili kelimeleri oku.
food_related_words = []
try:
    with open("../utils/nlpWords.txt", "r", encoding="utf-8") as file:
        food_related_words = [line.strip().lower() for line in file if line.strip()]
except FileNotFoundError:
    print("Hata: 'nlpWords.txt' dosyası bulunamadı.")
    exit()

suggestions = spell_checker.suggest_for_word(word)

filtered_suggestions = [s for s in suggestions if s.lower() in food_related_words]

if len(filtered_suggestions) == 0:
    print(f"'{word}' yanlış yazılmış ancak yiyeceklerle ilgili öneri bulunamadı.")
else:
    print(f"'{word}' yanlış yazılmış. Yiyeceklerle ilgili öneriler: {filtered_suggestions}")
