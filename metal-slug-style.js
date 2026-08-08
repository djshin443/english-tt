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
})();
