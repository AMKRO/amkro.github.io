document.getElementById('goBack').addEventListener('click', function() {
    window.location.href = 'index.html';
});

window.addEventListener('DOMContentLoaded', () => {
    const backgroundCount = 4;
    const randomNum = Math.floor(Math.random() * backgroundCount) + 1;
    const imagePath = `/backgrounds/background${randomNum}.jpg`;

    const bg = document.createElement('div');
    bg.className = 'background';
    bg.style.backgroundImage = `url(${imagePath})`;

    document.body.appendChild(bg);
});