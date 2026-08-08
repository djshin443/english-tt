// ============================================================
// PixelText - 픽셀 텍스트 엔진 (2D 스프라이트 텍스트)
// 어떤 텍스트(한글 포함)든 런타임에 오프스크린 캔버스로 작게
// 래스터라이즈한 뒤 알파값을 읽어 0/1 픽셀 그리드로 변환하고,
// 메탈슬러그풍 금속 그라데이션 밴드 + 검은 외곽선 + 상단 하이라이트로
// 도트 스프라이트처럼 렌더링한다. 결과는 캔버스에 캐싱된다.
// ============================================================
const PixelText = (function () {
    const spriteCache = new Map();

    // 메탈슬러그풍 팔레트 (위 → 아래 금속 밴드)
    const PALETTES = {
        gold: {
            bands: ['#FFF8C8', '#FFE55A', '#FFC22B', '#F28C00', '#B85C00'],
            outline: '#1A1206'
        },
        steel: {
            bands: ['#F2FAFF', '#C2DCEC', '#8FB4CC', '#5E87A6', '#39546E'],
            outline: '#0B141D'
        },
        fire: {
            bands: ['#FFF3B0', '#FFC93C', '#FF8C1A', '#E8541B', '#A32A0E'],
            outline: '#200A04'
        },
        white: {
            bands: ['#FFFFFF', '#F4F4F4', '#DCDCDC', '#BDBDBD', '#969696'],
            outline: '#101018'
        },
        green: {
            bands: ['#EAFFD0', '#B8F06E', '#7CCB3A', '#4E9622', '#2E6414'],
            outline: '#0E1F06'
        }
    };

    // 텍스트 → 0/1 픽셀 그리드 (상하좌우 여백 트리밍 포함)
    function textToGrid(text, fontPx, fontFamily, weight) {
        const off = document.createElement('canvas');
        const octx = off.getContext('2d', { willReadFrequently: true });
        const font = `${weight} ${fontPx}px ${fontFamily}`;
        octx.font = font;
        const width = Math.max(1, Math.ceil(octx.measureText(text).width) + 4);
        const height = Math.ceil(fontPx * 1.6);
        off.width = width;
        off.height = height;
        // 캔버스 크기 변경 시 상태가 초기화되므로 다시 설정
        octx.font = font;
        octx.textBaseline = 'top';
        octx.fillStyle = '#FFFFFF';
        octx.fillText(text, 2, Math.round(fontPx * 0.2));

        const data = octx.getImageData(0, 0, width, height).data;
        let grid = [];
        for (let y = 0; y < height; y++) {
            const row = new Array(width);
            for (let x = 0; x < width; x++) {
                row[x] = data[(y * width + x) * 4 + 3] > 120 ? 1 : 0;
            }
            grid.push(row);
        }

        // 빈 행/열 트리밍
        const rowHas = grid.map(row => row.some(v => v === 1));
        const top = rowHas.indexOf(true);
        if (top === -1) return [];
        const bottom = rowHas.lastIndexOf(true);
        grid = grid.slice(top, bottom + 1);

        let left = width, right = 0;
        grid.forEach(row => {
            const first = row.indexOf(1);
            if (first !== -1) {
                left = Math.min(left, first);
                right = Math.max(right, row.lastIndexOf(1));
            }
        });
        return grid.map(row => row.slice(left, right + 1));
    }

    // 텍스트를 메탈슬러그풍 스프라이트 캔버스로 생성 (본체 + 그림자 실루엣)
    function makeSprite(text, opts = {}) {
        const fontPx = opts.fontPx || 16;
        const fontFamily = opts.fontFamily || "'Jua', 'Malgun Gothic', sans-serif";
        const weight = opts.weight || 'bold';
        const scale = Math.max(1, Math.round(opts.scale || 3));
        const paletteName = opts.palette || 'gold';
        const key = [text, fontPx, fontFamily, weight, scale, paletteName].join('|');
        if (spriteCache.has(key)) return spriteCache.get(key);

        const pal = PALETTES[paletteName] || PALETTES.gold;
        const grid = textToGrid(text, fontPx, fontFamily, weight);
        const rows = grid.length;
        const cols = rows ? grid[0].length : 0;

        const out = document.createElement('canvas');
        out.width = Math.max(1, (cols + 2) * scale);
        out.height = Math.max(1, (rows + 2) * scale);
        const c = out.getContext('2d');

        const solid = (y, x) => y >= 0 && y < rows && x >= 0 && x < cols && grid[y][x] === 1;

        // 1) 검은 외곽선 패스 (8방향 이웃)
        c.fillStyle = pal.outline;
        for (let y = -1; y <= rows; y++) {
            for (let x = -1; x <= cols; x++) {
                if (solid(y, x)) continue;
                let edge = false;
                for (let dy = -1; dy <= 1 && !edge; dy++) {
                    for (let dx = -1; dx <= 1 && !edge; dx++) {
                        if ((dy || dx) && solid(y + dy, x + dx)) edge = true;
                    }
                }
                if (edge) c.fillRect((x + 1) * scale, (y + 1) * scale, scale, scale);
            }
        }

        // 2) 본체: 세로 위치별 금속 밴드 색 + 상단 도트 하이라이트
        for (let y = 0; y < rows; y++) {
            const band = pal.bands[Math.min(pal.bands.length - 1, Math.floor((y / rows) * pal.bands.length))];
            for (let x = 0; x < cols; x++) {
                if (!grid[y][x]) continue;
                c.fillStyle = band;
                c.fillRect((x + 1) * scale, (y + 1) * scale, scale, scale);
                if (!solid(y - 1, x)) {
                    c.fillStyle = 'rgba(255,255,255,0.85)';
                    c.fillRect((x + 1) * scale, (y + 1) * scale, scale, Math.max(1, Math.floor(scale / 3)));
                }
            }
        }

        // 3) 그림자용 검은 실루엣
        const sil = document.createElement('canvas');
        sil.width = out.width;
        sil.height = out.height;
        const sc = sil.getContext('2d');
        sc.drawImage(out, 0, 0);
        sc.globalCompositeOperation = 'source-in';
        sc.fillStyle = '#000000';
        sc.fillRect(0, 0, sil.width, sil.height);

        const sprite = { canvas: out, silhouette: sil, width: out.width, height: out.height };
        spriteCache.set(key, sprite);
        return sprite;
    }

    // 메인 캔버스에 스프라이트 텍스트 그리기
    // opts: x기준 align('center'|'left'), drawScale, alpha, shadowOffset + makeSprite 옵션
    function draw(ctx, text, x, y, opts = {}) {
        const sprite = makeSprite(text, opts);
        const dScale = opts.drawScale || 1;
        const w = sprite.width * dScale;
        const h = sprite.height * dScale;
        const drawX = opts.align === 'left' ? x : x - w / 2;
        const alpha = opts.alpha === undefined ? 1 : opts.alpha;

        ctx.save();
        ctx.imageSmoothingEnabled = false;
        if (opts.shadowOffset) {
            ctx.globalAlpha = alpha * 0.45;
            ctx.drawImage(sprite.silhouette, drawX + opts.shadowOffset, y + opts.shadowOffset, w, h);
        }
        ctx.globalAlpha = alpha;
        ctx.drawImage(sprite.canvas, drawX, y, w, h);
        ctx.restore();
        return { x: drawX, y: y, width: w, height: h };
    }

    // 레이아웃 계산용 크기 측정
    function measure(text, opts = {}) {
        const sprite = makeSprite(text, opts);
        const dScale = opts.drawScale || 1;
        return { width: sprite.width * dScale, height: sprite.height * dScale };
    }

    return { makeSprite, draw, measure, PALETTES };
})();

window.PixelText = PixelText;
