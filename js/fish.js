(function() {
    "use strict";
    const BASE_URL = "https://acnhapi.com/v1/fish/";
    const NUM_FISH = 80;
    const NUM_FISH_PER_PAGE = 10;
    const fishTable = document.getElementById("fish-table-body")
    const nextBtn = document.getElementById("next-btn");
    const prevBtn = document.getElementById("prev-btn");
    let currPageId = 0;
    let fishData = null;
    let fishDataOriginal = null;

    window.addEventListener("load", init);

    function init() {
        loadFish(currPageId);
        nextBtn.addEventListener("click", loadNextPage);
        prevBtn.addEventListener("click", loadPrevPage);
        let radioBtns = document.querySelectorAll("input[name='sort']");
        for (let i = 0; i < radioBtns.length; i++) {
            radioBtns[i].addEventListener("click", onSelectFilter);
        }
    }

    function loadFish(pageId) {
        if (!fishData) {
            fetch(BASE_URL)
                .then(checkStatus)
                .then(JSON.parse)
                .then(data => {
                    fishData = Object.values(data);
                    fishDataOriginal = JSON.parse(JSON.stringify(fishData));
                    loadFish(pageId);
                })
                .catch(handleError)
        } else {
            for (let i = pageId * NUM_FISH_PER_PAGE; i < (pageId + 1) * NUM_FISH_PER_PAGE; i++) {
                let row = document.createElement("tr");
                fishTable.appendChild(row);
                row.id = "fish" + fishData[i].id;
                displayFish(fishData[i])
            }
        }
    }

    function displayFish(data) {
        let id = "fish" + data.id;
        addCellToRow(data.name["name-USen"], id);
        addCellToRow(data.availability["month-northern"], id);
        addCellToRow(data.availability["month-southern"], id);
        addCellToRow(data.price, id);
        addImgCellToRow(data["icon_uri"], data.name["name-USen"] + " icon", id);
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

    function addCellToRow(content, rowId) {
        let row = document.getElementById(rowId);
        let cell = document.createElement("td");
        cell.textContent = content;
        row.appendChild(cell);
    }

    function addImgCellToRow(uri, alt, rowId) {
        let row = document.getElementById(rowId);
        let cell = document.createElement("td");
        let img = document.createElement("img");
        img.src = uri;
        img.alt = alt;
        cell.appendChild(img);
        row.appendChild(cell);
    }

    function loadNextPage() {
        currPageId++;
        if (currPageId == NUM_FISH / NUM_FISH_PER_PAGE - 1) {
            nextBtn.classList.add("hidden");
        }
        if (currPageId > 0) {
            prevBtn.classList.remove("hidden");
        }
        loadCurrPage();
    }

    function loadPrevPage() {
        currPageId--;
        if (currPageId < NUM_FISH / NUM_FISH_PER_PAGE - 1) {
            nextBtn.classList.remove("hidden");
        }
        if (currPageId == 0) {
            prevBtn.classList.add("hidden");
        }
        if (currPageId < 0) {
            console.error("No more pages to load");
        }
        loadCurrPage();
    }

    function clearTable() {
        document.getElementById("fish-table-body").innerHTML = "";
    }

    function loadCurrPage() {
        clearTable();
        loadFish(currPageId);
    }

    function onSelectFilter() {
        let selected = document.querySelector("input[name='sort']:checked").value;
        if (selected === "none") {
            fishData = JSON.parse(JSON.stringify(fishDataOriginal));
        } else if (selected === "price-asc") {
            fishData.sort((a, b) => a.price - b.price);
        } else if (selected === "price-desc") {
            fishData.sort((a, b) => b.price - a.price);
        } else if (selected === "name") {
            fishData.sort((a, b) => (a.name["name-USen"] > b.name["name-USen"] ? 1 : -1));
        }
        currPageId = 0;
        loadCurrPage();
    }
})();