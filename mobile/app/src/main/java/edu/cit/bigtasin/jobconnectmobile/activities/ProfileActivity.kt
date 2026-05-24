package edu.cit.bigtasin.jobconnectmobile.activities

import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import edu.cit.bigtasin.jobconnectmobile.databinding.ActivityProfileBinding
import edu.cit.bigtasin.jobconnectmobile.utils.TokenManager

class ProfileActivity : AppCompatActivity() {
    private lateinit var binding: ActivityProfileBinding
    private lateinit var tokenManager: TokenManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityProfileBinding.inflate(layoutInflater)
        setContentView(binding.root)

        tokenManager = TokenManager(this)

        val user = tokenManager.getUser()
        binding.tvUsername.text = user["username"]
        binding.tvEmail.text = user["email"]
        binding.tvFullName.text = user["fullName"]
        binding.tvRole.text = user["role"]

        binding.toolbar.setNavigationOnClickListener { onBackPressed() }

        binding.btnLogout.setOnClickListener {
            tokenManager.clear()
            startActivity(Intent(this, LoginActivity::class.java))
            finishAffinity()
        }
    }
}