package com.example.pz3.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import java.io.File

@Composable
fun ThirdScreen() {
    val context = LocalContext.current
    val filesDir = context.filesDir.absolutePath

    val filePaths = remember {
        listOf(
            "$filesDir/file1.txt",
            "$filesDir/file2.txt",
            "$filesDir/file3.txt"
        )
    }

    var resultText by remember { mutableStateOf("") }

    fun countSentences(text: String): Int {
        if (text.isBlank()) return 0
        val regex = "[.!?]+".toRegex()
        return regex.findAll(text).count()
    }

    fun readFiles(paths: List<String>) {
        if (paths.isEmpty()) {
            resultText = "File list is empty"
            return
        }

        val summary = StringBuilder()

        for (path in paths) {
            val file = File(path)
            if (file.exists()) {
                val count = countSentences(file.readText())
                summary.append("${file.name}: sentences count — $count\n")
            } else {
                summary.append("${file.name}: file not found\n")
            }
        }

        resultText = summary.toString()
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Text("File Analyzer", fontSize = 24.sp)

        Button(
            onClick = { readFiles(filePaths) },
            modifier = Modifier.fillMaxWidth()
        ) {
            Text("Count Sentences")
        }

        if (resultText.isNotEmpty()) {
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = Color(0xFFF5F5F5))
            ) {
                Text(
                    text = resultText,
                    fontSize = 16.sp,
                    modifier = Modifier.padding(16.dp),
                    lineHeight = 22.sp
                )
            }
        }
    }
}