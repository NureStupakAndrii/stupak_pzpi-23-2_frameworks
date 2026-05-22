package com.example.pz3.navigation

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material.icons.filled.Person
import androidx.compose.ui.graphics.vector.ImageVector

sealed class BottomTab(
    val route: String,
    val title: String,
    val icon: ImageVector,
) {
    data object First : BottomTab(
        route = "first",
        title = "First",
        icon = Icons.Filled.Home,
    )

    data object Second : BottomTab(
        route = "second",
        title = "Second",
        icon = Icons.Filled.Favorite,
    )

    data object Third : BottomTab(
        route = "third",
        title = "Third",
        icon = Icons.Filled.Notifications,
    )

    data object Fourth : BottomTab(
        route = "fourth",
        title = "Fourth",
        icon = Icons.Filled.Person,
    )
}
