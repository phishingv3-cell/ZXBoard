package com.xboard.keyboard

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
 * X Board Virtual Keyboard Service
 * Compatible with Android 8.0 Oreo (API 26) and newer
 * Color Palette:
 * - Very Dark Gray (#121214 / #202026)
 * - Black (#000000)
 * - White (#FFFFFF)
 * - Neon Green (#07F57E)
 */
class XBoardIME : InputMethodService() {

    enum class ShiftState {
        LOWERCASE,          // Simple letters (a-z)
        FIRST_LETTER_UPPER, // 1 click: First letter only uppercase, then reverts to lowercase
        CAPS_LOCKED         // Double click: All uppercase locked (A-Z)
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
