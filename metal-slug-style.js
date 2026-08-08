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

    // ---- 인게임 대화창을 메탈슬러그풍 픽셀 패널로 교체 ----
    // (어두운 강판 배경 + 금색 도트 테두리 + 리벳 + 스프라이트 텍스트)
    if (typeof drawDialogue === 'function' && typeof dialogueState !== 'undefined') {
        drawDialogue = function () {
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
