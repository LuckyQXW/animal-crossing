(function() {
    "use strict";
    const BASE_URL = "https://acnhapi.com/v1/songs/";
    const musicContainer = document.getElementById("music-container");
    const searchBar = document.getElementById("music-search");
    let songData = null;

    window.addEventListener("load", init);

    function init() {
        loadAllSongs();
        searchBar.addEventListener("keyup", loadSomeSongs);
    }

    function loadAllSongs() {
        if (!songData) {
            fetch(BASE_URL)
                .then(checkStatus)
                .then(JSON.parse)
                .then(data => {
                    songData = Object.values(data);
                    loadAllSongs();
                })
                .catch(handleError)
        } else {
            for (let i = 0; i < songData.length; i++) {
                addSong(songData[i]);
            }
        }
    }

    function loadSomeSongs() {
        const searchTerm = searchBar.value.toLowerCase();
        musicContainer.innerHTML = "";
        if (searchTerm === "") {
            loadAllSongs();
        } else {
            for (let i = 0; i < songData.length; i++) {
                if (songData[i].name["name-USen"].toLowerCase().includes(searchTerm)) {
                    addSong(songData[i]);
                }
            }
        }
    }
    function addSong(song) {
        const container = document.createElement("div");
        container.classList.add("music-container-item");
        const img = document.createElement("img");
        img.src = song["image_uri"];
        img.alt = song.name["name-USen"];
        const audio = document.createElement("audio");
        audio.src = song["music_uri"];
        audio.controls = "controls";
        container.appendChild(img);
        container.appendChild(audio);
        musicContainer.appendChild(container);
    }

    function checkStatus(response) {
        let responseText = response.text();
        if (response.status >= 200 && response.status < 300 || response.status == 0) {
            return responseText;
        } else {
            return responseText.then(Promise.reject.bind(Promise));
        }
    }

    function handleError(err){
        console.error(err);
    }

})();