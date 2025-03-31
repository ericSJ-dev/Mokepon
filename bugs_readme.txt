Unfixed Bugs

1. There's a problem when logged into the game's map, it's possible to appear in other's player current position 
so the game instantly starts if you touch other player's icon.

possible solution: to create a method that verifies current players, their positions and the position where you are gonna appear

2. there's a problem when player starts a fight against other player, the icon of the two players in the battle still
remaining in the game's map so any other player that touches those icons is gonna get into a fight too, but there's no 
opponent.

possible solution: to quit the players icons from the game's map when they start fighting

3. there's a problem when the players that where fighting finish the battle, the icons of those players still appear 
in the game's map even tho the players close the game, making it an obstacle for other players.

possible solution: removing all player's information and icons as soon as he joins a battle or as soon as he wins or loses a battle.