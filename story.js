// 스토리 씬 애니메이션 시스템 - 진짜 게임 버전!
class StoryScene {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.currentScene = 0;
        this.animationFrame = 0;
        this.onComplete = null;
        this.skipable = true;
        this.scenes = [];

        // 픽셀 스케일
        this.PIXEL_SCALE = 4;

        // 오프닝/엔딩 시퀀스는 스케일 없이 전체 화면 사용 (게임과 달리 100% 크기)

        // 애니메이션 속도
        this.frameDelay = 0;
        this.maxFrameDelay = 5;

        // 배경 스크롤
        this.bgScroll = 0;

        // 파티클
        this.particles = [];

        // 화면 전환 효과
        this.fadeAlpha = 0;
        this.fadeIn = false;
        this.fadeOut = false;

        // 사용자 입력 대기 상태
        this.waitingForInput = false;
        this.canProceed = false;

        // 이벤트 리스너 추가
        this.setupEventListeners();
    }

    // 이벤트 리스너 설정
    setupEventListeners() {
        // 바인딩된 함수 참조 저장 (나중에 제거하기 위해)
        this.boundHandleClick = (e) => this.handleInput(e);
        this.boundHandleTouch = (e) => {
            e.preventDefault(); // 기본 터치 동작 방지
            this.handleInput(e);
        };

        // 클릭 이벤트 (PC)
        this.canvas.addEventListener('click', this.boundHandleClick);

        // 터치 이벤트 (모바일)
        this.canvas.addEventListener('touchstart', this.boundHandleTouch);
    }

    // 이벤트 리스너 정리
    cleanupEventListeners() {
        if (this.boundHandleClick) {
            this.canvas.removeEventListener('click', this.boundHandleClick);
        }
        if (this.boundHandleTouch) {
            this.canvas.removeEventListener('touchstart', this.boundHandleTouch);
        }
    }

    // 입력 처리
    handleInput(e) {
        if (this.waitingForInput) {
            this.canProceed = true;
        }
    }

    // 픽셀 스프라이트 그리기 (game.js와 동일)
    drawPixelSprite(sprite, colorMap, x, y, scale = this.PIXEL_SCALE, flipH = false) {
        for (let row = 0; row < sprite.length; row++) {
            for (let col = 0; col < sprite[row].length; col++) {
                const pixel = sprite[row][col];
                if (pixel !== 0 && colorMap[pixel]) {
                    this.ctx.fillStyle = colorMap[pixel];
                    if (flipH) {
                        // 좌우 반전
                        this.ctx.fillRect(
                            x + (sprite[row].length - col - 1) * scale,
                            y + row * scale,
                            scale,
                            scale
                        );
                    } else {
                        this.ctx.fillRect(
                            x + col * scale,
                            y + row * scale,
                            scale,
                            scale
                        );
                    }
                }
            }
        }
    }

    // 지율이 캐릭터 그리기
    drawJiyul(x, y, animation = 'idle', frame = 0, scale = 4, flipH = false) {
        const spriteData = pixelData.jiyul;
        let sprite;

        switch(animation) {
            case 'walk':
                sprite = frame % 2 === 0 ? spriteData.walking1 : spriteData.walking2;
                break;
            case 'jump':
                sprite = spriteData.jump;
                break;
            case 'smash':
                sprite = spriteData.smashing;
                break;
            default:
                sprite = spriteData.idle;
        }

        this.drawPixelSprite(sprite, spriteData.colorMap, x, y, scale, flipH);
    }

    // 보스 캐릭터 그리기
    drawBossSprite(bossType, x, y, scale = 4, flipH = false) {
        if (typeof bossSprites !== 'undefined' && bossSprites[bossType]) {
            const boss = bossSprites[bossType];
            this.drawPixelSprite(boss.idle, boss.colorMap, x, y, scale, flipH);
        } else {
            // 폴백: 간단한 보스 그리기
            this.ctx.fillStyle = '#8B008B';
            this.ctx.fillRect(x, y, scale * 16, scale * 16);
        }
    }

    // 알파벳 캐릭터 그리기
    drawAlphabetSprite(letter, x, y, scale = 3) {
        if (typeof alphabetSprites !== 'undefined' && alphabetSprites[letter]) {
            const alphabet = alphabetSprites[letter];
            this.drawPixelSprite(alphabet.sprite, alphabet.colorMap, x, y, scale);
        }
    }

    // 배경 그리기 (하늘)
    drawSkyBackground(color1 = '#87CEEB', color2 = '#E0F6FF') {
        // 전체 캔버스 크기 사용 (스케일 없음)
        const canvasWidth = this.canvas.width;
        const canvasHeight = this.canvas.height;
        const gradient = this.ctx.createLinearGradient(0, 0, 0, canvasHeight);
        gradient.addColorStop(0, color1);
        gradient.addColorStop(1, color2);
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    }

    // 구름 그리기
    drawCloud(x, y, size = 1) {
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        // 구름 몸체
        this.ctx.beginPath();
        this.ctx.arc(x, y, 20 * size, 0, Math.PI * 2);
        this.ctx.arc(x + 25 * size, y, 25 * size, 0, Math.PI * 2);
        this.ctx.arc(x + 50 * size, y, 20 * size, 0, Math.PI * 2);
        this.ctx.arc(x + 15 * size, y - 15 * size, 15 * size, 0, Math.PI * 2);
        this.ctx.arc(x + 35 * size, y - 15 * size, 15 * size, 0, Math.PI * 2);
        this.ctx.fill();
    }

    // 땅 그리기
    drawGround() {
        // 전체 캔버스 크기 사용 (스케일 없음)
        const canvasWidth = this.canvas.width;
        const canvasHeight = this.canvas.height;

        // 잔디
        this.ctx.fillStyle = '#228B22';
        this.ctx.fillRect(0, canvasHeight - 100, canvasWidth, 100);

        // 흙
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fillRect(0, canvasHeight - 80, canvasWidth, 80);

        // 잔디 디테일
        this.ctx.strokeStyle = '#006400';
        this.ctx.lineWidth = 2;
        for (let i = 0; i < canvasWidth; i += 20) {
            this.ctx.beginPath();
            this.ctx.moveTo(i, canvasHeight - 100);
            this.ctx.lineTo(i + 5, canvasHeight - 105);
            this.ctx.lineTo(i + 10, canvasHeight - 100);
            this.ctx.stroke();
        }
    }

    // UFO 그리기 (픽셀 아트 스타일)
    drawPixelUFO(x, y, scale = 4) {
        const ufo = [
            [0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0],
            [0,0,0,1,1,2,2,2,2,2,2,1,1,0,0,0],
            [0,0,1,2,2,3,3,3,3,3,3,2,2,1,0,0],
            [0,1,2,2,3,3,3,3,3,3,3,3,2,2,1,0],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,4,4,4,4,4,4,4,4,4,4,4,4,4,4,1],
            [0,1,4,5,4,4,5,4,4,5,4,4,5,4,1,0],
            [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0]
        ];

        const colorMap = {
            0: null,
            1: '#2F4F4F',    // 다크 그레이
            2: '#00CED1',    // 다크 터콰이즈
            3: '#00FFFF',    // 시안
            4: '#C0C0C0',    // 실버
            5: '#FFD700'     // 골드 (라이트)
        };

        this.drawPixelSprite(ufo, colorMap, x, y, scale);

        // 빔 효과
        if (Math.floor(this.animationFrame / 10) % 2 === 0) {
            this.ctx.fillStyle = 'rgba(255, 255, 0, 0.3)';
            this.ctx.beginPath();
            this.ctx.moveTo(x + scale * 4, y + scale * 8);
            this.ctx.lineTo(x + scale * 12, y + scale * 8);
            this.ctx.lineTo(x + scale * 16, y + scale * 30);
            this.ctx.lineTo(x, y + scale * 30);
            this.ctx.closePath();
            this.ctx.fill();
        }
    }

    // 폭발 효과
    createExplosion(x, y) {
        for (let i = 0; i < 20; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                life: 30,
                color: ['#FF0000', '#FFA500', '#FFFF00'][Math.floor(Math.random() * 3)]
            });
        }
    }

    // 파티클 업데이트
    updateParticles() {
        this.particles = this.particles.filter(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.life--;

            if (p.life > 0) {
                this.ctx.fillStyle = p.color;
                this.ctx.globalAlpha = p.life / 30;
                this.ctx.fillRect(p.x - 2, p.y - 2, 4, 4);
                this.ctx.globalAlpha = 1;
                return true;
            }
            return false;
        });
    }

    // 대화 상자 그리기 (픽셀 스타일)
    drawDialogBox(text, x, y, speaker = '') {
        // 컨텍스트 상태 저장
        this.ctx.save();

        // 폰트 설정
        this.ctx.font = '14px Arial';
        this.ctx.textAlign = 'left';  // 왼쪽 정렬로 명시
        this.ctx.textBaseline = 'alphabetic';  // 기본 베이스라인

        // 박스 크기 설정
        const boxWidth = 400;  // 고정 너비
        const padding = 15;
        const lineHeight = 20;

        // 텍스트 줄바꿈
        const lines = this.wrapTextKorean(text, boxWidth - padding * 2);

        // 박스 높이 계산
        const nameHeight = speaker ? 30 : 0;
        const textHeight = lines.length * lineHeight;
        const boxHeight = nameHeight + textHeight + padding * 2;

        // 박스 위치 (중앙 정렬)
        const boxX = x - boxWidth / 2;
        const boxY = y;  // y는 이제 박스의 상단 위치

        // 화면 밖으로 나가지 않도록 조정
        const finalBoxX = Math.max(10, Math.min(boxX, this.canvas.width - boxWidth - 10));

        // 박스 배경
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        this.ctx.fillRect(finalBoxX, boxY, boxWidth, boxHeight);

        // 테두리
        this.ctx.strokeStyle = '#FFFFFF';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(finalBoxX + 2, boxY + 2, boxWidth - 4, boxHeight - 4);

        // 화자 이름
        let textY = boxY + padding;
        if (speaker) {
            this.ctx.fillStyle = '#FFD700';
            this.ctx.font = 'bold 16px Arial';
            this.ctx.fillText(speaker, finalBoxX + padding, textY + 15);
            textY += nameHeight;
        }

        // 대화 내용
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = '14px Arial';
        lines.forEach((line, index) => {
            this.ctx.fillText(
                line,
                finalBoxX + padding,
                textY + 15 + index * lineHeight
            );
        });

        // 말풍선 꼬리 (선택적)
        if (y < this.canvas.height / 2) {
            // 위쪽 대화면 아래 꼬리
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
            this.ctx.beginPath();
            this.ctx.moveTo(x - 20, y);
            this.ctx.lineTo(x + 20, y);
            this.ctx.lineTo(x, y + 20);
            this.ctx.closePath();
            this.ctx.fill();
        }

        // 컨텍스트 상태 복원
        this.ctx.restore();
    }

    // 한글 텍스트 줄바꿈 (개선된 버전)
    wrapTextKorean(text, maxWidth) {
        this.ctx.font = '14px Arial';
        const lines = [];

        // 먼저 \n으로 강제 줄바꿈 처리
        const paragraphs = text.split('\n');

        for (let paragraph of paragraphs) {
            // 띄어쓰기로 단어 구분
            const words = paragraph.split(' ');
            let currentLine = '';

            for (let word of words) {
                // 현재 줄에 단어를 추가해본다
                const testLine = currentLine ? currentLine + ' ' + word : word;
                const metrics = this.ctx.measureText(testLine);

                if (metrics.width > maxWidth && currentLine) {
                    // 현재 줄이 너무 길면 이전 줄을 저장하고 새 줄 시작
                    lines.push(currentLine);

                    // 단어 자체가 너무 길면 글자 단위로 쪼개기
                    if (this.ctx.measureText(word).width > maxWidth) {
                        const chars = word.split('');
                        let charLine = '';

                        for (let char of chars) {
                            const charTest = charLine + char;
                            if (this.ctx.measureText(charTest).width > maxWidth && charLine) {
                                lines.push(charLine);
                                charLine = char;
                            } else {
                                charLine = charTest;
                            }
                        }
                        currentLine = charLine;
                    } else {
                        currentLine = word;
                    }
                } else {
                    currentLine = testLine;
                }
            }

            // 마지막 줄 추가
            if (currentLine) {
                lines.push(currentLine);
            }
        }

        return lines.length > 0 ? lines : [''];
    }

    // 텍스트 줄바꿈 (영어용)
    wrapText(text, maxWidth) {
        const words = text.split(' ');
        const lines = [];
        let currentLine = '';

        for (let word of words) {
            const testLine = currentLine + word + ' ';
            const metrics = this.ctx.measureText(testLine);
            if (metrics.width > maxWidth) {
                if (currentLine.length > 0) {
                    lines.push(currentLine.trim());
                }
                currentLine = word + ' ';
            } else {
                currentLine = testLine;
            }
        }
        if (currentLine.length > 0) {
            lines.push(currentLine.trim());
        }
        return lines;
    }

    // 오프닝 씬 정의
    getOpeningScenes() {
        return [
            // 씬 1-1: 학원 앞 (배경만)
            {
                update: () => {
                    // 하늘 배경
                    this.drawSkyBackground('#87CEEB', '#E0F6FF');

                    // 구름들
                    this.drawCloud(100 - this.bgScroll * 0.5, 50, 1.2);
                    this.drawCloud(300 - this.bgScroll * 0.5, 80, 0.8);
                    this.drawCloud(500 - this.bgScroll * 0.5, 40, 1.0);

                    // 땅
                    this.drawGround();

                    // 건물 (학원)
                    this.ctx.fillStyle = '#8B7355';
                    this.ctx.fillRect(50, this.canvas.height - 250, 200, 150);
                    this.ctx.fillStyle = '#FFFFFF';
                    this.ctx.font = 'bold 20px Arial';
                    this.ctx.fillText('영어학원', 100, this.canvas.height - 200);

                    // 지율이 (걸어나오는 애니메이션)
                    const jiyulX = Math.min(this.canvas.width / 2, 100 + this.animationFrame * 3);
                    this.drawJiyul(
                        jiyulX,
                        this.canvas.height - 170,
                        'walk',
                        Math.floor(this.animationFrame / 8),
                        4
                    );

                    this.bgScroll++;
                }
            },

            // 씬 1-2: 지율이 대사
            {
                update: () => {
                    // 하늘 배경
                    this.drawSkyBackground('#87CEEB', '#E0F6FF');

                    // 구름들
                    this.drawCloud(100, 50, 1.2);
                    this.drawCloud(300, 80, 0.8);
                    this.drawCloud(500, 40, 1.0);

                    // 땅
                    this.drawGround();

                    // 건물 (학원)
                    this.ctx.fillStyle = '#8B7355';
                    this.ctx.fillRect(50, this.canvas.height - 250, 200, 150);
                    this.ctx.fillStyle = '#FFFFFF';
                    this.ctx.font = 'bold 20px Arial';
                    this.ctx.fillText('영어학원', 100, this.canvas.height - 200);

                    // 지율이
                    this.drawJiyul(
                        this.canvas.width / 2,
                        this.canvas.height - 170,
                        'idle',
                        0,
                        4
                    );

                    // 대화
                    this.drawDialogBox(
                        '휴~ 오늘도 영어 공부 끝!\n이제 탁구 레슨 가야지!',
                        this.canvas.width / 2,
                        this.canvas.height - 300,
                        '지율'
                    );
                }
            },

            // 씬 2-1: 길거리 (이동 중)
            {
                update: () => {
                    // 하늘
                    this.drawSkyBackground('#87CEEB', '#98D8E8');

                    // 이동하는 배경
                    this.bgScroll += 2;

                    // 구름
                    for (let i = 0; i < 3; i++) {
                        this.drawCloud(
                            (i * 250 - this.bgScroll * 0.5) % (this.canvas.width + 100),
                            50 + i * 30,
                            0.8 + i * 0.2
                        );
                    }

                    // 땅
                    this.drawGround();

                    // 건물들 (스크롤)
                    for (let i = 0; i < 5; i++) {
                        const buildingX = (i * 300 - this.bgScroll) % (this.canvas.width + 300);
                        if (buildingX > -300) {
                            this.ctx.fillStyle = ['#8B7355', '#708090', '#CD853F'][i % 3];
                            this.ctx.fillRect(
                                buildingX,
                                this.canvas.height - 280,
                                150,
                                180
                            );
                        }
                    }

                    // 지율이 (달리기)
                    this.drawJiyul(
                        this.canvas.width / 2 - 50,
                        this.canvas.height - 170,
                        'walk',
                        Math.floor(this.animationFrame / 6),
                        4
                    );

                    // 탁구 라켓 (손에 들고)
                    this.ctx.save();
                    this.ctx.translate(this.canvas.width / 2 + 20, this.canvas.height - 150);
                    this.ctx.rotate(Math.sin(this.animationFrame * 0.1) * 0.2);
                    // 손잡이 (노랑색)
                    this.ctx.fillStyle = '#FFD700';
                    this.ctx.fillRect(-5, -30, 10, 30);
                    // 러버 (보라색)
                    this.ctx.fillStyle = '#9370DB';
                    this.ctx.beginPath();
                    this.ctx.ellipse(0, -40, 20, 25, 0, 0, Math.PI * 2);
                    this.ctx.fill();
                    this.ctx.restore();

                    // 음표 효과
                    for (let i = 0; i < 3; i++) {
                        const noteY = this.canvas.height - 200 - Math.sin(this.animationFrame * 0.05 + i) * 20;
                        this.ctx.font = '20px Arial';
                        this.ctx.fillText('♪', this.canvas.width / 2 + 50 + i * 20, noteY);
                    }
                }
            },

            // 씬 2-2: 지율이 대사
            {
                update: () => {
                    // 하늘
                    this.drawSkyBackground('#87CEEB', '#98D8E8');

                    // 구름
                    for (let i = 0; i < 3; i++) {
                        this.drawCloud(i * 250, 50 + i * 30, 0.8 + i * 0.2);
                    }

                    // 땅
                    this.drawGround();

                    // 지율이
                    this.drawJiyul(
                        this.canvas.width / 2 - 50,
                        this.canvas.height - 170,
                        'idle',
                        0,
                        4
                    );

                    // 탁구 라켓
                    this.ctx.save();
                    this.ctx.translate(this.canvas.width / 2 + 20, this.canvas.height - 150);
                    this.ctx.rotate(Math.sin(this.animationFrame * 0.1) * 0.2);
                    this.ctx.fillStyle = '#FFD700';
                    this.ctx.fillRect(-5, -30, 10, 30);
                    this.ctx.fillStyle = '#9370DB';
                    this.ctx.beginPath();
                    this.ctx.ellipse(0, -40, 20, 25, 0, 0, Math.PI * 2);
                    this.ctx.fill();
                    this.ctx.restore();

                    // 대화
                    this.drawDialogBox(
                        '오늘은 스매싱 기술 배운대!\n완전 기대된다!',
                        this.canvas.width / 2,
                        this.canvas.height - 300,
                        '지율'
                    );
                }
            },

            // 씬 3-1: UFO 등장 (지율이 놀람)
            {
                update: () => {
                    // 붉은 하늘
                    this.drawSkyBackground('#FF6B6B', '#FFB6C1');

                    // 땅
                    this.drawGround();

                    // 지율이 (놀란 표정)
                    this.drawJiyul(
                        this.canvas.width / 2,
                        this.canvas.height - 170,
                        'idle',
                        0,
                        4
                    );

                    // UFO들
                    const ufoY = 100 + Math.sin(this.animationFrame * 0.05) * 20;
                    this.drawPixelUFO(
                        this.canvas.width / 2 - 100 + Math.sin(this.animationFrame * 0.03) * 30,
                        ufoY,
                        5
                    );
                    this.drawPixelUFO(
                        this.canvas.width / 2 + 100 + Math.cos(this.animationFrame * 0.04) * 20,
                        ufoY + 50,
                        4
                    );

                    // 번개 효과
                    if (Math.floor(this.animationFrame / 20) % 3 === 0) {
                        this.ctx.strokeStyle = '#FFFF00';
                        this.ctx.lineWidth = 3;
                        this.ctx.beginPath();
                        this.ctx.moveTo(this.canvas.width / 2, 0);
                        this.ctx.lineTo(this.canvas.width / 2 + 50, 150);
                        this.ctx.lineTo(this.canvas.width / 2 - 30, 300);
                        this.ctx.stroke();
                    }

                    // 대화
                    this.drawDialogBox(
                        '으악! 뭐야 저거?! UFO?!',
                        this.canvas.width / 2,
                        this.canvas.height - 300,
                        '지율'
                    );
                }
            },

            // 씬 3-2: UFO 대사
            {
                update: () => {
                    // 붉은 하늘
                    this.drawSkyBackground('#FF6B6B', '#FFB6C1');

                    // 땅
                    this.drawGround();

                    // 지율이
                    this.drawJiyul(
                        this.canvas.width / 2,
                        this.canvas.height - 170,
                        'idle',
                        0,
                        4
                    );

                    // UFO들
                    const ufoY = 100 + Math.sin(this.animationFrame * 0.05) * 20;
                    this.drawPixelUFO(
                        this.canvas.width / 2 - 100,
                        ufoY,
                        5
                    );
                    this.drawPixelUFO(
                        this.canvas.width / 2 + 100,
                        ufoY + 50,
                        4
                    );

                    // 대화
                    this.drawDialogBox(
                        '쿠하하하! 우리는 영어 제국에서 왔다!',
                        this.canvas.width / 2,
                        50,
                        '???'
                    );
                }
            },

            // 씬 4: ABC 대마왕 등장
            {
                duration: 300,
                update: () => {
                    // 보라색 하늘
                    this.drawSkyBackground('#8B008B', '#4B0082');

                    // 번개 배경
                    for (let i = 0; i < 3; i++) {
                        if (Math.random() < 0.02) {
                            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
                            this.ctx.lineWidth = 2;
                            this.ctx.beginPath();
                            const startX = Math.random() * this.canvas.width;
                            this.ctx.moveTo(startX, 0);
                            this.ctx.lineTo(startX + Math.random() * 100 - 50, this.canvas.height);
                            this.ctx.stroke();
                        }
                    }

                    // 땅
                    this.drawGround();

                    // ABC 대마왕 (크게! - 지율이를 바라보도록 좌우 반전)
                    const bossScale = 6 + Math.sin(this.animationFrame * 0.05) * 0.5;
                    const bossY = this.canvas.height / 3 - (this.animationFrame < 100 ? (100 - this.animationFrame) * 2 : 0);
                    const bossCenterX = this.canvas.width / 2;
                    const bossCenterY = bossY + bossScale * 8;

                    // 알파벳 아우라 (A~Z가 빙글빙글 회전)
                    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                    const auraRadius = 120;  // 아우라 반지름
                    const rotationSpeed = 0.02;  // 회전 속도

                    for (let i = 0; i < alphabet.length; i++) {
                        const angle = (this.animationFrame * rotationSpeed) + (i * (Math.PI * 2) / alphabet.length);
                        const x = bossCenterX + Math.cos(angle) * auraRadius;
                        const y = bossCenterY + Math.sin(angle) * auraRadius;

                        // 알파벳 크기 애니메이션 (파도 효과)
                        const sizeWave = 1 + Math.sin(this.animationFrame * 0.1 + i * 0.5) * 0.2;
                        const fontSize = 20 * sizeWave;

                        // 알파벳 색상 (무지개 효과)
                        const hue = (i * 360 / alphabet.length + this.animationFrame) % 360;
                        this.ctx.fillStyle = `hsl(${hue}, 80%, 60%)`;
                        this.ctx.font = `bold ${fontSize}px Arial`;
                        this.ctx.textAlign = 'center';
                        this.ctx.textBaseline = 'middle';

                        // 글로우 효과
                        this.ctx.shadowColor = this.ctx.fillStyle;
                        this.ctx.shadowBlur = 10;
                        this.ctx.fillText(alphabet[i], x, y);
                        this.ctx.shadowBlur = 0;
                    }

                    this.drawBossSprite(
                        'boss20',
                        this.canvas.width / 2 - bossScale * 8,
                        bossY,
                        bossScale,
                        true  // 좌우 반전 (왼쪽을 바라보도록)
                    );

                    // 왕관 반짝임
                    if (Math.floor(this.animationFrame / 10) % 2 === 0) {
                        this.ctx.fillStyle = '#FFD700';
                        for (let i = 0; i < 5; i++) {
                            const starX = this.canvas.width / 2 + Math.random() * 100 - 50;
                            const starY = bossY - 20 + Math.random() * 40;
                            this.ctx.font = '20px Arial';
                            this.ctx.fillText('✨', starX, starY);
                        }
                    }

                    // 지율이
                    this.drawJiyul(
                        this.canvas.width / 4,
                        this.canvas.height - 170,
                        'idle',
                        0,
                        4
                    );

                    // 알파벳 미니언들
                    const letters = ['A', 'B', 'C'];
                    for (let i = 0; i < letters.length; i++) {
                        const letterX = this.canvas.width / 2 + 150 + i * 60;
                        const letterY = this.canvas.height - 150 + Math.sin(this.animationFrame * 0.1 + i) * 10;
                        this.drawAlphabetSprite(letters[i], letterX, letterY, 3);
                    }

                    // 대화 (하단에 위치하도록)
                    if (this.animationFrame < 150) {
                        this.drawDialogBox(
                            '안녕~! 나는 ABC 대마왕!\n영어 친구들아 모여라! 크크크!',
                            this.canvas.width / 2,
                            this.canvas.height - 250,
                            'ABC 대마왕'
                        );
                    } else {
                        this.drawDialogBox(
                            '이제부터 너희는 영어만 공부해야 해!\n탁구는 금지! 오직 영어 공부만! 하하하!',
                            this.canvas.width / 2,
                            this.canvas.height - 250,
                            'ABC 대마왕'
                        );
                    }

                    // 지율이 대사
                    if (this.animationFrame > 200) {
                        this.drawDialogBox(
                            '뭐라고?! 탁구는 내 생명인데!\n절대 포기 못 해!',
                            this.canvas.width / 4,
                            this.canvas.height - 300,
                            '지율'
                        );
                    }
                }
            },

            // 씬 5-1: 제니스 영어학원 sunzero 선생님 등장! (지율이 놀람)
            {
                update: () => {
                    // 신비로운 보라색 하늘
                    this.drawSkyBackground('#9370DB', '#DDA0DD');

                    // 반짝이는 별들
                    for (let i = 0; i < 20; i++) {
                        const x = (i * 50 + this.animationFrame) % this.canvas.width;
                        const y = 50 + Math.sin(this.animationFrame * 0.05 + i) * 30;
                        this.ctx.fillStyle = '#FFD700';
                        this.ctx.font = '20px Arial';
                        this.ctx.fillText('✨', x, y);
                    }

                    // 땅
                    this.drawGround();

                    // 제니스 영어학원 건물 (빛나는)
                    const buildingGlow = Math.sin(this.animationFrame * 0.1) * 0.3 + 0.7;
                    this.ctx.fillStyle = `rgba(139, 115, 85, ${buildingGlow})`;
                    this.ctx.fillRect(50, this.canvas.height - 280, 250, 180);

                    // 건물 창문
                    this.ctx.fillStyle = '#FFD700';
                    for (let i = 0; i < 2; i++) {
                        for (let j = 0; j < 3; j++) {
                            this.ctx.fillRect(80 + j * 60, this.canvas.height - 250 + i * 60, 40, 50);
                        }
                    }

                    // 간판 (빛나는 효과)
                    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
                    this.ctx.fillRect(60, this.canvas.height - 300, 230, 40);
                    this.ctx.fillStyle = `hsl(${this.animationFrame * 2 % 360}, 80%, 60%)`;
                    this.ctx.font = 'bold 22px Arial';
                    this.ctx.fillText('✨ 제니스 영어학원 ✨', 80, this.canvas.height - 275);

                    // 지율이 (놀란 모습)
                    this.drawJiyul(
                        this.canvas.width / 2 - 100,
                        this.canvas.height - 170,
                        'idle',
                        0,
                        4
                    );

                    // sunzero 선생님 등장 (신비로운 등장 효과)
                    const teacherY = this.canvas.height - 180 - Math.max(0, 50 - this.animationFrame);
                    const teacherAlpha = Math.min(1, this.animationFrame / 60);

                    // 빛의 기둥
                    if (this.animationFrame < 80) {
                        const gradient = this.ctx.createLinearGradient(
                            this.canvas.width / 2 + 100, 0,
                            this.canvas.width / 2 + 100, this.canvas.height
                        );
                        gradient.addColorStop(0, 'rgba(255, 215, 0, 0)');
                        gradient.addColorStop(0.3, 'rgba(186, 85, 211, 0.5)');
                        gradient.addColorStop(0.7, 'rgba(255, 105, 180, 0.5)');
                        gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
                        this.ctx.fillStyle = gradient;
                        this.ctx.fillRect(this.canvas.width / 2 + 60, 0, 80, this.canvas.height);
                    }

                    // sunzero 선생님 (SD 캐릭터 스타일 - 귀여운 픽셀 아트)
                    this.ctx.save();
                    this.ctx.globalAlpha = teacherAlpha;

                    // SD 캐릭터 스프라이트 (16x16 픽셀 - 지율이와 같은 스타일)
                    const sunzeroSprite = [
                        [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0],  // 긴 머리 (양옆으로 내려옴)
                        [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
                        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                        [1,1,1,2,2,2,2,2,2,2,2,2,2,1,1,1],  // 얼굴 시작
                        [1,1,2,2,2,2,2,2,2,2,2,2,2,2,1,1],
                        [0,1,2,3,3,3,2,2,2,3,3,3,2,2,1,0],  // 큰 눈 (흰자)
                        [0,1,2,3,4,4,2,2,2,3,4,4,2,2,1,0],  // 눈동자 + 반짝임
                        [0,1,2,2,2,2,2,2,2,2,2,2,2,2,1,0],  // 얼굴
                        [0,0,2,9,2,2,5,5,5,2,2,9,2,0,0,0],  // 볼터치 + 미소
                        [0,0,0,6,6,6,6,6,6,6,6,6,0,0,0,0],  // 겨자색 잠바
                        [0,0,6,6,6,7,6,6,7,6,6,6,6,0,0,0],  // 잠바 (지퍼)
                        [0,8,8,8,8,8,8,8,8,8,8,8,8,0,0,0],  // 검은 바지
                        [0,8,8,8,8,8,8,8,8,8,8,8,8,0,0,0],
                        [0,0,8,8,8,10,0,0,10,8,8,8,0,0,0,0],  // 금색 장식 (귀걸이 or 뱅글)
                        [0,0,2,2,2,0,0,0,0,2,2,2,0,0,0,0],  // 피부색 다리
                        [0,0,11,11,11,0,0,0,0,11,11,11,0,0,0,0]  // 신발
                    ];

                    const sunzeroColorMap = {
                        0: null,
                        1: '#2C1810',    // 검은 갈색 머리
                        2: '#FFE0BD',    // 살색
                        3: '#FFFFFF',    // 눈 흰자
                        4: '#000000',    // 눈동자
                        5: '#FF69B4',    // 핑크 입술
                        6: '#D4A518',    // 겨자색 잠바
                        7: '#C0C0C0',    // 은색 지퍼
                        8: '#1A1A1A',    // 검은 바지
                        9: '#FFB6C1',    // 볼터치 (연핑크)
                        10: '#FFD700',   // 금색 (귀걸이/장식)
                        11: '#8B4513'    // 갈색 신발
                    };

                    // 픽셀 스프라이트 그리기 (4배 크기)
                    const scale = 4;
                    const startX = this.canvas.width / 2 + 70;
                    const startY = teacherY - 20;

                    for (let row = 0; row < sunzeroSprite.length; row++) {
                        for (let col = 0; col < sunzeroSprite[row].length; col++) {
                            const pixel = sunzeroSprite[row][col];
                            if (pixel !== 0 && sunzeroColorMap[pixel]) {
                                this.ctx.fillStyle = sunzeroColorMap[pixel];
                                this.ctx.fillRect(
                                    startX + col * scale,
                                    startY + row * scale,
                                    scale,
                                    scale
                                );
                            }
                        }
                    }

                    // 귀걸이 반짝임 효과 (금색)
                    if (Math.floor(this.animationFrame / 20) % 2 === 0) {
                        this.ctx.fillStyle = '#FFD700';
                        // 왼쪽 귀걸이
                        this.ctx.fillRect(startX + 1 * scale, startY + 6 * scale, scale, scale);
                        // 오른쪽 귀걸이
                        this.ctx.fillRect(startX + 14 * scale, startY + 6 * scale, scale, scale);
                    }

                    // 머리카락 하이라이트 (반짝임)
                    this.ctx.fillStyle = 'rgba(139, 69, 19, 0.4)';
                    this.ctx.fillRect(startX + 5 * scale, startY + 1 * scale, 2 * scale, scale);
                    this.ctx.fillRect(startX + 9 * scale, startY + 1 * scale, 2 * scale, scale);

                    this.ctx.restore();

                    // 신검 (떠있는 상태 - 보라색 빛나는 검)
                    if (this.animationFrame > 60) {
                        const swordY = this.canvas.height / 2 + Math.sin(this.animationFrame * 0.1) * 10;
                        const swordRotation = this.animationFrame * 0.05;

                        this.ctx.save();
                        this.ctx.translate(this.canvas.width / 2, swordY);
                        this.ctx.rotate(swordRotation);

                        // 신검 글로우
                        const swordGradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, 60);
                        swordGradient.addColorStop(0, 'rgba(186, 85, 211, 0.8)');
                        swordGradient.addColorStop(0.5, 'rgba(255, 105, 180, 0.5)');
                        swordGradient.addColorStop(1, 'rgba(186, 85, 211, 0)');
                        this.ctx.fillStyle = swordGradient;
                        this.ctx.beginPath();
                        this.ctx.arc(0, 0, 60, 0, Math.PI * 2);
                        this.ctx.fill();

                        // 신검 본체
                        const gradient = this.ctx.createLinearGradient(-30, 0, 30, 0);
                        gradient.addColorStop(0, '#FFA500');  // 손잡이 (주황)
                        gradient.addColorStop(0.2, '#FFD700'); // 금색
                        gradient.addColorStop(0.4, '#D8BFD8'); // 연보라
                        gradient.addColorStop(0.6, '#BA55D3'); // 보라
                        gradient.addColorStop(0.8, '#9370DB'); // 진보라
                        gradient.addColorStop(1, '#8B008B');   // 다크 마젠타
                        this.ctx.fillStyle = gradient;
                        this.ctx.fillRect(-30, -4, 60, 8);

                        // 검 끝 (뾰족)
                        this.ctx.beginPath();
                        this.ctx.moveTo(30, -4);
                        this.ctx.lineTo(35, 0);
                        this.ctx.lineTo(30, 4);
                        this.ctx.closePath();
                        this.ctx.fill();

                        // 핑크 중심선
                        this.ctx.strokeStyle = '#FF69B4';
                        this.ctx.lineWidth = 2;
                        this.ctx.beginPath();
                        this.ctx.moveTo(-25, 0);
                        this.ctx.lineTo(30, 0);
                        this.ctx.stroke();

                        this.ctx.restore();

                        // 신검 주위 반짝임
                        for (let i = 0; i < 8; i++) {
                            const angle = (this.animationFrame * 0.05 + i * Math.PI / 4);
                            const sparkX = this.canvas.width / 2 + Math.cos(angle) * 70;
                            const sparkY = swordY + Math.sin(angle) * 70;
                            this.ctx.fillStyle = ['#FFD700', '#FF69B4', '#BA55D3'][i % 3];
                            this.ctx.font = '20px Arial';
                            this.ctx.fillText('✨', sparkX, sparkY);
                        }
                    }

                    // 지율이 대사
                    this.drawDialogBox(
                        '헉! 누구세요?!',
                        this.canvas.width / 4,
                        this.canvas.height - 120,
                        '지율'
                    );
                }
            },

            // 씬 5-2: sunzero 선생님 자기소개
            {
                update: () => {
                    // 신비로운 보라색 하늘
                    this.drawSkyBackground('#9370DB', '#DDA0DD');

                    // 반짝이는 별들
                    for (let i = 0; i < 20; i++) {
                        const x = (i * 50 + this.animationFrame) % this.canvas.width;
                        const y = 50 + Math.sin(this.animationFrame * 0.05 + i) * 30;
                        this.ctx.fillStyle = '#FFD700';
                        this.ctx.font = '20px Arial';
                        this.ctx.fillText('✨', x, y);
                    }

                    // 땅
                    this.drawGround();

                    // 제니스 영어학원 건물
                    const buildingGlow = Math.sin(this.animationFrame * 0.1) * 0.3 + 0.7;
                    this.ctx.fillStyle = `rgba(139, 115, 85, ${buildingGlow})`;
                    this.ctx.fillRect(50, this.canvas.height - 280, 250, 180);

                    // 건물 창문
                    this.ctx.fillStyle = '#FFD700';
                    for (let i = 0; i < 2; i++) {
                        for (let j = 0; j < 3; j++) {
                            this.ctx.fillRect(80 + j * 60, this.canvas.height - 250 + i * 60, 40, 50);
                        }
                    }

                    // 간판
                    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
                    this.ctx.fillRect(60, this.canvas.height - 300, 230, 40);
                    this.ctx.fillStyle = `hsl(${this.animationFrame * 2 % 360}, 80%, 60%)`;
                    this.ctx.font = 'bold 22px Arial';
                    this.ctx.fillText('✨ 제니스 영어학원 ✨', 80, this.canvas.height - 275);

                    // 지율이
                    this.drawJiyul(this.canvas.width / 2 - 100, this.canvas.height - 170, 'idle', 0, 4);

                    // sunzero 선생님 그리기 (간단화)
                    const sunzeroSprite = [
                        [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
                        [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
                        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                        [1,1,1,2,2,2,2,2,2,2,2,2,2,1,1,1],
                        [1,1,2,2,2,2,2,2,2,2,2,2,2,2,1,1],
                        [0,1,2,3,3,3,2,2,2,3,3,3,2,2,1,0],
                        [0,1,2,3,4,4,2,2,2,3,4,4,2,2,1,0],
                        [0,1,2,2,2,2,2,2,2,2,2,2,2,2,1,0],
                        [0,0,2,9,2,2,5,5,5,2,2,9,2,0,0,0],
                        [0,0,0,6,6,6,6,6,6,6,6,6,0,0,0,0],
                        [0,0,6,6,6,7,6,6,7,6,6,6,6,0,0,0],
                        [0,8,8,8,8,8,8,8,8,8,8,8,8,0,0,0],
                        [0,8,8,8,8,8,8,8,8,8,8,8,8,0,0,0],
                        [0,0,8,8,8,10,0,0,10,8,8,8,0,0,0,0],
                        [0,0,2,2,2,0,0,0,0,2,2,2,0,0,0,0],
                        [0,0,11,11,11,0,0,0,0,11,11,11,0,0,0,0]
                    ];
                    const sunzeroColorMap = {
                        0: null, 1: '#2C1810', 2: '#FFE0BD', 3: '#FFFFFF', 4: '#000000',
                        5: '#FF69B4', 6: '#D4A518', 7: '#C0C0C0', 8: '#1A1A1A',
                        9: '#FFB6C1', 10: '#FFD700', 11: '#8B4513'
                    };
                    this.drawPixelSprite(sunzeroSprite, sunzeroColorMap,
                        this.canvas.width / 2 + 70, this.canvas.height - 200, 4);

                    // 선생님 대사
                    this.drawDialogBox(
                        '안녕 지율아! 나는 제니스 영어학원의\nsunzero 선생님이야. 너를 도와주러 왔어!',
                        this.canvas.width * 3 / 4,
                        this.canvas.height - 150,
                        'sunzero 선생님'
                    );
                }
            },

            // 씬 5-3: 신검 설명
            {
                update: () => {
                    // 신비로운 보라색 하늘
                    this.drawSkyBackground('#9370DB', '#DDA0DD');

                    // 반짝이는 별들
                    for (let i = 0; i < 20; i++) {
                        const x = (i * 50 + this.animationFrame) % this.canvas.width;
                        const y = 50 + Math.sin(this.animationFrame * 0.05 + i) * 30;
                        this.ctx.fillStyle = '#FFD700';
                        this.ctx.font = '20px Arial';
                        this.ctx.fillText('✨', x, y);
                    }

                    // 땅
                    this.drawGround();

                    // 제니스 영어학원 건물
                    const buildingGlow = Math.sin(this.animationFrame * 0.1) * 0.3 + 0.7;
                    this.ctx.fillStyle = `rgba(139, 115, 85, ${buildingGlow})`;
                    this.ctx.fillRect(50, this.canvas.height - 280, 250, 180);

                    // 건물 창문
                    this.ctx.fillStyle = '#FFD700';
                    for (let i = 0; i < 2; i++) {
                        for (let j = 0; j < 3; j++) {
                            this.ctx.fillRect(80 + j * 60, this.canvas.height - 250 + i * 60, 40, 50);
                        }
                    }

                    // 간판
                    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
                    this.ctx.fillRect(60, this.canvas.height - 300, 230, 40);
                    this.ctx.fillStyle = `hsl(${this.animationFrame * 2 % 360}, 80%, 60%)`;
                    this.ctx.font = 'bold 22px Arial';
                    this.ctx.fillText('✨ 제니스 영어학원 ✨', 80, this.canvas.height - 275);

                    // 지율이
                    this.drawJiyul(this.canvas.width / 2 - 100, this.canvas.height - 170, 'idle', 0, 4);

                    // sunzero 선생님
                    const sunzeroSprite = [
                        [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
                        [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
                        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                        [1,1,1,2,2,2,2,2,2,2,2,2,2,1,1,1],
                        [1,1,2,2,2,2,2,2,2,2,2,2,2,2,1,1],
                        [0,1,2,3,3,3,2,2,2,3,3,3,2,2,1,0],
                        [0,1,2,3,4,4,2,2,2,3,4,4,2,2,1,0],
                        [0,1,2,2,2,2,2,2,2,2,2,2,2,2,1,0],
                        [0,0,2,9,2,2,5,5,5,2,2,9,2,0,0,0],
                        [0,0,0,6,6,6,6,6,6,6,6,6,0,0,0,0],
                        [0,0,6,6,6,7,6,6,7,6,6,6,6,0,0,0],
                        [0,8,8,8,8,8,8,8,8,8,8,8,8,0,0,0],
                        [0,8,8,8,8,8,8,8,8,8,8,8,8,0,0,0],
                        [0,0,8,8,8,10,0,0,10,8,8,8,0,0,0,0],
                        [0,0,2,2,2,0,0,0,0,2,2,2,0,0,0,0],
                        [0,0,11,11,11,0,0,0,0,11,11,11,0,0,0,0]
                    ];
                    const sunzeroColorMap = {
                        0: null, 1: '#2C1810', 2: '#FFE0BD', 3: '#FFFFFF', 4: '#000000',
                        5: '#FF69B4', 6: '#D4A518', 7: '#C0C0C0', 8: '#1A1A1A',
                        9: '#FFB6C1', 10: '#FFD700', 11: '#8B4513'
                    };
                    this.drawPixelSprite(sunzeroSprite, sunzeroColorMap,
                        this.canvas.width / 2 + 70, this.canvas.height - 200, 4);

                    // 신검 (떠있는 상태)
                    const swordY = this.canvas.height / 2 + Math.sin(this.animationFrame * 0.1) * 10;
                    const swordRotation = this.animationFrame * 0.05;

                    this.ctx.save();
                    this.ctx.translate(this.canvas.width / 2, swordY);
                    this.ctx.rotate(swordRotation);

                    // 신검 글로우
                    const swordGradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, 60);
                    swordGradient.addColorStop(0, 'rgba(186, 85, 211, 0.8)');
                    swordGradient.addColorStop(0.5, 'rgba(255, 105, 180, 0.5)');
                    swordGradient.addColorStop(1, 'rgba(186, 85, 211, 0)');
                    this.ctx.fillStyle = swordGradient;
                    this.ctx.beginPath();
                    this.ctx.arc(0, 0, 60, 0, Math.PI * 2);
                    this.ctx.fill();

                    // 신검 본체
                    const gradient = this.ctx.createLinearGradient(-30, 0, 30, 0);
                    gradient.addColorStop(0, '#FFA500');
                    gradient.addColorStop(0.2, '#FFD700');
                    gradient.addColorStop(0.4, '#D8BFD8');
                    gradient.addColorStop(0.6, '#BA55D3');
                    gradient.addColorStop(0.8, '#9370DB');
                    gradient.addColorStop(1, '#8B008B');
                    this.ctx.fillStyle = gradient;
                    this.ctx.fillRect(-30, -4, 60, 8);

                    // 검 끝
                    this.ctx.beginPath();
                    this.ctx.moveTo(30, -4);
                    this.ctx.lineTo(35, 0);
                    this.ctx.lineTo(30, 4);
                    this.ctx.closePath();
                    this.ctx.fill();

                    // 핑크 중심선
                    this.ctx.strokeStyle = '#FF69B4';
                    this.ctx.lineWidth = 2;
                    this.ctx.beginPath();
                    this.ctx.moveTo(-25, 0);
                    this.ctx.lineTo(30, 0);
                    this.ctx.stroke();

                    this.ctx.restore();

                    // 신검 주위 반짝임
                    for (let i = 0; i < 8; i++) {
                        const angle = (this.animationFrame * 0.05 + i * Math.PI / 4);
                        const sparkX = this.canvas.width / 2 + Math.cos(angle) * 70;
                        const sparkY = swordY + Math.sin(angle) * 70;
                        this.ctx.fillStyle = ['#FFD700', '#FF69B4', '#BA55D3'][i % 3];
                        this.ctx.font = '20px Arial';
                        this.ctx.fillText('✨', sparkX, sparkY);
                    }

                    // 선생님 대사
                    this.drawDialogBox(
                        '이 신검을 받아! ABC 대마왕을 물리칠 수 있을 거야!\n1시, 3시, 5시 방향으로 3개가 날아가는 전설의 검이란다!',
                        this.canvas.width / 2,
                        this.canvas.height - 130,
                        'sunzero 선생님'
                    );
                }
            },

            // 씬 5-4: 지율이 감사
            {
                update: () => {
                    // 신비로운 보라색 하늘
                    this.drawSkyBackground('#9370DB', '#DDA0DD');

                    // 반짝이는 별들
                    for (let i = 0; i < 20; i++) {
                        const x = (i * 50 + this.animationFrame) % this.canvas.width;
                        const y = 50 + Math.sin(this.animationFrame * 0.05 + i) * 30;
                        this.ctx.fillStyle = '#FFD700';
                        this.ctx.font = '20px Arial';
                        this.ctx.fillText('✨', x, y);
                    }

                    // 땅
                    this.drawGround();

                    // 제니스 영어학원 건물
                    const buildingGlow = Math.sin(this.animationFrame * 0.1) * 0.3 + 0.7;
                    this.ctx.fillStyle = `rgba(139, 115, 85, ${buildingGlow})`;
                    this.ctx.fillRect(50, this.canvas.height - 280, 250, 180);

                    // 건물 창문
                    this.ctx.fillStyle = '#FFD700';
                    for (let i = 0; i < 2; i++) {
                        for (let j = 0; j < 3; j++) {
                            this.ctx.fillRect(80 + j * 60, this.canvas.height - 250 + i * 60, 40, 50);
                        }
                    }

                    // 간판
                    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
                    this.ctx.fillRect(60, this.canvas.height - 300, 230, 40);
                    this.ctx.fillStyle = `hsl(${this.animationFrame * 2 % 360}, 80%, 60%)`;
                    this.ctx.font = 'bold 22px Arial';
                    this.ctx.fillText('✨ 제니스 영어학원 ✨', 80, this.canvas.height - 275);

                    // 지율이
                    this.drawJiyul(this.canvas.width / 2 - 100, this.canvas.height - 170, 'jump', 0, 4);

                    // sunzero 선생님
                    const sunzeroSprite = [
                        [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
                        [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
                        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                        [1,1,1,2,2,2,2,2,2,2,2,2,2,1,1,1],
                        [1,1,2,2,2,2,2,2,2,2,2,2,2,2,1,1],
                        [0,1,2,3,3,3,2,2,2,3,3,3,2,2,1,0],
                        [0,1,2,3,4,4,2,2,2,3,4,4,2,2,1,0],
                        [0,1,2,2,2,2,2,2,2,2,2,2,2,2,1,0],
                        [0,0,2,9,2,2,5,5,5,2,2,9,2,0,0,0],
                        [0,0,0,6,6,6,6,6,6,6,6,6,0,0,0,0],
                        [0,0,6,6,6,7,6,6,7,6,6,6,6,0,0,0],
                        [0,8,8,8,8,8,8,8,8,8,8,8,8,0,0,0],
                        [0,8,8,8,8,8,8,8,8,8,8,8,8,0,0,0],
                        [0,0,8,8,8,10,0,0,10,8,8,8,0,0,0,0],
                        [0,0,2,2,2,0,0,0,0,2,2,2,0,0,0,0],
                        [0,0,11,11,11,0,0,0,0,11,11,11,0,0,0,0]
                    ];
                    const sunzeroColorMap = {
                        0: null, 1: '#2C1810', 2: '#FFE0BD', 3: '#FFFFFF', 4: '#000000',
                        5: '#FF69B4', 6: '#D4A518', 7: '#C0C0C0', 8: '#1A1A1A',
                        9: '#FFB6C1', 10: '#FFD700', 11: '#8B4513'
                    };
                    this.drawPixelSprite(sunzeroSprite, sunzeroColorMap,
                        this.canvas.width / 2 + 70, this.canvas.height - 200, 4);

                    // 지율이 대사
                    this.drawDialogBox(
                        '와! 감사합니다 선생님!\nABC 대마왕을 무찌르고 탁구를 지킬게요!',
                        this.canvas.width / 4,
                        this.canvas.height - 140,
                        '지율'
                    );
                }
            },

            // 씬 6: 신검 파워업 & 결전 준비!
            {
                duration: 200,
                update: () => {
                    // 황금빛 하늘 (희망적)
                    this.drawSkyBackground('#FFD700', '#FFA500');

                    // 빛나는 효과
                    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
                    for (let i = 0; i < 5; i++) {
                        const radius = (this.animationFrame * 5 + i * 50) % 300;
                        this.ctx.beginPath();
                        this.ctx.arc(this.canvas.width / 2, this.canvas.height / 2, radius, 0, Math.PI * 2);
                        this.ctx.fill();
                    }

                    // 땅
                    this.drawGround();

                    // 지율이 (파워업!)
                    const jiyulScale = 5 + Math.sin(this.animationFrame * 0.1) * 0.5;
                    this.drawJiyul(
                        this.canvas.width / 2 - jiyulScale * 8,
                        this.canvas.height / 2 - jiyulScale * 8,
                        'smash',
                        0,
                        jiyulScale
                    );

                    // 신검 (왼손에 들고)
                    this.ctx.save();
                    this.ctx.translate(this.canvas.width / 2 - 100, this.canvas.height / 2);
                    this.ctx.rotate(-Math.PI / 6 + Math.sin(this.animationFrame * 0.1) * 0.1);

                    // 신검 글로우
                    const swordGradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, 60);
                    swordGradient.addColorStop(0, 'rgba(186, 85, 211, 0.8)');
                    swordGradient.addColorStop(0.5, 'rgba(255, 105, 180, 0.5)');
                    swordGradient.addColorStop(1, 'rgba(186, 85, 211, 0)');
                    this.ctx.fillStyle = swordGradient;
                    this.ctx.beginPath();
                    this.ctx.arc(0, 0, 60, 0, Math.PI * 2);
                    this.ctx.fill();

                    // 신검 본체
                    const gradient = this.ctx.createLinearGradient(-30, 0, 30, 0);
                    gradient.addColorStop(0, '#FFA500');
                    gradient.addColorStop(0.2, '#FFD700');
                    gradient.addColorStop(0.4, '#D8BFD8');
                    gradient.addColorStop(0.6, '#BA55D3');
                    gradient.addColorStop(0.8, '#9370DB');
                    gradient.addColorStop(1, '#8B008B');
                    this.ctx.fillStyle = gradient;
                    this.ctx.fillRect(-30, -5, 60, 10);

                    // 검 끝
                    this.ctx.beginPath();
                    this.ctx.moveTo(30, -5);
                    this.ctx.lineTo(38, 0);
                    this.ctx.lineTo(30, 5);
                    this.ctx.closePath();
                    this.ctx.fill();

                    // 핑크 중심선
                    this.ctx.strokeStyle = '#FF69B4';
                    this.ctx.lineWidth = 2;
                    this.ctx.beginPath();
                    this.ctx.moveTo(-25, 0);
                    this.ctx.lineTo(30, 0);
                    this.ctx.stroke();

                    this.ctx.restore();

                    // 탁구 라켓 (오른손에 들고)
                    this.ctx.save();
                    this.ctx.translate(this.canvas.width / 2 + 100, this.canvas.height / 2);
                    this.ctx.rotate(Math.PI / 6 + Math.sin(this.animationFrame * 0.1) * 0.1);

                    // 라켓 광채
                    const racketGradient = this.ctx.createRadialGradient(0, -40, 0, 0, -40, 50);
                    racketGradient.addColorStop(0, 'rgba(255, 215, 0, 0.8)');
                    racketGradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
                    this.ctx.fillStyle = racketGradient;
                    this.ctx.beginPath();
                    this.ctx.arc(0, -40, 50, 0, Math.PI * 2);
                    this.ctx.fill();

                    // 라켓 손잡이 (노랑색 - 더 길고 명확하게)
                    const handleGradient = this.ctx.createLinearGradient(-8, 0, 8, 0);
                    handleGradient.addColorStop(0, '#FFA500');
                    handleGradient.addColorStop(0.5, '#FFD700');
                    handleGradient.addColorStop(1, '#FFA500');
                    this.ctx.fillStyle = handleGradient;
                    this.ctx.fillRect(-8, 0, 16, 50);  // 손잡이 길이 증가

                    // 손잡이 테두리
                    this.ctx.strokeStyle = '#CC9900';
                    this.ctx.lineWidth = 2;
                    this.ctx.strokeRect(-8, 0, 16, 50);

                    // 손잡이 그립 디테일 (미끄럼 방지)
                    this.ctx.strokeStyle = '#FFE5B4';
                    this.ctx.lineWidth = 1;
                    for (let i = 0; i < 5; i++) {
                        this.ctx.beginPath();
                        this.ctx.moveTo(-8, 10 + i * 8);
                        this.ctx.lineTo(8, 10 + i * 8);
                        this.ctx.stroke();
                    }

                    // 손잡이 끝부분 (플레어)
                    this.ctx.fillStyle = '#CC9900';
                    this.ctx.fillRect(-10, 48, 20, 5);

                    // 라켓 러버 (보라색)
                    this.ctx.fillStyle = '#9370DB';
                    this.ctx.beginPath();
                    this.ctx.ellipse(0, -40, 30, 35, 0, 0, Math.PI * 2);
                    this.ctx.fill();

                    // 러버 테두리
                    this.ctx.strokeStyle = '#6A5ACD';
                    this.ctx.lineWidth = 3;
                    this.ctx.stroke();

                    // 러버 하이라이트
                    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                    this.ctx.beginPath();
                    this.ctx.ellipse(-8, -48, 12, 15, 0, 0, Math.PI * 2);
                    this.ctx.fill();

                    this.ctx.restore();

                    // 파워 오라 (보라색 + 금색)
                    for (let i = 0; i < 3; i++) {
                        const radius = (this.animationFrame * 3 + i * 30) % 150;
                        const alpha = 1 - (radius / 150);
                        this.ctx.strokeStyle = `rgba(186, 85, 211, ${alpha * 0.5})`;
                        this.ctx.lineWidth = 3;
                        this.ctx.beginPath();
                        this.ctx.arc(this.canvas.width / 2, this.canvas.height / 2, radius, 0, Math.PI * 2);
                        this.ctx.stroke();
                    }

                    // 결의의 대사
                    this.drawDialogBox(
                        '좋아! 신검과 탁구 라켓!\nABC 대마왕을 무찌르고 탁구를 지킬 거야!!',
                        this.canvas.width / 2,
                        this.canvas.height - 200,
                        '지율'
                    );

                    // READY 텍스트
                    if (this.animationFrame > 100) {
                        this.ctx.save();
                        this.ctx.fillStyle = '#FF0000';
                        this.ctx.font = `bold ${60 + Math.sin(this.animationFrame * 0.2) * 10}px Arial`;
                        this.ctx.textAlign = 'center';
                        this.ctx.shadowColor = '#000000';
                        this.ctx.shadowBlur = 10;
                        this.ctx.fillText('READY!', this.canvas.width / 2, 100);
                        this.ctx.restore();
                    }
                }
            }
        ];
    }

    // 엔딩 씬 정의
    getEndingScenes() {
        return [
            // 씬 1: 1년 후...
            {
                duration: 120,
                update: () => {
                    // 검은 화면
                    this.ctx.fillStyle = '#000000';
                    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

                    // 페이드 인 텍스트
                    const alpha = Math.min(1, this.animationFrame / 60);
                    this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
                    this.ctx.font = 'bold 60px Arial';
                    this.ctx.textAlign = 'center';
                    this.ctx.fillText('1년 후...', this.canvas.width / 2, this.canvas.height / 2);

                    // 반짝이는 별
                    for (let i = 0; i < 10; i++) {
                        if (Math.random() < 0.1) {
                            const x = Math.random() * this.canvas.width;
                            const y = Math.random() * this.canvas.height;
                            this.ctx.fillStyle = '#FFFFFF';
                            this.ctx.fillRect(x, y, 2, 2);
                        }
                    }
                }
            },

            // 씬 2: 경기장
            {
                duration: 250,
                update: () => {
                    // 경기장 배경
                    this.drawSkyBackground('#4169E1', '#87CEEB');

                    // 관중석
                    this.ctx.fillStyle = '#696969';
                    this.ctx.fillRect(0, 100, this.canvas.width, 150);

                    // 관중들
                    for (let row = 0; row < 3; row++) {
                        for (let col = 0; col < 20; col++) {
                            const x = col * 40 + 20;
                            const y = 120 + row * 40;
                            const colors = ['#FFE0BD', '#8B4513', '#F5DEB3'];
                            this.ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
                            this.ctx.beginPath();
                            this.ctx.arc(x, y, 10, 0, Math.PI * 2);
                            this.ctx.fill();

                            // 응원
                            if (Math.random() < 0.3) {
                                this.ctx.font = '16px Arial';
                                this.ctx.fillText('👏', x - 8, y - 15);
                            }
                        }
                    }

                    // 탁구대
                    this.ctx.fillStyle = '#006400';
                    this.ctx.fillRect(this.canvas.width / 2 - 200, this.canvas.height - 200, 400, 20);

                    // 네트
                    this.ctx.strokeStyle = '#FFFFFF';
                    this.ctx.lineWidth = 3;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.canvas.width / 2, this.canvas.height - 200);
                    this.ctx.lineTo(this.canvas.width / 2, this.canvas.height - 250);
                    this.ctx.stroke();

                    // 지율이 (승리 포즈)
                    this.drawJiyul(
                        this.canvas.width / 2 - 150,
                        this.canvas.height - 280,
                        'jump',
                        0,
                        4
                    );

                    // 상대 선수
                    this.ctx.fillStyle = '#4169E1';
                    this.ctx.fillRect(
                        this.canvas.width / 2 + 100,
                        this.canvas.height - 280,
                        60,
                        80
                    );

                    // 탁구공 애니메이션
                    const ballX = this.canvas.width / 2 - 100 + Math.sin(this.animationFrame * 0.1) * 100;
                    const ballY = this.canvas.height - 300 - Math.abs(Math.sin(this.animationFrame * 0.1)) * 50;
                    this.ctx.fillStyle = '#FFFFFF';
                    this.ctx.beginPath();
                    this.ctx.arc(ballX, ballY, 8, 0, Math.PI * 2);
                    this.ctx.fill();

                    // 점수판
                    this.ctx.fillStyle = '#000000';
                    this.ctx.fillRect(this.canvas.width / 2 - 100, 20, 200, 60);
                    this.ctx.fillStyle = '#00FF00';
                    this.ctx.font = 'bold 40px Arial';
                    this.ctx.textAlign = 'center';
                    this.ctx.fillText('11 : 9', this.canvas.width / 2, 60);

                    // 대회 이름
                    this.ctx.fillStyle = '#FFD700';
                    this.ctx.font = 'bold 24px Arial';
                    this.ctx.fillText('국제 청소년 탁구 대회 결승', this.canvas.width / 2, 100);
                }
            },

            // 씬 3: 금메달 시상식
            {
                duration: 300,
                update: () => {
                    // 축하 배경
                    this.drawSkyBackground('#FFD700', '#FFA500');

                    // 시상대
                    this.ctx.fillStyle = '#8B4513';
                    // 1등
                    this.ctx.fillRect(this.canvas.width / 2 - 60, this.canvas.height - 250, 120, 150);
                    this.ctx.fillStyle = '#FFD700';
                    this.ctx.font = 'bold 60px Arial';
                    this.ctx.textAlign = 'center';
                    this.ctx.fillText('1', this.canvas.width / 2, this.canvas.height - 130);

                    // 지율이 (시상대 위)
                    this.drawJiyul(
                        this.canvas.width / 2 - 30,
                        this.canvas.height - 350,
                        'idle',
                        0,
                        4
                    );

                    // 금메달
                    this.ctx.save();
                    this.ctx.translate(this.canvas.width / 2, this.canvas.height - 280);

                    // 리본
                    this.ctx.strokeStyle = '#FF0000';
                    this.ctx.lineWidth = 8;
                    this.ctx.beginPath();
                    this.ctx.moveTo(0, -30);
                    this.ctx.lineTo(0, 0);
                    this.ctx.stroke();

                    // 메달
                    const medalSize = 30 + Math.sin(this.animationFrame * 0.1) * 5;
                    this.ctx.fillStyle = '#FFD700';
                    this.ctx.beginPath();
                    this.ctx.arc(0, 0, medalSize, 0, Math.PI * 2);
                    this.ctx.fill();

                    this.ctx.fillStyle = '#000000';
                    this.ctx.font = 'bold 30px Arial';
                    this.ctx.textAlign = 'center';
                    this.ctx.textBaseline = 'middle';
                    this.ctx.fillText('1', 0, 0);
                    this.ctx.restore();

                    // 컨페티
                    for (let i = 0; i < 50; i++) {
                        const x = Math.random() * this.canvas.width;
                        const y = (this.animationFrame * 3 + i * 20) % this.canvas.height;
                        const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF'];
                        this.ctx.fillStyle = colors[i % colors.length];
                        this.ctx.save();
                        this.ctx.translate(x, y);
                        this.ctx.rotate(this.animationFrame * 0.1 + i);
                        this.ctx.fillRect(-5, -5, 10, 10);
                        this.ctx.restore();
                    }

                    // 축하 텍스트
                    this.ctx.fillStyle = '#FF0000';
                    this.ctx.font = 'bold 50px Arial';
                    this.ctx.textAlign = 'center';
                    this.ctx.shadowColor = '#000000';
                    this.ctx.shadowBlur = 10;
                    this.ctx.fillText('🏆 CHAMPION! 🏆', this.canvas.width / 2, 80);
                }
            },

            // 씬 4: 대마왕이 코치가 됨
            {
                duration: 250,
                update: () => {
                    // 화목한 배경
                    this.drawSkyBackground('#87CEEB', '#E0F6FF');

                    // 땅
                    this.drawGround();

                    // 탁구장 건물
                    this.ctx.fillStyle = '#8B7355';
                    this.ctx.fillRect(50, this.canvas.height - 300, 250, 200);
                    this.ctx.fillStyle = '#FFFFFF';
                    this.ctx.font = 'bold 20px Arial';
                    this.ctx.fillText('지율 탁구 클럽', 120, this.canvas.height - 250);

                    // ABC 대마왕 (코치 복장)
                    this.drawBossSprite(
                        'boss20',
                        this.canvas.width / 2 + 50,
                        this.canvas.height - 200,
                        4
                    );

                    // 코치 휘슬
                    this.ctx.fillStyle = '#C0C0C0';
                    this.ctx.fillRect(this.canvas.width / 2 + 100, this.canvas.height - 150, 30, 10);

                    // 지율이
                    this.drawJiyul(
                        this.canvas.width / 2 - 100,
                        this.canvas.height - 170,
                        'idle',
                        0,
                        4
                    );

                    // 대화
                    if (this.animationFrame < 125) {
                        this.drawDialogBox(
                            '코치님! 덕분에 금메달 땄어요!',
                            this.canvas.width / 2 - 100,
                            this.canvas.height - 250,
                            '지율'
                        );
                    } else {
                        this.drawDialogBox(
                            '자랑스럽다!\n이제 영어도 탁구도 최고야!',
                            this.canvas.width / 2 + 100,
                            this.canvas.height - 280,
                            'ABC 코치'
                        );
                    }

                    // 하트 효과
                    for (let i = 0; i < 5; i++) {
                        const heartY = this.canvas.height - 300 - Math.sin(this.animationFrame * 0.05 + i) * 20;
                        this.ctx.font = '30px Arial';
                        this.ctx.fillText('❤️', this.canvas.width / 2 - 50 + i * 30, heartY);
                    }
                }
            },

            // 씬 5: THE END
            {
                duration: 300,
                update: () => {
                    // 무지개 배경
                    const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
                    gradient.addColorStop(0, '#FF0000');
                    gradient.addColorStop(0.17, '#FF7F00');
                    gradient.addColorStop(0.33, '#FFFF00');
                    gradient.addColorStop(0.5, '#00FF00');
                    gradient.addColorStop(0.67, '#0000FF');
                    gradient.addColorStop(0.83, '#4B0082');
                    gradient.addColorStop(1, '#9400D3');
                    this.ctx.fillStyle = gradient;
                    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

                    // 불꽃놀이
                    if (this.animationFrame % 20 === 0) {
                        const x = Math.random() * this.canvas.width;
                        const y = Math.random() * this.canvas.height / 2;
                        this.createExplosion(x, y);
                    }
                    this.updateParticles();

                    // THE END 텍스트
                    this.ctx.save();
                    const scale = 1 + Math.sin(this.animationFrame * 0.05) * 0.1;
                    this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
                    this.ctx.scale(scale, scale);

                    this.ctx.fillStyle = '#FFFFFF';
                    this.ctx.strokeStyle = '#000000';
                    this.ctx.lineWidth = 5;
                    this.ctx.font = 'bold 80px Arial';
                    this.ctx.textAlign = 'center';
                    this.ctx.strokeText('THE END', 0, -50);
                    this.ctx.fillText('THE END', 0, -50);

                    this.ctx.font = 'bold 30px Arial';
                    this.ctx.strokeText('지율이의 영어 대모험', 0, 20);
                    this.ctx.fillText('지율이의 영어 대모험', 0, 20);

                    this.ctx.font = '20px Arial';
                    this.ctx.fillText('영어도 탁구도 최고가 된 지율이!', 0, 60);
                    this.ctx.fillText('다음에 또 만나요!', 0, 90);

                    this.ctx.restore();

                    // 캐릭터들 (작게)
                    this.drawJiyul(50, this.canvas.height - 100, 'walk', Math.floor(this.animationFrame / 8), 3);
                    this.drawBossSprite('boss20', this.canvas.width - 150, this.canvas.height - 120, 3);
                }
            }
        ];
    }

    // 애니메이션 시작
    startOpening(onComplete) {
        this.scenes = this.getOpeningScenes();
        this.currentScene = 0;
        this.animationFrame = 0;
        this.bgScroll = 0;
        this.onComplete = onComplete;
        this.animate();
    }

    startEnding(onComplete) {
        this.scenes = this.getEndingScenes();
        this.currentScene = 0;
        this.animationFrame = 0;
        this.bgScroll = 0;
        this.onComplete = onComplete;
        this.animate();
    }

    // 메인 애니메이션 루프
    animate() {
        if (!this.scenes || this.currentScene >= this.scenes.length) {
            this.cleanupEventListeners(); // 이벤트 리스너 정리
            if (this.onComplete) this.onComplete();
            return;
        }

        const scene = this.scenes[this.currentScene];

        // 씬 업데이트 함수 호출 (스케일 없이 전체 화면 사용)
        if (scene.update) {
            scene.update();
        }

        // 스킵 안내 및 진행 버튼
        this.drawControls();

        // 프레임 증가 (애니메이션은 계속 진행하되, 씬 전환은 사용자 입력 대기)
        this.animationFrame++;

        // 씬이 충분히 표시되었는지 확인 (최소 1초 - 텍스트를 빠르게 읽을 수 있도록)
        const minDisplayTime = 60; // 1초 (60fps 기준) - 빠르게 변경
        if (this.animationFrame >= minDisplayTime && !this.waitingForInput) {
            this.waitingForInput = true;
            this.canProceed = false;
        }

        // 사용자 입력을 기다리고 있고, 입력을 받았다면 다음 씬으로
        if (this.waitingForInput && this.canProceed) {
            this.currentScene++;
            this.animationFrame = 0;
            this.particles = []; // 파티클 초기화
            this.waitingForInput = false;
            this.canProceed = false;
        }

        requestAnimationFrame(() => this.animate());
    }

    // 컨트롤 UI 그리기
    drawControls() {
        // 진행 버튼 그리기 (입력 대기 중일 때만)
        if (this.waitingForInput) {
            // 버튼 배경 (전체 화면 크기 사용)
            const canvasWidth = this.canvas.width;
            const canvasHeight = this.canvas.height;
            const btnWidth = 180;
            const btnHeight = 50;
            const btnX = canvasWidth - btnWidth - 30;
            const btnY = canvasHeight - btnHeight - 30;

            // 애니메이션 효과 (깜빡임)
            const alpha = 0.7 + Math.sin(this.animationFrame * 0.1) * 0.3;

            // 버튼 배경
            this.ctx.fillStyle = `rgba(255, 215, 0, ${alpha})`; // 황금색
            this.ctx.fillRect(btnX, btnY, btnWidth, btnHeight);

            // 버튼 테두리
            this.ctx.strokeStyle = '#FFFFFF';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(btnX, btnY, btnWidth, btnHeight);

            // 버튼 텍스트
            this.ctx.fillStyle = '#000000';
            this.ctx.font = 'bold 18px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('클릭하여 계속 →', btnX + btnWidth/2, btnY + btnHeight/2 + 6);

            // 모바일 안내
            const isMobile = window.matchMedia('(max-width: 800px)').matches;
            if (isMobile) {
                this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                this.ctx.font = '14px Arial';
                this.ctx.fillText('화면을 터치하세요', btnX + btnWidth/2, btnY - 10);
            }
        }

        // 스킵 안내 (좌측 하단) - PC에서만 스페이스바 표시
        const isMobileSkip = window.matchMedia('(max-width: 800px)').matches;
        if (!isMobileSkip) {
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            this.ctx.font = '14px Arial';
            this.ctx.textAlign = 'left';
            this.ctx.fillText('스페이스바: 전체 스킵', 20, this.canvas.height - 20);
        }
    }

    // 스킵
    skip() {
        this.scenes = [];
        this.cleanupEventListeners(); // 이벤트 리스너 정리
        if (this.onComplete) this.onComplete();
    }
}

// 전역 스토리 씬 인스턴스
let storyScene = null;

// 초기화
window.addEventListener('load', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    storyScene = new StoryScene(canvas, ctx);
});