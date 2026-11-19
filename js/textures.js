// textures.js - Generator Tekstur Prosedural Gaya Retro 2.5D Isometrik Akhir 90-an (Age of Empires II / RTS Aesthetic)
// 100% Canvas Off-screen: Bebas CORS, Offline-ready, Resolusi Tinggi, Kaya Detail & Tekstur Alami

class ProceduralTextures {
    constructor() {
        this.cache = {};
    }

    // ==========================================
    // 1. RUMPUT ALAMI BERGRADASI RETRO (Pixelated / Dithered RTS 90s Sprite Style)
    // ==========================================
    getRetroGrass(repeatX = 16, repeatY = 16) {
        const key = `retroGrass_${repeatX}_${repeatY}`;
        if (this.cache[key]) return this.cache[key];

        const canvas = document.createElement("canvas");
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext("2d");

        // Warna dasar hijau retro kaya
        ctx.fillStyle = "#436B22";
        ctx.fillRect(0, 0, 512, 512);

        const colors = ["#385C1C", "#4C7C27", "#5B8E2E", "#2E4B16", "#649E33", "#4A7426"];

        // Dithering pattern 4x4 & 2x2 pixel blocks khas game RTS klasik
        const blockSize = 4;
        for (let y = 0; y < 512; y += blockSize) {
            for (let x = 0; x < 512; x += blockSize) {
                // Pola kebisingan terstruktur
                const n = Math.sin(x * 0.08) * Math.cos(y * 0.08) + Math.random() * 0.6;
                const cIdx = Math.floor(Math.abs(n * colors.length)) % colors.length;
                ctx.fillStyle = colors[cIdx];
                ctx.fillRect(x, y, blockSize, blockSize);
            }
        }

        // Helai-helai rumput mikro berpiksel (Grass Blades)
        ctx.fillStyle = "rgba(102, 163, 53, 0.6)";
        for (let i = 0; i < 900; i++) {
            const gx = Math.floor(Math.random() * 510);
            const gy = Math.floor(Math.random() * 508);
            ctx.fillRect(gx, gy, 2, 4);
            ctx.fillRect(gx + 1, gy - 2, 2, 3);
        }

        // Bayangan lembut rumpun rumput (Crevice Shadows)
        ctx.fillStyle = "rgba(25, 42, 12, 0.45)";
        for (let i = 0; i < 700; i++) {
            const bx = Math.floor(Math.random() * 510);
            const by = Math.floor(Math.random() * 510);
            ctx.fillRect(bx, by, 3, 2);
        }

        const tex = new THREE.CanvasTexture(canvas);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(repeatX, repeatY);
        tex.anisotropy = 4;
        this.cache[key] = tex;
        return tex;
    }

    // ==========================================
    // 2. TANAH LIAT COKELAT ALAMI (MUDDY CLAY COURTYARD WITH RUTS, STONES & STRAW)
    // Lengkap dengan jejak roda melengkung, lumpur, bebatuan kecil, jerami, dan rumput liar
    // ==========================================
    getClayMudCourtyard(repeatX = 1, repeatY = 1) {
        const key = `clayMud_${repeatX}_${repeatY}`;
        if (this.cache[key]) return this.cache[key];

        const canvas = document.createElement("canvas");
        canvas.width = 1024;
        canvas.height = 1024;
        const ctx = canvas.getContext("2d");

        // Warna dasar tanah liat cokelat alami hangat
        ctx.fillStyle = "#5C381F";
        ctx.fillRect(0, 0, 1024, 1024);

        // A. Variasi Gradasi Warna Tanah Liat & Lempung Lembab
        for (let i = 0; i < 280; i++) {
            const cx = Math.random() * 1024;
            const cy = Math.random() * 1024;
            const cr = Math.random() * 70 + 30;
            const colors = ["#6E4326", "#4E2E18", "#7B4E2D", "#503019", "#673E23"];
            ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
            ctx.beginPath();
            ctx.arc(cx, cy, cr, 0, Math.PI * 2);
            ctx.fill();
        }

        // B. Jejak Bekas Roda Gerobak / Traktor Melengkung (Curved Muddy Wheel Ruts)
        const drawWheelRutTrack = (points, width, deepColor, edgeColor) => {
            // Tanggul tanah kering di tepi luar jejak roda
            ctx.strokeStyle = edgeColor;
            ctx.lineWidth = width + 10;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            for (let i = 1; i < points.length; i++) {
                ctx.lineTo(points[i].x, points[i].y);
            }
            ctx.stroke();

            // Parit cekungan lumpur basah di tengah
            ctx.strokeStyle = deepColor;
            ctx.lineWidth = width;
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            for (let i = 1; i < points.length; i++) {
                ctx.lineTo(points[i].x, points[i].y);
            }
            ctx.stroke();

            // Alur tekstur ban gerobak
            ctx.strokeStyle = "rgba(30, 16, 8, 0.6)";
            ctx.lineWidth = 2;
            for (let i = 0; i < points.length - 1; i++) {
                const p1 = points[i];
                const p2 = points[i + 1];
                const steps = 15;
                for (let s = 0; s < steps; s++) {
                    const t = s / steps;
                    const x = p1.x + (p2.x - p1.x) * t;
                    const y = p1.y + (p2.y - p1.y) * t;
                    ctx.beginPath();
                    ctx.moveTo(x - 5, y - 5);
                    ctx.lineTo(x + 5, y + 5);
                    ctx.stroke();
                }
            }
        };

        // Rute Jejak Roda 1: Dari jalan timur menuju gerbang gudang barn
        drawWheelRutTrack([
            { x: 980, y: 560 }, { x: 780, y: 540 }, { x: 580, y: 510 },
            { x: 420, y: 470 }, { x: 330, y: 400 }, { x: 280, y: 320 }
        ], 14, "#382012", "#7E5031");

        drawWheelRutTrack([
            { x: 990, y: 600 }, { x: 790, y: 580 }, { x: 590, y: 550 },
            { x: 430, y: 510 }, { x: 340, y: 440 }, { x: 290, y: 360 }
        ], 14, "#382012", "#7E5031");

        // Rute Jejak Roda 2: Menuju mesin pengolahan di pelataran selatan
        drawWheelRutTrack([
            { x: 760, y: 560 }, { x: 620, y: 680 }, { x: 480, y: 790 },
            { x: 340, y: 840 }, { x: 190, y: 830 }
        ], 12, "#331C0E", "#7A4D2E");

        drawWheelRutTrack([
            { x: 790, y: 590 }, { x: 650, y: 710 }, { x: 510, y: 820 },
            { x: 370, y: 870 }, { x: 220, y: 860 }
        ], 12, "#331C0E", "#7A4D2E");

        // C. Genangan Lumpur Basah (Mud Puddles with Damp Sheen)
        const puddles = [
            { x: 510, y: 570, rx: 55, ry: 26, rot: 0.3 },
            { x: 320, y: 420, rx: 42, ry: 20, rot: -0.2 },
            { x: 640, y: 720, rx: 48, ry: 22, rot: 0.5 },
            { x: 230, y: 810, rx: 38, ry: 18, rot: 0.1 },
            { x: 720, y: 410, rx: 36, ry: 16, rot: -0.4 }
        ];

        puddles.forEach(p => {
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rot);
            // Bayangan basah dalam
            ctx.fillStyle = "#2D180C";
            ctx.beginPath();
            ctx.ellipse(0, 0, p.rx, p.ry, 0, 0, Math.PI * 2);
            ctx.fill();

            // Kilau air permukaan
            ctx.fillStyle = "rgba(75, 48, 28, 0.65)";
            ctx.beginPath();
            ctx.ellipse(-3, -2, p.rx * 0.75, p.ry * 0.7, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });

        // D. Bebatuan Kecil & Kerikil Sungai (Scattered Stones & Pebbles)
        for (let i = 0; i < 450; i++) {
            const sx = Math.random() * 1024;
            const sy = Math.random() * 1024;
            const sr = Math.random() * 4.5 + 2.0;

            // Bayangan bawah batu
            ctx.fillStyle = "rgba(20, 10, 5, 0.65)";
            ctx.beginPath();
            ctx.arc(sx + 1.5, sy + 2, sr, 0, Math.PI * 2);
            ctx.fill();

            // Badan batu abu-abu kecokelatan retro
            const stoneColors = ["#6E6862", "#5A544F", "#827A72", "#4A4540", "#796E64"];
            ctx.fillStyle = stoneColors[Math.floor(Math.random() * stoneColors.length)];
            ctx.beginPath();
            ctx.arc(sx, sy, sr, 0, Math.PI * 2);
            ctx.fill();

            // Highlight matahari atas batu (Hard sunlight edge)
            ctx.fillStyle = "rgba(220, 215, 205, 0.55)";
            ctx.beginPath();
            ctx.arc(sx - sr * 0.35, sy - sr * 0.35, sr * 0.45, 0, Math.PI * 2);
            ctx.fill();
        }

        // E. Jerami & Serpihan Gandum Berserakan (Scattered Straw & Hay Flecks)
        ctx.lineWidth = 2.0;
        for (let i = 0; i < 650; i++) {
            const hx = Math.random() * 1024;
            const hy = Math.random() * 1024;
            const hlen = Math.random() * 12 + 6;
            const hangle = Math.random() * Math.PI * 2;
            const strawColors = ["#D4A548", "#E6BF63", "#C49237", "#F0CE7A"];
            ctx.strokeStyle = strawColors[Math.floor(Math.random() * strawColors.length)];
            ctx.beginPath();
            ctx.moveTo(hx, hy);
            ctx.lineTo(hx + Math.cos(hangle) * hlen, hy + Math.sin(hangle) * hlen);
            ctx.stroke();
        }

        // F. Rumpun Rumput Liar Tumbuh di Sela Lumpur (Wild Tufts of Grass)
        for (let i = 0; i < 220; i++) {
            const gx = Math.random() * 1024;
            const gy = Math.random() * 1024;
            const grassCols = ["#436E21", "#55882B", "#36591A", "#649F33"];
            ctx.fillStyle = grassCols[Math.floor(Math.random() * grassCols.length)];
            for (let b = 0; b < 4; b++) {
                const ox = (b - 1.5) * 3;
                ctx.beginPath();
                ctx.moveTo(gx + ox, gy);
                ctx.lineTo(gx + ox + (Math.random() * 4 - 2), gy - (Math.random() * 8 + 5));
                ctx.lineTo(gx + ox + 2, gy);
                ctx.fill();
            }
        }

        const tex = new THREE.CanvasTexture(canvas);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(repeatX, repeatY);
        tex.anisotropy = 4;
        this.cache[key] = tex;
        return tex;
    }

    // ==========================================
    // 3. JALAN ASPAL HITAM DENGAN MARKA GARIS PUTIH PUTUS-PUTUS (BLACK ASPHALT ROAD)
    // Sesuai permintaan: Aspal hitam pekat bertekstur kerikil/agregat dengan garis putih putus-putus
    // ==========================================
    getAsphaltRoad(repeatX = 1, repeatY = 38) {
        const key = `asphaltRoad_${repeatX}_${repeatY}`;
        if (this.cache[key]) return this.cache[key];

        const canvas = document.createElement("canvas");
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext("2d");

        // A. Warna Dasar Aspal Hitam Gelap Pekat (Dark Asphalt Base)
        ctx.fillStyle = "#1E2024";
        ctx.fillRect(0, 0, 512, 512);

        // B. Butiran Agregat & Kerikil Aspal (Asphalt Gravel & Aggregate Noise)
        const stoneTints = ["#141618", "#25282D", "#2C3036", "#1B1C1F", "#32373E", "#222428", "#111214"];
        for (let i = 0; i < 950; i++) {
            const rx = Math.random() * 512;
            const ry = Math.random() * 512;
            const rw = Math.random() * 3.5 + 1.0;
            const rh = Math.random() * 3.5 + 1.0;
            ctx.fillStyle = stoneTints[Math.floor(Math.random() * stoneTints.length)];
            ctx.beginPath();
            ctx.ellipse(rx, ry, rw, rh, Math.random() * Math.PI, 0, Math.PI * 2);
            ctx.fill();
        }

        // C. Jejak Jalur Ban Kendaraan (Subtle Dark Tire Wear Lanes)
        // Lajur kiri (X ~ 150) dan lajur kanan (X ~ 362)
        [150, 362].forEach(laneX => {
            const grad = ctx.createLinearGradient(laneX - 45, 0, laneX + 45, 0);
            grad.addColorStop(0, "rgba(18, 19, 22, 0)");
            grad.addColorStop(0.5, "rgba(10, 11, 13, 0.45)");
            grad.addColorStop(1, "rgba(18, 19, 22, 0)");
            ctx.fillStyle = grad;
            ctx.fillRect(laneX - 45, 0, 90, 512);
        });

        // D. Garis Bahu Jalan Luar (Crisp Outer Shoulder Lines - Tipis Halus Putih)
        ctx.fillStyle = "rgba(235, 240, 245, 0.55)";
        ctx.fillRect(28, 0, 5, 512);
        ctx.fillRect(479, 0, 5, 512);

        // E. Garis Tengah Putih Putus-putus (Dashed White Centerline)
        // Garis berada tepat di tengah jalan (X = 256). Lebar garis = 14px (X = 249 s.d. 263).
        // 2 strip per tile agar seamless berulang dengan RepeatWrapping:
        // Strip 1: Y = 36 s.d. 220 (panjang 184px, jeda 72px)
        // Strip 2: Y = 292 s.d. 476 (panjang 184px, jeda 72px [36px bawah + 36px atas])
        ctx.fillStyle = "#FFFFFF";
        ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
        ctx.shadowBlur = 4;
        
        // Strip 1
        ctx.fillRect(249, 36, 14, 184);
        // Strip 2
        ctx.fillRect(249, 292, 14, 184);
        ctx.shadowBlur = 0;

        // F. Sedikit Butiran Aus Alami pada Cat Putih Marka Jalan
        ctx.fillStyle = "rgba(30, 32, 36, 0.4)";
        for (let i = 0; i < 70; i++) {
            const py1 = 36 + Math.random() * 184;
            const px1 = 249 + Math.random() * 14;
            ctx.fillRect(px1, py1, Math.random() * 2.5 + 0.8, Math.random() * 2.5 + 0.8);

            const py2 = 292 + Math.random() * 184;
            const px2 = 249 + Math.random() * 14;
            ctx.fillRect(px2, py2, Math.random() * 2.5 + 0.8, Math.random() * 2.5 + 0.8);
        }

        const tex = new THREE.CanvasTexture(canvas);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(repeatX, repeatY);
        tex.anisotropy = 4;
        this.cache[key] = tex;
        return tex;
    }

    // ==========================================
    // 3B. JALAN TANAH BERPASIR ALAMI (SANDY DUSTY COUNTRY DIRT ROAD)
    // ==========================================
    getSandyDirtRoad(repeatX = 1, repeatY = 8) {
        const key = `sandyDirtRoad_${repeatX}_${repeatY}`;
        if (this.cache[key]) return this.cache[key];

        const canvas = document.createElement("canvas");
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext("2d");

        // Warna dasar pasir tanah pedesaan cokelat-keemasan hangat
        ctx.fillStyle = "#CDA158";
        ctx.fillRect(0, 0, 512, 512);

        // A. Variasi debu berpasir & kerikil kasar
        for (let i = 0; i < 400; i++) {
            const rx = Math.random() * 512;
            const ry = Math.random() * 512;
            const rw = Math.random() * 30 + 10;
            const rh = Math.random() * 40 + 10;
            const sandTints = ["#DFBA74", "#B88A43", "#C4984F", "#8F652D", "#E8C888"];
            ctx.fillStyle = sandTints[Math.floor(Math.random() * sandTints.length)];
            ctx.beginPath();
            ctx.ellipse(rx, ry, rw, rh, 0, 0, Math.PI * 2);
            ctx.fill();
        }

        // B. Alur Bekas Roda Paralel Memanjang (Longitudinal Carriage Wheel Ruts)
        const leftRutX = 140;
        const rightRutX = 370;

        // Ruts kiri & kanan
        [leftRutX, rightRutX].forEach(xCenter => {
            // Bayangan cekungan alur ban
            ctx.fillStyle = "rgba(100, 68, 30, 0.45)";
            ctx.fillRect(xCenter - 18, 0, 36, 512);

            ctx.fillStyle = "rgba(75, 48, 20, 0.6)";
            ctx.fillRect(xCenter - 8, 0, 16, 512);

            // Pasir terang di pinggiran cekungan
            ctx.fillStyle = "rgba(240, 215, 160, 0.35)";
            ctx.fillRect(xCenter - 22, 0, 5, 512);
            ctx.fillRect(xCenter + 18, 0, 5, 512);
        });

        // C. Butiran Kerikil & Batu Pasir (Rough Gravel Specks)
        for (let i = 0; i < 800; i++) {
            const px = Math.random() * 512;
            const py = Math.random() * 512;
            const pr = Math.random() * 2.2 + 0.8;
            ctx.fillStyle = Math.random() > 0.5 ? "rgba(60, 42, 22, 0.5)" : "rgba(245, 230, 195, 0.45)";
            ctx.beginPath();
            ctx.arc(px, py, pr, 0, Math.PI * 2);
            ctx.fill();
        }

        // D. Tepi Jalan Berkelok Alami Berpadu dengan Rumput (Frayed Organic Edges)
        ctx.fillStyle = "rgba(67, 107, 34, 0.75)";
        for (let y = 0; y < 512; y += 4) {
            // Tepi kiri
            const leftJag = Math.sin(y * 0.05) * 12 + Math.random() * 8;
            ctx.fillRect(0, y, Math.max(0, 16 + leftJag), 4);

            // Tepi kanan
            const rightJag = Math.cos(y * 0.05) * 12 + Math.random() * 8;
            ctx.fillRect(512 - Math.max(0, 16 + rightJag), y, Math.max(0, 16 + rightJag), 4);
        }

        const tex = new THREE.CanvasTexture(canvas);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(repeatX, repeatY);
        tex.anisotropy = 4;
        this.cache[key] = tex;
        return tex;
    }

    // ==========================================
    // 4. KAYU TUA LAPUK GUDANG (AGED WEATHERED BARN TIMBER PLANKS)
    // Serat kayu alami, tekstur serat kasar, warna cokelat kayu tua, tidak merah polos
    // ==========================================
    getWeatheredBarnWood(repeatX = 4, repeatY = 2) {
        const key = `weatheredBarnWood_${repeatX}_${repeatY}`;
        if (this.cache[key]) return this.cache[key];

        const canvas = document.createElement("canvas");
        canvas.width = 1024;
        canvas.height = 1024;
        const ctx = canvas.getContext("2d");

        // Warna dasar kayu merah pedesaan klasik (Classic American Red Barn Wood)
        ctx.fillStyle = "#8E1E1E";
        ctx.fillRect(0, 0, 1024, 1024);

        const plankW = 64;
        for (let x = 0; x < 1024; x += plankW) {
            // Warna papan bervariasi antara merah tua kayu lumbung hingga merah menyala pedesaan
            const plankColors = ["#9E2424", "#8A1D1D", "#A82B2B", "#7A1818", "#B32C2C", "#8F1E1E"];
            ctx.fillStyle = plankColors[Math.floor(Math.random() * plankColors.length)];
            ctx.fillRect(x, 0, plankW, 1024);

            // Garis serat kayu vertikal kasar (Wood Grain Fibers)
            for (let i = 0; i < 10; i++) {
                const gx = x + Math.random() * plankW;
                ctx.strokeStyle = Math.random() > 0.4 ? "rgba(30, 18, 10, 0.4)" : "rgba(115, 85, 58, 0.25)";
                ctx.lineWidth = Math.random() * 1.5 + 0.8;
                ctx.beginPath();
                ctx.moveTo(gx, 0);
                ctx.bezierCurveTo(gx + (Math.random() * 6 - 3), 300, gx + (Math.random() * 6 - 3), 700, gx, 1024);
                ctx.stroke();
            }

            // Mata kayu tua (Wood Knots)
            if (Math.random() > 0.4) {
                const kx = x + plankW / 2 + (Math.random() * 10 - 5);
                const ky = Math.random() * 800 + 100;
                ctx.fillStyle = "rgba(25, 14, 8, 0.65)";
                ctx.beginPath();
                ctx.ellipse(kx, ky, 6, 12, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = "rgba(70, 48, 30, 0.5)";
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.ellipse(kx, ky, 10, 20, 0, 0, Math.PI * 2);
                ctx.stroke();
            }

            // Celah sambungan gelap antar papan kayu
            ctx.fillStyle = "rgba(18, 10, 6, 0.85)";
            ctx.fillRect(x, 0, 3, 1024);

            // Highlight tepi kayu lapuk
            ctx.fillStyle = "rgba(160, 125, 90, 0.22)";
            ctx.fillRect(x + 3, 0, 1.5, 1024);

            // Titik paku besi berkarat
            for (let ny = 80; ny < 1024; ny += 200) {
                ctx.fillStyle = "rgba(35, 18, 10, 0.9)";
                ctx.beginPath();
                ctx.arc(x + plankW / 2, ny, 3.0, 0, Math.PI * 2);
                ctx.fill();
                // Karat kecil sekitar paku
                ctx.fillStyle = "rgba(145, 65, 25, 0.45)";
                ctx.beginPath();
                ctx.arc(x + plankW / 2, ny + 3, 4.5, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const tex = new THREE.CanvasTexture(canvas);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(repeatX, repeatY);
        tex.anisotropy = 4;
        this.cache[key] = tex;
        return tex;
    }

    // ==========================================
    // 5. ATAP JERAMI KUNING EMAS BERLUMUT (THATCH ROOF WITH MOSS PATCHES)
    // Sesuai atap gudang di foto referensi: tebal, berserat jerami, berundak
    // ==========================================
    getThatchRoof(repeatX = 4, repeatY = 4) {
        const key = `thatchRoof_${repeatX}_${repeatY}`;
        if (this.cache[key]) return this.cache[key];

        const canvas = document.createElement("canvas");
        canvas.width = 1024;
        canvas.height = 1024;
        const ctx = canvas.getContext("2d");

        // Warna dasar jerami kering emas alami
        ctx.fillStyle = "#D6A74B";
        ctx.fillRect(0, 0, 1024, 1024);

        // Barisan tumpukan ikatan jerami berundak
        const layerH = 96;
        for (let y = 0; y < 1024; y += layerH) {
            // Bayangan tumpukan jerami bawah
            ctx.fillStyle = "rgba(75, 50, 18, 0.65)";
            ctx.fillRect(0, y + layerH - 12, 1024, 12);

            // Garis-garis serat jerami vertikal padat
            for (let x = 0; x < 1024; x += 4) {
                const strawColors = ["#E6BC5E", "#C49237", "#F0CF76", "#B28028", "#D9A94C"];
                ctx.fillStyle = strawColors[Math.floor(Math.random() * strawColors.length)];
                const strandW = Math.random() * 3 + 2;
                const strandH = layerH - (Math.random() * 8);
                ctx.fillRect(x, y, strandW, strandH);
            }

            // Ujung jerami rumbai tidak rata di tepi bawah
            ctx.fillStyle = "#B3822B";
            for (let x = 0; x < 1024; x += 6) {
                ctx.beginPath();
                ctx.moveTo(x, y + layerH - 6);
                ctx.lineTo(x + 3, y + layerH + (Math.random() * 10));
                ctx.lineTo(x + 6, y + layerH - 6);
                ctx.fill();
            }
        }

        // Bercak lumut hijau lembab di beberapa area sudut atap
        ctx.fillStyle = "rgba(62, 98, 40, 0.55)";
        for (let i = 0; i < 45; i++) {
            const mx = Math.random() * 1024;
            const my = Math.random() * 1024;
            const mr = Math.random() * 35 + 15;
            ctx.beginPath();
            ctx.arc(mx, my, mr, 0, Math.PI * 2);
            ctx.fill();
        }

        const tex = new THREE.CanvasTexture(canvas);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(repeatX, repeatY);
        tex.anisotropy = 4;
        this.cache[key] = tex;
        return tex;
    }

    // ==========================================
    // 6. GENTENG KAYU LAPUK DENGAN LUMUT HIJAU (MOSSY WEATHERED WOOD SHINGLE)
    // Digunakan untuk atap emperan & sambungan gudang
    // ==========================================
    getMossyShingle(repeatX = 6, repeatY = 4) {
        const key = `mossyShingle_${repeatX}_${repeatY}`;
        if (this.cache[key]) return this.cache[key];

        const canvas = document.createElement("canvas");
        canvas.width = 1024;
        canvas.height = 1024;
        const ctx = canvas.getContext("2d");

        // Warna genteng kayu tua kelabu cokelat
        ctx.fillStyle = "#382D24";
        ctx.fillRect(0, 0, 1024, 1024);

        const tileH = 54;
        const tileW = 96;
        for (let row = 0; row < 1024 / tileH; row++) {
            const y = row * tileH;
            const xOffset = (row % 2) * (tileW / 2);
            for (let x = -tileW; x < 1024 + tileW; x += tileW) {
                const tx = x + xOffset;
                const shade = Math.floor(Math.random() * 18 - 9);
                ctx.fillStyle = `rgb(${60 + shade}, ${48 + shade}, ${38 + shade})`;
                ctx.fillRect(tx + 2, y + 2, tileW - 4, tileH - 4);

                // Bayangan bawah genteng
                ctx.fillStyle = "rgba(20, 14, 10, 0.7)";
                ctx.fillRect(tx, y + tileH - 5, tileW, 5);

                // Serat kayu pada genteng
                ctx.strokeStyle = "rgba(30, 22, 16, 0.4)";
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(tx + 20, y);
                ctx.lineTo(tx + 22, y + tileH);
                ctx.stroke();

                // Lumut hijau di sela-sela genteng lapuk
                if (Math.random() > 0.45) {
                    ctx.fillStyle = "rgba(65, 105, 42, 0.65)";
                    ctx.beginPath();
                    ctx.arc(tx + tileW / 2 + (Math.random() * 20 - 10), y + tileH - 6, Math.random() * 14 + 6, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }

        const tex = new THREE.CanvasTexture(canvas);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(repeatX, repeatY);
        tex.anisotropy = 4;
        this.cache[key] = tex;
        return tex;
    }

    // ==========================================
    // 7. SILO LOGAM TUA BERKARAT (WEATHERED RUSTED CORRUGATED METAL SILO)
    // Seng gelombang galvanis tua dengan lelehan karat merah oranye pekat
    // ==========================================
    getRustedSiloMetal(repeatX = 4, repeatY = 6) {
        const key = `rustedSiloMetal_${repeatX}_${repeatY}`;
        if (this.cache[key]) return this.cache[key];

        const canvas = document.createElement("canvas");
        canvas.width = 1024;
        canvas.height = 1024;
        const ctx = canvas.getContext("2d");

        // Warna dasar baja seng tua kusam
        ctx.fillStyle = "#706D69";
        ctx.fillRect(0, 0, 1024, 1024);

        // A. Garis Gelombang Pelat Seng (Corrugated Metal Panels)
        const panelW = 32;
        for (let x = 0; x < 1024; x += panelW) {
            // Sisi gelap lembah gelombang
            ctx.fillStyle = "rgba(50, 48, 46, 0.5)";
            ctx.fillRect(x, 0, panelW / 2, 1024);
            // Sisi terang puncak gelombang
            ctx.fillStyle = "rgba(165, 160, 155, 0.35)";
            ctx.fillRect(x + panelW / 2, 0, panelW / 2, 1024);
        }

        // B. Cincin Sambungan Horisontal Baja Silo (Horizontal Riveted Seams)
        const ringH = 128;
        for (let y = 0; y < 1024; y += ringH) {
            ctx.fillStyle = "rgba(35, 30, 25, 0.8)";
            ctx.fillRect(0, y - 3, 1024, 6);

            // Baut-baut besi melingkar
            ctx.fillStyle = "#302B27";
            for (let bx = 8; bx < 1024; bx += 24) {
                ctx.beginPath();
                ctx.arc(bx, y, 2.8, 0, Math.PI * 2);
                ctx.fill();
            }

            // C. Lelehan Karat Merah Oranye Mengalir dari Cincin Sambungan (Dripping Rust Streaks)
            for (let rx = 12; rx < 1024; rx += Math.random() * 32 + 16) {
                const rustLen = Math.random() * (ringH * 0.85) + 20;
                const rustW = Math.random() * 16 + 6;

                // Gradasi lelehan karat
                const rustGrad = ctx.createLinearGradient(rx, y, rx, y + rustLen);
                rustGrad.addColorStop(0, "rgba(138, 55, 22, 0.95)");
                rustGrad.addColorStop(0.4, "rgba(168, 75, 30, 0.75)");
                rustGrad.addColorStop(1, "rgba(95, 45, 20, 0.0)");

                ctx.fillStyle = rustGrad;
                ctx.beginPath();
                ctx.moveTo(rx - rustW / 2, y);
                ctx.lineTo(rx + rustW / 2, y);
                ctx.lineTo(rx + (Math.random() * 4 - 2), y + rustLen);
                ctx.closePath();
                ctx.fill();
            }
        }

        // D. Bercak Oksidasi Logam & Noda Cuaca Alami
        for (let i = 0; i < 70; i++) {
            const ox = Math.random() * 1024;
            const oy = Math.random() * 1024;
            const or = Math.random() * 30 + 10;
            ctx.fillStyle = Math.random() > 0.4 ? "rgba(145, 60, 24, 0.4)" : "rgba(45, 40, 36, 0.35)";
            ctx.beginPath();
            ctx.arc(ox, oy, or, 0, Math.PI * 2);
            ctx.fill();
        }

        const tex = new THREE.CanvasTexture(canvas);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(repeatX, repeatY);
        tex.anisotropy = 4;
        this.cache[key] = tex;
        return tex;
    }

    // ==========================================
    // 8. LAHAN SAYUR BERUNDAK RAPAT (VEGETABLE CROP FURROWS)
    // Tanah gembur cokelat tua dengan alur tanam sayur/gandum kecil rapat
    // ==========================================
    getVegetableField(repeatX = 4, repeatY = 4) {
        const key = `vegetableField_${repeatX}_${repeatY}`;
        if (this.cache[key]) return this.cache[key];

        const canvas = document.createElement("canvas");
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext("2d");

        // Warna dasar tanah bajak gembur cokelat tua
        ctx.fillStyle = "#362214";
        ctx.fillRect(0, 0, 512, 512);

        // Alur tanah bajak horisontal (Plowed Furrow Ridges)
        const furrowH = 42;
        for (let y = 0; y < 512; y += furrowH) {
            // Cekungan parit gelap
            ctx.fillStyle = "#24150B";
            ctx.fillRect(0, y, 512, furrowH * 0.35);

            // Punggung bedengan tanah gembur
            ctx.fillStyle = "#462E1C";
            ctx.fillRect(0, y + furrowH * 0.35, 512, furrowH * 0.65);

            // Bibit sayur kubis/selada kecil rapat di sepanjang bedengan
            for (let x = 12; x < 512; x += 28) {
                const vegY = y + furrowH * 0.65;
                // Daun hijau sayur
                ctx.fillStyle = Math.random() > 0.5 ? "#438A2D" : "#5BA63E";
                ctx.beginPath();
                ctx.arc(x, vegY, 7, 0, Math.PI * 2);
                ctx.fill();

                // Kepala sayur kubis putih/krem di tengah
                ctx.fillStyle = "#E8F5E9";
                ctx.beginPath();
                ctx.arc(x, vegY, 3.2, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const tex = new THREE.CanvasTexture(canvas);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(repeatX, repeatY);
        tex.anisotropy = 4;
        this.cache[key] = tex;
        return tex;
    }

    // ==========================================
    // 9. TEKSTUR KARUNG GONI GANDUM (BURLAP JUTE GRAIN SACKS)
    // ==========================================
    getBurlapSack(repeatX = 2, repeatY = 2) {
        const key = `burlapSack_${repeatX}_${repeatY}`;
        if (this.cache[key]) return this.cache[key];

        const canvas = document.createElement("canvas");
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext("2d");

        ctx.fillStyle = "#B89972";
        ctx.fillRect(0, 0, 256, 256);

        // Anyaman serat goni crosshatch
        ctx.strokeStyle = "rgba(125, 95, 60, 0.35)";
        ctx.lineWidth = 1.2;
        for (let i = 0; i < 256; i += 4) {
            ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 256); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(256, i); ctx.stroke();
        }

        const tex = new THREE.CanvasTexture(canvas);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(repeatX, repeatY);
        tex.anisotropy = 4;
        this.cache[key] = tex;
        return tex;
    }

    // ==========================================
    // 10. ANYAMAN TOPI JERAMI EMAS (Woven Straw Hat & Hay Weave)
    // ==========================================
    getWovenStraw(repeatX = 2, repeatY = 2) {
        const key = `wovenStraw_${repeatX}_${repeatY}`;
        if (this.cache[key]) return this.cache[key];
        if (typeof document === "undefined") return null;

        const canvas = document.createElement("canvas");
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext("2d");

        // Warna dasar jerami kuning keemasan alami
        ctx.fillStyle = "#E2AF58";
        ctx.fillRect(0, 0, 256, 256);

        // Pola silang anyaman jerami (Basket Weave / Braided Straw)
        for (let y = 0; y < 256; y += 16) {
            for (let x = 0; x < 256; x += 16) {
                const isAlt = ((x / 16) + (y / 16)) % 2 === 0;
                ctx.fillStyle = isAlt ? "#F0C77B" : "#C89542";
                ctx.fillRect(x, y, 16, 16);

                // Garis serat individual
                ctx.strokeStyle = isAlt ? "rgba(255,255,255,0.25)" : "rgba(80,50,15,0.3)";
                ctx.lineWidth = 1;
                ctx.beginPath();
                if (isAlt) {
                    ctx.moveTo(x + 2, y + 4); ctx.lineTo(x + 14, y + 4);
                    ctx.moveTo(x + 2, y + 8); ctx.lineTo(x + 14, y + 8);
                    ctx.moveTo(x + 2, y + 12); ctx.lineTo(x + 14, y + 12);
                } else {
                    ctx.moveTo(x + 4, y + 2); ctx.lineTo(x + 4, y + 14);
                    ctx.moveTo(x + 8, y + 2); ctx.lineTo(x + 8, y + 14);
                    ctx.moveTo(x + 12, y + 2); ctx.lineTo(x + 12, y + 14);
                }
                ctx.stroke();
            }
        }

        const tex = new THREE.CanvasTexture(canvas);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(repeatX, repeatY);
        tex.anisotropy = 4;
        this.cache[key] = tex;
        return tex;
    }

    // ==========================================
    // 11. KAIN DENIM BIRU OVERALLS PETANI (Classic Indigo Denim Fabric)
    // ==========================================
    getDenimFabric(repeatX = 2, repeatY = 2) {
        const key = `denimFabric_${repeatX}_${repeatY}`;
        if (this.cache[key]) return this.cache[key];
        if (typeof document === "undefined") return null;

        const canvas = document.createElement("canvas");
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext("2d");

        // Warna dasar indigo denim pekat
        ctx.fillStyle = "#274F78";
        ctx.fillRect(0, 0, 256, 256);

        // Serat kepar diagonal (Twill weave)
        ctx.strokeStyle = "rgba(180, 210, 240, 0.22)";
        ctx.lineWidth = 1.2;
        for (let i = -256; i < 512; i += 6) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i + 256, 256);
            ctx.stroke();
        }

        // Guratan halus kontras gelap
        ctx.strokeStyle = "rgba(10, 25, 45, 0.28)";
        ctx.lineWidth = 1;
        for (let i = -256; i < 512; i += 6) {
            ctx.beginPath();
            ctx.moveTo(i + 3, 0);
            ctx.lineTo(i + 259, 256);
            ctx.stroke();
        }

        const tex = new THREE.CanvasTexture(canvas);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(repeatX, repeatY);
        tex.anisotropy = 4;
        this.cache[key] = tex;
        return tex;
    }

    // ==========================================
    // 12. WAJAH PETANI RETRO EKSPRESIF (Stylized Chibi Anime Farmer Face untuk 4 Karakter)
    // Sesuai Foto Referensi media_1794703405357_9322cde2.jpg
    // ==========================================
    getFarmerFace(charType = "boy") {
        const key = `farmer_face_${charType}`;
        if (this.cache[key]) return this.cache[key];
        if (typeof document === "undefined") return null;

        const canvas = document.createElement("canvas");
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext("2d");

        // 1. Warna Dasar Kulit Hangat Berseri
        ctx.fillStyle = (charType === "grandpa") ? "#F5D0B0" : (charType === "girl" ? "#FFE2D0" : "#F8D4B4");
        ctx.fillRect(0, 0, 512, 512);

        // 2. Rona Pipi Merona Merah Muda Alami (Blush Cheeks)
        const drawBlush = (cx, cy) => {
            const grad = ctx.createRadialGradient(cx, cy, 5, cx, cy, 45);
            grad.addColorStop(0, charType === "girl" ? "rgba(255, 90, 120, 0.65)" : "rgba(238, 110, 110, 0.45)");
            grad.addColorStop(0.6, "rgba(238, 110, 110, 0.20)");
            grad.addColorStop(1, "rgba(238, 110, 110, 0.0)");
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(cx, cy, 45, 0, Math.PI * 2);
            ctx.fill();
        };
        drawBlush(135, 305);
        drawBlush(377, 305);

        // 3. Alis Mata Alami
        ctx.strokeStyle = (charType === "grandpa") ? "#F5F5F5" : (charType === "girl" ? "#4A2810" : "#2E1A0C");
        ctx.lineWidth = (charType === "grandpa") ? 14 : 9;
        ctx.lineCap = "round";
        // Alis Kiri
        ctx.beginPath();
        ctx.moveTo(115, 175);
        ctx.quadraticCurveTo(165, charType === "grandpa" ? 150 : 155, 215, 178);
        ctx.stroke();
        // Alis Kanan
        ctx.beginPath();
        ctx.moveTo(297, 178);
        ctx.quadraticCurveTo(347, charType === "grandpa" ? 150 : 155, 397, 175);
        ctx.stroke();

        // 4. Mata Anime Retro Besar & Hidup (Sparkling Expressive Eyes)
        const drawEye = (cx, cy) => {
            // Sklera Putih
            ctx.fillStyle = "#FFFFFF";
            ctx.beginPath();
            ctx.ellipse(cx, cy, 44, 52, 0, 0, Math.PI * 2);
            ctx.fill();

            // Iris Cokelat Tua / Amber Bergradasi Hangat
            const irisGrad = ctx.createLinearGradient(cx, cy - 50, cx, cy + 50);
            if (charType === "girl") {
                irisGrad.addColorStop(0, "#2B1608");
                irisGrad.addColorStop(0.5, "#B85C1E");
                irisGrad.addColorStop(1, "#E68A36");
            } else if (charType === "woman") {
                irisGrad.addColorStop(0, "#1F1209");
                irisGrad.addColorStop(0.5, "#4E2B15");
                irisGrad.addColorStop(1, "#7D4620");
            } else {
                irisGrad.addColorStop(0, "#1F1209");
                irisGrad.addColorStop(0.5, "#4A2810");
                irisGrad.addColorStop(1, "#8A4C1A");
            }
            ctx.fillStyle = irisGrad;
            ctx.beginPath();
            ctx.ellipse(cx, cy + 2, 36, 46, 0, 0, Math.PI * 2);
            ctx.fill();

            // Pupil Hitam
            ctx.fillStyle = "#120A05";
            ctx.beginPath();
            ctx.ellipse(cx, cy + 2, 22, 28, 0, 0, Math.PI * 2);
            ctx.fill();

            // Kilau Cahaya Putih (Catchlights)
            ctx.fillStyle = "#FFFFFF";
            ctx.beginPath();
            ctx.arc(cx + 12, cy - 14, 13, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.arc(cx - 10, cy + 16, 7, 0, Math.PI * 2);
            ctx.fill();

            // Garis Kelopak Mata Atas
            ctx.strokeStyle = "#2B1608";
            ctx.lineWidth = charType === "girl" ? 9 : 8;
            ctx.beginPath();
            ctx.arc(cx, cy - 4, 46, Math.PI * 1.15, Math.PI * 1.85);
            ctx.stroke();

            // Bulu Mata Lentik untuk Gadis Petani Ceria
            if (charType === "girl" || charType === "woman") {
                ctx.lineWidth = 4;
                const sign = (cx < 256) ? -1 : 1;
                ctx.beginPath();
                ctx.moveTo(cx + sign * 38, cy - 26);
                ctx.lineTo(cx + sign * 52, cy - 36);
                ctx.moveTo(cx + sign * 30, cy - 36);
                ctx.lineTo(cx + sign * 42, cy - 48);
                ctx.stroke();
            }
        };

        drawEye(165, 235);
        drawEye(347, 235);

        // 5. Hidung Mungil Menggemaskan
        ctx.strokeStyle = "#B57A4C";
        ctx.lineWidth = 5;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.arc(256, 280, 8, 0.2, Math.PI * 0.8);
        ctx.stroke();

        // 6. Senyuman Hangat & Ceria / Janggut Kakek
        if (charType === "grandpa") {
            // Janggut & Kumis Putih Lebat Kakek Petani
            ctx.fillStyle = "#F5F5F5";
            ctx.strokeStyle = "#E0E0E0";
            ctx.lineWidth = 4;
            // Kumis Kiri
            ctx.beginPath();
            ctx.moveTo(256, 305);
            ctx.quadraticCurveTo(170, 310, 150, 345);
            ctx.quadraticCurveTo(200, 370, 256, 325);
            ctx.closePath();
            ctx.fill(); ctx.stroke();
            // Kumis Kanan
            ctx.beginPath();
            ctx.moveTo(256, 305);
            ctx.quadraticCurveTo(342, 310, 362, 345);
            ctx.quadraticCurveTo(312, 370, 256, 325);
            ctx.closePath();
            ctx.fill(); ctx.stroke();
            // Janggut Dagu Putih
            ctx.beginPath();
            ctx.moveTo(170, 340);
            ctx.quadraticCurveTo(256, 490, 342, 340);
            ctx.quadraticCurveTo(256, 360, 170, 340);
            ctx.closePath();
            ctx.fill(); ctx.stroke();
        } else {
            // Bibir senyum terbuka ceria
            ctx.fillStyle = "#932A1C";
            ctx.strokeStyle = "#4D150D";
            ctx.lineWidth = 6;
            ctx.beginPath();
            ctx.moveTo(195, 340);
            ctx.quadraticCurveTo(256, 420, 317, 340);
            ctx.quadraticCurveTo(256, 360, 195, 340);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Garis Gigi Putih Atas
            ctx.fillStyle = "#FFFFFF";
            ctx.beginPath();
            ctx.moveTo(215, 344);
            ctx.quadraticCurveTo(256, 362, 297, 344);
            ctx.quadraticCurveTo(256, 350, 215, 344);
            ctx.fill();

            // Lesung Pipit Halus di Ujung Bibir
            ctx.strokeStyle = "#B57A4C";
            ctx.lineWidth = 4;
            ctx.beginPath(); ctx.arc(190, 335, 5, 0.8, Math.PI * 0.6); ctx.stroke();
            ctx.beginPath(); ctx.arc(322, 335, 5, Math.PI * 0.4, 2.3); ctx.stroke();
        }

        const tex = new THREE.CanvasTexture(canvas);
        tex.anisotropy = 4;
        this.cache[key] = tex;
        return tex;
    }

    // ==========================================
    // KEMEJA FLANNEL KOTAK-KOTAK PETANI (RED/BROWN PLAID)
    // ==========================================
    getFlannelPlaid(repeatX = 2, repeatY = 2) {
        const key = `flannelPlaid_${repeatX}_${repeatY}`;
        if (this.cache[key]) return this.cache[key];
        if (typeof document === "undefined") return null;

        const canvas = document.createElement("canvas");
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext("2d");

        // Warna dasar merah tua kemeja pedesaan
        ctx.fillStyle = "#B71C1C";
        ctx.fillRect(0, 0, 256, 256);

        // Garis kotak-kotak hitam & krem
        ctx.fillStyle = "rgba(20, 10, 10, 0.45)";
        ctx.fillRect(0, 0, 256, 48);
        ctx.fillRect(0, 128, 256, 48);
        ctx.fillRect(0, 0, 48, 256);
        ctx.fillRect(128, 0, 48, 256);

        // Garis kuning tipis khas kemeja flanel petani retro
        ctx.strokeStyle = "rgba(255, 235, 180, 0.55)";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(24, 0); ctx.lineTo(24, 256);
        ctx.moveTo(152, 0); ctx.lineTo(152, 256);
        ctx.moveTo(0, 24); ctx.lineTo(256, 24);
        ctx.moveTo(0, 152); ctx.lineTo(256, 152);
        ctx.stroke();

        const tex = new THREE.CanvasTexture(canvas);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(repeatX, repeatY);
        this.cache[key] = tex;
        return tex;
    }

    // ==========================================
    // 13. TEKSTUR BULU AYAM COKELAT-PUTIH BERBINTIK (SPECKLED HEN FEATHERS)
    // Sesuai gambar referensi: bulu cokelat kastanye hangat dengan bintik-bintik krim lembut
    // ==========================================
    getSpeckledHenFeather(repeatX = 2, repeatY = 2) {
        const key = `speckledHen_${repeatX}_${repeatY}`;
        if (this.cache[key]) return this.cache[key];

        const canvas = document.createElement("canvas");
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext("2d");

        // Warna Dasar Bulu Cokelat Kastanye Hangat
        const grad = ctx.createLinearGradient(0, 0, 512, 512);
        grad.addColorStop(0, "#8C431F");
        grad.addColorStop(0.5, "#6E3013");
        grad.addColorStop(1, "#54210B");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 512, 512);

        // Lapisan Bulu Bergerigi & Melengkung Bersusun (Scalloped Feathers)
        const rowH = 28;
        const featherW = 36;
        for (let y = 0; y < 512 + rowH; y += rowH) {
            const rowIdx = Math.floor(y / rowH);
            const xOffset = (rowIdx % 2) * (featherW / 2);
            for (let x = -featherW; x < 512 + featherW; x += featherW) {
                const cx = x + xOffset;
                // Bayangan Bawah Helai Bulu
                ctx.fillStyle = "#3B1506";
                ctx.beginPath();
                ctx.arc(cx, y, featherW * 0.55, 0, Math.PI);
                ctx.fill();

                // Badan Bulu Cokelat Terang
                ctx.fillStyle = (rowIdx % 3 === 0) ? "#A65528" : ((rowIdx % 3 === 1) ? "#8E441D" : "#7A3614");
                ctx.beginPath();
                ctx.arc(cx, y - 4, featherW * 0.5, 0, Math.PI);
                ctx.fill();

                // Pinggiran Bintik Putih-Krim Khas Ayam Betina (Speckled White-Cream Flecks)
                if ((rowIdx + Math.floor(x / featherW)) % 2 === 0) {
                    ctx.fillStyle = "#FFF4E3";
                    ctx.beginPath();
                    ctx.ellipse(cx, y + 8, 4.5, 2.8, 0, 0, Math.PI * 2);
                    ctx.fill();

                    ctx.fillStyle = "#FFFFFF";
                    ctx.beginPath();
                    ctx.ellipse(cx - 5, y + 6, 2.5, 2.0, -0.3, 0, Math.PI * 2);
                    ctx.ellipse(cx + 5, y + 6, 2.5, 2.0, 0.3, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }

        // Bintik Halus Alami Berserak (Micro Flecks)
        for (let i = 0; i < 400; i++) {
            const rx = Math.random() * 512;
            const ry = Math.random() * 512;
            const rRad = Math.random() * 2.2 + 0.8;
            ctx.fillStyle = (Math.random() > 0.45) ? "rgba(255, 248, 235, 0.85)" : "rgba(60, 24, 8, 0.5)";
            ctx.beginPath();
            ctx.arc(rx, ry, rRad, 0, Math.PI * 2);
            ctx.fill();
        }

        const tex = new THREE.CanvasTexture(canvas);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(repeatX, repeatY);
        tex.anisotropy = 4;
        this.cache[key] = tex;
        return tex;
    }

    // ==========================================
    // 14. TEKSTUR BULU WOL KERITING TEBAL DOMBA (CURLY SHEEP WOOL)
    // Sesuai gambar referensi: gumpalan wol putih-krem mengembang dengan gelombang keriting alami
    // ==========================================
    getCurlySheepWool(repeatX = 3, repeatY = 3) {
        const key = `curlyWool_${repeatX}_${repeatY}`;
        if (this.cache[key]) return this.cache[key];

        const canvas = document.createElement("canvas");
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext("2d");

        // Warna Dasar Wol Krem Alami
        ctx.fillStyle = "#EDE8DD";
        ctx.fillRect(0, 0, 512, 512);

        // Pola Gelombang Keriting & Spiral Wol (Dense Curly Wool Rings & Swirls)
        const ringStep = 32;
        for (let y = 0; y < 512; y += ringStep) {
            for (let x = 0; x < 512; x += ringStep) {
                const jx = x + (Math.random() * 12 - 6) + 16;
                const jy = y + (Math.random() * 12 - 6) + 16;
                const rad = 14 + Math.random() * 6;

                // Bayangan Kedalaman Cekungan Wol
                ctx.fillStyle = "#D6CDBC";
                ctx.beginPath();
                ctx.arc(jx + 2, jy + 2, rad, 0, Math.PI * 2);
                ctx.fill();

                // Gumpalan Wol Inti
                ctx.fillStyle = "#F5F2EB";
                ctx.beginPath();
                ctx.arc(jx, jy, rad * 0.92, 0, Math.PI * 2);
                ctx.fill();

                // Lingkaran Keriting Luar Wol (Curly Swirl Arc)
                ctx.strokeStyle = "#DDD5C4";
                ctx.lineWidth = 3.5;
                ctx.beginPath();
                ctx.arc(jx, jy, rad * 0.65, 0.4, Math.PI * 1.6);
                ctx.stroke();

                // Kilau Cahaya Lembut Wol Atas
                ctx.fillStyle = "#FFFFFF";
                ctx.beginPath();
                ctx.arc(jx - 3, jy - 3, rad * 0.45, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Bintik Tekstur Wol Halus
        for (let i = 0; i < 600; i++) {
            const rx = Math.random() * 512;
            const ry = Math.random() * 512;
            ctx.fillStyle = (Math.random() > 0.5) ? "rgba(255, 255, 255, 0.7)" : "rgba(205, 195, 180, 0.45)";
            ctx.beginPath();
            ctx.arc(rx, ry, Math.random() * 2 + 0.8, 0, Math.PI * 2);
            ctx.fill();
        }

        const tex = new THREE.CanvasTexture(canvas);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(repeatX, repeatY);
        tex.anisotropy = 4;
        this.cache[key] = tex;
        return tex;
    }

    // ==========================================
    // 15. TEKSTUR CORAK SAPI PERAH HOLSTEIN (HOLSTEIN COW HIDE)
    // Sesuai gambar referensi: corak belang hitam-putih kontras tegas dengan batas organik halus
    // ==========================================
    getHolsteinCowHide(repeatX = 2, repeatY = 1) {
        const key = `holsteinHide_${repeatX}_${repeatY}`;
        if (this.cache[key]) return this.cache[key];

        const canvas = document.createElement("canvas");
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext("2d");

        // Warna Dasar Putih Murni Sapi
        ctx.fillStyle = "#FAF8F5";
        ctx.fillRect(0, 0, 512, 512);

        // Corak Belang Hitam Alami Khas Sapi Holstein (Organic Piebald Patches)
        const patches = [
            { x: 120, y: 140, rx: 90, ry: 65, rot: 0.2 },
            { x: 380, y: 110, rx: 85, ry: 75, rot: -0.3 },
            { x: 260, y: 350, rx: 110, ry: 85, rot: 0.4 },
            { x: 80, y: 410, rx: 65, ry: 50, rot: -0.2 },
            { x: 440, y: 380, rx: 70, ry: 55, rot: 0.1 }
        ];

        ctx.fillStyle = "#1E2226";
        patches.forEach(p => {
            ctx.beginPath();
            ctx.ellipse(p.x, p.y, p.rx, p.ry, p.rot, 0, Math.PI * 2);
            ctx.fill();

            // Tambahkan bulatan-bulatan kecil penumpuk agar tepian bercak organik & alami
            for (let b = 0; b < 6; b++) {
                const ang = (b / 6) * Math.PI * 2;
                const bx = p.x + Math.cos(ang) * (p.rx * 0.75);
                const by = p.y + Math.sin(ang) * (p.ry * 0.75);
                ctx.beginPath();
                ctx.arc(bx, by, 22 + Math.random() * 14, 0, Math.PI * 2);
                ctx.fill();
            }
        });

        // Bintik Hitam Kecil Terpisah
        const smallSpots = [
            { x: 40, y: 220, r: 16 }, { x: 220, y: 80, r: 18 },
            { x: 320, y: 220, r: 14 }, { x: 480, y: 240, r: 20 },
            { x: 160, y: 300, r: 12 }
        ];
        smallSpots.forEach(s => {
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fill();
        });

        const tex = new THREE.CanvasTexture(canvas);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(repeatX, repeatY);
        tex.anisotropy = 4;
        this.cache[key] = tex;
        return tex;
    }

    // Keset Lantai Kain Burlap dengan Tulisan Bold "EGGS" Sesuai Foto Referensi
    getEggsMatTexture() {
        const key = "eggs_mat_canvas";
        if (this.cache[key]) return this.cache[key];

        const canvas = document.createElement("canvas");
        canvas.width = 512;
        canvas.height = 256;
        const ctx = canvas.getContext("2d");

        // Warna dasar keset kain linen/burlap krem hangat
        ctx.fillStyle = "#EADBBD";
        ctx.fillRect(0, 0, 512, 256);

        // Serat kain tenun alami
        ctx.fillStyle = "rgba(180, 155, 115, 0.25)";
        for (let x = 0; x < 512; x += 4) {
            ctx.fillRect(x, 0, 2, 256);
        }
        for (let y = 0; y < 256; y += 4) {
            ctx.fillRect(0, y, 512, 2);
        }

        // Bingkai garis tepi cokelat elegan
        ctx.strokeStyle = "#8D532B";
        ctx.lineWidth = 14;
        ctx.strokeRect(16, 16, 480, 224);

        // Garis tepi tipis dalam
        ctx.strokeStyle = "rgba(141, 83, 43, 0.4)";
        ctx.lineWidth = 3;
        ctx.strokeRect(28, 28, 456, 200);

        // Teks Bold "EGGS" besar di tengah persis seperti foto referensi
        ctx.fillStyle = "#7E3B1C";
        ctx.font = "900 130px 'Arial Black', Impact, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.shadowColor = "rgba(70, 30, 10, 0.35)";
        ctx.shadowOffsetX = 4;
        ctx.shadowOffsetY = 4;
        ctx.shadowBlur = 4;
        ctx.fillText("EGGS", 256, 128);

        const tex = new THREE.CanvasTexture(canvas);
        tex.wrapS = THREE.ClampToEdgeWrapping;
        tex.wrapT = THREE.ClampToEdgeWrapping;
        tex.anisotropy = 4;
        this.cache[key] = tex;
        return tex;
    }

    // Papan Nama Garasi Pengantaran (PENGANTARAN / DELIVERY) Sesuai Foto Referensi
    getDeliverySignTexture() {
        const key = "delivery_sign_canvas";
        if (this.cache[key]) return this.cache[key];

        const canvas = document.createElement("canvas");
        canvas.width = 512;
        canvas.height = 256;
        const ctx = canvas.getContext("2d");

        // Plat besi berkarat dasar
        ctx.fillStyle = "#4A3222";
        ctx.fillRect(0, 0, 512, 256);

        // Noda karat & oksidasi logam tua
        const rustColors = ["#6A3C1A", "#834A23", "#3B2213", "#9C5428", "#542D15"];
        for (let i = 0; i < 200; i++) {
            const rx = Math.random() * 512;
            const ry = Math.random() * 256;
            const rw = Math.random() * 40 + 10;
            const rh = Math.random() * 30 + 10;
            ctx.fillStyle = rustColors[Math.floor(Math.random() * rustColors.length)];
            ctx.beginPath();
            ctx.ellipse(rx, ry, rw, rh, Math.random() * Math.PI, 0, Math.PI * 2);
            ctx.fill();
        }

        // Bingkai logam plat besi tebal
        ctx.strokeStyle = "#2A180E";
        ctx.lineWidth = 14;
        ctx.strokeRect(10, 10, 492, 236);

        // Baut-baut paku keling di 4 sudut
        ctx.fillStyle = "#1B110B";
        [[24, 24], [488, 24], [24, 232], [488, 232]].forEach(([bx, by]) => {
            ctx.beginPath();
            ctx.arc(bx, by, 7, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "#A87042";
            ctx.beginPath();
            ctx.arc(bx - 2, by - 2, 2.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "#1B110B";
        });

        // Teks Atas: PENGANTARAN
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "900 52px 'Arial Black', Impact, sans-serif";
        ctx.fillStyle = "#100905";
        ctx.fillText("PENGANTARAN", 258, 88); // Shadow
        ctx.fillStyle = "#F5ECD7";
        ctx.fillText("PENGANTARAN", 256, 86);

        // Teks Bawah: DELIVERY
        ctx.font = "900 46px 'Arial Black', Impact, sans-serif";
        ctx.fillStyle = "#100905";
        ctx.fillText("DELIVERY", 258, 168); // Shadow
        ctx.fillStyle = "#E8D5B5";
        ctx.fillText("DELIVERY", 256, 166);

        const tex = new THREE.CanvasTexture(canvas);
        tex.wrapS = THREE.ClampToEdgeWrapping;
        tex.wrapT = THREE.ClampToEdgeWrapping;
        tex.anisotropy = 4;
        this.cache[key] = tex;
        return tex;
    }

    // Atap Seng Bergelombang Berkarat (Corrugated Rusted Metal Roof)
    getCorrugatedTinRoof(repeatX = 4, repeatY = 6) {
        const key = `corrugatedTin_${repeatX}_${repeatY}`;
        if (this.cache[key]) return this.cache[key];

        const canvas = document.createElement("canvas");
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext("2d");

        // Warna dasar seng timah galvanis abu-abu
        ctx.fillStyle = "#7E8B95";
        ctx.fillRect(0, 0, 512, 512);

        // Gelombang seng horisontal/vertikal
        for (let x = 0; x < 512; x += 16) {
            // Sisi terang gelombang
            ctx.fillStyle = "rgba(235, 245, 255, 0.28)";
            ctx.fillRect(x, 0, 6, 512);
            // Sisi bayangan lembah gelombang
            ctx.fillStyle = "rgba(20, 25, 30, 0.4)";
            ctx.fillRect(x + 8, 0, 8, 512);
        }

        // Noda karat besi memanjang ke bawah
        for (let i = 0; i < 35; i++) {
            const rx = Math.random() * 512;
            const ry = Math.random() * 300;
            const rlen = Math.random() * 200 + 40;
            const rwidth = Math.random() * 14 + 6;
            const rustGrad = ctx.createLinearGradient(rx, ry, rx, ry + rlen);
            rustGrad.addColorStop(0, "rgba(165, 75, 25, 0.65)");
            rustGrad.addColorStop(0.5, "rgba(125, 50, 15, 0.5)");
            rustGrad.addColorStop(1, "rgba(90, 40, 15, 0.0)");
            ctx.fillStyle = rustGrad;
            ctx.fillRect(rx - rwidth / 2, ry, rwidth, rlen);
        }

        // Lumut hijau tua di lekukan atap
        for (let i = 0; i < 20; i++) {
            const mx = Math.random() * 512;
            const my = Math.random() * 512;
            ctx.fillStyle = "rgba(75, 105, 65, 0.35)";
            ctx.beginPath();
            ctx.arc(mx, my, Math.random() * 25 + 10, 0, Math.PI * 2);
            ctx.fill();
        }

        const tex = new THREE.CanvasTexture(canvas);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(repeatX, repeatY);
        tex.anisotropy = 4;
        this.cache[key] = tex;
        return tex;
    }

    // Alias kompatibilitas
    getBarnWood(rx = 4, ry = 2) { return this.getWeatheredBarnWood(rx, ry); }
    getSiloMetal(rx = 4, ry = 6) { return this.getRustedSiloMetal(rx, ry); }
    getSlateRoof(rx = 6, ry = 4) { return this.getMossyShingle(rx, ry); }
    getAsphalt(rx = 1, ry = 38) { return this.getAsphaltRoad(rx, ry); }
    getOrganicSoil(rx = 7, ry = 5) { return this.getVegetableField(rx, ry); }
    getCourtyardGravel(rx = 6, ry = 6) { return this.getClayMudCourtyard(rx, ry); }
    getClayMud(rx = 1, ry = 1) { return this.getClayMudCourtyard(rx, ry); }
    getWhiteClapboard(rx = 4, ry = 2) { return this.getWeatheredBarnWood(rx, ry); }
}

window.FarmTextures = new ProceduralTextures();
