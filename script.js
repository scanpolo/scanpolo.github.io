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
        image: 'card/card1.png',
        audio: 'audio/Lavender_Haze.m4a',
        note: '抽中二等奖：蛋糕小狗！新年吃蛋糕哦'
    },
    {
        image: 'card/card2.png',
        audio: 'audio/willow.m4a',
        note: '抽中二等奖：红包小狗！新年接超多红包有钱钱'
    },
    {
        image: 'card/card3.png',
        audio: 'audio/Mine.m4a',
        note: '抽中一等奖！小狗在一起啦！'
    },
    {
        // 这是第4张隐藏彩蛋卡片（你需要确保文件夹里有这两个文件）
        image: 'card/card4.png', 
        audio: 'audio/Love_Story.m4a',
        note: '🌟 隐藏奖！宝宝宝新年快乐捏！🌟'
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
    link.download = `card_${drawIndex}.png`; 
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    alert('小狗到电脑上啦！');
}

// --- 新增：重置抽奖系统功能 ---
function resetLottery() {
    // 1. 将抽奖进度清零
    drawIndex = 0; 
    
    // 2. 找到抽奖按钮，让它“满血复活”
    const btn = document.getElementById('draw-btn');
    if (btn) {
        btn.textContent = "🎁 点击开启好运";
        btn.classList.remove('disabled');      // 移除灰色禁用状态
        btn.classList.remove('surprise-btn');  // 移除第3次抽完的红色状态
        btn.onclick = drawCard;                // 重新把点击事件绑回去
    }
    
    // 3. 更新界面的数字显示 (变成3次)
    updateRemainCount();
    
    // 4. 用户体验优化：如果当前正在看贺卡，点重置后自动帮你退回首页并停掉音乐
    const cardScreen = document.getElementById('card-screen');
    if (!cardScreen.classList.contains('hidden')) {
        stopAudio();
        cardScreen.classList.add('hidden');
        document.getElementById('home-screen').classList.remove('hidden');
    }
}