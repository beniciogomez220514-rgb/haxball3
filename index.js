const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('Host de Haxball Activo'));
app.listen(process.env.PORT || 3000);

// ABAJO DE ESTO PEGÁ TU CÓDIGO (HBInit, etc.)
var room = HBInit({
  roomName: "⚽⚽JUEGAN TODOS CON BENI⚽⚽",
  maxPlayers: 30,
  public: true,
  noPlayer: true
});

// CONFIG
var adminPassword = "beni2022";
var ownerPassword = "benicabj2022";

var jueganTodos = false;
var startTime = true;
var cooldown = false;

// COLORES
function setAdminColor(player){
  room.setPlayerDiscProperties(player.id, { }); // evita errores
  room.setPlayerAvatar(player.id, "★");
  room.setPlayerAdmin(player.id, true);
}

function sendAdminMsg(msg, color){
  room.sendAnnouncement(msg, null, color, "bold");
}

// CUANDO ENTRA UN JUGADOR
room.onPlayerJoin = function(player){
  room.sendAnnouncement("Bienvenido " + player.name + " ⚽", player.id, 0x00FF00, "bold");

  if(jueganTodos){
    if(room.getPlayerList().filter(p => p.team != 0).length < 30){
      room.setPlayerTeam(player.id, (room.getPlayerList().length % 2) + 1);
    }
  }
};

// COMANDOS
room.onPlayerChat = function(player, message){
  
  // LOGIN ADMIN
  if(message === "!admin " + adminPassword){
    setAdminColor(player);
    sendAdminMsg(player.name + " es ADMIN ✅", 0xFFFFFF);
    return false;
  }

  // LOGIN OWNER
  var ownerPassword = "beni123";
 if(message === "!owner " + ownerPassword){
    setAdminColor(player);
    sendAdminMsg(player.name + " es OWNER 👑", 0xFFFF00);
    return false;
  }

  // SOLO ADMINS / OWNER
  if(player.admin){

    // JUEGAN TODOS
    if(message === "!juegantodos on"){
      jueganTodos = true;
      sendAdminMsg("Modo JUEGAN TODOS ACTIVADO", 0x00FF00);
      return false;
    }

    if(message === "!juegantodos off"){
      jueganTodos = false;
      sendAdminMsg("Modo JUEGAN TODOS DESACTIVADO", 0xFF0000);
      return false;
    }

    // STARTIME
    if(message === "!startime on"){
      startTime = true;
      sendAdminMsg("Cooldown ACTIVADO", 0x00FF00);
      return false;
    }

    if(message === "!startime off"){
      startTime = false;
      sendAdminMsg("Cooldown DESACTIVADO", 0xFF0000);
      return false;
    }
  }

  // HELP (VERDE)
  if(message === "!help"){
    room.sendAnnouncement("Comandos disponibles:", player.id, 0x00FF00, "bold");
    room.sendAnnouncement("!kick https://kick.com/benicabj22", player.id, 0x00FF00);
    room.sendAnnouncement("!twitch https://www.twitch.tv/benicabj22", player.id, 0x00FF00);
    room.sendAnnouncement("!info", player.id, 0x00FF00);
    return false;
  }

  // INFO
  if(message === "!info"){
    room.sendAnnouncement("Soy beni, un streamer de chaco que le gusta jugar al hax y al roblox, seguime en todas mis redes", player.id, 0x00FFFF, "bold");
    return false;
  }

  return true;
};

// AUTO START + COOLDOWN
room.onGameStop = function(){
  if(startTime){
    cooldown = true;
    room.sendAnnouncement("Nuevo partido en 5 segundos...", null, 0xFFA500, "bold");

    setTimeout(function(){
      room.startGame();
      cooldown = false;
    }, 5000);
  } else {
    room.startGame();
  }
};

// AUTO ADMIN SI NO HAY
room.onPlayerLeave = function(){
  var players = room.getPlayerList();
  if(players.length > 0 && !players.some(p => p.admin)){
    room.setPlayerAdmin(players[0].id, true);
  }
};
