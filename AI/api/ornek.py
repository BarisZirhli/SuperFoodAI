from zemberek_python.main_libs import MainLibs
from zemberek_python.normalization import TurkishSpellChecker
from zemberek_python.tokenization import TurkishTokenizer
from zemberek_python.morphology import TurkishMorphology

spell_checker = TurkishSpellChecker(morphology)

word = "geliyom"
if spell_checker.check(word):
    print(f"'{word}' doğru yazılmış.")
else:
    suggestions = spell_checker.suggest_for_word(word)
    print(f"'{word}' yanlış yazılmış. Öneriler: {suggestions}")
