const express = require('express');
const HaxballJS = require('haxball.js');
const app = express();

app.get('/', (req, res) => res.send('⚽ Host de Beni 24/7 Activo ⚽'));
app.listen(process.env.PORT || 3000);

// CAMBIO AQUÍ: Usamos la función directa
async function start() {
    const HBInit = await HaxballJS;
    
    const room = HBInit({
        roomName: "⚽⚽JUEGAN TODOS CON BENI⚽⚽",
        maxPlayers: 30,
        public: true,
        noPlayer: true,
        token: "thr1.AAAAAGnLBLWzwxr4uV4RSQ.zzUbgPax2vs" // <--- PONÉ TU TOKEN NUEVO ACÁ
    });

    room.onRoomLink = (link) => {
        console.log("¡SALA ABIERTA CON ÉXITO!");
        console.log("Link de la sala: " + link);
    };

    // --- TODO TU SCRIPT DE ANTES ---
    var adminPassword = "beni2022";
    var ownerPassword = "benicabj2022";
    var jueganTodos = false;
    var startTime = true;

    function setAdminColor(player) {
        room.setPlayerAvatar(player.id, "★");
        room.setPlayerAdmin(player.id, true);
    }

    room.onPlayerJoin = function(player) {
        room.sendAnnouncement("Bienvenido " + player.name + " ⚽", player.id, 0x00FF00, "bold");
    };

    room.onPlayerChat = function(player, message) {
        if (message === "!admin " + adminPassword) {
            setAdminColor(player);
            room.sendAnnouncement(player.name + " es ADMIN ✅", null, 0xFFFFFF, "bold");
            return false;
        }
        if (message === "!info") {
            room.sendAnnouncement("Soy beni, un streamer de chaco, seguime en todas mis redes", player.id, 0x00FFFF, "bold");
            return false;
        }
        return true;
    };
    // --------------------------------
}

start(); // Esto arranca el bot
