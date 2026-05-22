package com.example.pz3.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlin.math.roundToInt

@Composable
fun FirstScreen() {
    var value1 by remember { mutableStateOf("") }
    var value2 by remember { mutableStateOf("") }

    var resultText by remember { mutableStateOf("") }
    var resultText2 by remember { mutableStateOf("") }


    fun divideValues() {
        val num1 = value1.toIntOrNull()
        val num2 = value2.toIntOrNull()

        if (num1 == null || num2 == null) {
            resultText = "Invalid Numbers"
            return
        }

        if (num2 == 0) {
            resultText = "Can't divide by zero"
            return
        }

        val res = (num1 / num2)
        val res2 = (num1 % num2)
        resultText = "Result: $res, $res2"
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Text("First", fontSize = 24.sp)

        OutlinedTextField(
            value = value1,
            onValueChange = { value1 = it },
            label = { Text("First Value") },
            modifier = Modifier.fillMaxWidth()
        )

        OutlinedTextField(
            value = value2,
            onValueChange = { value2 = it },
            label = { Text("Second Value") },
            modifier = Modifier.fillMaxWidth()
        )

        Button(onClick = {divideValues()},
            modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = 4.dp))
        {
            Text("Submit")
        }

        if (resultText.isNotEmpty()) {
            Text(text = resultText, fontSize = 18.sp)
            Text(text = resultText2, fontSize = 18.sp)
        }
    }
}