from zemberek.morphology import TurkishMorphology
from zemberek.normalization import TurkishSpellChecker

morphology = TurkishMorphology.create_with_defaults()

spell_checker = TurkishSpellChecker(morphology)

word = "saker"
suggestions = spell_checker.suggest_for_word(word)

if len(suggestions) == 0:
    print(f"'{word}' doğru yazılmış.")
else:
    print(f"'{word}' yanlış yazılmış. Öneriler: {suggestions}")
