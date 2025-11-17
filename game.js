// 게임 설정
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const PIXEL_SCALE = 3;
const GAME_SCALE = 0.5; // 모든 게임 요소를 50% 크기로 축소

// 캔버스 크기 조정
function resizeCanvas() {
    const container = document.getElementById('gameContainer');

    // 컨테이너가 숨겨져 있으면 (세로 모드) resize하지 않음
    if (container.style.display === 'none' ||
        window.getComputedStyle(container).display === 'none') {
        return;
    }

    const rect = container.getBoundingClientRect();

    // 유효한 크기일 때만 canvas 크기 변경
    if (rect.width > 0 && rect.height > 0) {
        canvas.width = rect.width;
        canvas.height = rect.height;
    }

    // 퀴즈 모드일 때 선택지 위치 재계산 (게임이 실행 중일 때만)
    if (gameState && gameState.isRunning && gameState.mode === GAME_MODE.QUIZ &&
        quizChoices && quizChoices.length > 0 && currentStageData) {
        try {
            createQuizChoices();
            // 공 위치도 재계산 (지율이 위치 기준)
            const jiyulX = window.quizJiyulX || 100;
            const jiyulY = quizChoices[jiyulQuizY].y + quizChoices[jiyulQuizY].height / 2;
            if (ball) {
                ball.x = jiyulX + player.width + 60;
                ball.y = jiyulY;
            }
        } catch (e) {
            console.warn('퀴즈 선택지 재계산 중 오류:', e);
        }
    }
}

// 게임 모드
const GAME_MODE = {
    COLLECTING: 'collecting',    // 알파벳 수집 모드
    QUIZ: 'quiz',               // 뜻 맞추기 퀴즈 모드
    BOSS: 'boss'                // 보스전 모드
};

// 게임 상태 - EASY MODE!
let gameState = {
    isRunning: false,
    isPaused: false,
    currentStage: 1,
    maxStage: 20,
    energy: 10,  // 7 -> 10으로 더 쉽게!
    maxEnergy: 10,  // 더 많은 체력!
    scrollSpeed: 1.5,  // 2 -> 1.5로 느리게!
    mode: GAME_MODE.COLLECTING,
    stageWords: [],  // 20개 스테이지 단어들
    clearedStages: 0,
    score: 0,  // 점수 추가
    gameLoopRunning: false  // 게임 루프 실행 여부 추적
};

// 현재 스테이지 데이터
let currentStageData = {
    word: '',
    wordData: null,
    collectedLetters: []
};

// 대화 시스템
let dialogueState = {
    active: false,
    dialogues: [],
    currentIndex: 0,
    onComplete: null
};

// 플레이어
const player = {
    x: 100,
    y: 300,
    width: 16 * PIXEL_SCALE,
    height: 16 * PIXEL_SCALE,
    speed: 4,
    sprite: 'jiyul',
    animation: 'idle',
    frameIndex: 0,
    frameCounter: 0,
    frameDelay: 10,
    vx: 0,
    vy: 0,
    showWeapon: false,  // 무기 표시 여부
    weaponAngle: 0,     // 무기 각도
    weaponTimer: 0      // 무기 표시 타이머
};

// 탁구공
let ball = null;

// 신검(Divine Sword) 배열
let divineSwords = [];
let tornados = [];
let lightningChains = [];
let currentCharacter = 0;  // 0: 지율, 1: 세은, 2: 하린
const characters = ['jiyul', 'seeun', 'harin'];
const characterNames = ['지율', '세은', '하린'];
const characterEnergies = [10, 10, 10];  // 각 캐릭터의 체력 저장

// 지율이 스매싱 상태
let jiyulSmashing = false;
let smashTimer = 0;

// 무기 쿨다운
let divineSwordCooldown = 0;
let tornadoCooldown = 0;
let lightningChainCooldown = 0;

// 신검 발사 쿨다운
let swordCooldown = 0;
const SWORD_COOLDOWN_MAX = 60;  // 60프레임마다 발사 (약 1초)

// 퀴즈 선택지
let quizChoices = [];

// 퀴즈/보스 모드에서 지율이 위치
let jiyulQuizY = 0;  // 현재 선택한 선택지 인덱스 (0~3)

// 초기 캔버스 크기 설정 (모든 변수 정의 후 호출)
resizeCanvas();
window.addEventListener('resize', resizeCanvas);
// orientation change 이벤트도 추가 (모바일 회전 대응)
window.addEventListener('orientationchange', () => {
    setTimeout(resizeCanvas, 100); // 약간의 지연 후 리사이즈
});

// 입력 처리
const keys = {};
let spacePressed = false;  // 스페이스바 눌림 상태 (연속 발사용)

window.addEventListener('keydown', (e) => {
    keys[e.key] = true;

    // 테스트용: E 키로 바로 엔딩 보기
    if (e.key === 'e' || e.key === 'E') {
        showEnding();
        return;
    }

    if (e.key === ' ') {
        e.preventDefault();

        // 스토리 씬 중이면 스킵
        if (storyScene && (storyScene.scenes && storyScene.currentScene < storyScene.scenes.length)) {
            storyScene.skip();
            return;
        }

        // 대화 중이면 다음 대화로 진행
        if (dialogueState.active) {
            advanceDialogue();
            return;
        }

        // 게임 플레이 중일 때만 발사 상태 활성화
        if (gameState.isRunning && !dialogueState.active) {
            spacePressed = true;
        }
    }
});
window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
    if (e.key === ' ') {
        spacePressed = false;
    }
});

// 터치 조이스틱
const joystick = {
    active: false,
    touchId: null,  // 조이스틱 터치 ID 추적
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    deltaX: 0,
    deltaY: 0
};

const joystickContainer = document.getElementById('joystickContainer');
const joystickStick = document.getElementById('joystickStick');

// 조이스틱 최대 거리를 화면 크기에 따라 조정
function getMaxDistance() {
    const containerSize = joystickContainer.offsetWidth;
    return containerSize * 0.3;  // 컨테이너 크기의 30%
}

let maxDistance = 45;

function handleTouchStart(e) {
    e.preventDefault();
    // 조이스틱이 활성화되지 않았을 때만 새 터치 처리
    // changedTouches 사용 - 이번 이벤트로 새로 추가된 터치만 확인
    if (!joystick.active && e.changedTouches.length > 0) {
        const touch = e.changedTouches[0];
        const rect = joystickContainer.getBoundingClientRect();

        joystick.touchId = touch.identifier;
        maxDistance = getMaxDistance();
        joystick.active = true;
        joystick.startX = rect.left + rect.width / 2;
        joystick.startY = rect.top + rect.height / 2;
        joystick.currentX = touch.clientX;
        joystick.currentY = touch.clientY;
        updateJoystick();
    }
}

function handleTouchMove(e) {
    if (!joystick.active) return;
    e.preventDefault();

    // 조이스틱의 터치 ID와 일치하는 터치만 추적
    for (let i = 0; i < e.touches.length; i++) {
        if (e.touches[i].identifier === joystick.touchId) {
            const touch = e.touches[i];
            joystick.currentX = touch.clientX;
            joystick.currentY = touch.clientY;
            updateJoystick();
            break;
        }
    }
}

function handleTouchEnd(e) {
    // 조이스틱이 활성화되지 않았으면 무시 (다른 터치 이벤트 방해 안함)
    if (!joystick.active) return;

    // 조이스틱의 터치가 끝났는지 확인
    let joystickTouchEnded = true;
    for (let i = 0; i < e.touches.length; i++) {
        if (e.touches[i].identifier === joystick.touchId) {
            joystickTouchEnded = false;
            break;
        }
    }

    // 조이스틱 터치가 끝났으면 초기화
    if (joystickTouchEnded) {
        e.preventDefault(); // 조이스틱 관련 터치만 preventDefault
        joystick.active = false;
        joystick.touchId = null;
        joystick.deltaX = 0;
        joystick.deltaY = 0;
        joystickStick.style.transform = 'translate(-50%, -50%)';
    }
}

function updateJoystick() {
    const dx = joystick.currentX - joystick.startX;
    const dy = joystick.currentY - joystick.startY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > maxDistance) {
        const angle = Math.atan2(dy, dx);
        joystick.deltaX = Math.cos(angle) * maxDistance;
        joystick.deltaY = Math.sin(angle) * maxDistance;
    } else {
        joystick.deltaX = dx;
        joystick.deltaY = dy;
    }

    const offsetX = (joystick.deltaX / maxDistance) * maxDistance;
    const offsetY = (joystick.deltaY / maxDistance) * maxDistance;
    joystickStick.style.transform = `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`;
}

// touchstart는 조이스틱 컨테이너에서만 (영역 내 시작)
joystickContainer.addEventListener('touchstart', handleTouchStart, { passive: false });
// touchmove, touchend, touchcancel은 document 레벨에서 처리 (영역 밖 드래그 대응)
document.addEventListener('touchmove', handleTouchMove, { passive: false });
document.addEventListener('touchend', handleTouchEnd, { passive: false });
document.addEventListener('touchcancel', handleTouchEnd, { passive: false });

// 모바일 액션 버튼
const swordBtn = document.getElementById('swordBtn');
const ballBtn = document.getElementById('ballBtn');
const characterBtn = document.getElementById('characterBtn');
let swordBtnPressed = false;  // 신검 버튼 눌림 상태
let ballBtnPressed = false;   // 탁구공 버튼 눌림 상태
let swordBtnTouchId = null;   // 신검 버튼 터치 ID
let ballBtnTouchId = null;    // 탁구공 버튼 터치 ID

// 신검 버튼 - 누르고 있는 동안 연속 발사
if (swordBtn) {
    // 터치 시작
    swordBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        e.stopPropagation(); // 이벤트 전파 방지 (조이스틱으로 전파 차단)
        if (gameState.mode === GAME_MODE.COLLECTING && gameState.isRunning && !dialogueState.active && !swordBtnPressed) {
            // changedTouches에서 이 버튼을 터치한 것의 ID 저장
            if (e.changedTouches.length > 0) {
                swordBtnTouchId = e.changedTouches[0].identifier;
                swordBtnPressed = true;
            }
        }
    });
    // 터치 끝
    swordBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        e.stopPropagation();

        // 신검 버튼의 터치가 끝났는지 확인
        let swordTouchEnded = true;
        for (let i = 0; i < e.touches.length; i++) {
            if (e.touches[i].identifier === swordBtnTouchId) {
                swordTouchEnded = false;
                break;
            }
        }

        if (swordTouchEnded) {
            swordBtnPressed = false;
            swordBtnTouchId = null;
        }
    });
    swordBtn.addEventListener('touchcancel', (e) => {
        e.preventDefault();
        e.stopPropagation();

        // 신검 버튼의 터치가 끝났는지 확인
        let swordTouchEnded = true;
        for (let i = 0; i < e.touches.length; i++) {
            if (e.touches[i].identifier === swordBtnTouchId) {
                swordTouchEnded = false;
                break;
            }
        }

        if (swordTouchEnded) {
            swordBtnPressed = false;
            swordBtnTouchId = null;
        }
    });

    // 마우스 지원 (PC 테스트용)
    swordBtn.addEventListener('mousedown', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (gameState.mode === GAME_MODE.COLLECTING && gameState.isRunning && !dialogueState.active) {
            swordBtnPressed = true;
        }
    });
    swordBtn.addEventListener('mouseup', (e) => {
        e.preventDefault();
        e.stopPropagation();
        swordBtnPressed = false;
    });
    swordBtn.addEventListener('mouseleave', (e) => {
        e.stopPropagation();
        swordBtnPressed = false;
    });
}

// 탁구공 버튼 - 누르고 있는 동안 연속 발사
if (ballBtn) {
    // 터치 시작
    ballBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        e.stopPropagation(); // 이벤트 전파 방지 (조이스틱으로 전파 차단)
        if ((gameState.mode === GAME_MODE.QUIZ || gameState.mode === GAME_MODE.BOSS) && gameState.isRunning && !dialogueState.active && !ballBtnPressed) {
            // changedTouches에서 이 버튼을 터치한 것의 ID 저장
            if (e.changedTouches.length > 0) {
                ballBtnTouchId = e.changedTouches[0].identifier;
                ballBtnPressed = true;
            }
        }
    });
    // 터치 끝
    ballBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        e.stopPropagation();

        // 탁구공 버튼의 터치가 끝났는지 확인
        let ballTouchEnded = true;
        for (let i = 0; i < e.touches.length; i++) {
            if (e.touches[i].identifier === ballBtnTouchId) {
                ballTouchEnded = false;
                break;
            }
        }

        if (ballTouchEnded) {
            ballBtnPressed = false;
            ballBtnTouchId = null;
        }
    });
    ballBtn.addEventListener('touchcancel', (e) => {
        e.preventDefault();
        e.stopPropagation();

        // 탁구공 버튼의 터치가 끝났는지 확인
        let ballTouchEnded = true;
        for (let i = 0; i < e.touches.length; i++) {
            if (e.touches[i].identifier === ballBtnTouchId) {
                ballTouchEnded = false;
                break;
            }
        }

        if (ballTouchEnded) {
            ballBtnPressed = false;
            ballBtnTouchId = null;
        }
    });

    // 마우스 지원 (PC 테스트용)
    ballBtn.addEventListener('mousedown', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if ((gameState.mode === GAME_MODE.QUIZ || gameState.mode === GAME_MODE.BOSS) && gameState.isRunning && !dialogueState.active) {
            ballBtnPressed = true;
        }
    });
    ballBtn.addEventListener('mouseup', (e) => {
        e.preventDefault();
        e.stopPropagation();
        ballBtnPressed = false;
    });
    ballBtn.addEventListener('mouseleave', (e) => {
        e.stopPropagation();
        ballBtnPressed = false;
    });
}

// 캐릭터 체인지 버튼
if (characterBtn) {
    characterBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (gameState.isRunning && !dialogueState.active) {
            switchCharacter();
        }
    });

    characterBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (gameState.isRunning && !dialogueState.active) {
            switchCharacter();
        }
    });
}

// 게임 모드에 따라 버튼 표시/숨김
function updateActionButtons() {
    if (!swordBtn || !ballBtn) return;

    if (gameState.mode === GAME_MODE.COLLECTING) {
        // 수집 모드: 신검 버튼만 표시
        swordBtn.classList.remove('hidden');
        ballBtn.classList.add('hidden');
    } else if (gameState.mode === GAME_MODE.QUIZ || gameState.mode === GAME_MODE.BOSS) {
        // 퀴즈/보스 모드: 탁구공 버튼만 표시
        swordBtn.classList.add('hidden');
        ballBtn.classList.remove('hidden');
    }
}

// 모바일 컨트롤 표시/숨김
function showMobileControls() {
    const mobileControls = document.getElementById('mobileControls');
    if (mobileControls) {
        mobileControls.style.display = 'flex';
        mobileControls.style.position = 'absolute';
        mobileControls.style.bottom = '0px';
        mobileControls.style.top = 'auto';
        mobileControls.style.left = '0';
        mobileControls.style.right = '0';
    }
}

function hideMobileControls() {
    const mobileControls = document.getElementById('mobileControls');
    if (mobileControls) {
        mobileControls.style.display = 'none';
    }
}

// 배경 스크롤
let backgroundX = 0;
let clouds = [];
for (let i = 0; i < 5; i++) {
    clouds.push({
        x: Math.random() * 800,
        y: Math.random() * 200,
        width: 60 + Math.random() * 40,
        height: 30 + Math.random() * 20,
        speed: 0.5 + Math.random() * 0.5
    });
}

let stars = [];
for (let i = 0; i < 10; i++) {
    stars.push({
        x: Math.random() * 800,
        y: Math.random() * 400,
        size: 3 + Math.random() * 4,
        speed: 0.3 + Math.random() * 0.3,
        twinkle: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.05 + Math.random() * 0.05
    });
}

// 게임 오브젝트
let letters = [];
let monsters = [];
let potions = [];
let particles = [];

// 파티클 최적화 설정
const MAX_PARTICLES = 200;  // 최대 파티클 개수 제한

// 안전한 파티클 추가 함수 (최대 개수 제한)
function addParticle(x, y, color, shape = 'circle') {
    if (particles.length < MAX_PARTICLES) {
        particles.push(new Particle(x, y, color, shape));
        return true;
    }
    return false;
}

// 무기 글로우 효과 카운터 (Date.now() 대신 사용)
let glowPhaseCounter = 0;

// 보스
let boss = null;

// 탁구공 클래스 (왼쪽→오른쪽으로 발사)
class Ball {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 8;
        this.vx = 8;  // 오른쪽으로 발사
        this.vy = 0;
        this.active = false;
        this.color = '#FFD700';
    }

    update() {
        if (!this.active) return;

        this.x += this.vx;
        this.y += this.vy;

        // 위아래 벽 충돌 (실제 캔버스 크기 기준)
        if (this.y - this.radius < 0 || this.y + this.radius > canvas.height) {
            this.vy *= -1;
        }

        // 오른쪽 벗어남 (실제 캔버스 크기 기준)
        if (this.x > canvas.width + 50) {
            this.active = false;
            return;
        }

        // 왼쪽 벗어남 (되돌아가는 경우)
        if (this.x < -50) {
            this.active = false;
            return;
        }

        // 퀴즈 선택지와 충돌 (퀴즈 모드일 때)
        if (gameState.mode === GAME_MODE.QUIZ) {
            quizChoices.forEach(choice => {
                if (this.checkChoiceCollision(choice)) {
                    this.active = false;
                    handleQuizAnswer(choice);
                }
            });
        }

        // 보스와 충돌 (보스 모드일 때)
        if (gameState.mode === GAME_MODE.BOSS && boss) {
            if (this.checkBossCollision()) {
                this.active = false;
                hitBoss();
            }
        }
    }

    checkChoiceCollision(choice) {
        return this.x > choice.x &&
               this.x < choice.x + choice.width &&
               this.y - this.radius < choice.y + choice.height &&
               this.y + this.radius > choice.y;
    }

    checkBossCollision() {
        return this.x > boss.x &&
               this.x < boss.x + boss.width &&
               this.y - this.radius < boss.y + boss.height &&
               this.y + this.radius > boss.y;
    }

    draw() {
        if (!this.active) return;

        ctx.save();

        // 글로우 효과
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 2);
        gradient.addColorStop(0, this.color + 'AA');
        gradient.addColorStop(1, this.color + '00');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 2, 0, Math.PI * 2);
        ctx.fill();

        // 공 본체
        ctx.fillStyle = this.color;
        ctx.strokeStyle = '#FFA500';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // 하이라이트
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.beginPath();
        ctx.arc(this.x - this.radius * 0.3, this.y - this.radius * 0.3, this.radius * 0.3, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}

// 신검(Divine Sword) 클래스 - 케데헌 조이 스타일
class DivineSword {
    constructor(x, y, angle, depth = 0) {
        this.x = x;
        this.y = y;
        this.angle = angle;  // 발사 각도
        this.speed = 12;  // 빠른 속도
        this.vx = Math.cos(angle) * this.speed;
        this.vy = Math.sin(angle) * this.speed;
        this.active = true;
        this.width = 40;  // 검 길이
        this.height = 8;   // 검 두께
        this.rotation = 0;  // 회전 애니메이션
        this.trail = [];  // 잔상 효과
        this.trailIndex = 0;  // Circular buffer 인덱스
        this.maxTrailLength = 5;  // 8개 → 5개로 감소 (메모리 최적화)
        this.glowPhase = 0;  // 빛나는 효과
        this.framesSinceLaunch = 0;  // 발사 후 경과 프레임
        this.hasSplit = false;  // 분열 여부
        this.depth = depth;  // 분열 깊이 (0: 최초 발사, 1: 1차 분열, ...)
        this.lifetime = 60;  // 1초(60프레임) 후 자동 제거
    }

    update() {
        if (!this.active) return [];

        // 프레임 카운터 증가
        this.framesSinceLaunch++;

        // 수명 감소
        this.lifetime--;

        // 1초(60프레임) 경과 시 자동 제거
        if (this.lifetime <= 0) {
            this.active = false;
            // 소멸 파티클 효과 (파티클 제한 적용)
            const colors = ['#BA55D3', '#FF69B4', '#FFD700', '#9370DB'];
            for (let i = 0; i < 5; i++) {  // 10개 → 5개로 감소
                addParticle(
                    this.x, this.y,
                    colors[Math.floor(Math.random() * colors.length)],
                    'star'
                );
            }
            return [];
        }

        // 0.5초(30프레임) 경과 시 분열 (depth가 0일 때만 - 최대 12개 제한: 3개 + 9개)
        const newSwords = [];
        if (this.framesSinceLaunch === 30 && !this.hasSplit && this.depth === 0) {
            this.hasSplit = true;

            // 현재 각도 기준으로 -30도, 0도, +30도 방향으로 3개 신검 추가 생성
            const splitAngle1 = this.angle - Math.PI / 6;  // -30도 (왼쪽)
            const splitAngle2 = this.angle;                 // 0도 (중앙)
            const splitAngle3 = this.angle + Math.PI / 6;  // +30도 (오른쪽)

            newSwords.push(new DivineSword(this.x, this.y, splitAngle1, this.depth + 1));
            newSwords.push(new DivineSword(this.x, this.y, splitAngle2, this.depth + 1));
            newSwords.push(new DivineSword(this.x, this.y, splitAngle3, this.depth + 1));

            // 분열 파티클 효과 (파티클 제한 적용)
            const colors = ['#BA55D3', '#FF69B4', '#FFD700', '#9370DB'];
            for (let i = 0; i < 8; i++) {  // 20개 → 8개로 감소
                addParticle(
                    this.x, this.y,
                    colors[Math.floor(Math.random() * colors.length)],
                    'star'
                );
            }
        }

        this.x += this.vx;
        this.y += this.vy;
        this.rotation += 0.3;  // 회전 효과
        this.glowPhase += 0.2;

        // 잔상 효과 추가 (Circular buffer 방식으로 최적화)
        if (this.trail.length < this.maxTrailLength) {
            // 배열이 아직 최대 길이가 아니면 추가
            this.trail.push({ x: this.x, y: this.y, alpha: 1 });
        } else {
            // 배열이 최대 길이면 기존 요소 재사용 (shift/push 없이)
            this.trail[this.trailIndex].x = this.x;
            this.trail[this.trailIndex].y = this.y;
            this.trail[this.trailIndex].alpha = 1;
            this.trailIndex = (this.trailIndex + 1) % this.maxTrailLength;
        }
        // 잔상 페이드 아웃
        this.trail.forEach((t, i) => {
            t.alpha = (i + 1) / this.trail.length * 0.5;
        });

        // 화면 벗어나면 비활성화 (실제 캔버스 크기 기준, 여유있게 설정)
        // 신검이 화면 밖 몬스터까지 맞출 수 있도록 충분한 범위 제공
        if (this.x < -500 || this.x > canvas.width + 500 ||
            this.y < -500 || this.y > canvas.height + 500) {
            this.active = false;
            return [];
        }

        // 몬스터와 충돌 체크
        monsters.forEach((monster, index) => {
            if (this.checkCollision(monster)) {
                // 몬스터 제거
                monsters.splice(index, 1);

                // 점수 추가
                addScore(10); // 몬스터 처치 +10점

                // 파티클 효과 (보라색 계열) - 파티클 제한 적용
                const colors = ['#BA55D3', '#FF69B4', '#FFD700', '#9370DB', '#DDA0DD'];
                for (let i = 0; i < 10; i++) {  // 30개 → 10개로 대폭 감소
                    addParticle(
                        monster.x + monster.width / 2,
                        monster.y + monster.height / 2,
                        colors[Math.floor(Math.random() * colors.length)],
                        'star'
                    );
                }

                // 신검은 관통하므로 계속 날아감 (비활성화 안 함)
            }
        });

        // 분열된 신검 배열 반환
        return newSwords;
    }

    checkCollision(monster) {
        // 간단한 원형 충돌 (검의 중심점 기준)
        const dx = (this.x) - (monster.x + monster.width / 2);
        const dy = (this.y) - (monster.y + monster.height / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < (this.width / 2 + monster.width / 2);
    }

    draw() {
        if (!this.active) return;

        ctx.save();

        // 잔상 효과 (뒤에서부터)
        this.trail.forEach(t => {
            ctx.save();
            ctx.globalAlpha = t.alpha * 0.6;
            ctx.translate(t.x, t.y);
            ctx.rotate(this.angle + this.rotation);

            // 잔상 검 (보라색 계열)
            const gradient = ctx.createLinearGradient(-this.width / 2, 0, this.width / 2, 0);
            gradient.addColorStop(0, 'rgba(255, 165, 0, 0)');       // 투명
            gradient.addColorStop(0.3, 'rgba(216, 191, 216, 0.7)'); // 연보라
            gradient.addColorStop(0.5, 'rgba(186, 85, 211, 0.9)');  // 미디엄 오키드
            gradient.addColorStop(0.7, 'rgba(147, 112, 219, 0.7)'); // 미디엄 퍼플
            gradient.addColorStop(1, 'rgba(138, 43, 226, 0)');      // 투명
            ctx.fillStyle = gradient;
            ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);

            ctx.restore();
        });

        // 메인 검
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle + this.rotation);

        // 글로우 효과 (펄싱) - 보라색 계열
        const glowSize = 25 + Math.sin(this.glowPhase) * 5;
        const glowGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, glowSize);
        glowGradient.addColorStop(0, 'rgba(200, 150, 255, 0.8)');  // 연보라
        glowGradient.addColorStop(0.3, 'rgba(147, 112, 219, 0.6)'); // 미디엄 퍼플
        glowGradient.addColorStop(0.6, 'rgba(138, 43, 226, 0.4)');  // 블루 바이올렛
        glowGradient.addColorStop(1, 'rgba(148, 0, 211, 0)');      // 다크 바이올렛
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(0, 0, glowSize, 0, Math.PI * 2);
        ctx.fill();

        // 검 날 (보라색 그라데이션)
        const bladeGradient = ctx.createLinearGradient(-this.width / 2, 0, this.width / 2, 0);
        bladeGradient.addColorStop(0, 'rgba(255, 165, 0, 0)');    // 투명 (시작)
        bladeGradient.addColorStop(0.1, '#FFA500');   // 주황색 (손잡이 쪽)
        bladeGradient.addColorStop(0.2, '#FFD700');   // 금색
        bladeGradient.addColorStop(0.35, '#D8BFD8');  // 연보라 (Thistle)
        bladeGradient.addColorStop(0.5, '#BA55D3');   // 미디엄 오키드 (날 중앙)
        bladeGradient.addColorStop(0.65, '#9370DB');  // 미디엄 퍼플
        bladeGradient.addColorStop(0.8, '#8B008B');   // 진보라 (Dark Magenta)
        bladeGradient.addColorStop(0.95, '#BA55D3');  // 밝은 보라 (끝)
        bladeGradient.addColorStop(1, 'rgba(186, 85, 211, 0)');   // 투명

        ctx.fillStyle = bladeGradient;
        ctx.shadowColor = '#BA55D3';  // 보라색 그림자
        ctx.shadowBlur = 15;

        // 검 모양 (뾰족한 끝)
        ctx.beginPath();
        ctx.moveTo(-this.width / 2, 0);  // 손잡이 쪽
        ctx.lineTo(this.width / 2 - 8, -this.height / 2);  // 위쪽 날
        ctx.lineTo(this.width / 2, 0);  // 뾰족한 끝
        ctx.lineTo(this.width / 2 - 8, this.height / 2);  // 아래쪽 날
        ctx.closePath();
        ctx.fill();

        // 검 테두리 (금색)
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // 검 중심선 (핑크색 포인트)
        ctx.strokeStyle = 'rgba(255, 105, 180, 0.9)';  // 핫핑크
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-this.width / 2 + 5, 0);
        ctx.lineTo(this.width / 2 - 5, 0);
        ctx.stroke();

        // 핑크색 장식 (다이아몬드 모양)
        for (let i = 0; i < 3; i++) {
            const starX = -this.width / 4 + i * this.width / 4;
            ctx.fillStyle = 'rgba(255, 105, 180, 0.9)';  // 핫핑크
            ctx.beginPath();
            ctx.arc(starX, 0, 2, 0, Math.PI * 2);
            ctx.fill();

            // 핑크 글로우
            ctx.fillStyle = 'rgba(255, 192, 203, 0.5)';  // 연핑크
            ctx.beginPath();
            ctx.arc(starX, 0, 3.5, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }
}

// 토네이도(용오름) 클래스 - 세은 전용
class Tornado {
    constructor(x, y, angle = 0, depth = 0) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.depth = depth;  // 분열 깊이 (0: 원본, 1: 분열된 것)

        // 속도 설정
        this.speed = 8;
        this.vx = Math.cos(angle) * this.speed;
        this.vy = Math.sin(angle) * this.speed;

        // 분열된 토네이도는 역동적인 움직임
        if (depth > 0) {
            this.waveAmplitude = 3 + Math.random() * 2;  // 파동 진폭
            this.waveFrequency = 0.1 + Math.random() * 0.05;  // 파동 주파수
            this.spiralSpeed = (Math.random() - 0.5) * 0.15;  // 나선 회전 속도
            this.lifetime = 120;  // 분열된 토네이도: 2초(120프레임)
        } else {
            this.waveAmplitude = 0;  // 분열 전에는 직진
            this.waveFrequency = 0;
            this.spiralSpeed = 0;
            this.lifetime = 60;  // 원본 토네이도: 1초(60프레임)
        }

        this.radius = 30;
        this.rotation = 0;
        this.particles = [];
        this.frameCount = 0;
        this.toRemove = false;
        this.hasSplit = false;  // 분열 여부

        // 토네이도 파티클 초기화 (15→8→5개로 대폭 감소, 메모리 최적화)
        const particleCount = 5;  // 아이폰12 최적화를 위해 5개로 감소
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                angle: (Math.PI * 2 / particleCount) * i,
                radius: Math.random() * 20 + 10,
                height: Math.random() * 40 - 20,
                speed: Math.random() * 0.05 + 0.05
            });
        }
    }

    update() {
        if (this.toRemove) return [];

        this.frameCount++;
        this.lifetime--;

        // 1초 후 제거
        if (this.lifetime <= 0) {
            this.toRemove = true;
            // 소멸 이펙트 (파티클 제한 적용)
            for (let i = 0; i < 10; i++) {  // 20개 → 10개로 감소
                addParticle(this.x, this.y, '#87CEEB', 'circle');
            }
            return [];
        }

        // 1초(60프레임) 후 분열
        const newTornados = [];
        if (this.frameCount === 60 && !this.hasSplit && this.depth === 0) {
            this.hasSplit = true;

            // 3개로 분열 (위, 정면, 아래)
            const spreadAngles = [
                this.angle - Math.PI / 6,    // 위쪽 (30도)
                this.angle,                   // 정면 (원래 방향)
                this.angle + Math.PI / 6      // 아래쪽 (30도)
            ];

            spreadAngles.forEach(angle => {
                newTornados.push(new Tornado(
                    this.x, this.y,
                    angle,
                    this.depth + 1  // 분열된 토네이도
                ));
            });

            // 원본 토네이도는 제거
            this.toRemove = true;
        }

        // 역동적인 움직임 적용
        // 1. 기본 직선 이동
        let moveX = this.vx;
        let moveY = this.vy;

        // 2. 분열된 토네이도만 파동 움직임 추가
        if (this.depth > 0) {
            const waveOffset = Math.sin(this.frameCount * this.waveFrequency) * this.waveAmplitude;
            moveX += Math.cos(this.angle + Math.PI / 2) * waveOffset;
            moveY += Math.sin(this.angle + Math.PI / 2) * waveOffset;

            // 3. 나선형 회전 추가
            this.angle += this.spiralSpeed;
            this.vx = Math.cos(this.angle) * this.speed;
            this.vy = Math.sin(this.angle) * this.speed;
        }

        // 이동
        this.x += moveX;
        this.y += moveY;
        this.rotation += 0.2;

        // 파티클 업데이트
        this.particles.forEach(p => {
            p.angle += p.speed;
            p.height = Math.sin(this.frameCount * 0.1) * 20;
        });

        // 몬스터 충돌 체크
        monsters.forEach((monster, index) => {
            const dx = this.x - (monster.x + monster.width / 2);
            const dy = this.y - (monster.y + monster.height / 2);
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.radius + monster.width / 2) {
                // 몬스터 제거
                monsters.splice(index, 1);

                // 점수 추가
                addScore(15);

                // 파티클 효과 (파티클 제한 적용)
                for (let i = 0; i < 5; i++) {  // 10개 → 5개로 감소
                    addParticle(
                        monster.x + monster.width / 2,
                        monster.y + monster.height / 2,
                        '#00CED1',
                        'star'
                    );
                }
            }
        });

        // 알파벳은 토네이도로 파괴되지 않음 (플레이어가 직접 수집해야 함)

        return newTornados;  // 분열된 토네이도 배열 반환
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);

        // 용오름 효과 - 나선형 상승 기류 (최적화: 20→8 세그먼트)
        const spiralSegments = 8;  // 20→8로 대폭 감소 (60% 렌더링 부하 감소)
        for (let i = 0; i < spiralSegments; i++) {
            const ratio = i / spiralSegments;
            const spiralAngle = this.rotation + (ratio * Math.PI * 4); // 2회전
            const spiralRadius = (1 - ratio) * 35; // 아래가 넓고 위가 좁게
            const spiralY = -ratio * 60; // 위로 올라가는 효과

            const x = Math.cos(spiralAngle) * spiralRadius;
            const z = Math.sin(spiralAngle) * spiralRadius;

            ctx.save();
            ctx.globalAlpha = 0.7 - ratio * 0.5; // 위로 갈수록 투명

            // 용오름 기류 그라데이션
            const gradient = ctx.createRadialGradient(x, spiralY + z * 0.3, 0, x, spiralY + z * 0.3, 20);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');   // 중심 흰색
            gradient.addColorStop(0.3, 'rgba(135, 206, 250, 0.7)'); // 라이트스카이블루
            gradient.addColorStop(0.6, 'rgba(0, 191, 255, 0.4)');   // 딥스카이블루
            gradient.addColorStop(1, 'rgba(30, 144, 255, 0)');      // 투명

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(x, spiralY + z * 0.3, 15 - ratio * 10, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        }

        // 하단 물기둥 효과
        ctx.globalAlpha = 0.6;
        const baseGradient = ctx.createRadialGradient(0, 20, 0, 0, 20, 40);
        baseGradient.addColorStop(0, 'rgba(70, 130, 180, 0.8)');   // 스틸블루
        baseGradient.addColorStop(0.5, 'rgba(100, 149, 237, 0.5)'); // 코른플라워블루
        baseGradient.addColorStop(1, 'rgba(135, 206, 235, 0)');     // 투명

        ctx.fillStyle = baseGradient;
        ctx.beginPath();
        ctx.ellipse(0, 20, 35, 15, 0, 0, Math.PI * 2);
        ctx.fill();

        // 중심 소용돌이 (shadowBlur 제거로 최적화)
        ctx.globalAlpha = 0.9;
        const coreGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 25);
        coreGradient.addColorStop(0, 'rgba(255, 255, 255, 1)');     // 순백색
        coreGradient.addColorStop(0.3, 'rgba(173, 216, 230, 0.9)'); // 라이트블루
        coreGradient.addColorStop(0.6, 'rgba(135, 206, 235, 0.6)'); // 스카이블루
        coreGradient.addColorStop(1, 'rgba(70, 130, 180, 0)');      // 투명

        ctx.fillStyle = coreGradient;
        // shadowBlur 제거 (성능 저하 주범)
        ctx.beginPath();
        ctx.arc(0, 0, 25, 0, Math.PI * 2);
        ctx.fill();

        // 회전하는 바람 선 (최적화: 6→4개)
        for (let i = 0; i < 4; i++) {  // 6→4로 감소
            const angle = (Math.PI * 2 / 4) * i + this.rotation * 2;
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(angle) * 30, Math.sin(angle) * 30);
            ctx.stroke();
        }

        ctx.restore();
    }
}

// 번개체인 클래스 - 하린 전용
class LightningChain {
    constructor(x, y) {
        this.startX = x;
        this.startY = y;
        this.active = true;
        this.chainedMonsters = [];  // 연쇄된 몬스터들
        this.maxChain = 10;  // 최대 10개까지 튕김
        this.currentChainIndex = 0;
        this.chainDelay = 5;  // 각 연쇄 사이 딜레이 (프레임)
        this.chainTimer = 0;
        this.lightningBolts = [];  // 번개 시각 효과
        this.toRemove = false;
    }

    update() {
        if (this.toRemove) return;

        this.chainTimer++;

        // 첫 번째 몬스터 찾기
        if (this.chainedMonsters.length === 0) {
            const firstMonster = this.findNearestMonster(this.startX, this.startY, []);
            if (firstMonster) {
                this.addMonsterToChain(firstMonster);
            } else {
                // 맞출 몬스터가 없으면 종료
                this.toRemove = true;
                return;
            }
        }

        // 다음 연쇄 처리
        if (this.chainTimer >= this.chainDelay && this.currentChainIndex < this.chainedMonsters.length) {
            const currentMonster = this.chainedMonsters[this.currentChainIndex];

            // 몬스터 제거 및 점수 추가
            const monsterIndex = monsters.indexOf(currentMonster);
            if (monsterIndex !== -1) {
                monsters.splice(monsterIndex, 1);
                addScore(12);  // 연쇄당 12점

                // 번개 파티클 효과
                for (let i = 0; i < 15; i++) {
                    particles.push(new Particle(
                        currentMonster.x + currentMonster.width / 2,
                        currentMonster.y + currentMonster.height / 2,
                        Math.random() > 0.5 ? '#FFD700' : '#FFFFFF',
                        'star'
                    ));
                }
            }

            this.currentChainIndex++;
            this.chainTimer = 0;

            // 다음 몬스터 찾기
            if (this.currentChainIndex < this.maxChain) {
                const lastMonster = this.chainedMonsters[this.chainedMonsters.length - 1];
                const nextMonster = this.findNearestMonster(
                    lastMonster.x + lastMonster.width / 2,
                    lastMonster.y + lastMonster.height / 2,
                    this.chainedMonsters
                );

                if (nextMonster) {
                    this.addMonsterToChain(nextMonster);
                } else {
                    // 더 이상 연쇄할 몬스터가 없으면 종료
                    this.toRemove = true;
                }
            } else {
                // 최대 연쇄 도달
                this.toRemove = true;
            }
        }

        // 번개 볼트 업데이트
        this.lightningBolts = this.lightningBolts.filter(bolt => {
            bolt.lifetime--;
            return bolt.lifetime > 0;
        });

        // 모든 연쇄가 끝났으면 종료
        if (this.currentChainIndex >= this.chainedMonsters.length && this.chainedMonsters.length > 0) {
            this.toRemove = true;
        }
    }

    findNearestMonster(x, y, exclude) {
        let nearest = null;
        let minDist = Infinity;

        monsters.forEach(monster => {
            if (exclude.includes(monster)) return;

            const dx = (monster.x + monster.width / 2) - x;
            const dy = (monster.y + monster.height / 2) - y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < minDist && dist < 500) {  // 500px 이내만 연쇄
                minDist = dist;
                nearest = monster;
            }
        });

        return nearest;
    }

    addMonsterToChain(monster) {
        this.chainedMonsters.push(monster);

        // 번개 볼트 추가 (이전 지점에서 현재 몬스터로)
        const prevIndex = this.chainedMonsters.length - 2;
        let fromX, fromY;

        if (prevIndex < 0) {
            // 첫 번째 몬스터: 플레이어에서 시작
            fromX = this.startX;
            fromY = this.startY;
        } else {
            // 이전 몬스터에서 시작
            const prevMonster = this.chainedMonsters[prevIndex];
            fromX = prevMonster.x + prevMonster.width / 2;
            fromY = prevMonster.y + prevMonster.height / 2;
        }

        this.lightningBolts.push({
            fromX: fromX,
            fromY: fromY,
            toX: monster.x + monster.width / 2,
            toY: monster.y + monster.height / 2,
            lifetime: 15  // 15프레임 동안 표시
        });
    }

    draw() {
        if (this.toRemove) return;

        ctx.save();

        // 번개 볼트 그리기
        this.lightningBolts.forEach(bolt => {
            const alpha = bolt.lifetime / 15;

            // 메인 번개
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.lineWidth = 3;
            ctx.shadowColor = '#FFD700';
            ctx.shadowBlur = 20;

            this.drawLightningBolt(bolt.fromX, bolt.fromY, bolt.toX, bolt.toY);

            // 외곽 글로우
            ctx.strokeStyle = `rgba(255, 215, 0, ${alpha * 0.5})`;
            ctx.lineWidth = 6;
            ctx.shadowBlur = 30;

            this.drawLightningBolt(bolt.fromX, bolt.fromY, bolt.toX, bolt.toY);
        });

        ctx.restore();
    }

    drawLightningBolt(fromX, fromY, toX, toY) {
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);

        // 지그재그 번개 효과
        const segments = 5;
        for (let i = 1; i <= segments; i++) {
            const t = i / segments;
            const x = fromX + (toX - fromX) * t;
            const y = fromY + (toY - fromY) * t;

            // 랜덤 오프셋 추가
            const offsetX = (Math.random() - 0.5) * 20;
            const offsetY = (Math.random() - 0.5) * 20;

            ctx.lineTo(x + offsetX, y + offsetY);
        }

        ctx.lineTo(toX, toY);
        ctx.stroke();
    }
}

// 퀴즈 선택지 클래스
class QuizChoice {
    constructor(x, y, text, isCorrect, index) {
        this.x = x;
        this.y = y;
        // 모바일에서는 더 작은 크기 사용
        const isMobile = window.innerWidth <= 800;
        const isLandscape = window.innerWidth > window.innerHeight;

        // 가로 모드 모바일: 더 작은 크기로 4개 박스가 모두 보이도록
        if (isMobile && isLandscape) {
            this.width = 160;
            this.height = Math.min(60, (canvas.height - 80) / 5);  // 화면 높이에 맞게
        } else {
            this.width = isMobile ? 160 : 220;
            this.height = isMobile ? 65 : 90;
        }

        this.text = text;
        this.isCorrect = isCorrect;
        this.index = index;
        this.pulseScale = 1;
        this.pulseDirection = 0.01;
        this.rotation = 0;
        this.color = isCorrect ? '#4CAF50' : '#FF6B9D';  // 정답은 초록, 오답은 핑크 (보이지 않게)
    }

    update() {
        this.pulseScale += this.pulseDirection;
        if (this.pulseScale > 1.05 || this.pulseScale < 0.95) {
            this.pulseDirection *= -1;
        }
    }

    draw() {
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.scale(this.pulseScale, this.pulseScale);

        // 배경 (그라데이션)
        const gradient = ctx.createLinearGradient(0, -this.height / 2, 0, this.height / 2);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(1, '#4682B4');
        ctx.fillStyle = gradient;
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 3;

        // 둥근 사각형
        const radius = 10;
        ctx.beginPath();
        ctx.moveTo(-this.width / 2 + radius, -this.height / 2);
        ctx.lineTo(this.width / 2 - radius, -this.height / 2);
        ctx.arcTo(this.width / 2, -this.height / 2, this.width / 2, -this.height / 2 + radius, radius);
        ctx.lineTo(this.width / 2, this.height / 2 - radius);
        ctx.arcTo(this.width / 2, this.height / 2, this.width / 2 - radius, this.height / 2, radius);
        ctx.lineTo(-this.width / 2 + radius, this.height / 2);
        ctx.arcTo(-this.width / 2, this.height / 2, -this.width / 2, this.height / 2 - radius, radius);
        ctx.lineTo(-this.width / 2, -this.height / 2 + radius);
        ctx.arcTo(-this.width / 2, -this.height / 2, -this.width / 2 + radius, -this.height / 2, radius);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // 텍스트
        ctx.fillStyle = '#FFFFFF';
        // 모바일에서는 더 작은 폰트 사용
        const isMobile = window.innerWidth <= 800;
        const isLandscape = window.innerWidth > window.innerHeight;

        // 가로 모드 모바일: 박스 크기에 맞게 폰트 크기 조정
        let fontSize;
        if (isMobile && isLandscape) {
            fontSize = Math.min(12, this.height * 0.25);  // 박스 높이의 25%
        } else {
            fontSize = isMobile ? 14 : 20;
        }
        ctx.font = `bold ${fontSize}px Arial`;

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = '#000000';
        ctx.shadowBlur = 3;
        ctx.fillText(this.text, 0, 0);

        ctx.restore();
    }
}

// 보스 클래스
class Boss {
    constructor(stage) {
        const bossData = getBossData(stage);
        this.stage = stage;
        this.name = bossData.name;
        this.health = bossData.health;
        this.maxHealth = bossData.health;
        this.speed = bossData.speed;
        this.color = bossData.color;
        this.bossType = bossData.type;  // boss5, boss10, boss15, boss20

        this.width = 16 * PIXEL_SCALE * 1.5;  // 픽셀 스프라이트 크기 (1.5배)
        this.height = 16 * PIXEL_SCALE * 1.5;
        // 화면 중앙에 배치 (실제 캔버스 크기 기준)
        this.x = canvas.width / 2 - this.width / 2;
        this.y = 100;
        this.vx = this.speed;

        this.bounce = 0;
        this.bounceSpeed = 0.05;
        this.attackTimer = 0;
        this.attackCooldown = 200;  // 120 -> 200으로 증가 (공격 속도 감소)
    }

    update() {
        // 좌우 이동
        this.x += this.vx;

        // X 경계 체크 (왼쪽은 350까지만 - UI 박스 회피)
        const minX = 350; // 왼쪽 HP/점수 박스 피하기
        const maxX = canvas.width - this.width;

        if (this.x <= minX || this.x >= maxX) {
            this.vx *= -1;
            // 경계 밖으로 나가지 않도록 보정
            this.x = Math.max(minX, Math.min(maxX, this.x));
        }

        // 통통 튀기
        this.bounce += this.bounceSpeed;
        if (this.bounce > 0.3 || this.bounce < -0.3) {
            this.bounceSpeed *= -1;
        }

        // 공격 (탁구공 발사)
        this.attackTimer++;
        if (this.attackTimer >= this.attackCooldown) {
            this.attack();
            this.attackTimer = 0;
        }
    }

    attack() {
        // 보스가 탁구공 발사
        const bossball = new BossBall(this.x + this.width / 2, this.y + this.height);
        bossBalls.push(bossball);
    }

    draw() {
        ctx.save();
        ctx.translate(0, this.bounce * 15);

        // 그림자
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(
            this.x + this.width / 2,
            this.y + this.height + 10,
            this.width / 2,
            10,
            0,
            0,
            Math.PI * 2
        );
        ctx.fill();

        // 픽셀 스프라이트 그리기 (이동 방향에 따라 뒤집기)
        const bossSprite = bossSprites[this.bossType];
        if (bossSprite && bossSprite.idle) {
            // 왼쪽으로 이동 중이면 뒤집기
            const shouldFlip = this.vx < 0;
            drawPixelSprite(
                bossSprite.idle,
                bossSprite.colorMap,
                this.x,
                this.y,
                PIXEL_SCALE * 1.5,  // 1.5배 크기로
                shouldFlip  // 방향에 따라 뒤집기
            );
        }

        // 체력 바
        this.drawHealthBar();

        // 이름
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'center';
        ctx.shadowColor = '#000000';
        ctx.shadowBlur = 5;
        ctx.fillText(this.name, this.x + this.width / 2, this.y - 25);

        ctx.restore();
    }

    drawHealthBar() {
        const barWidth = 100;
        const barHeight = 10;
        const barX = this.x + this.width / 2 - barWidth / 2;
        const barY = this.y - 15;

        // 배경
        ctx.fillStyle = '#333333';
        ctx.fillRect(barX, barY, barWidth, barHeight);

        // 체력
        const healthPercent = this.health / this.maxHealth;
        ctx.fillStyle = healthPercent > 0.5 ? '#4CAF50' : (healthPercent > 0.25 ? '#FFA500' : '#FF0000');
        ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);

        // 테두리
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.strokeRect(barX, barY, barWidth, barHeight);
    }
}

// 보스 탁구공 클래스
class BossBall {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 8;
        this.vx = -5;  // 왼쪽으로 (지율이 방향)
        this.vy = (Math.random() - 0.5) * 4;
        this.color = '#FF4444';
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // 위아래 벽 충돌 (실제 캔버스 크기 기준)
        if (this.y - this.radius < 0 || this.y + this.radius > canvas.height) {
            this.vy *= -1;
        }

        // 지율이와 충돌 (에너지 감소)
        const jiyulX = 100;
        const jiyulY = player.y;  // 플레이어 실제 위치 사용
        if (this.x > jiyulX &&
            this.x < jiyulX + player.width &&
            this.y > jiyulY &&
            this.y < jiyulY + player.height) {
            loseEnergy();
            return true;  // 제거
        }

        // 왼쪽 벗어남
        if (this.x < -50) {
            return true;  // 제거
        }

        return false;
    }

    draw() {
        ctx.save();

        // 글로우 효과
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 2);
        gradient.addColorStop(0, this.color + 'AA');
        gradient.addColorStop(1, this.color + '00');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 2, 0, Math.PI * 2);
        ctx.fill();

        // 공 본체
        ctx.fillStyle = this.color;
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.restore();
    }
}

let bossBalls = [];

// 알파벳 카드 클래스
class LetterCard {
    constructor(x, y, letter) {
        this.x = x;
        this.y = y;
        this.letter = letter;
        this.width = 40;
        this.height = 50;
        this.collected = false;
        this.pulseScale = 1;
        this.pulseDirection = 0.02;
    }

    update() {
        this.x -= gameState.scrollSpeed;
        this.pulseScale += this.pulseDirection;
        if (this.pulseScale > 1.15 || this.pulseScale < 0.95) {
            this.pulseDirection *= -1;
        }
    }

    draw() {
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.scale(this.pulseScale, this.pulseScale);

        const gradient = ctx.createLinearGradient(0, -this.height / 2, 0, this.height / 2);
        gradient.addColorStop(0, '#FFD700');
        gradient.addColorStop(0.5, '#FFA500');
        gradient.addColorStop(1, '#FF8C00');
        ctx.fillStyle = gradient;

        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = 15;

        const radius = 8;
        ctx.beginPath();
        ctx.moveTo(-this.width / 2 + radius, -this.height / 2);
        ctx.lineTo(this.width / 2 - radius, -this.height / 2);
        ctx.arcTo(this.width / 2, -this.height / 2, this.width / 2, -this.height / 2 + radius, radius);
        ctx.lineTo(this.width / 2, this.height / 2 - radius);
        ctx.arcTo(this.width / 2, this.height / 2, this.width / 2 - radius, this.height / 2, radius);
        ctx.lineTo(-this.width / 2 + radius, this.height / 2);
        ctx.arcTo(-this.width / 2, this.height / 2, -this.width / 2, this.height / 2 - radius, radius);
        ctx.lineTo(-this.width / 2, -this.height / 2 + radius);
        ctx.arcTo(-this.width / 2, -this.height / 2, -this.width / 2 + radius, -this.height / 2, radius);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.shadowColor = '#000000';
        ctx.shadowBlur = 3;
        ctx.shadowOffsetY = 2;
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 32px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.letter, 0, 0);

        ctx.restore();
    }

    checkCollision(px, py, pw, ph) {
        return px < this.x + this.width &&
               px + pw > this.x &&
               py < this.y + this.height &&
               py + ph > this.y;
    }
}

// 몬스터 클래스
class AlphabetMonster {
    constructor(x, y, letter) {
        this.x = x;
        this.y = y;
        this.letter = letter;
        this.width = 16 * PIXEL_SCALE;
        this.height = 16 * PIXEL_SCALE;
        this.sprite = alphabetMonsters['alphabet' + letter];
        this.animation = 'idle';
        this.frameCounter = 0;
        this.vx = -0.5 - Math.random() * 0.5;  // 속도 감소: -1~-3 -> -0.5~-1
        this.vy = (Math.random() - 0.5) * 1;   // 속도 감소: *2 -> *1
        this.bounce = 0;
        this.bounceSpeed = 0.05;
    }

    update() {
        this.x -= gameState.scrollSpeed;
        this.x += this.vx;
        this.y += this.vy;

        // Y 경계 체크 (GAME_SCALE과 offset 고려)
        const offsetY = (canvas.height * (1 - GAME_SCALE)) / 2;
        const maxY = (canvas.height - offsetY) / GAME_SCALE - this.height;

        // 위쪽만 50px 여백, 아래쪽은 끝까지 허용
        if (this.y <= 50) {
            this.y = 50;
            this.vy = Math.abs(this.vy);
        }
        if (this.y >= maxY) {
            this.y = maxY;
            this.vy = -Math.abs(this.vy);
        }

        this.bounce += this.bounceSpeed;
        if (this.bounce > 0.3 || this.bounce < -0.3) {
            this.bounceSpeed *= -1;
        }

        this.frameCounter++;
    }

    draw() {
        ctx.save();
        ctx.translate(0, this.bounce * 10);

        // 귀여운 그림자
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.beginPath();
        ctx.ellipse(
            this.x + this.width / 2,
            this.y + this.height + 5,
            this.width / 2 - 5,
            5,
            0,
            0,
            Math.PI * 2
        );
        ctx.fill();

        // 픽셀 스프라이트 그리기
        if (this.sprite && this.sprite[this.animation]) {
            drawPixelSprite(
                this.sprite[this.animation],
                this.sprite.colorMap,
                this.x,
                this.y,
                PIXEL_SCALE
            );
        }

        ctx.restore();
    }

    checkCollision(px, py, pw, ph) {
        return px < this.x + this.width &&
               px + pw > this.x &&
               py < this.y + this.height &&
               py + ph > this.y;
    }
}

// 포션 클래스
class Potion {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 40;
        this.collected = false;
        this.bounce = 0;
        this.bounceSpeed = 0.05;
    }

    update() {
        this.x -= gameState.scrollSpeed;
        this.bounce += this.bounceSpeed;
        if (this.bounce > 0.3 || this.bounce < -0.3) {
            this.bounceSpeed *= -1;
        }
    }

    draw() {
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2 + this.bounce * 10);

        // 리니지 빨간 물약병 모양 (픽셀 아트)
        const scale = 2;
        const potionPixels = [
            [0,0,0,0,1,1,1,1,0,0,0,0],  // 병목
            [0,0,0,1,2,2,2,2,1,0,0,0],
            [0,0,0,1,2,2,2,2,1,0,0,0],
            [0,0,1,2,2,2,2,2,2,1,0,0],
            [0,1,2,3,3,3,3,3,3,2,1,0],  // 병 본체 시작
            [0,1,3,3,3,3,3,3,3,3,1,0],
            [1,2,3,4,4,4,4,4,4,3,2,1],  // 빨간 물약 액체
            [1,2,3,4,4,4,4,4,4,3,2,1],
            [1,2,3,4,5,5,4,4,4,3,2,1],  // 하이라이트
            [1,2,3,4,4,4,4,4,4,3,2,1],
            [0,1,3,3,4,4,4,4,3,3,1,0],
            [0,1,2,3,3,3,3,3,3,2,1,0],
            [0,0,1,2,2,2,2,2,2,1,0,0],
            [0,0,0,1,1,1,1,1,1,0,0,0]
        ];

        const colors = {
            0: null,
            1: '#654321',  // 다크브라운 (병 테두리)
            2: '#8B7355',  // 밝은 브라운 (병)
            3: '#C0C0C0',  // 실버 (유리)
            4: '#FF0000',  // 빨간 물약
            5: '#FFAAAA'   // 밝은 빨강 (하이라이트)
        };

        for (let row = 0; row < potionPixels.length; row++) {
            for (let col = 0; col < potionPixels[row].length; col++) {
                const pixel = potionPixels[row][col];
                if (pixel !== 0 && colors[pixel]) {
                    ctx.fillStyle = colors[pixel];
                    ctx.fillRect(
                        (col - 6) * scale,
                        (row - 7) * scale,
                        scale,
                        scale
                    );
                }
            }
        }

        // 반짝임 효과
        if (Math.random() > 0.7) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.fillRect(-4 * scale, -3 * scale, scale, scale);
        }

        ctx.restore();
    }

    checkCollision(px, py, pw, ph) {
        return px < this.x + this.width &&
               px + pw > this.x &&
               py < this.y + this.height &&
               py + ph > this.y;
    }
}

// 파티클 클래스
class Particle {
    constructor(x, y, color, type = 'normal') {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 8;
        this.vy = (Math.random() - 0.5) * 8 - 2;
        this.color = color;
        this.size = 3 + Math.random() * 5;
        this.life = 1;
        this.decay = 0.02 + Math.random() * 0.02;
        this.type = type;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.3;
        this.life -= this.decay;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// 유틸리티 함수
function drawHeart(x, y, size) {
    ctx.beginPath();
    ctx.moveTo(x, y + size / 4);
    ctx.bezierCurveTo(x, y, x - size / 2, y - size / 2, x - size, y + size / 4);
    ctx.bezierCurveTo(x - size, y + size, x, y + size * 1.5, x, y + size * 1.5);
    ctx.bezierCurveTo(x, y + size * 1.5, x + size, y + size, x + size, y + size / 4);
    ctx.bezierCurveTo(x + size / 2, y - size / 2, x, y, x, y + size / 4);
    ctx.closePath();
}

function drawStar(cx, cy, spikes, outerRadius, innerRadius) {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);

    for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
    }

    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
}

function drawPixelSprite(sprite, colorMap, x, y, scale = PIXEL_SCALE, flipH = false) {
    for (let row = 0; row < sprite.length; row++) {
        for (let col = 0; col < sprite[row].length; col++) {
            const pixel = sprite[row][col];
            if (pixel !== 0 && colorMap[pixel]) {
                ctx.fillStyle = colorMap[pixel];
                if (flipH) {
                    // 좌우 반전
                    ctx.fillRect(
                        x + (sprite[row].length - col - 1) * scale,
                        y + row * scale,
                        scale,
                        scale
                    );
                } else {
                    ctx.fillRect(x + col * scale, y + row * scale, scale, scale);
                }
            }
        }
    }
}

// 게임 초기화
function initGame() {
    // 20개 단어 선택
    gameState.stageWords = getRandomWords(20);
    gameState.currentStage = 1;
    gameState.clearedStages = 0;
    gameState.energy = gameState.maxEnergy;
    gameState.score = 0;

    // 첫 스테이지 시작
    startStage(1);

    updateEnergyDisplay();
    updateScoreDisplay();
}

// 스테이지 시작
function startStage(stageNum) {
    gameState.currentStage = stageNum;

    // 보스 스테이지 체크
    if (isBossStage(stageNum)) {
        startBossStage(stageNum);
    } else {
        startCollectingStage(stageNum);
    }

    updateUI();
}

// 수집 스테이지 시작
function startCollectingStage(stageNum) {
    gameState.mode = GAME_MODE.COLLECTING;

    // UI 다시 보이기 (퀴즈/보스 모드에서 숨겼다가 수집 모드로 돌아올 때)
    const ui = document.getElementById('ui');
    if (ui) {
        ui.style.display = 'block';
    }

    // 스테이지 단어 설정
    const wordIndex = stageNum - 1;
    currentStageData.wordData = gameState.stageWords[wordIndex];
    currentStageData.word = currentStageData.wordData.word;
    currentStageData.collectedLetters = [];  // 순서 없이 수집

    // 플레이어 초기화
    player.x = 100;
    player.y = canvas.height / 2 - player.height / 2;
    player.vx = 0;
    player.vy = 0;

    // 오브젝트 초기화
    letters = [];
    monsters = [];
    potions = [];
    particles = [];
    divineSwords = [];

    // 쿨다운 초기화
    swordCooldown = 0;
    spacePressed = false;
    swordBtnPressed = false;

    // 초기 오브젝트 생성 (알파벳은 1번만 호출해서 겹치지 않게)
    spawnNextLetter();
    for (let i = 0; i < 3; i++) {
        spawnMonster(canvas.width + i * 300);
    }
    spawnPotion(canvas.width + 800);

    // wordProgress를 원래 위치로 복원
    const wordProgress = document.getElementById('wordProgress');
    if (wordProgress) {
        wordProgress.style.position = 'absolute';
        wordProgress.style.left = 'auto';
        wordProgress.style.right = '10px';
        wordProgress.style.top = '10px';
        wordProgress.style.bottom = 'auto';
        wordProgress.style.width = '320px';
        wordProgress.style.fontSize = '18px';
        wordProgress.style.padding = '10px';
        wordProgress.style.transform = 'none';
    }
}

// 퀴즈 스테이지 시작
function startQuizStage() {
    gameState.mode = GAME_MODE.QUIZ;

    // UI 숨기기 (HP바와 점수 박스가 캐릭터를 가리지 않도록)
    const ui = document.getElementById('ui');
    if (ui) {
        ui.style.display = 'none';
    }

    // 지율이 위치 초기화 (첫 번째 선택지)
    jiyulQuizY = 0;

    // 퀴즈 선택지 먼저 생성
    createQuizChoices();

    // 공 초기화 (지율이 위치에서 발사, 선택지 위치 기준)
    const jiyulX = 100;
    const jiyulY = quizChoices[jiyulQuizY].y + quizChoices[jiyulQuizY].height / 2;
    ball = new Ball(jiyulX + player.width + 60, jiyulY);

    // 오브젝트 클리어
    letters = [];
    monsters = [];
    potions = [];

    // 쿨다운 초기화
    swordCooldown = 0;
    spacePressed = false;
    ballBtnPressed = false;

    // UI 업데이트 (wordProgress 위치 변경)
    updateUI();

    // 퀴즈 모드용 간결한 스타일 (상단 중앙, 작게)
    const wordProgress = document.getElementById('wordProgress');
    if (wordProgress) {
        wordProgress.style.position = 'fixed';
        wordProgress.style.left = '50%';
        wordProgress.style.right = 'auto';
        wordProgress.style.top = '10px';
        wordProgress.style.bottom = 'auto';
        wordProgress.style.transform = 'translateX(-50%)';
        wordProgress.style.width = 'auto';
        wordProgress.style.maxWidth = '400px';
        wordProgress.style.fontSize = '18px';
        wordProgress.style.padding = '8px 15px';
    }
}

// 퀴즈 선택지 생성 (words.js의 getQuizChoices 사용)
function createQuizChoices() {
    quizChoices = [];

    // words.js의 함수로 정답과 오답 가져오기
    const choices = getQuizChoices(currentStageData.wordData);
    const correctMeaning = choices.correctMeaning;
    const wrongMeanings = choices.wrongMeanings;

    // 4개 선택지 생성
    const allChoices = [correctMeaning, ...wrongMeanings];

    // 셔플
    for (let i = allChoices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allChoices[i], allChoices[j]] = [allChoices[j], allChoices[i]];
    }

    // 선택지 배치 (화면 중앙에 세로로)
    const isMobile = window.innerWidth <= 800;
    const isLandscape = window.innerWidth > window.innerHeight;

    // 박스 크기 결정 (QuizChoice 생성자와 동일한 로직)
    let boxWidth, boxHeight;
    if (isMobile && isLandscape) {
        boxWidth = 160;
        boxHeight = Math.min(60, (canvas.height * 2 - 80) / 5);
    } else {
        boxWidth = isMobile ? 160 : 220;
        boxHeight = isMobile ? 65 : 90;
    }

    // 박스 간격
    let spacingY;
    if (isMobile && isLandscape) {
        spacingY = Math.min(80, (canvas.height - 200) / 5);
    } else if (isMobile) {
        spacingY = 100;
    } else {
        spacingY = 120;
    }

    // 중앙 정렬 계산: 지율이와 박스를 하나의 그룹으로 중앙 배치 (실제 캔버스 크기 기준)
    const jiyulWidth = player.width;
    const gap = isMobile ? 100 : 150; // 지율이와 박스 사이 간격
    const totalWidth = jiyulWidth + gap + boxWidth;
    const groupStartX = (canvas.width - totalWidth) / 2;

    // 박스 X 위치 (지율이 오른쪽에 배치)
    const startX = groupStartX + jiyulWidth + gap;

    // 세로: 4개 박스 전체 높이를 계산해서 중앙 정렬
    const totalHeight = boxHeight * 4 + spacingY * 3;
    const startY = (canvas.height - totalHeight) / 2;

    // 지율이 X 위치를 전역 변수에 저장 (drawJiyulWithPaddle에서 사용)
    window.quizJiyulX = groupStartX;

    for (let i = 0; i < 4; i++) {
        const x = startX;
        const y = startY + i * (boxHeight + spacingY);
        const isCorrect = allChoices[i] === correctMeaning;
        quizChoices.push(new QuizChoice(x, y, allChoices[i], isCorrect, i));
    }
}

// 대화 시작
function startDialogue(dialogues, onComplete) {
    dialogueState.active = true;
    dialogueState.dialogues = dialogues;
    dialogueState.currentIndex = 0;
    dialogueState.onComplete = onComplete;
    gameState.isPaused = true;

    // 대화 중에는 모바일 컨트롤 숨기기
    hideMobileControls();
}

// 대화 진행
function advanceDialogue() {
    dialogueState.currentIndex++;
    if (dialogueState.currentIndex >= dialogueState.dialogues.length) {
        // 대화 종료
        dialogueState.active = false;
        gameState.isPaused = false;

        // 대화가 끝나면 모바일 컨트롤 다시 보이기
        showMobileControls();

        if (dialogueState.onComplete) {
            dialogueState.onComplete();
        }
    }
}

// 대화 그리기
function drawDialogue() {
    if (!dialogueState.active) return;

    const dialogue = dialogueState.dialogues[dialogueState.currentIndex];

    // 대화창 높이를 화면 크기에 맞게 조정 (모바일: 작게, PC: 크게)
    const dialogueHeight = Math.min(180, canvas.height * 0.3);
    const padding = Math.max(10, canvas.width * 0.0125);
    const fontSize = Math.max(14, Math.min(18, canvas.width * 0.0225));
    const speakerFontSize = Math.max(16, Math.min(20, canvas.width * 0.025));

    // 반투명 배경
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, canvas.height - dialogueHeight, canvas.width, dialogueHeight);

    // 테두리
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 3;
    ctx.strokeRect(padding, canvas.height - dialogueHeight + padding, canvas.width - padding * 2, dialogueHeight - padding * 2);

    // 말하는 사람
    ctx.fillStyle = '#FFD700';
    ctx.font = `bold ${speakerFontSize}px Arial`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(dialogue.speaker, padding * 2, canvas.height - dialogueHeight + padding * 2);

    // 대화 내용
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `${fontSize}px Arial`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    // 긴 텍스트 줄바꿈 (한글 지원)
    const maxWidth = canvas.width - padding * 4;
    let line = '';
    let y = canvas.height - dialogueHeight + padding * 2 + speakerFontSize + 8;
    const lineHeight = fontSize + 5;
    // 대화창 끝 (버튼 위) - 여유있게
    const btnHeight = 40;
    const maxY = canvas.height - btnHeight - padding;

    for (let i = 0; i < dialogue.text.length; i++) {
        const testLine = line + dialogue.text[i];
        const metrics = ctx.measureText(testLine);

        if (metrics.width > maxWidth && line.length > 0) {
            // 현재 줄 그리기
            if (y < maxY) {
                ctx.fillText(line, padding * 2, y);
            }
            y += lineHeight;
            line = dialogue.text[i];

            // 다음 줄이 박스를 벗어나면 중단
            if (y >= maxY) {
                break;
            }
        } else {
            line = testLine;
        }
    }
    // 마지막 줄 그리기
    if (line.length > 0 && y < maxY) {
        ctx.fillText(line, padding * 2, y);
    }

    // 클릭 버튼 그리기 (오프닝 시퀀스 스타일)
    const btnWidth = 100;
    const btnX = canvas.width - btnWidth - padding * 3;
    const btnY = canvas.height - btnHeight - padding * 2;

    // 애니메이션 효과 (깜빡임)
    const time = Date.now() * 0.002;
    const alpha = 0.7 + Math.sin(time) * 0.3;

    // 버튼 배경 (골드)
    ctx.fillStyle = `rgba(255, 215, 0, ${alpha})`;
    ctx.fillRect(btnX, btnY, btnWidth, btnHeight);

    // 버튼 테두리 (흰색)
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.strokeRect(btnX, btnY, btnWidth, btnHeight);

    // 버튼 텍스트 (검정색)
    ctx.fillStyle = '#000000';
    ctx.font = `bold ${Math.max(16, fontSize)}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Click', btnX + btnWidth / 2, btnY + btnHeight / 2);

    // textAlign과 textBaseline 복원
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
}

// 보스 스테이지 시작
function startBossStage(stageNum) {
    gameState.mode = GAME_MODE.BOSS;

    // UI 숨기기 (HP바와 점수 박스가 캐릭터를 가리지 않도록)
    const ui = document.getElementById('ui');
    if (ui) {
        ui.style.display = 'none';
    }

    // 플레이어 위치 초기화
    player.x = 100;
    player.y = canvas.height / 2 - player.height / 2;
    player.vx = 0;
    player.vy = 0;

    // 공 초기화 (지율이 위치에서 발사)
    const jiyulX = 100;
    const jiyulY = player.y + player.height / 2;
    ball = new Ball(jiyulX + player.width + 60, jiyulY);

    // 보스 생성
    boss = new Boss(stageNum);
    bossBalls = [];

    // 오브젝트 클리어
    letters = [];
    monsters = [];
    potions = [];
    quizChoices = [];

    // 쿨다운 초기화
    swordCooldown = 0;
    spacePressed = false;
    ballBtnPressed = false;

    // UI 업데이트 (wordProgress 위치 변경)
    updateUI();

    // 강제로 스타일 적용 (우측 상단 - 가로 모드 전용이라 문제없음)
    const wordProgress = document.getElementById('wordProgress');
    if (wordProgress) {
        wordProgress.style.position = 'fixed';
        wordProgress.style.left = 'auto';
        wordProgress.style.right = '10px';
        wordProgress.style.top = '10px';
        wordProgress.style.bottom = 'auto';
        wordProgress.style.width = '320px';
        wordProgress.style.fontSize = '16px';
        wordProgress.style.padding = '10px';
        wordProgress.style.transform = 'none';
    }

    // 보스 전투 전 대화 시작
    const bossData = getBossData(stageNum);
    if (bossData && bossData.preBattleDialogue) {
        startDialogue(bossData.preBattleDialogue, null);
    }
}

// 다음 글자 생성 (A~Z 랜덤하게, 중복 방지)
function spawnNextLetter() {
    // 아직 수집하지 않은 알파벳 찾기 (중복 고려)
    const neededLetters = currentStageData.word.split('').filter(char => {
        const needed = currentStageData.word.split('').filter(c => c === char).length;
        const collected = currentStageData.collectedLetters.filter(c => c === char).length;
        return collected < needed;
    });

    // 모두 수집했으면 더 이상 생성하지 않음
    if (neededLetters.length === 0) return;

    // 현재 화면에 있는 알파벳 목록 (중복 방지용)
    const existingLetters = letters.map(l => l.letter);

    // A~Z 중에서 랜덤하게 2~3개 생성 (간격을 넓히기 위해 개수 줄임)
    const allLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const numCards = 2 + Math.floor(Math.random() * 2);  // 2~3개

    // 필요한 알파벳 중 하나를 포함시킬지 결정 (80% 확률)
    const includeNeeded = Math.random() < 0.8 && neededLetters.length > 0;

    const usedLetters = [...existingLetters];  // 이미 화면에 있는 알파벳 + 이번에 생성할 알파벳

    for (let i = 0; i < numCards; i++) {
        let letter;
        let attempts = 0;

        if (i === 0 && includeNeeded) {
            // 첫 번째는 필요한 알파벳 중 랜덤 (중복 체크)
            do {
                letter = neededLetters[Math.floor(Math.random() * neededLetters.length)];
                attempts++;
            } while (usedLetters.includes(letter) && attempts < 10);
        } else {
            // 나머지는 랜덤 (중복 체크)
            do {
                letter = allLetters[Math.floor(Math.random() * allLetters.length)];
                attempts++;
            } while (usedLetters.includes(letter) && attempts < 20);
        }

        // 중복되지 않은 알파벳을 찾았거나, 시도 횟수 초과
        if (!usedLetters.includes(letter)) {
            usedLetters.push(letter);  // 사용한 알파벳 추가

            // 화면 오른쪽 밖에서 생성 (실제 캔버스 크기 기준)
            const x = canvas.width + 200 + i * 500;  // 간격을 500px으로 매우 넓게 설정
            // 상단 UI와 겹치지 않도록 y 최소값을 150으로 조정
            const y = 150 + Math.random() * (canvas.height - 300);
            letters.push(new LetterCard(x, y, letter));
        }
    }
}

// 몬스터 생성 (스테이지별 테마에 맞는 알파벳)
function spawnMonster(x = null) {
    const stage = gameState.currentStage;
    let availableLetters;

    // 스테이지별 배경 데이터에서 몬스터 알파벳 가져오기
    if (typeof stageBackgrounds !== 'undefined' && stageBackgrounds[stage] && stageBackgrounds[stage].monsters) {
        availableLetters = stageBackgrounds[stage].monsters;
    } else {
        // 기본값 (backgrounds.js가 없을 경우)
        if (stage <= 3) {
            availableLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
        } else if (stage <= 7) {
            availableLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P'];
        } else if (stage <= 12) {
            availableLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'];
        } else {
            availableLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        }
    }

    const letter = availableLetters[Math.floor(Math.random() * availableLetters.length)];

    // GAME_SCALE과 offset을 고려한 좌표 계산
    const offsetX = (canvas.width * (1 - GAME_SCALE)) / 2;
    const offsetY = (canvas.height * (1 - GAME_SCALE)) / 2;
    const maxX = (canvas.width - offsetX) / GAME_SCALE;
    const maxY = (canvas.height - offsetY) / GAME_SCALE;

    // 화면 오른쪽 밖에서 생성
    const spawnX = x !== null ? x : maxX + 50;
    // 상단 UI와 겹치지 않도록 y 최소값을 150으로 조정, 아래는 끝까지
    const spawnY = 150 + Math.random() * (maxY - 150 - 50);
    monsters.push(new AlphabetMonster(spawnX, spawnY, letter));
}

// 포션 생성
function spawnPotion(x = null) {
    // GAME_SCALE과 offset을 고려한 좌표 계산
    const offsetX = (canvas.width * (1 - GAME_SCALE)) / 2;
    const offsetY = (canvas.height * (1 - GAME_SCALE)) / 2;
    const maxX = (canvas.width - offsetX) / GAME_SCALE;
    const maxY = (canvas.height - offsetY) / GAME_SCALE;

    // 화면 오른쪽 밖에서 생성
    const spawnX = x !== null ? x : maxX + 50;
    // 상단 UI와 겹치지 않도록 y 최소값을 150으로 조정, 아래는 끝까지
    const spawnY = 150 + Math.random() * (maxY - 150 - 50);
    potions.push(new Potion(spawnX, spawnY));
}

// 신검 발사 (1시, 3시, 5시 방향으로 3개)
// 기존 함수 - fireWeapon으로 대체됨
// function launchDivineSwords() {
//     const jiyulX = player.x + player.width + 20;
//     const jiyulY = player.y + player.height / 2;
//     const angle1 = -Math.PI / 6;
//     const angle3 = 0;
//     const angle5 = Math.PI / 6;
//     divineSwords.push(new DivineSword(jiyulX, jiyulY, angle1));
//     divineSwords.push(new DivineSword(jiyulX, jiyulY, angle3));
//     divineSwords.push(new DivineSword(jiyulX, jiyulY, angle5));
//     jiyulSmashing = true;
//     smashTimer = 0;
// }

// // 파티클 효과 코드도 fireWeapon으로 이동됨
// for (let i = 0; i < 30; i++) {
//     const colors = ['#BA55D3', '#FF69B4', '#FFD700', '#9370DB'];
//     particles.push(new Particle(
//         jiyulX,
//         jiyulY,
//         colors[Math.floor(Math.random() * colors.length)],
//         'star'
//     ));
// }

// 공 발사 (지율이 스매싱 모션)
function launchBall() {
    if (!ball || ball.active) return;

    // 지율이 현재 위치에서 발사
    let jiyulX, jiyulY;

    if (gameState.mode === GAME_MODE.QUIZ) {
        // 퀴즈 모드: 중앙 정렬된 위치에서 발사
        jiyulX = window.quizJiyulX || 100;
        jiyulY = quizChoices[jiyulQuizY].y + quizChoices[jiyulQuizY].height / 2;
    } else {
        // 보스 모드: 플레이어 실제 위치에서 발사
        jiyulX = 100;
        jiyulY = player.y + player.height / 2;
    }

    ball.x = jiyulX + player.width + 50;
    ball.y = jiyulY;
    ball.vx = 10;  // 오른쪽으로 빠르게
    ball.vy = (Math.random() - 0.5) * 2;  // 약간의 랜덤 각도
    ball.active = true;

    // 스매싱 모션 시작
    jiyulSmashing = true;
    smashTimer = 0;

    // 파티클 효과
    for (let i = 0; i < 15; i++) {
        particles.push(new Particle(ball.x, ball.y, '#FFD700', 'star'));
    }
}

// 퀴즈 답 처리
function handleQuizAnswer(choice) {
    if (choice.isCorrect) {
        // 정답!
        addScore(100); // 퀴즈 정답 +100점
        for (let i = 0; i < 50; i++) {
            const colors = ['#FFD700', '#00FF00', '#FF69B4', '#87CEEB'];
            particles.push(new Particle(choice.x + choice.width / 2, choice.y + choice.height / 2, colors[Math.floor(Math.random() * colors.length)], 'star'));
        }

        // 스테이지 클리어
        setTimeout(() => {
            stageCleared();
        }, 1000);
    } else {
        // 오답
        loseEnergy();
        for (let i = 0; i < 30; i++) {
            particles.push(new Particle(choice.x + choice.width / 2, choice.y + choice.height / 2, '#FF0000', 'normal'));
        }

        // 공 리셋 (지율이 위치에서)
        const jiyulX = 100;
        const jiyulY = quizChoices[jiyulQuizY].y + quizChoices[jiyulQuizY].height / 2;
        ball = new Ball(jiyulX + player.width + 60, jiyulY);
    }
}

// 보스 맞추기
function hitBoss() {
    boss.health--;
    addScore(50); // 보스 타격 +50점

    // 파티클 효과
    for (let i = 0; i < 30; i++) {
        particles.push(new Particle(boss.x + boss.width / 2, boss.y + boss.height / 2, '#FFD700', 'star'));
    }

    if (boss.health <= 0) {
        // 보스 처치 - 대화 후 다음 스테이지
        const bossData = getBossData(gameState.currentStage);
        if (bossData && bossData.postBattleDialogue) {
            setTimeout(() => {
                boss = null; // 보스 제거
                startDialogue(bossData.postBattleDialogue, () => {
                    bossClearedStage();
                });
            }, 1000);
        } else {
            setTimeout(() => {
                bossClearedStage();
            }, 1000);
        }
    } else {
        // 공 리셋 (지율이 위치에서)
        const jiyulX = 100;
        const jiyulY = canvas.height / 2;
        ball = new Ball(jiyulX + player.width + 60, jiyulY);
    }
}

// 스테이지 클리어
function stageCleared() {
    gameState.clearedStages++;
    addScore(200); // 스테이지 클리어 +200점

    if (gameState.currentStage >= gameState.maxStage) {
        // 게임 클리어!
        gameWin();
    } else {
        // 다음 스테이지
        startStage(gameState.currentStage + 1);
    }
}

// 보스 스테이지 클리어
function bossClearedStage() {
    gameState.clearedStages++;
    addScore(500); // 보스 스테이지 클리어 +500점
    bossBalls = [];

    if (gameState.currentStage >= gameState.maxStage) {
        // 게임 클리어!
        gameWin();
    } else {
        // 다음 스테이지
        startStage(gameState.currentStage + 1);
    }
}

// 플레이어 업데이트
function updatePlayer() {
    player.vx = 0;
    player.vy = 0;

    if (keys['ArrowLeft'] || keys['a'] || keys['A']) player.vx = -player.speed;
    if (keys['ArrowRight'] || keys['d'] || keys['D']) player.vx = player.speed;
    if (keys['ArrowUp'] || keys['w'] || keys['W']) player.vy = -player.speed;
    if (keys['ArrowDown'] || keys['s'] || keys['S']) player.vy = player.speed;

    if (joystick.active) {
        const sensitivity = 0.15;
        player.vx = (joystick.deltaX / maxDistance) * player.speed * sensitivity * 10;
        player.vy = (joystick.deltaY / maxDistance) * player.speed * sensitivity * 10;
    }

    if (player.vx !== 0 && player.vy !== 0) {
        player.vx *= 0.707;
        player.vy *= 0.707;
    }

    player.x += player.vx;
    player.y += player.vy;

    // 경계 체크: GAME_SCALE과 offset을 고려한 실제 렌더링 영역
    // offsetY = (canvas.height * (1 - GAME_SCALE)) / 2
    // 렌더링 위치 = offsetY + (player.y * GAME_SCALE)
    // 하단 경계: offsetY + (player.y + player.height) * GAME_SCALE = canvas.height
    // => player.y = (canvas.height - offsetY) / GAME_SCALE - player.height

    const offsetX = (canvas.width * (1 - GAME_SCALE)) / 2;
    const offsetY = (canvas.height * (1 - GAME_SCALE)) / 2;

    // X 경계
    if (player.x < 0) player.x = 0;
    if (player.x > (canvas.width - offsetX) / GAME_SCALE - player.width) {
        player.x = (canvas.width - offsetX) / GAME_SCALE - player.width;
    }

    // Y 경계 (위쪽 50px 여백, 아래쪽 끝까지)
    if (player.y < 50) player.y = 50;
    if (player.y > (canvas.height - offsetY) / GAME_SCALE - player.height) {
        player.y = (canvas.height - offsetY) / GAME_SCALE - player.height;
    }

    // 플레이어 애니메이션 프레임 진행
    player.frameCounter++;
    if (player.frameCounter >= player.frameDelay) {
        player.frameCounter = 0;
        const spriteData = pixelData[player.sprite];
        if (spriteData && spriteData[player.animation]) {
            const animationFrames = spriteData[player.animation];
            player.frameIndex = (player.frameIndex + 1) % animationFrames.length;
        }
    }
}

// 퀴즈 모드 지율이 업데이트 (위아래로 선택지 이동)
let lastMoveTime = 0;
function updateJiyulQuiz() {
    const now = Date.now();

    // 키 입력 딜레이 (200ms)
    if (now - lastMoveTime < 200) return;

    if (keys['ArrowUp'] || keys['w'] || keys['W']) {
        if (jiyulQuizY > 0) {
            jiyulQuizY--;
            lastMoveTime = now;
        }
    }
    if (keys['ArrowDown'] || keys['s'] || keys['S']) {
        if (jiyulQuizY < 3) {
            jiyulQuizY++;
            lastMoveTime = now;
        }
    }

    // 조이스틱
    if (joystick.active && Math.abs(joystick.deltaY) > 20) {
        if (joystick.deltaY < 0 && jiyulQuizY > 0) {
            jiyulQuizY--;
            lastMoveTime = now;
        } else if (joystick.deltaY > 0 && jiyulQuizY < 3) {
            jiyulQuizY++;
            lastMoveTime = now;
        }
    }
}

// (라켓 관련 함수 제거됨 - 이제 지율이가 직접 라켓 들고 있음)

// 지율이가 라켓을 든 모습 그리기 (스매싱 모션 포함, 위아래 이동)
function drawJiyulWithPaddle() {
    // 스매싱 타이머 업데이트
    if (jiyulSmashing) {
        smashTimer++;
        if (smashTimer > 15) {  // 0.25초 정도
            jiyulSmashing = false;
            smashTimer = 0;
        }
    }

    // 지율이 위치 (위아래 이동 가능)
    let jiyulX, jiyulY;

    if (gameState.mode === GAME_MODE.QUIZ) {
        // 퀴즈 모드: 선택지 왼쪽에 중앙 정렬되어 배치
        jiyulX = window.quizJiyulX || 100; // 저장된 위치 사용 (없으면 기본값)
        jiyulY = quizChoices[jiyulQuizY].y + quizChoices[jiyulQuizY].height / 2 - player.height / 2;
    } else {
        // 보스 모드: 플레이어 실제 위치 사용
        jiyulX = 100;
        jiyulY = player.y;
    }

    ctx.save();

    // 지율이 픽셀 스프라이트 (스매싱 중이면 smashing 애니메이션)
    const spriteData = pixelData[player.sprite];
    const animation = jiyulSmashing ? 'smashing' : 'idle';

    if (spriteData && spriteData[animation]) {
        drawPixelSprite(
            spriteData[animation],
            spriteData.colorMap,
            jiyulX,
            jiyulY,
            PIXEL_SCALE
        );
    }

    // 탁구 라켓 (지율이 오른쪽에, 크기 조절)
    const paddleX = jiyulX + player.width + (jiyulSmashing ? 15 : 5);  // 스매싱 시 앞으로
    const paddleY = jiyulY + player.height / 2 - 20;  // 지율이 중앙에 맞춤
    const paddleWidth = 30;  // 크기 축소
    const paddleHeight = 35;  // 크기 축소

    // 스매싱 시 회전 효과
    if (jiyulSmashing) {
        ctx.save();
        ctx.translate(paddleX + paddleWidth / 2, paddleY + paddleHeight / 2);
        ctx.rotate(Math.PI / 6);  // 약간 기울임
        ctx.translate(-(paddleX + paddleWidth / 2), -(paddleY + paddleHeight / 2));
    }

    // 라켓면 (보라색 고무)
    const paddleGradient = ctx.createRadialGradient(
        paddleX + paddleWidth / 2,
        paddleY + paddleHeight / 2 - 5,
        0,
        paddleX + paddleWidth / 2,
        paddleY + paddleHeight / 2 - 5,
        paddleWidth / 2
    );
    paddleGradient.addColorStop(0, '#B24FFF');  // 밝은 보라색
    paddleGradient.addColorStop(0.7, '#9370DB');  // 중간 보라색
    paddleGradient.addColorStop(1, '#7B4FA3');  // 어두운 보라색
    ctx.fillStyle = paddleGradient;

    // 검은 테두리
    ctx.strokeStyle = '#1A1A1A';
    ctx.lineWidth = 2.5;

    ctx.beginPath();
    ctx.ellipse(paddleX + paddleWidth / 2, paddleY + paddleHeight / 2 - 5, paddleWidth / 2, paddleHeight / 2 - 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // 라켓 하이라이트 (광택 효과)
    ctx.fillStyle = 'rgba(220, 200, 255, 0.35)';
    ctx.beginPath();
    ctx.ellipse(paddleX + paddleWidth / 2 - 6, paddleY + paddleHeight / 2 - 10, 6, 9, 0, 0, Math.PI * 2);
    ctx.fill();

    // 손잡이 (노란색)
    const handleGradient = ctx.createLinearGradient(
        paddleX + paddleWidth / 2 - 5,
        paddleY + paddleHeight - 8,
        paddleX + paddleWidth / 2 + 5,
        paddleY + paddleHeight - 8
    );
    handleGradient.addColorStop(0, '#FFD700');  // 밝은 노란색
    handleGradient.addColorStop(0.5, '#FFC800');  // 중간 노란색
    handleGradient.addColorStop(1, '#FFD700');  // 밝은 노란색
    ctx.fillStyle = handleGradient;
    ctx.strokeStyle = '#CC9900';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(paddleX + paddleWidth / 2 - 5, paddleY + paddleHeight - 8, 10, 20, 3);
    ctx.fill();
    ctx.stroke();

    // 손잡이 끝부분 (플레어)
    ctx.fillStyle = '#FFCC00';
    ctx.beginPath();
    ctx.roundRect(paddleX + paddleWidth / 2 - 6, paddleY + paddleHeight + 10, 12, 3, 2);
    ctx.fill();

    if (jiyulSmashing) {
        ctx.restore();
    }

    ctx.restore();
}

// 플레이어 그리기
function drawPlayer() {
    const spriteData = pixelData[player.sprite];
    if (spriteData && spriteData[player.animation]) {
        drawPixelSprite(
            spriteData[player.animation],
            spriteData.colorMap,
            player.x,
            player.y,
            PIXEL_SCALE
        );
    }

    // 세은이가 무기를 들고 있을 때 청룡언월도 그리기
    if (currentCharacter === 1 && player.showWeapon) {
        drawGreenDragonBlade(
            player.x + player.width + 20,
            player.y + player.height / 2,
            player.weaponAngle
        );
    }

    // 하린이가 무기를 들고 있을 때 번개검 그리기
    if (currentCharacter === 2 && player.showWeapon) {
        drawLightningSword(
            player.x + player.width + 20,
            player.y + player.height / 2,
            player.weaponAngle
        );
    }
}

// 배경 그리기 (스테이지별 테마, 스크롤 효과)
function drawBackground() {
    // 배경 스크롤 업데이트 (앞으로 걸어가는 느낌)
    if (gameState.mode === GAME_MODE.COLLECTING) {
        backgroundX += gameState.scrollSpeed;
    }

    // 스테이지에 맞는 배경 그리기 (backgrounds.js의 함수 사용)
    if (typeof drawStageBackground === 'function') {
        drawStageBackground(ctx, canvas, gameState.currentStage, backgroundX);
    } else {
        // 기본 배경 (backgrounds.js가 로드되지 않은 경우)
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#E6F3FF');
        gradient.addColorStop(0.5, '#B8E0FF');
        gradient.addColorStop(1, '#8FD3FF');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 지면
        const groundGradient = ctx.createLinearGradient(0, canvas.height - 50, 0, canvas.height);
        groundGradient.addColorStop(0, '#A8E6A3');
        groundGradient.addColorStop(1, '#7BC67B');
        ctx.fillStyle = groundGradient;
        ctx.fillRect(0, canvas.height - 50, canvas.width, 50);
    }
}

// 충돌 체크
function checkCollisions() {
    // 알파벳 카드 충돌
    letters.forEach((letter, index) => {
        if (!letter.collected && letter.checkCollision(player.x, player.y, player.width, player.height)) {
            // 이 알파벳이 단어에 포함되어 있는지 체크
            if (currentStageData.word.includes(letter.letter)) {
                // 아직 필요한 개수만큼 수집했는지 체크 (중복 알파벳 처리)
                const neededCount = currentStageData.word.split('').filter(c => c === letter.letter).length;
                const collectedCount = currentStageData.collectedLetters.filter(c => c === letter.letter).length;

                if (collectedCount < neededCount) {
                    // 정답! (아직 이 알파벳을 더 수집해야 함)
                    letter.collected = true;
                    currentStageData.collectedLetters.push(letter.letter);
                    addScore(20); // 알파벳 수집 +20점

                    // 파티클 효과 (파티클 제한 적용)
                    const colors = ['#FFD700', '#FFA500', '#FF69B4'];
                    for (let i = 0; i < 15; i++) {  // 30개 → 15개로 감소
                        addParticle(letter.x + letter.width / 2, letter.y + letter.height / 2, colors[Math.floor(Math.random() * colors.length)], 'star');
                    }

                    updateUI();

                    // 단어 완성 체크 (모든 알파벳을 개수에 맞게 모았는지)
                    const allCollected = currentStageData.word.split('').every(char => {
                        const needed = currentStageData.word.split('').filter(c => c === char).length;
                        const collected = currentStageData.collectedLetters.filter(c => c === char).length;
                        return collected >= needed;
                    });

                    if (allCollected) {
                        // 퀴즈 모드로 전환
                        setTimeout(() => {
                            startQuizStage();
                        }, 500);
                    } else {
                        // 아직 모두 수집하지 않았으면 새 카드 생성
                        if (letters.length < 3) {
                            spawnNextLetter();
                        }
                    }
                } else {
                    // 이미 필요한 개수만큼 수집한 알파벳
                    letter.collected = true;
                }
            } else {
                // 틀렸을 때 (단어에 없는 알파벳)
                letter.collected = true;
                loseEnergy();

                // 파티클 효과 (파티클 제한 적용)
                for (let i = 0; i < 10; i++) {  // 20개 → 10개로 감소
                    addParticle(letter.x + letter.width / 2, letter.y + letter.height / 2, '#FF0000', 'normal');
                }
            }
        }
    });

    // 몬스터 충돌
    monsters.forEach(monster => {
        if (monster.checkCollision(player.x, player.y, player.width, player.height)) {
            loseEnergy();
            monsters.splice(monsters.indexOf(monster), 1);

            // 파티클 효과 (파티클 제한 적용)
            const colors = ['#FF4444', '#FF6B6B', '#FFA500'];
            for (let i = 0; i < 12; i++) {  // 25개 → 12개로 감소
                addParticle(monster.x + monster.width / 2, monster.y + monster.height / 2, colors[Math.floor(Math.random() * colors.length)], 'normal');
            }
        }
    });

    // 포션 충돌
    potions.forEach(potion => {
        if (!potion.collected && potion.checkCollision(player.x, player.y, player.width, player.height)) {
            potion.collected = true;
            gainEnergy();
            addScore(30); // 포션 수집 +30점

            // 파티클 효과 (파티클 제한 적용)
            const colors = ['#FF69B4', '#FFB6C1', '#FF1493'];
            for (let i = 0; i < 15; i++) {  // 30개 → 15개로 감소
                addParticle(potion.x + potion.width / 2, potion.y + potion.height / 2, colors[Math.floor(Math.random() * colors.length)], 'heart');
            }
        }
    });
}

// 에너지 감소
function loseEnergy() {
    gameState.energy = Math.max(0, gameState.energy - 1);
    updateEnergyDisplay();

    if (gameState.energy <= 0) {
        gameOver();
    }
}

// 에너지 증가
function gainEnergy() {
    gameState.energy = Math.min(gameState.maxEnergy, gameState.energy + 1);
    updateEnergyDisplay();
}

// 에너지 표시 업데이트
function updateEnergyDisplay() {
    const hpBarFill = document.getElementById('hpBarFill');
    const hpText = document.getElementById('hpText');

    if (!hpBarFill || !hpText) return;

    const percentage = (gameState.energy / gameState.maxEnergy) * 100;
    hpBarFill.style.width = percentage + '%';

    // HP에 따라 색상 변경
    if (percentage > 50) {
        hpBarFill.style.background = 'linear-gradient(to right, #4CAF50, #8BC34A)'; // Green
    } else if (percentage > 25) {
        hpBarFill.style.background = 'linear-gradient(to right, #FFA500, #FFD700)'; // Orange
    } else {
        hpBarFill.style.background = 'linear-gradient(to right, #FF0000, #FF6B6B)'; // Red
    }

    hpText.textContent = `HP: ${gameState.energy}/${gameState.maxEnergy}`;
}

// 점수 업데이트
function updateScoreDisplay() {
    const scoreElement = document.getElementById('playerScore');
    if (scoreElement) {
        scoreElement.textContent = `⭐ 점수: ${gameState.score}`;
    }
}

// 점수 추가
function addScore(points) {
    gameState.score += points;
    updateScoreDisplay();
}

// UI 업데이트
function updateUI() {
    const stageDisplay = document.getElementById('stageDisplay');
    const wordDisplay = document.getElementById('targetWord');
    const collectedDisplay = document.getElementById('collectedLetters');
    const wordProgress = document.getElementById('wordProgress');

    if (stageDisplay) {
        stageDisplay.textContent = `Stage ${gameState.currentStage}/${gameState.maxStage}`;
    }

    // 모드에 따라 wordProgress 위치 변경
    if (wordProgress) {
        wordProgress.classList.remove('quiz-mode', 'boss-mode');
        if (gameState.mode === GAME_MODE.QUIZ) {
            wordProgress.classList.add('quiz-mode');
            console.log('Quiz mode - class added to wordProgress');
        } else if (gameState.mode === GAME_MODE.BOSS) {
            wordProgress.classList.add('boss-mode');
            console.log('Boss mode - class added to wordProgress');
        }
    }

    // 모바일 버튼 업데이트
    updateActionButtons();

    if (gameState.mode === GAME_MODE.COLLECTING) {
        wordDisplay.textContent = '목표: ' + currentStageData.word;

        // 각 알파벳을 표시하되, 수집한 것은 초록색으로 표시 (중복 고려)
        let displayText = '';
        const wordArray = currentStageData.word.split('');
        const collectedCopy = [...currentStageData.collectedLetters];

        for (let char of wordArray) {
            const index = collectedCopy.indexOf(char);
            if (index !== -1) {
                // 수집한 알파벳 (초록색)
                displayText += `<span style="color: #00FF00; font-weight: bold;">${char}</span>`;
                collectedCopy.splice(index, 1); // 사용한 것 제거
            } else {
                // 아직 수집 안 한 알파벳 (회색)
                displayText += `<span style="color: #888888;">${char}</span>`;
            }
        }
        collectedDisplay.innerHTML = '수집: ' + displayText;
    } else if (gameState.mode === GAME_MODE.QUIZ) {
        wordDisplay.textContent = currentStageData.word + '의 뜻은?';
        collectedDisplay.textContent = '버튼으로 공 발사!';
    } else if (gameState.mode === GAME_MODE.BOSS) {
        wordDisplay.textContent = '보스전!';
        collectedDisplay.textContent = '공을 쳐서 보스를 공격!';
    }
}

// 오브젝트 스폰 관리
let spawnTimer = 0;
function manageSpawning() {
    if (gameState.mode !== GAME_MODE.COLLECTING) return;

    spawnTimer++;

    // 몬스터 스폰 빈도 증가 (180 -> 90, 2배 증가)
    if (spawnTimer % 30 === 0) {
        spawnMonster();
    }

    // 포션 스폰 빈도 증가 (800 -> 600, 난이도 쉽게)
    if (spawnTimer % 600 === 0) {
        spawnPotion();
    }
}

// 게임 승리 - 엔딩으로 연결!
function gameWin() {
    gameState.isRunning = false;
    // 엔딩 시퀀스 시작!
    showEnding();
}

// 게임 오버
function gameOver() {
    gameState.isRunning = false;

    // 모바일 컨트롤 숨기기 (게임 오버 시)
    hideMobileControls();

    const gameOverDiv = document.getElementById('gameOver');
    gameOverDiv.classList.remove('success');
    gameOverDiv.querySelector('h2').textContent = '게임 오버!';
    document.getElementById('gameOverMessage').textContent = `스테이지 ${gameState.currentStage}까지 클리어!`;
    gameOverDiv.style.display = 'block';
}

// 게임 루프
function gameLoop() {
    if (!gameState.isRunning) {
        gameState.gameLoopRunning = false;
        return;
    }

    // 글로우 효과 카운터 업데이트 (Date.now() 대신)
    glowPhaseCounter += 0.004;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 배경 그리기 (스케일 적용 전 - 전체 화면 유지)
    drawBackground();

    // 전역 스케일 적용 - 모든 게임 요소를 50% 크기로 축소 (중앙 정렬)
    ctx.save();

    // 스케일로 인한 오프셋 계산 (중앙 배치)
    const offsetX = (canvas.width * (1 - GAME_SCALE)) / 2;
    const offsetY = (canvas.height * (1 - GAME_SCALE)) / 2;

    ctx.translate(offsetX, offsetY);
    ctx.scale(GAME_SCALE, GAME_SCALE);

    if (gameState.mode === GAME_MODE.COLLECTING) {
        // 수집 모드
        if (!dialogueState.active) {
            updatePlayer();

            // 신검 연속 발사 처리
            if (swordCooldown > 0) {
                swordCooldown--;
            }

            if ((spacePressed || swordBtnPressed) && swordCooldown <= 0) {
                fireWeapon();
                swordCooldown = SWORD_COOLDOWN_MAX;
            }
        }
        drawPlayer();

        // 신검 업데이트 및 그리기
        if (!dialogueState.active) {
            const newSwords = []; // 분열된 신검들을 모을 배열
            divineSwords = divineSwords.filter(sword => {
                const splitSwords = sword.update();
                if (splitSwords && splitSwords.length > 0) {
                    newSwords.push(...splitSwords);
                }
                sword.draw();
                return sword.active;
            });
            divineSwords.push(...newSwords); // 분열된 신검들 추가

            // 토네이도 업데이트 및 그리기
            const newTornados = [];
            tornados = tornados.filter(tornado => {
                const splitTornados = tornado.update();
                if (splitTornados && splitTornados.length > 0) {
                    newTornados.push(...splitTornados);
                }
                tornado.draw();
                return !tornado.toRemove;
            });
            tornados.push(...newTornados);

            // 번개체인 업데이트 및 그리기
            lightningChains = lightningChains.filter(chain => {
                chain.update();
                chain.draw();
                return chain.active;
            });

            // 무기 쿨다운 업데이트
            if (divineSwordCooldown > 0) divineSwordCooldown--;
            if (tornadoCooldown > 0) tornadoCooldown--;
            if (lightningChainCooldown > 0) lightningChainCooldown--;

            // 세은이 무기 애니메이션
            if (player.showWeapon && currentCharacter === 1) {
                if (player.weaponTimer > 0) {
                    player.weaponTimer--;
                    // 천천히 휘두르기
                    player.weaponAngle += 0.08;
                } else {
                    // 타이머 종료 시 빠르게 휘두르기
                    player.weaponAngle += 0.3;
                    if (player.weaponAngle >= 0) {  // 3시 방향까지 휘두르기 (4시 근처)
                        player.showWeapon = false;
                        player.animation = 'idle';  // 애니메이션을 idle로 복귀
                        player.weaponAngle = 0;
                        player.weaponTimer = 0;
                    }
                }
            } else if (currentCharacter === 1 && player.animation === 'casting') {
                // 무기 애니메이션이 중단되었는데 casting 상태에 갇힌 경우 강제 리셋
                player.animation = 'idle';
                player.showWeapon = false;
                player.weaponAngle = 0;
                player.weaponTimer = 0;
            }

            // 하린이 무기 애니메이션
            if (player.showWeapon && currentCharacter === 2) {
                if (player.weaponTimer > 0) {
                    player.weaponTimer--;
                    // 천천히 휘두르기
                    player.weaponAngle += 0.08;
                } else {
                    // 타이머 종료 시 빠르게 휘두르기
                    player.weaponAngle += 0.3;
                    if (player.weaponAngle >= 0) {  // 3시 방향까지 휘두르기
                        player.showWeapon = false;
                        player.animation = 'idle';  // 애니메이션을 idle로 복귀
                        player.weaponAngle = 0;
                        player.weaponTimer = 0;
                    }
                }
            } else if (currentCharacter === 2 && player.animation === 'casting') {
                // 무기 애니메이션이 중단되었는데 casting 상태에 갇힌 경우 강제 리셋
                player.animation = 'idle';
                player.showWeapon = false;
                player.weaponAngle = 0;
                player.weaponTimer = 0;
            }
        } else {
            // 대화 중에도 신검, 토네이도, 번개체인 그리기
            divineSwords.forEach(sword => sword.draw());
            tornados.forEach(tornado => tornado.draw());
            lightningChains.forEach(chain => chain.draw());
        }

        if (!dialogueState.active) {
            letters = letters.filter(letter => {
                letter.update();
                if (!letter.collected) letter.draw();
                return letter.x > -letter.width && !letter.collected;
            });

            // 카드가 모두 사라졌으면 자동으로 다시 생성
            const neededLetters = currentStageData.word.split('').filter(char => {
                const needed = currentStageData.word.split('').filter(c => c === char).length;
                const collected = currentStageData.collectedLetters.filter(c => c === char).length;
                return collected < needed;
            });
            if (letters.length === 0 && neededLetters.length > 0) {
                spawnNextLetter();
            }

            monsters = monsters.filter(monster => {
                monster.update();
                monster.draw();
                return monster.x > -monster.width;
            });

            potions = potions.filter(potion => {
                potion.update();
                if (!potion.collected) potion.draw();
                return potion.x > -potion.width && !potion.collected;
            });

            checkCollisions();
            manageSpawning();
        } else {
            // 대화 중에도 배경 오브젝트는 움직임
            letters = letters.filter(letter => {
                letter.update();
                if (!letter.collected) letter.draw();
                return letter.x > -letter.width && !letter.collected;
            });
            monsters = monsters.filter(monster => {
                monster.update();
                monster.draw();
                return monster.x > -monster.width;
            });
            potions = potions.filter(potion => {
                potion.update();
                if (!potion.collected) potion.draw();
                return potion.x > -potion.width && !potion.collected;
            });
        }

    } else if (gameState.mode === GAME_MODE.QUIZ) {
        // 퀴즈 모드
        // 지율이 위아래 이동
        if (!dialogueState.active) {
            updateJiyulQuiz();

            // 탁구공 연속 발사 처리 (퀴즈 모드)
            if (swordCooldown > 0) {
                swordCooldown--;
            }

            if ((spacePressed || ballBtnPressed) && !ball.active && swordCooldown <= 0) {
                launchBall();
                swordCooldown = SWORD_COOLDOWN_MAX;
            }
        }

        // 지율이가 라켓을 든 모습
        drawJiyulWithPaddle();

        // 퀴즈 선택지 (선택된 것 강조)
        quizChoices.forEach((choice, index) => {
            if (!dialogueState.active) {
                choice.update();
            }
            choice.draw();

            // 현재 선택된 선택지 강조
            if (index === jiyulQuizY) {
                ctx.save();
                ctx.strokeStyle = '#FFD700';
                ctx.lineWidth = 4;
                ctx.strokeRect(choice.x - 5, choice.y - 5, choice.width + 10, choice.height + 10);
                ctx.restore();
            }
        });

        // 공
        if (ball) {
            if (!dialogueState.active) {
                ball.update();
            }
            ball.draw();
        }

    } else if (gameState.mode === GAME_MODE.BOSS) {
        // 보스 모드
        // 플레이어 자유롭게 움직임
        if (!dialogueState.active) {
            updatePlayer();

            // 탁구공 연속 발사 처리 (보스 모드)
            if (swordCooldown > 0) {
                swordCooldown--;
            }

            if ((spacePressed || ballBtnPressed) && ball && !ball.active && swordCooldown <= 0) {
                launchBall();
                swordCooldown = SWORD_COOLDOWN_MAX;
            }
        }

        // 지율이가 라켓을 든 모습
        drawJiyulWithPaddle();

        // 보스
        if (boss) {
            if (!dialogueState.active) {
                boss.update();
            }
            boss.draw();
        }

        // 공
        if (ball) {
            if (!dialogueState.active) {
                ball.update();
            }
            ball.draw();
        }

        // 보스 공격
        if (!dialogueState.active) {
            bossBalls = bossBalls.filter(bball => {
                const shouldRemove = bball.update();
                if (!shouldRemove) bball.draw();
                return !shouldRemove;
            });
        } else {
            // 대화 중에는 그리기만
            bossBalls.forEach(bball => bball.draw());
        }
    }

    // 파티클 업데이트 (대화 중이 아닐 때만)
    if (!dialogueState.active) {
        particles = particles.filter(particle => {
            particle.update();
            particle.draw();
            return particle.life > 0;
        });
    } else {
        // 대화 중에도 파티클은 그리기만 함
        particles.forEach(particle => {
            particle.draw();
        });
    }

    // 전역 스케일 복원
    ctx.restore();

    // 대화 그리기 (최상위, 스케일 밖에서 - 전체 화면 너비)
    drawDialogue();

    requestAnimationFrame(gameLoop);
}

// 페이지 로드 시 오프닝 타이틀 화면 표시
window.addEventListener('DOMContentLoaded', () => {
    // 모바일 컨트롤 숨기기
    hideMobileControls();

    // opening.js의 타이틀 화면 표시
    if (typeof showTitleScreen === 'function') {
        showTitleScreen();
    }

    // 캔버스 터치/클릭 이벤트로 대화 진행 (모바일 지원)
    canvas.addEventListener('touchstart', (e) => {
        // 대화 중이면 다음 대화로 진행
        if (dialogueState.active) {
            e.preventDefault();
            advanceDialogue();
        }
    });

    canvas.addEventListener('click', (e) => {
        // 대화 중이면 다음 대화로 진행 (PC에서 클릭으로도 가능)
        if (dialogueState.active) {
            advanceDialogue();
        }
    });
});

// 오프닝 보여주기 (애니메이션) - 더 이상 사용하지 않음 (opening.js에서 직접 처리)
function showOpening() {
    // 캔버스 표시
    const canvas = document.getElementById('gameCanvas');
    canvas.style.display = 'block';

    // 모바일 컨트롤 숨기기 (오프닝 중에는 안 보이게)
    hideMobileControls();

    // fallback: 스토리 애니메이션
    if (storyScene) {
        storyScene.startOpening(() => {
            startGame();
        });
    } else {
        startDialogue(OPENING_DIALOGUE, () => {
            startGame();
        });
    }
}

// 캐릭터 전환 함수
function switchCharacter() {
    // 현재 캐릭터의 체력 저장
    characterEnergies[currentCharacter] = gameState.energy;

    // 다음 캐릭터로 전환
    currentCharacter = (currentCharacter + 1) % characters.length;
    player.sprite = characters[currentCharacter];

    // 새 캐릭터의 체력 복원
    gameState.energy = characterEnergies[currentCharacter];
    updateEnergyDisplay();

    // 플레이어 이름 업데이트
    const playerNameElement = document.getElementById('playerName');
    if (playerNameElement) {
        playerNameElement.textContent = '👤 ' + characterNames[currentCharacter];
    }

    // 애니메이션 및 무기 상태 완전 초기화 (중요: 각 캐릭터가 가진 애니메이션이 다를 수 있음)
    player.animation = 'idle';
    player.frameIndex = 0;
    player.frameCounter = 0;
    player.showWeapon = false;  // 무기도 초기화
    player.weaponAngle = 0;     // 무기 각도 초기화
    player.weaponTimer = 0;     // 무기 타이머 초기화

    // 캐릭터 전환 효과 (파티클 제한 적용)
    for (let i = 0; i < 12; i++) {  // 20개 → 12개로 감소
        addParticle(
            player.x + player.width / 2,
            player.y + player.height / 2,
            currentCharacter === 0 ? '#FF69B4' : (currentCharacter === 1 ? '#9370DB' : '#BA55D3'),
            'star'
        );
    }

    // 버튼 텍스트 업데이트
    const characterBtn = document.getElementById('characterBtn');
    if (characterBtn) {
        const btnLabel = characterBtn.querySelector('.btn-label');
        if (btnLabel) {
            btnLabel.textContent = '캐릭터 체인지';
        }
    }
}

// 무기 발사 함수
function fireWeapon() {
    if (currentCharacter === 0) {
        // 지율 - 신검 발사
        fireDivineSword();
    } else if (currentCharacter === 1) {
        // 세은 - 토네이도 발사
        fireTornado();
    } else if (currentCharacter === 2) {
        // 하린 - 번개체인 발사
        fireLightningChain();
    }
}

// 신검 발사
function fireDivineSword() {
    if (divineSwordCooldown > 0) return;

    // 3개의 신검을 다른 각도로 발사
    const angles = [
        -Math.PI / 6,  // -30도
        0,             // 0도
        Math.PI / 6    // 30도
    ];

    angles.forEach(offset => {
        const sword = new DivineSword(
            player.x + player.width,
            player.y + player.height / 2,
            offset,
            0  // depth 0 (첫 발사)
        );
        divineSwords.push(sword);
    });

    divineSwordCooldown = 60;  // 1초 쿨다운
    jiyulSmashing = true;
    smashTimer = 15;

    // 발사 효과 파티클 (파티클 제한 적용)
    for (let i = 0; i < 8; i++) {  // 10개 → 8개로 감소
        addParticle(
            player.x + player.width,
            player.y + player.height / 2,
            '#FFD700',
            'star'
        );
    }
}

// 토네이도 발사
function fireTornado() {
    if (tornadoCooldown > 0) return;

    // 토네이도 1개 발사 (직진 후 0.3초 뒤 3개로 분열)
    const tornado = new Tornado(
        player.x + player.width,
        player.y + player.height / 2,
        0,  // 오른쪽 방향 (직진)
        0   // depth 0 (원본)
    );
    tornados.push(tornado);

    tornadoCooldown = 60;  // 1초 쿨다운

    // 무기 표시
    player.showWeapon = true;
    player.weaponAngle = -Math.PI / 2;  // 12시 방향에서 시작
    player.weaponTimer = 30;  // 30프레임 동안 유지
    player.animation = 'casting';  // 캐스팅 애니메이션으로 변경
    player.frameIndex = 0;

    // 발사 효과 (파티클 개수 제한 적용)
    const particlesToAdd = Math.min(40, MAX_PARTICLES - particles.length);
    const circleCount = Math.floor(particlesToAdd * 0.625);  // 25/40
    const starCount = particlesToAdd - circleCount;  // 15/40

    for (let i = 0; i < circleCount; i++) {
        particles.push(new Particle(
            player.x + player.width,
            player.y + player.height / 2,
            '#87CEEB',
            'circle'
        ));
    }

    // 추가 발사 이펙트
    for (let i = 0; i < starCount; i++) {
        particles.push(new Particle(
            player.x + player.width,
            player.y + player.height / 2,
            '#00CED1',
            'star'
        ));
    }
}

// 번개체인 발사
function fireLightningChain() {
    if (lightningChainCooldown > 0) return;

    // 번개체인 생성 (플레이어 위치에서 시작)
    const chain = new LightningChain(
        player.x + player.width,
        player.y + player.height / 2
    );
    lightningChains.push(chain);

    lightningChainCooldown = 60;  // 1초 쿨다운

    // 무기 표시
    player.showWeapon = true;
    player.weaponAngle = -Math.PI / 2;  // 12시 방향에서 시작
    player.weaponTimer = 30;  // 30프레임 동안 유지
    player.animation = 'casting';  // 캐스팅 애니메이션으로 변경
    player.frameIndex = 0;

    // 발사 효과 (파티클 개수 제한 적용)
    const particlesToAdd = Math.min(25, MAX_PARTICLES - particles.length);
    for (let i = 0; i < particlesToAdd; i++) {
        particles.push(new Particle(
            player.x + player.width,
            player.y + player.height / 2,
            Math.random() > 0.5 ? '#FFD700' : '#FFFFFF',
            'star'
        ));
    }
}

// 청룡언월도 그리기 함수 (지율 신검 스타일 + 케데헌 미라 날)
function drawGreenDragonBlade(x, y, angle) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    // 강력한 글로우 효과 (펄스 애니메이션) - 프레임 카운터 사용으로 최적화
    const dynamicGlowSize = 45 + Math.sin(glowPhaseCounter) * 8;
    const outerGlowSize = 60 + Math.sin(glowPhaseCounter * 1.3) * 10;

    // 외부 글로우 (케데헌 미라 오라)
    const outerGlow = ctx.createRadialGradient(20, 0, 0, 20, 0, outerGlowSize);
    outerGlow.addColorStop(0, 'rgba(255, 0, 255, 0.4)');      // 마젠타
    outerGlow.addColorStop(0.3, 'rgba(148, 0, 211, 0.3)');    // 다크바이올렛
    outerGlow.addColorStop(0.6, 'rgba(138, 43, 226, 0.2)');   // 블루바이올렛
    outerGlow.addColorStop(1, 'rgba(75, 0, 130, 0)');         // 투명
    ctx.fillStyle = outerGlow;
    ctx.beginPath();
    ctx.arc(20, 0, outerGlowSize, 0, Math.PI * 2);
    ctx.fill();

    // 내부 글로우 (강렬한 빛)
    const innerGlow = ctx.createRadialGradient(20, 0, 0, 20, 0, dynamicGlowSize);
    innerGlow.addColorStop(0, 'rgba(255, 255, 255, 0.8)');    // 백색
    innerGlow.addColorStop(0.2, 'rgba(218, 112, 214, 0.7)');  // 오키드
    innerGlow.addColorStop(0.5, 'rgba(186, 85, 211, 0.5)');   // 미디엄오키드
    innerGlow.addColorStop(1, 'rgba(148, 0, 211, 0)');        // 투명
    ctx.fillStyle = innerGlow;
    ctx.beginPath();
    ctx.arc(20, 0, dynamicGlowSize, 0, Math.PI * 2);
    ctx.fill();

    // 창대 (더 굵고 화려한 금색)
    const handleGradient = ctx.createLinearGradient(-90, 0, 0, 0);
    handleGradient.addColorStop(0, '#B8860B');      // 다크골드
    handleGradient.addColorStop(0.2, '#FFD700');    // 골드
    handleGradient.addColorStop(0.4, '#FFA500');    // 오렌지골드
    handleGradient.addColorStop(0.6, '#FFD700');    // 골드
    handleGradient.addColorStop(0.8, '#FFA500');    // 오렌지골드
    handleGradient.addColorStop(1, '#FFD700');      // 골드
    ctx.fillStyle = handleGradient;
    ctx.shadowColor = '#FFD700';
    ctx.shadowBlur = 15;
    ctx.fillRect(-90, -4, 90, 8);

    // 창대 테두리
    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = 1;
    ctx.shadowBlur = 0;
    ctx.strokeRect(-90, -4, 90, 8);

    // 창날 본체 (더 크고 날카로운 지율 신검 스타일 + 케데헌 미라 컬러)
    const spearGradient = ctx.createLinearGradient(0, -10, 60, 10);
    spearGradient.addColorStop(0, '#FFD700');                  // 금색
    spearGradient.addColorStop(0.15, '#DA70D6');               // 오키드
    spearGradient.addColorStop(0.3, '#FFFFFF');                // 백색 (빛나는)
    spearGradient.addColorStop(0.5, '#EE82EE');                // 바이올렛
    spearGradient.addColorStop(0.7, '#BA55D3');                // 미디엄오키드
    spearGradient.addColorStop(0.85, '#9932CC');               // 다크오키드
    spearGradient.addColorStop(1, 'rgba(138, 43, 226, 0.3)');  // 반투명

    ctx.fillStyle = spearGradient;
    ctx.shadowColor = '#FF00FF';
    ctx.shadowBlur = 25;

    // 창날 본체 그리기 (더 길고 날카롭게)
    ctx.beginPath();
    ctx.moveTo(0, -10);  // 창대 끝 (더 굵게)
    ctx.lineTo(45, -6);  // 위쪽 날
    ctx.lineTo(60, 0);   // 뾰족한 끝 (더 길게)
    ctx.lineTo(45, 6);   // 아래쪽 날
    ctx.lineTo(0, 10);   // 창대 끝
    ctx.closePath();
    ctx.fill();

    // 창날 이중 테두리 (빛나는 효과)
    ctx.strokeStyle = '#FF00FF';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#FF00FF';
    ctx.shadowBlur = 15;
    ctx.stroke();

    // 내부 빛나는 선
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 1;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(5, -7);
    ctx.lineTo(43, -4);
    ctx.lineTo(57, 0);
    ctx.lineTo(43, 4);
    ctx.lineTo(5, 7);
    ctx.stroke();

    // 케데헌 미라 스타일 초승달 날 (더 크고 화려하게)
    const bladeGradient = ctx.createRadialGradient(50, 0, 5, 50, 0, 25);
    bladeGradient.addColorStop(0, '#FFFFFF');                  // 백색 중심
    bladeGradient.addColorStop(0.3, '#DA70D6');                // 오키드
    bladeGradient.addColorStop(0.6, '#BA55D3');                // 미디엄오키드
    bladeGradient.addColorStop(0.8, '#9932CC');                // 다크오키드
    bladeGradient.addColorStop(1, 'rgba(138, 43, 226, 0.6)');  // 반투명

    ctx.fillStyle = bladeGradient;
    ctx.shadowColor = '#BA55D3';
    ctx.shadowBlur = 20;

    // 위쪽 초승달 날 (더 크고 곡선미 있게)
    ctx.beginPath();
    ctx.moveTo(45, -6);
    ctx.quadraticCurveTo(53, -22, 65, -15);
    ctx.quadraticCurveTo(68, -10, 60, 0);
    ctx.lineTo(45, -6);
    ctx.closePath();
    ctx.fill();

    // 아래쪽 초승달 날 (대칭)
    ctx.beginPath();
    ctx.moveTo(45, 6);
    ctx.quadraticCurveTo(53, 22, 65, 15);
    ctx.quadraticCurveTo(68, 10, 60, 0);
    ctx.lineTo(45, 6);
    ctx.closePath();
    ctx.fill();

    // 초승달 날 이중 테두리
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1.5;
    ctx.shadowColor = '#FFFFFF';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.moveTo(45, -6);
    ctx.quadraticCurveTo(53, -22, 65, -15);
    ctx.quadraticCurveTo(68, -10, 60, 0);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(45, 6);
    ctx.quadraticCurveTo(53, 22, 65, 15);
    ctx.quadraticCurveTo(68, 10, 60, 0);
    ctx.stroke();

    // 외부 마젠타 테두리
    ctx.strokeStyle = '#FF00FF';
    ctx.lineWidth = 0.8;
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(45, -6);
    ctx.quadraticCurveTo(53, -22, 65, -15);
    ctx.quadraticCurveTo(68, -10, 60, 0);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(45, 6);
    ctx.quadraticCurveTo(53, 22, 65, 15);
    ctx.quadraticCurveTo(68, 10, 60, 0);
    ctx.stroke();

    // 중앙선 (강렬한 빛의 선)
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#FFFFFF';
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.moveTo(5, 0);
    ctx.lineTo(58, 0);
    ctx.stroke();

    // 중앙선 마젠타 오라
    ctx.strokeStyle = '#FF00FF';
    ctx.lineWidth = 5;
    ctx.globalAlpha = 0.3;
    ctx.shadowBlur = 25;
    ctx.stroke();
    ctx.globalAlpha = 1.0;

    // 중앙 용의 눈 보석 (더 크고 화려하게)
    const gemGradient = ctx.createRadialGradient(30, 0, 0, 30, 0, 7);
    gemGradient.addColorStop(0, '#FFFFFF');
    gemGradient.addColorStop(0.2, '#FFE6FF');
    gemGradient.addColorStop(0.4, '#FF00FF');
    gemGradient.addColorStop(0.6, '#BA55D3');
    gemGradient.addColorStop(0.8, '#8B008B');
    gemGradient.addColorStop(1, '#4B0082');
    ctx.fillStyle = gemGradient;
    ctx.shadowColor = '#FF00FF';
    ctx.shadowBlur = 25;
    ctx.beginPath();
    ctx.arc(30, 0, 7, 0, Math.PI * 2);
    ctx.fill();

    // 보석 금테두리
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 1.5;
    ctx.shadowColor = '#FFD700';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(30, 0, 8, 0, Math.PI * 2);
    ctx.stroke();

    // 보석 빛나는 효과
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.6;
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(30, 0, 9, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1.0;

    // 창대 장식 (더 화려하게)
    for (let i = 0; i < 4; i++) {
        const decorX = -15 - i * 18;

        // 장식 구슬 외부 글로우
        const decorOuterGlow = ctx.createRadialGradient(decorX, 0, 0, decorX, 0, 6);
        decorOuterGlow.addColorStop(0, 'rgba(255, 0, 255, 0.5)');
        decorOuterGlow.addColorStop(1, 'rgba(255, 0, 255, 0)');
        ctx.fillStyle = decorOuterGlow;
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.arc(decorX, 0, 6, 0, Math.PI * 2);
        ctx.fill();

        // 장식 구슬 본체
        const decorGradient = ctx.createRadialGradient(decorX, 0, 0, decorX, 0, 4);
        decorGradient.addColorStop(0, '#FFFFFF');
        decorGradient.addColorStop(0.3, '#FFE6FF');
        decorGradient.addColorStop(0.6, '#DA70D6');
        decorGradient.addColorStop(1, '#9370DB');
        ctx.fillStyle = decorGradient;
        ctx.shadowColor = '#DA70D6';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(decorX, 0, 4, 0, Math.PI * 2);
        ctx.fill();

        // 장식 금테두리
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 1;
        ctx.shadowBlur = 5;
        ctx.beginPath();
        ctx.arc(decorX, 0, 4.5, 0, Math.PI * 2);
        ctx.stroke();
    }

    // 번개 효과 (랜덤하게 나타나는 케데헌 미라의 힘)
    if (Math.random() < 0.15) {
        ctx.strokeStyle = '#FF00FF';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#FF00FF';
        ctx.shadowBlur = 20;
        ctx.globalAlpha = 0.7;
        ctx.beginPath();
        ctx.moveTo(10, -8);
        ctx.lineTo(15, -5);
        ctx.lineTo(12, -2);
        ctx.lineTo(20, 2);
        ctx.lineTo(17, 5);
        ctx.lineTo(25, 8);
        ctx.stroke();
        ctx.globalAlpha = 1.0;
    }

    ctx.restore();
}

// 케데헌 루미 보라색 사인검 그리기 함수 (지율/세은 검 스타일 + 보라색 테마)
function drawLightningSword(x, y, angle) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    // 강력한 보라색 글로우 효과 (펄스 애니메이션)
    const glowPhase = Date.now() * 0.004;
    const dynamicGlowSize = 45 + Math.sin(glowPhase) * 8;
    const outerGlowSize = 60 + Math.sin(glowPhase * 1.3) * 10;

    // 외부 글로우 (케데헌 루미 오라)
    const outerGlow = ctx.createRadialGradient(20, 0, 0, 20, 0, outerGlowSize);
    outerGlow.addColorStop(0, 'rgba(138, 43, 226, 0.4)');     // 블루바이올렛
    outerGlow.addColorStop(0.3, 'rgba(148, 0, 211, 0.3)');    // 다크바이올렛
    outerGlow.addColorStop(0.6, 'rgba(128, 0, 128, 0.2)');    // 퍼플
    outerGlow.addColorStop(1, 'rgba(75, 0, 130, 0)');         // 투명
    ctx.fillStyle = outerGlow;
    ctx.beginPath();
    ctx.arc(20, 0, outerGlowSize, 0, Math.PI * 2);
    ctx.fill();

    // 내부 글로우 (강렬한 빛)
    const innerGlow = ctx.createRadialGradient(20, 0, 0, 20, 0, dynamicGlowSize);
    innerGlow.addColorStop(0, 'rgba(255, 255, 255, 0.8)');    // 백색
    innerGlow.addColorStop(0.2, 'rgba(218, 112, 214, 0.7)');  // 오키드
    innerGlow.addColorStop(0.5, 'rgba(186, 85, 211, 0.5)');   // 미디엄오키드
    innerGlow.addColorStop(1, 'rgba(148, 0, 211, 0)');        // 투명
    ctx.fillStyle = innerGlow;
    ctx.beginPath();
    ctx.arc(20, 0, dynamicGlowSize, 0, Math.PI * 2);
    ctx.fill();

    // 검 손잡이 (짧고 화려한 금색)
    const handleGradient = ctx.createLinearGradient(-30, 0, 0, 0);
    handleGradient.addColorStop(0, '#B8860B');      // 다크골드
    handleGradient.addColorStop(0.2, '#FFD700');    // 골드
    handleGradient.addColorStop(0.4, '#FFA500');    // 오렌지골드
    handleGradient.addColorStop(0.6, '#FFD700');    // 골드
    handleGradient.addColorStop(0.8, '#FFA500');    // 오렌지골드
    handleGradient.addColorStop(1, '#FFD700');      // 골드
    ctx.fillStyle = handleGradient;
    ctx.shadowColor = '#FFD700';
    ctx.shadowBlur = 15;
    ctx.fillRect(-30, -4, 30, 8);

    // 손잡이 테두리
    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = 1;
    ctx.shadowBlur = 0;
    ctx.strokeRect(-30, -4, 30, 8);

    // 검날 본체 (더 크고 날카로운 지율 신검 스타일 + 케데헌 루미 보라색)
    const spearGradient = ctx.createLinearGradient(0, -10, 60, 10);
    spearGradient.addColorStop(0, '#FFD700');                  // 금색
    spearGradient.addColorStop(0.15, '#DA70D6');               // 오키드
    spearGradient.addColorStop(0.3, '#FFFFFF');                // 백색 (빛나는)
    spearGradient.addColorStop(0.5, '#EE82EE');                // 바이올렛
    spearGradient.addColorStop(0.7, '#BA55D3');                // 미디엄오키드
    spearGradient.addColorStop(0.85, '#9932CC');               // 다크오키드
    spearGradient.addColorStop(1, 'rgba(138, 43, 226, 0.3)');  // 반투명

    ctx.fillStyle = spearGradient;
    ctx.shadowColor = '#BA55D3';
    ctx.shadowBlur = 25;

    // 검날 본체 그리기 (더 길고 날카롭게)
    ctx.beginPath();
    ctx.moveTo(0, -10);  // 손잡이 끝 (더 굵게)
    ctx.lineTo(45, -6);  // 위쪽 날
    ctx.lineTo(60, 0);   // 뾰족한 끝 (더 길게)
    ctx.lineTo(45, 6);   // 아래쪽 날
    ctx.lineTo(0, 10);   // 손잡이 끝
    ctx.closePath();
    ctx.fill();

    // 검날 이중 테두리 (빛나는 효과)
    ctx.strokeStyle = '#BA55D3';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#BA55D3';
    ctx.shadowBlur = 15;
    ctx.stroke();

    // 내부 빛나는 선
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 1;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(5, -7);
    ctx.lineTo(43, -4);
    ctx.lineTo(73, 0);
    ctx.lineTo(43, 4);
    ctx.lineTo(5, 7);
    ctx.stroke();

    // 케데헌 루미 스타일 사인검 날 (뾰족하고 날카롭게)
    const bladeGradient = ctx.createRadialGradient(50, 0, 5, 50, 0, 25);
    bladeGradient.addColorStop(0, '#FFFFFF');                  // 백색 중심
    bladeGradient.addColorStop(0.3, '#DA70D6');                // 오키드
    bladeGradient.addColorStop(0.6, '#BA55D3');                // 미디엄오키드
    bladeGradient.addColorStop(0.8, '#9932CC');                // 다크오키드
    bladeGradient.addColorStop(1, 'rgba(138, 43, 226, 0.6)');  // 반투명

    ctx.fillStyle = bladeGradient;
    ctx.shadowColor = '#BA55D3';
    ctx.shadowBlur = 20;

    // 위쪽 사인검 날 (뾰족하고 날카롭게)
    ctx.beginPath();
    ctx.moveTo(45, -5);
    ctx.quadraticCurveTo(58, -14, 73, -6);
    ctx.lineTo(76, 0);
    ctx.lineTo(60, 0);
    ctx.lineTo(45, -5);
    ctx.closePath();
    ctx.fill();

    // 아래쪽 사인검 날 (대칭)
    ctx.beginPath();
    ctx.moveTo(45, 5);
    ctx.quadraticCurveTo(58, 14, 73, 6);
    ctx.lineTo(76, 0);
    ctx.lineTo(60, 0);
    ctx.lineTo(45, 5);
    ctx.closePath();
    ctx.fill();

    // 사인검 날 이중 테두리
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1.5;
    ctx.shadowColor = '#FFFFFF';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.moveTo(45, -5);
    ctx.quadraticCurveTo(58, -14, 73, -6);
    ctx.lineTo(76, 0);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(45, 5);
    ctx.quadraticCurveTo(58, 14, 73, 6);
    ctx.lineTo(76, 0);
    ctx.stroke();

    // 외부 보라색 테두리
    ctx.strokeStyle = '#BA55D3';
    ctx.lineWidth = 0.8;
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(45, -5);
    ctx.quadraticCurveTo(58, -14, 73, -6);
    ctx.lineTo(76, 0);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(45, 5);
    ctx.quadraticCurveTo(58, 14, 73, 6);
    ctx.lineTo(76, 0);
    ctx.stroke();

    // 중앙선 (강렬한 빛의 선)
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#FFFFFF';
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.moveTo(5, 0);
    ctx.lineTo(73, 0);
    ctx.stroke();

    // 중앙선 보라색 오라
    ctx.strokeStyle = '#BA55D3';
    ctx.lineWidth = 5;
    ctx.globalAlpha = 0.3;
    ctx.shadowBlur = 25;
    ctx.stroke();
    ctx.globalAlpha = 1.0;

    // 중앙 용의 눈 보석 (더 크고 화려하게)
    const gemGradient = ctx.createRadialGradient(30, 0, 0, 30, 0, 7);
    gemGradient.addColorStop(0, '#FFFFFF');
    gemGradient.addColorStop(0.2, '#FFE6FF');
    gemGradient.addColorStop(0.4, '#BA55D3');
    gemGradient.addColorStop(0.6, '#9932CC');
    gemGradient.addColorStop(0.8, '#8B008B');
    gemGradient.addColorStop(1, '#4B0082');
    ctx.fillStyle = gemGradient;
    ctx.shadowColor = '#BA55D3';
    ctx.shadowBlur = 25;
    ctx.beginPath();
    ctx.arc(30, 0, 7, 0, Math.PI * 2);
    ctx.fill();

    // 보석 금테두리
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 1.5;
    ctx.shadowColor = '#FFD700';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(30, 0, 8, 0, Math.PI * 2);
    ctx.stroke();

    // 보석 빛나는 효과
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.6;
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(30, 0, 9, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1.0;

    // 손잡이 장식 (더 화려하게)
    for (let i = 0; i < 3; i++) {
        const decorX = -8 - i * 8;

        // 장식 구슬 외부 글로우
        const decorOuterGlow = ctx.createRadialGradient(decorX, 0, 0, decorX, 0, 6);
        decorOuterGlow.addColorStop(0, 'rgba(186, 85, 211, 0.5)');
        decorOuterGlow.addColorStop(1, 'rgba(186, 85, 211, 0)');
        ctx.fillStyle = decorOuterGlow;
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.arc(decorX, 0, 6, 0, Math.PI * 2);
        ctx.fill();

        // 장식 구슬 본체
        const decorGradient = ctx.createRadialGradient(decorX, 0, 0, decorX, 0, 4);
        decorGradient.addColorStop(0, '#FFFFFF');
        decorGradient.addColorStop(0.3, '#FFE6FF');
        decorGradient.addColorStop(0.6, '#DA70D6');
        decorGradient.addColorStop(1, '#9370DB');
        ctx.fillStyle = decorGradient;
        ctx.shadowColor = '#DA70D6';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(decorX, 0, 4, 0, Math.PI * 2);
        ctx.fill();

        // 장식 금테두리
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 1;
        ctx.shadowBlur = 5;
        ctx.beginPath();
        ctx.arc(decorX, 0, 4.5, 0, Math.PI * 2);
        ctx.stroke();
    }

    // 보라색 에너지 효과 (랜덤하게 나타나는 케데헌 루미의 힘)
    if (Math.random() < 0.15) {
        ctx.strokeStyle = '#BA55D3';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#BA55D3';
        ctx.shadowBlur = 20;
        ctx.globalAlpha = 0.7;
        ctx.beginPath();
        ctx.moveTo(10, -8);
        ctx.lineTo(15, -5);
        ctx.lineTo(12, -2);
        ctx.lineTo(20, 2);
        ctx.lineTo(17, 5);
        ctx.lineTo(25, 8);
        ctx.stroke();
        ctx.globalAlpha = 1.0;
    }

    ctx.restore();
}

// 게임 시작
function startGame() {
    gameState.isRunning = true;

    // UI 요소 보이기 (게임 플레이 중)
    const wordProgress = document.getElementById('wordProgress');
    if (wordProgress) {
        wordProgress.style.display = 'flex';
    }

    // HP 바 (energyContainer) 보이기
    const ui = document.getElementById('ui');
    if (ui) {
        ui.style.display = 'block';
    }

    // 모바일 컨트롤 보이기 (게임 플레이 중에는 보이게)
    showMobileControls();

    initGame();

    // 게임 루프가 이미 실행 중이 아닐 때만 시작
    if (!gameState.gameLoopRunning) {
        gameState.gameLoopRunning = true;
        gameLoop();
    }
}

// 엔딩 보여주기 (애니메이션)
function showEnding() {
    gameState.isRunning = false;

    // 모바일 컨트롤 숨기기 (엔딩 중에는 안 보이게)
    hideMobileControls();

    // UI 컨테이너들 숨기기
    const ui = document.getElementById('ui');
    const wordProgress = document.getElementById('wordProgress');
    if (ui) ui.style.display = 'none';
    if (wordProgress) wordProgress.style.display = 'none';

    // 스토리 애니메이션 시작
    if (storyScene) {
        storyScene.startEnding(() => {
            // 엔딩 끝나면 해피엔딩 화면
            const gameOverEl = document.getElementById('gameOver');
            gameOverEl.className = 'success';
            gameOverEl.querySelector('h2').textContent = '🎉 HAPPY ENDING! 🎉';
            document.getElementById('gameOverMessage').textContent =
                '🏆 축하합니다! 금메달 획득!\n🏓 지율이는 영어도 잘하고 탁구도 잘하는 선수가 되었습니다!\n영어 제국의 대마왕은 이제 최고의 탁구 코치!';
            gameOverEl.style.display = 'block';
        });
    } else {
        // fallback: 텍스트 대화
        startDialogue(ENDING_DIALOGUE, () => {
            const gameOverEl = document.getElementById('gameOver');
            gameOverEl.className = 'success';
            gameOverEl.querySelector('h2').textContent = '🎉 HAPPY ENDING! 🎉';
            document.getElementById('gameOverMessage').textContent =
                '🏆 축하합니다! 금메달 획득!\n🏓 지율이는 영어도 잘하고 탁구도 잘하는 선수가 되었습니다!\n영어 제국의 대마왕은 이제 최고의 탁구 코치!';
            gameOverEl.style.display = 'block';
        });
    }
}

// 게임 재시작
function restartGame() {
    document.getElementById('gameOver').style.display = 'none';
    gameState.isRunning = true;

    // 모바일 컨트롤 보이기 (게임 재시작 시)
    showMobileControls();

    initGame();

    // 게임 루프가 이미 실행 중이 아닐 때만 시작
    if (!gameState.gameLoopRunning) {
        gameState.gameLoopRunning = true;
        gameLoop();
    }
}

// 초기 플레이어 위치 조정
window.addEventListener('load', () => {
    player.y = canvas.height / 2 - player.height / 2;
});
