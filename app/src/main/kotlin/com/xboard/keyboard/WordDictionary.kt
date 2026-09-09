package com.xboard.keyboard

import android.content.Context

class WordDictionary(context: Context) {
    private val prefs = context.getSharedPreferences("xboard_user_dict", Context.MODE_PRIVATE)

    private val initialDictionary = setOf(
        "the", "be", "to", "of", "and", "a", "in", "that", "have", "I",
        "it", "for", "not", "on", "with", "he", "as", "you", "do", "at",
        "hello", "welcome", "keyboard", "thanks", "morning", "night", "good"
    )

    fun recordTypedWord(word: String) {
        val cleaned = word.trim().lowercase()
        if (cleaned.length >= 2) {
            val userWords = getUserWords().toMutableSet()
            userWords.add(cleaned)
            prefs.edit().putStringSet("saved_words", userWords).apply()
        }
    }

    fun getSuggestions(prefix: String, limit: Int = 4): List<String> {
        val query = prefix.trim().lowercase()
        if (query.isEmpty()) return emptyList()

        val allWords = initialDictionary + getUserWords()
        return allWords
            .filter { it.startsWith(query) && it != query }
            .take(limit)
    }

    private fun getUserWords(): Set<String> {
        return prefs.getStringSet("saved_words", emptySet()) ?: emptySet()
    }
}
