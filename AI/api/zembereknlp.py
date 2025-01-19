import re
import string
from difflib import get_close_matches
from nltk.stem import WordNetLemmatizer
import os
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from fastapi import FastAPI, HTTPException
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
import string
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine

turkish_stop_words = [
    "a",
    "acaba",
    "altı",
    "ama",
    "ancak",
    "bazen",
    "bazı",
    "belki",
    "ben",
    "benden",
    "beni",
    "benim",
    "bir",
    "biraz",
    "birçoğu",
    "biri",
    "birkaç",
    "biz",
    "bizden",
    "bize",
    "bizi",
    "bizim",
    "bu",
    "bunun",
    "bunu",
    "bunu",
    "her",
    "herhangi",
    "hem",
    "hep",
    "için",
    "işte",
    "kadar",
    "karşı",
    "kendi",
    "kendine",
    "ki",
    "mı",
    "mi",
    "çok",
    "çünkü",
    "de",
    "den",
    "daha",
    "diğer",
    "ile",
    "ilgili",
    "çok",
    "gibi",
    "hem",
    "henüz",
    "hep",
    "herhangi",
    "hiç",
    "iç",
    "şu",
    "şu",
    "şöyle",
    "tüm",
    "tümü",
    "ya",
    "yani",
    "yok",
    "ve",
    "veya",
    "üzere",
]

nltk.download("stopwords")
nltk.download("punkt")
nltk.download("wordnet")


stop_words = list(
    set(turkish_stop_words)
)
lemmatizer = WordNetLemmatizer()

food_related_words = []
try:
    with open("../utils/nlpWords.txt", "r", encoding="utf-8") as file:
        food_related_words = [line.strip().lower() for line in file if line.strip()]
except FileNotFoundError:
    print("Hata: 'nlpWords.txt' dosyası bulunamadı.")
    exit()
food_related_words = list(set(food_related_words))


def preprocess_text(text):
    text = text.lower()

    text = re.sub(r"\d+", "", text)

    text = text.translate(str.maketrans("", "", string.punctuation))

    words = text.split()
    processed_words = [
        lemmatizer.lemmatize(word) for word in words if word not in stop_words
    ]

    return " ".join(processed_words)


def get_suggestions(word):
    normalized_word = preprocess_text(word)
    suggestions = get_close_matches(
        normalized_word, food_related_words, n=3, cutoff=0.65
    )

    if not suggestions:
        print(f"'{word}' yanlış yazılmış ancak yiyeceklerle ilgili öneri bulunamadı.")
    else:
        print(f"'{word}' yanlış yazılmış. Yiyeceklerle ilgili öneriler:")
        for suggestion in suggestions:
            print(f"- {suggestion}")


word = "fuz"
get_suggestions(word)
