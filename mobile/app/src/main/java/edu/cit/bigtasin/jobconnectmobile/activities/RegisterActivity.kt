package edu.cit.bigtasin.jobconnectmobile.activities

import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import edu.cit.bigtasin.jobconnectmobile.databinding.ActivityRegisterBinding
import edu.cit.bigtasin.jobconnectmobile.models.RegisterRequest
import edu.cit.bigtasin.jobconnectmobile.network.RetrofitClient
import kotlinx.coroutines.launch

class RegisterActivity : AppCompatActivity() {
    private lateinit var binding: ActivityRegisterBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityRegisterBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.btnRegister.setOnClickListener {
            val username = binding.etUsername.text.toString().trim()
            val email = binding.etEmail.text.toString().trim()
            val password = binding.etPassword.text.toString()
            val fullName = binding.etFullName.text.toString().trim()
            val roleSpinner = binding.spinnerRole.selectedItem.toString()
            val role = when (roleSpinner) {
                "Employer" -> "EMPLOYER"
                else -> "JOBSEEKER"
            }

            if (username.isEmpty() || email.isEmpty() || password.isEmpty() || fullName.isEmpty()) {
                Toast.makeText(this, "Please fill all fields", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }
            performRegister(username, email, password, fullName, role)
        }

        binding.tvLogin.setOnClickListener { finish() }
    }

    private fun performRegister(username: String, email: String, password: String, fullName: String, role: String) {
        lifecycleScope.launch {
            try {
                val request = RegisterRequest(username, email, password, fullName, role)
                val response = RetrofitClient.instance.register(request)
                Toast.makeText(this@RegisterActivity, response.message, Toast.LENGTH_SHORT).show()
                finish()
            } catch (e: Exception) {
                Toast.makeText(this@RegisterActivity, "Registration failed: ${e.message}", Toast.LENGTH_SHORT).show()
            }
        }
    }
}