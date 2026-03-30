const express = require('express');
const HaxballJS = require('haxball.js');
const app = express();

// Esto mantiene vivo el servidor en Render
app.get('/', (req, res) => res.send('⚽ Host de Beni 24/7 Activo ⚽'));
app.listen(process.env.PORT || 3000);

HaxballJS.then((HBInit) => {
    // CONFIGURACIÓN DE TU SALA
    const room = HBInit({
        roomName: "⚽⚽JUEGAN TODOS CON BENI⚽⚽",
        maxPlayers: 30,
        public: true,
        noPlayer: true,
        token: "thr1.AAAAAGnLBLWzwxr4uV4RSQ.zzUbgPax2vs" // <--- PEGÁ TU TOKEN ENTRE LAS COMILLAS
    });

    room.onRoomLink = (link) => {
        console.log("¡SALA ABIERTA CON ÉXITO!");
        console.log("Link de la sala: " + link);
    };

    // VARIABLES DE TU SCRIPT
    var adminPassword = "beni2022";
    var ownerPassword = "benicabj2022";
    var jueganTodos = false;
    var startTime = true;

    // FUNCIONES AUXILIARES
    function setAdminColor(player) {
        room.setPlayerAvatar(player.id, "★");
        room.setPlayerAdmin(player.id, true);
    }

    function sendAdminMsg(msg, color) {
        room.sendAnnouncement(msg, null, color, "bold");
    }

    // EVENTO: ENTRA JUGADOR
    room.onPlayerJoin = function(player) {
        room.sendAnnouncement("Bienvenido " + player.name + " ⚽", player.id, 0x00FF00, "bold");

        if (jueganTodos) {
            if (room.getPlayerList().filter(p => p.team != 0).length < 30) {
                room.setPlayerTeam(player.id, (room.getPlayerList().length % 2) + 1);
            }
        }
    };

    // EVENTO: CHAT (COMANDOS)
    room.onPlayerChat = function(player, message) {
        // LOGIN ADMIN
        if (message === "!admin " + adminPassword) {
            setAdminColor(player);
            sendAdminMsg(player.name + " es ADMIN ✅", 0xFFFFFF);
            return false;
        }

        // LOGIN OWNER
        if (message === "!owner " + ownerPassword) {
            setAdminColor(player);
            sendAdminMsg(player.name + " es OWNER 👑", 0xFFFF00);
            return false;
        }

        // SOLO PARA ADMINS
        if (player.admin) {
            if (message === "!juegantodos on") {
                jueganTodos = true;
                sendAdminMsg("Modo JUEGAN TODOS ACTIVADO", 0x00FF00);
                return false;
            }
            if (message === "!juegantodos off") {
                jueganTodos = false;
                sendAdminMsg("Modo JUEGAN TODOS DESACTIVADO", 0xFF0000);
                return false;
            }
            if (message === "!startime on") {
                startTime = true;
                sendAdminMsg("Cooldown ACTIVADO", 0x00FF00);
                return false;
            }
            if (message === "!startime off") {
                startTime = false;
                sendAdminMsg("Cooldown DESACTIVADO", 0xFF0000);
                return false;
            }
        }

        // COMANDOS PÚBLICOS (KICK / TWITCH / HELP)
        if (message === "!help") {
            room.sendAnnouncement("Comandos disponibles:", player.id, 0x00FF00, "bold");
            room.sendAnnouncement("!kick https://kick.com/benicabj22", player.id, 0x00FF00);
            room.sendAnnouncement("!twitch https://www.twitch.tv/benicabj22", player.id, 0x00FF00);
            room.sendAnnouncement("!info", player.id, 0x00FF00);
            return false;
        }

        if (message === "!info") {
            room.sendAnnouncement("Soy beni, un streamer de chaco que le gusta jugar al hax y al roblox, seguime en todas mis redes", player.id, 0x00FFFF, "bold");
            return false;
        }

        return true;
    };

    // AUTO START CUANDO TERMINA EL PARTIDO
    room.onGameStop = function() {
        if (startTime) {
            room.sendAnnouncement("Nuevo partido en 5 segundos...", null, 0xFFA500, "bold");
            setTimeout(function() {
                room.startGame();
            }, 5000);
        } else {
            room.startGame();
        }
    };

    // AUTO ADMIN SI LA SALA QUEDA VACÍA
    room.onPlayerLeave = function() {
        var players = room.getPlayerList();
        if (players.length > 0 && !players.some(p => p.admin)) {
            room.setPlayerAdmin(players[0].id, true);
        }
    };
});
