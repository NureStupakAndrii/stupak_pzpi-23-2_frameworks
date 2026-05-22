package com.example.pz3

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.tooling.preview.Preview
import com.example.pz3.navigation.AppNavHost
import com.example.pz3.ui.theme.PZ3Theme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            PZ3Theme(
                darkTheme = isSystemInDarkTheme(),
                dynamicColor = true
            ) {
                AppNavHost()
            }
        }
    }
}

@Composable
fun Pz3App() {
    AppNavHost()
}

@Preview(showBackground = true)
@Composable
fun Pz3AppPreview() {
    PZ3Theme(
        darkTheme = false,
        dynamicColor = false
    ) {
        Pz3App()
    }
}
