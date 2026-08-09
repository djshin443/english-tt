// ============================================================
// 메탈슬러그풍 스프라이트 스타일 패치
// game.js / story.js 뒤에 로드되어 픽셀 스프라이트 렌더러를
// 메탈슬러그풍(실루엣 검은 외곽선 + 상단 하이라이트/하단 셰이드)으로
// 교체하고, 미사용 상태였던 걷기 프레임(walking1/walking2)을
// 4프레임 걷기 사이클로 연결한다.
// 별도 파일로 둔 이유: 대형 원본 파일(game.js, story.js)을 건드리지
// 않고 전역 함수/프로토타입 재바인딩만으로 게임 전체(캐릭터, 몬스터,
// 보스, 알파벳 카드, 오프닝 컷씬)에 스타일을 일괄 적용하기 위함.
// ============================================================
(function () {
    'use strict';

    // 메탈슬러그풍 4프레임 걷기 사이클 (걷기1 → 대기 → 걷기2 → 대기)
    const WALK_CYCLE = ['walking1', 'idle', 'walking2', 'idle'];

    // 공용 렌더러: 대상 컨텍스트에 외곽선 + 명암 포함 스프라이트를 그린다
    // 셀 경계를 정수 픽셀에 스냅해 소수 스케일에서도 이음새가 생기지 않는다
    function renderSpriteMS(targetCtx, sprite, colorMap, x, y, scale, flipH) {
        const rows = sprite.length;
        let cols = 0;
        for (const row of sprite) cols = Math.max(cols, row.length);

        const isSolid = (r, c) => r >= 0 && r < rows && c >= 0 && c < cols &&
            sprite[r][c] !== undefined && sprite[r][c] !== 0 && !!colorMap[sprite[r][c]];
        const cellRect = (r, c) => {
            const x0 = flipH ? Math.round(x + (cols - 1 - c) * scale) : Math.round(x + c * scale);
            const x1 = flipH ? Math.round(x + (cols - c) * scale) : Math.round(x + (c + 1) * scale);
            const y0 = Math.round(y + r * scale);
            const y1 = Math.round(y + (r + 1) * scale);
            return [x0, y0, x1 - x0, y1 - y0];
        };

        // 1) 외곽선 패스: 투명 이웃 칸에 검은 도트를 채워 실루엣 테두리 생성
        targetCtx.fillStyle = '#15101C';
        for (let r = -1; r <= rows; r++) {
            for (let c = -1; c <= cols; c++) {
                if (isSolid(r, c)) continue;
                if (isSolid(r - 1, c) || isSolid(r + 1, c) || isSolid(r, c - 1) || isSolid(r, c + 1)) {
                    const [rx, ry, rw, rh] = cellRect(r, c);
                    targetCtx.fillRect(rx, ry, rw, rh);
                }
            }
        }

        // 2) 본체 + 명암 (위가 뚫린 칸은 림라이트, 아래가 뚫린 칸은 그림자)
        const edge = Math.max(1, Math.round(scale / 3));
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (!isSolid(r, c)) continue;
                const [rx, ry, rw, rh] = cellRect(r, c);
                targetCtx.fillStyle = colorMap[sprite[r][c]];
                targetCtx.fillRect(rx, ry, rw, rh);
                if (!isSolid(r - 1, c)) {
                    targetCtx.fillStyle = 'rgba(255,255,255,0.30)';
                    targetCtx.fillRect(rx, ry, rw, edge);
                } else if (!isSolid(r + 1, c)) {
                    targetCtx.fillStyle = 'rgba(0,0,0,0.30)';
                    targetCtx.fillRect(rx, ry + rh - edge, rw, edge);
                }
            }
        }
    }
    window.renderSpriteMS = renderSpriteMS;

    // ---- game.js의 전역 drawPixelSprite 교체 ----
    // (캐릭터, 몬스터, 보스, 알파벳 카드 등 모든 인게임 스프라이트에 적용)
    if (typeof drawPixelSprite === 'function' && typeof ctx !== 'undefined') {
        drawPixelSprite = function (sprite, colorMap, x, y, scale = PIXEL_SCALE, flipH = false) {
            renderSpriteMS(ctx, sprite, colorMap, x, y, scale, flipH);
        };
    }

    // ---- story.js의 StoryScene 렌더러 교체 (오프닝/엔딩 컷씬) ----
    if (typeof StoryScene !== 'undefined') {
        StoryScene.prototype.drawPixelSprite = function (sprite, colorMap, x, y, scale = this.PIXEL_SCALE, flipH = false) {
            renderSpriteMS(this.ctx, sprite, colorMap, x, y, scale, flipH);
        };
    }

    // ---- 걷기 애니메이션 연결 ----
    // 원본 updatePlayer는 이동해도 animation을 바꾸지 않아 걷기 프레임이
    // 사용되지 않았다. 이동 여부에 따라 walk/idle을 전환하고 프레임을 돌린다.
    if (typeof updatePlayer === 'function' && typeof player !== 'undefined') {
        const originalUpdatePlayer = updatePlayer;
        let walkTick = 0;
        updatePlayer = function () {
            originalUpdatePlayer();
            if (player.animation !== 'casting' && player.animation !== 'smashing') {
                player.animation = (player.vx !== 0 || player.vy !== 0) ? 'walk' : 'idle';
            }
            if (player.animation === 'walk') {
                walkTick++;
                if (walkTick >= player.frameDelay) {
                    walkTick = 0;
                    player.frameIndex = (player.frameIndex + 1) % WALK_CYCLE.length;
                }
            }
        };
    }

    // 걷기 상태면 걷기 사이클에서 현재 프레임을 골라 그린다
    if (typeof drawPlayer === 'function' && typeof player !== 'undefined') {
        drawPlayer = function () {
            const spriteData = pixelData[player.sprite];
            if (spriteData) {
                let frameName = player.animation;
                if (frameName === 'walk') {
                    frameName = WALK_CYCLE[player.frameIndex % WALK_CYCLE.length];
                }
                const sprite = spriteData[frameName] || spriteData.idle;
                if (sprite) {
                    drawPixelSprite(sprite, spriteData.colorMap, player.x, player.y, PIXEL_SCALE);
                }

                // 공격 모션 중 메탈슬러그풍 도트 섬광 (머즐 플래시)
                if (player.animation === 'casting' || player.animation === 'smashing') {
                    const fx = player.x + player.width + 6;
                    const fy = player.y + player.height / 2 - 6;
                    const t = Math.floor(Date.now() / 60) % 3;
                    const flashColors = ['#FFFFFF', '#FFE55A', '#FF8C1A'];
                    const s = PIXEL_SCALE;
                    // 십자 + 대각 도트 섬광 (프레임마다 회전하는 느낌)
                    ctx.fillStyle = flashColors[t];
                    ctx.fillRect(fx, fy - s * 2, s, s * 5);
                    ctx.fillRect(fx - s * 2, fy, s * 5, s);
                    if (t !== 1) {
                        ctx.fillRect(fx - s, fy - s, s, s);
                        ctx.fillRect(fx + s, fy + s, s, s);
                        ctx.fillRect(fx + s, fy - s, s, s);
                        ctx.fillRect(fx - s, fy + s, s, s);
                    }
                }
            }

            // 세은/하린 무기 렌더링은 원본 로직 유지
            if (currentCharacter === 1 && player.showWeapon) {
                drawGreenDragonBlade(
                    player.x + player.width + 20,
                    player.y + player.height / 2,
                    player.weaponAngle
                );
            }
            // 크림(0)이 사인검(번개검) 사용
            if (currentCharacter === 0 && player.showWeapon) {
                drawLightningSword(
                    player.x + player.width + 20,
                    player.y + player.height / 2,
                    player.weaponAngle
                );
            }
        };
    }

    // ---- "화면을 돌려주세요" 회전 안내를 도트 스프라이트 화면으로 교체 ----
    (function pixelRotatePrompt() {
        const prompt = document.getElementById('rotatePrompt');
        if (!prompt) return;
        prompt.innerHTML = '';
        prompt.style.background = '#0E1230';
        prompt.style.padding = '0';
        const rc = document.createElement('canvas');
        rc.style.cssText = 'width:100%;height:100%;display:block;image-rendering:pixelated;';
        prompt.appendChild(rc);
        const g = rc.getContext('2d');

        // 도트 휴대폰 (세로)
        const PHONE_P = [
            [1,1,1,1,1,1,1,1,1,1],
            [1,1,1,3,3,3,3,1,1,1],
            [1,2,2,2,2,2,2,2,2,1],
            [1,2,2,2,2,2,2,2,2,1],
            [1,2,2,4,2,2,2,2,2,1],
            [1,2,2,4,4,2,2,2,2,1],
            [1,2,2,4,4,4,2,2,2,1],
            [1,2,2,4,4,2,2,2,2,1],
            [1,2,2,4,2,2,2,2,2,1],
            [1,2,2,2,2,2,2,2,2,1],
            [1,2,2,2,2,2,2,2,2,1],
            [1,2,2,2,2,2,2,2,2,1],
            [1,2,2,2,2,2,2,2,2,1],
            [1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,3,3,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1]
        ];
        // 도트 휴대폰 (가로) = 세로를 눕힌 형태
        const PHONE_L = PHONE_P[0].map((_, c) =>
            PHONE_P.map(row => row[c]).reverse()
        );
        const PHONE_COLORS = { 0: null, 1: '#C8D4E0', 2: '#1E3A5C', 3: '#5A6478', 4: '#FFC22B' };

        let frame = 0;
        function draw() {
            frame++;
            const visible = getComputedStyle(prompt).display !== 'none';
            if (visible) {
                if (rc.width !== prompt.clientWidth || rc.height !== prompt.clientHeight) {
                    rc.width = prompt.clientWidth;
                    rc.height = prompt.clientHeight;
                }
                const w = rc.width, h = rc.height;
                const base = Math.max(0.7, Math.min(w / 360, h / 640));

                // 어두운 밤하늘 밴드 + 별
                const bands = ['#0A0E24', '#0E1230', '#161C40', '#1E2650'];
                const bandH = Math.ceil(h / bands.length);
                bands.forEach((color, i) => {
                    g.fillStyle = color;
                    g.fillRect(0, i * bandH, w, bandH + 1);
                });
                g.fillStyle = 'rgba(255,255,255,0.6)';
                for (let i = 0; i < 20; i++) {
                    const sx = ((i * 73856093) >>> 0) % w;
                    const sy = ((i * 19349663) >>> 0) % h;
                    if (i % 3 === 0) g.fillRect(sx, sy, 3, 3);
                }

                // 휴대폰: 세로 ↔ 가로 번갈아 표시 (60프레임 주기)
                const showLandscape = Math.floor(frame / 60) % 2 === 1;
                const sprite = showLandscape ? PHONE_L : PHONE_P;
                const ps = Math.max(4, Math.floor(base * 9));
                const pw = sprite[0].length * ps, ph = sprite.length * ps;
                const px0 = Math.round((w - pw) / 2), py0 = Math.round(h * 0.32 - ph / 2);
                if (typeof renderSpriteMS === 'function') {
                    renderSpriteMS(g, sprite, PHONE_COLORS, px0, py0, ps, false);
                }

                // 회전 화살표 (도트 곡선 + 화살촉)
                g.fillStyle = '#FFE55A';
                const cx = w / 2, cy = h * 0.32;
                const rad = Math.max(pw, ph) * 0.75;
                for (let a = 0; a < 7; a++) {
                    const ang = -Math.PI * 0.25 + a * 0.16;
                    g.fillRect(cx + Math.cos(ang) * rad - 3, cy + Math.sin(ang) * rad - 3, 6, 6);
                }
                const tipAng = -Math.PI * 0.25 + 7 * 0.16;
                const tx = cx + Math.cos(tipAng) * rad, ty = cy + Math.sin(tipAng) * rad;
                g.fillRect(tx - 5, ty - 9, 10, 6);
                g.fillRect(tx - 5, ty - 3, 6, 6);

                // 안내 문구 (스프라이트 텍스트, 깜빡임)
                if (typeof PixelText !== 'undefined') {
                    PixelText.draw(g, '화면을 돌려주세요!', w / 2, h * 0.58, {
                        fontPx: 14, scale: 2, palette: 'gold',
                        drawScale: Math.min(1.4 * base, (w * 0.85) / PixelText.measure('화면을 돌려주세요!', { fontPx: 14, scale: 2 }).width),
                        shadowOffset: 3
                    });
                    if (Math.floor(frame / 40) % 2 === 0) {
                        PixelText.draw(g, '가로 모드에서 플레이할 수 있어요', w / 2, h * 0.68, {
                            fontPx: 12, scale: 2, palette: 'white',
                            drawScale: Math.min(0.9 * base, (w * 0.85) / PixelText.measure('가로 모드에서 플레이할 수 있어요', { fontPx: 12, scale: 2 }).width),
                            shadowOffset: 2
                        });
                    }
                }
            }
            requestAnimationFrame(draw);
        }
        draw();
    })();

    // ---- 모바일 액션 버튼 도트 스타일 ----
    // 이모지 아이콘을 픽셀 아이콘 캔버스로 교체하고 강판 패널 스타일 적용
    (function stylePixelButtons() {
        const style = document.createElement('style');
        style.textContent = `
            .action-btn { border-radius: 8px !important; border: 3px solid #FFC22B !important;
                background: rgba(18, 22, 14, 0.92) !important;
                box-shadow: 0 3px 0 #7A5A00 !important; }
            .action-btn:active { transform: translateY(2px) scale(0.95) !important;
                box-shadow: 0 1px 0 #7A5A00 !important; background: rgba(40, 46, 30, 0.95) !important; }
            .action-btn .btn-label { color: #FFE55A !important; text-shadow: 1px 1px 0 #000 !important; }
            .joystick-base { border-radius: 14px !important;
                border: 3px solid rgba(255, 194, 43, 0.55) !important;
                background: rgba(18, 22, 14, 0.55) !important; }
            .joystick-stick { border-radius: 10px !important; background: #FFC22B !important;
                border: 3px solid #7A5A00 !important; }
        `;
        document.head.appendChild(style);

        const ICONS = {
            // 캐릭터 체인지: 두 인물 + 교환 화살표
            characterBtn: {
                grid: [
                    [0,1,1,0,0,0,2,2,0],
                    [0,1,1,0,0,0,2,2,0],
                    [1,1,1,1,0,2,2,2,2],
                    [0,1,1,0,0,0,2,2,0],
                    [0,0,0,0,0,0,0,0,0],
                    [0,3,3,3,3,3,3,0,0],
                    [3,3,0,0,0,0,3,3,0],
                    [0,0,3,3,3,3,3,3,0]
                ],
                colors: { 1: '#FFC22B', 2: '#6EA8DC', 3: '#FFFFFF' }
            },
            // 공격: 도트 검
            swordBtn: {
                grid: [
                    [0,0,0,1,0,0,0],
                    [0,0,1,2,1,0,0],
                    [0,0,1,2,1,0,0],
                    [0,0,1,2,1,0,0],
                    [0,0,1,2,1,0,0],
                    [0,1,3,3,3,1,0],
                    [0,0,0,4,0,0,0],
                    [0,0,4,4,4,0,0]
                ],
                colors: { 1: '#2A2E3A', 2: '#E8ECF4', 3: '#FFC22B', 4: '#8A5A2B' }
            },
            // 탁구공: 도트 라켓 + 공
            ballBtn: {
                grid: [
                    [0,1,1,1,0,0,0],
                    [1,2,2,2,1,0,0],
                    [1,2,2,2,1,0,4],
                    [1,2,2,2,1,0,0],
                    [0,1,1,1,0,0,0],
                    [0,0,3,0,0,0,0],
                    [0,0,3,0,0,0,0]
                ],
                colors: { 1: '#5A1420', 2: '#E85060', 3: '#FFC22B', 4: '#FFFFFF' }
            }
        };

        Object.keys(ICONS).forEach(id => {
            const btn = document.getElementById(id);
            if (!btn) return;
            const span = btn.querySelector('span');
            if (!span) return;
            const icon = ICONS[id];
            const cell = 4;
            const rows = icon.grid.length;
            const cols = icon.grid[0].length;
            const c = document.createElement('canvas');
            c.width = cols * cell;
            c.height = rows * cell;
            c.style.cssText = 'image-rendering: pixelated; width: 32px; height: 32px; pointer-events: none; display: block; margin: 0 auto;';
            const g = c.getContext('2d');
            for (let r = 0; r < rows; r++) {
                for (let cc = 0; cc < cols; cc++) {
                    const v = icon.grid[r][cc];
                    if (!v) continue;
                    g.fillStyle = icon.colors[v];
                    g.fillRect(cc * cell, r * cell, cell, cell);
                }
            }
            span.textContent = '';
            span.appendChild(c);
        });
    })();

    // ---- HTML 상태바를 캔버스 도트 HUD로 교체 ----
    // 기존 DOM 박스(#ui, #wordProgress)를 숨기고 매 프레임 캔버스에
    // 강판 패널 + 픽셀 하트 + 스프라이트 텍스트로 그린다
    const hudStyle = document.createElement('style');
    hudStyle.textContent = '#ui, #wordProgress { display: none !important; }';
    document.head.appendChild(hudStyle);

    // 강판 패널 (어두운 올리브 + 금색 도트 테두리 + 리벳)
    function drawPixelPanel(x, y, w, h) {
        const px = 3;
        ctx.fillStyle = 'rgba(18, 22, 14, 0.88)';
        ctx.fillRect(x, y, w, h);
        ctx.fillStyle = '#FFC22B';
        for (let bx = 0; bx < w; bx += px * 2) {
            ctx.fillRect(x + bx, y, px, px);
            ctx.fillRect(x + bx, y + h - px, px, px);
        }
        for (let by = 0; by < h; by += px * 2) {
            ctx.fillRect(x, y + by, px, px);
            ctx.fillRect(x + w - px, y + by, px, px);
        }
        ctx.fillStyle = '#8A9A6A';
        [[x + px, y + px], [x + w - px * 2, y + px],
         [x + px, y + h - px * 2], [x + w - px * 2, y + h - px * 2]].forEach(([rx, ry]) => {
            ctx.fillRect(rx, ry, px, px);
        });
    }

    // 분절형 도트 게이지 바 (메탈슬러그 에너지 게이지 스타일)
    // 체력 구간에 따라 색이 초록 → 노랑 → 빨강으로 바뀌고, 잔량이 적으면 깜빡인다
    function drawPixelGauge(x, y, w, h, ratio, segments) {
        const r = Math.max(0, Math.min(1, ratio));
        // 게이지 프레임 (어두운 인셋 + 밝은 테두리)
        ctx.fillStyle = '#0A0C08';
        ctx.fillRect(x, y, w, h);
        ctx.fillStyle = '#8A9A6A';
        ctx.fillRect(x, y, w, 2);
        ctx.fillRect(x, y + h - 2, w, 2);
        ctx.fillRect(x, y, 2, h);
        ctx.fillRect(x + w - 2, y, 2, h);

        // 구간별 색상
        let base, light, dark;
        if (r > 0.6)      { base = '#5FD03A'; light = '#A8F07A'; dark = '#2E7C1E'; }
        else if (r > 0.3) { base = '#FFC22B'; light = '#FFE55A'; dark = '#B87A0A'; }
        else              { base = '#E83848'; light = '#FF8090'; dark = '#901824'; }

        // 잔량 위험 시 깜빡임
        const critical = r > 0 && r <= 0.3;
        const blinkOff = critical && Math.floor(Date.now() / 220) % 2 === 0;

        const innerX = x + 3, innerY = y + 3;
        const innerW = w - 6, innerH = h - 6;
        const segW = innerW / segments;
        const filledSegs = Math.ceil(r * segments);

        for (let i = 0; i < segments; i++) {
            const sx = Math.round(innerX + i * segW);
            const sw = Math.round(innerX + (i + 1) * segW) - sx - 1; // 1px 분절 간격
            if (i < filledSegs && !blinkOff) {
                ctx.fillStyle = base;
                ctx.fillRect(sx, innerY, sw, innerH);
                // 상단 하이라이트 / 하단 셰이드 (도트 입체감)
                ctx.fillStyle = light;
                ctx.fillRect(sx, innerY, sw, 2);
                ctx.fillStyle = dark;
                ctx.fillRect(sx, innerY + innerH - 2, sw, 2);
            } else {
                ctx.fillStyle = '#1E2218';
                ctx.fillRect(sx, innerY, sw, innerH);
            }
        }
    }

    // ---- 아케이드 크레딧 + CONTINUE 카운트다운 시스템 ----
    // 게임 오버 시 9초 카운트다운 화면을 띄우고, 입력하면 크레딧 1을 소모해
    // 현재 스테이지부터 재개한다. 카운트다운이 끝나거나 크레딧이 없으면 종료.
    const CREDIT_START = 8;
    if (typeof window.gameCredits !== 'number') {
        window.gameCredits = CREDIT_START;
    }

    let continueActive = false;
    let continueCount = 9;
    let continueDeadline = 0;
    let continueRaf = null;

    // 카운트다운 화면 렌더링 (도트 스타일)
    function drawContinueScreen() {
        const w = canvas.width, h = canvas.height;
        const hasPT = typeof PixelText !== 'undefined';

        // 어두운 오버레이 + 주사선 (아케이드 CRT 느낌)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.82)';
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
        for (let sy = 0; sy < h; sy += 4) {
            ctx.fillRect(0, sy, w, 2);
        }
        if (!hasPT) return;

        const base = Math.max(0.8, Math.min(w / 480, h / 320));

        // GAME OVER (금색 로고)
        const goOpts = { fontPx: 18, scale: 2, palette: 'gold' };
        const gm = PixelText.measure('GAME OVER', goOpts);
        const gs = Math.min(2.4 * base, (w * 0.72) / gm.width);
        PixelText.draw(ctx, 'GAME OVER', w / 2, h * 0.14, {
            ...goOpts, drawScale: gs, shadowOffset: 4 * base
        });

        // CONTINUE? (크레딧 있을 때만)
        if (window.gameCredits > 0) {
            const cOpts = { fontPx: 14, scale: 2, palette: 'fire' };
            const cm = PixelText.measure('CONTINUE?', cOpts);
            const cs = Math.min(1.7 * base, (w * 0.5) / cm.width);
            PixelText.draw(ctx, 'CONTINUE?', w / 2, h * 0.34, {
                ...cOpts, drawScale: cs, shadowOffset: 3 * base
            });

            // 대형 카운트다운 숫자 (1초마다 펄스, 3 이하 빨강)
            // 숫자 높이가 안내 문구를 침범하지 않도록 가용 높이 안에 맞춘다
            const remainMs = Math.max(0, continueDeadline - Date.now());
            const frac = (remainMs % 1000) / 1000;
            const pulse = 1 + frac * 0.3;           // 초가 바뀔 때 크게 → 작아짐
            const numOpts = {
                fontPx: 20, scale: 2,
                palette: continueCount <= 3 ? 'fire' : 'white'
            };
            const nm = PixelText.measure(String(continueCount), numOpts);
            const numTop = h * 0.45;
            const numMaxH = h * 0.26;               // 안내 문구 위까지만 사용
            const nsBase = Math.min((w * 0.16) / nm.width, numMaxH / nm.height);
            const ns = nsBase * pulse;
            // 펄스로 커져도 중앙 기준을 유지하도록 위치 보정
            PixelText.draw(ctx, String(continueCount), w / 2,
                numTop - (nm.height * (ns - nsBase)) / 2, {
                ...numOpts, drawScale: ns, shadowOffset: 4 * base
            });

            // 안내 문구 (깜빡임)
            if (Math.floor(Date.now() / 400) % 2 === 0) {
                const pOpts = { fontPx: 12, scale: 2, palette: 'gold' };
                const pm = PixelText.measure('터치 / SPACE 로 계속하기', pOpts);
                const ps = Math.min(1.2 * base, (w * 0.6) / pm.width);
                PixelText.draw(ctx, '터치 / SPACE 로 계속하기', w / 2, h * 0.78, {
                    ...pOpts, drawScale: ps, shadowOffset: 2 * base
                });
            }
        } else {
            const nOpts = { fontPx: 13, scale: 2, palette: 'fire' };
            const nm2 = PixelText.measure('CREDIT 소진!', nOpts);
            const ns2 = Math.min(1.6 * base, (w * 0.5) / nm2.width);
            PixelText.draw(ctx, 'CREDIT 소진!', w / 2, h * 0.42, {
                ...nOpts, drawScale: ns2, shadowOffset: 3 * base
            });
        }

        // 하단 크레딧 패널
        const credits = String(window.gameCredits || 0).padStart(2, '0');
        const cw = 156, ch = 30;
        const cx = Math.round((w - cw) / 2), cy = h - ch - 8;
        drawPixelPanel(cx, cy, cw, ch);
        PixelText.draw(ctx, 'CREDIT ' + credits, cx + cw / 2, cy + 8, {
            fontPx: 12, scale: 2, palette: window.gameCredits > 2 ? 'gold' : 'fire',
            drawScale: 0.7, shadowOffset: 2
        });
    }

    function continueLoop() {
        if (!continueActive) return;
        // 남은 시간으로 카운트 갱신
        const remainMs = Math.max(0, continueDeadline - Date.now());
        continueCount = Math.ceil(remainMs / 1000);
        drawContinueScreen();
        if (remainMs <= 0) {
            endContinue(false);
            return;
        }
        continueRaf = requestAnimationFrame(continueLoop);
    }

    // 카운트다운 종료: accepted=true면 크레딧 소모 후 현재 스테이지 재개
    function endContinue(accepted) {
        if (!continueActive) return;
        continueActive = false;
        if (continueRaf) cancelAnimationFrame(continueRaf);
        continueRaf = null;
        window.removeEventListener('keydown', onContinueKey);
        canvas.removeEventListener('click', onContinueClick);
        canvas.removeEventListener('touchstart', onContinueTouch);

        if (accepted && window.gameCredits > 0) {
            window.gameCredits -= 1;
            // 체력 회복 + 현재 스테이지 재개
            gameState.energy = gameState.maxEnergy;
            if (typeof characterEnergies !== 'undefined' && typeof currentCharacter !== 'undefined') {
                characterEnergies[currentCharacter] = gameState.maxEnergy;
            }
            gameState.isRunning = true;
            if (typeof showMobileControls === 'function') showMobileControls();
            if (typeof updateEnergyDisplay === 'function') updateEnergyDisplay();
            if (typeof startStage === 'function') startStage(gameState.currentStage);
            if (!gameState.gameLoopRunning) {
                gameState.gameLoopRunning = true;
                gameLoop();
            }
        } else {
            // 최종 게임 오버 화면 (기존 HTML 패널)
            const gameOverDiv = document.getElementById('gameOver');
            if (gameOverDiv) {
                gameOverDiv.classList.remove('success');
                const h2 = gameOverDiv.querySelector('h2');
                if (h2) h2.textContent = '게임 오버!';
                const msg = document.getElementById('gameOverMessage');
                if (msg) {
                    msg.textContent = `스테이지 ${gameState.currentStage}까지 클리어! / CREDIT ${String(window.gameCredits).padStart(2, '0')}`;
                }
                gameOverDiv.style.display = 'block';
            }
        }
    }

    function onContinueKey(e) {
        if (e.code === 'Space' || e.code === 'Enter') {
            e.preventDefault();
            endContinue(true);
        }
    }
    function onContinueClick() { endContinue(true); }
    function onContinueTouch(e) { e.preventDefault(); endContinue(true); }

    if (typeof gameOver === 'function') {
        gameOver = function () {
            gameState.isRunning = false;
            if (typeof hideMobileControls === 'function') hideMobileControls();

            if (window.gameCredits > 0) {
                // CONTINUE 카운트다운 시작 (9초)
                continueActive = true;
                continueCount = 9;
                continueDeadline = Date.now() + 9000;
                window.addEventListener('keydown', onContinueKey);
                canvas.addEventListener('click', onContinueClick);
                canvas.addEventListener('touchstart', onContinueTouch);
                continueLoop();
            } else {
                endContinueFallback();
            }
        };
    }

    // 크레딧이 없을 때 바로 최종 게임 오버 표시
    function endContinueFallback() {
        const gameOverDiv = document.getElementById('gameOver');
        if (!gameOverDiv) return;
        gameOverDiv.classList.remove('success');
        const h2 = gameOverDiv.querySelector('h2');
        if (h2) h2.textContent = '게임 오버!';
        const msg = document.getElementById('gameOverMessage');
        if (msg) msg.textContent = `스테이지 ${gameState.currentStage}까지 클리어! / CREDIT 소진!`;
        gameOverDiv.style.display = 'block';
    }

    if (typeof restartGame === 'function') {
        const originalRestart = restartGame;
        restartGame = function () {
            // 새 판 시작 시 크레딧 보충
            window.gameCredits = CREDIT_START;
            originalRestart();
        };
    }

    // 도트 HUD 그리기 (매 프레임, 스케일 밖 화면 좌표)
    function drawHUD() {
        if (typeof gameState === 'undefined' || !gameState.isRunning) return;
        const hasPT = typeof PixelText !== 'undefined';
        if (!hasPT) return;
        const collecting = gameState.mode === GAME_MODE.COLLECTING;

        // ---- 좌측: 캐릭터 초상 + HP 하트 + 이름 + 점수 (수집 모드) ----
        if (collecting) {
            const pw = 300, ph = 86, pxl = 10, pyt = 10;
            drawPixelPanel(pxl, pyt, pw, ph);

            // 캐릭터 초상 슬롯 (어두운 인셋 박스 + 현재 캐릭터 도트 스프라이트)
            const slotX = pxl + 10, slotY = pyt + 10, slotW = 66, slotH = 66;
            ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
            ctx.fillRect(slotX, slotY, slotW, slotH);
            ctx.fillStyle = '#8A9A6A';
            ctx.fillRect(slotX, slotY, slotW, 2);
            ctx.fillRect(slotX, slotY + slotH - 2, slotW, 2);
            ctx.fillRect(slotX, slotY, 2, slotH);
            ctx.fillRect(slotX + slotW - 2, slotY, 2, slotH);
            const portrait = (typeof pixelData !== 'undefined' && pixelData[player.sprite])
                ? pixelData[player.sprite] : null;
            if (portrait && portrait.idle) {
                // 16x16 스프라이트를 슬롯 중앙에 (외곽선 포함 렌더링)
                const ps = 3.5;
                drawPixelSprite(portrait.idle, portrait.colorMap,
                    slotX + (slotW - 16 * ps) / 2, slotY + (slotH - 16 * ps) / 2, ps);
            }

            // 초상 오른쪽: 에너지 게이지 바 + 이름 + 점수
            const infoX = slotX + slotW + 10;
            const infoW = pw - (infoX - pxl) - 12;

            // 게이지 라벨 + 바
            PixelText.draw(ctx, 'ENERGY', infoX, pyt + 8, {
                fontPx: 11, scale: 2, palette: 'gold', drawScale: 0.55, align: 'left'
            });
            drawPixelGauge(infoX, pyt + 22, infoW, 16,
                gameState.energy / gameState.maxEnergy, gameState.maxEnergy);

            const name = (typeof characterNames !== 'undefined' && typeof currentCharacter !== 'undefined')
                ? characterNames[currentCharacter] : '지율';
            PixelText.draw(ctx, name, infoX, pyt + 44, {
                fontPx: 13, scale: 2, palette: 'gold', drawScale: 0.75, align: 'left', shadowOffset: 2
            });
            PixelText.draw(ctx, 'SCORE ' + (gameState.score || 0), infoX, pyt + 66, {
                fontPx: 12, scale: 2, palette: 'white', drawScale: 0.62, align: 'left'
            });
        }

        // ---- 순서 오류 패널티 경고 토스트 ----
        if (typeof orderPenalty !== 'undefined' && orderPenalty.active) {
            if (Date.now() > orderPenalty.until) {
                orderPenalty.active = false;
            } else {
                const msg = orderPenalty.expected
                    ? `순서가 틀렸어! 다음은 ${orderPenalty.expected}`
                    : '순서가 틀렸어!';
                const tOpts = { fontPx: 13, scale: 2, palette: 'fire' };
                const tm = PixelText.measure(msg, tOpts);
                const ts = Math.min(1.0, (canvas.width * 0.6) / tm.width);
                const tw = tm.width * ts + 28, th = tm.height * ts + 18;
                const tx = Math.round((canvas.width - tw) / 2), ty = Math.round(canvas.height * 0.2);
                // 깜빡이는 경고 패널
                if (Math.floor(Date.now() / 150) % 2 === 0) {
                    drawPixelPanel(tx, ty, tw, th);
                    PixelText.draw(ctx, msg, canvas.width / 2, ty + 9, {
                        ...tOpts, drawScale: ts, shadowOffset: 2
                    });
                }
            }
        }

        // ---- 하단 중앙: 아케이드 크레딧 표시 (모든 모드 공통) ----
        // 좌우 하단은 조이스틱/액션 버튼이 차지하므로 중앙에 배치
        const credits = String(window.gameCredits || 0).padStart(2, '0');
        const cw = 156, ch = 30;
        const cx = Math.round((canvas.width - cw) / 2), cy = canvas.height - ch - 8;
        drawPixelPanel(cx, cy, cw, ch);
        PixelText.draw(ctx, 'CREDIT ' + credits, cx + cw / 2, cy + 8, {
            fontPx: 12, scale: 2, palette: window.gameCredits > 2 ? 'gold' : 'fire',
            drawScale: 0.7, shadowOffset: 2
        });

        // ---- 스테이지 / 단어 패널 ----
        // 수집 모드: 우측 상단, 퀴즈/보스 모드: 좌측 상단 (선택지와 겹침 방지)
        const wp = 240, hp2 = 86;
        const wx = collecting ? canvas.width - wp - 10 : 10;
        const wy = 10;
        drawPixelPanel(wx, wy, wp, hp2);
        PixelText.draw(ctx, 'STAGE ' + gameState.currentStage + '/20', wx + 12, wy + 10, {
            fontPx: 13, scale: 2, palette: 'gold', drawScale: 0.8, align: 'left', shadowOffset: 2
        });
        if (typeof currentStageData !== 'undefined' && currentStageData && currentStageData.word) {
            PixelText.draw(ctx, '목표 ' + currentStageData.word, wx + 12, wy + 34, {
                fontPx: 13, scale: 2, palette: 'fire', drawScale: 0.75, align: 'left'
            });
            // 순서대로 수집: 모은 글자는 금색, 지금 필요한 글자는 깜빡이는 흰색,
            // 아직 안 모은 글자는 회색 언더스코어로 표시
            const word = currentStageData.word;
            const done = (currentStageData.collectedLetters || []).length;
            let lx = wx + 12;
            const lOpts = { fontPx: 13, scale: 2, drawScale: 0.75, align: 'left' };
            for (let i = 0; i < word.length; i++) {
                const isNext = i === done;
                const ch = i < done ? word[i] : (isNext ? word[i] : '_');
                if (isNext && Math.floor(Date.now() / 300) % 2 === 0) {
                    // 다음 차례 글자는 깜빡임 (밝게)
                    lx += PixelText.draw(ctx, ch, lx, wy + 58, {
                        ...lOpts, palette: 'white', shadowOffset: 2
                    }).width + 4;
                } else {
                    lx += PixelText.draw(ctx, ch, lx, wy + 58, {
                        ...lOpts, palette: i < done ? 'gold' : 'steel'
                    }).width + 4;
                }
            }
        } else if (gameState.mode === GAME_MODE.BOSS) {
            PixelText.draw(ctx, '보스전!', wx + 12, wy + 40, {
                fontPx: 14, scale: 2, palette: 'fire', drawScale: 0.9, align: 'left', shadowOffset: 2
            });
        }
    }

    // ---- 인게임 대화창을 메탈슬러그풍 픽셀 패널로 교체 ----
    // (어두운 강판 배경 + 금색 도트 테두리 + 리벳 + 스프라이트 텍스트)
    if (typeof drawDialogue === 'function' && typeof dialogueState !== 'undefined') {
        drawDialogue = function () {
            // 도트 HUD는 대화 여부와 관계없이 매 프레임 그린다 (gameLoop 마지막 호출 지점)
            drawHUD();

            if (!dialogueState.active) return;

            const dialogue = dialogueState.dialogues[dialogueState.currentIndex];
            const dialogueHeight = Math.min(180, canvas.height * 0.3);
            const padding = Math.max(10, canvas.width * 0.0125);
            const fontSize = Math.max(14, Math.min(18, canvas.width * 0.0225));
            const px = 4;
            const top = canvas.height - dialogueHeight;

            // 강판 배경
            ctx.fillStyle = 'rgba(18, 22, 14, 0.92)';
            ctx.fillRect(0, top, canvas.width, dialogueHeight);
            // 금색 도트 테두리 (상단만 두르고 좌우는 안쪽 패널 느낌)
            ctx.fillStyle = '#FFC22B';
            for (let bx = 0; bx < canvas.width; bx += px * 2) {
                ctx.fillRect(bx, top, px, px);
            }
            const inX = padding, inY = top + padding;
            const inW = canvas.width - padding * 2, inH = dialogueHeight - padding * 2;
            for (let bx = 0; bx < inW; bx += px * 2) {
                ctx.fillRect(inX + bx, inY, px, px);
                ctx.fillRect(inX + bx, inY + inH - px, px, px);
            }
            for (let by = 0; by < inH; by += px * 2) {
                ctx.fillRect(inX, inY + by, px, px);
                ctx.fillRect(inX + inW - px, inY + by, px, px);
            }
            // 모서리 리벳
            ctx.fillStyle = '#8A9A6A';
            [[inX + px, inY + px], [inX + inW - px * 2, inY + px],
             [inX + px, inY + inH - px * 2], [inX + inW - px * 2, inY + inH - px * 2]].forEach(([rx, ry]) => {
                ctx.fillRect(rx, ry, px, px);
            });

            // 화자 이름 (스프라이트 텍스트)
            const hasPT = typeof PixelText !== 'undefined';
            if (hasPT) {
                PixelText.draw(ctx, dialogue.speaker, padding * 2, top + padding * 2, {
                    fontPx: 13, scale: 2, palette: 'gold', drawScale: 1.0,
                    align: 'left', shadowOffset: 2
                });
            } else {
                ctx.fillStyle = '#FFD700';
                ctx.font = `bold ${fontSize + 2}px Arial`;
                ctx.textAlign = 'left';
                ctx.textBaseline = 'top';
                ctx.fillText(dialogue.speaker, padding * 2, top + padding * 2);
            }

            // 본문 줄바꿈 (측정은 온스크린 스프라이트 크기에 맞춘 폰트 기준)
            ctx.font = '20px Arial';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';
            const maxWidth = canvas.width - padding * 4;
            const btnHeight = 40;
            const maxY = canvas.height - btnHeight - padding;
            const lineHeight = 28;
            let line = '';
            let y = top + padding * 2 + fontSize + 18;
            const flush = (text, yy) => {
                if (!text.length || yy >= maxY) return;
                if (hasPT) {
                    const bodyOpts = { fontPx: 13, scale: 2, palette: 'white', align: 'left' };
                    const bm = PixelText.measure(text, bodyOpts);
                    const ds = Math.min(0.85, maxWidth / bm.width);
                    PixelText.draw(ctx, text, padding * 2, yy, { ...bodyOpts, drawScale: ds });
                } else {
                    ctx.fillStyle = '#FFFFFF';
                    ctx.fillText(text, padding * 2, yy);
                }
            };
            for (let i = 0; i < dialogue.text.length; i++) {
                const testLine = line + dialogue.text[i];
                if (ctx.measureText(testLine).width > maxWidth && line.length > 0) {
                    flush(line, y);
                    y += lineHeight;
                    line = dialogue.text[i];
                    if (y >= maxY) break;
                } else {
                    line = testLine;
                }
            }
            flush(line, y);

            // 진행 버튼 (도트 스타일, 깜빡임)
            const btnWidth = 100;
            const btnX = canvas.width - btnWidth - padding * 3;
            const btnY = canvas.height - btnHeight - padding * 2;
            const blink = Math.floor(Date.now() / 400) % 2 === 0;
            ctx.fillStyle = blink ? '#FFC22B' : '#B8860B';
            ctx.fillRect(btnX, btnY, btnWidth, btnHeight);
            ctx.fillStyle = '#1A1206';
            for (let bx = 0; bx < btnWidth; bx += px * 2) {
                ctx.fillRect(btnX + bx, btnY, px, px);
                ctx.fillRect(btnX + bx, btnY + btnHeight - px, px, px);
            }
            if (hasPT) {
                PixelText.draw(ctx, '▶ 계속', btnX + btnWidth / 2, btnY + 10, {
                    fontPx: 12, scale: 2, palette: 'white', drawScale: 0.7, shadowOffset: 2
                });
            } else {
                ctx.fillStyle = '#000000';
                ctx.font = `bold ${Math.max(16, fontSize)}px Arial`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('Click', btnX + btnWidth / 2, btnY + btnHeight / 2);
            }
            ctx.textAlign = 'left';
            ctx.textBaseline = 'alphabetic';
        };
    }
})();
