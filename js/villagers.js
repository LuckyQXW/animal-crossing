(function() {
    "use strict";
    const BASE_URL = "https://acnhapi.com/v1/villagers/";
    const NUM_VILLAGERS = 391;
    const randomBtn = document.getElementById("random-btn");
    const villagerContainer = document.querySelector(".village-bg");
    const villagerContainers = document.querySelectorAll(".villager-container");
    let villagerData = null;
    const villagerIds = getVillagerIds();

    window.addEventListener("load", init);

    function init() {
        randomBtn.addEventListener("click", loadRandomVillagers);
        loadRandomVillagers();
    }

    function getVillagerIds() {
        let ids = [];
        for (let i = 0; i < NUM_VILLAGERS; i++) {
            ids.push(i);
        }
        return ids;
    }

    function loadRandomVillagers() {
        if (!villagerData) {
            fetch(BASE_URL)
                .then(checkStatus)
                .then(JSON.parse)
                .then(data => {
                    villagerData = Object.values(data);
                    loadRandomVillagers();
                })
                .catch(handleError)
        } else {
            clearVillagers();
            let chosenIds = getRandomSubarray(villagerIds, 3);
            for (let i = 0; i < chosenIds.length; i++) {
                let id = chosenIds[i];
                displayVillager(i, id);
            }
        }
    }

    function getRandomSubarray(arr, size) {
        var shuffled = arr.slice(0), i = arr.length, temp, index;
        while (i--) {
            index = Math.floor((i + 1) * Math.random());
            temp = shuffled[index];
            shuffled[index] = shuffled[i];
            shuffled[i] = temp;
        }
        return shuffled.slice(0, size);
    }

    function displayVillager(containerId, villagerId) {
        const container = villagerContainers[containerId];
        const name = villagerData[villagerId - 1].name["name-USen"];
        container.children[0].src = villagerData[villagerId - 1]["image_uri"];
        container.children[0].alt = name;
        container.children[1].textContent = name;
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

    function clearVillagers() {
        // villagerContainer.innerHTML = "";
    }
})();