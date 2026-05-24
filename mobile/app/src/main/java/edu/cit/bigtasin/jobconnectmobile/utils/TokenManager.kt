package edu.cit.bigtasin.jobconnectmobile.utils

import android.content.Context
import android.content.SharedPreferences

class TokenManager(context: Context) {
    private val prefs: SharedPreferences = context.getSharedPreferences("jobconnect_prefs", Context.MODE_PRIVATE)

    fun saveToken(token: String) {
        prefs.edit().putString("auth_token", token).apply()
    }

    fun getToken(): String? = prefs.getString("auth_token", null)

    fun saveUser(username: String, email: String, role: String, fullName: String) {
        prefs.edit().apply {
            putString("username", username)
            putString("email", email)
            putString("role", role)
            putString("fullName", fullName)
        }.apply()
    }

    fun getUser(): Map<String, String?> = mapOf(
        "username" to prefs.getString("username", null),
        "email" to prefs.getString("email", null),
        "role" to prefs.getString("role", null),
        "fullName" to prefs.getString("fullName", null)
    )

    fun isLoggedIn(): Boolean = getToken() != null

    fun clear() = prefs.edit().clear().apply()
}