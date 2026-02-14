// 爱心点击特效
function createHeart(event) {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.style.left = event.clientX + 'px';
    heart.style.top = event.clientY + 'px';
    document.getElementById('hearts').appendChild(heart);
    
    setTimeout(() => {
        heart.remove();
    }, 3000);
}

// 为所有可点击元素添加爱心特效
document.addEventListener('DOMContentLoaded', function() {
    const clickableElements = document.querySelectorAll('.start-button, .draw-button, .card-button');
    clickableElements.forEach(element => {
        element.addEventListener('click', createHeart);
    });
});

// 页面切换功能
function startGame() {
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('home-screen').classList.remove('hidden');
}

// --- 抽奖核心逻辑 ---
let drawIndex = 0; 
const normalChances = 3; // 表面上的常规抽奖次数

// 加上第四个“隐藏款”贺卡
const cardData = [
    {
        image: '贺卡/贺卡1.jpg',
        audio: '音频/贺卡1.mp3',
        note: '这是你的第一份新年好运：由于十年这首歌的主题不太合适所以换成另外一个幸福摩天轮啦'
    },
    {
        image: '贺卡/贺卡2.jpg',
        audio: '音频/贺卡2.mp3',
        note: '这是你的第二份新年好运：『不知所谓』，也无所谓'
    },
    {
        image: '贺卡/贺卡3.jpg',
        audio: '音频/贺卡3.mp3',
        note: '这是你的第三份新年好运：『陪你度过漫长岁月』'
    },
    {
        // 这是第4张隐藏彩蛋卡片（你需要确保文件夹里有这两个文件）
        image: '贺卡/贺卡4.jpg', 
        audio: '音频/贺卡4.mp3',
        note: '🌟 隐藏惊喜！这才是真正的压轴好运！🌟'
    }
];

// 执行抽奖动作
function drawCard() {
    // 已经抽完 4 次了，彻底结束
    if (drawIndex >= 4) {
        alert("这次真的全部查收完毕啦，新年快乐！");
        return;
    }

    const card = cardData[drawIndex];

    document.getElementById('home-screen').classList.add('hidden');
    document.getElementById('card-screen').classList.remove('hidden');
    document.getElementById('card-image').src = card.image;
    document.getElementById('card-note').textContent = card.note;
    playAudio(card.audio);

    drawIndex++;
    updateRemainCount();
}

// 刷新剩余次数并控制按钮状态
function updateRemainCount() {
    const countSpan = document.getElementById('remain-count');
    const btn = document.getElementById('draw-btn');

    // 计算表面上的剩余次数 (3 - 当前次数)
    const displayRemain = normalChances - drawIndex; 

    if (displayRemain > 0) {
        // 前 2 次抽奖后，正常显示剩余次数
        countSpan.textContent = displayRemain;
    } else if (displayRemain === 0) {
        // 关键彩蛋：第 3 次抽完后，次数显示 0，但按钮变成红色的彩蛋按钮
        countSpan.textContent = "0";
        btn.textContent = "已集齐所有好运...吗？";
        btn.classList.add('surprise-btn'); // 增加红色CSS类
    } else {
        // 第 4 次抽完后（隐藏款已抽出），彻底变灰
        countSpan.textContent = "0";
        btn.textContent = "这下真的全都集齐啦！";
        btn.classList.remove('surprise-btn'); // 移除红色
        btn.classList.add('disabled'); // 加上灰色禁用
        btn.onclick = null;
    }
}

function backToHome() {
    stopAudio();
    document.getElementById('card-screen').classList.add('hidden');
    document.getElementById('home-screen').classList.remove('hidden');
}

// --- 音频播放功能 ---
const audio = document.getElementById('audio');

function playAudio(audioSrc) {
    audio.src = audioSrc;
    audio.play().catch(error => {
        console.log('音频播放失败:', error);
    });
}

function stopAudio() {
    audio.pause();
    audio.currentTime = 0;
}

// --- 贺卡下载功能 ---
function downloadCard() {
    const cardImage = document.getElementById('card-image');
    const link = document.createElement('a');
    link.href = cardImage.src;
    link.download = `新年好运卡_${drawIndex}.jpg`; 
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    alert('好运卡片已开始下载，请注意查收！');
}