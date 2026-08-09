// ============================================================
// 메탈슬러그풍 2D 스프라이트 타이틀 화면
// HTML/CSS 이모지 타이틀을 캔버스 도트 스프라이트 씬으로 교체.
// - 타이틀 텍스트: PixelText(픽셀 그리드 래스터라이즈)로 스프라이트화
// - 캐릭터: pixelData 도트 스프라이트 + 검은 외곽선/명암 (메탈슬러그풍)
// - 노을 하늘/픽셀 구름/지면 타일/착지 먼지/반짝임 모두 도트로 렌더링
// ============================================================
function showTitleScreen() {
    // 기존 타이틀 화면 제거
    const existingTitle = document.getElementById('titleScreen');
    if (existingTitle) {
        existingTitle.remove();
    }

    const titleScreen = document.createElement('div');
    titleScreen.id = 'titleScreen';
    titleScreen.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: #000;
        z-index: 10000;
        overflow: hidden;
        cursor: pointer;
    `;

    const tCanvas = document.createElement('canvas');
    tCanvas.style.cssText = 'width:100%;height:100%;display:block;image-rendering:pixelated;';
    titleScreen.appendChild(tCanvas);
    document.body.appendChild(titleScreen);
    const tctx = tCanvas.getContext('2d');

    let running = true;
    let frame = 0;
    let shake = 0;        // 로고 착지 화면 흔들림
    let slammed = false;  // 로고 착지 완료 여부
    let started = false;  // 시작 연출 진행 중 여부
    let flashTimer = 0;
    const dust = [];      // 착지 먼지 파티클
    const sparks = [];    // 로고 반짝임 파티클

    function resize() {
        tCanvas.width = titleScreen.clientWidth;
        tCanvas.height = titleScreen.clientHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // ---- 도트 구름 스프라이트 ----
    const CLOUD_SPRITE = [
        [0,0,0,1,1,1,1,0,0,0,0,0,0,0],
        [0,1,1,2,2,2,2,1,1,0,0,1,1,0],
        [1,2,2,2,2,2,2,2,2,1,1,2,2,1],
        [1,2,2,2,2,2,2,2,2,2,2,2,2,1],
        [0,1,1,2,2,2,2,2,2,2,2,1,1,0],
        [0,0,0,1,1,1,1,1,1,1,1,0,0,0]
    ];
    const CLOUD_COLORS = { 0: null, 1: '#C98C7A', 2: '#F2CBB0' };
    const clouds = [
        { rx: 0.10, ry: 0.10, scale: 5, speed: 0.20 },
        { rx: 0.55, ry: 0.05, scale: 4, speed: 0.30 },
        { rx: 0.80, ry: 0.18, scale: 6, speed: 0.15 },
        { rx: 0.30, ry: 0.22, scale: 3, speed: 0.40 }
    ];

    // 노을 하늘 밴드 (위 → 아래)
    const SKY_BANDS = ['#0E1230', '#232B5C', '#4A3B7C', '#8C4A6E', '#C56A50', '#E8925A'];

    // 행진하는 캐릭터들 (characters-player.js의 도트 스프라이트 사용)
    // 각자 시그니처 동작: 크림이(라켓 스윙) → 세은(연필+단어 암기) →
    // 초이(아이돌 댄스) → 하린(곰인형 떨어뜨리고 줍느라 맨 뒤)
    const marchers = [
        { name: 'jiyul', offset: 0, sig: 'paddle' },
        { name: 'seeun', offset: 105, sig: 'study' },
        { name: 'choi', offset: 215, sig: 'dance' },
        { name: 'harin', offset: 330, sig: 'bear' }
    ];

    // 도트 음표 (초이 댄스용)
    const NOTE_SPRITE = [
        [0,0,0,1,1,1],
        [0,0,0,1,0,1],
        [0,0,0,1,0,0],
        [0,0,0,1,0,0],
        [0,1,1,1,0,0],
        [1,1,1,1,0,0]
    ];
    const NOTE_COLORS_A = { 0: null, 1: '#FFFFFF' };
    const NOTE_COLORS_B = { 0: null, 1: '#FFE55A' };

    // 셰이크핸드 탁구 라켓 (크림이 공 튀기기용, 수평으로 든 형태)
    // 납작한 블레이드 + 왼쪽 나무 손잡이, 튀길 때마다 보라면/핑크면 교대
    const PADDLE_FLAT = [
        [0,0,0,0,1,1,1,1,1,0,0],
        [4,4,5,1,2,2,3,2,2,1,0],
        [4,4,5,1,2,2,2,2,2,2,1],
        [0,0,0,0,1,1,1,1,1,0,0]
    ];
    // 보라색 러버 면
    const PADDLE_COLORS_PURPLE = {
        0: null, 1: '#3A1A4A', 2: '#9B59D0', 3: '#C79AE8',
        4: '#D9A05B', 5: '#B67F3E'
    };
    // 핑크색 러버 면
    const PADDLE_COLORS_PINK = {
        0: null, 1: '#7A2A4A', 2: '#FF7FB0', 3: '#FFC2DC',
        4: '#D9A05B', 5: '#B67F3E'
    };
    // 탁구공 (흰 공 + 옅은 셰이드)
    const BALL_SPRITE = [
        [0,1,1,0],
        [1,1,1,2],
        [1,1,2,2],
        [0,2,2,0]
    ];
    const BALL_COLORS = { 0: null, 1: '#FFFFFF', 2: '#D8D8DC' };

    // 갈색 곰돌이 인형 (하린용)
    const BEAR_SPRITE = [
        [1,1,0,0,1,1],
        [1,2,1,1,2,1],
        [0,2,2,2,2,0],
        [2,2,3,3,2,2],
        [0,2,2,2,2,0],
        [0,2,0,0,2,0]
    ];
    const BEAR_COLORS = { 0: null, 1: '#5A3A1E', 2: '#8A5A2B', 3: '#D9B380' };

    // 연필 (세은용, 귀에 꽂은 모양)
    function drawPencil(x, y, s) {
        tctx.fillStyle = '#FFC22B';                 // 몸통 (노랑)
        tctx.fillRect(x, y, s * 4, s);
        tctx.fillStyle = '#FFD9A8';                 // 깎인 부분
        tctx.fillRect(x + s * 4, y, s, s);
        tctx.fillStyle = '#2E2E36';                 // 심
        tctx.fillRect(x + s * 5, y, Math.ceil(s / 2), s);
        tctx.fillStyle = '#FF8FB8';                 // 지우개
        tctx.fillRect(x - s, y, s, s);
    }

    // 메탈슬러그풍 로컬 스프라이트 렌더러 (검은 외곽선 + 상단 하이라이트/하단 셰이드)
    // 셀 경계를 정수 픽셀에 스냅해서 소수 스케일에서도 이음새(안티앨리어싱 줄무늬)가 생기지 않게 한다
    function drawSpriteMS(sprite, colorMap, x, y, scale, flipH) {
        const rows = sprite.length;
        let cols = 0;
        for (const row of sprite) cols = Math.max(cols, row.length);
        const isSolid = (r, c) => r >= 0 && r < rows && c >= 0 && c < cols &&
            sprite[r][c] !== undefined && sprite[r][c] !== 0 && !!colorMap[sprite[r][c]];
        const snapY = r => Math.round(y + r * scale);
        const cellRect = (r, c) => {
            const x0 = flipH ? Math.round(x + (cols - 1 - c) * scale) : Math.round(x + c * scale);
            const x1 = flipH ? Math.round(x + (cols - c) * scale) : Math.round(x + (c + 1) * scale);
            const y0 = snapY(r);
            const y1 = snapY(r + 1);
            return [x0, y0, x1 - x0, y1 - y0];
        };

        tctx.fillStyle = '#15101C';
        for (let r = -1; r <= rows; r++) {
            for (let c = -1; c <= cols; c++) {
                if (isSolid(r, c)) continue;
                if (isSolid(r - 1, c) || isSolid(r + 1, c) || isSolid(r, c - 1) || isSolid(r, c + 1)) {
                    const [rx, ry, rw, rh] = cellRect(r, c);
                    tctx.fillRect(rx, ry, rw, rh);
                }
            }
        }
        const edge = Math.max(1, Math.round(scale / 3));
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (!isSolid(r, c)) continue;
                const [rx, ry, rw, rh] = cellRect(r, c);
                tctx.fillStyle = colorMap[sprite[r][c]];
                tctx.fillRect(rx, ry, rw, rh);
                if (!isSolid(r - 1, c)) {
                    tctx.fillStyle = 'rgba(255,255,255,0.30)';
                    tctx.fillRect(rx, ry, rw, edge);
                } else if (!isSolid(r + 1, c)) {
                    tctx.fillStyle = 'rgba(0,0,0,0.30)';
                    tctx.fillRect(rx, ry + rh - edge, rw, edge);
                }
            }
        }
    }

    function spawnDust(cx, cy, count) {
        for (let i = 0; i < count; i++) {
            dust.push({
                x: cx + (Math.random() - 0.5) * 60,
                y: cy,
                vx: (Math.random() - 0.5) * 6,
                vy: -Math.random() * 5 - 1,
                life: 25 + Math.random() * 15,
                color: Math.random() < 0.5 ? '#D8C49A' : '#A89070'
            });
        }
    }

    function drawScene() {
        const w = tCanvas.width;
        const h = tCanvas.height;
        const base = Math.max(0.6, Math.min(w / 480, h / 320));

        tctx.save();
        if (shake > 0) {
            tctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);
            shake *= 0.82;
            if (shake < 0.5) shake = 0;
        }

        // ---- 하늘 (픽셀 밴드) ----
        const bandH = Math.ceil(h * 0.82 / SKY_BANDS.length);
        SKY_BANDS.forEach((color, i) => {
            tctx.fillStyle = color;
            tctx.fillRect(-20, i * bandH, w + 40, bandH + 1);
        });

        // ---- 도트 태양 ----
        const sunX = Math.round(w * 0.78), sunY = Math.round(h * 0.60);
        const sp = Math.max(4, Math.floor(base * 5));
        [['#FFE9A8', 3], ['#FFC945', 5], ['#F0903A', 7]].reverse().forEach(([color, radius]) => {
            tctx.fillStyle = color;
            for (let ry = -radius; ry <= radius; ry++) {
                for (let rx = -radius; rx <= radius; rx++) {
                    if (rx * rx + ry * ry <= radius * radius) {
                        tctx.fillRect(sunX + rx * sp, sunY + ry * sp, sp, sp);
                    }
                }
            }
        });

        // ---- 구름 (드리프트) ----
        clouds.forEach(cl => {
            const cw = CLOUD_SPRITE[0].length * cl.scale * base;
            const cx = ((cl.rx * w + frame * cl.speed) % (w + cw)) - cw;
            drawSpriteMS(CLOUD_SPRITE, CLOUD_COLORS, cx, cl.ry * h, cl.scale * base, false);
        });

        // ---- 지면 (픽셀 타일) ----
        const groundTop = Math.floor(h * 0.82);
        const gp = Math.max(4, Math.floor(base * 6));
        for (let gy = groundTop; gy < h; gy += gp) {
            for (let gx = -gp; gx < w + gp; gx += gp) {
                const iy = Math.floor((gy - groundTop) / gp);
                const ix = Math.floor(gx / gp);
                let color;
                if (iy === 0) {
                    color = (ix * 7 + 3) % 4 === 0 ? '#5FA33C' : '#3E7C2F';   // 풀
                } else if (iy === 1) {
                    color = '#6B4A2B';
                } else {
                    color = (ix * 5 + iy * 13) % 7 === 0 ? '#7C5836' : ((ix * 3 + iy * 11) % 5 === 0 ? '#4A3018' : '#58391F'); // 흙 + 자갈
                }
                tctx.fillStyle = color;
                tctx.fillRect(gx, gy, gp, gp);
            }
        }

        // ---- 행진하는 캐릭터 (각자 시그니처 동작) ----
        if (typeof pixelData !== 'undefined') {
            const mScale = Math.max(2, Math.floor(base * 2.6));
            const walkFrame = Math.floor(frame / 8) % 2;
            marchers.forEach(m => {
                const data = pixelData[m.name];
                if (!data) return;
                const spriteW = 16 * mScale;
                const travel = w + spriteW + 240;
                const mx = ((frame * 1.6 + m.offset * base) % travel) - spriteW - 20;
                const baseY = groundTop - 16 * mScale + Math.floor(mScale / 2);
                const walkSprite = walkFrame === 0 ? (data.walking1 || data.idle) : (data.walking2 || data.idle);

                if (m.sig === 'paddle') {
                    // ---- 크림이: 탁구공을 라켓으로 통통 튀기며 행진 ----
                    // 32프레임에 한 번 공이 튀고, 튀길 때마다 보라면/핑크면 교대
                    drawSpriteMS(walkSprite, data.colorMap, mx, baseY, mScale, false);
                    const ps = Math.max(1, Math.round(mScale * 0.8));
                    const T = 32;
                    const bt = frame % T;
                    const p = bt / T;
                    const bounceIdx = Math.floor(frame / T);
                    const faceColors = bounceIdx % 2 === 0 ? PADDLE_COLORS_PURPLE : PADDLE_COLORS_PINK;

                    // 라켓: 공을 받아칠 때 살짝 위로 톡
                    const paddleX = mx + spriteW - ps * 3;
                    const paddleBaseY = baseY + mScale * 8;
                    const hitLift = bt < 5 ? Math.round((1 - bt / 5) * ps * 2) : 0;
                    drawSpriteMS(PADDLE_FLAT, faceColors, paddleX, paddleBaseY - hitLift, ps, false);

                    // 탁구공: 라켓 위에서 포물선으로 통통 (공중에서 살짝 흔들림)
                    const arc = Math.sin(p * Math.PI);                       // 0→1→0
                    const ballX = paddleX + ps * 7 + Math.round(Math.sin(frame * 0.3) * ps * 0.5);
                    const ballY = paddleBaseY - ps * 4 - Math.round(arc * mScale * 7);
                    drawSpriteMS(BALL_SPRITE, BALL_COLORS, ballX, ballY, Math.max(1, Math.round(ps * 0.8)), false);

                    // 팅! 하는 순간 임팩트 반짝 (라켓에 닿을 때, 러버색과 같은 빛)
                    if (bt < 4) {
                        tctx.fillStyle = bounceIdx % 2 === 0 ? '#C79AE8' : '#FFC2DC';
                        const ix = paddleX + ps * 7, iy = paddleBaseY - hitLift;
                        tctx.fillRect(ix - ps * 3, iy, ps, ps);
                        tctx.fillRect(ix + ps * 4, iy, ps, ps);
                        tctx.fillRect(ix, iy - ps * 2, ps, ps);
                    }
                } else if (m.sig === 'study') {
                    // ---- 세은: 귀에 연필 꽂고 영어 단어를 외우며 행진 ----
                    drawSpriteMS(walkSprite, data.colorMap, mx, baseY, mScale, false);
                    // 귀에 꽂은 연필 (머리 옆, 걸음에 맞춰 살짝 흔들림)
                    const pBob = Math.round(Math.sin(frame * 0.2) * 1);
                    drawPencil(mx - mScale * 2, baseY + mScale * 5 + pBob, Math.max(2, Math.round(mScale * 0.7)));
                    // 머리 위로 알파벳이 떠오르며 사라지는 암기 연출
                    if (typeof PixelText !== 'undefined') {
                        const words = ['A', 'B', 'C', 'CAT', 'DOG', 'SUN'];
                        for (let n = 0; n < 2; n++) {
                            const cycle = 70;
                            const t = (frame + n * 35) % cycle;
                            const wordIdx = (Math.floor((frame + n * 35) / cycle) + n * 3) % words.length;
                            const alpha = t < 10 ? t / 10 : (t > 55 ? (cycle - t) / 15 : 1);
                            PixelText.draw(tctx, words[wordIdx],
                                mx + spriteW / 2 + (n === 0 ? -mScale * 3 : mScale * 4),
                                baseY - mScale * (3 + n * 3) - t * 0.5, {
                                fontPx: 12, scale: 2, palette: n % 2 ? 'gold' : 'white',
                                drawScale: 0.55 * Math.max(1, base * 0.8), alpha: Math.max(0, alpha)
                            });
                        }
                    }
                } else if (m.sig === 'bear') {
                    // ---- 하린: 곰인형 안고 가다 떨어뜨리고 → 알아채고 → 달려가 줍기 ----
                    // 220프레임 루프라 맨 뒤에서 계속 뒤처지는 귀여운 연출
                    const T = 220;
                    const t = frame % T;
                    const bs = Math.max(1, Math.round(mScale * 0.9));
                    const bearW = 6 * bs;
                    let off = 0;          // 행진 기준 위치 대비 보정치
                    let flip = false;
                    let sprite = walkSprite;
                    let bearCarried = true;
                    let bearFixedX = 0, bearFixedY = 0;

                    const dropT = 90, noticeT = 115, backT = 135, pickT = 165, doneT = 185;
                    const marchSpeed = 1.6;
                    const groundBearY = groundTop - bearW + bs;

                    if (t < dropT) {
                        // 인형 안고 걷기
                        off = 0;
                    } else if (t < noticeT) {
                        // 인형이 떨어졌는데 모르고 계속 걸음 (인형은 낙하 후 바닥에)
                        bearCarried = false;
                        const fallP = Math.min(1, (t - dropT) / 10);
                        bearFixedX = mx - marchSpeed * (t - dropT) + spriteW - bs;
                        bearFixedY = baseY + mScale * 8 + (groundBearY - baseY - mScale * 8) * fallP
                            - Math.sin(fallP * Math.PI) * 6;   // 살짝 튀며 떨어짐
                    } else if (t < backT) {
                        // 멈추고 뒤돌아봄 + 느낌표
                        bearCarried = false;
                        off = 0;
                        flip = true;
                        sprite = data.idle;
                        bearFixedX = mx - marchSpeed * (t - dropT) + spriteW - bs;
                        bearFixedY = groundBearY;
                        if (Math.floor(t / 6) % 2 === 0) {
                            tctx.fillStyle = '#FFE55A';
                            tctx.fillRect(mx + spriteW / 2 - bs, baseY - mScale * 4, bs * 2, bs * 4);
                            tctx.fillRect(mx + spriteW / 2 - bs, baseY - mScale * 4 + bs * 5, bs * 2, bs * 2);
                        }
                    } else if (t < pickT) {
                        // 인형을 향해 되돌아 달려감
                        bearCarried = false;
                        flip = true;
                        const backP = (t - backT) / (pickT - backT);
                        const needBack = marchSpeed * (t - dropT);
                        off = -needBack * backP;
                        bearFixedX = mx - needBack + spriteW - bs;
                        bearFixedY = groundBearY;
                    } else if (t < doneT) {
                        // 웅크려서 인형 줍기 (몸을 낮춤)
                        bearCarried = false;
                        const needBack = marchSpeed * (t - dropT);
                        off = -needBack;
                        flip = true;
                        sprite = data.idle;
                        bearFixedX = mx + off + spriteW - bs;
                        bearFixedY = groundBearY;
                        // 줍는 순간 인형이 손 위치로 올라옴
                        if (t > pickT + 10) {
                            bearCarried = true;
                            flip = false;
                        }
                    } else {
                        // 인형 꼭 안고 빠른 걸음으로 복귀 (잰걸음)
                        const needBack = marchSpeed * (doneT - dropT);
                        const recover = (t - doneT) / (T - doneT);
                        off = -needBack * (1 - recover);
                        sprite = Math.floor(frame / 5) % 2 === 0 ? (data.walking1 || data.idle) : (data.walking2 || data.idle);
                    }

                    const hy = (t >= pickT && t < pickT + 10) ? baseY + mScale * 2 : baseY;  // 줍는 순간 몸 낮춤
                    drawSpriteMS(sprite, data.colorMap, mx + off, hy, mScale, flip);
                    // 곰인형 그리기 (품에 안김 / 바닥에 떨어짐)
                    if (bearCarried) {
                        drawSpriteMS(BEAR_SPRITE, BEAR_COLORS,
                            mx + off + spriteW - bs * 3, hy + mScale * 8, bs, false);
                    } else {
                        drawSpriteMS(BEAR_SPRITE, BEAR_COLORS,
                            Math.round(bearFixedX), Math.round(bearFixedY), bs, false);
                    }
                } else if (m.sig === 'dance') {
                    // ---- 초이 아이돌 댄스: 4박자 안무 루틴 ----
                    // 박자 0: 대기(리듬 타기) → 1: 점프! → 2: 왼쪽 스텝 → 3: 포인트 포즈(물총 팔 뻗기)
                    const beat = Math.floor(frame / 16) % 4;
                    const beatProgress = (frame % 16) / 16;
                    let sprite = data.idle;
                    let danceY = baseY;
                    let danceX = mx;
                    let flip = false;

                    if (beat === 0) {
                        // 리듬 타기: 무릎 굽혔다 펴기 (살짝 위아래)
                        sprite = data.idle;
                        danceY += Math.round(Math.sin(beatProgress * Math.PI * 2) * mScale);
                    } else if (beat === 1) {
                        // 점프! (포물선)
                        sprite = data.jump || data.idle;
                        danceY -= Math.round(Math.sin(beatProgress * Math.PI) * mScale * 5);
                    } else if (beat === 2) {
                        // 사이드 스텝 (좌우로 미끄러지며 몸 반전)
                        sprite = walkFrame === 0 ? (data.walking1 || data.idle) : (data.walking2 || data.idle);
                        danceX += Math.round(Math.sin(beatProgress * Math.PI * 2) * mScale * 2.5);
                        flip = beatProgress > 0.5;
                    } else {
                        // 포인트 포즈: 물총 든 팔을 쭉! (casting 프레임)
                        sprite = data.casting || data.idle;
                        danceY += beatProgress < 0.3 ? -Math.round(mScale) : 0;
                    }
                    drawSpriteMS(sprite, data.colorMap, danceX, danceY, mScale, flip);

                    // 음표들: 초이 머리 위에서 좌우로 번갈아 둥실둥실
                    const noteScale = Math.max(1, Math.round(mScale / 2));
                    for (let n = 0; n < 3; n++) {
                        const notePhase = frame * 0.09 + n * 2.1;
                        const nx = danceX + spriteW / 2 + Math.round(Math.cos(notePhase) * mScale * 6) - 3 * noteScale;
                        const ny = danceY - mScale * (4 + n * 2) + Math.round(Math.sin(notePhase * 1.7) * mScale * 1.5);
                        // 위로 갈수록 옅어지는 음표 (흰색/금색 번갈아)
                        drawSpriteMS(NOTE_SPRITE, n % 2 ? NOTE_COLORS_B : NOTE_COLORS_A, nx, ny, noteScale, n % 2 === 1);
                    }
                    // 박자 강조 반짝이 (점프/포인트 순간)
                    if ((beat === 1 || beat === 3) && frame % 4 < 2) {
                        tctx.fillStyle = '#FFB6D9';
                        const sparkX = danceX + spriteW / 2;
                        const sparkY = danceY - mScale * 2;
                        tctx.fillRect(sparkX - noteScale, sparkY - noteScale * 3, noteScale * 2, noteScale * 2);
                        tctx.fillRect(sparkX - noteScale * 4, sparkY, noteScale * 2, noteScale * 2);
                        tctx.fillRect(sparkX + noteScale * 2, sparkY, noteScale * 2, noteScale * 2);
                    }
                } else {
                    const sprite = walkFrame === 0 ? (data.walking1 || data.idle) : (data.walking2 || data.idle);
                    drawSpriteMS(sprite, data.colorMap, mx, baseY, mScale, false);
                }
            });
        }

        // ---- 타이틀 로고 (스프라이트 텍스트) ----
        const hasPixelText = typeof PixelText !== 'undefined';
        if (hasPixelText) {
            const line1 = '잉글리쉬';
            const line2 = '탁구 헌터 J';
            const sub = 'ENGLISH PING PONG HUNTER';
            const startText = '터치해서 시작!';

            // 메인 로고(line2)는 굵은 도트 느낌을 유지하고,
            // 한글 보조 문구는 격자를 촘촘하게(fontPx↑) 만들어 또렷하게 읽히도록 한다
            const line1Opts = { fontPx: 34, scale: 2, palette: 'steel' };
            const line2Opts = { fontPx: 18, scale: 2, palette: 'gold' };
            const subOpts = { fontPx: 22, scale: 2, palette: 'fire' };
            const startOpts = { fontPx: 30, scale: 2, palette: 'white' };

            // 레이아웃: 1행 → 로고 → 부제목 → 시작 안내를 위에서부터 순서대로 배치
            const m1 = PixelText.measure(line1, line1Opts);
            const m2 = PixelText.measure(line2, line2Opts);
            const m3 = PixelText.measure(sub, subOpts);
            const m4 = PixelText.measure(startText, startOpts);
            // fontPx를 키운 만큼 배율 상한을 낮춰 화면 크기는 기존과 동일하게 유지
            const s1 = Math.min(0.66 * base, (w * 0.42) / m1.width);
            const fit = Math.min(3.0 * base, (w * 0.86) / m2.width);
            const s3 = Math.min(0.65 * base, (w * 0.66) / m3.width);
            const s4 = Math.min(0.65 * base, (w * 0.5) / m4.width);
            const line1H = m1.height * s1;
            const logoH = m2.height * fit;
            const line1Y = h * 0.05;
            const logoY = line1Y + line1H + 6 * base;
            const subY = logoY + logoH + 8 * base;
            const startY = Math.min(h * 0.66, subY + m3.height * s3 + h * 0.05);

            // 1행: 강철 팔레트 (frame 12부터 위에서 내려옴)
            if (frame > 12) {
                const p1 = Math.min(1, (frame - 12) / 15);
                PixelText.draw(tctx, line1, w / 2, line1Y - (1 - p1) * 60, {
                    ...line1Opts, drawScale: s1, alpha: p1, shadowOffset: 3 * base
                });
            }

            // 2행: 금색 로고 슬램 (frame 24~46에 거대 → 착지)
            if (frame > 24) {
                const slamP = Math.min(1, (frame - 24) / 22);
                const ease = 1 - Math.pow(1 - slamP, 3);
                const s2 = fit * (1 + (1 - ease) * 4);
                PixelText.draw(tctx, line2, w / 2, logoY + (logoH - m2.height * s2) / 2, {
                    ...line2Opts, drawScale: s2, alpha: 0.35 + 0.65 * ease, shadowOffset: 4 * base
                });
                if (slamP >= 1 && !slammed) {
                    slammed = true;
                    shake = 14;
                    spawnDust(w / 2, logoY + logoH + 10, 26);
                }
                // 착지 후 주기적 반짝임
                if (slammed && frame % 26 === 0) {
                    sparks.push({
                        x: w / 2 + (Math.random() - 0.5) * m2.width * fit,
                        y: logoY + Math.random() * logoH,
                        life: 18, maxLife: 18
                    });
                }
            }

            // 부제목
            if (slammed && frame > 60) {
                PixelText.draw(tctx, sub, w / 2, subY, {
                    ...subOpts, drawScale: s3, shadowOffset: 2 * base
                });
            }

            // 시작 안내 (깜빡임)
            if (slammed && frame > 75 && frame % 70 < 45) {
                PixelText.draw(tctx, startText, w / 2, startY, {
                    ...startOpts, drawScale: s4, shadowOffset: 2 * base
                });
            }
        }

        // ---- 먼지 파티클 ----
        for (let i = dust.length - 1; i >= 0; i--) {
            const d = dust[i];
            d.x += d.vx;
            d.y += d.vy;
            d.vy += 0.25;
            d.life--;
            if (d.life <= 0) {
                dust.splice(i, 1);
                continue;
            }
            tctx.fillStyle = d.color;
            const size = Math.max(2, Math.floor(base * 4 * (d.life / 40)));
            tctx.fillRect(d.x, d.y, size, size);
        }

        // ---- 반짝임 파티클 (도트 십자 별) ----
        for (let i = sparks.length - 1; i >= 0; i--) {
            const s = sparks[i];
            s.life--;
            if (s.life <= 0) {
                sparks.splice(i, 1);
                continue;
            }
            const t = s.life / s.maxLife;
            const arm = Math.max(2, Math.floor(base * 8 * Math.sin(t * Math.PI)));
            const dot = Math.max(2, Math.floor(base * 3));
            tctx.fillStyle = t > 0.4 ? '#FFFFFF' : '#FFE55A';
            tctx.fillRect(s.x - dot / 2, s.y - arm, dot, arm * 2);
            tctx.fillRect(s.x - arm, s.y - dot / 2, arm * 2, dot);
        }

        tctx.restore();

        // ---- 시작 플래시 ----
        if (started) {
            flashTimer++;
            tctx.fillStyle = `rgba(255,255,255,${Math.min(1, flashTimer / 12)})`;
            tctx.fillRect(0, 0, w, h);
        }
    }

    function loop() {
        if (!running) return;
        frame++;
        drawScene();
        if (started && flashTimer >= 16) {
            cleanup();
            return;
        }
        requestAnimationFrame(loop);
    }

    function cleanup() {
        running = false;
        window.removeEventListener('resize', resize);
        window.removeEventListener('keydown', onKey);
        titleScreen.remove();
        console.log('🎬 Starting opening sequence...');
        setTimeout(() => {
            startOpeningSequence();
        }, 100);
    }

    function onStart() {
        if (started) return;
        // 인트로 연출이 끝나기 전 터치하면 연출 스킵
        if (!slammed) {
            frame = Math.max(frame, 100);
            slammed = true;
            shake = 10;
            spawnDust(tCanvas.width / 2, tCanvas.height * 0.30, 20);
            return;
        }
        console.log('🚀 Title start!');
        started = true;
        flashTimer = 0;
    }

    function onKey(e) {
        if (e.code === 'Space' || e.code === 'Enter') {
            e.preventDefault();
            onStart();
        }
    }

    titleScreen.addEventListener('click', (e) => {
        e.stopPropagation();
        onStart();
    });
    titleScreen.addEventListener('touchend', (e) => {
        e.preventDefault();
        e.stopPropagation();
        onStart();
    });
    window.addEventListener('keydown', onKey);

    loop();
}

// 오프닝 시퀀스를 시작하는 함수 - story.js의 오리지널 스토리 사용
function startOpeningSequence() {
    console.log('📽️ startOpeningSequence called');

    const canvas = document.getElementById('gameCanvas');

    if (!canvas) {
        console.error('❌ Canvas not found!');
        return;
    }

    console.log('✅ Canvas found:', canvas);

    // 캔버스 표시
    canvas.style.display = 'block';

    // 모든 UI 요소 숨기기 (존재하는 것만)
    const elementsToHide = ['characterSelectMenu', 'unitSelectMenu', 'ui', 'questionPanel', 'fullscreenBtn', 'controls', 'wordProgress'];
    elementsToHide.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.style.display = 'none';
        }
    });

    console.log('🎭 Starting story.js opening sequence...');
    console.log('🔍 Checking StoryScene availability...');
    console.log('   typeof StoryScene:', typeof StoryScene);
    console.log('   typeof window.StoryScene:', typeof window.StoryScene);
    console.log('   typeof storyScene:', typeof storyScene);
    console.log('   storyScene value:', storyScene);

    // storyScene이 없으면 초기화
    if (typeof storyScene === 'undefined' || !storyScene) {
        console.log('🔧 Initializing storyScene...');
        const ctx = canvas.getContext('2d');

        // window.StoryScene을 명시적으로 체크
        const StorySceneClass = window.StoryScene || StoryScene;

        if (typeof StorySceneClass !== 'undefined') {
            console.log('✅ StoryScene class found, creating instance...');
            storyScene = new StorySceneClass(canvas, ctx);
            console.log('✅ storyScene initialized:', storyScene);
        } else {
            console.error('❌ StoryScene class not found!');
            console.error('   This means story.js did not load properly.');
            console.error('   Please hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)');
            // fallback: 바로 게임 시작
            if (typeof startGame === 'function') {
                startGame();
            }
            return;
        }
    }

    // story.js의 storyScene 사용
    if (storyScene) {
        console.log('🎬 Starting opening with storyScene...');
        console.log('📊 storyScene object:', storyScene);
        console.log('📊 typeof storyScene.startOpening:', typeof storyScene.startOpening);

        try {
            storyScene.startOpening(function() {
                console.log('✨ Opening sequence completed!');
                // 오프닝 완료 후 게임 시작
                if (typeof startGame === 'function') {
                    console.log('🎮 Starting game...');
                    startGame();
                } else {
                    console.error('❌ startGame function not found!');
                }
            });
            console.log('✅ startOpening() called successfully');
        } catch (error) {
            console.error('❌ Error calling startOpening():', error);
            // fallback: 바로 게임 시작
            if (typeof startGame === 'function') {
                startGame();
            }
        }
    } else {
        console.error('❌ storyScene still not available! Falling back to startGame...');
        // fallback: 바로 게임 시작
        if (typeof startGame === 'function') {
            startGame();
        }
    }
}
