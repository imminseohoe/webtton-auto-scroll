let scrollSpeed = 5; 
let scrollInterval;
let isScrolling = false;

chrome.storage.local.get(["scrollSpeed"], (data) => {
    if (data.scrollSpeed) {
        scrollSpeed = data.scrollSpeed;
        document.getElementById("current-speed").innerText = scrollSpeed;
        updateSpeedIcon();
    }
});

function FindingLastImage() {
    let id = 0;
    while (document.querySelector(`#content_image_${id}`)) {
        id++;
    }
    return document.querySelector(`#content_image_${id - 1}`);
}

function smoothScrollTo(targetY) {
    let currentY = window.scrollY;
    let direction = currentY < targetY ? 1 : -1;

    if (scrollInterval) clearInterval(scrollInterval);

    isScrolling = true;
    scrollInterval = setInterval(() => {
        if (!isScrolling) {
            clearInterval(scrollInterval);
            return;
        }

        currentY += scrollSpeed * direction;
        window.scrollTo(0, currentY);

        if ((direction === 1 && currentY >= targetY) || (direction === -1 && currentY <= targetY)) {
            window.scrollTo(0, targetY);
            clearInterval(scrollInterval);
            isScrolling = false;
        }
    }, 10);
}


let controlPanel = document.createElement("div");
controlPanel.id = "webtoon-helper";
controlPanel.innerHTML = `
    <div class="helper-box">
        <p id="title"></p>
        <button id="speed-down">➖</button>
        <span id="current-speed">5</span>
        <button id="speed-up">➕</button>
        <br>
        <button id="start-scroll"></button>
        <button id="stop-scroll"></button>
        <div id="speed-icon">🐇</div>
    </div>
`;
document.body.appendChild(controlPanel);


document.getElementById("title").innerText = chrome.i18n.getMessage("title");
document.getElementById("start-scroll").innerText = chrome.i18n.getMessage("start");
document.getElementById("stop-scroll").innerText = chrome.i18n.getMessage("stop");
document.getElementById("speed-up").innerText = chrome.i18n.getMessage("faster");
document.getElementById("speed-down").innerText = chrome.i18n.getMessage("slower");



document.getElementById("speed-up").addEventListener("click", () => changeSpeed(1));
document.getElementById("speed-down").addEventListener("click", () => changeSpeed(-1));
document.getElementById("start-scroll").addEventListener("click", () => {
    let lastImage = FindingLastImage();
    if (lastImage) smoothScrollTo(lastImage.offsetTop);
});
document.getElementById("stop-scroll").addEventListener("click", () => {
    isScrolling = false;
});



function changeSpeed(amount) {
    scrollSpeed = Math.max(1, Math.min(10, scrollSpeed + amount)); 
    document.getElementById("current-speed").innerText = scrollSpeed;
    updateSpeedIcon();


    chrome.storage.local.set({ scrollSpeed: scrollSpeed });

    if (isScrolling) {
        clearInterval(scrollInterval);
        let lastImage = FindingLastImage();
        if (lastImage) smoothScrollTo(lastImage.offsetTop);
    }
}


function updateSpeedIcon() {
    let icon = "🐢";
    if (scrollSpeed >= 3) icon = "🐇";
    if (scrollSpeed >= 7) icon = "🐆";
    document.getElementById("speed-icon").innerText = icon;
}
