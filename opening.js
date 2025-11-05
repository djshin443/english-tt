// HTML 스타일 타이틀 화면 표시 함수
function showTitleScreen() {
    // 기존 타이틀 화면 제거
    const existingTitle = document.getElementById('titleScreen');
    if (existingTitle) {
        existingTitle.remove();
    }
    
    // 화면 방향 및 크기 체크
    const isPortrait = window.innerHeight > window.innerWidth;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                     (navigator.maxTouchPoints > 0) || window.innerWidth <= 768;
    const isMobilePortrait = isPortrait && isMobile;
    
    // 타이틀 화면 컨테이너 생성
    const titleScreen = document.createElement('div');
    titleScreen.id = 'titleScreen';
    titleScreen.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: linear-gradient(135deg, #FFB6C1, #87CEEB, #DDA0DD);
        z-index: 10000;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: ${isMobilePortrait ? 'flex-start' : 'center'};
        font-family: 'Jua', sans-serif;
        overflow-y: ${isMobilePortrait ? 'auto' : 'hidden'};
        overflow-x: hidden;
        animation: backgroundShimmer 3s ease-in-out infinite alternate;
        padding: ${isMobilePortrait ? '10px' : '20px'};
        box-sizing: border-box;
    `;
    
    // CSS 애니메이션 추가
    if (!document.getElementById('titleScreenStyles')) {
        const style = document.createElement('style');
        style.id = 'titleScreenStyles';
        style.textContent = `
            @keyframes backgroundShimmer {
                0% { background: linear-gradient(135deg, #FFB6C1, #87CEEB, #DDA0DD); }
                50% { background: linear-gradient(135deg, #87CEEB, #DDA0DD, #FFB6C1); }
                100% { background: linear-gradient(135deg, #DDA0DD, #FFB6C1, #87CEEB); }
            }
            
            @keyframes titleBounce {
                0%, 20%, 50%, 80%, 100% { transform: translateY(0) scale(1) rotate(0deg); }
                40% { transform: translateY(-30px) scale(1.1) rotate(-2deg); }
                60% { transform: translateY(-15px) scale(1.05) rotate(2deg); }
            }
            
            @keyframes sparkle {
                0% { opacity: 0; transform: scale(0) rotate(0deg); }
                50% { opacity: 1; transform: scale(1.5) rotate(180deg); }
                100% { opacity: 0; transform: scale(0) rotate(360deg); }
            }
            
            @keyframes float {
                0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
                25% { transform: translateY(-15px) translateX(5px) rotate(5deg); }
                50% { transform: translateY(-10px) translateX(-5px) rotate(-5deg); }
                75% { transform: translateY(-5px) translateX(3px) rotate(3deg); }
            }
            
            @keyframes buttonGlow {
                0% { box-shadow: 0 5px 20px rgba(255, 105, 180, 0.3), 0 0 30px rgba(255, 105, 180, 0.2); }
                50% { box-shadow: 0 8px 40px rgba(255, 105, 180, 0.6), 0 0 50px rgba(255, 105, 180, 0.4); }
                100% { box-shadow: 0 5px 20px rgba(255, 105, 180, 0.3), 0 0 30px rgba(255, 105, 180, 0.2); }
            }
            
            @keyframes pixelMove {
                0%, 100% { transform: translateX(0); }
                50% { transform: translateX(10px); }
            }
            
            @keyframes coinRotate {
                0% { transform: rotateY(0deg); }
                100% { transform: rotateY(360deg); }
            }
            
            @keyframes pulse {
                0%, 100% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.2); opacity: 0.8; }
            }
            
            @keyframes fall {
                to { transform: translateY(calc(100vh + 100px)); }
            }
            
            @keyframes flashFade {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    // 반짝이는 별들 배경 (모바일 세로 모드에서는 개수 줄이기)
    const starCount = isMobilePortrait ? 10 : 20;
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.innerHTML = '✨';
        star.style.cssText = `
            position: absolute;
            font-size: ${Math.random() * 15 + 10}px;
            left: ${Math.random() * 100}vw;
            top: ${Math.random() * 100}vh;
            animation: sparkle ${2 + Math.random() * 3}s infinite;
            animation-delay: ${Math.random() * 2}s;
            pointer-events: none;
        `;
        titleScreen.appendChild(star);
    }
    
    // 하트 이모지들 (모바일 세로 모드에서는 개수 줄이기)
    const heartCount = isMobilePortrait ? 5 : 8;
    for (let i = 0; i < heartCount; i++) {
        const heart = document.createElement('div');
        heart.innerHTML = '💖';
        heart.style.cssText = `
            position: absolute;
            font-size: ${Math.random() * 12 + 15}px;
            left: ${Math.random() * 100}vw;
            top: ${Math.random() * 100}vh;
            animation: float ${3 + Math.random() * 2}s ease-in-out infinite;
            animation-delay: ${Math.random() * 2}s;
            pointer-events: none;
        `;
        titleScreen.appendChild(heart);
    }
    
    // 게임 코인들 (모바일 세로 모드에서는 개수 줄이기)
    const coinCount = isMobilePortrait ? 5 : 10;
    for (let i = 0; i < coinCount; i++) {
        const coin = document.createElement('div');
        coin.innerHTML = '🪙';
        coin.style.cssText = `
            position: absolute;
            font-size: ${Math.random() * 15 + 15}px;
            left: ${Math.random() * 100}vw;
            top: ${-50 - Math.random() * 100}px;
            animation: fall ${5 + Math.random() * 5}s linear infinite, coinRotate 2s linear infinite;
            animation-delay: ${Math.random() * 5}s;
            pointer-events: none;
            z-index: 3;
        `;
        titleScreen.appendChild(coin);
    }
    
    // 픽셀 캐릭터들 추가 (모바일 세로 모드에서는 크기와 위치 조정)
    const characterContainer = document.createElement('div');
    characterContainer.style.cssText = `
        position: ${isMobilePortrait ? 'relative' : 'absolute'};
        bottom: ${isMobilePortrait ? 'auto' : '15%'};
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: ${isMobilePortrait ? '15px' : '50px'};
        animation: float 3s ease-in-out infinite;
        z-index: 5;
        margin-top: ${isMobilePortrait ? '10px' : '0'};
        margin-bottom: ${isMobilePortrait ? '10px' : '0'};
    `;

    const characters = [
        { name: '지율이', emoji: '👧', color: '#FF69B4' },
        { name: '키위', emoji: '🦎', color: '#32CD32' },
        { name: '집', emoji: '🏠', color: '#4169E1' }
    ];

    characters.forEach((char, index) => {
        const charDiv = document.createElement('div');
        const charSize = isMobilePortrait ? '45px' : '60px';
        const fontSize = isMobilePortrait ? '25px' : '30px';
        
        charDiv.style.cssText = `
            width: ${charSize};
            height: ${charSize};
            background: ${char.color};
            border: 3px solid #FFF;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: ${fontSize};
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            animation: pulse ${1.5 + index * 0.3}s ease-in-out infinite, pixelMove ${2 + index * 0.5}s ease-in-out infinite;
            animation-delay: ${index * 0.2}s;
        `;
        charDiv.innerHTML = char.emoji;
        characterContainer.appendChild(charDiv);
    });

    if (!isMobilePortrait) {
        titleScreen.appendChild(characterContainer);
    }
    
    // 컨텐츠를 담을 중앙 컨테이너
    const contentContainer = document.createElement('div');
    contentContainer.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: ${isMobilePortrait ? '10px' : '20px'};
        width: 100%;
        max-width: ${isMobilePortrait ? '100%' : '90%'};
        box-sizing: border-box;
        ${isMobilePortrait ? 'margin-top: 20px;' : ''}
    `;
    
    // 메인 타이틀 컨테이너
    const mainTitle = document.createElement('div');
    mainTitle.style.cssText = `
        text-align: center;
        margin-bottom: ${isMobilePortrait ? '15px' : '30px'};
        animation: titleBounce 2s ease-in-out infinite;
        width: 100%;
    `;
    
    // 게임 제목 (반응형 폰트 크기)
    const title = document.createElement('h1');
    title.innerHTML = '🌸 지율이의 픽셀 영어 게임 🌸';
    
    // 뷰포트 단위 사용하여 반응형 폰트 크기 설정
    const titleFontSize = isMobilePortrait ? 
        'min(8vw, 32px)' : 
        (isMobile ? '2.5em' : '3.5em');
    
    title.style.cssText = `
        font-size: ${titleFontSize};
        color: #FF69B4;
        text-shadow: 
            2px 2px 0px #FFD700,
            3px 3px 0px rgba(255,105,180,0.5),
            4px 4px 10px rgba(0,0,0,0.3);
        margin: 0;
        font-weight: bold;
        text-align: center;
        line-height: 1.2;
        word-break: keep-all;
        white-space: normal;
    `;
    
    // 부제목 (반응형 폰트 크기)
    const subtitle = document.createElement('h2');
    subtitle.innerHTML = '✨ English Adventure ✨';
    
    const subtitleFontSize = isMobilePortrait ? 
        'min(5vw, 20px)' : 
        (isMobile ? '1.4em' : '1.8em');
    
    subtitle.style.cssText = `
        font-size: ${subtitleFontSize};
        color: #FFD700;
        text-shadow: 2px 2px 0px #FF69B4,
                     3px 3px 0px rgba(255,215,0,0.5),
                     4px 4px 8px rgba(0,0,0,0.3);
        margin: ${isMobilePortrait ? '10px 0' : '20px 0'};
        font-weight: bold;
        animation: float 2.5s ease-in-out infinite;
    `;
    
    mainTitle.appendChild(title);
    mainTitle.appendChild(subtitle);
    
    // 모바일 세로 모드에서만 캐릭터를 여기에 추가
    if (isMobilePortrait) {
        contentContainer.appendChild(characterContainer);
    }
    
    // 게임 설명 (반응형 폰트 크기)
    const description = document.createElement('div');
    const descFontSize = isMobilePortrait ? 
        'min(4vw, 16px)' : 
        (isMobile ? '1.1em' : '1.3em');
    
    description.innerHTML = `
        <p style="font-size: ${descFontSize}; color: #4B0082; text-shadow: 1px 1px 2px rgba(255,255,255,0.8); text-align: center; margin: ${isMobilePortrait ? '15px 0' : '30px 0'}; line-height: 1.6;">
            🎮 영어 단어를 배우며 모험을 떠나요! 🎮<br>
            🌟 20개 스테이지를 클리어하고 영어 마스터가 되어보세요! 🌟
        </p>
    `;
    
    // 시작 버튼 (반응형 크기)
    const startButton = document.createElement('button');
    startButton.innerHTML = '🚀 모험 시작하기! 🚀';
    
    const buttonFontSize = isMobilePortrait ? 
        'min(5vw, 20px)' : 
        (isMobile ? '1.5em' : '2em');
    
    const buttonPadding = isMobilePortrait ? 
        '15px 25px' : 
        '20px 40px';
    
    startButton.style.cssText = `
        background: linear-gradient(135deg, #FF69B4, #FFB6C1);
        border: 4px solid #FFFFFF;
        color: white;
        font-size: ${buttonFontSize};
        font-weight: bold;
        font-family: 'Jua', sans-serif;
        padding: ${buttonPadding};
        border-radius: 50px;
        cursor: pointer;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        transition: all 0.3s ease;
        animation: buttonGlow 2s ease-in-out infinite;
        margin-top: ${isMobilePortrait ? '20px' : '30px'};
        box-shadow: 0 10px 25px rgba(255, 105, 180, 0.4);
        white-space: nowrap;
    `;
    
    startButton.onmouseover = () => {
        startButton.style.transform = 'scale(1.1)';
        startButton.style.background = 'linear-gradient(135deg, #FF1493, #FF69B4)';
    };
    
    startButton.onmouseout = () => {
        startButton.style.transform = 'scale(1)';
        startButton.style.background = 'linear-gradient(135deg, #FF69B4, #FFB6C1)';
    };
    
    startButton.onclick = () => {
        // 화면 전체 폭죽 효과 (모바일에서는 개수 줄이기)
        const fireworkCount = isMobilePortrait ? 15 : 30;
        for (let i = 0; i < fireworkCount; i++) {
            setTimeout(() => {
                const firework = document.createElement('div');
                const colors = ['✨', '🌟', '💫', '⭐', '🎆'];
                firework.innerHTML = colors[Math.floor(Math.random() * colors.length)];
                firework.style.cssText = `
                    position: absolute;
                    font-size: ${Math.random() * 30 + 20}px;
                    left: ${Math.random() * window.innerWidth}px;
                    top: ${Math.random() * window.innerHeight}px;
                    animation: sparkle 1s ease-out forwards;
                    pointer-events: none;
                    z-index: 10002;
                `;
                document.body.appendChild(firework);
                setTimeout(() => firework.remove(), 1000);
            }, i * 50);
        }
        
        // 화면 플래시 효과
        const flash = document.createElement('div');
        flash.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: radial-gradient(circle, rgba(255,255,255,0.8), transparent);
            z-index: 10001;
            animation: flashFade 0.5s ease-out forwards;
            pointer-events: none;
        `;
        document.body.appendChild(flash);
        setTimeout(() => flash.remove(), 500);
        
        // 타이틀 화면 회전하며 사라지기
        titleScreen.style.transition = 'all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        titleScreen.style.transform = 'scale(0) rotate(720deg)';
        titleScreen.style.opacity = '0';
        
        setTimeout(() => {
            titleScreen.remove();
            const styleTag = document.getElementById('titleScreenStyles');
            if (styleTag) styleTag.remove();
            startOpeningSequence();
        }, 800);
    };
    
    // 작은 도움말 텍스트 (반응형 폰트)
    const helpText = document.createElement('div');
    helpText.innerHTML = '💡 터치하거나 클릭해서 시작하세요! 💡';
    
    const helpFontSize = isMobilePortrait ? 
        'min(3.5vw, 14px)' : 
        '1.1em';
    
    helpText.style.cssText = `
        font-size: ${helpFontSize};
        color: #8B008B;
        text-shadow: 1px 1px 2px rgba(255,255,255,0.8);
        margin-top: ${isMobilePortrait ? '15px' : '30px'};
        animation: float 3s ease-in-out infinite;
        text-align: center;
    `;
    
    // 모든 요소를 컨테이너에 추가
    contentContainer.appendChild(mainTitle);
    contentContainer.appendChild(description);
    contentContainer.appendChild(startButton);
    contentContainer.appendChild(helpText);
    
    // 컨테이너를 타이틀 화면에 추가
    titleScreen.appendChild(contentContainer);
    
    // 타이틀 화면을 페이지에 추가
    document.body.appendChild(titleScreen);
    
    // 터치 이벤트도 추가 (모바일 지원)
    startButton.addEventListener('touchend', (e) => {
        e.preventDefault();
        startButton.click();
    });
}

// 오프닝 시퀀스를 시작하는 함수
function startOpeningSequence() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    // 모든 UI 요소 숨기기
    document.getElementById('characterSelectMenu').style.display = 'none';
    document.getElementById('unitSelectMenu').style.display = 'none';
    document.getElementById('ui').style.display = 'none';
    document.getElementById('questionPanel').style.display = 'none';
    document.getElementById('fullscreenBtn').style.display = 'none';
    document.getElementById('controls').style.display = 'none';

    startOpening(canvas, ctx, function() {
        // 오프닝 완료 후 게임 시작
        if (typeof startGame === 'function') {
            startGame();
        }
    });
}

// OpeningSequence 클래스 - 캔버스 기반 오프닝 애니메이션
class OpeningSequence {
    constructor(canvas, ctx, onComplete) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.onComplete = onComplete;

        // 9개 장면의 대화 데이터
        this.dialogues = [
            {
                scene: 0,
                text: "안녕! 내 이름은 지율이야. 오늘도 평범한 하루였어.",
                speaker: "지율이"
            },
            {
                scene: 1,
                text: "어? 저 하늘에 뭔가 이상한 게 보이는데...",
                speaker: "지율이"
            },
            {
                scene: 2,
                text: "으아악! UFO다! 외계인이 나타났어!",
                speaker: "지율이"
            },
            {
                scene: 3,
                text: "이 별의 생명체여, 우리는 알파벳 별에서 왔다.",
                speaker: "외계인"
            },
            {
                scene: 4,
                text: "우리는 영어 알파벳을 지키는 수호자들이다.",
                speaker: "외계인"
            },
            {
                scene: 5,
                text: "하지만 사악한 알파벳 몬스터들이 나타나 평화를 위협하고 있어.",
                speaker: "외계인"
            },
            {
                scene: 6,
                text: "영어의 힘을 가진 너라면 우리를 도울 수 있을 거야!",
                speaker: "외계인"
            },
            {
                scene: 7,
                text: "좋아! 내가 도와줄게! 영어로 몬스터를 물리치자!",
                speaker: "지율이"
            },
            {
                scene: 8,
                text: "고맙다, 지율이! 자, 이제 모험을 시작하자!",
                speaker: "외계인"
            }
        ];

        this.currentDialogueIndex = 0;
        this.currentText = '';
        this.targetText = '';
        this.charIndex = 0;
        this.typeSpeed = 50; // 타이핑 속도 (ms)
        this.lastTypeTime = 0;
        this.waitingForInput = false;
        this.canProceed = false;

        // SKIP 버튼
        this.skipButton = {
            x: 0,
            y: 0,
            width: 100,
            height: 40,
            hovered: false
        };

        // 캐릭터 위치 및 애니메이션
        this.setupCharacterPositions();

        // 애니메이션 프레임
        this.animationFrame = 0;
        this.ufoY = 100;
        this.ufoDirection = 1;

        // 이벤트 리스너 설정
        this.setupEventListeners();

        // 첫 대화 시작
        this.startDialogue();

        // 애니메이션 시작
        this.animate();
    }

    setupCharacterPositions() {
        const isPortrait = this.canvas.height > this.canvas.width;

        // 지율이 위치
        this.jiyulPos = {
            x: isPortrait ? this.canvas.width * 0.3 : this.canvas.width * 0.25,
            y: isPortrait ? this.canvas.height * 0.4 : this.canvas.height * 0.5,
            width: 50,
            height: 50
        };

        // UFO/외계인 위치
        this.ufoPos = {
            x: isPortrait ? this.canvas.width * 0.7 : this.canvas.width * 0.75,
            y: isPortrait ? this.canvas.height * 0.3 : this.canvas.height * 0.3,
            width: 60,
            height: 60
        };

        // 알파벳 몬스터 위치들
        this.monsterPositions = [
            { x: this.canvas.width * 0.15, y: this.canvas.height * 0.25 },
            { x: this.canvas.width * 0.85, y: this.canvas.height * 0.25 },
            { x: this.canvas.width * 0.5, y: this.canvas.height * 0.2 }
        ];

        // SKIP 버튼 위치
        this.updateSkipButtonPosition();
    }

    updateSkipButtonPosition() {
        this.skipButton.x = this.canvas.width - this.skipButton.width - 20;
        this.skipButton.y = 20;
    }

    setupEventListeners() {
        this.boundHandleClick = (e) => this.handleInput(e);
        this.boundHandleTouch = (e) => {
            e.preventDefault();
            this.handleInput(e);
        };
        this.boundHandleMove = (e) => this.handleMouseMove(e);

        this.canvas.addEventListener('click', this.boundHandleClick);
        this.canvas.addEventListener('touchstart', this.boundHandleTouch);
        this.canvas.addEventListener('mousemove', this.boundHandleMove);
    }

    cleanupEventListeners() {
        this.canvas.removeEventListener('click', this.boundHandleClick);
        this.canvas.removeEventListener('touchstart', this.boundHandleTouch);
        this.canvas.removeEventListener('mousemove', this.boundHandleMove);
    }

    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // SKIP 버튼 호버 체크
        this.skipButton.hovered = (
            x >= this.skipButton.x &&
            x <= this.skipButton.x + this.skipButton.width &&
            y >= this.skipButton.y &&
            y <= this.skipButton.y + this.skipButton.height
        );
    }

    handleInput(e) {
        const rect = this.canvas.getBoundingClientRect();
        let x, y;

        if (e.type === 'touchstart') {
            const touch = e.touches[0] || e.changedTouches[0];
            x = touch.clientX - rect.left;
            y = touch.clientY - rect.top;
        } else {
            x = e.clientX - rect.left;
            y = e.clientY - rect.top;
        }

        // SKIP 버튼 클릭 체크
        if (x >= this.skipButton.x && x <= this.skipButton.x + this.skipButton.width &&
            y >= this.skipButton.y && y <= this.skipButton.y + this.skipButton.height) {
            this.skipToEnd();
            return;
        }

        // 타이핑 중이면 즉시 전체 텍스트 표시
        if (this.charIndex < this.targetText.length) {
            this.currentText = this.targetText;
            this.charIndex = this.targetText.length;
            this.waitingForInput = true;
            return;
        }

        // 다음 대화로 진행
        if (this.waitingForInput) {
            this.canProceed = true;
        }
    }

    skipToEnd() {
        this.cleanupEventListeners();
        if (this.onComplete) {
            this.onComplete();
        }
    }

    startDialogue() {
        if (this.currentDialogueIndex >= this.dialogues.length) {
            // 모든 대화 완료
            this.cleanupEventListeners();
            if (this.onComplete) {
                this.onComplete();
            }
            return;
        }

        const dialogue = this.dialogues[this.currentDialogueIndex];
        this.targetText = dialogue.text;
        this.currentText = '';
        this.charIndex = 0;
        this.waitingForInput = false;
        this.canProceed = false;
        this.lastTypeTime = Date.now();
    }

    update() {
        // 애니메이션 프레임 증가
        this.animationFrame++;

        // UFO 상하 움직임
        this.ufoY += this.ufoDirection * 0.5;
        if (this.ufoY > 120 || this.ufoY < 80) {
            this.ufoDirection *= -1;
        }

        // 타이핑 효과
        if (this.charIndex < this.targetText.length) {
            const now = Date.now();
            if (now - this.lastTypeTime > this.typeSpeed) {
                this.currentText += this.targetText[this.charIndex];
                this.charIndex++;
                this.lastTypeTime = now;

                // 타이핑 완료
                if (this.charIndex >= this.targetText.length) {
                    this.waitingForInput = true;
                }
            }
        }

        // 다음 대화로 진행
        if (this.canProceed) {
            this.currentDialogueIndex++;
            this.startDialogue();
        }
    }

    drawBackground() {
        // 그라디언트 배경
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#87CEEB'); // 하늘색
        gradient.addColorStop(1, '#E0F6FF'); // 밝은 하늘색
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // 간단한 별들
        this.ctx.fillStyle = '#FFFFFF';
        for (let i = 0; i < 20; i++) {
            const x = (i * 137 + this.animationFrame * 0.5) % this.canvas.width;
            const y = (i * 89) % this.canvas.height;
            this.ctx.fillRect(x, y, 2, 2);
        }
    }

    drawPixelSprite(x, y, width, height, color, emoji) {
        // 픽셀 스타일 박스
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, width, height);

        // 테두리
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x, y, width, height);

        // 이모지
        this.ctx.font = `${height * 0.6}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillText(emoji, x + width / 2, y + height / 2);
    }

    drawScene() {
        const dialogue = this.dialogues[this.currentDialogueIndex];
        const scene = dialogue.scene;

        // 장면별 캐릭터 그리기
        if (scene <= 2 || scene === 7) {
            // 지율이 등장
            const bobbing = Math.sin(this.animationFrame * 0.05) * 3;
            this.drawPixelSprite(
                this.jiyulPos.x,
                this.jiyulPos.y + bobbing,
                this.jiyulPos.width,
                this.jiyulPos.height,
                '#FF69B4',
                '👧'
            );
        }

        if (scene >= 2) {
            // UFO/외계인 등장
            this.drawPixelSprite(
                this.ufoPos.x,
                this.ufoPos.y + this.ufoY - 100,
                this.ufoPos.width,
                this.ufoPos.height,
                '#9370DB',
                '🛸'
            );
        }

        if (scene >= 5 && scene <= 6) {
            // 알파벳 몬스터들 등장
            const letters = ['A', 'B', 'C'];
            this.monsterPositions.forEach((pos, i) => {
                const shake = Math.sin(this.animationFrame * 0.1 + i) * 2;
                this.drawPixelSprite(
                    pos.x + shake,
                    pos.y,
                    40,
                    40,
                    '#FF6347',
                    letters[i]
                );
            });
        }
    }

    drawDialogue() {
        if (this.currentDialogueIndex >= this.dialogues.length) return;

        const dialogue = this.dialogues[this.currentDialogueIndex];
        const isPortrait = this.canvas.height > this.canvas.width;

        // 대화 박스 설정
        const boxWidth = Math.min(this.canvas.width - 40, 500);
        const padding = 15;
        const lineHeight = 20;

        // 텍스트 줄바꿈
        this.ctx.font = '14px Arial';
        const words = this.currentText.split('');
        const lines = [];
        let currentLine = '';

        words.forEach(char => {
            const testLine = currentLine + char;
            const metrics = this.ctx.measureText(testLine);
            if (metrics.width > boxWidth - padding * 2) {
                lines.push(currentLine);
                currentLine = char;
            } else {
                currentLine = testLine;
            }
        });
        if (currentLine) lines.push(currentLine);

        // 박스 높이 계산
        const nameHeight = dialogue.speaker ? 30 : 0;
        const textHeight = lines.length * lineHeight;
        const boxHeight = nameHeight + textHeight + padding * 2;

        // 박스 위치 - 화면 하단에 배치
        const boxX = (this.canvas.width - boxWidth) / 2;
        const boxY = this.canvas.height - boxHeight - 10;

        // 박스 배경
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
        this.ctx.fillRect(boxX, boxY, boxWidth, boxHeight);

        // 테두리
        this.ctx.strokeStyle = '#FFFFFF';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

        // 화자 이름
        let textY = boxY + padding;
        if (dialogue.speaker) {
            this.ctx.fillStyle = '#FFD700';
            this.ctx.font = 'bold 16px Arial';
            this.ctx.textAlign = 'left';
            this.ctx.fillText(dialogue.speaker, boxX + padding, textY + 15);
            textY += nameHeight;
        }

        // 대화 텍스트
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = '14px Arial';
        this.ctx.textAlign = 'left';
        lines.forEach((line, i) => {
            this.ctx.fillText(line, boxX + padding, textY + (i + 1) * lineHeight);
        });

        // 진행 표시 (타이핑 완료 시)
        if (this.waitingForInput) {
            const indicatorX = boxX + boxWidth - 20;
            const indicatorY = boxY + boxHeight - 15;
            const bounce = Math.sin(this.animationFrame * 0.1) * 3;

            this.ctx.fillStyle = '#FFD700';
            this.ctx.font = '20px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('▼', indicatorX, indicatorY + bounce);
        }
    }

    drawSkipButton() {
        // SKIP 버튼 배경
        const gradient = this.ctx.createLinearGradient(
            this.skipButton.x,
            this.skipButton.y,
            this.skipButton.x + this.skipButton.width,
            this.skipButton.y + this.skipButton.height
        );

        if (this.skipButton.hovered) {
            gradient.addColorStop(0, 'rgba(200, 100, 250, 0.9)');
            gradient.addColorStop(1, 'rgba(250, 150, 250, 0.9)');
        } else {
            gradient.addColorStop(0, 'rgba(147, 112, 219, 0.8)');
            gradient.addColorStop(1, 'rgba(221, 160, 221, 0.8)');
        }

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(
            this.skipButton.x,
            this.skipButton.y,
            this.skipButton.width,
            this.skipButton.height
        );

        // 테두리
        this.ctx.strokeStyle = '#FFFFFF';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(
            this.skipButton.x,
            this.skipButton.y,
            this.skipButton.width,
            this.skipButton.height
        );

        // 텍스트
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(
            'SKIP ⏭',
            this.skipButton.x + this.skipButton.width / 2,
            this.skipButton.y + this.skipButton.height / 2
        );
    }

    render() {
        // 배경 그리기
        this.drawBackground();

        // 장면 그리기
        this.drawScene();

        // 대화 박스 그리기
        this.drawDialogue();

        // SKIP 버튼 그리기
        this.drawSkipButton();
    }

    animate() {
        this.update();
        this.render();

        if (this.currentDialogueIndex < this.dialogues.length) {
            requestAnimationFrame(() => this.animate());
        }
    }
}

// startOpening 함수 - OpeningSequence 실행
function startOpening(canvas, ctx, onComplete) {
    new OpeningSequence(canvas, ctx, onComplete);
}
