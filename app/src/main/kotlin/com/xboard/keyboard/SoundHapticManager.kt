package com.xboard.keyboard

import android.content.Context
import android.media.AudioManager
import android.os.Build
import android.os.VibrationEffect
import android.os.Vibrator

class SoundHapticManager(context: Context) {
    private val audioManager = context.getSystemService(Context.AUDIO_SERVICE) as? AudioManager
    private val vibrator = context.getSystemService(Context.VIBRATOR_SERVICE) as? Vibrator

    var isSoundEnabled: Boolean = true
    var isHapticEnabled: Boolean = true

    companion object {
        const val KEY_TYPE_CHAR = 1
        const val KEY_TYPE_SPACE = 2
        const val KEY_TYPE_ENTER = 3
        const val KEY_TYPE_BACKSPACE = 4
        const val KEY_TYPE_ACTION = 5
    }

    fun playKeyClick(type: Int) {
        if (isSoundEnabled && audioManager != null) {
            val fx = when (type) {
                KEY_TYPE_BACKSPACE -> AudioManager.FX_KEYPRESS_DELETE
                KEY_TYPE_ENTER -> AudioManager.FX_KEYPRESS_RETURN
                KEY_TYPE_SPACE -> AudioManager.FX_KEYPRESS_SPACEBAR
                else -> AudioManager.FX_KEYPRESS_STANDARD
            }
            audioManager.playSoundEffect(fx)
        }

        if (isHapticEnabled && vibrator != null && vibrator.hasVibrator()) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                vibrator.vibrate(VibrationEffect.createOneShot(12, VibrationEffect.DEFAULT_AMPLITUDE))
            } else {
                @Suppress("DEPRECATION")
                vibrator.vibrate(12)
            }
        }
    }
}
