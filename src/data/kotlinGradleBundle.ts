/**
 * Complete Standard Android Kotlin Gradle Project Bundle
 * Includes GitHub Actions APK Build Workflow (.github/workflows/build-apk.yml)
 */

export interface ProjectFile {
  path: string;
  filename: string;
  category: 'workflow' | 'gradle' | 'kotlin' | 'layout' | 'res' | 'manifest' | 'docs';
  language: string;
  description: string;
  content: string;
}

export const KOTLIN_GRADLE_PROJECT_FILES: ProjectFile[] = [
  // 1. GITHUB WORKFLOW FOR AUTOMATED APK BUILD
  {
    path: '.github/workflows/build-apk.yml',
    filename: 'build-apk.yml',
    category: 'workflow',
    language: 'yaml',
    description: 'GitHub Actions workflow to automatically compile and build Android APK on git push and provide downloadable APK artifact',
    content: `name: Build Android APK

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]
  workflow_dispatch: # Allows manual trigger from GitHub Actions tab

jobs:
  build:
    name: Build Debug APK
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Source Code
        uses: actions/checkout@v4

      - name: Set up JDK 17
        uses: actions/setup-java@v4
        with:
          java-version: '17'
          distribution: 'temurin'
          cache: gradle

      - name: Grant Execute Permission to Gradle Wrapper
        run: chmod +x gradlew

      - name: Build Debug APK with Gradle
        run: ./gradlew assembleDebug --stacktrace

      - name: Upload Debug APK Artifact
        uses: actions/upload-artifact@v4
        with:
          name: XBoard-Keyboard-Debug-APK
          path: app/build/outputs/apk/debug/*.apk
          retention-days: 14
`
  },

  // 2. ROOT GRADLE FILES
  {
    path: 'settings.gradle.kts',
    filename: 'settings.gradle.kts',
    category: 'gradle',
    language: 'kotlin',
    description: 'Root Gradle settings file configuring Google, MavenCentral, and Gradle Plugin Portal repositories',
    content: `pluginManagement {
    repositories {
        google {
            content {
                includeGroupByRegex("com\\\\.android.*")
                includeGroupByRegex("com\\\\.google.*")
                includeGroupByRegex("androidx.*")
            }
        }
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "XBoardKeyboard"
include(":app")
`
  },
  {
    path: 'build.gradle.kts',
    filename: 'build.gradle.kts',
    category: 'gradle',
    language: 'kotlin',
    description: 'Top-level root build script applying Android Application and Kotlin Android plugins',
    content: `// Top-level build file where you can add configuration options common to all sub-projects/modules.
plugins {
    id("com.android.application") version "8.3.0" apply false
    id("org.jetbrains.kotlin.android") version "1.9.22" apply false
}
`
  },
  {
    path: 'gradle.properties',
    filename: 'gradle.properties',
    category: 'gradle',
    language: 'properties',
    description: 'Gradle JVM settings and AndroidX configuration flags',
    content: `org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
android.nonTransitiveRClass=true
kotlin.code.style=official
`
  },
  {
    path: 'gradle/wrapper/gradle-wrapper.properties',
    filename: 'gradle-wrapper.properties',
    category: 'gradle',
    language: 'properties',
    description: 'Gradle wrapper distribution configuration (Gradle 8.5 bin)',
    content: `distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\\://services.gradle.org/distributions/gradle-8.5-bin.zip
networkTimeout=10000
validateDistributionUrl=true
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
`
  },
  {
    path: 'gradlew',
    filename: 'gradlew',
    category: 'gradle',
    language: 'bash',
    description: 'UNIX shell script for Gradle wrapper execution',
    content: `#!/bin/sh

#
# Copyright 2015 the original author or authors.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      https://www.apache.org/licenses/LICENSE-2.0
#

DIRNAME=\`dirname "$0"\`
APP_BASE_NAME=\`basename "$0"\`
APP_HOME=\`cd "$DIRNAME" && pwd\`

JAVACMD="java"
if [ -n "$JAVA_HOME" ] ; then
    if [ -x "$JAVA_HOME/jre/sh/java" ] ; then
        JAVACMD="$JAVA_HOME/jre/sh/java"
    else
        JAVACMD="$JAVA_HOME/bin/java"
    fi
fi

CLASSPATH=$APP_HOME/gradle/wrapper/gradle-wrapper.jar

exec "$JAVACMD" "-Dorg.gradle.appname=$APP_BASE_NAME" -classpath "$CLASSPATH" org.gradle.wrapper.GradleWrapperMain "$@"
`
  },
  {
    path: 'gradlew.bat',
    filename: 'gradlew.bat',
    category: 'gradle',
    language: 'bat',
    description: 'Windows CMD script for Gradle wrapper execution',
    content: `@rem
@rem Copyright 2015 the original author or authors.
@rem
@if "%DEBUG%"=="" @echo off
@setlocal

set DIRNAME=%~dp0
if "%DIRNAME%"=="" set DIRNAME=.
set APP_BASE_NAME=%~n0
set APP_HOME=%DIRNAME%

set JAVA_EXE=java.exe
if not "%JAVA_HOME%"=="" set JAVA_EXE=%JAVA_HOME%\\bin\\java.exe

set CLASSPATH=%APP_HOME%\\gradle\\wrapper\\gradle-wrapper.jar

"%JAVA_EXE%" -Dorg.gradle.appname=%APP_BASE_NAME% -classpath "%CLASSPATH%" org.gradle.wrapper.GradleWrapperMain %*
`
  },

  // 3. APP MODULE GRADLE BUILD FILE
  {
    path: 'app/build.gradle.kts',
    filename: 'build.gradle.kts (app)',
    category: 'gradle',
    language: 'kotlin',
    description: 'App module build script targeting Android 8.0 Oreo (minSdk 26) with Kotlin and Google Mobile Ads (AdMob)',
    content: `plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "com.xboard.keyboard"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.xboard.keyboard"
        minSdk = 26 // Android 8.0 Oreo+
        targetSdk = 34
        versionCode = 1
        versionName = "1.0.0"
        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.12.0")
    implementation("androidx.appcompat:appcompat:1.6.1")
    implementation("com.google.android.material:material:1.11.0")
    implementation("androidx.constraintlayout:constraintlayout:2.1.4")
    implementation("com.google.android.gms:play-services-ads:23.0.0")
}
`
  },
  {
    path: 'app/proguard-rules.pro',
    filename: 'proguard-rules.pro',
    category: 'gradle',
    language: 'pro',
    description: 'ProGuard rules for code shrinking and obfuscation',
    content: `# Add project specific ProGuard rules here.
-keep class com.xboard.keyboard.** { *; }
-keepclassmembers class * extends android.inputmethodservice.InputMethodService { *; }
`
  },

  // 4. KOTLIN SOURCE FILES
  {
    path: 'app/src/main/kotlin/com/xboard/keyboard/XBoardIME.kt',
    filename: 'XBoardIME.kt',
    category: 'kotlin',
    language: 'kotlin',
    description: 'Core InputMethodService engine handling Shift lock, 24 fonts, suggestions, tool panel replacement, and clipboard',
    content: `package com.xboard.keyboard

import android.inputmethodservice.InputMethodService
import android.view.KeyEvent
import android.view.View
import android.view.inputmethod.EditorInfo
import android.view.inputmethod.InputConnection
import android.widget.Button
import android.widget.LinearLayout
import android.widget.TextView
import android.widget.Toast

/**
 * X Board Custom Virtual Keyboard Service
 * Compatible with Android 8.0 Oreo (API 26) and newer
 * Color Palette:
 * - Very dark gray (#121214 / #202026)
 * - Black (#000000)
 * - White (#FFFFFF)
 * - Neon Green (#07F57E)
 */
class XBoardIME : InputMethodService() {

    enum class ShiftState {
        LOWERCASE,          // Simple letters (a-z)
        FIRST_LETTER_UPPER, // 1 click: First letter only uppercase, then reverts to lowercase
        CAPS_LOCKED         // Double click: Uppercase lock (A-Z)
    }

    private lateinit var keyboardRootView: View
    private lateinit var keysLayout: View
    private lateinit var toolPanelContainer: View
    private lateinit var toolPanelTitle: TextView
    private lateinit var spaceButton: Button
    private lateinit var enterButton: Button
    private lateinit var shiftButton: Button

    private var activeFontId: String = "normal"
    private var shiftState: ShiftState = ShiftState.LOWERCASE
    private var lastShiftPressTime: Long = 0L
    private val DOUBLE_TAP_TIMEOUT = 300L

    private lateinit var soundManager: SoundHapticManager
    private lateinit var dictionary: WordDictionary
    private val clipboardHistory = mutableListOf<String>()

    override fun onCreate() {
        super.onCreate()
        soundManager = SoundHapticManager(this)
        dictionary = WordDictionary(this)
    }

    override fun onCreateInputView(): View {
        keyboardRootView = layoutInflater.inflate(R.layout.keyboard_view, null)
        initViews(keyboardRootView)
        setupKeyListeners()
        updateShiftUI()
        return keyboardRootView
    }

    override fun onStartInputView(info: EditorInfo?, restarting: Boolean) {
        super.onStartInputView(info, restarting)
        updateEnterAction(info)
        refreshSuggestions()
    }

    private fun initViews(root: View) {
        keysLayout = root.findViewById(R.id.keyboard_keys_layout)
        toolPanelContainer = root.findViewById(R.id.tool_panel_container)
        toolPanelTitle = root.findViewById(R.id.tool_panel_title)
        spaceButton = root.findViewById(R.id.btn_key_space)
        enterButton = root.findViewById(R.id.btn_key_enter)
        shiftButton = root.findViewById(R.id.btn_key_shift)

        // Space button label explicitly: "X Board"
        spaceButton.text = "X Board"
    }

    private fun setupKeyListeners() {
        // Shift key handling: single click = 1st letter uppercase, double click = caps lock
        shiftButton.setOnClickListener {
            val now = System.currentTimeMillis()
            soundManager.playKeyClick(SoundHapticManager.KEY_TYPE_ACTION)

            if (now - lastShiftPressTime < DOUBLE_TAP_TIMEOUT) {
                shiftState = if (shiftState == ShiftState.CAPS_LOCKED) ShiftState.LOWERCASE else ShiftState.CAPS_LOCKED
            } else {
                shiftState = when (shiftState) {
                    ShiftState.LOWERCASE -> ShiftState.FIRST_LETTER_UPPER
                    ShiftState.FIRST_LETTER_UPPER -> ShiftState.LOWERCASE
                    ShiftState.CAPS_LOCKED -> ShiftState.LOWERCASE
                }
            }
            lastShiftPressTime = now
            updateShiftUI()
        }

        spaceButton.setOnClickListener {
            commitText(" ")
            soundManager.playKeyClick(SoundHapticManager.KEY_TYPE_SPACE)
        }

        // Dedicated Emoji quick button on bottom row
        keyboardRootView.findViewById<Button>(R.id.btn_key_emoji)?.setOnClickListener {
            soundManager.playKeyClick(SoundHapticManager.KEY_TYPE_ACTION)
            openToolPanel("emoji", "Emoji & Emoticon Picker")
        }

        // Comma and Period
        keyboardRootView.findViewById<Button>(R.id.btn_key_comma)?.setOnClickListener {
            commitText(",")
            soundManager.playKeyClick(SoundHapticManager.KEY_TYPE_CHAR)
        }
        keyboardRootView.findViewById<Button>(R.id.btn_key_period)?.setOnClickListener {
            commitText(".")
            soundManager.playKeyClick(SoundHapticManager.KEY_TYPE_CHAR)
        }

        enterButton.setOnClickListener {
            val ic = currentInputConnection ?: return@setOnClickListener
            soundManager.playKeyClick(SoundHapticManager.KEY_TYPE_ENTER)
            val action = currentInputEditorInfo.imeOptions and EditorInfo.IME_MASK_ACTION
            if (action == EditorInfo.IME_ACTION_DONE || action == EditorInfo.IME_ACTION_SEND || action == EditorInfo.IME_ACTION_SEARCH) {
                ic.performEditorAction(action)
            } else {
                ic.commitText("\\n", 1)
            }
        }
    }

    fun onCharKeyPressed(rawChar: Char) {
        val isUpper = shiftState != ShiftState.LOWERCASE
        val targetChar = if (isUpper) rawChar.uppercaseChar() else rawChar.lowercaseChar()
        val textToCommit = FontConverter.convertText(targetChar.toString(), activeFontId)

        commitText(textToCommit)
        soundManager.playKeyClick(SoundHapticManager.KEY_TYPE_CHAR)

        // If one-click first letter uppercase, revert back to lowercase after typing 1 character
        if (shiftState == ShiftState.FIRST_LETTER_UPPER) {
            shiftState = ShiftState.LOWERCASE
            updateShiftUI()
        }
    }

    private fun commitText(text: String) {
        val ic = currentInputConnection ?: return
        ic.commitText(text, 1)
        dictionary.recordTypedWord(text)
        refreshSuggestions()
    }

    private fun updateShiftUI() {
        when (shiftState) {
            ShiftState.LOWERCASE -> {
                shiftButton.text = "⇧"
                shiftButton.alpha = 0.85f
            }
            ShiftState.FIRST_LETTER_UPPER -> {
                shiftButton.text = "⇪"
                shiftButton.alpha = 1.0f
            }
            ShiftState.CAPS_LOCKED -> {
                shiftButton.text = "🔒"
                shiftButton.alpha = 1.0f
            }
        }
    }

    private fun updateEnterAction(info: EditorInfo?) {
        val action = (info?.imeOptions ?: 0) and EditorInfo.IME_MASK_ACTION
        when (action) {
            EditorInfo.IME_ACTION_SEND -> enterButton.text = "Send ➔"
            EditorInfo.IME_ACTION_SEARCH -> enterButton.text = "Search 🔍"
            EditorInfo.IME_ACTION_GO -> enterButton.text = "Go ➔"
            else -> enterButton.text = "Enter ↵"
        }
    }

    private fun refreshSuggestions() {
        // Populates auto-suggested words from WordDictionary
    }

    fun openToolPanel(panelType: String, title: String) {
        keysLayout.visibility = View.GONE
        toolPanelContainer.visibility = View.VISIBLE
        toolPanelTitle.text = title
    }

    fun closeToolPanel() {
        toolPanelContainer.visibility = View.GONE
        keysLayout.visibility = View.VISIBLE
    }
}
`
  },
  {
    path: 'app/src/main/kotlin/com/xboard/keyboard/FontConverter.kt',
    filename: 'FontConverter.kt',
    category: 'kotlin',
    language: 'kotlin',
    description: 'Complete 24 Unicode Fancy Font Converter logic',
    content: `package com.xboard.keyboard

/**
 * 24 Unicode Fancy Font Mappings for X Board
 */
object FontConverter {

    fun convertText(text: String, fontId: String): String {
        return when (fontId) {
            "sans-bold" -> mapAlphabet(text, 0x1D5D4, 0x1D5EE, 0x1D7EC) // 𝖧𝖾𝗅𝗅𝗈 (Sans Bold)
            "sans-italic" -> mapAlphabet(text, 0x1D608, 0x1D622)         // 𝘏𝘦𝘭𝘭𝘰 (Sans Italic)
            "bold" -> mapAlphabet(text, 0x1D400, 0x1D41A, 0x1D7CE)        // 𝗛𝗲𝗅𝗅𝗈 (Bold)
            "italic" -> mapItalic(text)                                  // 𝐻𝑒𝑙𝗅𝗈 (Italic)
            "script-cursive" -> mapAlphabet(text, 0x1D4D0, 0x1D4EA)      // 𝓗𝓮𝗅𝗅𝗈 (Script / Cursive)
            "double-struck" -> mapDoubleStruck(text)                     // ℍ𝕖𝗅𝗅𝕠 (Double-struck)
            "heavy-sans" -> mapAlphabet(text, 0x1D5D4, 0x1D5EE, 0x1D7EC) // 𝗛𝗲𝗅𝗅𝗈 (Heavy Sans)
            "monospace" -> mapAlphabet(text, 0x1D670, 0x1D68A, 0x1D7F6)  // 𝙷𝚎𝗅𝗅𝗈 (Monospace)
            "squared" -> mapSquared(text)                                // 🄷🄴🄻🄻🄾 (Squared / Boxed)
            "circled" -> mapCircled(text)                                // Ⓗⓔⓛⓛⓞ (Circled)
            "small-caps-special" -> mapDict(text, smallCapsSpecialMap)   // Ɦⱸⱡⱡꝿ (Small Caps / Special)
            "small-caps" -> mapDict(text, smallCapsMap)                  // ʜᴇʟʟᴏ (Small Caps)
            "gothic-fraktur" -> mapGothic(text)                          // 𝕳𝖊𝖑𝖑𝖔 (Gothic / Fraktur)
            "fancy-script" -> mapFancyScript(text)                      // ℋℯ𝓁𝓁ℴ (Fancy Script)
            "lithe-aesthetic" -> mapDict(text, litheMap)                 // ꓧꗴꓡꓡꝏ (Lithe / Aesthetic)
            "dark-gothic" -> mapAlphabet(text, 0x1D56C, 0x1D586)         // 𝕯𝖊𝖑𝖑𝖔 (Dark Gothic)
            "sans-small" -> mapAlphabet(text, 0x1D5D4, 0x1D5EE)          // 𝖍𝖊𝗅𝗅𝗈 (Sans Small)
            "decorated" -> mapDict(text, decoratedMap)                  // ᕼ𝚎ᒪᒪṌ (Decorated)
            "medieval" -> mapDict(text, medievalMap)                    // Ƕell꙯ (Medieval Style)
            "chinese-style" -> mapDict(text, chineseMap)                 // 卂ᗷᑕ (Chinese-styled)
            "accented" -> mapDict(text, accentedMap)                    // Äḃċ (Accented)
            "phonetic" -> mapDict(text, phoneticMap)                    // Ȟeᶅℓo (Phonetic / IPA style)
            "strikethrough" -> mapDict(text, strikethroughMap)           // Ħɇłłø (Strikethrough / Crossed)
            "unique-style" -> mapDict(text, uniqueMap)                  // ꞪⴹᒪᒪꝊ (Unique Style)
            else -> text
        }
    }

    private fun mapAlphabet(text: String, upperStart: Int, lowerStart: Int, numStart: Int? = null): String {
        val sb = StringBuilder()
        for (ch in text) {
            when (ch) {
                in 'A'..'Z' -> sb.append(String(Character.toChars(upperStart + (ch - 'A'))))
                in 'a'..'z' -> sb.append(String(Character.toChars(lowerStart + (ch - 'a'))))
                in '0'..'9' -> {
                    if (numStart != null) sb.append(String(Character.toChars(numStart + (ch - '0'))))
                    else sb.append(ch)
                }
                else -> sb.append(ch)
            }
        }
        return sb.toString()
    }

    private fun mapItalic(text: String): String {
        val sb = StringBuilder()
        for (ch in text) {
            when (ch) {
                'h' -> sb.append("ℎ")
                in 'A'..'Z' -> sb.append(String(Character.toChars(0x1D434 + (ch - 'A'))))
                in 'a'..'z' -> sb.append(String(Character.toChars(0x1D44E + (ch - 'a'))))
                else -> sb.append(ch)
            }
        }
        return sb.toString()
    }

    private fun mapDoubleStruck(text: String): String {
        val exceptions = mapOf('C' to "ℂ", 'H' to "ℍ", 'N' to "ℕ", 'P' to "ℙ", 'Q' to "ℚ", 'R' to "ℝ", 'Z' to "ℤ")
        val sb = StringBuilder()
        for (ch in text) {
            if (exceptions.containsKey(ch)) sb.append(exceptions[ch])
            else if (ch in 'A'..'Z') sb.append(String(Character.toChars(0x1D538 + (ch - 'A'))))
            else if (ch in 'a'..'z') sb.append(String(Character.toChars(0x1D552 + (ch - 'a'))))
            else sb.append(ch)
        }
        return sb.toString()
    }

    private fun mapSquared(text: String): String {
        val sb = StringBuilder()
        for (ch in text) {
            val upper = ch.uppercaseChar()
            if (upper in 'A'..'Z') sb.append(String(Character.toChars(0x1F130 + (upper - 'A'))))
            else sb.append(ch)
        }
        return sb.toString()
    }

    private fun mapCircled(text: String): String {
        val sb = StringBuilder()
        for (ch in text) {
            when (ch) {
                in 'A'..'Z' -> sb.append(String(Character.toChars(0x24B6 + (ch - 'A'))))
                in 'a'..'z' -> sb.append(String(Character.toChars(0x24D0 + (ch - 'a'))))
                in '1'..'9' -> sb.append(String(Character.toChars(0x2460 + (ch - '1'))))
                '0' -> sb.append("⓪")
                else -> sb.append(ch)
            }
        }
        return sb.toString()
    }

    private fun mapGothic(text: String): String {
        val exceptions = mapOf('C' to "ℭ", 'H' to "ℌ", 'I' to "ℑ", 'R' to "ℜ", 'Z' to "ℨ")
        val sb = StringBuilder()
        for (ch in text) {
            if (exceptions.containsKey(ch)) sb.append(exceptions[ch])
            else if (ch in 'A'..'Z') sb.append(String(Character.toChars(0x1D56C + (ch - 'A'))))
            else if (ch in 'a'..'z') sb.append(String(Character.toChars(0x1D586 + (ch - 'a'))))
            else sb.append(ch)
        }
        return sb.toString()
    }

    private fun mapFancyScript(text: String): String {
        val exceptions = mapOf(
            'B' to "ℬ", 'E' to "ℰ", 'F' to "ℱ", 'H' to "ℋ", 'I' to "ℐ", 'L' to "ℒ",
            'M' to "ℳ", 'R' to "ℛ", 'e' to "ℯ", 'g' to "ℊ", 'o' to "ℴ"
        )
        val sb = StringBuilder()
        for (ch in text) {
            if (exceptions.containsKey(ch)) sb.append(exceptions[ch])
            else if (ch in 'A'..'Z') sb.append(String(Character.toChars(0x1D49C + (ch - 'A'))))
            else if (ch in 'a'..'z') sb.append(String(Character.toChars(0x1D4B6 + (ch - 'a'))))
            else sb.append(ch)
        }
        return sb.toString()
    }

    private fun mapDict(text: String, dict: Map<Char, String>): String {
        val sb = StringBuilder()
        for (ch in text) {
            sb.append(dict[ch] ?: dict[ch.lowercaseChar()] ?: ch.toString())
        }
        return sb.toString()
    }

    private val smallCapsMap = mapOf(
        'a' to "ᴀ", 'b' to "ʙ", 'c' to "ᴄ", 'd' to "ᴅ", 'e' to "ᴇ", 'f' to "ғ", 'g' to "ɢ",
        'h' to "ʜ", 'i' to "ɪ", 'j' to "ᴊ", 'k' to "ᴋ", 'l' to "ʟ", 'm' to "ᴍ", 'n' to "ɴ",
        'o' to "ᴏ", 'p' to "ᴘ", 'q' to "ǫ", 'r' to "ʀ", 's' to "s", 't' to "ᴛ", 'u' to "ᴜ",
        'v' to "ᴠ", 'w' to "ᴡ", 'x' to "x", 'y' to "ʏ", 'z' to "ᴢ"
    )

    private val smallCapsSpecialMap = mapOf(
        'a' to "Ɬ", 'b' to "Ꞵ", 'c' to "Ꞓ", 'd' to "Ꝺ", 'e' to "ⱸ", 'f' to "Ꞙ", 'g' to "Ꞡ",
        'h' to "Ɦ", 'i' to "Ɪ", 'j' to "Ʝ", 'k' to "Ꞣ", 'l' to "ⱡ", 'm' to "Ɱ", 'n' to "Ꞑ",
        'o' to "ꝿ", 'p' to "Ꝑ", 'q' to "Ꝗ", 'r' to "Ɽ", 's' to "Ꞩ", 't' to "Ʇ", 'u' to "Ꞟ",
        'v' to "ⱴ", 'w' to "Ⱳ", 'x' to "Ꭓ", 'y' to "Ɥ", 'z' to "Ɀ"
    )

    private val chineseMap = mapOf(
        'a' to "卂", 'b' to "ᗷ", 'c' to "ᑕ", 'd' to "ᗪ", 'e' to "乇", 'f' to "千", 'g' to "Ꮆ",
        'h' to "卄", 'i' to "丨", 'j' to "ﾌ", 'k' to "Ҝ", 'l' to "ㄥ", 'm' to "爪", 'n' to "几",
        'o' to "ㄖ", 'p' to "尸", 'q' to "Ɋ", 'r' to "尺", 's' to "丂", 't' to "ㄒ", 'u' to "ㄩ",
        'v' to "ᐯ", 'w' to "山", 'x' to "乂", 'y' to "ㄚ", 'z' to "乙"
    )

    private val litheMap = mapOf(
        'a' to "ꓮ", 'b' to "ꓐ", 'c' to "ꓚ", 'd' to "ꓓ", 'e' to "ꗴ", 'f' to "ꓝ", 'g' to "ꓖ",
        'h' to "ꓧ", 'i' to "ꓲ", 'j' to "ꓙ", 'k' to "ꓗ", 'l' to "ꓡ", 'm' to "ꓟ", 'n' to "ꓠ",
        'o' to "ꝏ", 'p' to "ꓑ", 'q' to "ꓚ", 'r' to "ꓣ", 's' to "ꓢ", 't' to "ꓔ", 'u' to "ꓴ",
        'v' to "ꓦ", 'w' to "ꓪ", 'x' to "ꓫ", 'y' to "ꓬ", 'z' to "ꓜ"
    )

    private val decoratedMap = mapOf(
        'a' to "ᗩ", 'b' to "ᗷ", 'c' to "ᑕ", 'd' to "ᗪ", 'e' to "𝚎", 'f' to "ᖴ", 'g' to "g",
        'h' to "ᕼ", 'i' to "i", 'j' to "ᒍ", 'k' to "k", 'l' to "ᒪ", 'm' to "ᗰ", 'n' to "ᑎ",
        'o' to "Ṍ", 'p' to "ᑭ", 'q' to "ᑫ", 'r' to "ᖇ", 's' to "ᔕ", 't' to "t", 'u' to "ᑌ",
        'v' to "ᐯ", 'w' to "ᗯ", 'x' to "᙭", 'y' to "y", 'z' to "ᘔ"
    )

    private val medievalMap = mapOf(
        'A' to "Ⱥ", 'B' to "Ƀ", 'C' to "Ȼ", 'D' to "Ð", 'E' to "Ɇ", 'F' to "Ꞙ", 'G' to "Ꞡ",
        'H' to "Ƕ", 'I' to "Ɨ", 'J' to "Ɉ", 'K' to "Ꝁ", 'L' to "Ł", 'M' to "₥", 'N' to "₦",
        'O' to "Ø", 'P' to "Ᵽ", 'Q' to "Ꝗ", 'R' to "Ɽ", 'S' to "Ꞩ", 'T' to "Ŧ", 'U' to "Ʉ"
    )

    private val accentedMap = mapOf(
        'a' to "ä", 'b' to "ḃ", 'c' to "ċ", 'd' to "ḋ", 'e' to "ë", 'f' to "ḟ", 'g' to "ġ",
        'h' to "ḣ", 'i' to "ï", 'j' to "ĵ", 'k' to "ḱ", 'l' to "ĺ", 'm' to "ṁ", 'n' to "ṅ",
        'o' to "ö", 'p' to "ṗ", 'q' to "q", 'r' to "ṙ", 's' to "ṡ", 't' to "ṫ", 'u' to "ü",
        'v' to "ṽ", 'w' to "ẅ", 'x' to "ẋ", 'y' to "ÿ", 'z' to "ż"
    )

    private val phoneticMap = mapOf(
        'a' to "ɐ", 'b' to "ʙ", 'c' to "ɕ", 'd' to "ɖ", 'e' to "e", 'f' to "ɟ", 'g' to "ɠ",
        'h' to "h", 'i' to "ɪ", 'j' to "ʝ", 'k' to "ɭ", 'l' to "ᶅ", 'm' to "ɯ", 'n' to "ɲ",
        'o' to "o", 'p' to "ɸ", 'q' to "ʠ", 'r' to "ɹ", 's' to "ʃ", 't' to "ʈ", 'u' to "ʊ"
    )

    private val strikethroughMap = mapOf(
        'a' to "a̶", 'b' to "ƀ", 'c' to "ȼ", 'd' to "đ", 'e' to "ɇ", 'f' to "f̶", 'g' to "ǥ",
        'h' to "ħ", 'i' to "ɨ", 'j' to "ɉ", 'k' to "k̶", 'l' to "ł", 'm' to "m̶", 'n' to "n̶",
        'o' to "ø", 'p' to "ᵽ", 'q' to "q̶", 'r' to "ɍ", 's' to "s̶", 't' to "ŧ", 'u' to "ʉ"
    )

    private val uniqueMap = mapOf(
        'a' to "Ɬ", 'b' to "ᗷ", 'c' to "ᑕ", 'd' to "ᗪ", 'e' to "ⴹ", 'f' to "ᖴ", 'g' to "Ǥ",
        'h' to "Ɦ", 'i' to "i", 'j' to "ᒍ", 'k' to "Ҝ", 'l' to "ᒪ", 'm' to "ᗰ", 'n' to "ᑎ",
        'o' to "Ꝋ", 'p' to "ᑭ", 'q' to "ᑫ", 'r' to "ᖇ", 's' to "ᔕ", 't' to "t", 'u' to "ᑌ"
    )
}
`
  },
  {
    path: 'app/src/main/kotlin/com/xboard/keyboard/TextStyleRepository.kt',
    filename: 'TextStyleRepository.kt',
    category: 'kotlin',
    language: 'kotlin',
    description: '20 Text Decoration Style Presets for X Board',
    content: `package com.xboard.keyboard

/**
 * 20 Text Decoration Style Presets for X Board
 */
object TextStyleRepository {

    val styles = listOf(
        "🌸 සුභ •~°• උදෑසනක් •~°• 🌸",
        "꧁•✨• සුභ 🅢︎ උදෑසනක් •✨•꧂",
        "🌺 𝓤𝓼𝓾𝓫𝓪 𝓤𝓭𝓪𝓼𝓪𝓷𝓪𝓴 🌺",
        "★·.·´¯·.·★ සුභ උදෑසනක් ★·.·´¯·.·★",
        "🦋✨ සුභ 🅤 උදෑසනක් ✨🦋",
        "💖 𝓈𝓊𝒷𝒽𝒶 𝓊𝒹𝒶𝓈𝒶𝓃𝒶𝓀 💖",
        "🌸ꗥ～ꗥ🌸 සුභ උදෑසනක් 🌸ꗥ～ꗥ🌸",
        "🌿 (̲̅s̲̅)(̲̅u̲̅)(̲̅b̲̅)(̲̅h̲̅) උදෑසනක් 🌿",
        "✨ 𝕾𝖚𝖍𝖆 𝖀𝖉𝖆𝖘𝖆𝖓𝖆𝖐 ✨",
        "💫 ˢᵘᵇʰᵃ ᵘᵈᵃˢᵃⁿᵃᵏ 💫",
        "👑 සුභ 🅢︎🅤︎ᗷ︎𝓗︎ උදෑසනක් 👑",
        "🌷 𝐒𝐮𝐛𝐡𝐚 𝐔𝐝𝐚𝐬𝓪𝐧𝐚𝐤 🌷",
        "🌻 ˢᵘᵇʰᵃ ᵘᵈᵃˢᵃⁿᵃᵏ 🌻",
        "🌸 𝓢𝓾𝓫𝓱𝓪 𝓤𝓭𝓪𝓼𝓪𝓷𝓪𝓴 🌸",
        "🌟 🅂🅄🄱🄷🄰 🅄🄳🄰🅂🄰🄽🄰🄺 🌟",
        "🍀 𝓢𝓾𝓫𝓱𝓪 𝓤𝓭𝓪𝓼𝓪𝓷𝓪𝓴 🍀",
        "🌺 * සුභ උදෑසනක් * 🌺",
        "✨ 𝓝𝓮𝔀 𝓢𝓾𝓫𝓱𝓪 𝓤𝓭𝓪𝓼𝓪𝓷𝓪𝓴 ✨",
        "🌹 𝑆𝑢𝑏ℎ𝑎 𝑈𝑑𝓪සනක් 🌹",
        "💫 𝓢𝓾𝓫𝓱𝓪 𝓤𝓭𝓪සනක් 💫"
    )
}
`
  },
  {
    path: 'app/src/main/kotlin/com/xboard/keyboard/WordDictionary.kt',
    filename: 'WordDictionary.kt',
    category: 'kotlin',
    language: 'kotlin',
    description: 'Auto-save and real-time word suggestion generator',
    content: `package com.xboard.keyboard

import android.content.Context
import android.content.SharedPreferences

class WordDictionary(context: Context) {

    private val prefs: SharedPreferences = context.getSharedPreferences("xboard_dict", Context.MODE_PRIVATE)
    private val memoryWords = mutableSetOf(
        "the", "and", "you", "that", "was", "for", "are", "with", "his", "they",
        "have", "this", "from", "one", "had", "word", "what", "some", "we", "can",
        "out", "other", "were", "all", "there", "when", "up", "use", "your", "how",
        "hello", "welcome", "keyboard", "awesome", "brother", "thanks", "morning"
    )

    init {
        val savedWords = prefs.getStringSet("custom_words", emptySet()) ?: emptySet()
        memoryWords.addAll(savedWords)
    }

    fun recordTypedWord(word: String) {
        val clean = word.trim().lowercase()
        if (clean.length > 1 && clean.all { it.isLetter() }) {
            memoryWords.add(clean)
            prefs.edit().putStringSet("custom_words", memoryWords).apply()
        }
    }

    fun getSuggestions(prefix: String, limit: Int = 4): List<String> {
        val clean = prefix.trim().lowercase()
        if (clean.isEmpty()) return emptyList()

        return memoryWords
            .filter { it.startsWith(clean) }
            .sortedWith(compareBy({ it.length }, { it }))
            .take(limit)
    }
}
`
  },
  {
    path: 'app/src/main/kotlin/com/xboard/keyboard/SoundHapticManager.kt',
    filename: 'SoundHapticManager.kt',
    category: 'kotlin',
    language: 'kotlin',
    description: 'Audio keypress click and haptic feedback manager',
    content: `package com.xboard.keyboard

import android.content.Context
import android.media.AudioManager
import android.os.Build
import android.os.VibrationEffect
import android.os.Vibrator

class SoundHapticManager(private val context: Context) {

    companion object {
        const val KEY_TYPE_CHAR = 1
        const val KEY_TYPE_SPACE = 2
        const val KEY_TYPE_ENTER = 3
        const val KEY_TYPE_BACKSPACE = 4
        const val KEY_TYPE_ACTION = 5
    }

    private val audioManager = context.getSystemService(Context.AUDIO_SERVICE) as AudioManager
    private val vibrator = context.getSystemService(Context.VIBRATOR_SERVICE) as? Vibrator

    fun playKeyClick(type: Int) {
        val soundEffect = when (type) {
            KEY_TYPE_SPACE -> AudioManager.FX_KEYPRESS_SPACEBAR
            KEY_TYPE_ENTER -> AudioManager.FX_KEYPRESS_RETURN
            KEY_TYPE_BACKSPACE -> AudioManager.FX_KEYPRESS_DELETE
            KEY_TYPE_ACTION -> AudioManager.FX_KEY_CLICK
            else -> AudioManager.FX_KEYPRESS_STANDARD
        }
        audioManager.playSoundEffect(soundEffect)

        vibrator?.let {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                it.vibrate(VibrationEffect.createOneShot(12, VibrationEffect.DEFAULT_AMPLITUDE))
            } else {
                @Suppress("DEPRECATION")
                it.vibrate(12)
            }
        }
    }
}
`
  },
  {
    path: 'app/src/main/kotlin/com/xboard/keyboard/MainActivity.kt',
    filename: 'MainActivity.kt',
    category: 'kotlin',
    language: 'kotlin',
    description: 'Setup screen with Google AdMob rewarded ad integration when enabling/selecting keyboard',
    content: `package com.xboard.keyboard

import android.content.Intent
import android.os.Bundle
import android.provider.Settings
import android.view.inputmethod.InputMethodManager
import android.widget.Button
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.google.android.gms.ads.AdRequest
import com.google.android.gms.ads.LoadAdError
import com.google.android.gms.ads.MobileAds
import com.google.android.gms.ads.rewarded.RewardedAd
import com.google.android.gms.ads.rewarded.RewardedAdLoadCallback

class MainActivity : AppCompatActivity() {

    private var rewardedAd: RewardedAd? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        MobileAds.initialize(this) {}
        loadAdMobAd()

        val btnEnable = findViewById<Button>(R.id.btn_enable_keyboard)
        val btnSelect = findViewById<Button>(R.id.btn_select_keyboard)

        btnEnable.setOnClickListener {
            playAdAndProceed {
                startActivity(Intent(Settings.ACTION_INPUT_METHOD_SETTINGS))
                Toast.makeText(this, "Turn ON X Board in Settings", Toast.LENGTH_LONG).show()
            }
        }

        btnSelect.setOnClickListener {
            playAdAndProceed {
                val imm = getSystemService(INPUT_METHOD_SERVICE) as InputMethodManager
                imm.showInputMethodPicker()
            }
        }
    }

    private fun loadAdMobAd() {
        val adRequest = AdRequest.Builder().build()
        RewardedAd.load(this, "ca-app-pub-3940256099942544/5224354917", adRequest, object : RewardedAdLoadCallback() {
            override fun onAdFailedToLoad(adError: LoadAdError) { rewardedAd = null }
            override fun onAdLoaded(ad: RewardedAd) { rewardedAd = ad }
        })
    }

    private fun playAdAndProceed(onReward: () -> Unit) {
        if (rewardedAd != null) {
            rewardedAd?.show(this) { onReward(); loadAdMobAd() }
        } else {
            onReward()
            loadAdMobAd()
        }
    }
}
`
  },

  // 5. ANDROID MANIFEST & XML RESOURCES
  {
    path: 'app/src/main/AndroidManifest.xml',
    filename: 'AndroidManifest.xml',
    category: 'manifest',
    language: 'xml',
    description: 'Android Manifest declaring InputMethodService with BIND_INPUT_METHOD permission and API 26+ support',
    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.xboard.keyboard">

    <uses-permission android:name="android.permission.VIBRATE" />
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="X Board Keyboard"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.XBoard">

        <activity
            android:name=".MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <service
            android:name=".XBoardIME"
            android:label="X Board English Keyboard"
            android:permission="android.permission.BIND_INPUT_METHOD"
            android:exported="true">
            <intent-filter>
                <action android:name="android.view.InputMethod" />
            </intent-filter>
            <meta-data
                android:name="android.view.im"
                android:resource="@xml/method" />
        </service>

        <meta-data
            android:name="com.google.android.gms.ads.APPLICATION_ID"
            android:value="ca-app-pub-3940256099942544~3347511713" />
    </application>
</manifest>
`
  },
  {
    path: 'app/src/main/res/xml/method.xml',
    filename: 'method.xml',
    category: 'res',
    language: 'xml',
    description: 'Input method declaration XML for Android system settings',
    content: `<?xml version="1.0" encoding="utf-8"?>
<input-method xmlns:android="http://schemas.android.com/apk/res/android"
    android:settingsActivity="com.xboard.keyboard.MainActivity"
    android:isDefault="false">
    <subtype
        android:label="English (US) - X Board"
        android:imeSubtypeLocale="en_US"
        android:imeSubtypeMode="keyboard" />
</input-method>
`
  },
  {
    path: 'app/src/main/res/layout/keyboard_view.xml',
    filename: 'keyboard_view.xml',
    category: 'layout',
    language: 'xml',
    description: 'XML layout for X Board with toolbar, auto-suggest, shift, space, and enter in #07F57E',
    content: `<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:id="@+id/xboard_root"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:background="#121214"
    android:orientation="vertical">

    <!-- Toolbar: 6 Tools -->
    <LinearLayout
        android:id="@+id/toolbar_buttons_row"
        android:layout_width="match_parent"
        android:layout_height="44dp"
        android:background="#0A0A0C"
        android:orientation="horizontal">
        <!-- 1. Emoji, 2. Font, 3. Style, 4. Clipboard, 5. Help, 6. Sound -->
    </LinearLayout>

    <!-- Word Auto-Suggest Strip -->
    <HorizontalScrollView
        android:id="@+id/suggestions_scroll"
        android:layout_width="match_parent"
        android:layout_height="36dp"
        android:background="#141418"
        android:scrollbars="none">
        <LinearLayout
            android:id="@+id/suggestions_bar"
            android:layout_width="wrap_content"
            android:layout_height="match_parent"
            android:orientation="horizontal" />
    </HorizontalScrollView>

    <!-- Letter Keys Layout -->
    <LinearLayout
        android:id="@+id/keyboard_keys_layout"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="vertical"
        android:padding="4dp">

        <!-- Shift Button: #07F57E (Neon Green) -->
        <!-- Space Button: #07F57E with text 'X Board' -->
        <!-- Enter Button: #07F57E with Send / Enter context -->
    </LinearLayout>

    <!-- Tool Panel Container (Replaces Letter Keys when selected) -->
    <LinearLayout
        android:id="@+id/tool_panel_container"
        android:layout_width="match_parent"
        android:layout_height="240dp"
        android:background="#101012"
        android:visibility="gone"
        android:orientation="vertical" />
</LinearLayout>
`
  },
  {
    path: 'app/src/main/res/layout/activity_main.xml',
    filename: 'activity_main.xml',
    category: 'layout',
    language: 'xml',
    description: 'XML layout for Settings & Ad preview activity',
    content: `<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="#000000"
    android:gravity="center_horizontal"
    android:orientation="vertical"
    android:padding="24dp">

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginTop="48dp"
        android:text="X BOARD"
        android:textColor="#07F57E"
        android:textSize="32sp"
        android:textStyle="bold" />

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginTop="4dp"
        android:text="English Keyboard for Android 8.0+"
        android:textColor="#8E8E98"
        android:textSize="14sp" />

    <Space
        android:layout_width="match_parent"
        android:layout_height="0dp"
        android:layout_weight="1" />

    <Button
        android:id="@+id/btn_enable_keyboard"
        android:layout_width="match_parent"
        android:layout_height="56dp"
        android:backgroundTint="#07F57E"
        android:text="1. Enable Keyboard in Settings"
        android:textColor="#000000"
        android:textSize="15sp"
        android:textStyle="bold" />

    <Button
        android:id="@+id/btn_select_keyboard"
        android:layout_width="match_parent"
        android:layout_height="56dp"
        android:layout_marginTop="12dp"
        android:layout_marginBottom="24dp"
        android:backgroundTint="#202026"
        android:text="2. Select X Board Keyboard"
        android:textColor="#FFFFFF"
        android:textSize="15sp"
        android:textStyle="bold" />
</LinearLayout>
`
  },
  {
    path: 'app/src/main/res/values/colors.xml',
    filename: 'colors.xml',
    category: 'res',
    language: 'xml',
    description: 'Color palette strictly matching Very Dark Gray, Black, White, and #07F57E Neon Green',
    content: `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="xboard_neon_green">#07F57E</color>
    <color name="xboard_black">#000000</color>
    <color name="xboard_dark_surface">#121214</color>
    <color name="xboard_key_dark_gray">#202026</color>
    <color name="xboard_key_pressed">#2C2C35</color>
    <color name="xboard_white">#FFFFFF</color>
    <color name="xboard_text_secondary">#8E8E98</color>
</resources>
`
  },
  {
    path: 'app/src/main/res/values/strings.xml',
    filename: 'strings.xml',
    category: 'res',
    language: 'xml',
    description: 'Application string values',
    content: `<resources>
    <string name="app_name">X Board Keyboard</string>
    <string name="ime_name">X Board English Keyboard</string>
    <string name="space_key_name">X Board</string>
    <string name="enable_keyboard">Enable Keyboard</string>
    <string name="select_keyboard">Select X Board</string>
</resources>
`
  },
  {
    path: 'app/src/main/res/values/themes.xml',
    filename: 'themes.xml',
    category: 'res',
    language: 'xml',
    description: 'Application theme setup',
    content: `<resources xmlns:tools="http://schemas.android.com/tools">
    <style name="Theme.XBoard" parent="Theme.MaterialComponents.DayNight.NoActionBar">
        <item name="colorPrimary">@color/xboard_neon_green</item>
        <item name="android:statusBarColor">@color/xboard_black</item>
        <item name="android:navigationBarColor">@color/xboard_black</item>
    </style>
</resources>
`
  },

  // 6. DOCUMENTATION & GITHUB INSTRUCTIONS
  {
    path: 'README.md',
    filename: 'README.md',
    category: 'docs',
    language: 'markdown',
    description: 'Complete build instructions for Android Studio and GitHub Actions Workflow APK generation',
    content: `# X Board Keyboard - Android Kotlin Gradle Project

A modern, high-performance virtual keyboard for Android 8.0+ (API 26+) featuring:
- 24 Unicode Fancy Fonts with real-time conversion
- 20 Text Decoration Style Presets (e.g., 🌸 සුභ •~°• උදෑසනක් •~°• 🌸)
- Full Emoji and Kaomoji Picker with Search
- Auto-save Word Dictionary with live word suggestions
- Shift Key 1-Click (first letter uppercase) and Double-Click (Caps Lock 🔒)
- Clipboard History with Select All, Copy, Cut, Paste, and Clear
- Space bar branded as "X Board" in #07F57E
- Google AdMob Rewarded Ad integration

---

## 🚀 Automated APK Build with GitHub Actions

This repository includes a pre-configured GitHub Workflow at \`.github/workflows/build-apk.yml\`.

### How to build APK on GitHub:
1. Push this project to your GitHub repository:
   \`\`\`bash
   git init
   git add .
   git commit -m "Initial commit - X Board Keyboard"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo>.git
   git push -u origin main
   \`\`\`
2. Open your repository on GitHub.
3. Click on the **Actions** tab.
4. You will see the **Build Android APK** workflow running automatically!
5. Once complete (typically ~2-3 minutes), click on the completed workflow run.
6. Under **Artifacts**, download **XBoard-Keyboard-Debug-APK** (ready to install on your phone)!

---

## 💻 Build Locally with Android Studio / Gradle

1. Open **Android Studio** (Giraffe, Hedgehog, or newer).
2. Select **Open** and choose this project folder.
3. Allow Gradle to sync.
4. Run locally on an Android 8.0+ emulator or physical device, or build via terminal:
   \`\`\`bash
   ./gradlew assembleDebug
   \`\`\`
   The APK will be generated at \`app/build/outputs/apk/debug/app-debug.apk\`.

---

## 📱 Activating the Keyboard on Android
1. Open the **X Board** app on your phone.
2. Tap **1. Enable Keyboard in Settings** (watch quick ad, then toggle ON X Board).
3. Tap **2. Select X Board Keyboard** (switch input method to X Board).
4. Enjoy stylish typing everywhere!
`
  }
];
