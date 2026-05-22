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
fun FourthScreen() {
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

    fun extractSentences(text: String): List<String> {
        if (text.isBlank()) return emptyList()

        val regex = "[.!?]+".toRegex()
        val sentences = text.split(regex)

        return sentences
            .map { it.trim() }
            .filter { it.isNotEmpty() }
    }

    fun analyzeDuplicateSentences(paths: List<String>) {
        if (paths.isEmpty()) {
            resultText = "File list is empty"
            return
        }

        val allSentences = mutableListOf<String>()

        for (path in paths) {
            val file = File(path)
            if (file.exists()) {
                val sentences = extractSentences(file.readText())
                allSentences.addAll(sentences)
            }
        }

        if (allSentences.isEmpty()) {
            resultText = "No sentences found in any file"
            return
        }

        val sentenceCounts = allSentences.groupingBy { it }.eachCount()
        val duplicates = sentenceCounts.filter { it.value > 1 }

        val summary = StringBuilder()
        summary.append("Total unique duplicate sentences found: ${duplicates.size}\n\n")

        if (duplicates.isEmpty()) {
            summary.append("No repeating sentences found across the files.")
        } else {
            for ((sentence, count) in duplicates) {
                summary.append("\"$sentence\"\nRepeats: $count times\n\n")
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
        Text("Duplicate Sentence Finder", fontSize = 24.sp)

        Button(
            onClick = { analyzeDuplicateSentences(filePaths) },
            modifier = Modifier.fillMaxWidth()
        ) {
            Text("Find Duplicate Sentences")
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