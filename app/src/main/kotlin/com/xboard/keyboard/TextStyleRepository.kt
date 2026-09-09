package com.xboard.keyboard

data class StylePreset(val id: String, val title: String, val template: String)

object TextStyleRepository {
    val presets = listOf(
        StylePreset("hearts-border", "Sweet Hearts", "❤️ සුභ දවසක් ❤️"),
        StylePreset("sparkles-border", "Shining Sparkles", "✨ Hello World ✨"),
        StylePreset("stars-border", "Star Accents", "★ Welcome ★"),
        StylePreset("flower-blossom", "Cherry Blossom", "🌸 සුභ •~°• උදෑසනක් •~°• 🌸"),
        StylePreset("fire-glow", "Energy Fire", "🔥 Good Morning 🔥"),
        StylePreset("music-wave", "Musical Rhythm", "🎵 Beautiful Day 🎶"),
        StylePreset("brackets-box", "Winged Brackets", "【 Best Wishes 】"),
        StylePreset("arrows-glide", "Arrow Pointers", "➔ Special Message ➔"),
        StylePreset("crown-gold", "Royal Crown", "👑 Amazing Day 👑"),
        StylePreset("swirls-vintage", "Vintage Swirls", "꧁ Thank You Very Much ꧂"),
        StylePreset("dots-matrix", "Modern Dots", "•~°• X Board Keyboard •~°•"),
        StylePreset("diamond-cut", "Sparkling Diamonds", "✦ Keep Smiling ✦"),
        StylePreset("butterfly-wing", "Gentle Butterfly", "🦋 Wishing You Joy 🦋"),
        StylePreset("cloud-sky", "Gentle Sky", "☁️ Have A Wonderful Day ☁️"),
        StylePreset("sun-energy", "Morning Sunrise", "☀️ Rise And Shine ☀️"),
        StylePreset("roses-garland", "Romantic Flowers", "🌹 Sending Lots Of Love 🌹"),
        StylePreset("cross-stars", "Nordic Crosses", "✚ Happy Birthday ✚"),
        StylePreset("ribbon-gift", "Festive Ribbon", "🎀 Congratulations 🎀"),
        StylePreset("lightning-bolt", "Fast Electric", "⚡ Super Fast Typing ⚡"),
        StylePreset("peace-dove", "Pure Serenity", "🕊️ Peace And Happiness 🕊️")
    )
}
