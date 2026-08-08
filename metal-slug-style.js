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
            if (currentCharacter === 2 && player.showWeapon) {
                drawLightningSword(
                    player.x + player.width + 20,
                    player.y + player.height / 2,
                    player.weaponAngle
                );
            }
        };
    }

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
            const collected = (currentStageData.collectedLetters || []).join('');
            PixelText.draw(ctx, '수집 ' + (collected || '-'), wx + 12, wy + 58, {
                fontPx: 13, scale: 2, palette: 'white', drawScale: 0.75, align: 'left'
            });
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
