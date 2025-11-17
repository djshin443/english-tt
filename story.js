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

        // SKIP 버튼 설정
        this.skipButton = {
            x: 0,
            y: 0,
            width: 100,
            height: 40,
            hovered: false
        };
        this.updateSkipButtonPosition();

        // 이벤트 리스너 추가
        this.setupEventListeners();
    }

    // SKIP 버튼 위치 업데이트
    updateSkipButtonPosition() {
        this.skipButton.x = this.canvas.width - this.skipButton.width - 20;
        this.skipButton.y = 20;
    }

    // 이벤트 리스너 설정
    setupEventListeners() {
        // 기존 리스너가 있다면 먼저 제거 (중복 방지)
        this.cleanupEventListeners();

        // 바인딩된 함수 참조 저장 (나중에 제거하기 위해)
        this.boundHandleClick = (e) => this.handleInput(e);
        this.boundHandleTouch = (e) => {
            e.preventDefault(); // 기본 터치 동작 방지
            this.handleInput(e);
        };
        this.boundHandleMove = (e) => this.handleMouseMove(e);

        // 클릭 이벤트 (PC)
        this.canvas.addEventListener('click', this.boundHandleClick);

        // 터치 이벤트 (모바일)
        this.canvas.addEventListener('touchstart', this.boundHandleTouch);

        // 마우스 이동 이벤트 (호버 효과)
        this.canvas.addEventListener('mousemove', this.boundHandleMove);
    }

    // 이벤트 리스너 정리
    cleanupEventListeners() {
        if (this.boundHandleClick) {
            this.canvas.removeEventListener('click', this.boundHandleClick);
        }
        if (this.boundHandleTouch) {
            this.canvas.removeEventListener('touchstart', this.boundHandleTouch);
        }
        if (this.boundHandleMove) {
            this.canvas.removeEventListener('mousemove', this.boundHandleMove);
        }
    }

    // 마우스 이동 처리 (호버 효과)
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

    // 입력 처리
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
        if (x >= this.skipButton.x &&
            x <= this.skipButton.x + this.skipButton.width &&
            y >= this.skipButton.y &&
            y <= this.skipButton.y + this.skipButton.height) {
            // 모든 씬 건너뛰고 완료
            this.skipToEnd();
            return;
        }

        // 일반 클릭 - 다음 씬으로
        if (this.waitingForInput) {
            this.canProceed = true;
        }
    }

    // 오프닝 건너뛰기
    skipToEnd() {
        this.cleanupEventListeners();
        if (this.onComplete) {
            this.onComplete();
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

    // 세은 캐릭터 그리기
    drawSeeun(x, y, animation = 'idle', frame = 0, scale = 4, flipH = false) {
        const spriteData = pixelData.seeun;
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

    // 하린 캐릭터 그리기
    drawHarin(x, y, animation = 'idle', frame = 0, scale = 4, flipH = false) {
        const spriteData = pixelData.harin;
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

        // 박스 위치 - 항상 화면 하단에 배치 (y 파라미터 무시)
        const boxX = x - boxWidth / 2;
        const boxY = this.canvas.height - boxHeight - 10;  // 화면 하단에서 10px 여백

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
                    this.ctx.textAlign = 'center';
                    this.ctx.fillText('영어학원', 150, this.canvas.height - 200);
                    this.ctx.textAlign = 'left';

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
                    this.ctx.textAlign = 'center';
                    this.ctx.fillText('영어학원', 150, this.canvas.height - 200);
                    this.ctx.textAlign = 'left';

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

            // 씬 4-1: ABC 대마왕 등장 - 첫 번째 대사
            {
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
                    const auraRadius = 120;
                    const rotationSpeed = 0.02;

                    for (let i = 0; i < alphabet.length; i++) {
                        const angle = (this.animationFrame * rotationSpeed) + (i * (Math.PI * 2) / alphabet.length);
                        const x = bossCenterX + Math.cos(angle) * auraRadius;
                        const y = bossCenterY + Math.sin(angle) * auraRadius;

                        const sizeWave = 1 + Math.sin(this.animationFrame * 0.1 + i * 0.5) * 0.2;
                        const fontSize = 20 * sizeWave;

                        const hue = (i * 360 / alphabet.length + this.animationFrame) % 360;
                        this.ctx.fillStyle = `hsl(${hue}, 80%, 60%)`;
                        this.ctx.font = `bold ${fontSize}px Arial`;
                        this.ctx.textAlign = 'center';
                        this.ctx.textBaseline = 'middle';

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
                        true
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

                    // ABC 대마왕 첫 번째 대사
                    this.drawDialogBox(
                        '안녕~! 나는 ABC 대마왕!\n영어 친구들아 모여라! 크크크!',
                        this.canvas.width / 2,
                        this.canvas.height - 250,
                        'ABC 대마왕'
                    );
                }
            },

            // 씬 4-2: ABC 대마왕 두 번째 대사
            {
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

                    // ABC 대마왕
                    const bossScale = 6 + Math.sin(this.animationFrame * 0.05) * 0.5;
                    const bossY = this.canvas.height / 3;
                    const bossCenterX = this.canvas.width / 2;
                    const bossCenterY = bossY + bossScale * 8;

                    // 알파벳 아우라
                    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                    const auraRadius = 120;
                    const rotationSpeed = 0.02;

                    for (let i = 0; i < alphabet.length; i++) {
                        const angle = (this.animationFrame * rotationSpeed) + (i * (Math.PI * 2) / alphabet.length);
                        const x = bossCenterX + Math.cos(angle) * auraRadius;
                        const y = bossCenterY + Math.sin(angle) * auraRadius;

                        const sizeWave = 1 + Math.sin(this.animationFrame * 0.1 + i * 0.5) * 0.2;
                        const fontSize = 20 * sizeWave;

                        const hue = (i * 360 / alphabet.length + this.animationFrame) % 360;
                        this.ctx.fillStyle = `hsl(${hue}, 80%, 60%)`;
                        this.ctx.font = `bold ${fontSize}px Arial`;
                        this.ctx.textAlign = 'center';
                        this.ctx.textBaseline = 'middle';

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
                        true
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

                    // ABC 대마왕 두 번째 대사
                    this.drawDialogBox(
                        '이제부터 너희는 영어만 공부해야 해!\n탁구는 금지! 오직 영어 공부만! 하하하!',
                        this.canvas.width / 2,
                        this.canvas.height - 250,
                        'ABC 대마왕'
                    );
                }
            },

            // 씬 4-3: 지율이 반응
            {
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

                    // ABC 대마왕
                    const bossScale = 6 + Math.sin(this.animationFrame * 0.05) * 0.5;
                    const bossY = this.canvas.height / 3;
                    const bossCenterX = this.canvas.width / 2;
                    const bossCenterY = bossY + bossScale * 8;

                    // 알파벳 아우라
                    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                    const auraRadius = 120;
                    const rotationSpeed = 0.02;

                    for (let i = 0; i < alphabet.length; i++) {
                        const angle = (this.animationFrame * rotationSpeed) + (i * (Math.PI * 2) / alphabet.length);
                        const x = bossCenterX + Math.cos(angle) * auraRadius;
                        const y = bossCenterY + Math.sin(angle) * auraRadius;

                        const sizeWave = 1 + Math.sin(this.animationFrame * 0.1 + i * 0.5) * 0.2;
                        const fontSize = 20 * sizeWave;

                        const hue = (i * 360 / alphabet.length + this.animationFrame) % 360;
                        this.ctx.fillStyle = `hsl(${hue}, 80%, 60%)`;
                        this.ctx.font = `bold ${fontSize}px Arial`;
                        this.ctx.textAlign = 'center';
                        this.ctx.textBaseline = 'middle';

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
                        true
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

                    // 지율이 대사
                    this.drawDialogBox(
                        '뭐라고?! 탁구는 내 생명인데!\n절대 포기 못 해!',
                        this.canvas.width / 4,
                        this.canvas.height - 300,
                        '지율'
                    );
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
                    this.ctx.textAlign = 'center';
                    this.ctx.fillText('✨ 제니스 영어학원 ✨', 175, this.canvas.height - 275);
                    this.ctx.textAlign = 'left';

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
                    this.ctx.textAlign = 'center';
                    this.ctx.fillText('✨ 제니스 영어학원 ✨', 175, this.canvas.height - 275);
                    this.ctx.textAlign = 'left';

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
                    this.ctx.textAlign = 'center';
                    this.ctx.fillText('✨ 제니스 영어학원 ✨', 175, this.canvas.height - 275);
                    this.ctx.textAlign = 'left';

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
                    this.ctx.textAlign = 'center';
                    this.ctx.fillText('✨ 제니스 영어학원 ✨', 175, this.canvas.height - 275);
                    this.ctx.textAlign = 'left';

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

            // 씬 5-5: 세은과 하린 등장!
            {
                update: () => {
                    // 신비로운 보라색 하늘
                    this.drawSkyBackground('#9370DB', '#DDA0DD');

                    // 땅
                    this.drawGround();

                    // 제니스 영어학원 건물
                    this.ctx.fillStyle = '#8B7355';
                    this.ctx.fillRect(50, this.canvas.height - 280, 250, 180);
                    this.ctx.fillStyle = '#FFFFFF';
                    this.ctx.font = 'bold 20px Arial';
                    this.ctx.textAlign = 'center';
                    this.ctx.fillText('제니스 영어학원', 175, this.canvas.height - 230);
                    this.ctx.textAlign = 'left';

                    // 지율이 (왼쪽)
                    this.drawJiyul(this.canvas.width / 2 - 150, this.canvas.height - 170, 'idle', 0, 4);

                    // 세은이 등장 (오른쪽에서 걸어옴)
                    const seeunX = Math.min(this.canvas.width / 2 + 50, this.canvas.width - 200 - this.animationFrame * 3);
                    this.drawSeeun(
                        seeunX,
                        this.canvas.height - 170,
                        'walk',
                        Math.floor(this.animationFrame / 8),
                        4,
                        true
                    );

                    // 하린이 등장 (세은 뒤에서)
                    const harinX = Math.min(this.canvas.width / 2 + 150, this.canvas.width - 100 - this.animationFrame * 2.5);
                    this.drawHarin(
                        harinX,
                        this.canvas.height - 170,
                        'walk',
                        Math.floor(this.animationFrame / 8),
                        4,
                        true
                    );

                    // 세은이 대사
                    if (this.animationFrame > 60) {
                        this.drawDialogBox(
                            '지율아! 나도 빠질 수 없지!',
                            this.canvas.width / 2 + 50,
                            this.canvas.height - 300,
                            '세은'
                        );
                    }
                }
            },

            // 씬 5-6: 하린이 대사
            {
                update: () => {
                    // 신비로운 보라색 하늘
                    this.drawSkyBackground('#9370DB', '#DDA0DD');

                    // 땅
                    this.drawGround();

                    // 제니스 영어학원 건물
                    this.ctx.fillStyle = '#8B7355';
                    this.ctx.fillRect(50, this.canvas.height - 280, 250, 180);
                    this.ctx.fillStyle = '#FFFFFF';
                    this.ctx.font = 'bold 20px Arial';
                    this.ctx.textAlign = 'center';
                    this.ctx.fillText('제니스 영어학원', 175, this.canvas.height - 230);
                    this.ctx.textAlign = 'left';

                    // 지율이 (왼쪽)
                    this.drawJiyul(this.canvas.width / 2 - 150, this.canvas.height - 170, 'idle', 0, 4);

                    // 세은이 (중앙)
                    this.drawSeeun(this.canvas.width / 2, this.canvas.height - 170, 'idle', 0, 4);

                    // 하린이 (오른쪽)
                    this.drawHarin(this.canvas.width / 2 + 120, this.canvas.height - 170, 'idle', 0, 4);

                    // 하린이 대사
                    this.drawDialogBox(
                        '나도! 나도 빠질 수 없어!',
                        this.canvas.width / 2 + 120,
                        this.canvas.height - 300,
                        '하린'
                    );
                }
            },

            // 씬 5-7: 선제로가 세은에게 청룡언월도 라켓 수여
            {
                update: () => {
                    // 초록빛 하늘 (청룡언월도 테마)
                    this.drawSkyBackground('#90EE90', '#98FB98');

                    // 땅
                    this.drawGround();

                    // 세은이 (중앙에 크게)
                    this.drawSeeun(this.canvas.width / 2 - 40, this.canvas.height - 220, 'jump', 0, 5);

                    // 청룡언월도 (초록색 창 - 세은 위에)
                    this.ctx.save();
                    this.ctx.translate(this.canvas.width / 2, this.canvas.height - 350);
                    this.ctx.rotate(Math.sin(this.animationFrame * 0.1) * 0.2);

                    // 광채
                    const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, 80);
                    gradient.addColorStop(0, 'rgba(34, 139, 34, 0.8)');
                    gradient.addColorStop(1, 'rgba(34, 139, 34, 0)');
                    this.ctx.fillStyle = gradient;
                    this.ctx.beginPath();
                    this.ctx.arc(0, 0, 80, 0, Math.PI * 2);
                    this.ctx.fill();

                    // 창 자루
                    this.ctx.fillStyle = '#8B4513';
                    this.ctx.fillRect(-5, -40, 10, 80);

                    // 날 (초록색)
                    const bladeGradient = this.ctx.createLinearGradient(-20, -60, 20, -60);
                    bladeGradient.addColorStop(0, '#228B22');
                    bladeGradient.addColorStop(0.5, '#32CD32');
                    bladeGradient.addColorStop(1, '#228B22');
                    this.ctx.fillStyle = bladeGradient;
                    this.ctx.beginPath();
                    this.ctx.moveTo(-20, -50);
                    this.ctx.lineTo(0, -80);
                    this.ctx.lineTo(20, -50);
                    this.ctx.lineTo(0, -45);
                    this.ctx.closePath();
                    this.ctx.fill();

                    this.ctx.restore();

                    // 반짝임
                    for (let i = 0; i < 6; i++) {
                        const angle = this.animationFrame * 0.05 + i * Math.PI / 3;
                        const sparkX = this.canvas.width / 2 + Math.cos(angle) * 60;
                        const sparkY = this.canvas.height - 350 + Math.sin(angle) * 60;
                        this.ctx.fillStyle = '#00FF00';
                        this.ctx.font = '20px Arial';
                        this.ctx.fillText('✨', sparkX, sparkY);
                    }

                    // 대사
                    this.drawDialogBox(
                        '청룡언월도 라켓이야!\n휘두르면 토네이도가 생긴단다. 바람처럼 빠르지!',
                        this.canvas.width / 2,
                        this.canvas.height - 120,
                        'sunzero 선생님'
                    );
                }
            },

            // 씬 5-8: 선제로가 하린에게 사인검 라켓 수여
            {
                update: () => {
                    // 보라빛 하늘 (사인검 테마)
                    this.drawSkyBackground('#9370DB', '#BA55D3');

                    // 땅
                    this.drawGround();

                    // 하린이 (중앙에 크게)
                    this.drawHarin(this.canvas.width / 2 - 40, this.canvas.height - 220, 'jump', 0, 5);

                    // 사인검 (보라색 검 - 하린 위에)
                    this.ctx.save();
                    this.ctx.translate(this.canvas.width / 2, this.canvas.height - 350);
                    this.ctx.rotate(Math.sin(this.animationFrame * 0.1) * 0.3);

                    // 광채
                    const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, 80);
                    gradient.addColorStop(0, 'rgba(138, 43, 226, 0.8)');
                    gradient.addColorStop(1, 'rgba(138, 43, 226, 0)');
                    this.ctx.fillStyle = gradient;
                    this.ctx.beginPath();
                    this.ctx.arc(0, 0, 80, 0, Math.PI * 2);
                    this.ctx.fill();

                    // 검 자루
                    this.ctx.fillStyle = '#4B0082';
                    this.ctx.fillRect(-6, 0, 12, 30);

                    // 검날 (보라색)
                    const bladeGradient = this.ctx.createLinearGradient(-15, -60, 15, -60);
                    bladeGradient.addColorStop(0, '#8A2BE2');
                    bladeGradient.addColorStop(0.5, '#BA55D3');
                    bladeGradient.addColorStop(1, '#8A2BE2');
                    this.ctx.fillStyle = bladeGradient;
                    this.ctx.fillRect(-15, -60, 30, 60);

                    // 검 끝
                    this.ctx.beginPath();
                    this.ctx.moveTo(-15, -60);
                    this.ctx.lineTo(0, -75);
                    this.ctx.lineTo(15, -60);
                    this.ctx.closePath();
                    this.ctx.fill();

                    // 번개 효과
                    this.ctx.strokeStyle = '#FFFF00';
                    this.ctx.lineWidth = 3;
                    this.ctx.beginPath();
                    this.ctx.moveTo(-10, -50);
                    this.ctx.lineTo(10, -30);
                    this.ctx.moveTo(5, -30);
                    this.ctx.lineTo(-5, -10);
                    this.ctx.stroke();

                    this.ctx.restore();

                    // 반짝임
                    for (let i = 0; i < 6; i++) {
                        const angle = this.animationFrame * 0.07 + i * Math.PI / 3;
                        const sparkX = this.canvas.width / 2 + Math.cos(angle) * 60;
                        const sparkY = this.canvas.height - 350 + Math.sin(angle) * 60;
                        this.ctx.fillStyle = '#FF00FF';
                        this.ctx.font = '20px Arial';
                        this.ctx.fillText('⚡', sparkX, sparkY);
                    }

                    // 대사
                    this.drawDialogBox(
                        '사인검 라켓이야!\n휘두르면 번개 체인이 찌릿찌릿! 신기하지?',
                        this.canvas.width / 2,
                        this.canvas.height - 120,
                        'sunzero 선생님'
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
                update: () => {
                    // 경기장 배경 (스크롤링)
                    this.drawSkyBackground('#4169E1', '#87CEEB');

                    // 구름 배경 (왼쪽으로 스크롤)
                    const scrollSpeed = 1;
                    const cloudScroll = (this.animationFrame * scrollSpeed) % 200;

                    for (let i = 0; i < 5; i++) {
                        const cloudX = (i * 200 - cloudScroll) % this.canvas.width;
                        const cloudY = 50 + i * 30;

                        // 구름 그리기
                        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
                        this.ctx.beginPath();
                        this.ctx.arc(cloudX, cloudY, 20, 0, Math.PI * 2);
                        this.ctx.arc(cloudX + 20, cloudY, 25, 0, Math.PI * 2);
                        this.ctx.arc(cloudX + 40, cloudY, 20, 0, Math.PI * 2);
                        this.ctx.fill();
                    }

                    // 관중석 (아기자기하게!)
                    // 그라디언트 배경
                    const audienceGradient = this.ctx.createLinearGradient(0, 100, 0, 280);
                    audienceGradient.addColorStop(0, '#FFE4E1');  // 미스티 로즈
                    audienceGradient.addColorStop(0.5, '#E6E6FA'); // 라벤더
                    audienceGradient.addColorStop(1, '#FFB6C1');   // 라이트 핑크
                    this.ctx.fillStyle = audienceGradient;
                    this.ctx.fillRect(0, 100, this.canvas.width, 180);

                    // 좌석 구분선 (가로줄)
                    this.ctx.strokeStyle = '#FFD700';
                    this.ctx.lineWidth = 2;
                    for (let i = 0; i < 6; i++) {
                        const lineY = 100 + i * 30;
                        this.ctx.beginPath();
                        this.ctx.moveTo(0, lineY);
                        this.ctx.lineTo(this.canvas.width, lineY);
                        this.ctx.stroke();
                    }

                    // 반짝이는 별 장식 (배경)
                    for (let i = 0; i < 20; i++) {
                        const starX = (i * 40 + this.animationFrame * 0.5) % this.canvas.width;
                        const starY = 105 + (i % 5) * 35;
                        this.ctx.fillStyle = i % 2 === 0 ? '#FFD700' : '#FFFFFF';
                        this.ctx.font = '12px Arial';
                        this.ctx.fillText('⭐', starX, starY);
                    }

                    // 테두리
                    this.ctx.strokeStyle = '#FF69B4';
                    this.ctx.lineWidth = 4;
                    this.ctx.strokeRect(0, 100, this.canvas.width, 180);

                    // 관중 캐릭터들 (귀여운 픽셀 스타일)
                    const audienceTypes = [
                        // 타입 1: 남자아이
                        {
                            sprite: [
                                [0,1,1,1,0],
                                [1,2,2,2,1],
                                [2,3,2,3,2],
                                [2,2,2,2,2],
                                [0,4,4,4,0],
                                [4,4,4,4,4],
                                [0,5,0,5,0]
                            ],
                            colors: {
                                1: '#2C1810', 2: '#FFE0BD', 3: '#000000',
                                4: '#4169E1', 5: '#8B4513'
                            }
                        },
                        // 타입 2: 여자아이
                        {
                            sprite: [
                                [1,1,1,1,1],
                                [1,2,2,2,1],
                                [2,3,2,3,2],
                                [2,2,5,2,2],
                                [0,6,6,6,0],
                                [6,6,6,6,6],
                                [0,7,0,7,0]
                            ],
                            colors: {
                                1: '#FF69B4', 2: '#FFE0BD', 3: '#000000',
                                5: '#FF1493', 6: '#FFC0CB', 7: '#FFD700'
                            }
                        },
                        // 타입 3: 아이 (귀여운)
                        {
                            sprite: [
                                [0,1,1,1,0],
                                [1,2,2,2,1],
                                [2,3,2,3,2],
                                [2,2,2,2,2],
                                [0,4,4,4,0],
                                [4,4,4,4,4],
                                [0,5,0,5,0]
                            ],
                            colors: {
                                1: '#FFD700', 2: '#FFE0BD', 3: '#000000',
                                4: '#00FF00', 5: '#FF6347'
                            }
                        }
                    ];

                    // 관중들 그리기 (전체 가득 채우기!)
                    const totalCols = Math.floor(this.canvas.width / 27);
                    for (let row = 0; row < 5; row++) {
                        for (let col = 0; col < totalCols; col++) {
                            const x = col * 27 + 5;
                            const y = 105 + row * 32;

                            // 랜덤하게 캐릭터 타입 선택 (시드 사용해서 매번 같은 위치에 같은 캐릭터)
                            const seed = row * 100 + col;
                            const typeIndex = seed % audienceTypes.length;
                            const audience = audienceTypes[typeIndex];

                            const scale = 3;

                            // 픽셀 스프라이트 그리기
                            for (let r = 0; r < audience.sprite.length; r++) {
                                for (let c = 0; c < audience.sprite[r].length; c++) {
                                    const pixel = audience.sprite[r][c];
                                    if (pixel !== 0 && audience.colors[pixel]) {
                                        this.ctx.fillStyle = audience.colors[pixel];
                                        this.ctx.fillRect(
                                            x + c * scale,
                                            y + r * scale,
                                            scale,
                                            scale
                                        );
                                    }
                                }
                            }

                            // 응원 애니메이션 (손 흔들기 또는 응원봉)
                            if ((seed + this.animationFrame) % 30 < 15) {
                                // 반짝이는 응원봉
                                const pompomColors = ['#FFD700', '#FF69B4', '#00FF00', '#FF6347'];
                                this.ctx.fillStyle = pompomColors[seed % pompomColors.length];
                                this.ctx.fillRect(x + 2 * scale, y - 5, scale * 2, scale);

                                // 반짝임
                                if (this.animationFrame % 10 < 5) {
                                    this.ctx.fillStyle = '#FFFFFF';
                                    this.ctx.fillRect(x + 2 * scale, y - 6, scale, scale);
                                }
                            }
                        }
                    }

                    // 탁구대 (현실적으로!)
                    const tableX = this.canvas.width / 2 - 250;
                    const tableY = this.canvas.height - 160;
                    const tableWidth = 500;
                    const tableHeight = 15;

                    // 테이블 그림자
                    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
                    this.ctx.fillRect(tableX + 5, tableY + 5, tableWidth, tableHeight);

                    // 테이블 메인 색상 (다크 블루)
                    const tableGradient = this.ctx.createLinearGradient(tableX, tableY, tableX, tableY + tableHeight);
                    tableGradient.addColorStop(0, '#1a5f7a');
                    tableGradient.addColorStop(0.5, '#0d3b52');
                    tableGradient.addColorStop(1, '#0a2e42');
                    this.ctx.fillStyle = tableGradient;
                    this.ctx.fillRect(tableX, tableY, tableWidth, tableHeight);

                    // 테이블 가장자리 하이라이트
                    this.ctx.strokeStyle = '#2a7faa';
                    this.ctx.lineWidth = 2;
                    this.ctx.strokeRect(tableX, tableY, tableWidth, tableHeight);

                    // 중앙선 (흰색)
                    this.ctx.strokeStyle = '#FFFFFF';
                    this.ctx.lineWidth = 2;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.canvas.width / 2, tableY);
                    this.ctx.lineTo(this.canvas.width / 2, tableY + tableHeight);
                    this.ctx.stroke();

                    // 테이블 엣지 라인
                    this.ctx.strokeStyle = '#FFFFFF';
                    this.ctx.lineWidth = 3;
                    this.ctx.strokeRect(tableX + 2, tableY + 2, tableWidth - 4, tableHeight - 4);

                    // 네트 (디테일하게)
                    const netX = this.canvas.width / 2;
                    const netY = tableY - 20;
                    const netHeight = 20;

                    // 네트 기둥 (왼쪽)
                    this.ctx.fillStyle = '#404040';
                    this.ctx.fillRect(netX - 60, netY, 5, netHeight);

                    // 네트 기둥 (오른쪽)
                    this.ctx.fillRect(netX + 55, netY, 5, netHeight);

                    // 네트 망 (격자무늬)
                    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
                    this.ctx.lineWidth = 1;
                    for (let i = 0; i < 5; i++) {
                        this.ctx.beginPath();
                        this.ctx.moveTo(netX - 55, netY + i * 8);
                        this.ctx.lineTo(netX + 55, netY + i * 8);
                        this.ctx.stroke();
                    }
                    for (let i = 0; i < 15; i++) {
                        this.ctx.beginPath();
                        this.ctx.moveTo(netX - 55 + i * 8, netY);
                        this.ctx.lineTo(netX - 55 + i * 8, netY + netHeight);
                        this.ctx.stroke();
                    }

                    // 네트 상단 라인
                    this.ctx.strokeStyle = '#FFFFFF';
                    this.ctx.lineWidth = 3;
                    this.ctx.beginPath();
                    this.ctx.moveTo(netX - 60, netY);
                    this.ctx.lineTo(netX + 60, netY);
                    this.ctx.stroke();

                    // 탁구대 다리 (4개) - 길게
                    const legHeight = 110;
                    this.ctx.fillStyle = '#1a1a1a';
                    // 왼쪽 앞다리
                    this.ctx.fillRect(tableX + 20, tableY + tableHeight, 15, legHeight);
                    // 왼쪽 뒷다리
                    this.ctx.fillRect(tableX + 80, tableY + tableHeight, 15, legHeight);
                    // 오른쪽 앞다리
                    this.ctx.fillRect(tableX + tableWidth - 95, tableY + tableHeight, 15, legHeight);
                    // 오른쪽 뒷다리
                    this.ctx.fillRect(tableX + tableWidth - 35, tableY + tableHeight, 15, legHeight);

                    // 다리 하이라이트
                    this.ctx.strokeStyle = '#333333';
                    this.ctx.lineWidth = 2;
                    this.ctx.strokeRect(tableX + 20, tableY + tableHeight, 15, legHeight);
                    this.ctx.strokeRect(tableX + 80, tableY + tableHeight, 15, legHeight);
                    this.ctx.strokeRect(tableX + tableWidth - 95, tableY + tableHeight, 15, legHeight);
                    this.ctx.strokeRect(tableX + tableWidth - 35, tableY + tableHeight, 15, legHeight);

                    // 지율이 (승리 포즈) - 탁구대 왼쪽 멀리
                    this.drawJiyul(
                        this.canvas.width / 2 - 350,
                        this.canvas.height - 180,
                        'jump',
                        0,
                        4
                    );

                    // 상대 선수 (지율이 아빠 - 귀여운 SD 캐릭터)
                    const opponentSprite = [
                        [0,0,0,1,1,1,1,1,1,1,1,0,0,0],  // 짧은 머리
                        [0,0,1,1,1,1,1,1,1,1,1,1,0,0],
                        [0,1,1,1,1,1,1,1,1,1,1,1,1,0],
                        [1,1,2,2,2,2,2,2,2,2,2,2,1,1],  // 얼굴
                        [1,2,2,3,3,2,2,2,3,3,2,2,2,1],  // 눈썹
                        [1,2,2,4,4,4,2,2,4,4,4,2,2,1],  // 눈 흰자 (지율이와 똑같이)
                        [1,2,2,4,4,5,2,2,4,4,5,2,2,1],  // 검은 눈동자 오른쪽 아래
                        [0,2,2,2,2,2,2,2,2,2,2,2,0,0],  // 얼굴
                        [0,2,2,2,7,7,7,7,2,2,2,2,0,0],  // 웃는 입
                        [0,0,8,8,8,8,8,8,8,8,0,0,0,0],  // 파란 운동복
                        [0,8,8,8,9,9,9,8,8,8,8,0,0,0],  // 운동복 + 번호
                        [8,8,8,8,8,8,8,8,8,8,8,8,0,0],
                        [0,2,2,8,8,8,8,8,8,2,2,0,0,0],  // 팔
                        [0,0,10,10,10,10,10,10,10,10,0,0,0,0],  // 남색 바지
                        [0,0,10,10,10,10,10,10,10,10,0,0,0,0],
                        [0,0,11,11,0,0,0,0,11,11,0,0,0,0]  // 신발
                    ];

                    const opponentColors = {
                        0: null,
                        1: '#2C1810',    // 짙은 갈색 머리
                        2: '#FFE0BD',    // 살색
                        3: '#654321',    // 갈색 눈썹
                        4: '#FFFFFF',    // 흰 눈
                        5: '#000000',    // 검은 눈동자
                        7: '#FF69B4',    // 핑크 미소
                        8: '#4169E1',    // 파란 운동복
                        9: '#FFD700',    // 금색 번호
                        10: '#2C3E50',   // 진한 남색 바지
                        11: '#FFFFFF'    // 하얀 운동화
                    };

                    const opponentScale = 5;
                    const opponentX = this.canvas.width / 2 + 280;
                    const opponentY = this.canvas.height - 180;

                    for (let row = 0; row < opponentSprite.length; row++) {
                        for (let col = 0; col < opponentSprite[row].length; col++) {
                            const pixel = opponentSprite[row][col];
                            if (pixel !== 0 && opponentColors[pixel]) {
                                this.ctx.fillStyle = opponentColors[pixel];
                                this.ctx.fillRect(
                                    opponentX + col * opponentScale,
                                    opponentY + row * opponentScale,
                                    opponentScale,
                                    opponentScale
                                );
                            }
                        }
                    }

                    // 지율이 라켓 (작게)
                    const jiyulRacketX = this.canvas.width / 2 - 320;
                    const jiyulRacketY = this.canvas.height - 150;

                    // 라켓 손잡이
                    this.ctx.fillStyle = '#8B4513';
                    this.ctx.fillRect(jiyulRacketX - 15, jiyulRacketY + 18, 5, 20);

                    // 라켓 면 (보라색)
                    this.ctx.fillStyle = '#9370DB';
                    this.ctx.strokeStyle = '#8B4513';
                    this.ctx.lineWidth = 2;
                    this.ctx.beginPath();
                    this.ctx.ellipse(jiyulRacketX - 12, jiyulRacketY, 14, 18, -0.3, 0, Math.PI * 2);
                    this.ctx.fill();
                    this.ctx.stroke();

                    // 라켓 고무 (검정)
                    this.ctx.fillStyle = '#000000';
                    this.ctx.beginPath();
                    this.ctx.ellipse(jiyulRacketX - 12, jiyulRacketY, 11, 15, -0.3, 0, Math.PI * 2);
                    this.ctx.fill();

                    // 아빠 라켓 (작게)
                    const dadRacketX = opponentX + 35;
                    const dadRacketY = opponentY + 30;

                    // 라켓 손잡이
                    this.ctx.fillStyle = '#654321';
                    this.ctx.fillRect(dadRacketX + 10, dadRacketY + 18, 5, 20);

                    // 라켓 면
                    this.ctx.fillStyle = '#4169E1';
                    this.ctx.strokeStyle = '#654321';
                    this.ctx.lineWidth = 2;
                    this.ctx.beginPath();
                    this.ctx.ellipse(dadRacketX + 12, dadRacketY, 14, 18, 0.3, 0, Math.PI * 2);
                    this.ctx.fill();
                    this.ctx.stroke();

                    // 라켓 고무 (검정)
                    this.ctx.fillStyle = '#000000';
                    this.ctx.beginPath();
                    this.ctx.ellipse(dadRacketX + 12, dadRacketY, 11, 15, 0.3, 0, Math.PI * 2);
                    this.ctx.fill();

                    // 탁구공 애니메이션
                    const ballX = this.canvas.width / 2 - 100 + Math.sin(this.animationFrame * 0.1) * 100;
                    const ballY = this.canvas.height - 300 - Math.abs(Math.sin(this.animationFrame * 0.1)) * 50;
                    this.ctx.fillStyle = '#FFFFFF';
                    this.ctx.strokeStyle = '#FFD700';
                    this.ctx.lineWidth = 2;
                    this.ctx.beginPath();
                    this.ctx.arc(ballX, ballY, 8, 0, Math.PI * 2);
                    this.ctx.fill();
                    this.ctx.stroke();

                    // 점수판 (아기자기하게)
                    const scoreboardX = this.canvas.width / 2 - 120;
                    const scoreboardY = 20;

                    // 점수판 배경 (그라디언트)
                    const scoreGradient = this.ctx.createLinearGradient(
                        scoreboardX, scoreboardY,
                        scoreboardX, scoreboardY + 80
                    );
                    scoreGradient.addColorStop(0, '#FFB6C1');
                    scoreGradient.addColorStop(0.5, '#FFC0CB');
                    scoreGradient.addColorStop(1, '#FFB6C1');
                    this.ctx.fillStyle = scoreGradient;
                    this.ctx.fillRect(scoreboardX, scoreboardY, 240, 80);

                    // 점수판 테두리 (금색)
                    this.ctx.strokeStyle = '#FFD700';
                    this.ctx.lineWidth = 4;
                    this.ctx.strokeRect(scoreboardX, scoreboardY, 240, 80);

                    // 내부 하얀 테두리
                    this.ctx.strokeStyle = '#FFFFFF';
                    this.ctx.lineWidth = 2;
                    this.ctx.strokeRect(scoreboardX + 5, scoreboardY + 5, 230, 70);

                    // 반짝이는 별 (점수판 장식)
                    this.ctx.font = '20px Arial';
                    this.ctx.fillText('✨', scoreboardX + 15, scoreboardY + 25);
                    this.ctx.fillText('✨', scoreboardX + 215, scoreboardY + 25);

                    // 점수 텍스트
                    this.ctx.fillStyle = '#FF1493';
                    this.ctx.font = 'bold 45px Arial';
                    this.ctx.textAlign = 'center';
                    this.ctx.textBaseline = 'middle';

                    // 그림자 효과
                    this.ctx.shadowColor = '#FFFFFF';
                    this.ctx.shadowBlur = 10;
                    this.ctx.fillText('11 : 9', this.canvas.width / 2, scoreboardY + 40);
                    this.ctx.shadowBlur = 0;

                    // 하트 장식
                    this.ctx.font = '25px Arial';
                    this.ctx.fillText('💖', scoreboardX + 30, scoreboardY + 65);
                    this.ctx.fillText('💖', scoreboardX + 210, scoreboardY + 65);

                    // 현수막 배경
                    const bannerY = 270;
                    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                    this.ctx.strokeStyle = '#FFD700';
                    this.ctx.lineWidth = 4;
                    this.ctx.beginPath();
                    this.ctx.roundRect(this.canvas.width / 2 - 280, bannerY - 40, 560, 70, 10);
                    this.ctx.fill();
                    this.ctx.stroke();

                    // 현수막 테두리 장식
                    this.ctx.strokeStyle = '#FF69B4';
                    this.ctx.lineWidth = 2;
                    this.ctx.beginPath();
                    this.ctx.roundRect(this.canvas.width / 2 - 275, bannerY - 35, 550, 60, 8);
                    this.ctx.stroke();

                    // 대회 이름
                    this.ctx.fillStyle = '#FF1493';
                    this.ctx.font = 'bold 28px Arial';
                    this.ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
                    this.ctx.shadowBlur = 4;
                    this.ctx.fillText('🏆 세기의 탁구 대회 결승전 🏆', this.canvas.width / 2, bannerY - 10);
                    this.ctx.shadowBlur = 0;

                    // 특별한 설명
                    this.ctx.fillStyle = '#4169E1';
                    this.ctx.font = 'bold 18px Arial';
                    this.ctx.fillText('제니스 대표 지율이 vs 동네 탁구장 대표 아빠', this.canvas.width / 2, bannerY + 15);

                    // ⭐⭐⭐ 중계 멘트 (화려하게!) ⭐⭐⭐
                    const commentaryY = 350;

                    // 중계석 배경 (반투명 검정)
                    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
                    this.ctx.fillRect(0, commentaryY - 10, this.canvas.width, 60);

                    // 중계석 테두리 (금색, 애니메이션)
                    const borderPulse = 2 + Math.sin(this.animationFrame * 0.15) * 1;
                    this.ctx.strokeStyle = '#FFD700';
                    this.ctx.lineWidth = borderPulse;
                    this.ctx.strokeRect(2, commentaryY - 8, this.canvas.width - 4, 56);

                    // 중계 멘트 (애니메이션으로 변경)
                    const commentaries = [
                        '⚡ 여기는 세기의 탁구 대회 결승전!!! ⚡',
                        '🔥 제니스 대표 지율이 선수의 등장입니다!!! 🔥',
                        '💪 지율이 선수의 강력한 스매싱!!! 💪',
                        '🏓 동네 탁구장 대표 아빠의 수비도 만만치 않습니다!!! 🏓',
                        '✨ 도마뱀 대표 키위도 선전하고 있습니다! ✨',
                        '🎯 제니스 대표 지율이 선수가 11:9로 우승!!! 🎯'
                    ];

                    const commentaryIndex = Math.floor(this.animationFrame / 200) % commentaries.length;
                    const commentary = commentaries[commentaryIndex];

                    // 중계 멘트 배경 (번쩍번쩍)
                    const bgPulse = 0.7 + Math.sin(this.animationFrame * 0.2) * 0.3;
                    const commentGradient = this.ctx.createLinearGradient(0, commentaryY, this.canvas.width, commentaryY + 40);
                    commentGradient.addColorStop(0, `rgba(255, 0, 0, ${bgPulse})`);
                    commentGradient.addColorStop(0.5, `rgba(255, 215, 0, ${bgPulse})`);
                    commentGradient.addColorStop(1, `rgba(255, 0, 0, ${bgPulse})`);
                    this.ctx.fillStyle = commentGradient;
                    this.ctx.fillRect(10, commentaryY, this.canvas.width - 20, 40);

                    // 중계 멘트 텍스트 (번쩍이는 효과)
                    const textScale = 1 + Math.sin(this.animationFrame * 0.1) * 0.05;
                    this.ctx.save();
                    this.ctx.translate(this.canvas.width / 2, commentaryY + 20);
                    this.ctx.scale(textScale, textScale);

                    // 텍스트 외곽선 (검정)
                    this.ctx.strokeStyle = '#000000';
                    this.ctx.lineWidth = 6;
                    this.ctx.font = 'bold 24px Arial';
                    this.ctx.textAlign = 'center';
                    this.ctx.textBaseline = 'middle';
                    this.ctx.strokeText(commentary, 0, 0);

                    // 텍스트 메인 (흰색)
                    this.ctx.fillStyle = '#FFFFFF';
                    this.ctx.fillText(commentary, 0, 0);

                    // 텍스트 하이라이트
                    this.ctx.shadowColor = '#FFFF00';
                    this.ctx.shadowBlur = 15;
                    this.ctx.fillText(commentary, 0, 0);
                    this.ctx.shadowBlur = 0;

                    this.ctx.restore();

                    // 응원 파티클 효과 (GPU 태우기!)
                    for (let i = 0; i < 30; i++) {
                        const x = (this.animationFrame * 3 + i * 30) % this.canvas.width;
                        const y = commentaryY - 20 - Math.abs(Math.sin(this.animationFrame * 0.05 + i)) * 30;
                        const size = 3 + Math.sin(this.animationFrame * 0.1 + i) * 2;
                        const particleColors = ['#FFD700', '#FF1493', '#00FF00', '#FF6347', '#00BFFF'];
                        this.ctx.fillStyle = particleColors[i % particleColors.length];
                        this.ctx.beginPath();
                        this.ctx.arc(x, y, size, 0, Math.PI * 2);
                        this.ctx.fill();

                        // 별 모양 추가
                        if (i % 3 === 0) {
                            this.ctx.save();
                            this.ctx.translate(x, y);
                            this.ctx.rotate(this.animationFrame * 0.05 + i);
                            this.ctx.fillStyle = '#FFFF00';
                            this.ctx.font = '16px Arial';
                            this.ctx.textAlign = 'center';
                            this.ctx.fillText('⭐', 0, 0);
                            this.ctx.restore();
                        }
                    }

                    // 관중석에서 날아오는 응원 풍선들
                    for (let i = 0; i < 15; i++) {
                        const balloonX = 50 + (i * 50 + this.animationFrame * 2) % (this.canvas.width - 100);
                        const balloonY = 100 + Math.sin(this.animationFrame * 0.05 + i) * 30;
                        const balloonColors = ['#FF69B4', '#87CEEB', '#FFD700', '#90EE90'];

                        // 풍선
                        this.ctx.fillStyle = balloonColors[i % balloonColors.length];
                        this.ctx.beginPath();
                        this.ctx.ellipse(balloonX, balloonY, 8, 10, 0, 0, Math.PI * 2);
                        this.ctx.fill();

                        // 풍선 줄
                        this.ctx.strokeStyle = '#333333';
                        this.ctx.lineWidth = 1;
                        this.ctx.beginPath();
                        this.ctx.moveTo(balloonX, balloonY + 10);
                        this.ctx.lineTo(balloonX, balloonY + 25);
                        this.ctx.stroke();
                    }

                    // 스포트라이트 효과 (캐릭터들 강조)
                    const spotlight1 = this.ctx.createRadialGradient(
                        this.canvas.width / 2 - 150, this.canvas.height - 280,
                        0,
                        this.canvas.width / 2 - 150, this.canvas.height - 280,
                        100
                    );
                    spotlight1.addColorStop(0, 'rgba(255, 255, 200, 0.3)');
                    spotlight1.addColorStop(1, 'rgba(255, 255, 200, 0)');
                    this.ctx.fillStyle = spotlight1;
                    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

                    const spotlight2 = this.ctx.createRadialGradient(
                        this.canvas.width / 2 + 80, this.canvas.height - 280,
                        0,
                        this.canvas.width / 2 + 80, this.canvas.height - 280,
                        100
                    );
                    spotlight2.addColorStop(0, 'rgba(255, 255, 200, 0.3)');
                    spotlight2.addColorStop(1, 'rgba(255, 255, 200, 0)');
                    this.ctx.fillStyle = spotlight2;
                    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                }
            },

            // 씬 3: 금메달 시상식
            {
                update: () => {
                    // 축하 배경
                    this.drawSkyBackground('#FFD700', '#FFA500');

                    // 관중석 배경 (아기자기하게!)
                    // 그라디언트 배경
                    const ceremonyGradient = this.ctx.createLinearGradient(0, 100, 0, 280);
                    ceremonyGradient.addColorStop(0, '#FFFACD');  // 레몬 시폰
                    ceremonyGradient.addColorStop(0.5, '#FFE4E1'); // 미스티 로즈
                    ceremonyGradient.addColorStop(1, '#E0BBE4');   // 라벤더 핑크
                    this.ctx.fillStyle = ceremonyGradient;
                    this.ctx.fillRect(0, 100, this.canvas.width, 180);

                    // 좌석 구분선 (가로줄)
                    this.ctx.strokeStyle = '#FFD700';
                    this.ctx.lineWidth = 2;
                    for (let i = 0; i < 7; i++) {
                        const lineY = 100 + i * 25;
                        this.ctx.beginPath();
                        this.ctx.moveTo(0, lineY);
                        this.ctx.lineTo(this.canvas.width, lineY);
                        this.ctx.stroke();
                    }

                    // 축하 장식 (하트와 별)
                    for (let i = 0; i < 15; i++) {
                        const decorX = (i * 50 + this.animationFrame * 0.3) % this.canvas.width;
                        const decorY = 110 + (i % 6) * 28;
                        if (i % 3 === 0) {
                            this.ctx.fillStyle = '#FF69B4';
                            this.ctx.font = '14px Arial';
                            this.ctx.fillText('💖', decorX, decorY);
                        } else {
                            this.ctx.fillStyle = i % 2 === 0 ? '#FFD700' : '#FFFFFF';
                            this.ctx.font = '12px Arial';
                            this.ctx.fillText('⭐', decorX, decorY);
                        }
                    }

                    // 테두리 (금색과 핑크 이중 테두리)
                    this.ctx.strokeStyle = '#FFD700';
                    this.ctx.lineWidth = 5;
                    this.ctx.strokeRect(0, 100, this.canvas.width, 180);
                    this.ctx.strokeStyle = '#FF69B4';
                    this.ctx.lineWidth = 2;
                    this.ctx.strokeRect(3, 103, this.canvas.width - 6, 174);

                    // 관중들 (뒷쪽에 작게)
                    const audienceTypes = [
                        // 타입 1: 남자아이
                        {
                            sprite: [
                                [0,1,1,1,0],
                                [1,2,2,2,1],
                                [2,3,2,3,2],
                                [2,2,2,2,2],
                                [0,4,4,4,0],
                                [4,4,4,4,4],
                                [0,5,0,5,0]
                            ],
                            colors: {
                                1: '#2C1810', 2: '#FFE0BD', 3: '#000000',
                                4: '#4169E1', 5: '#8B4513'
                            }
                        },
                        // 타입 2: 여자아이
                        {
                            sprite: [
                                [1,1,1,1,1],
                                [1,2,2,2,1],
                                [2,3,2,3,2],
                                [2,2,5,2,2],
                                [0,6,6,6,0],
                                [6,6,6,6,6],
                                [0,7,0,7,0]
                            ],
                            colors: {
                                1: '#FF69B4', 2: '#FFE0BD', 3: '#000000',
                                5: '#FF1493', 6: '#FFC0CB', 7: '#FFD700'
                            }
                        },
                        // 타입 3: 아이 (귀여운)
                        {
                            sprite: [
                                [0,1,1,1,0],
                                [1,2,2,2,1],
                                [2,3,2,3,2],
                                [2,2,2,2,2],
                                [0,4,4,4,0],
                                [4,4,4,4,4],
                                [0,5,0,5,0]
                            ],
                            colors: {
                                1: '#FFD700', 2: '#FFE0BD', 3: '#000000',
                                4: '#00FF00', 5: '#FF6347'
                            }
                        }
                    ];

                    // 관중들 그리기 (전체 가득 채우기!)
                    const totalColsAudience = Math.floor(this.canvas.width / 22);
                    for (let row = 0; row < 6; row++) {
                        for (let col = 0; col < totalColsAudience; col++) {
                            const x = col * 22 + 5;
                            const y = 120 + row * 25;

                            const seed = row * 100 + col;
                            const typeIndex = seed % audienceTypes.length;
                            const audience = audienceTypes[typeIndex];
                            const scale = 2;

                            // 픽셀 스프라이트 그리기
                            for (let r = 0; r < audience.sprite.length; r++) {
                                for (let c = 0; c < audience.sprite[r].length; c++) {
                                    const pixel = audience.sprite[r][c];
                                    if (pixel !== 0 && audience.colors[pixel]) {
                                        this.ctx.fillStyle = audience.colors[pixel];
                                        this.ctx.fillRect(
                                            x + c * scale,
                                            y + r * scale,
                                            scale,
                                            scale
                                        );
                                    }
                                }
                            }

                            // 박수 이모지 (애니메이션)
                            if ((seed + this.animationFrame) % 20 < 10) {
                                this.ctx.font = '15px Arial';
                                this.ctx.fillText('👏', x + 5, y - 5);
                            }
                        }
                    }

                    // 시상대 (3개)

                    // 2위 시상대 (왼쪽)
                    this.ctx.fillStyle = '#8B4513';
                    this.ctx.fillRect(this.canvas.width / 2 - 200, this.canvas.height - 200, 120, 100);
                    // 2위 번호 (단상 안에)
                    this.ctx.fillStyle = '#FFFFFF';
                    this.ctx.font = 'bold 80px Arial';
                    this.ctx.textAlign = 'center';
                    this.ctx.textBaseline = 'middle';
                    this.ctx.strokeStyle = '#000000';
                    this.ctx.lineWidth = 4;
                    this.ctx.strokeText('2', this.canvas.width / 2 - 140, this.canvas.height - 150);
                    this.ctx.fillText('2', this.canvas.width / 2 - 140, this.canvas.height - 150);

                    // 1위 시상대 (중앙, 가장 높음 - 화려하게!)
                    // 황금 그라디언트 배경
                    const goldGradient = this.ctx.createLinearGradient(
                        this.canvas.width / 2 - 60, this.canvas.height - 250,
                        this.canvas.width / 2 - 60, this.canvas.height - 100
                    );
                    goldGradient.addColorStop(0, '#FFD700');
                    goldGradient.addColorStop(0.5, '#FFA500');
                    goldGradient.addColorStop(1, '#FF8C00');
                    this.ctx.fillStyle = goldGradient;
                    this.ctx.fillRect(this.canvas.width / 2 - 60, this.canvas.height - 250, 120, 150);

                    // 1위 테두리 (반짝이)
                    this.ctx.strokeStyle = '#FFFF00';
                    this.ctx.lineWidth = 3 + Math.sin(this.animationFrame * 0.15) * 1;
                    this.ctx.strokeRect(this.canvas.width / 2 - 60, this.canvas.height - 250, 120, 150);

                    // 1위 번호 (단상 안에 - 더 화려하게)
                    this.ctx.save();
                    const num1Scale = 1 + Math.sin(this.animationFrame * 0.1) * 0.05;
                    this.ctx.translate(this.canvas.width / 2, this.canvas.height - 175);
                    this.ctx.scale(num1Scale, num1Scale);

                    // 번호 그림자
                    this.ctx.shadowColor = '#FF0000';
                    this.ctx.shadowBlur = 20;
                    this.ctx.fillStyle = '#FFFFFF';
                    this.ctx.font = 'bold 100px Arial';
                    this.ctx.textAlign = 'center';
                    this.ctx.textBaseline = 'middle';
                    this.ctx.fillText('1', 0, 0);

                    // 번호 외곽선
                    this.ctx.shadowBlur = 0;
                    this.ctx.strokeStyle = '#FF0000';
                    this.ctx.lineWidth = 5;
                    this.ctx.strokeText('1', 0, 0);

                    this.ctx.restore();

                    // 3위 시상대 (오른쪽)
                    this.ctx.fillStyle = '#8B4513';
                    this.ctx.fillRect(this.canvas.width / 2 + 80, this.canvas.height - 150, 120, 50);
                    // 3위 번호 (단상 안에)
                    this.ctx.fillStyle = '#FFFFFF';
                    this.ctx.font = 'bold 60px Arial';
                    this.ctx.textAlign = 'center';
                    this.ctx.textBaseline = 'middle';
                    this.ctx.strokeStyle = '#000000';
                    this.ctx.lineWidth = 3;
                    this.ctx.strokeText('3', this.canvas.width / 2 + 140, this.canvas.height - 125);
                    this.ctx.fillText('3', this.canvas.width / 2 + 140, this.canvas.height - 125);

                    // 2위 아빠 캐릭터
                    const dadSprite = [
                        [0,0,0,1,1,1,1,1,1,1,1,0,0,0],
                        [0,0,1,1,1,1,1,1,1,1,1,1,0,0],
                        [0,1,1,1,1,1,1,1,1,1,1,1,1,0],
                        [1,1,2,2,2,2,2,2,2,2,2,2,1,1],
                        [1,2,2,3,3,2,2,2,3,3,2,2,2,1],
                        [1,2,2,4,4,4,2,2,4,4,4,2,2,1],
                        [1,2,2,4,4,5,2,2,4,4,5,2,2,1],
                        [0,2,2,2,2,2,2,2,2,2,2,2,0,0],
                        [0,2,2,2,7,7,7,7,2,2,2,2,0,0],
                        [0,0,8,8,8,8,8,8,8,8,0,0,0,0],
                        [0,8,8,8,9,9,9,8,8,8,8,0,0,0],
                        [8,8,8,8,8,8,8,8,8,8,8,8,0,0],
                        [0,2,2,8,8,8,8,8,8,2,2,0,0,0],
                        [0,0,10,10,10,10,10,10,10,10,0,0,0,0],
                        [0,0,10,10,10,10,10,10,10,10,0,0,0,0],
                        [0,0,11,11,0,0,0,0,11,11,0,0,0,0]
                    ];

                    const dadColors = {
                        0: null,
                        1: '#2C1810', 2: '#FFE0BD', 3: '#654321',
                        4: '#FFFFFF', 5: '#000000', 7: '#FF69B4',
                        8: '#4169E1', 9: '#FFD700',
                        10: '#2C3E50', 11: '#FFFFFF'
                    };

                    const dadScale = 4;
                    const dadX = this.canvas.width / 2 - 180;
                    const dadY = this.canvas.height - 300;

                    for (let row = 0; row < dadSprite.length; row++) {
                        for (let col = 0; col < dadSprite[row].length; col++) {
                            const pixel = dadSprite[row][col];
                            if (pixel !== 0 && dadColors[pixel]) {
                                this.ctx.fillStyle = dadColors[pixel];
                                this.ctx.fillRect(
                                    dadX + col * dadScale,
                                    dadY + row * dadScale,
                                    dadScale,
                                    dadScale
                                );
                            }
                        }
                    }

                    // 1위 지율이 (시상대 위)
                    this.drawJiyul(
                        this.canvas.width / 2 - 30,
                        this.canvas.height - 350,
                        'idle',
                        0,
                        4
                    );

                    // 3위 크레스티드 게코 도마뱀 (주황색)
                    const geckoSprite = [
                        [0,0,0,1,1,1,1,0,0,0],
                        [0,0,1,2,2,2,2,1,0,0],
                        [0,1,2,3,2,2,3,2,1,0],
                        [1,2,2,2,2,2,2,2,2,1],
                        [1,2,4,4,4,4,4,4,2,1],
                        [1,2,4,5,4,4,5,4,2,1],
                        [0,1,2,2,2,2,2,2,1,0],
                        [0,0,1,6,6,6,6,1,0,0],
                        [0,1,6,6,6,6,6,6,1,0],
                        [1,6,6,7,6,6,7,6,6,1],
                        [0,1,6,6,6,6,6,6,1,0],
                        [0,0,1,1,0,0,1,1,0,0]
                    ];

                    const geckoColors = {
                        0: null,
                        1: '#CC5500',    // 다크 오렌지 외곽
                        2: '#FF8C00',    // 밝은 오렌지 머리
                        3: '#8B4513',    // 갈색 뿔
                        4: '#FFA500',    // 오렌지 몸
                        5: '#000000',    // 검은 점
                        6: '#FF7F50',    // 코랄 오렌지 꼬리
                        7: '#FFD700'     // 금색 무늬
                    };

                    const geckoScale = 4;
                    const geckoX = this.canvas.width / 2 + 110;
                    const geckoY = this.canvas.height - 200;

                    for (let row = 0; row < geckoSprite.length; row++) {
                        for (let col = 0; col < geckoSprite[row].length; col++) {
                            const pixel = geckoSprite[row][col];
                            if (pixel !== 0 && geckoColors[pixel]) {
                                this.ctx.fillStyle = geckoColors[pixel];
                                this.ctx.fillRect(
                                    geckoX + col * geckoScale,
                                    geckoY + row * geckoScale,
                                    geckoScale,
                                    geckoScale
                                );
                            }
                        }
                    }

                    // 금메달 (1위) - 번호 없이
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

                    // 메달 반짝이
                    this.ctx.fillStyle = '#FFFF00';
                    this.ctx.beginPath();
                    this.ctx.arc(-8, -8, 8, 0, Math.PI * 2);
                    this.ctx.fill();

                    this.ctx.restore();

                    // 은메달 (2위) - 번호 없이
                    this.ctx.save();
                    this.ctx.translate(this.canvas.width / 2 - 140, this.canvas.height - 230);
                    this.ctx.strokeStyle = '#C0C0C0';
                    this.ctx.lineWidth = 6;
                    this.ctx.beginPath();
                    this.ctx.moveTo(0, -25);
                    this.ctx.lineTo(0, 0);
                    this.ctx.stroke();
                    this.ctx.fillStyle = '#C0C0C0';
                    this.ctx.beginPath();
                    this.ctx.arc(0, 0, 25, 0, Math.PI * 2);
                    this.ctx.fill();
                    // 은메달 반짝이
                    this.ctx.fillStyle = '#FFFFFF';
                    this.ctx.beginPath();
                    this.ctx.arc(-6, -6, 6, 0, Math.PI * 2);
                    this.ctx.fill();
                    this.ctx.restore();

                    // 동메달 (3위) - 번호 없이
                    this.ctx.save();
                    this.ctx.translate(this.canvas.width / 2 + 140, this.canvas.height - 160);
                    this.ctx.strokeStyle = '#CD7F32';
                    this.ctx.lineWidth = 6;
                    this.ctx.beginPath();
                    this.ctx.moveTo(0, -20);
                    this.ctx.lineTo(0, 0);
                    this.ctx.stroke();
                    this.ctx.fillStyle = '#CD7F32';
                    this.ctx.beginPath();
                    this.ctx.arc(0, 0, 20, 0, Math.PI * 2);
                    this.ctx.fill();
                    // 동메달 반짝이
                    this.ctx.fillStyle = '#FFD700';
                    this.ctx.beginPath();
                    this.ctx.arc(-5, -5, 5, 0, Math.PI * 2);
                    this.ctx.fill();
                    this.ctx.restore();

                    // 선수 이름 및 소속 표시
                    // 1위 지율이 - 제니스 대표
                    this.ctx.fillStyle = 'rgba(255, 215, 0, 0.9)';
                    this.ctx.fillRect(this.canvas.width / 2 - 80, this.canvas.height - 90, 160, 50);
                    this.ctx.strokeStyle = '#FFD700';
                    this.ctx.lineWidth = 3;
                    this.ctx.strokeRect(this.canvas.width / 2 - 80, this.canvas.height - 90, 160, 50);
                    this.ctx.fillStyle = '#000000';
                    this.ctx.font = 'bold 20px Arial';
                    this.ctx.textAlign = 'center';
                    this.ctx.fillText('지율이', this.canvas.width / 2, this.canvas.height - 70);
                    this.ctx.font = 'bold 14px Arial';
                    this.ctx.fillStyle = '#FF1493';
                    this.ctx.fillText('제니스 대표', this.canvas.width / 2, this.canvas.height - 50);

                    // 2위 아빠 - 동네 탁구장 대표
                    this.ctx.fillStyle = 'rgba(192, 192, 192, 0.9)';
                    this.ctx.fillRect(this.canvas.width / 2 - 220, this.canvas.height - 90, 160, 50);
                    this.ctx.strokeStyle = '#C0C0C0';
                    this.ctx.lineWidth = 3;
                    this.ctx.strokeRect(this.canvas.width / 2 - 220, this.canvas.height - 90, 160, 50);
                    this.ctx.fillStyle = '#000000';
                    this.ctx.font = 'bold 18px Arial';
                    this.ctx.fillText('아빠', this.canvas.width / 2 - 140, this.canvas.height - 70);
                    this.ctx.font = 'bold 13px Arial';
                    this.ctx.fillStyle = '#4169E1';
                    this.ctx.fillText('동네 탁구장 대표', this.canvas.width / 2 - 140, this.canvas.height - 50);

                    // 3위 키위 - 도마뱀 대표
                    this.ctx.fillStyle = 'rgba(205, 127, 50, 0.9)';
                    this.ctx.fillRect(this.canvas.width / 2 + 60, this.canvas.height - 90, 160, 50);
                    this.ctx.strokeStyle = '#CD7F32';
                    this.ctx.lineWidth = 3;
                    this.ctx.strokeRect(this.canvas.width / 2 + 60, this.canvas.height - 90, 160, 50);
                    this.ctx.fillStyle = '#000000';
                    this.ctx.font = 'bold 18px Arial';
                    this.ctx.fillText('키위', this.canvas.width / 2 + 140, this.canvas.height - 70);
                    this.ctx.font = 'bold 13px Arial';
                    this.ctx.fillStyle = '#FF8C00';
                    this.ctx.fillText('도마뱀 대표', this.canvas.width / 2 + 140, this.canvas.height - 50);

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

            // 씬 3-1: 솔뜰 캠핑장 - 캠프파이어
            {
                update: () => {
                    // 밤하늘 배경
                    this.drawSkyBackground('#001433', '#1a237e');

                    // 반짝이는 별들
                    for (let i = 0; i < 50; i++) {
                        const x = (i * 73) % this.canvas.width;
                        const y = (i * 47) % (this.canvas.height / 2);
                        const twinkle = Math.sin(this.animationFrame * 0.05 + i) * 0.5 + 0.5;
                        this.ctx.fillStyle = `rgba(255, 255, 255, ${twinkle})`;
                        this.ctx.fillRect(x, y, 2, 2);
                    }

                    // 땅
                    this.ctx.fillStyle = '#2d5016';
                    this.ctx.fillRect(0, this.canvas.height - 100, this.canvas.width, 100);

                    // 캠핑장 간판
                    this.ctx.fillStyle = '#8B4513';
                    this.ctx.fillRect(50, this.canvas.height - 400, 180, 60);
                    this.ctx.fillStyle = '#FFD700';
                    this.ctx.font = 'bold 24px Arial';
                    this.ctx.textAlign = 'center';
                    this.ctx.fillText('솔뜰 캠핑장', 140, this.canvas.height - 365);
                    this.ctx.textAlign = 'left';

                    // 캠프파이어 (중앙)
                    const fireX = this.canvas.width / 2;
                    const fireY = this.canvas.height - 150;

                    // 장작
                    this.ctx.fillStyle = '#8B4513';
                    for (let i = 0; i < 3; i++) {
                        const angle = (i * Math.PI * 2 / 3) + Math.PI / 2;
                        const x = fireX + Math.cos(angle) * 20;
                        const y = fireY + Math.sin(angle) * 20;
                        this.ctx.save();
                        this.ctx.translate(x, y);
                        this.ctx.rotate(angle);
                        this.ctx.fillRect(-15, -5, 30, 10);
                        this.ctx.restore();
                    }

                    // 불꽃
                    for (let i = 0; i < 5; i++) {
                        const flameHeight = (Math.sin(this.animationFrame * 0.1 + i) * 10 + 30);
                        const flameY = fireY - flameHeight;
                        const flameX = fireX + Math.sin(this.animationFrame * 0.15 + i) * 10;

                        const gradient = this.ctx.createRadialGradient(flameX, flameY, 0, flameX, flameY, 15);
                        gradient.addColorStop(0, '#FFFF00');
                        gradient.addColorStop(0.5, '#FF6600');
                        gradient.addColorStop(1, '#FF0000');
                        this.ctx.fillStyle = gradient;
                        this.ctx.beginPath();
                        this.ctx.ellipse(flameX, flameY, 10, 15, 0, 0, Math.PI * 2);
                        this.ctx.fill();
                    }

                    // 불빛 반사
                    const glowGradient = this.ctx.createRadialGradient(fireX, fireY, 0, fireX, fireY, 150);
                    glowGradient.addColorStop(0, 'rgba(255, 165, 0, 0.3)');
                    glowGradient.addColorStop(1, 'rgba(255, 165, 0, 0)');
                    this.ctx.fillStyle = glowGradient;
                    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

                    // 지율이 (왼쪽)
                    this.drawJiyul(
                        this.canvas.width / 2 - 150,
                        this.canvas.height - 170,
                        'idle',
                        0,
                        4
                    );

                    // 세은이 (중간)
                    this.drawSeeun(
                        this.canvas.width / 2 - 30,
                        this.canvas.height - 170,
                        'idle',
                        0,
                        4
                    );

                    // 하린이 (오른쪽)
                    this.drawHarin(
                        this.canvas.width / 2 + 90,
                        this.canvas.height - 170,
                        'idle',
                        0,
                        4
                    );

                    // 금메달 (목에 걸고)
                    for (let i = 0; i < 3; i++) {
                        const medalX = this.canvas.width / 2 - 150 + i * 120;
                        const medalY = this.canvas.height - 140;

                        // 메달
                        this.ctx.fillStyle = '#FFD700';
                        this.ctx.beginPath();
                        this.ctx.arc(medalX + 32, medalY, 8, 0, Math.PI * 2);
                        this.ctx.fill();

                        // 리본
                        this.ctx.strokeStyle = '#FF0000';
                        this.ctx.lineWidth = 2;
                        this.ctx.beginPath();
                        this.ctx.moveTo(medalX + 32, medalY - 8);
                        this.ctx.lineTo(medalX + 32, medalY - 20);
                        this.ctx.stroke();
                    }

                    // 대화
                    if (this.animationFrame > 60) {
                        this.drawDialogBox(
                            '와! 캠프파이어다! 불 보니까 완전 따뜻해!\n오늘 하루 진짜 재밌었어! 금메달도 땄고!',
                            this.canvas.width / 2,
                            this.canvas.height - 350,
                            '지율'
                        );
                    }
                }
            },

            // 씬 3-2: SUNZERO 등장
            {
                update: () => {
                    // 밤하늘 배경
                    this.drawSkyBackground('#001433', '#1a237e');

                    // 반짝이는 별들 (더 많이)
                    for (let i = 0; i < 80; i++) {
                        const x = (i * 73) % this.canvas.width;
                        const y = (i * 47) % (this.canvas.height / 2);
                        const twinkle = Math.sin(this.animationFrame * 0.05 + i) * 0.5 + 0.5;
                        this.ctx.fillStyle = `rgba(255, 255, 255, ${twinkle})`;
                        this.ctx.fillRect(x, y, 3, 3);
                    }

                    // 땅
                    this.ctx.fillStyle = '#2d5016';
                    this.ctx.fillRect(0, this.canvas.height - 100, this.canvas.width, 100);

                    // 캠프파이어
                    const fireX = this.canvas.width / 2;
                    const fireY = this.canvas.height - 150;

                    // 장작
                    this.ctx.fillStyle = '#8B4513';
                    for (let i = 0; i < 3; i++) {
                        const angle = (i * Math.PI * 2 / 3) + Math.PI / 2;
                        const x = fireX + Math.cos(angle) * 20;
                        const y = fireY + Math.sin(angle) * 20;
                        this.ctx.save();
                        this.ctx.translate(x, y);
                        this.ctx.rotate(angle);
                        this.ctx.fillRect(-15, -5, 30, 10);
                        this.ctx.restore();
                    }

                    // 불꽃
                    for (let i = 0; i < 5; i++) {
                        const flameHeight = (Math.sin(this.animationFrame * 0.1 + i) * 10 + 30);
                        const flameY = fireY - flameHeight;
                        const flameX = fireX + Math.sin(this.animationFrame * 0.15 + i) * 10;

                        const gradient = this.ctx.createRadialGradient(flameX, flameY, 0, flameX, flameY, 15);
                        gradient.addColorStop(0, '#FFFF00');
                        gradient.addColorStop(0.5, '#FF6600');
                        gradient.addColorStop(1, '#FF0000');
                        this.ctx.fillStyle = gradient;
                        this.ctx.beginPath();
                        this.ctx.ellipse(flameX, flameY, 10, 15, 0, 0, Math.PI * 2);
                        this.ctx.fill();
                    }

                    // 지율이 (왼쪽 아래)
                    this.drawJiyul(
                        this.canvas.width / 2 - 150,
                        this.canvas.height - 170,
                        'idle',
                        0,
                        3
                    );

                    // 세은이 (중앙 아래)
                    this.drawSeeun(
                        this.canvas.width / 2 - 30,
                        this.canvas.height - 170,
                        'idle',
                        0,
                        3
                    );

                    // 하린이 (오른쪽 아래)
                    this.drawHarin(
                        this.canvas.width / 2 + 70,
                        this.canvas.height - 170,
                        'idle',
                        0,
                        3
                    );

                    // SUNZERO 천사 등장 (위에서 내려옴)
                    const sunzeroY = Math.max(100, 600 - this.animationFrame * 3);

                    // 금빛 빛줄기
                    const beamGradient = this.ctx.createLinearGradient(
                        this.canvas.width / 2, 0,
                        this.canvas.width / 2, sunzeroY
                    );
                    beamGradient.addColorStop(0, 'rgba(255, 215, 0, 0)');
                    beamGradient.addColorStop(0.5, 'rgba(255, 215, 0, 0.3)');
                    beamGradient.addColorStop(1, 'rgba(255, 215, 0, 0.6)');
                    this.ctx.fillStyle = beamGradient;
                    this.ctx.fillRect(this.canvas.width / 2 - 50, 0, 100, sunzeroY);

                    // SUNZERO (간단한 천사)
                    if (sunzeroY <= 200) {
                        // 광채
                        const haloGradient = this.ctx.createRadialGradient(
                            this.canvas.width / 2, sunzeroY,
                            0,
                            this.canvas.width / 2, sunzeroY,
                            60
                        );
                        haloGradient.addColorStop(0, 'rgba(255, 215, 0, 0.8)');
                        haloGradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
                        this.ctx.fillStyle = haloGradient;
                        this.ctx.beginPath();
                        this.ctx.arc(this.canvas.width / 2, sunzeroY, 60, 0, Math.PI * 2);
                        this.ctx.fill();

                        // 날개
                        this.ctx.fillStyle = '#FFFFFF';
                        // 왼쪽 날개
                        this.ctx.beginPath();
                        this.ctx.ellipse(this.canvas.width / 2 - 40, sunzeroY + 10, 30, 20, -Math.PI / 6, 0, Math.PI * 2);
                        this.ctx.fill();
                        // 오른쪽 날개
                        this.ctx.beginPath();
                        this.ctx.ellipse(this.canvas.width / 2 + 40, sunzeroY + 10, 30, 20, Math.PI / 6, 0, Math.PI * 2);
                        this.ctx.fill();

                        // 몸
                        this.ctx.fillStyle = '#FFD700';
                        this.ctx.fillRect(this.canvas.width / 2 - 15, sunzeroY, 30, 40);

                        // 머리
                        this.ctx.fillStyle = '#FFE0BD';
                        this.ctx.beginPath();
                        this.ctx.arc(this.canvas.width / 2, sunzeroY - 10, 20, 0, Math.PI * 2);
                        this.ctx.fill();

                        // 광환 (머리 위)
                        this.ctx.strokeStyle = '#FFD700';
                        this.ctx.lineWidth = 3;
                        this.ctx.beginPath();
                        this.ctx.arc(this.canvas.width / 2, sunzeroY - 30, 15, 0, Math.PI * 2);
                        this.ctx.stroke();
                    }

                    // 대화
                    if (sunzeroY <= 150) {
                        this.drawDialogBox(
                            '안녕, 지율아. 나는 너의 수호천사 SUNZERO야.\n너희 셋의 노력을 지켜봤어. 영어도 배우고 탁구도 열심히 했지.',
                            this.canvas.width / 2,
                            300,
                            'SUNZERO'
                        );
                    }
                }
            },

            // 씬 4: 대마왕이 코치가 됨 - 지율이 대화
            {
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
                    this.ctx.textAlign = 'center';
                    this.ctx.fillText('지율 탁구&잉글리시 클럽', 175, this.canvas.height - 250);

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

                    // 지율이 대화
                    this.drawDialogBox(
                        '코치님! 덕분에 금메달 땄어요!',
                        this.canvas.width / 2 - 100,
                        this.canvas.height - 250,
                        '지율'
                    );

                    // 하트 효과
                    for (let i = 0; i < 5; i++) {
                        const heartY = this.canvas.height - 300 - Math.sin(this.animationFrame * 0.05 + i) * 20;
                        this.ctx.font = '30px Arial';
                        this.ctx.fillText('❤️', this.canvas.width / 2 - 50 + i * 30, heartY);
                    }
                }
            },

            // 씬 5: ABC 코치의 대답
            {
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
                    this.ctx.textAlign = 'center';
                    this.ctx.fillText('지율 탁구&잉글리시 클럽', 175, this.canvas.height - 250);

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

                    // ABC 코치 대화
                    this.drawDialogBox(
                        '자랑스럽다!\n이제 영어도 탁구도 최고야!',
                        this.canvas.width / 2 + 100,
                        this.canvas.height - 280,
                        'ABC 코치'
                    );

                    // 하트 효과
                    for (let i = 0; i < 5; i++) {
                        const heartY = this.canvas.height - 300 - Math.sin(this.animationFrame * 0.05 + i) * 20;
                        this.ctx.font = '30px Arial';
                        this.ctx.fillText('❤️', this.canvas.width / 2 - 50 + i * 30, heartY);
                    }
                }
            },

            // 씬 6: THE END
            {
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
            },

            // 씬 6-1: sunzero 선생님의 정체 - 수호천사 등장
            {
                update: () => {
                    this.drawSunzeroAngelScene();

                    // 대사
                    this.ctx.fillStyle = '#FFD700';
                    this.ctx.font = 'bold 28px Arial';
                    this.ctx.textAlign = 'center';
                    this.ctx.shadowColor = '#000000';
                    this.ctx.shadowBlur = 5;
                    this.ctx.fillText('나는 너의 수호천사, sunzero...', this.canvas.width / 2, this.canvas.height - 150);
                    this.ctx.shadowBlur = 0;
                }
            },

            // 씬 6-2: 영어 마스터 축하
            {
                update: () => {
                    this.drawSunzeroAngelScene();

                    // 대사
                    this.ctx.fillStyle = '#FFFFFF';
                    this.ctx.font = 'bold 24px Arial';
                    this.ctx.textAlign = 'center';
                    this.ctx.shadowColor = '#000000';
                    this.ctx.shadowBlur = 5;
                    this.ctx.fillText('지율아, 넌 이제 영어를 마스터했어.', this.canvas.width / 2, this.canvas.height - 180);
                    this.ctx.fillText('하지만 이것은 시작에 불과하지...', this.canvas.width / 2, this.canvas.height - 140);
                    this.ctx.shadowBlur = 0;
                }
            },

            // 씬 6-3: AI 지배 떡밥
            {
                update: () => {
                    this.drawSunzeroAngelScene();

                    // 대사
                    this.ctx.shadowColor = '#000000';
                    this.ctx.shadowBlur = 5;
                    this.ctx.fillStyle = '#FF6B6B';
                    this.ctx.font = 'bold 26px Arial';
                    this.ctx.textAlign = 'center';
                    this.ctx.fillText('곧... AI가 세상을 지배하게 될 거야.', this.canvas.width / 2, this.canvas.height - 180);
                    this.ctx.fillStyle = '#FFFFFF';
                    this.ctx.font = 'bold 22px Arial';
                    this.ctx.fillText('그때가 오면, 진짜 싸움이 시작되는 거지...', this.canvas.width / 2, this.canvas.height - 140);
                    this.ctx.shadowBlur = 0;
                }
            },

            // 씬 6-4: To be continued
            {
                update: () => {
                    this.drawSunzeroAngelScene();

                    // To be continued
                    const centerX = this.canvas.width / 2;
                    const scale = 1 + Math.sin(this.animationFrame * 0.08) * 0.15;
                    this.ctx.save();
                    this.ctx.translate(centerX, this.canvas.height - 100);
                    this.ctx.scale(scale, scale);

                    this.ctx.fillStyle = '#00FFFF';
                    this.ctx.strokeStyle = '#000000';
                    this.ctx.lineWidth = 4;
                    this.ctx.font = 'bold 50px Arial';
                    this.ctx.strokeText('To be continued...', 0, 0);
                    this.ctx.fillText('To be continued...', 0, 0);

                    this.ctx.restore();

                    // 물음표들이 떠다님
                    for (let i = 0; i < 5; i++) {
                        const qx = centerX - 200 + i * 100;
                        const qy = 150 + Math.sin(this.animationFrame * 0.1 + i) * 30;
                        this.ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + Math.sin(this.animationFrame * 0.05 + i) * 0.3})`;
                        this.ctx.font = 'bold 40px Arial';
                        this.ctx.fillText('?', qx, qy);
                    }
                }
            }
        ];
    }

    // sunzero 천사 씬 공통 배경 및 캐릭터 그리기
    drawSunzeroAngelScene() {
        // 신비로운 은하수 배경
        const gradient = this.ctx.createRadialGradient(
            this.canvas.width / 2,
            this.canvas.height / 2,
            0,
            this.canvas.width / 2,
            this.canvas.height / 2,
            this.canvas.width
        );
        gradient.addColorStop(0, '#1a0033');
        gradient.addColorStop(0.5, '#2d0054');
        gradient.addColorStop(1, '#000000');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // 반짝이는 별들
        for (let i = 0; i < 100; i++) {
            const x = (i * 137.5) % this.canvas.width;
            const y = (i * 217.3) % this.canvas.height;
            const brightness = Math.sin(this.animationFrame * 0.05 + i) * 0.5 + 0.5;
            this.ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`;
            this.ctx.fillRect(x, y, 2, 2);
        }

        // sunzero 선생님 등장 (천사 모습 - 픽셀 아트 스타일)
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2 - 30;

        // 빛나는 후광
        const haloGlow = Math.sin(this.animationFrame * 0.05) * 20 + 80;
        const haloGradient = this.ctx.createRadialGradient(
            centerX, centerY - 80, 0,
            centerX, centerY - 80, haloGlow
        );
        haloGradient.addColorStop(0, 'rgba(255, 215, 0, 0.8)');
        haloGradient.addColorStop(0.5, 'rgba(255, 215, 0, 0.4)');
        haloGradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
        this.ctx.fillStyle = haloGradient;
        this.ctx.fillRect(centerX - haloGlow, centerY - 80 - haloGlow, haloGlow * 2, haloGlow * 2);

        // 후광 링
        this.ctx.strokeStyle = '#FFD700';
        this.ctx.lineWidth = 4;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY - 100, 40, 0, Math.PI * 2);
        this.ctx.stroke();

        // 천사 날개 (먼저 그려서 뒤에 배치)
        const wingFlap = Math.sin(this.animationFrame * 0.1) * 5;

        // 왼쪽 날개 (큰 깃털 3개로 구성)
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        this.ctx.strokeStyle = '#FFD700';
        this.ctx.lineWidth = 2;

        // 왼쪽 날개 - 깃털 1
        this.ctx.beginPath();
        this.ctx.ellipse(centerX - 45, centerY - 20 + wingFlap, 30, 40, -Math.PI / 4, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();

        // 왼쪽 날개 - 깃털 2
        this.ctx.beginPath();
        this.ctx.ellipse(centerX - 55, centerY + wingFlap, 25, 35, -Math.PI / 5, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();

        // 왼쪽 날개 - 깃털 3
        this.ctx.beginPath();
        this.ctx.ellipse(centerX - 60, centerY + 20 + wingFlap, 20, 30, -Math.PI / 6, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();

        // 오른쪽 날개 - 깃털 1
        this.ctx.beginPath();
        this.ctx.ellipse(centerX + 45, centerY - 20 - wingFlap, 30, 40, Math.PI / 4, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();

        // 오른쪽 날개 - 깃털 2
        this.ctx.beginPath();
        this.ctx.ellipse(centerX + 55, centerY - wingFlap, 25, 35, Math.PI / 5, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();

        // 오른쪽 날개 - 깃털 3
        this.ctx.beginPath();
        this.ctx.ellipse(centerX + 60, centerY + 20 - wingFlap, 20, 30, Math.PI / 6, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();

        // sunzero 선생님 픽셀 스프라이트 (오프닝과 동일)
        const sunzeroSprite = [
            [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0],  // 긴 머리
            [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,2,2,2,2,2,2,2,2,2,2,1,1,1],  // 얼굴 시작
            [1,1,2,2,2,2,2,2,2,2,2,2,2,2,1,1],
            [0,1,2,3,3,3,2,2,2,3,3,3,2,2,1,0],  // 큰 눈
            [0,1,2,3,4,4,2,2,2,3,4,4,2,2,1,0],  // 눈동자
            [0,1,2,2,2,2,2,2,2,2,2,2,2,2,1,0],  // 얼굴
            [0,0,2,9,2,2,5,5,5,2,2,9,2,0,0,0],  // 볼터치 + 미소
            [0,0,0,6,6,6,6,6,6,6,6,6,0,0,0,0],  // 하얀 천사 옷
            [0,0,6,6,6,7,6,6,7,6,6,6,6,0,0,0],  // 옷 (금색 장식)
            [0,0,0,6,6,6,6,6,6,6,6,6,0,0,0,0],  // 하얀 옷
            [0,0,0,6,6,6,6,6,6,6,6,6,0,0,0,0],
            [0,0,0,0,10,10,0,0,10,10,0,0,0,0,0,0],  // 금색 장식
            [0,0,2,2,2,0,0,0,0,2,2,2,0,0,0,0],  // 다리
            [0,0,11,11,11,0,0,0,0,11,11,11,0,0,0,0]  // 금색 신발
        ];

        const sunzeroColorMap = {
            0: null,
            1: '#2C1810',    // 검은 갈색 머리
            2: '#FFE0BD',    // 살색
            3: '#FFFFFF',    // 눈 흰자
            4: '#000000',    // 눈동자
            5: '#FF69B4',    // 핑크 입술
            6: '#FFFFFF',    // 하얀 천사 옷
            7: '#FFD700',    // 금색 장식
            8: '#FFFFFF',    // 하얀색
            9: '#FFB6C1',    // 볼터치
            10: '#FFD700',   // 금색 장식
            11: '#FFD700'    // 금색 신발
        };

        // 픽셀 스프라이트 그리기
        const scale = 5;
        const startX = centerX - (sunzeroSprite[0].length * scale) / 2;
        const startY = centerY - 50;

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

        // 머리카락 하이라이트 (반짝임)
        this.ctx.fillStyle = 'rgba(255, 215, 0, 0.4)';
        this.ctx.fillRect(startX + 5 * scale, startY + 1 * scale, 2 * scale, scale);
        this.ctx.fillRect(startX + 9 * scale, startY + 1 * scale, 2 * scale, scale);

        // 빛 입자 효과
        for (let i = 0; i < 30; i++) {
            const angle = (this.animationFrame * 0.02 + i * Math.PI * 2 / 30);
            const radius = 120 + Math.sin(this.animationFrame * 0.05 + i) * 20;
            const px = centerX + Math.cos(angle) * radius;
            const py = centerY + Math.sin(angle) * radius;
            const alpha = Math.sin(this.animationFrame * 0.05 + i) * 0.5 + 0.5;
            this.ctx.fillStyle = `rgba(255, 215, 0, ${alpha})`;
            this.ctx.beginPath();
            this.ctx.arc(px, py, 4, 0, Math.PI * 2);
            this.ctx.fill();
        }

        // 반짝이는 별 효과 (천사 주변)
        for (let i = 0; i < 10; i++) {
            const starAngle = (this.animationFrame * 0.03 + i * Math.PI * 2 / 10);
            const starRadius = 90;
            const sx = centerX + Math.cos(starAngle) * starRadius;
            const sy = centerY + Math.sin(starAngle) * starRadius;
            const starAlpha = Math.sin(this.animationFrame * 0.1 + i) * 0.5 + 0.5;

            this.ctx.fillStyle = `rgba(255, 255, 255, ${starAlpha})`;
            this.ctx.font = '20px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('✨', sx, sy);
        }
    }

    // 애니메이션 시작
    startOpening(onComplete) {
        this.scenes = this.getOpeningScenes();
        this.currentScene = 0;
        this.animationFrame = 0;
        this.bgScroll = 0;
        this.onComplete = onComplete;
        this.waitingForInput = false;
        this.canProceed = false;

        // 이벤트 리스너 재설정 (오프닝 시작 시)
        this.setupEventListeners();

        this.animate();
    }

    startEnding(onComplete) {
        this.scenes = this.getEndingScenes();
        this.currentScene = 0;
        this.animationFrame = 0;
        this.bgScroll = 0;
        this.onComplete = onComplete;
        this.waitingForInput = false;
        this.canProceed = false;

        // 이벤트 리스너 재설정 (엔딩 시작 시)
        this.setupEventListeners();

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

        // 프레임 증가
        this.animationFrame++;

        // 씬 전환 로직
        if (scene.duration) {
            // duration이 있는 씬: duration만큼 기다린 후 자동으로 다음 씬
            if (this.animationFrame >= scene.duration) {
                this.currentScene++;
                this.animationFrame = 0;
                this.particles = []; // 파티클 초기화
                this.waitingForInput = false;
                this.canProceed = false;
            }
        } else {
            // duration이 없는 씬: 클릭 기반 진행
            const minDisplayTime = 60; // 1초 (60fps 기준)
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
            const btnWidth = 100;  // 작게 축소
            const btnHeight = 40;  // 작게 축소
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
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText('Click', btnX + btnWidth/2, btnY + btnHeight/2);
        }

        // SKIP 버튼 그리기 (오른쪽 상단)
        const skipBtnGradient = this.ctx.createLinearGradient(
            this.skipButton.x,
            this.skipButton.y,
            this.skipButton.x + this.skipButton.width,
            this.skipButton.y + this.skipButton.height
        );

        if (this.skipButton.hovered) {
            skipBtnGradient.addColorStop(0, 'rgba(200, 100, 250, 0.9)');
            skipBtnGradient.addColorStop(1, 'rgba(250, 150, 250, 0.9)');
        } else {
            skipBtnGradient.addColorStop(0, 'rgba(147, 112, 219, 0.8)');
            skipBtnGradient.addColorStop(1, 'rgba(221, 160, 221, 0.8)');
        }

        // 버튼 배경
        this.ctx.fillStyle = skipBtnGradient;
        this.ctx.fillRect(
            this.skipButton.x,
            this.skipButton.y,
            this.skipButton.width,
            this.skipButton.height
        );

        // 버튼 테두리
        this.ctx.strokeStyle = '#FFFFFF';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(
            this.skipButton.x,
            this.skipButton.y,
            this.skipButton.width,
            this.skipButton.height
        );

        // 버튼 텍스트
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