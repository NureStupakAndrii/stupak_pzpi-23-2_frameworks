package com.example.pz3.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlin.random.Random

data class DiceThrow(
    val player: Int,
    val value: Int
)

@Composable
fun SecondScreen() {
    val maxThrowsPerPlayer = 3

    var throwsHistory by remember { mutableStateOf<List<DiceThrow>>(emptyList()) }

    var currentPlayer by remember { mutableStateOf(1) }
    var gameResult by remember { mutableStateOf("Player 1 turn") }

    val player1Throws = throwsHistory.filter { it.player == 1 }
    val player2Throws = throwsHistory.filter { it.player == 2 }

    val isGameFinished = player1Throws.size == maxThrowsPerPlayer && player2Throws.size == maxThrowsPerPlayer

    fun resetGame() {
        throwsHistory = emptyList()
        currentPlayer = 1
        gameResult = "Player 1 turn"
    }

    fun playerDice() {
        val diceValue = Random.nextInt(1, 7)

        throwsHistory = throwsHistory + DiceThrow(
            player = currentPlayer,
            value = diceValue
        )

        val updatedPlayer1Throws = throwsHistory.filter { it.player == 1 }
        val updatedPlayer2Throws = throwsHistory.filter { it.player == 2 }

        val gameFinishedAfterThrow = updatedPlayer1Throws.size == maxThrowsPerPlayer && updatedPlayer2Throws.size == maxThrowsPerPlayer

        if (gameFinishedAfterThrow) {
            val p1Sum = updatedPlayer1Throws.sumOf { it.value }
            val p2Sum = updatedPlayer2Throws.sumOf { it.value }

            gameResult = when {
                p1Sum > p2Sum -> "Player 1 won!"
                p2Sum > p1Sum -> "Player 2 won!"
                else -> "It's a draw!"
            }
        } else {
            currentPlayer = if (currentPlayer == 1) 2 else 1
            gameResult = "Player $currentPlayer turn"
        }
    }

    Box(
        modifier = Modifier.fillMaxSize()
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp)
                .padding(bottom = 88.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            Text(
                text = "Roll The Dice",
                fontSize = 28.sp
            )

            val resultColor =
                if (gameResult.contains("won", ignoreCase = true)) {
                    Color(0xFF2E7D32)
                } else {
                    Color.Unspecified
                }

            Text(
                text = gameResult,
                fontSize = 22.sp,
                color = resultColor
            )

            Text(
                text = "Player 1 sum: ${player1Throws.sumOf { it.value }}",
                fontSize = 18.sp
            )

            Text(
                text = "Player 2 sum: ${player2Throws.sumOf { it.value }}",
                fontSize = 18.sp
            )

            LazyColumn(
                modifier = Modifier.fillMaxWidth(),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                itemsIndexed(throwsHistory) { index, diceThrow ->
                    Card(
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text(
                            text = "${index + 1}. 🎲 Player ${diceThrow.player} threw: ${diceThrow.value}",
                            fontSize = 18.sp,
                            modifier = Modifier.padding(16.dp)
                        )
                    }
                }
            }
        }

        Button(
            onClick = {
                if (isGameFinished) {
                    resetGame()
                } else {
                    playerDice()
                }
            },
            modifier = Modifier
                .fillMaxWidth()
                .align(Alignment.BottomCenter)
                .padding(16.dp),
            colors = ButtonDefaults.buttonColors(
                containerColor = if (currentPlayer == 1) {
                    Color(0xFF6200EE)
                } else {
                    Color(0xFF0077C2)
                },
                contentColor = Color.White
            )
        ) {
            Text(
                text = if (isGameFinished) {
                    "Start new game"
                } else {
                    "Throw Player $currentPlayer"
                }
            )
        }
    }
}