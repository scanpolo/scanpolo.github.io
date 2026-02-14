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
    // 监听包含了抽奖按钮(draw-button)
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
let drawIndex = 0; // 记录当前抽到了第几张，初始为0
const maxChances = 3; // 最大抽奖次数，对应3张卡片

// 卡片库，将严格按照顺序被抽取
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
    }
];

// 执行抽奖动作
function drawCard() {
    // 1. 检查是否还有次数
    if (drawIndex >= maxChances) {
        alert("好运已全部查收，新年快乐！");
        return;
    }

    // 2. 根据当前的进度，获取对应的卡片数据
    const card = cardData[drawIndex];

    // 3. 切换页面显示
    document.getElementById('home-screen').classList.add('hidden');
    document.getElementById('card-screen').classList.remove('hidden');

    // 4. 将卡片数据填入页面元素
    document.getElementById('card-image').src = card.image;
    document.getElementById('card-note').textContent = card.note;

    // 5. 播放音乐
    playAudio(card.audio);

    // 6. 抽奖进度加1（例如从0变成1）
    drawIndex++;

    // 7. 刷新首页的剩余次数显示
    updateRemainCount();
}

// 刷新剩余次数并控制按钮状态
function updateRemainCount() {
    const remain = maxChances - drawIndex; // 计算剩余次数
    const countSpan = document.getElementById('remain-count');
    const btn = document.getElementById('draw-btn');

    // 把最新的剩余次数写进网页里
    countSpan.textContent = remain;

    // 如果次数用光了，把按钮变灰锁定
    if (remain <= 0) {
        btn.textContent = "已集齐所有好运";
        btn.classList.add('disabled');
        btn.onclick = null; // 移除点击功能
    }
}

// “收下啦”按钮：返回首页
function backToHome() {
    // 停止正在播放的音乐
    stopAudio();
    
    // 重新显示首页界面
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
    
    // 生成动态的文件名，比如“新年好运卡_1.jpg”
    link.download = `新年好运卡_${drawIndex}.jpg`; 
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    alert('好运卡片已开始下载，请注意查收！');
}

// 页面加载完成后的提示
document.addEventListener('DOMContentLoaded', function() {
    console.log('新年盲盒抽奖系统已加载完成！');
});