const LOCAL_MULTIPLAYER_GAME = 'localMultiPlayer'
const LOCAL_SINGLEPLAYER_GAME = 'singlePlayer'
const ONLINE_MULTIPLAYER_GAME = 'onlineMultiPlayer'

const ROW_1 = [0,1,2]
const ROW_2 = [3,4,5]
const ROW_3 = [6,7,8]

const COLUMN_1 = [0,3,6]
const COLUMN_2 = [1,4,7]
const COLUMN_3 = [2,5,8]

const DIAGONAL_1 = [2,4,6]
const DIAGONAL_2 = [0,4,8]

const WINNING_POSSIBILITIES = [ROW_1, ROW_2, ROW_3, COLUMN_1, COLUMN_2, COLUMN_3, DIAGONAL_1, DIAGONAL_2]

//const SERVER_URL = 'http://localhost:3001'
const SERVER_URL = 'https://reactic-tac-toe-server.herokuapp.com'

export {LOCAL_MULTIPLAYER_GAME, LOCAL_SINGLEPLAYER_GAME, ONLINE_MULTIPLAYER_GAME, WINNING_POSSIBILITIES, SERVER_URL}