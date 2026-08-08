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
    const marchers = [
        { name: 'jiyul', offset: 0 },
        { name: 'seeun', offset: 90 },
        { name: 'harin', offset: 180 }
    ];

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

        // ---- 행진하는 캐릭터 (걷기 사이클) ----
        if (typeof pixelData !== 'undefined') {
            const mScale = Math.max(2, Math.floor(base * 2.6));
            const walkFrame = Math.floor(frame / 8) % 2;
            marchers.forEach(m => {
                const data = pixelData[m.name];
                if (!data) return;
                const sprite = walkFrame === 0 ? (data.walking1 || data.idle) : (data.walking2 || data.idle);
                const spriteW = 16 * mScale;
                const travel = w + spriteW + 240;
                const mx = ((frame * 1.6 + m.offset * base) % travel) - spriteW - 20;
                const my = groundTop - 16 * mScale + Math.floor(mScale / 2);
                drawSpriteMS(sprite, data.colorMap, mx, my, mScale, false);
            });
        }

        // ---- 타이틀 로고 (스프라이트 텍스트) ----
        const hasPixelText = typeof PixelText !== 'undefined';
        if (hasPixelText) {
            const line1 = '잉글리쉬';
            const line2 = '탁구 헌터 J';
            const sub = 'ENGLISH PING PONG HUNTER';
            const startText = '터치해서 시작!';

            const line1Opts = { fontPx: 15, scale: 2, palette: 'steel' };
            const line2Opts = { fontPx: 18, scale: 2, palette: 'gold' };
            const subOpts = { fontPx: 11, scale: 2, palette: 'fire' };
            const startOpts = { fontPx: 13, scale: 2, palette: 'white' };

            // 레이아웃: 1행 → 로고 → 부제목 → 시작 안내를 위에서부터 순서대로 배치
            const m1 = PixelText.measure(line1, line1Opts);
            const m2 = PixelText.measure(line2, line2Opts);
            const m3 = PixelText.measure(sub, subOpts);
            const m4 = PixelText.measure(startText, startOpts);
            const s1 = Math.min(1.5 * base, (w * 0.42) / m1.width);
            const fit = Math.min(3.0 * base, (w * 0.86) / m2.width);
            const s3 = Math.min(1.3 * base, (w * 0.66) / m3.width);
            const s4 = Math.min(1.5 * base, (w * 0.5) / m4.width);
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
