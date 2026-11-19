// 3d_models.js - Generator Model 3D Realistis & Hidup (Sesuai Referensi Foto Diorama Pertanian)
// 100% Three.js Geometries Prosedural - Performa tinggi, bebas CORS, dan offline-ready

const Colors3D = {
    grass: 0x436B22, // Rumput alami bergradasi retro
    grassLush: 0x4E7D28,
    grassDark: 0x2E4B16,
    dirtGround: 0x362214, // Tanah gembur cokelat tua ladang sayur
    clayMud: 0x5C381F, // Tanah liat cokelat alami courtyard
    courtyardGravel: 0x5C381F,
    dirtPath: 0xCDA158, // Jalan tanah berpasir alami
    roadAsphalt: 0xCDA158,
    roadLine: 0xE8C888,
    fenceWood: 0x443224, // Pagar kayu kasar, lapuk & tidak rata
    fencePost: 0x38281D,
    barnRed: 0x9E2424, // Dinding kayu merah lumbung klasik pedesaan
    barnWood: 0x9E2424,
    barnRedDark: 0x7A1818,
    barnWhite: 0xEAE6DE,
    barnTrim: 0x382619, // Kusen kayu tua gelap
    roofThatch: 0xD6A74B, // Atap jerami kering kuning emas
    roofSlate: 0x382D24, // Genteng kayu lapuk berlumut
    roofShingle: 0x382D24,
    roofGrey: 0x4A3D32,
    mossGreen: 0x3E6228,
    siloMetal: 0x706D69, // Silo logam tua berkarat
    siloDome: 0x544E48,
    wheatGold: 0xE0B33A,
    wheatRipe: 0xD4A02A,
    hayBale: 0xD4A548,
    hayStrap: 0x6D4C2B,
    waterBlue: 0x3E6E82,
    skin: 0xFFE0B2,
    hair: 0x212121,
    shirtRed: 0xB71C1C,
    overallsBlue: 0x283593, // Biru denim gelap realistis
    goldButton: 0xD4AF37,
    boots: 0x3E2723,
    strawHat: 0xE0B84C,
    hatBand: 0x8E2424,
    factoryMetal: 0x455A64,
    truckBody1: 0x455A64,
    truckBody2: 0x2A4B7C,
    truckBody3: 0x512DA8,
    egg: 0xF5F0DD,
    milk: 0xF5F5F5,
    wool: 0xEDEAE3,
    mayo: 0xF5EAB0,
    cheese: 0xD9A036, // Kuning keju tua alami
    fabric: 0x455A64
};

// Material cache untuk efisiensi render
const MatCache = {};
function getMat(color, roughness = 0.6, metalness = 0.1) {
    const key = `col_${color}_${roughness}_${metalness}`;
    if (!MatCache[key]) {
        MatCache[key] = new THREE.MeshStandardMaterial({
            color: color,
            roughness: roughness,
            metalness: metalness,
            flatShading: false
        });
    }
    return MatCache[key];
}

// Generator Material Bertekstur Retro 2.5D Isometrik 90-an
function getTexturedMat(texType, fallbackColor, roughness = 0.6, metalness = 0.1, opt = {}) {
    const rx = opt.rx || 1;
    const ry = opt.ry || 1;
    const key = `tex_${texType}_${roughness}_${metalness}_${rx}_${ry}`;
    if (MatCache[key]) return MatCache[key];

    let tex = null;
    if (typeof window !== "undefined" && window.FarmTextures) {
        if (texType === "retroGrass") tex = window.FarmTextures.getRetroGrass(rx, ry);
        else if (texType === "clayMud" || texType === "clayMudCourtyard" || texType === "courtyardGravel") tex = window.FarmTextures.getClayMudCourtyard(rx, ry);
        else if (texType === "asphalt" || texType === "asphaltRoad") tex = window.FarmTextures.getAsphaltRoad(rx, ry);
        else if (texType === "sandyDirtRoad") tex = window.FarmTextures.getSandyDirtRoad(rx, ry);
        else if (texType === "eggsMat") tex = window.FarmTextures.getEggsMatTexture();
        else if (texType === "deliverySign") tex = window.FarmTextures.getDeliverySignTexture();
        else if (texType === "corrugatedTin" || texType === "corrugatedMetal") tex = window.FarmTextures.getCorrugatedTinRoof(rx, ry);
        else if (texType === "flannelPlaid") tex = window.FarmTextures.getFlannelPlaid(rx, ry);
        else if (texType === "weatheredBarnWood" || texType === "barnWood" || texType === "whiteClapboard") tex = window.FarmTextures.getWeatheredBarnWood(rx, ry);
        else if (texType === "thatchRoof") tex = window.FarmTextures.getThatchRoof(rx, ry);
        else if (texType === "mossyShingle" || texType === "slateRoof") tex = window.FarmTextures.getMossyShingle(rx, ry);
        else if (texType === "rustedSiloMetal" || texType === "siloMetal") tex = window.FarmTextures.getRustedSiloMetal(rx, ry);
        else if (texType === "vegetableField" || texType === "organicSoil") tex = window.FarmTextures.getVegetableField(rx, ry);
        else if (texType === "burlapSack") tex = window.FarmTextures.getBurlapSack(rx, ry);
        else if (texType === "wovenStraw") tex = window.FarmTextures.getWovenStraw(rx, ry);
        else if (texType === "denimFabric") tex = window.FarmTextures.getDenimFabric(rx, ry);
        else if (texType === "speckledHen" || texType === "speckledHenFeather") tex = window.FarmTextures.getSpeckledHenFeather(rx, ry);
        else if (texType === "curlyWool" || texType === "curlySheepWool") tex = window.FarmTextures.getCurlySheepWool(rx, ry);
        else if (texType === "holsteinHide" || texType === "holsteinCowHide") tex = window.FarmTextures.getHolsteinCowHide(rx, ry);
    }

    if (tex) {
        const mat = new THREE.MeshStandardMaterial({
            map: tex,
            roughness: roughness,
            metalness: metalness
        });
        MatCache[key] = mat;
        return mat;
    }
    return getMat(fallbackColor, roughness, metalness);
}

window.getMat = getMat;
window.getTexturedMat = getTexturedMat;
window.Colors3D = Colors3D;

class ModelBuilder3D {
    // ==========================================
    // 1. BANGUNAN GUDANG KAYU TUA RETRO (WEATHERED RUSTIC BARN)
    // Sesuai persis dengan gambar referensi RTS 90-an:
    // Dinding kayu tua bertekstur serat alami, atap jerami emas tebal & genteng lapuk berlumut
    // ==========================================
    static createBigRedBarn() {
        const root = new THREE.Group();
        root.name = "bigRedBarn";

        // A. Struktur Dasar Dinding Kayu Tua & Atap Jerami Emas
        const wallMat = getTexturedMat("weatheredBarnWood", Colors3D.barnWood, 0.85, 0.05, { rx: 4, ry: 2 });
        const trimMat = getMat(Colors3D.barnTrim, 0.9, 0.05); // Kayu tua gelap
        const roofThatchMat = getTexturedMat("thatchRoof", Colors3D.roofThatch, 0.92, 0.02, { rx: 4, ry: 4 });
        const roofMossyMat = getTexturedMat("mossyShingle", Colors3D.roofSlate, 0.85, 0.05, { rx: 6, ry: 4 });

        // Badan Utama Gedung
        const mainWidth = 7.0;
        const mainHeight = 4.2;
        const mainDepth = 8.5;
        const bodyGeo = new THREE.BoxGeometry(mainWidth, mainHeight, mainDepth);
        const body = new THREE.Mesh(bodyGeo, wallMat);
        body.position.y = mainHeight / 2;
        body.castShadow = true;
        body.receiveShadow = true;
        root.add(body);

        // B. Lis Balok Kayu Tua di Sudut-sudut Gedung
        const cornerGeo = new THREE.BoxGeometry(0.3, mainHeight + 0.1, 0.3);
        [
            [-mainWidth / 2, -mainDepth / 2],
            [mainWidth / 2, -mainDepth / 2],
            [-mainWidth / 2, mainDepth / 2],
            [mainWidth / 2, mainDepth / 2]
        ].forEach(([cx, cz]) => {
            const corner = new THREE.Mesh(cornerGeo, trimMat);
            corner.position.set(cx, mainHeight / 2, cz);
            corner.castShadow = true;
            root.add(corner);
        });

        // C. Atap Gambrel Pedesaan Retro
        // Tingkat 1: Kemiringan Bawah Curam (Genteng Kayu Berlumut)
        const r1Geo = new THREE.BoxGeometry(mainWidth * 0.42, 0.22, mainDepth + 0.6);
        const roofL1 = new THREE.Mesh(r1Geo, roofMossyMat);
        roofL1.rotation.z = 1.05;
        roofL1.position.set(-mainWidth * 0.4, mainHeight + 0.8, 0);
        roofL1.castShadow = true; roofL1.receiveShadow = true;

        const roofR1 = new THREE.Mesh(r1Geo, roofMossyMat);
        roofR1.rotation.z = -1.05;
        roofR1.position.set(mainWidth * 0.4, mainHeight + 0.8, 0);
        roofR1.castShadow = true; roofR1.receiveShadow = true;

        // Tingkat 2: Puncak Atap Landai (Jerami Kering Kuning Emas Tebal)
        const r2Geo = new THREE.BoxGeometry(mainWidth * 0.38, 0.26, mainDepth + 0.6);
        const roofL2 = new THREE.Mesh(r2Geo, roofThatchMat);
        roofL2.rotation.z = 0.45;
        roofL2.position.set(-mainWidth * 0.18, mainHeight + 1.85, 0);
        roofL2.castShadow = true; roofL2.receiveShadow = true;

        const roofR2 = new THREE.Mesh(r2Geo, roofThatchMat);
        roofR2.rotation.z = -0.45;
        roofR2.position.set(mainWidth * 0.18, mainHeight + 1.85, 0);
        roofR2.castShadow = true; roofR2.receiveShadow = true;

        // Punggung Jerami Puncak (Thatch Ridge Cap)
        const ridgeCap = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.28, mainDepth + 0.65, 8), roofThatchMat);
        ridgeCap.rotation.x = Math.PI / 2;
        ridgeCap.position.set(0, mainHeight + 2.7, 0);
        ridgeCap.castShadow = true;
        root.add(roofL1, roofR1, roofL2, roofR2, ridgeCap);

        // Dinding Segitiga Gable Atas
        [-mainDepth / 2 + 0.08, mainDepth / 2 - 0.08].forEach(gz => {
            const gableWall = new THREE.Mesh(new THREE.BoxGeometry(mainWidth - 0.4, 1.8, 0.15), wallMat);
            gableWall.position.set(0, mainHeight + 0.9, gz);
            root.add(gableWall);
        });

        // D. Menara Ventilasi / Cupola Kayu Tua di Puncak
        const cupolaBase = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.9, 1.2), wallMat);
        cupolaBase.position.set(0, mainHeight + 3.1, 0);
        cupolaBase.castShadow = true;
        const cupolaRoof = new THREE.Mesh(new THREE.ConeGeometry(1.0, 0.8, 4), roofMossyMat);
        cupolaRoof.rotation.y = Math.PI / 4;
        cupolaRoof.position.set(0, mainHeight + 3.95, 0);
        cupolaRoof.castShadow = true;
        root.add(cupolaBase, cupolaRoof);

        // E. Pintu Gerbang Kayu Tua dengan Palang Kayu 'Z' (Weathered Timber Barn Doors)
        const doorFrame = new THREE.Mesh(new THREE.BoxGeometry(3.2, 3.4, 0.2), trimMat);
        doorFrame.position.set(0, 1.7, mainDepth / 2 + 0.08);

        const doorL = new THREE.Mesh(new THREE.BoxGeometry(1.4, 3.1, 0.12), wallMat);
        doorL.position.set(-0.75, 1.7, mainDepth / 2 + 0.14);
        const doorR = new THREE.Mesh(new THREE.BoxGeometry(1.4, 3.1, 0.12), wallMat);
        doorR.position.set(0.75, 1.7, mainDepth / 2 + 0.14);

        // Palang Z Kayu Tua di Pintu
        const crossGeo = new THREE.BoxGeometry(0.14, 3.3, 0.1);
        const crossL = new THREE.Mesh(crossGeo, trimMat); crossL.rotation.z = 0.52; crossL.position.set(-0.75, 1.7, mainDepth / 2 + 0.2);
        const crossR = new THREE.Mesh(crossGeo, trimMat); crossR.rotation.z = -0.52; crossR.position.set(0.75, 1.7, mainDepth / 2 + 0.2);

        // Engsel Besi Cor Hitam Tua
        const hingeMat = getMat(0x212121, 0.6, 0.5);
        [-0.75, 0.75].forEach(dx => {
            [0.6, 2.7].forEach(dy => {
                const hinge = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.08, 0.06), hingeMat);
                hinge.position.set(dx + (dx < 0 ? -0.4 : 0.4), dy, mainDepth / 2 + 0.22);
                root.add(hinge);
            });
        });

        root.add(doorFrame, doorL, doorR, crossL, crossR);

        // F. Bangunan Sayap Tambahan (Side Lean-To Shed dengan Atap Berlumut)
        const shedW = 3.6;
        const shedH = 2.4;
        const shedD = 5.2;
        const shed = new THREE.Mesh(new THREE.BoxGeometry(shedW, shedH, shedD), wallMat);
        shed.position.set(mainWidth / 2 + shedW / 2, shedH / 2, 0.5);
        shed.castShadow = true; shed.receiveShadow = true;

        const shedRoof = new THREE.Mesh(new THREE.BoxGeometry(shedW + 0.6, 0.22, shedD + 0.6), roofMossyMat);
        shedRoof.rotation.z = 0.35;
        shedRoof.position.set(mainWidth / 2 + shedW / 2, shedH + 0.4, 0.5);
        shedRoof.castShadow = true; shedRoof.receiveShadow = true;
        root.add(shed, shedRoof);

        // G. Tumpukan Kayu Gelondongan di Samping Dinding Gudang (Firewood Log Pile)
        const logMat = getMat(0x5D4037, 0.9, 0.05);
        for (let row = 0; row < 3; row++) {
            const count = 4 - row;
            for (let c = 0; c < count; c++) {
                const log = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 1.8, 8), logMat);
                log.rotation.x = Math.PI / 2;
                log.position.set(
                    mainWidth / 2 + 0.4 + (c * 0.34) + (row * 0.17),
                    0.2 + (row * 0.3),
                    mainDepth / 2 - 1.2
                );
                log.castShadow = true;
                root.add(log);
            }
        }

        // H. Barel Kayu Tua & Peti di Depan Pintu Gudang
        const barrel1 = ModelBuilder3D.createRusticBarrel();
        barrel1.position.set(2.2, 0, mainDepth / 2 + 0.8);
        const barrel2 = ModelBuilder3D.createRusticBarrel();
        barrel2.position.set(2.9, 0, mainDepth / 2 + 0.6);
        const crate1 = ModelBuilder3D.createRusticCrate();
        crate1.position.set(-2.4, 0, mainDepth / 2 + 0.7);

        // Tumpukan Jerami Emas Lepas di Sudut Kiri Depan Gudang (Loose Hay Mound)
        const hayMound = ModelBuilder3D.createStrawMound(1.6, 1.0, 1.4);
        hayMound.position.set(-4.2, 0, mainDepth / 2 - 0.5);

        root.add(barrel1, barrel2, crate1, hayMound);
        return root;
    }

    // ==========================================
    // 2. SILO LOGAM TUA BERKARAT (WEATHERED RUSTED METAL GRAIN SILO)
    // Silinder seng bergelombang tua dengan lelehan karat merah oranye
    // ==========================================
    static createGrainSilo() {
        const root = new THREE.Group();
        root.name = "grainSilo";

        const siloRadius = 2.0;
        const siloHeight = 12.0;
        // Tekstur Baja Seng Berkarat Pekat
        const siloMat = getTexturedMat("rustedSiloMetal", Colors3D.siloMetal, 0.45, 0.55, { rx: 4, ry: 6 });
        const ringMat = getMat(0x3E3832, 0.6, 0.4);
        const domeMat = getMat(0x5A544E, 0.4, 0.6);

        // Badan Tabung Silo Logam Berkarat
        const cylinderGeo = new THREE.CylinderGeometry(siloRadius, siloRadius, siloHeight, 24);
        const cylinder = new THREE.Mesh(cylinderGeo, siloMat);
        cylinder.position.y = siloHeight / 2;
        cylinder.castShadow = true;
        cylinder.receiveShadow = true;
        root.add(cylinder);

        // Cincin Sabuk Penguat Besi Gelap Horisontal
        const ringGeo = new THREE.TorusGeometry(siloRadius + 0.05, 0.06, 8, 24);
        for (let y = 1.5; y < siloHeight; y += 1.6) {
            const ring = new THREE.Mesh(ringGeo, ringMat);
            ring.rotation.x = Math.PI / 2;
            ring.position.y = y;
            ring.castShadow = true;
            root.add(ring);
        }

        // Kubah Atas Silo Logam Berkarat
        const domeGeo = new THREE.SphereGeometry(siloRadius + 0.05, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2);
        const dome = new THREE.Mesh(domeGeo, domeMat);
        dome.position.y = siloHeight;
        dome.castShadow = true;
        root.add(dome);

        // Corong Ventilasi Atas Silo
        const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.45, 0.6, 12), ringMat);
        cap.position.y = siloHeight + 1.2;
        root.add(cap);

        // Tangga Vertikal Besi Tua
        const ladderGroup = new THREE.Group();
        ladderGroup.position.set(siloRadius + 0.15, 0, 0);
        const railGeo = new THREE.CylinderGeometry(0.03, 0.03, siloHeight - 0.5);
        const railL = new THREE.Mesh(railGeo, ringMat); railL.position.set(0, siloHeight / 2, -0.2);
        const railR = new THREE.Mesh(railGeo, ringMat); railR.position.set(0, siloHeight / 2, 0.2);
        ladderGroup.add(railL, railR);
        for (let y = 0.8; y < siloHeight - 0.5; y += 0.45) {
            const rung = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.4), ringMat);
            rung.rotation.x = Math.PI / 2;
            rung.position.set(0, y, 0);
            ladderGroup.add(rung);
        }
        root.add(ladderGroup);

        // Tumpukan Jerami Emas di Kaki Silo (Persis Foto Referensi)
        const strawAtBase = ModelBuilder3D.createStrawMound(1.8, 1.1, 1.8);
        strawAtBase.position.set(1.6, 0, 1.2);

        // Barel-barel Kayu di Kaki Silo
        const b1 = ModelBuilder3D.createRusticBarrel(); b1.position.set(-1.8, 0, 1.5);
        const b2 = ModelBuilder3D.createRusticBarrel(); b2.position.set(-1.2, 0, 2.1);
        root.add(strawAtBase, b1, b2);

        return root;
    }

    // ==========================================
    // 2B. OBJEK DEKORASI RETRO PEDESAAN (RUSTIC PROPS)
    // Sesuai atmosfer 90-an di foto referensi: barel kayu tua, peti, gundukan jerami, karung goni
    // ==========================================
    static createRusticBarrel(radius = 0.42, height = 0.95) {
        const group = new THREE.Group();
        const woodMat = getTexturedMat("weatheredBarnWood", Colors3D.weatheredWood, 0.85, 0.05, { rx: 2, ry: 2 });
        const hoopMat = getMat(0x23201D, 0.65, 0.35);

        // Badan Tong Kayu Melengkung
        const barrelGeo = new THREE.CylinderGeometry(radius * 0.9, radius * 0.9, height, 14);
        const barrelMesh = new THREE.Mesh(barrelGeo, woodMat);
        barrelMesh.position.y = height / 2;
        barrelMesh.castShadow = true;
        barrelMesh.receiveShadow = true;
        group.add(barrelMesh);

        // Sabuk Besi Tempa Hitam (Hoops)
        [-0.32, -0.1, 0.1, 0.32].forEach(oy => {
            const hoopGeo = new THREE.CylinderGeometry(radius * 0.92, radius * 0.92, 0.045, 14);
            const hoop = new THREE.Mesh(hoopGeo, hoopMat);
            hoop.position.y = height / 2 + oy * height;
            group.add(hoop);
        });

        return group;
    }

    static createRusticCrate(w = 0.85, h = 0.65, d = 0.85) {
        const group = new THREE.Group();
        const woodMat = getTexturedMat("weatheredBarnWood", 0x6E4F37, 0.88, 0.04, { rx: 2, ry: 2 });
        const boxGeo = new THREE.BoxGeometry(w, h, d);
        const box = new THREE.Mesh(boxGeo, woodMat);
        box.position.y = h / 2;
        box.castShadow = true;
        box.receiveShadow = true;
        group.add(box);

        // Lis Sudut Kayu Penguat (Braces)
        const braceMat = getMat(0x422F22, 0.9, 0.02);
        const bX = new THREE.Mesh(new THREE.BoxGeometry(w + 0.02, 0.06, 0.06), braceMat);
        bX.position.set(0, h * 0.85, d / 2 + 0.01);
        group.add(bX);

        return group;
    }

    static createStrawMound(rx = 1.6, ry = 1.0, rz = 1.4) {
        const group = new THREE.Group();
        const thatchMat = getTexturedMat("thatchRoof", Colors3D.thatchGold, 0.92, 0.0, { rx: 3, ry: 3 });
        const domeGeo = new THREE.SphereGeometry(1.0, 12, 10, 0, Math.PI * 2, 0, Math.PI / 2);
        const mound = new THREE.Mesh(domeGeo, thatchMat);
        mound.scale.set(rx, ry, rz);
        mound.castShadow = true;
        mound.receiveShadow = true;
        group.add(mound);

        // Beberapa helai jerami acak di sekitarnya
        const flakeMat = getMat(Colors3D.thatchGold, 0.9, 0.0);
        for (let i = 0; i < 7; i++) {
            const angle = (i / 7) * Math.PI * 2 + 0.2;
            const dist = (rx + rz) * 0.45 + (i % 2 === 0 ? 0.25 : -0.1);
            const flake = new THREE.Mesh(new THREE.ConeGeometry(0.25, 0.2, 5), flakeMat);
            flake.position.set(Math.cos(angle) * dist, 0.08, Math.sin(angle) * dist);
            flake.rotation.z = 0.3 * (i % 2 === 0 ? 1 : -1);
            group.add(flake);
        }

        return group;
    }

    static createBurlapSackGroup() {
        const group = new THREE.Group();
        const sackMat = getTexturedMat("burlapSack", Colors3D.burlap, 0.92, 0.0, { rx: 3, ry: 3 });
        const ropeMat = getMat(0x6D4C41, 0.9, 0.0);

        const sackCoords = [
            { x: -0.3, y: 0.35, z: 0.2, rotY: 0.2, scale: 1.0 },
            { x: 0.28, y: 0.33, z: 0.15, rotY: -0.4, scale: 0.95 },
            { x: 0.0, y: 0.34, z: -0.28, rotY: 0.6, scale: 1.05 },
            { x: -0.05, y: 0.85, z: 0.05, rotY: 0.1, scale: 0.9 }
        ];

        sackCoords.forEach(pos => {
            const sack = new THREE.Group();
            sack.position.set(pos.x, pos.y, pos.z);
            sack.rotation.y = pos.rotY;

            // Badan Karung Goni Bulat Organik (Jute Hessian Sack)
            const bodyGeo = new THREE.SphereGeometry(0.36 * pos.scale, 10, 8);
            bodyGeo.scale(1.0, 1.25, 0.9);
            const body = new THREE.Mesh(bodyGeo, sackMat);
            body.castShadow = true;
            body.receiveShadow = true;

            // Ikatan Tali Karung di Atas
            const tieGeo = new THREE.TorusGeometry(0.12 * pos.scale, 0.035, 6, 12);
            const tie = new THREE.Mesh(tieGeo, ropeMat);
            tie.rotation.x = Math.PI / 2;
            tie.position.y = 0.38 * pos.scale;

            // Pucuk Mulut Karung Terbuka / Kerutan
            const topGeo = new THREE.ConeGeometry(0.14 * pos.scale, 0.18 * pos.scale, 8);
            const topFold = new THREE.Mesh(topGeo, sackMat);
            topFold.position.y = 0.48 * pos.scale;

            sack.add(body, tie, topFold);
            group.add(sack);
        });

        return group;
    }

    static createWoodLogPile(count = 6, length = 1.8) {
        const group = new THREE.Group();
        const barkMat = getTexturedMat("weatheredBarnWood", 0x4A3525, 0.85, 0.05, { rx: 2, ry: 2 });
        const radius = 0.16;
        const coords = [
            [-0.35, radius, 0], [0, radius, 0], [0.35, radius, 0],
            [-0.18, radius * 2.6, 0], [0.18, radius * 2.6, 0],
            [0, radius * 4.2, 0]
        ];

        coords.slice(0, count).forEach(([lx, ly, lz]) => {
            const logGroup = new THREE.Group();
            logGroup.position.set(lx, ly, lz);
            const logMesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, length, 10), barkMat);
            logMesh.rotation.x = Math.PI / 2;
            logMesh.castShadow = true;
            logMesh.receiveShadow = true;
            logGroup.add(logMesh);
            group.add(logGroup);
        });

        return group;
    }

    // ==========================================
    // 3. KANDANG DI BELAKANG (SECONDARY BARNS & OUTBUILDINGS)
    // Kandang kayu putih besar & gudang peralatan merah
    // ==========================================
    static createSecondaryBarn(style = "white") {
        const root = new THREE.Group();
        root.name = "secondaryBarn";

        const isWhite = style === "white";
        const wallColor = Colors3D.barnRed; // Merah lumbung pedesaan
        const roofColor = isWhite ? Colors3D.roofGrey : Colors3D.roofSlate;
        const doorColor = Colors3D.barnWhite; // Pintu putih kontras bersih

        const w = 6.2;
        const h = 3.6;
        const d = 7.0;

        // Badan Gedung dengan Tekstur Papan Kayu Merah Lumbung Klasik
        const wallMat = getTexturedMat("weatheredBarnWood", Colors3D.barnRed, 0.76, 0.04, { rx: 4, ry: 2, bump: 0.03 });
        const body = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), wallMat);
        body.position.y = h / 2;
        body.castShadow = true;
        body.receiveShadow = true;
        root.add(body);

        // Atap Pelana Klasik Batu Sabak
        const roofMat = getTexturedMat("slateRoof", roofColor, 0.55, 0.08, { rx: 5, ry: 3, bump: 0.03 });
        const roofL = new THREE.Mesh(new THREE.BoxGeometry(w / 2 + 0.8, 0.15, d + 0.4), roofMat);
        roofL.rotation.z = 0.55;
        roofL.position.set(-w / 4, h + 0.8, 0);
        roofL.castShadow = true;

        const roofR = new THREE.Mesh(new THREE.BoxGeometry(w / 2 + 0.8, 0.15, d + 0.4), roofMat);
        roofR.rotation.z = -0.55;
        roofR.position.set(w / 4, h + 0.8, 0);
        roofR.castShadow = true;

        // Dinding Segitiga Atas
        [-d / 2, d / 2].forEach(gz => {
            const gable = new THREE.Mesh(new THREE.ConeGeometry(w / 2, 1.6, 4), getMat(wallColor));
            gable.rotation.y = Math.PI / 4;
            gable.position.set(0, h + 0.8, gz);
            root.add(gable);
        });

        root.add(roofL, roofR);

        // Ventilasi / Cupola Kecil di Atas
        const cupola = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.7, 0.8), getMat(0xFFFFFF));
        cupola.position.set(0, h + 1.8, 0);
        const cupRoof = new THREE.Mesh(new THREE.ConeGeometry(0.65, 0.6, 4), roofMat);
        cupRoof.rotation.y = Math.PI / 4;
        cupRoof.position.set(0, h + 2.35, 0);
        root.add(cupola, cupRoof);

        // Pintu Geser Kandang
        const door = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.6, 0.12), getMat(doorColor));
        door.position.set(0, 1.3, d / 2 + 0.06);
        root.add(door);

        return root;
    }

    // ==========================================
    // 4. RUMAH PETANI DESA (FARMHOUSE WITH PORCH)
    // Sesuai rumah putih bertingkat di foto referensi
    // ==========================================
    static createFarmhouse() {
        const root = new THREE.Group();
        root.name = "farmhouse";

        const w = 5.5;
        const h = 3.4;
        const d = 5.0;

        // Dinding Papan Merah Pedesaan Klasik (Classic Red Barn Siding)
        const houseMat = getTexturedMat("weatheredBarnWood", 0x9E2424, 0.75, 0.04, { rx: 4, ry: 2, bump: 0.03 });
        const houseBody = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), houseMat);
        houseBody.position.y = h / 2;
        houseBody.castShadow = true;
        root.add(houseBody);

        // Atap Rumah Abu-abu Batu Sabak Realistis
        const roofMat = getTexturedMat("slateRoof", Colors3D.roofShingle, 0.55, 0.08, { rx: 5, ry: 3, bump: 0.03 });
        const roofL = new THREE.Mesh(new THREE.BoxGeometry(w / 2 + 0.6, 0.15, d + 0.4), roofMat);
        roofL.rotation.z = 0.6;
        roofL.position.set(-w / 4, h + 0.75, 0);
        roofL.castShadow = true;

        const roofR = new THREE.Mesh(new THREE.BoxGeometry(w / 2 + 0.6, 0.15, d + 0.4), roofMat);
        roofR.rotation.z = -0.6;
        roofR.position.set(w / 4, h + 0.75, 0);
        roofR.castShadow = true;
        root.add(roofL, roofR);

        // Teras Depan Rumah (Front Porch & Pillars)
        const porchFloor = new THREE.Mesh(new THREE.BoxGeometry(w, 0.2, 1.8), getMat(0xD7CCC8));
        porchFloor.position.set(0, 0.1, d / 2 + 0.9);
        const porchRoof = new THREE.Mesh(new THREE.BoxGeometry(w, 0.12, 1.8), roofMat);
        porchRoof.position.set(0, 2.2, d / 2 + 0.9);

        // Tiang-tiang Teras Putih
        const pillarGeo = new THREE.BoxGeometry(0.12, 2.0, 0.12);
        const pillarMat = getMat(0xFFFFFF);
        [-w / 2 + 0.2, -w / 6, w / 6, w / 2 - 0.2].forEach(px => {
            const p = new THREE.Mesh(pillarGeo, pillarMat);
            p.position.set(px, 1.1, d / 2 + 1.7);
            root.add(p);
        });

        root.add(porchFloor, porchRoof);

        // Pintu Depan & Jendela Rumah
        const door = new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.8, 0.08), getMat(0x5D4037));
        door.position.set(0, 1.0, d / 2 + 0.05);
        root.add(door);

        return root;
    }

    // ==========================================
    // 5. LAHAN GANDUM BERGELOMBANG (FURROWED WHEAT FIELD)
    // Alur barisan gandum emas seperti di foto
    // ==========================================
    static createWheatField(width = 12, length = 16) {
        const root = new THREE.Group();
        root.name = "wheatField";

        // Tanah Gembur Berwarna Cokelat Hangat
        const soilGeo = new THREE.BoxGeometry(width, 0.2, length);
        const soil = new THREE.Mesh(soilGeo, getMat(Colors3D.dirtGround, 0.9, 0.0));
        soil.position.y = 0.1;
        soil.receiveShadow = true;
        root.add(soil);

        // Barisan Pematang Gandum Emas (Furrow Rows)
        const rowCount = Math.floor(width / 1.0);
        const wheatMat = getMat(Colors3D.wheatGold, 0.8, 0.0);
        const ripeMat = getMat(Colors3D.wheatRipe, 0.8, 0.0);

        for (let i = 0; i < rowCount; i++) {
            const rx = -width / 2 + 0.6 + i * 0.95;
            // Baris gandum memanjang
            const rowGeo = new THREE.BoxGeometry(0.55, 0.45, length - 0.8);
            const rowMesh = new THREE.Mesh(rowGeo, i % 2 === 0 ? wheatMat : ripeMat);
            rowMesh.position.set(rx, 0.35, 0);
            rowMesh.castShadow = true;
            rowMesh.receiveShadow = true;
            root.add(rowMesh);
        }

        return root;
    }

    // ==========================================
    // 6. GULUNGAN JERAMI (HAY BALES)
    // Silinder jerami emas terikat tali
    // ==========================================
    static createHayBale(isRound = true) {
        const root = new THREE.Group();
        const hayMat = getMat(Colors3D.hayBale, 0.85, 0.0);
        const strapMat = getMat(Colors3D.hayStrap, 0.7, 0.1);

        if (isRound) {
            // Gulungan Jerami Bulat Besar (Round Bale)
            const geo = new THREE.CylinderGeometry(0.65, 0.65, 1.1, 16);
            const bale = new THREE.Mesh(geo, hayMat);
            bale.rotation.z = Math.PI / 2;
            bale.position.y = 0.65;
            bale.castShadow = true;

            // 2 Tali Pengikat Jerami
            const strapGeo = new THREE.CylinderGeometry(0.66, 0.66, 0.06, 16);
            const s1 = new THREE.Mesh(strapGeo, strapMat); s1.rotation.z = Math.PI / 2; s1.position.set(-0.28, 0.65, 0);
            const s2 = new THREE.Mesh(strapGeo, strapMat); s2.rotation.z = Math.PI / 2; s2.position.set(0.28, 0.65, 0);

            root.add(bale, s1, s2);
        } else {
            // Balok Jerami Kotak (Square Bale)
            const geo = new THREE.BoxGeometry(1.0, 0.55, 0.6);
            const bale = new THREE.Mesh(geo, hayMat);
            bale.position.y = 0.28;
            bale.castShadow = true;
            root.add(bale);
        }

        return root;
    }

    // ==========================================
    // 7. BAK AIR & PAKAN TERNAK (WATER TROUGH)
    // ==========================================
    static createWaterTrough() {
        const root = new THREE.Group();

        // Palung Kayu
        const troughGeo = new THREE.BoxGeometry(1.6, 0.5, 0.7);
        const trough = new THREE.Mesh(troughGeo, getMat(0x6D4C41));
        trough.position.y = 0.25;
        trough.castShadow = true;

        // Permukaan Air Berkilau
        const waterGeo = new THREE.PlaneGeometry(1.4, 0.5);
        const waterMat = new THREE.MeshStandardMaterial({
            color: Colors3D.waterBlue,
            roughness: 0.1,
            metalness: 0.8,
            transparent: true,
            opacity: 0.85
        });
        const water = new THREE.Mesh(waterGeo, waterMat);
        water.rotation.x = -Math.PI / 2;
        water.position.y = 0.45;

        root.add(trough, water);
        return root;
    }

    // ==========================================
    // 8. PAGAR KAYU RETRO LAPUK & KASAR (WEATHERED TIMBER SPLIT-RAIL FENCE)
    // Sesuai gaya RTS 90-an di foto referensi: kayu kasar, lapuk, tidak rata
    // ==========================================
    static createWhiteFence(length = 3.0) {
        return ModelBuilder3D.createRusticFence(length);
    }

    static createRusticFence(length = 3.0) {
        const root = new THREE.Group();
        root.name = "rusticFence";
        const woodMat = getTexturedMat("weatheredBarnWood", Colors3D.weatheredWood, 0.88, 0.04, { rx: 1, ry: 2 });
        const postMat = getMat(0x423020, 0.9, 0.02);

        // Jumlah tiang berdasarkan panjang pagar (tiang setiap ~2.2 - 2.5m)
        const postStep = 2.4;
        const numSegments = Math.max(1, Math.round(length / postStep));
        const actualStep = length / numSegments;

        for (let i = 0; i <= numSegments; i++) {
            const px = -length / 2 + i * actualStep;
            // Tiang kayu kasar bulat dengan sedikit variasi tinggi & sudut
            const postHeight = 1.05 + ((i * 17) % 7) * 0.025;
            const postGeo = new THREE.CylinderGeometry(0.08, 0.09, postHeight, 7);
            const post = new THREE.Mesh(postGeo, postMat);
            post.position.set(px, postHeight / 2, 0);
            post.rotation.z = (((i * 13) % 5) - 2) * 0.015;
            post.rotation.x = (((i * 7) % 5) - 2) * 0.012;
            post.castShadow = true;
            post.receiveShadow = true;
            root.add(post);
        }

        // 3 Bilah Palang Kayu Gelondongan Horisontal (Split Rails) yang tumpang tindih
        for (let seg = 0; seg < numSegments; seg++) {
            const segX = -length / 2 + (seg + 0.5) * actualStep;
            const railLen = actualStep + 0.22; // Overlap melewati tiang
            
            [0.32, 0.62, 0.9].forEach((ry, rIdx) => {
                const railGeo = new THREE.CylinderGeometry(0.048, 0.052, railLen, 6);
                const rail = new THREE.Mesh(railGeo, woodMat);
                rail.rotation.z = Math.PI / 2;
                rail.position.set(segX, ry + ((rIdx + seg) % 3) * 0.02, (rIdx % 2 === 0 ? 0.06 : -0.06));
                rail.castShadow = true;
                rail.receiveShadow = true;
                root.add(rail);
            });
        }

        return root;
    }

    // ==========================================
    // 9. POHON RIMBUN & SEMAK ALAMI
    // Rimbun berundak dengan dedaunan teduh
    // ==========================================
    static createRealisticTree(variant = 1) {
        const root = new THREE.Group();

        // Batang Pohon Bertekstur
        const trunkGeo = new THREE.CylinderGeometry(0.24, 0.35, 1.8, 8);
        const trunk = new THREE.Mesh(trunkGeo, getMat(0x4E342E));
        trunk.position.y = 0.9;
        trunk.castShadow = true;
        root.add(trunk);

        // Daun Rimbun Berundak (Multi-Cluster Canopy)
        const leafMat1 = getMat(0x388E3C, 0.85);
        const leafMat2 = getMat(0x4CAF50, 0.85);
        const leafMat3 = getMat(0x2E7D32, 0.85);

        if (variant === 1) {
            // Pohon Bulat Besar Berdaun Rimbun
            const c1 = new THREE.Mesh(new THREE.DodecahedronGeometry(1.4, 1), leafMat3);
            c1.position.set(0, 2.4, 0); c1.castShadow = true;
            const c2 = new THREE.Mesh(new THREE.DodecahedronGeometry(1.1, 1), leafMat2);
            c2.position.set(0.35, 3.2, 0.2); c2.castShadow = true;
            const c3 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.9, 1), leafMat1);
            c3.position.set(-0.35, 2.7, -0.3); c3.castShadow = true;
            root.add(c1, c2, c3);
        } else {
            // Pohon Cemara / Pinus Pedesaan
            [1.5, 1.2, 0.85, 0.5].forEach((rad, i) => {
                const cone = new THREE.Mesh(new THREE.ConeGeometry(rad, 1.3, 7), leafMat3);
                cone.position.y = 1.8 + i * 0.8;
                cone.castShadow = true;
                root.add(cone);
            });
        }

        return root;
    }

    // ==========================================
    // 10. ANJING PENJAGA PETERNAKAN (FARM DOG)
    // ==========================================
    static createFarmDog() {
        const root = new THREE.Group();
        root.name = "realisticFarmDog";

        const furGolden = getMat(0xA16237, 0.75, 0.0);
        const furTan = getMat(0xC58F58, 0.8, 0.0);
        const furDark = getMat(0x4E2A12, 0.8, 0.0);
        const noseBlack = getMat(0x1A1A1A, 0.3, 0.2);

        // Badan Organik Berotot (Muscular Dog Torso)
        const torsoGroup = new THREE.Group();
        torsoGroup.position.set(0, 0.52, 0);

        const bodyMesh = new THREE.Mesh(new THREE.SphereGeometry(0.32, 14, 12), furGolden);
        bodyMesh.scale.set(0.85, 0.95, 1.45);
        bodyMesh.castShadow = true;
        torsoGroup.add(bodyMesh);

        // Dada Depan (Chest)
        const chest = new THREE.Mesh(new THREE.SphereGeometry(0.26, 12, 10), furTan);
        chest.scale.set(0.8, 1.1, 0.9);
        chest.position.set(0, 0.04, 0.28);
        chest.castShadow = true;
        torsoGroup.add(chest);

        // Leher & Kepala
        const headGroup = new THREE.Group();
        headGroup.position.set(0, 0.24, 0.38);

        const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.2, 0.28, 10), furGolden);
        neck.rotation.x = 0.45;
        neck.position.set(0, 0.08, 0.04);
        headGroup.add(neck);

        const skull = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 12), furGolden);
        skull.position.set(0, 0.22, 0.14);
        skull.scale.set(0.95, 1.05, 1.15);
        skull.castShadow = true;
        headGroup.add(skull);

        // Moncong Anjing (Snout & Muzzle)
        const muzzle = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.14, 0.22), furDark);
        muzzle.position.set(0, 0.17, 0.31);
        headGroup.add(muzzle);

        // Hidung Hitam Mengkilap
        const nose = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), noseBlack);
        nose.position.set(0, 0.21, 0.42);
        headGroup.add(nose);

        // Mata
        [-1, 1].forEach(side => {
            const eye = new THREE.Mesh(new THREE.SphereGeometry(0.03, 6, 6), noseBlack);
            eye.position.set(side * 0.1, 0.26, 0.23);
            headGroup.add(eye);
        });

        // Telinga Jatuh Lembut (Floppy Ears)
        [-1, 1].forEach(side => {
            const ear = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.22, 0.12), furDark);
            ear.rotation.set(0.15, 0, side * 0.25);
            ear.position.set(side * 0.18, 0.25, 0.1);
            ear.castShadow = true;
            headGroup.add(ear);
        });

        torsoGroup.add(headGroup);
        root.add(torsoGroup);

        // 4 Kaki Bertapak (Paws)
        const legMat = furGolden;
        const pawPositions = [
            [-0.18, 0.24, 0.32], [0.18, 0.24, 0.32],
            [-0.18, 0.24, -0.32], [0.18, 0.24, -0.32]
        ];
        pawPositions.forEach(([lx, ly, lz]) => {
            const leg = new THREE.Group();
            leg.position.set(lx, ly, lz);
            const shank = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.35, 8), legMat);
            shank.position.y = -0.05;
            shank.castShadow = true;
            const paw = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.08, 0.16), furTan);
            paw.position.set(0, -0.2, 0.04);
            paw.castShadow = true;
            leg.add(shank, paw);
            root.add(leg);
        });

        // Ekor Anjing Melengkung Mengibas Ramah
        const tailGroup = new THREE.Group();
        tailGroup.position.set(0, 0.62, -0.42);
        const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.015, 0.42, 8), furDark);
        tail.rotation.x = -0.75;
        tail.position.set(0, 0.18, -0.12);
        tailGroup.add(tail);
        root.add(tailGroup);

        root.userData = { tailGroup, headGroup };
        return root;
    }

    // ==========================================
    // 10. KARAKTER PEMAIN UTAMA PETANI RETRO 3D (STYLIZED CHIBI FARMER BOY)
    // Sesuai Desain Karakter 6-Pose media_1794441094485_6b3e44ec.jpg:
    // - Topi Jerami Anyam Lebar Khas Petani (Woven Straw Hat)
    // - Wajah Ceria & Ramah dengan Mata Anime Ekspresif & Senyuman Lebar
    // - Syal / Bandana Merah di Leher dengan Simpul Lipat
    // - Kaos Dalam Putih Lengan Pendek Berlipat
    // - Baju Kodok Denim Biru Tua (Overalls) dengan Saku Dada, Gesper Kuningan & Jahitan
    // - Rumpun Helai Jerami Emas di Saku Pinggang
    // - Sarung Tangan Kulit Kerja Cokelat Muda (Tan Work Gloves)
    // - Sepatu Bot Karet Muck Boots Tebal Anti-Lumpur
    // - Alat Gembor Penyiram Tanaman Hijau (Watering Can) di Punggung
    // ==========================================
    // 10. KARAKTER PEMAIN UTAMA 3D (4 VARIAN SESUAI media_1794703405357_9322cde2.jpg)
    // 1. Kakek Petani Bijak (Topi koboi cokelat, janggut putih lebat, kemeja flanel kotak, garpu rumput)
    // 2. Gadis Petani Ceria (Topi jerami bundar pita marun, kemeja flanel merah, sekop kebun)
    // 3. Petani Wanita Mandiri (Rambut bob cokelat rapi, kemeja putih rolled-up, sabuk kulit emas, keranjang panen)
    // 4. Pemuda Petani Bersemangat (Topi jerami, syal merah, kaus putih denim, cangkul & gembor air)
    // ==========================================
    static createPlayerCharacter(charType = "boy") {
        const root = new THREE.Group();
        root.name = `playerCharacter_${charType}`;

        const bodyGroup = new THREE.Group();
        bodyGroup.name = "bodyGroup";
        root.add(bodyGroup);

        // Material Dasar Disesuaikan dengan Karakter Terpilih
        const skinMat = getMat((charType === "grandpa") ? 0xF5D0B0 : (charType === "girl" ? 0xFFE2D0 : 0xF8D4B4), 0.72, 0.0);
        const hairMat = (charType === "grandpa") ? getMat(0xF0F0F0, 0.88, 0.0)
            : (charType === "girl" ? getMat(0x5C3826, 0.82, 0.0)
            : (charType === "woman" ? getMat(0x3B2518, 0.85, 0.0) : getMat(0x1F140E, 0.82, 0.0)));

        // Baju Atas: Kakek (Kemeja Flanel Merah Kotak), Gadis (Baju Merah Cerah), Wanita (Kemeja Putih Rolled-up), Pemuda (Kaus Putih)
        const shirtMat = (charType === "grandpa")
            ? ((typeof getTexturedMat === "function") ? getTexturedMat("flannelPlaid", 0xB71C1C, 0.72, 0.02, { rx: 2, ry: 2 }) : getMat(0xB71C1C, 0.75, 0.02))
            : (charType === "girl" ? getMat(0xD84343, 0.75, 0.02)
            : (charType === "woman" ? getMat(0xFDFEFE, 0.65, 0.0) : getMat(0xF5F7FA, 0.68, 0.0)));

        const denimMat = getTexturedMat("denimFabric", 0x2A5482, 0.78, 0.02, { rx: 2, ry: 2 });
        // Celana: Wanita memakai celana lapangan cokelat tua rapi, lainnya memakai denim
        const pantsMat = (charType === "woman") ? getMat(0x4A2E1B, 0.85, 0.02) : denimMat;

        const leatherGlovesMat = getMat(0xA76735, 0.75, 0.04);
        const bootMat = (charType === "woman") ? getMat(0x3E2723, 0.68, 0.05) : getMat(0x2E1E12, 0.7, 0.05);
        const soleMat = getMat(0x141414, 0.85, 0.0);
        const redScarfMat = getMat(0xD32F2F, 0.65, 0.0);
        const brassMat = getMat(0xD4AF37, 0.35, 0.75);
        const strawMat = getTexturedMat("wovenStraw", 0xE5B860, 0.88, 0.0, { rx: 3, ry: 3 });
        const strawBandMat = (charType === "girl") ? getMat(0x880E4F, 0.75, 0.05) : getMat(0x5A351D, 0.75, 0.05);
        const cowboyHatMat = getTexturedMat("wovenStraw", 0xDEC085, 0.85, 0.0, { rx: 3, ry: 3 });
        const greenCanMat = getMat(0x2E6830, 0.45, 0.08);
        const brassRoseMat = getMat(0xC5A059, 0.35, 0.65);
        const wheatMat = getMat(0xF0C365, 0.85, 0.0);

        // ==========================================
        // 1. KAKI & SEPATU BOT KARET TEBAL (LEGS & MUCK BOOTS)
        // ==========================================
        const buildLeg = (isLeft) => {
            const leg = new THREE.Group();
            const sign = isLeft ? -1 : 1;
            leg.position.set(sign * 0.22, 0.62, 0);

            // Celana Kodok Denim / Celana Lapangan Cokelat Wanita
            const pantP1 = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.19, 0.38, 12), pantsMat);
            pantP1.position.y = -0.19;
            pantP1.castShadow = true;
            pantP1.receiveShadow = true;

            // Lipatan Ujung Celana
            const pantCuff = new THREE.Mesh(new THREE.CylinderGeometry(0.205, 0.205, 0.07, 12), (charType === "woman") ? getMat(0x3B2213) : getMat(0x3B6899));
            pantCuff.position.y = -0.37;
            pantCuff.castShadow = true;

            // Batang Sepatu Bot Karet (Boot Shaft)
            const bootShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.18, 0.18, 12), bootMat);
            bootShaft.position.y = -0.46;
            bootShaft.castShadow = true;

            // Kaki Bawah Sepatu Bot (Boot Foot)
            const bootFoot = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.18, 0.44), bootMat);
            bootFoot.position.set(0, -0.55, 0.06);
            bootFoot.castShadow = true;

            // Ujung Jari Membulat (Boot Toe)
            const bootToe = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.17, 12, 1, false, 0, Math.PI), bootMat);
            bootToe.rotation.x = Math.PI / 2;
            bootToe.position.set(0, -0.55, 0.24);
            bootToe.castShadow = true;

            // Sol Karet Hitam Tebal & Hak (Heavy Traction Sole)
            const sole = new THREE.Mesh(new THREE.BoxGeometry(0.39, 0.07, 0.48), soleMat);
            sole.position.set(0, -0.63, 0.06);
            sole.castShadow = true;

            const heel = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.06, 0.18), soleMat);
            heel.position.set(0, -0.64, -0.08);

            leg.add(pantP1, pantCuff, bootShaft, bootFoot, bootToe, sole, heel);
            return leg;
        };

        const leftLeg = buildLeg(true);
        const rightLeg = buildLeg(false);
        bodyGroup.add(leftLeg, rightLeg);

        // ==========================================
        // 2. BADAN & BAJU KODOK DENIM (TORSO & OVERALLS)
        // ==========================================
        const torsoGroup = new THREE.Group();
        torsoGroup.position.set(0, 0.94, 0);

        // Kaus Dalam / Kemeja
        const shirtTorso = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.38, 0.62, 16), shirtMat);
        shirtTorso.position.y = 0.02;
        shirtTorso.castShadow = true;
        torsoGroup.add(shirtTorso);

        // Celana Kodok Denim (Bagian Pinggul & Perut)
        const denimBtm = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.39, 0.36, 16), (charType === "woman") ? pantsMat : denimMat);
        denimBtm.position.y = -0.12;
        denimBtm.castShadow = true;
        torsoGroup.add(denimBtm);

        if (charType === "woman") {
            // Ikat Pinggang Kulit Cokelat & Gesper Emas Mewah Petani Wanita
            const beltMat = getMat(0x3B2010, 0.8, 0.05);
            const belt = new THREE.Mesh(new THREE.CylinderGeometry(0.39, 0.40, 0.09, 16), beltMat);
            belt.position.y = -0.02;
            const goldBuckle = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 0.05), brassMat);
            goldBuckle.position.set(0, -0.02, 0.40);
            torsoGroup.add(belt, goldBuckle);
        } else {
            // Bagian Dada Overalls (Front Bib Plate)
            const bibPlate = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.36, 0.08), denimMat);
            bibPlate.position.set(0, 0.08, 0.34);
            bibPlate.castShadow = true;

            // Saku Depan Dada Overalls dengan Garis Jahitan Kuning (Front Pocket)
            const frontPocket = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.18, 0.04), getMat(0x325E8C));
            frontPocket.position.set(0, 0.06, 0.39);
            frontPocket.castShadow = true;

            // Kancing Kuningan di Saku Dada
            const pocketBtn = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.02, 8), brassMat);
            pocketBtn.rotation.x = Math.PI / 2;
            pocketBtn.position.set(0, 0.12, 0.42);

            // Tali Selempang Pundak Kiri & Kanan (Suspender Straps)
            const strapL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.54, 0.04), denimMat);
            strapL.position.set(-0.16, 0.16, 0.34); strapL.rotation.y = 0.08;
            const strapR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.54, 0.04), denimMat);
            strapR.position.set(0.16, 0.16, 0.34); strapR.rotation.y = -0.08;

            // Gesper Kuningan Pengait Tali Selempang (Brass Buckles)
            const buckleL = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.06, 0.05), brassMat);
            buckleL.position.set(-0.16, 0.22, 0.37);
            const buckleR = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.06, 0.05), brassMat);
            buckleR.position.set(0.16, 0.22, 0.37);

            // Tali Selempang Belakang (Back Cross Straps)
            const bStrapL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.52, 0.04), denimMat);
            bStrapL.position.set(-0.16, 0.14, -0.34);
            const bStrapR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.52, 0.04), denimMat);
            bStrapR.position.set(0.16, 0.14, -0.34);

            torsoGroup.add(bibPlate, frontPocket, pocketBtn, strapL, strapR, buckleL, buckleR, bStrapL, bStrapR);
        }

        // Aksesori Ikonik: Helai Bulir Gandum/Jerami Emas yang Menyembul dari Saku Pinggang
        const wheatSprig = new THREE.Group();
        if (charType === "boy") {
            wheatSprig.name = "wheatSprig";
            wheatSprig.position.set(0.38, -0.06, 0.12);
            wheatSprig.rotation.z = -0.35;
            wheatSprig.rotation.y = 0.2;

            const stalk1 = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.32, 6), wheatMat);
            stalk1.position.set(0, 0.14, 0); stalk1.rotation.z = 0.2;
            const ear1 = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.14, 6), wheatMat);
            ear1.position.set(0.04, 0.28, 0); ear1.rotation.z = 0.2;

            const stalk2 = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.28, 6), wheatMat);
            stalk2.position.set(-0.03, 0.12, 0.02); stalk2.rotation.z = -0.15;
            const ear2 = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.12, 6), wheatMat);
            ear2.position.set(-0.05, 0.24, 0.02); ear2.rotation.z = -0.15;

            wheatSprig.add(stalk1, ear1, stalk2, ear2);
            torsoGroup.add(wheatSprig);
        }

        // ==========================================
        // 3. SYAL MERAH LEHER DENGAN SIMPUL IKONIK (RED BANDANA SCARF)
        // ==========================================
        const neckGroup = new THREE.Group();
        if (charType === "boy" || charType === "girl" || charType === "grandpa") {
            neckGroup.position.set(0, 0.36, 0);

            // Lingkaran Kain Syal di Leher
            const scarfRing = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.055, 8, 16), redScarfMat);
            scarfRing.rotation.x = Math.PI / 2;
            scarfRing.castShadow = true;

            // Simpul Tengah di Dada
            const knot = new THREE.Mesh(new THREE.SphereGeometry(0.065, 8, 8), redScarfMat);
            knot.position.set(0, -0.02, 0.25);
            knot.scale.set(1.2, 0.9, 0.8);

            // Dua Ekor Lipatan Kain Syal Menggelantung di Dada
            const tail1 = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.18, 5), redScarfMat);
            tail1.rotation.z = 0.3;
            tail1.position.set(0.05, -0.12, 0.27);
            tail1.scale.set(1, 1, 0.4);

            const tail2 = new THREE.Mesh(new THREE.ConeGeometry(0.065, 0.2, 5), redScarfMat);
            tail2.rotation.z = -0.25;
            tail2.position.set(-0.04, -0.13, 0.27);
            tail2.scale.set(1, 1, 0.4);

            neckGroup.add(scarfRing, knot, tail1, tail2);
            torsoGroup.add(neckGroup);
        }

        // ==========================================
        // 4. LENGAN & SARUNG TANGAN KERJA KULIT (ARMS & WORK GLOVES)
        // ==========================================
        const buildArm = (isLeft) => {
            const arm = new THREE.Group();
            const sign = isLeft ? -1 : 1;
            arm.position.set(sign * 0.48, 0.28, 0);

            // Lengan Kaus Putih Berlipat (Rolled-up T-Shirt Sleeve)
            const sleeve = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.16, 0.22, 12), shirtMat);
            sleeve.position.y = -0.11;
            sleeve.castShadow = true;

            const sleeveCuff = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.03, 8, 16), shirtMat);
            sleeveCuff.rotation.x = Math.PI / 2;
            sleeveCuff.position.y = -0.2;

            // Lengan Bawah Kulit (Peachy Forearm)
            const forearm = new THREE.Group();
            forearm.position.set(0, -0.22, 0);

            const armSkin = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.12, 0.18, 12), skinMat);
            armSkin.position.y = -0.09;
            armSkin.castShadow = true;

            // Sarung Tangan Kulit Kerja (Leather Work Glove)
            const gloveCuff = new THREE.Mesh(new THREE.CylinderGeometry(0.135, 0.125, 0.08, 12), leatherGlovesMat);
            gloveCuff.position.y = -0.18;

            const handGlove = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.22, 0.18), leatherGlovesMat);
            handGlove.position.set(0, -0.3, 0.02);
            handGlove.castShadow = true;

            // Ibu Jari Sarung Tangan (Thumb)
            const thumb = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.11, 0.08), leatherGlovesMat);
            thumb.position.set(-sign * 0.09, -0.26, 0.06);
            thumb.rotation.y = sign * 0.3;

            forearm.add(armSkin, gloveCuff, handGlove, thumb);
            arm.add(sleeve, sleeveCuff, forearm);

            arm.userData.forearm = forearm;
            return arm;
        };

        const leftArm = buildArm(true);
        const rightArm = buildArm(false);
        torsoGroup.add(leftArm, rightArm);

        // ==========================================
        // 5. GEMBOR PENYIRAM TANAMAN (Hanya untuk Pemuda Bersemangat sesuai foto referensi)
        // ==========================================
        const canGroup = new THREE.Group();
        if (charType === "boy") {
            canGroup.name = "wateringCan";
            canGroup.position.set(0.14, 0.12, -0.36);
            canGroup.rotation.set(-0.12, 0.25, 0.32);

            // Tabung Badan Gembor Metal Hijau
            const canBody = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.18, 0.42, 12), greenCanMat);
            canBody.castShadow = true;

            // Corong Panjang Air (Spout) Mengarah ke Bahu
            const canSpout = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.055, 0.42, 8), greenCanMat);
            canSpout.rotation.z = -0.75;
            canSpout.position.set(0.22, 0.16, 0);
            canSpout.castShadow = true;

            // Kepala Pancuran Kuningan (Brass Rose Sprinkler)
            const canRose = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.045, 0.08, 12), brassRoseMat);
            canRose.rotation.z = -0.75;
            canRose.position.set(0.36, 0.30, 0);
            canRose.castShadow = true;

            // Gagang Busur Atas Gembor (Top Arch Handle)
            const canHandle = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.024, 8, 16, Math.PI), greenCanMat);
            canHandle.position.set(-0.06, 0.16, 0);

            // Gagang Samping Belakang
            const canSideHandle = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.02, 8, 14, Math.PI * 0.8), greenCanMat);
            canSideHandle.position.set(-0.16, -0.04, 0);
            canSideHandle.rotation.z = Math.PI / 2;

            canGroup.add(canBody, canSpout, canRose, canHandle, canSideHandle);
            torsoGroup.add(canGroup);

            // Tali Pengikat Kulit di Pundak untuk Menggendong Gembor
            const strapMat = getMat(0x4E342E, 0.8, 0.02);
            const shoulderStrapL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.48, 0.03), strapMat);
            shoulderStrapL.position.set(-0.18, 0.16, -0.22); shoulderStrapL.rotation.y = 0.15;
            const shoulderStrapR = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.48, 0.03), strapMat);
            shoulderStrapR.position.set(0.18, 0.16, -0.22); shoulderStrapR.rotation.y = -0.15;
            torsoGroup.add(shoulderStrapL, shoulderStrapR);
        }

        // Kantong Ransel Hasil Panen / Telur (Kompatibilitas Kapasitas Tas)
        const bagMesh = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.32, 0.16), getMat(0x6D4C41));
        bagMesh.name = "bagMesh";
        bagMesh.position.set(-0.16, -0.08, -0.32);
        bagMesh.castShadow = true;
        torsoGroup.add(bagMesh);

        // ==========================================
        // 6. KEPALA, RAMBUT HITAM ALAMI & WAJAH EKSPRESIF (HEAD & FACE)
        // ==========================================
        const headGroup = new THREE.Group();
        headGroup.name = "headGroup";
        headGroup.position.set(0, 0.58, 0);

        // Kepala Membulat Halus Bergaya Chibi Anime Retro
        const headMesh = new THREE.Mesh(new THREE.SphereGeometry(0.36, 16, 14), skinMat);
        headMesh.scale.set(1.0, 1.05, 1.02);
        headMesh.castShadow = true;

        // Panel Wajah Bertekstur Kanvas Resolusi Tinggi (Mata Berbinar, Alis, Rona Pipi & Senyum Sesuai Karakter)
        let faceMat = skinMat;
        if (typeof window !== "undefined" && window.FarmTextures && window.FarmTextures.getFarmerFace) {
            faceMat = new THREE.MeshBasicMaterial({
                map: window.FarmTextures.getFarmerFace(charType),
                transparent: false
            });
        }
        const facePlane = new THREE.Mesh(new THREE.PlaneGeometry(0.56, 0.56), faceMat);
        facePlane.position.set(0, -0.01, 0.37);
        facePlane.rotation.x = -0.05;

        // Rambut Alami Bertekstur Sesuai Karakter
        const hairGroup = new THREE.Group();
        // Mahkota Rambut Belakang & Samping (Hanya menutup separuh belakang agar tidak tembus)
        const hairBack = new THREE.Mesh(new THREE.SphereGeometry(0.38, 14, 12, 0, Math.PI * 2, 0, Math.PI * 0.52), hairMat);
        hairBack.position.set(0, 0.04, -0.02);
        hairBack.castShadow = true;
        hairGroup.add(hairBack);

        if (charType === "grandpa") {
            // Janggut Dagu Putih Lebat Kakek Petani
            const beardM = new THREE.Mesh(new THREE.SphereGeometry(0.24, 10, 8), hairMat);
            beardM.position.set(0, -0.22, 0.26);
            beardM.scale.set(1.2, 0.85, 0.9);
            headGroup.add(beardM);
        } else if (charType === "girl") {
            // Kuncir Poni Manis Gadis Petani
            const bangL = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.22, 5), hairMat);
            bangL.position.set(-0.16, 0.16, 0.33); bangL.rotation.z = -0.3;
            const bangR = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.22, 5), hairMat);
            bangR.position.set(0.16, 0.16, 0.33); bangR.rotation.z = 0.3;
            hairGroup.add(bangL, bangR);
        } else {
            // Poni Pemuda / Rambut Bob Wanita
            const bang1 = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.22, 5), hairMat);
            bang1.position.set(-0.16, 0.16, 0.33); bang1.rotation.z = -0.35;
            const bang2 = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.25, 5), hairMat);
            bang2.position.set(-0.04, 0.18, 0.34); bang2.rotation.z = -0.15;
            const bang3 = new THREE.Mesh(new THREE.ConeGeometry(0.10, 0.24, 5), hairMat);
            bang3.position.set(0.12, 0.17, 0.33); bang3.rotation.z = 0.3;
            hairGroup.add(bang1, bang2, bang3);
        }

        headGroup.add(headMesh, facePlane, hairGroup);

        // ==========================================
        // 7. TOPI KHAS MASING-MASING KARAKTER
        // ==========================================
        let headwear = null;
        if (charType === "grandpa") {
            // Topi Koboi Cokelat Kakek Petani Bijak
            headwear = new THREE.Group();
            headwear.position.set(0, 0.28, 0.02);
            headwear.rotation.x = -0.06;
            const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.75, 0.05, 24), cowboyHatMat);
            brim.scale.set(0.85, 1, 1.25); brim.castShadow = true;
            const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.40, 0.38, 16), cowboyHatMat);
            crown.position.y = 0.20; crown.castShadow = true;
            headwear.add(brim, crown);
            headGroup.add(headwear);
        } else if (charType === "girl") {
            // Topi Jerami Bundar Cantik dengan Pita Marun Gadis Petani
            headwear = new THREE.Group();
            headwear.position.set(0, 0.28, 0.02);
            headwear.rotation.x = -0.08;
            const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.70, 0.035, 24), strawMat);
            brim.castShadow = true;
            const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.38, 0.26, 18), strawMat);
            crown.position.y = 0.14; crown.castShadow = true;
            const ribbon = new THREE.Mesh(new THREE.CylinderGeometry(0.385, 0.385, 0.07, 18), strawBandMat);
            ribbon.position.y = 0.05;
            headwear.add(brim, crown, ribbon);
            headGroup.add(headwear);
        } else if (charType === "boy") {
            // Topi Jerami Anyam Lebar Khas Petani Pemuda
            headwear = new THREE.Group();
            headwear.position.set(0, 0.28, 0.02);
            headwear.rotation.x = -0.08;
            const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.74, 0.04, 28), strawMat);
            brim.castShadow = true;
            const fringeRing = new THREE.Mesh(new THREE.TorusGeometry(0.73, 0.022, 8, 28), getMat(0xD49D42));
            fringeRing.rotation.x = Math.PI / 2;
            const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.42, 0.34, 20), strawMat);
            crown.position.y = 0.17; crown.castShadow = true;
            const hatBand = new THREE.Mesh(new THREE.CylinderGeometry(0.425, 0.425, 0.08, 20), getMat(0x5A351D));
            hatBand.position.y = 0.06;
            headwear.add(brim, fringeRing, crown, hatBand);
            headGroup.add(headwear);
        }
        // Petani Wanita Mandiri tanpa topi agar rambut bob rapinya tampak jelas

        // ==========================================
        // 8. ALAT/SENJATA DI TANGAN KANAN MASING-MASING KARAKTER
        // ==========================================
        const handToolGroup = new THREE.Group();
        handToolGroup.name = "handTool";
        if (charType === "grandpa") {
            // Garpu Rumput (Pitchfork) Kayu & Logam Perak
            const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.8, 8), getMat(0x5D4037));
            shaft.position.set(0.12, -0.4, 0.32);
            shaft.rotation.x = 0.35;
            // 3 Mata Garpu Perak Mengkilap
            const forkBase = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.03, 0.03), getMat(0xCFD8DC, 0.2, 0.8));
            forkBase.position.set(0.12, 0.45, 0.62);
            forkBase.rotation.x = 0.35;
            [-0.08, 0, 0.08].forEach(tx => {
                const tine = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.008, 0.32, 6), getMat(0xCFD8DC, 0.2, 0.8));
                tine.position.set(0.12 + tx, 0.60, 0.68);
                tine.rotation.x = 0.35;
                handToolGroup.add(tine);
            });
            handToolGroup.add(shaft, forkBase);
        } else if (charType === "girl") {
            // Sekop Kebun (Garden Spade / Shovel)
            const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 1.4, 8), getMat(0x6D4C41));
            handle.position.set(0.10, -0.3, 0.28);
            handle.rotation.x = 0.3;
            const spade = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.28, 0.02), getMat(0xB0BEC5, 0.3, 0.7));
            spade.position.set(0.10, -0.85, 0.12);
            spade.rotation.x = 0.3;
            handToolGroup.add(handle, spade);
        } else if (charType === "woman") {
            // Keranjang Panen Anyaman Berisi Telur & Sayur Segar
            const basket = new THREE.Mesh(new THREE.CylinderGeometry(0.20, 0.15, 0.24, 12), strawMat);
            basket.position.set(0.12, -0.45, 0.25);
            basket.castShadow = true;
            // Isi telur dalam keranjang
            const eggMat = getMat(0xFFFAF0, 0.6);
            for (let e = 0; e < 4; e++) {
                const egg = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), eggMat);
                egg.position.set(0.12 + (Math.random() * 0.14 - 0.07), -0.34, 0.25 + (Math.random() * 0.14 - 0.07));
                handToolGroup.add(egg);
            }
            handToolGroup.add(basket);
        } else {
            // Cangkul Petani (Farming Hoe) Pemuda
            const hoeHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.6, 8), getMat(0x5D4037));
            hoeHandle.position.set(0.12, -0.35, 0.3);
            hoeHandle.rotation.x = 0.35;
            const hoeBlade = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.16, 0.02), getMat(0x78909C, 0.3, 0.7));
            hoeBlade.position.set(0.12, 0.45, 0.6);
            hoeBlade.rotation.x = 1.2;
            handToolGroup.add(hoeHandle, hoeBlade);
        }
        rightArm.userData.forearm.add(handToolGroup);

        torsoGroup.add(headGroup);
        bodyGroup.add(torsoGroup);

        // Simpan referensi ke semua bagian untuk animasi gerak & mikro-idle
        root.userData = {
            leftLeg,
            rightLeg,
            leftArm,
            rightArm,
            leftForearm: leftArm.userData.forearm,
            rightForearm: rightArm.userData.forearm,
            torsoGroup,
            headGroup,
            strawHat: headwear,
            wateringCan: null,
            wheatSprig: null,
            bagMesh
        };

        return root;
    }

    // ==========================================
    // 11. HEWAN TERNAK REALISTIS & ORGANIK (PERSIS FOTO ASLI PETERNAKAN)
    // ==========================================

    // ==========================================
    // 11. HEWAN TERNAK REALISTIS & ORGANIK (PERSIS FOTO ASLI PETERNAKAN)
    // Sesuai gambar referensi: Ayam (Cokelat/Merah/Putih), Sapi Holstein & Domba Wol Lebat
    // Ukuran proporsional dengan karakter pemain & pagar kandang
    // ==========================================

    // A. TEMPAT MAKAN KAYU PANJANG (LONG TIMBER FEEDING TROUGH)
    // Berisi tumpukan rumput hijau segar atau jerami kering
    static createFeedingTrough(length = 3.6, width = 0.9, height = 0.65, fillType = "grass") {
        const root = new THREE.Group();
        root.name = "feedingTrough";
        const woodMat = getTexturedMat("weatheredBarnWood", Colors3D.weatheredWood, 0.88, 0.04, { rx: 2, ry: 2 });
        const postMat = getMat(0x3B281B, 0.9, 0.02);

        // 4 Kaki Kayu Balok Sudut
        const legGeo = new THREE.BoxGeometry(0.14, height, 0.14);
        [
            [-length / 2 + 0.1, -width / 2 + 0.1],
            [length / 2 - 0.1, -width / 2 + 0.1],
            [-length / 2 + 0.1, width / 2 - 0.1],
            [length / 2 - 0.1, width / 2 - 0.1]
        ].forEach(([lx, lz]) => {
            const leg = new THREE.Mesh(legGeo, postMat);
            leg.position.set(lx, height / 2, lz);
            leg.castShadow = true;
            leg.receiveShadow = true;
            root.add(leg);
        });

        // Bak Palung Kayu Utama
        const boxGeo = new THREE.BoxGeometry(length, height * 0.65, width);
        const box = new THREE.Mesh(boxGeo, woodMat);
        box.position.y = height * 0.6;
        box.castShadow = true;
        box.receiveShadow = true;
        root.add(box);

        // Bibir Papan Kayu Atas (Top Rim)
        const rimMat = getMat(0x4E342E, 0.85);
        const rimL = new THREE.Mesh(new THREE.BoxGeometry(length + 0.08, 0.08, 0.1), rimMat);
        rimL.position.set(0, height * 0.95, -width / 2);
        const rimR = new THREE.Mesh(new THREE.BoxGeometry(length + 0.08, 0.08, 0.1), rimMat);
        rimR.position.set(0, height * 0.95, width / 2);
        root.add(rimL, rimR);

        // Isi Palung: Rumput Hijau Segar atau Jerami Kering Emas Menggunung
        const isGrass = fillType === "grass";
        const feedMat = isGrass ? getMat(0x558B2F, 0.88) : getMat(Colors3D.thatchGold, 0.9);
        const feedGeo = new THREE.CylinderGeometry(width * 0.42, width * 0.46, length - 0.25, 12);
        const feed = new THREE.Mesh(feedGeo, feedMat);
        feed.rotation.z = Math.PI / 2;
        feed.position.y = height * 0.92;
        feed.castShadow = true;
        feed.receiveShadow = true;
        root.add(feed);

        // Beberapa helai rumput mencuat di atas bibir palung
        const tuftMat = isGrass ? getMat(0x689F38, 0.9) : getMat(0xE6B800, 0.9);
        for (let i = 0; i < 6; i++) {
            const tuft = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.22, 5), tuftMat);
            tuft.position.set(-length / 2 + 0.4 + i * (length / 6.5), height * 1.05, (i % 2 === 0 ? 0.12 : -0.12));
            tuft.rotation.z = (i % 2 === 0 ? 0.25 : -0.25);
            root.add(tuft);
        }

        return root;
    }

    // B. SARANG JERAMI ALAMI DENGAN TELUR (WOVEN STRAW NEST WITH EGGS)
    // Sesuai gambar referensi ayam mengerami telur di sarang
    static createStrawNestWithEggs(eggCount = 5) {
        const root = new THREE.Group();
        root.name = "strawNestWithEggs";
        const thatchMat = getTexturedMat("thatchRoof", Colors3D.thatchGold, 0.92, 0.0, { rx: 3, ry: 3 });
        const strawMat = getMat(Colors3D.thatchGold, 0.9, 0.0);
        const eggMat = getMat(0xFAF4E8, 0.75, 0.0);
        const eggBrownMat = getMat(0xF3DFC3, 0.75, 0.0);

        // Lingkaran Anyaman Jerami Melingkar Tebal (Woven Torus Nest)
        const nestGeo = new THREE.TorusGeometry(0.68, 0.22, 10, 20);
        const nest = new THREE.Mesh(nestGeo, thatchMat);
        nest.rotation.x = Math.PI / 2;
        nest.position.y = 0.18;
        nest.castShadow = true;
        nest.receiveShadow = true;
        root.add(nest);

        // Dasar Jerami Dalam Sarang
        const baseGeo = new THREE.CylinderGeometry(0.58, 0.68, 0.15, 16);
        const base = new THREE.Mesh(baseGeo, strawMat);
        base.position.y = 0.08;
        base.receiveShadow = true;
        root.add(base);

        // Helai Jerami Acak di Sekeliling Sarang
        for (let i = 0; i < 10; i++) {
            const angle = (i / 10) * Math.PI * 2 + 0.2;
            const dist = 0.72 + (i % 2 === 0 ? 0.15 : -0.05);
            const fringe = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.25, 4), strawMat);
            fringe.position.set(Math.cos(angle) * dist, 0.1, Math.sin(angle) * dist);
            fringe.rotation.z = Math.cos(angle) * 0.4;
            fringe.rotation.x = Math.sin(angle) * 0.4;
            root.add(fringe);
        }

        // Tumpukan Telur Ayam Segar Halus Berukuran Nyata (Smooth Farm Eggs)
        const eggGeo = new THREE.SphereGeometry(0.12, 12, 10);
        eggGeo.scale(0.85, 1.25, 0.85);

        const eggPositions = [
            [-0.18, 0.22, -0.1, 0.2, 0.1],
            [0.18, 0.22, -0.08, -0.2, -0.15],
            [-0.05, 0.22, 0.2, 0.1, 0.3],
            [0.15, 0.22, 0.16, -0.15, 0.2],
            [0.0, 0.26, 0.02, 0.0, 0.0]
        ];

        eggPositions.slice(0, eggCount).forEach(([ex, ey, ez, rx, rz], idx) => {
            const egg = new THREE.Mesh(eggGeo, idx % 2 === 0 ? eggMat : eggBrownMat);
            egg.position.set(ex, ey, ez);
            egg.rotation.set(rx, 0, rz);
            egg.castShadow = true;
            egg.receiveShadow = true;
            root.add(egg);
        });

        return root;
    }

    // C. EMBER SUSU KAYU DENGAN ALAS JERAMI (MILK PAIL WITH STRAW)
    // Persis properti di foto referensi sapi
    static createMilkPailWithStraw() {
        const root = new THREE.Group();
        root.name = "milkPail";
        const woodMat = getMat(0x6D4C41, 0.85);
        const metalMat = getMat(0x78909C, 0.4, 0.7);
        const milkMat = getMat(0xFFFFFF, 0.5, 0.1);
        const strawMat = getMat(Colors3D.thatchGold, 0.9);

        // Alas Jerami Emas
        const matMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.65, 0.08, 14), strawMat);
        matMesh.position.y = 0.04;
        matMesh.receiveShadow = true;
        root.add(matMesh);

        // Ember Kayu Berbentuk Kerucut Terpancung
        const bucket = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.26, 0.65, 14), woodMat);
        bucket.position.y = 0.38;
        bucket.castShadow = true;
        root.add(bucket);

        // Sabuk Besi Penguat Ember
        [-0.18, 0.18].forEach(oy => {
            const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.33, 0.33, 0.04, 14), metalMat);
            ring.position.y = 0.38 + oy;
            root.add(ring);
        });

        // Permukaan Susu Putih Penuh Berbusa
        const milk = new THREE.Mesh(new THREE.CylinderGeometry(0.29, 0.29, 0.05, 14), milkMat);
        milk.position.y = 0.66;
        root.add(milk);

        // Gagang Besi Ember
        const handle = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.025, 6, 16, Math.PI), metalMat);
        handle.rotation.z = Math.PI;
        handle.position.set(0, 0.7, 0);
        root.add(handle);

        return root;
    }

    // 1. AYAM 3D REALISTIS SESUAI GAMBAR REFERENSI (media_1794442594422_5a831357.jpg)
    // - Badan bulat bertekstur bulu cokelat-putih berbintik (speckled hen feather)
    // - Jengger merah bergerigi cerah di kepala, pial merah, paruh kerucut kuning
    // - Sarang jerami tebal melingkar (woven straw nest) berisi 4 butir telur ayam krem mengkilap
    // - Ukuran setinggi lutut karakter pemain (tinggi total ~0.50m - 0.52m)
    static createChicken(variant = "brown", showNest = false) {
        const root = new THREE.Group();
        root.name = "realisticChicken";

        const henFeatherMat = (variant === "white")
            ? getMat(0xFBF9F3, 0.86, 0.0)
            : (variant === "red" 
                ? getMat(0xB23818, 0.85, 0.0) 
                : getTexturedMat("speckledHen", 0x8C431F, 0.85, 0.0, { rx: 2, ry: 2 }));
        const breastMat = (variant === "white") ? getMat(0xFFFFFF, 0.88, 0.0) : getMat(0xEFE6D5, 0.88, 0.0);
        const combRed = getMat(0xD32F2F, 0.65, 0.0);
        const beakYellow = getMat(0xF59E0B, 0.45, 0.05);
        const legOrange = getMat(0xDE9B27, 0.6, 0.0);
        const eyeBlack = getMat(0x1A1A1A, 0.2, 0.4);
        const nestStrawMat = getTexturedMat("wovenStraw", Colors3D.wheatGold, 0.9, 0.0, { rx: 2, ry: 2 });
        const eggMat = getMat(0xF7EFE0, 0.35, 0.05);

        // Skala tepat: Setinggi lutut karakter pemain (Tinggi total ~0.50m)
        const scale = 0.62;

        // A. Sarang Jerami Melingkar (Woven Straw Nest) di Bawah Ayam
        const nestGroup = new THREE.Group();
        nestGroup.position.set(0, 0.02, 0);
        nestGroup.visible = !!showNest;

        // Cincin Jerami Tebal Bertekstur
        const nestTorus = new THREE.Mesh(new THREE.TorusGeometry(0.36 * scale, 0.12 * scale, 12, 24), nestStrawMat);
        nestTorus.rotation.x = Math.PI / 2;
        nestTorus.position.y = 0.08 * scale;
        nestTorus.castShadow = true;
        nestTorus.receiveShadow = true;
        nestGroup.add(nestTorus);

        // Alas Cekung Sarang Jerami
        const nestBase = new THREE.Mesh(new THREE.CylinderGeometry(0.34 * scale, 0.38 * scale, 0.08 * scale, 16), nestStrawMat);
        nestBase.position.y = 0.04 * scale;
        nestBase.receiveShadow = true;
        nestGroup.add(nestBase);

        // 4 Butir Telur Ayam Mengkilap di Dalam Sarang
        const eggPositions = [
            { x: -0.12 * scale, z: 0.06 * scale, ry: 0.3, rz: 0.25 },
            { x: 0.11 * scale, z: 0.08 * scale, ry: -0.4, rz: -0.2 },
            { x: 0.02 * scale, z: 0.14 * scale, ry: 1.1, rx: 0.3 },
            { x: -0.04 * scale, z: -0.12 * scale, ry: -0.8, rx: -0.25 }
        ];
        eggPositions.forEach(ep => {
            const eggMesh = new THREE.Mesh(new THREE.SphereGeometry(0.065 * scale, 12, 10), eggMat);
            eggMesh.scale.set(0.85, 1.25, 0.85);
            eggMesh.position.set(ep.x, 0.12 * scale, ep.z);
            eggMesh.rotation.set(ep.rx || 0, ep.ry, ep.rz || 0);
            eggMesh.castShadow = true;
            nestGroup.add(eggMesh);
        });
        root.add(nestGroup);

        // B. Badan Organik Bulat Berbulu Cokelat-Putih (Plump Speckled Hen Torso)
        const torsoGroup = new THREE.Group();
        torsoGroup.position.set(0, 0.22 * scale, 0);

        // Tubuh Utama Bulat Montok
        const bodyGeo = new THREE.SphereGeometry(0.32 * scale, 16, 14);
        bodyGeo.scale(0.94, 1.1, 1.34);
        const body = new THREE.Mesh(bodyGeo, henFeatherMat);
        body.rotation.x = -0.15;
        body.castShadow = true;
        body.receiveShadow = true;
        torsoGroup.add(body);

        // Dada Membusung Berbintik Putih-Krem (Speckled Breast)
        const breastGeo = new THREE.SphereGeometry(0.24 * scale, 14, 12);
        breastGeo.scale(0.9, 1.12, 0.95);
        const breast = new THREE.Mesh(breastGeo, breastMat);
        breast.position.set(0, 0.06 * scale, 0.22 * scale);
        breast.castShadow = true;
        torsoGroup.add(breast);

        // Sepasang Sayap Berbulu Rapat Berlapis (Folded Layered Wings)
        [-1, 1].forEach(side => {
            const wingGeo = new THREE.SphereGeometry(0.25 * scale, 12, 10);
            wingGeo.scale(0.22, 0.88, 1.25);
            const wing = new THREE.Mesh(wingGeo, henFeatherMat);
            wing.position.set(side * 0.28 * scale, 0.06 * scale, 0.02 * scale);
            wing.rotation.set(-0.25, side * 0.08, side * 0.12);
            wing.castShadow = true;
            torsoGroup.add(wing);
        });

        // Ekor Khas Ayam Betina Mencuat ke Atas (Upturned Layered Tail Fan)
        const tailFan = new THREE.Group();
        tailFan.position.set(0, 0.18 * scale, -0.36 * scale);
        tailFan.rotation.x = 0.58;
        const tailMat = getMat(0x3E1C0D, 0.8, 0.0);
        [
            { w: 0.11 * scale, h: 0.38 * scale, d: 0.045 * scale, y: 0.18 * scale, z: 0, rx: 0 },
            { w: 0.10 * scale, h: 0.32 * scale, d: 0.04 * scale, y: 0.14 * scale, z: -0.05 * scale, rx: -0.16 },
            { w: 0.09 * scale, h: 0.26 * scale, d: 0.035 * scale, y: 0.10 * scale, z: -0.09 * scale, rx: -0.30 }
        ].forEach(f => {
            const plume = new THREE.Mesh(new THREE.BoxGeometry(f.w, f.h, f.d), tailMat);
            plume.position.set(0, f.y, f.z);
            plume.rotation.x = f.rx;
            plume.castShadow = true;
            tailFan.add(plume);
        });
        torsoGroup.add(tailFan);

        // C. Leher & Kepala Fleksibel (HeadGroup untuk Animasi Mematuk Tanah)
        const headGroup = new THREE.Group();
        headGroup.position.set(0, 0.22 * scale, 0.32 * scale);

        // Leher Berbulu Naik ke Atas
        const neckGeo = new THREE.CylinderGeometry(0.12 * scale, 0.18 * scale, 0.32 * scale, 12);
        const neck = new THREE.Mesh(neckGeo, henFeatherMat);
        neck.position.set(0, 0.14 * scale, 0.06 * scale);
        neck.rotation.x = 0.38;
        headGroup.add(neck);

        // Kepala Ayam Bulat
        const headMesh = new THREE.Mesh(new THREE.SphereGeometry(0.14 * scale, 14, 12), henFeatherMat);
        headMesh.position.set(0, 0.32 * scale, 0.14 * scale);
        headMesh.scale.set(0.9, 1.05, 1.15);
        headMesh.castShadow = true;
        headGroup.add(headMesh);

        // Jengger Merah Bergerigi Khas (Serrated Red Comb)
        const combGroup = new THREE.Group();
        combGroup.position.set(0, 0.46 * scale, 0.12 * scale);
        [
            { h: 0.12 * scale, z: -0.08 * scale },
            { h: 0.16 * scale, z: -0.02 * scale },
            { h: 0.18 * scale, z: 0.04 * scale },
            { h: 0.14 * scale, z: 0.10 * scale }
        ].forEach(p => {
            const point = new THREE.Mesh(new THREE.BoxGeometry(0.04 * scale, p.h, 0.05 * scale), combRed);
            point.position.set(0, p.h / 2, p.z);
            combGroup.add(point);
        });
        headGroup.add(combGroup);

        // Gelambir / Pial Merah di Bawah Paruh (Red Wattles)
        [-1, 1].forEach(side => {
            const wattle = new THREE.Mesh(new THREE.SphereGeometry(0.05 * scale, 8, 8), combRed);
            wattle.scale.set(0.45, 1.25, 0.8);
            wattle.position.set(side * 0.035 * scale, 0.22 * scale, 0.28 * scale);
            headGroup.add(wattle);
        });

        // Paruh Melengkung Tajam Kuning Emas (Yellow Beak)
        const beakGeo = new THREE.ConeGeometry(0.06 * scale, 0.18 * scale, 8);
        const beak = new THREE.Mesh(beakGeo, beakYellow);
        beak.rotation.x = 1.38;
        beak.position.set(0, 0.31 * scale, 0.31 * scale);
        headGroup.add(beak);

        // Mata Manik Hitam dengan Kilau Putih (Expressive Hen Eyes)
        [-1, 1].forEach(side => {
            const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.026 * scale, 6, 6), eyeBlack);
            pupil.position.set(side * 0.13 * scale, 0.34 * scale, 0.16 * scale);

            const highlight = new THREE.Mesh(new THREE.SphereGeometry(0.01 * scale, 4, 4), getMat(0xFFFFFF));
            highlight.position.set(side * 0.138 * scale, 0.348 * scale, 0.17 * scale);

            headGroup.add(pupil, highlight);
        });

        torsoGroup.add(headGroup);
        root.add(torsoGroup);

        // D. Kaki Ayam & Cakar Ceker Menapak di Sarang/Tanah
        const leftLeg = new THREE.Group();
        leftLeg.position.set(-0.12 * scale, 0.22 * scale, 0);
        const rightLeg = new THREE.Group();
        rightLeg.position.set(0.12 * scale, 0.22 * scale, 0);

        [leftLeg, rightLeg].forEach(leg => {
            const shank = new THREE.Mesh(new THREE.CylinderGeometry(0.025 * scale, 0.02 * scale, 0.22 * scale, 6), legOrange);
            shank.position.y = -0.10 * scale;
            shank.castShadow = true;
            leg.add(shank);

            const footGroup = new THREE.Group();
            footGroup.position.set(0, -0.20 * scale, 0);
            [-0.34, 0, 0.34].forEach(angle => {
                const toe = new THREE.Mesh(new THREE.CylinderGeometry(0.016 * scale, 0.01 * scale, 0.14 * scale, 4), legOrange);
                toe.rotation.x = Math.PI / 2;
                toe.rotation.y = angle;
                toe.position.set(Math.sin(angle) * 0.07 * scale, 0.01, Math.cos(angle) * 0.07 * scale);
                toe.castShadow = true;
                footGroup.add(toe);
            });
            leg.add(footGroup);
            root.add(leg);
        });

        root.userData = { headGroup, leftLeg, rightLeg, nestGroup, type: "chicken", variant };
        return root;
    }

    // 2. SAPI PERAH HOLSTEIN 3D REALISTIS SESUAI GAMBAR REFERENSI (media_1794442594422_5a831357.jpg)
    // - Sapi perah belang hitam-putih dengan proporsi tubuh padat
    // - Kepala bertanduk kecil, moncong merah muda, dan ambing susu berputing
    // - Ember susu kayu berisi susu putih segar di atas tumpukan jerami
    // - Ukuran LEBIH BESAR dari karakter pemain (panjang ~2.75m, tinggi bahu ~1.65m)
    static createCow() {
        const root = new THREE.Group();
        root.name = "realisticCow";

        const hideMat = getTexturedMat("holsteinHide", 0xFAF8F5, 0.8, 0.0, { rx: 2, ry: 1 });
        const coatWhite = getMat(0xFBFBFA, 0.8, 0.0);
        const coatBlack = getMat(0x1A1D20, 0.82, 0.0);
        const muzzlePink = getMat(0xF7B5B5, 0.72, 0.0);
        const udderPink = getMat(0xF4A8A8, 0.8, 0.0);
        const teatPink = getMat(0xDE8686, 0.8, 0.0);
        const hornCream = getMat(0xEAD8B5, 0.5, 0.1);
        const hornTip = getMat(0x3E3832, 0.6, 0.1);
        const hoofDark = getMat(0x1F1F1F, 0.7, 0.1);

        // Skala Sapi diperbesar agar LEBIH BESAR dari karakter pemain (Tinggi bahu ~1.65m, Panjang ~2.75m)
        const scale = 1.38;

        // A. Badan Sapi Silinder Organik & Berotot (Muscular Barrel Torso)
        const torso = new THREE.Group();
        torso.position.set(0, 1.02 * scale, 0);

        // Badan Utama Tekstur Kulit Belang Holstein
        const barrelGeo = new THREE.CylinderGeometry(0.56 * scale, 0.60 * scale, 1.85 * scale, 16);
        const bodyMesh = new THREE.Mesh(barrelGeo, hideMat);
        bodyMesh.rotation.x = Math.PI / 2;
        bodyMesh.castShadow = true;
        bodyMesh.receiveShadow = true;
        torso.add(bodyMesh);

        // Bahu & Dada Depan Bidang (Chest & Shoulders)
        const chest = new THREE.Mesh(new THREE.SphereGeometry(0.52 * scale, 14, 12), hideMat);
        chest.position.set(0, 0.06 * scale, 0.85 * scale);
        chest.castShadow = true;
        torso.add(chest);

        // Pinggul & Panggul Belakang Kokoh (Hindquarters)
        const hips = new THREE.Mesh(new THREE.SphereGeometry(0.54 * scale, 14, 12), hideMat);
        hips.position.set(0, 0.06 * scale, -0.85 * scale);
        hips.castShadow = true;
        torso.add(hips);

        // Corak Belang Hitam 3D Volumetrik Alami Holstein
        const p1 = new THREE.Mesh(new THREE.SphereGeometry(0.44 * scale, 10, 8), coatBlack);
        p1.scale.set(0.65, 0.95, 1.35);
        p1.position.set(-0.38 * scale, 0.18 * scale, 0.12 * scale);
        const p2 = new THREE.Mesh(new THREE.SphereGeometry(0.42 * scale, 10, 8), coatBlack);
        p2.scale.set(0.65, 0.95, 1.2);
        p2.position.set(0.38 * scale, 0.14 * scale, -0.38 * scale);
        const p3 = new THREE.Mesh(new THREE.BoxGeometry(0.75 * scale, 0.22 * scale, 0.85 * scale), coatBlack);
        p3.position.set(0, 0.52 * scale, 0.25 * scale);
        const p4 = new THREE.Mesh(new THREE.SphereGeometry(0.38 * scale, 10, 8), coatBlack);
        p4.position.set(-0.25 * scale, 0.18 * scale, -0.75 * scale);
        torso.add(p1, p2, p3, p4);

        // Ambing Susu Merah Muda Volumetrik di Bawah Perut Belakang (Volumetric Pink Udder)
        const udder = new THREE.Mesh(new THREE.SphereGeometry(0.28 * scale, 12, 10), udderPink);
        udder.scale.set(0.85, 0.78, 1.05);
        udder.position.set(0, -0.42 * scale, -0.48 * scale);
        udder.castShadow = true;
        torso.add(udder);

        // 4 Puting Susu (4 Teats)
        [
            [-0.10, -0.35], [0.10, -0.35],
            [-0.10, -0.58], [0.10, -0.58]
        ].forEach(([tx, tz]) => {
            const teat = new THREE.Mesh(new THREE.CylinderGeometry(0.024 * scale, 0.018 * scale, 0.12 * scale, 6), teatPink);
            teat.position.set(tx * scale, -0.62 * scale, tz * scale);
            torso.add(teat);
        });

        root.add(torso);

        // B. Kepala Sapi Detail dengan Tanduk Kecil & Moncong Pink
        const headGroup = new THREE.Group();
        headGroup.position.set(0, 0.38 * scale, 1.15 * scale);

        // Leher Berotot Kuat Menghubungkan Bahu & Kepala
        const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.32 * scale, 0.44 * scale, 0.65 * scale, 12), hideMat);
        neck.rotation.x = 0.52;
        neck.position.set(0, 0.14 * scale, -0.05 * scale);
        headGroup.add(neck);

        // Tengkorak Kepala Sapi
        const skull = new THREE.Mesh(new THREE.BoxGeometry(0.48 * scale, 0.46 * scale, 0.62 * scale), coatWhite);
        skull.position.set(0, 0.38 * scale, 0.32 * scale);
        skull.castShadow = true;
        headGroup.add(skull);

        // Bercak Hitam di Sekitar Mata
        [-1, 1].forEach(side => {
            const eyePatch = new THREE.Mesh(new THREE.SphereGeometry(0.18 * scale, 8, 8), coatBlack);
            eyePatch.scale.set(0.4, 0.9, 0.9);
            eyePatch.position.set(side * 0.22 * scale, 0.42 * scale, 0.36 * scale);
            headGroup.add(eyePatch);

            const eye = new THREE.Mesh(new THREE.SphereGeometry(0.045 * scale, 6, 6), getMat(0x111111));
            eye.position.set(side * 0.25 * scale, 0.42 * scale, 0.38 * scale);
            headGroup.add(eye);
        });

        // Moncong Halus Merah Muda Lembut (Rosy Pink Muzzle)
        const muzzle = new THREE.Mesh(new THREE.BoxGeometry(0.42 * scale, 0.30 * scale, 0.34 * scale), muzzlePink);
        muzzle.position.set(0, 0.22 * scale, 0.68 * scale);
        muzzle.castShadow = true;
        headGroup.add(muzzle);

        // Lubang Hidung Hitam (Nostrils)
        [-1, 1].forEach(side => {
            const nostril = new THREE.Mesh(new THREE.SphereGeometry(0.035 * scale, 6, 6), coatBlack);
            nostril.scale.set(0.6, 1.0, 0.4);
            nostril.position.set(side * 0.11 * scale, 0.23 * scale, 0.85 * scale);
            headGroup.add(nostril);
        });

        // Tanduk Kecil Melengkung (Small Curved Horns)
        [-1, 1].forEach(side => {
            const hornGroup = new THREE.Group();
            hornGroup.position.set(side * 0.22 * scale, 0.64 * scale, 0.26 * scale);

            const hornBase = new THREE.Mesh(new THREE.ConeGeometry(0.05 * scale, 0.22 * scale, 8), hornCream);
            hornBase.rotation.set(-0.35, 0, side * 0.65);
            hornBase.position.set(side * 0.08 * scale, 0.09 * scale, 0);

            const hornTipMesh = new THREE.Mesh(new THREE.ConeGeometry(0.03 * scale, 0.10 * scale, 8), hornTip);
            hornTipMesh.rotation.set(-0.45, 0, side * 0.75);
            hornTipMesh.position.set(side * 0.15 * scale, 0.18 * scale, 0.02 * scale);

            hornGroup.add(hornBase, hornTipMesh);
            headGroup.add(hornGroup);
        });

        // Telinga Menyamping Lembut (Horizontal Bovine Ears)
        [-1, 1].forEach(side => {
            const ear = new THREE.Mesh(new THREE.SphereGeometry(0.14 * scale, 8, 8), (side === -1 ? coatBlack : coatWhite));
            ear.scale.set(1.4, 0.45, 0.6);
            ear.position.set(side * 0.36 * scale, 0.48 * scale, 0.25 * scale);
            ear.rotation.set(0.1, 0, side * -0.25);
            headGroup.add(ear);
        });

        torso.add(headGroup);

        // C. 4 Kaki Kokoh dengan Kuku Belah Menapak di Tanah (Legs & Cloven Hooves)
        const legFL = new THREE.Group(); legFL.position.set(-0.32 * scale, 0.50 * scale, 0.68 * scale);
        const legFR = new THREE.Group(); legFR.position.set(0.32 * scale, 0.50 * scale, 0.68 * scale);
        const legBL = new THREE.Group(); legBL.position.set(-0.32 * scale, 0.50 * scale, -0.68 * scale);
        const legBR = new THREE.Group(); legBR.position.set(0.32 * scale, 0.50 * scale, -0.68 * scale);

        [legFL, legFR, legBL, legBR].forEach((leg, i) => {
            const isPatch = (i === 1 || i === 2);
            const legColor = isPatch ? coatBlack : coatWhite;

            const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.14 * scale, 0.09 * scale, 0.56 * scale, 8), legColor);
            thigh.position.y = 0.09 * scale;
            thigh.castShadow = true;

            const shank = new THREE.Mesh(new THREE.CylinderGeometry(0.085 * scale, 0.075 * scale, 0.50 * scale, 8), coatWhite);
            shank.position.y = -0.32 * scale;
            shank.castShadow = true;

            const hoof = new THREE.Mesh(new THREE.BoxGeometry(0.15 * scale, 0.11 * scale, 0.18 * scale), hoofDark);
            hoof.position.set(0, -0.56 * scale, 0.02 * scale);
            hoof.castShadow = true;
            hoof.receiveShadow = true;

            leg.add(thigh, shank, hoof);
            root.add(leg);
        });

        // D. Ekor Sapi Fleksibel dengan Rumbai Bulu Hitam (Tail with Brush Tuft)
        const tailGroup = new THREE.Group();
        tailGroup.position.set(0, 1.38 * scale, -0.92 * scale);
        const tailCord = new THREE.Mesh(new THREE.CylinderGeometry(0.028 * scale, 0.022 * scale, 0.72 * scale, 6), coatWhite);
        tailCord.position.y = -0.36 * scale;
        const tailBrush = new THREE.Mesh(new THREE.ConeGeometry(0.075 * scale, 0.26 * scale, 8), coatBlack);
        tailBrush.position.y = -0.78 * scale;
        tailGroup.add(tailCord, tailBrush);
        root.add(tailGroup);

        root.userData = { head: headGroup, tailGroup, legFL, legFR, legBL, legBR, type: "cow" };
        return root;
    }

    // 2B. EMBER SUSU SAPI STATIS PEDESAAN (STATIONARY RUSTIC MILK PAIL)
    // Diletakkan diam di lantai kandang sapi, tidak menempel pada sapi
    static createMilkPail(scale = 1.0) {
        const root = new THREE.Group();
        root.name = "staticMilkPail";

        // Tumpukan Jerami Alas Ember
        const strawBed = new THREE.Mesh(
            new THREE.CylinderGeometry(0.38 * scale, 0.44 * scale, 0.08 * scale, 12),
            getTexturedMat("wovenStraw", Colors3D.wheatGold, 0.9, 0.0)
        );
        strawBed.position.y = 0.04 * scale;
        strawBed.receiveShadow = true;
        root.add(strawBed);

        // Ember Kayu Peternakan
        const pailWood = new THREE.Mesh(
            new THREE.CylinderGeometry(0.24 * scale, 0.20 * scale, 0.42 * scale, 12),
            getMat(0x6D4C41, 0.7, 0.1)
        );
        pailWood.position.y = 0.25 * scale;
        pailWood.castShadow = true;
        pailWood.receiveShadow = true;
        root.add(pailWood);

        // Sabuk Besi Pengikat Ember
        [-0.10, 0.10].forEach(py => {
            const hoop = new THREE.Mesh(
                new THREE.CylinderGeometry(0.245 * scale, 0.245 * scale, 0.03 * scale, 12),
                getMat(0x37474F, 0.4, 0.7)
            );
            hoop.position.y = (0.25 + py) * scale;
            root.add(hoop);
        });

        // Susu Segar Berbusa Putih Mengisi Penuh Ember
        const milkSurface = new THREE.Mesh(
            new THREE.CircleGeometry(0.21 * scale, 12),
            getMat(0xFFFFFF, 0.2, 0.0)
        );
        milkSurface.rotation.x = -Math.PI / 2;
        milkSurface.position.y = 0.43 * scale;
        root.add(milkSurface);

        // Tangkai Pegangan Ember Melengkung (Bail Handle)
        const handleTorus = new THREE.Mesh(
            new THREE.TorusGeometry(0.23 * scale, 0.016 * scale, 6, 16, Math.PI),
            getMat(0x455A64, 0.3, 0.7)
        );
        handleTorus.position.y = 0.45 * scale;
        handleTorus.rotation.z = Math.PI;
        root.add(handleTorus);

        return root;
    }

    // 3. DOMBA BERBULU WOL KERITING TEBAL SESUAI GAMBAR REFERENSI (media_1794442594422_5a831357.jpg)
    // - Tubuh gemuk bertekstur bulu wol putih keriting yang tebal (curly wool fleece)
    // - Wajah dan kaki berwarna hitam-cokelat, serta telinga turun
    // - Mahkota bulu wol putih di dahi di antara telinga
    // - Ukuran setinggi pinggang karakter pemain (tinggi punggung ~0.85m, kepala ~0.95m)
    static createSheep(variant = "white") {
        const root = new THREE.Group();
        root.name = "realisticSheep";

        const woolMat = getTexturedMat("curlyWool", 0xF5F2EB, 0.95, 0.0, { rx: 3, ry: 3 });
        const woolHighlightMat = getMat(0xFFFFFF, 0.95, 0.0);
        const darkSkin = getMat(0x2D2723, 0.85, 0.0); // Wajah & kaki hitam-cokelat gelap
        const hoofMat = getMat(0x1B1917, 0.6, 0.1);

        // Skala tepat: Setinggi pinggang karakter pemain (Tinggi punggung ~0.85m, Kepala ~0.95m)
        const scale = 0.96;

        // A. Badan Berbulu Wol Keriting Tebal Mengembang (Volumetric Curly Wool Torso)
        const torso = new THREE.Group();
        torso.position.set(0, 0.65 * scale, 0);

        // Inti Gumpalan Wol Utama Bulat Montok
        const fleeceGeo = new THREE.SphereGeometry(0.54 * scale, 16, 14);
        fleeceGeo.scale(1.04, 1.14, 1.48);
        const bodyFleece = new THREE.Mesh(fleeceGeo, woolMat);
        bodyFleece.castShadow = true;
        bodyFleece.receiveShadow = true;
        torso.add(bodyFleece);

        // 24 Gumpalan Keriting Wol Volumetrik (Curly Wool Bubbles) Membungkus Tubuh
        const woolClumps = [
            [-0.34, 0.20, 0.35], [0.34, 0.20, 0.35],
            [-0.38, 0.14, -0.05], [0.38, 0.14, -0.05],
            [-0.35, 0.16, -0.45], [0.35, 0.16, -0.45],
            [0, 0.44, 0.25], [0, 0.44, -0.15],
            [0, 0.40, -0.52], [0, -0.22, 0.1],
            [-0.24, 0.36, 0.46], [0.24, 0.36, 0.46],
            [-0.24, 0.34, -0.48], [0.24, 0.34, -0.48],
            [-0.36, -0.10, 0.1], [0.36, -0.10, 0.1],
            [-0.30, 0.08, 0.52], [0.30, 0.08, 0.52],
            [0, 0.28, 0.62], [0, 0.18, -0.68],
            [-0.20, 0.22, -0.64], [0.20, 0.22, -0.64],
            [-0.32, -0.08, -0.32], [0.32, -0.08, -0.32]
        ];

        woolClumps.forEach(([lx, ly, lz], idx) => {
            const rad = (0.24 + (idx % 3) * 0.035) * scale;
            const lump = new THREE.Mesh(new THREE.SphereGeometry(rad, 10, 8), (idx % 4 === 0) ? woolHighlightMat : woolMat);
            lump.position.set(lx * scale, ly * scale, lz * scale);
            lump.castShadow = true;
            lump.receiveShadow = true;
            torso.add(lump);
        });

        root.add(torso);

        // B. Kepala Domba Hitam-Cokelat dengan Telinga Turun (Drooping Ears)
        const headGroup = new THREE.Group();
        headGroup.position.set(0, 0.24 * scale, 0.82 * scale);

        // Leher Masuk ke Wol
        const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.20 * scale, 0.28 * scale, 0.34 * scale, 10), darkSkin);
        neck.rotation.x = 0.45;
        neck.position.set(0, 0.06 * scale, 0.08 * scale);
        headGroup.add(neck);

        // Muka Halus Hitam-Cokelat (Dark Chocolate-Black Face)
        const face = new THREE.Mesh(new THREE.SphereGeometry(0.20 * scale, 12, 10), darkSkin);
        face.scale.set(0.85, 0.95, 1.35);
        face.position.set(0, 0.12 * scale, 0.28 * scale);
        face.castShadow = true;
        headGroup.add(face);

        // Mahkota Bulu Wol Putih Keriting di Dahi (White Wool Cap on Forehead)
        const woolCap = new THREE.Mesh(new THREE.SphereGeometry(0.16 * scale, 10, 8), woolMat);
        woolCap.scale.set(1.1, 0.75, 1.05);
        woolCap.position.set(0, 0.24 * scale, 0.25 * scale);
        woolCap.castShadow = true;
        headGroup.add(woolCap);

        // Telinga Turun Melengkung ke Bawah Samping (Drooping Ears Sesuai Prompt)
        [-1, 1].forEach(side => {
            const ear = new THREE.Mesh(new THREE.SphereGeometry(0.14 * scale, 8, 8), darkSkin);
            ear.scale.set(0.55, 1.25, 0.45);
            ear.position.set(side * 0.22 * scale, 0.10 * scale, 0.20 * scale);
            ear.rotation.set(0.2, 0, side * -0.85);
            ear.castShadow = true;
            headGroup.add(ear);

            // Mata Hitam Lembut
            const eye = new THREE.Mesh(new THREE.SphereGeometry(0.03 * scale, 6, 6), getMat(0x111111));
            eye.position.set(side * 0.15 * scale, 0.14 * scale, 0.36 * scale);
            headGroup.add(eye);
        });

        torso.add(headGroup);

        // C. Empat Kaki Ramping Berwarna Hitam-Cokelat dengan Kuku Belah
        const legMat = darkSkin;
        const createSheepLeg = (x, z) => {
            const leg = new THREE.Group();
            leg.position.set(x * scale, 0.38 * scale, z * scale);

            const shank = new THREE.Mesh(new THREE.CylinderGeometry(0.045 * scale, 0.038 * scale, 0.46 * scale, 8), legMat);
            shank.position.y = -0.15 * scale;
            shank.castShadow = true;
            leg.add(shank);

            const hoof = new THREE.Mesh(new THREE.BoxGeometry(0.08 * scale, 0.08 * scale, 0.11 * scale), hoofMat);
            hoof.position.set(0, -0.38 * scale, 0.02 * scale);
            hoof.castShadow = true;
            leg.add(hoof);

            return leg;
        };

        const legFL = createSheepLeg(-0.25, 0.48);
        const legFR = createSheepLeg(0.25, 0.48);
        const legBL = createSheepLeg(-0.25, -0.48);
        const legBR = createSheepLeg(0.25, -0.48);
        root.add(legFL, legFR, legBL, legBR);

        // D. Ekor Wol Kecil di Belakang (Bobbed Wool Tail)
        const bobTail = new THREE.Mesh(new THREE.SphereGeometry(0.12 * scale, 8, 8), woolMat);
        bobTail.position.set(0, 0.72 * scale, -0.72 * scale);
        root.add(bobTail);

        root.userData = { head: headGroup, legFL, legFR, legBL, legBR, type: "sheep", variant };
        return root;
    }

    // ==========================================
    // 11. TIGA MESIN PABRIK INDUSTRI RETRO (MATERIAL ALAMI, PLATFORM KAYU & TANGGA)
    // Sesuai tampilan mesin di foto referensi media_1794437817067_43d42f06.jpg
    // ==========================================

    // MESIN 1: PENGOLAH TELUR & MAYONES (VINTAGE INDUSTRIAL EGG & CREAM CHURN)
    static createEggProcessor() {
        const root = new THREE.Group();
        root.name = "eggProcessor";

        // A. Platform Panggung Kayu Lapuk Tebal & Anak Tangga Depan (Rustic Timber Deck)
        const platformMat = getTexturedMat("weatheredBarnWood", Colors3D.weatheredWood, 0.88, 0.04, { rx: 3, ry: 3 });
        const platform = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.42, 3.2), platformMat);
        platform.position.y = 0.21;
        platform.castShadow = true;
        platform.receiveShadow = true;
        root.add(platform);

        // Anak Tangga Kayu Depan
        const stepMat = getMat(0x422F22, 0.9, 0.02);
        const step1 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.14, 0.5), stepMat);
        step1.position.set(-0.9, 0.07, 1.8);
        step1.castShadow = true;
        step1.receiveShadow = true;
        const step2 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.26, 0.45), stepMat);
        step2.position.set(-0.9, 0.13, 1.4);
        step2.castShadow = true;
        step2.receiveShadow = true;
        root.add(step1, step2);

        // Meja Kerja Logam Cor & Kayu di Atas Platform
        const baseGeo = new THREE.BoxGeometry(2.4, 0.25, 2.2);
        const base = new THREE.Mesh(baseGeo, getMat(0x3B281B, 0.8, 0.1));
        base.position.y = 0.52;
        base.castShadow = true;
        base.receiveShadow = true;
        root.add(base);

        // Badan Utama Mesin: Besi Cor Kelabu Antik & Pelat Seng Berkarat
        const bodyGeo = new THREE.BoxGeometry(1.8, 1.4, 1.8);
        const body = new THREE.Mesh(bodyGeo, getMat(0x787A74, 0.6, 0.3));
        body.position.set(-0.2, 1.3, 0);
        body.castShadow = true;
        root.add(body);

        // Pelat Besi Penguat Sudut (Cast Iron Bracing)
        const plateGeo = new THREE.BoxGeometry(1.84, 0.15, 1.84);
        const p1 = new THREE.Mesh(plateGeo, getMat(0x23201D, 0.7, 0.3)); p1.position.set(-0.2, 0.68, 0);
        const p2 = new THREE.Mesh(plateGeo, getMat(0x23201D, 0.7, 0.3)); p2.position.set(-0.2, 1.95, 0);
        root.add(p1, p2);

        // Corong Masuk Seng Galvanis (Galvanized Hopper)
        const hopperGeo = new THREE.ConeGeometry(0.7, 0.75, 12, 1, true);
        const hopper = new THREE.Mesh(hopperGeo, getMat(0x546E7A, 0.5, 0.4));
        hopper.rotation.x = Math.PI;
        hopper.position.set(-0.2, 2.35, 0.2);
        hopper.castShadow = true;
        root.add(hopper);

        // Baki Kayu Telur Mentah di Samping Corong
        const tray = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.1, 0.8), getMat(0x5D4037));
        tray.position.set(-0.9, 2.05, 0.2);
        root.add(tray);

        // Telur-telur Alami di Atas Baki
        [-0.2, 0.2].forEach(ox => {
            [-0.2, 0.2].forEach(oz => {
                const egg = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 8), getMat(0xF5F0DD, 0.6));
                egg.scale.set(0.85, 1.25, 0.85);
                egg.position.set(-0.9 + ox, 2.16, 0.2 + oz);
                root.add(egg);
            });
        });

        // Tabung Kaca Pengaduk Mayones Tebal
        const bowlGeo = new THREE.CylinderGeometry(0.52, 0.44, 0.85, 16);
        const bowlMat = new THREE.MeshStandardMaterial({
            color: 0xF5EAB0,
            transparent: true,
            opacity: 0.65,
            roughness: 0.15,
            metalness: 0.1
        });
        const bowl = new THREE.Mesh(bowlGeo, bowlMat);
        bowl.position.set(0.75, 1.3, 0.2);
        root.add(bowl);

        // Pengaduk Whisk Stainless Steel Berputar
        const whiskGroup = new THREE.Group();
        whiskGroup.position.set(0.75, 1.3, 0.2);
        const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.75), getMat(0xB0BEC5, 0.2, 0.8));
        const blade1 = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.55, 0.03), getMat(0xCFD8DC, 0.2, 0.8));
        const blade2 = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.55, 0.4), getMat(0xCFD8DC, 0.2, 0.8));
        whiskGroup.add(shaft, blade1, blade2);
        root.add(whiskGroup);

        // Pipa Tembaga Antik (Copper Piping)
        const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.9, 8), getMat(0xA1887F, 0.3, 0.7));
        pipe.rotation.z = Math.PI / 2;
        pipe.position.set(0.25, 1.65, 0.2);
        root.add(pipe);

        // Cerobong Asap Besi Hitam Cor Tinggi (Stovepipe Chimney)
        const chimney = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 1.2, 8), getMat(0x23201D, 0.8, 0.3));
        chimney.position.set(-0.8, 2.4, -0.6);
        chimney.castShadow = true;
        root.add(chimney);

        // Peti Kayu Hasil Jadi: Toples Mayones Kaca Bertutup Kain Goni & Tali
        const crate = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.25, 0.7), getMat(0x6D4C41, 0.8));
        crate.position.set(0.65, 0.65, 1.0);
        root.add(crate);

        [-0.35, 0, 0.35].forEach((jx) => {
            const jarGroup = new THREE.Group();
            const jar = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.26, 8), getMat(0xF5EAB0, 0.3));
            const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.1, 0.08, 8), getMat(0xBCAAA4, 0.9));
            lid.position.y = 0.15;
            jarGroup.add(jar, lid);
            jarGroup.position.set(0.65 + jx, 0.85, 1.0);
            root.add(jarGroup);
        });

        // Plang Kayu Peternakan Klasik di Atas Mesin
        const signPost = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.9), getMat(0x4E342E));
        signPost.position.set(-0.2, 2.95, -0.7);
        const signBoard = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.45, 0.08), getMat(0xD7CCC8, 0.8));
        signBoard.position.set(-0.2, 3.3, -0.7);

        const iconEgg = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), getMat(0xF5F0DD));
        iconEgg.scale.set(0.85, 1.25, 0.85);
        iconEgg.position.set(-0.5, 3.3, -0.63);
        const iconJar = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.22, 8), getMat(0xF5EAB0));
        iconJar.position.set(0.3, 3.3, -0.63);

        root.add(signPost, signBoard, iconEgg, iconJar);
        root.userData = { whiskGroup, chimney };
        return root;
    }

    // MESIN 2: PENGEPRES KEJU BESI COR TEMPA (HEAVY WROUGHT-IRON CHEESE PRESS & DAIRY CHURN)
    static createCheesePress() {
        const root = new THREE.Group();
        root.name = "cheesePress";

        // A. Platform Panggung Kayu Lapuk Tebal & Anak Tangga Depan
        const platformMat = getTexturedMat("weatheredBarnWood", Colors3D.weatheredWood, 0.88, 0.04, { rx: 3, ry: 3 });
        const platform = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.42, 3.2), platformMat);
        platform.position.y = 0.21;
        platform.castShadow = true;
        platform.receiveShadow = true;
        root.add(platform);

        // Anak Tangga Kayu Depan
        const stepMat = getMat(0x422F22, 0.9, 0.02);
        const step1 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.14, 0.5), stepMat);
        step1.position.set(-0.9, 0.07, 1.8);
        step1.castShadow = true;
        step1.receiveShadow = true;
        const step2 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.26, 0.45), stepMat);
        step2.position.set(-0.9, 0.13, 1.4);
        step2.castShadow = true;
        step2.receiveShadow = true;
        root.add(step1, step2);

        // Meja Penyangga di Atas Panggung
        const baseGeo = new THREE.BoxGeometry(2.6, 0.25, 2.2);
        const base = new THREE.Mesh(baseGeo, getMat(0x3E2723, 0.8, 0.1));
        base.position.y = 0.52;
        base.castShadow = true;
        base.receiveShadow = true;
        root.add(base);

        // Dua Kaleng Susu Aluminium Peternakan Tradisional (Tin Dairy Churns)
        [-0.8, -1.2].forEach((cx, i) => {
            const churnGroup = new THREE.Group();
            churnGroup.position.set(cx, 0.65, -0.3 + i * 0.7);

            const canBody = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.34, 0.85, 12), getMat(0xB0BEC5, 0.35, 0.65));
            canBody.position.y = 0.42;
            canBody.castShadow = true;

            const canNeck = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.24, 0.22, 12), getMat(0x90A4AE, 0.35, 0.65));
            canNeck.position.y = 0.9;

            const canLid = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.08, 12), getMat(0x78909C, 0.35, 0.65));
            canLid.position.y = 1.02;

            churnGroup.add(canBody, canNeck, canLid);
            root.add(churnGroup);
        });

        // Rangka Tiang Besi Cor Hitam Tempa (Forged Black Cast-Iron Frame)
        const ironMat = getMat(0x263238, 0.7, 0.4);
        const postL = new THREE.Mesh(new THREE.BoxGeometry(0.22, 2.2, 0.22), ironMat);
        postL.position.set(-0.2, 1.7, 0.6);
        const postR = new THREE.Mesh(new THREE.BoxGeometry(0.22, 2.2, 0.22), ironMat);
        postR.position.set(1.4, 1.7, 0.6);
        const crossBeam = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.35, 0.35), ironMat);
        crossBeam.position.set(0.6, 2.75, 0.6);
        root.add(postL, postR, crossBeam);

        // Ulir Besi Penekan Hidrolik di Atas (Mechanical Screw Press)
        const screwHousing = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.7, 12), getMat(0x37474F, 0.6, 0.5));
        screwHousing.position.set(0.6, 2.4, 0.6);
        root.add(screwHousing);

        // Piston Penekan Keju Balok Kayu Solid
        const pistonGroup = new THREE.Group();
        pistonGroup.position.set(0.6, 1.8, 0.6);
        const pistonRod = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.8, 8), getMat(0xB0BEC5, 0.2, 0.8));
        pistonRod.position.y = 0.2;
        const pressPlate = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.48, 0.16, 16), getMat(0x4E342E, 0.8, 0.1));
        pressPlate.position.y = -0.2;
        pistonGroup.add(pistonRod, pressPlate);
        root.add(pistonGroup);

        // Cetakan Keju Silinder di Bawah
        const mold = new THREE.Mesh(new THREE.CylinderGeometry(0.54, 0.52, 0.38, 16), ironMat);
        mold.position.set(0.6, 0.95, 0.6);
        root.add(mold);

        // Pengukur Tekanan Jarum Logam
        const gauge = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.08, 12), getMat(0xCFD8DC, 0.2, 0.8));
        gauge.rotation.x = Math.PI / 2;
        gauge.position.set(0.6, 2.95, 0.8);
        root.add(gauge);

        // Rak Kayu Sisi Kanan: Roda Keju Alami Berbalut Lilin Kuning Emas
        const woodShelf = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.1, 1.4), getMat(0x5D4037));
        woodShelf.position.set(0.6, 0.75, -0.5);
        root.add(woodShelf);

        [0.7, 0.98, 1.26].forEach((cy, idx) => {
            const cheeseWheel = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.2, 14), getMat(0xD9A036, 0.7));
            cheeseWheel.position.set(0.6, cy, -0.5 + (idx % 2 === 0 ? 0.08 : -0.08));
            cheeseWheel.castShadow = true;
            root.add(cheeseWheel);
        });

        // Plang Kayu Klasik di Atas
        const signPost = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.9), getMat(0x4E342E));
        signPost.position.set(0.6, 3.2, -0.6);
        const signBoard = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.45, 0.08), getMat(0xD7CCC8, 0.8));
        signBoard.position.set(0.6, 3.55, -0.6);

        const iconMilk = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.24, 8), getMat(0xF5F5F5));
        iconMilk.position.set(0.3, 3.55, -0.53);
        const iconCheese = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.12, 8), getMat(0xD9A036));
        iconCheese.position.set(0.9, 3.55, -0.53);

        root.add(signPost, signBoard, iconMilk, iconCheese);
        root.userData = { pistonGroup };
        return root;
    }

    // MESIN 3: ALAT TENUN & PEMINTAL KAIN KAYU WALNUT TUA (ANTIQUE WALNUT TEXTILE LOOM)
    static createTextileLoom() {
        const root = new THREE.Group();
        root.name = "textileLoom";

        // A. Platform Panggung Kayu Lapuk Tebal & Anak Tangga Depan
        const platformMat = getTexturedMat("weatheredBarnWood", Colors3D.weatheredWood, 0.88, 0.04, { rx: 3, ry: 3 });
        const platform = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.42, 3.2), platformMat);
        platform.position.y = 0.21;
        platform.castShadow = true;
        platform.receiveShadow = true;
        root.add(platform);

        // Anak Tangga Kayu Depan
        const stepMat = getMat(0x422F22, 0.9, 0.02);
        const step1 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.14, 0.5), stepMat);
        step1.position.set(-0.9, 0.07, 1.8);
        step1.castShadow = true;
        step1.receiveShadow = true;
        const step2 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.26, 0.45), stepMat);
        step2.position.set(-0.9, 0.13, 1.4);
        step2.castShadow = true;
        step2.receiveShadow = true;
        root.add(step1, step2);

        // Meja Kayu Walnut Gelap Alami
        const darkWoodMat = getMat(0x3E2723, 0.8, 0.1);
        const baseGeo = new THREE.BoxGeometry(2.6, 0.25, 2.2);
        const base = new THREE.Mesh(baseGeo, darkWoodMat);
        base.position.y = 0.52;
        base.castShadow = true;
        base.receiveShadow = true;
        root.add(base);

        // Keranjang Anyaman Kayu Penampung Wol Mentah
        const bin = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.65, 1.2), getMat(0x5D4037, 0.8));
        bin.position.set(-1.0, 0.9, -0.4);
        root.add(bin);

        // Gumpalan Wol Domba Alami Putih-Krem
        [-0.15, 0.15].forEach(wx => {
            [-0.2, 0.2].forEach(wz => {
                const woolBall = new THREE.Mesh(new THREE.DodecahedronGeometry(0.2, 1), getMat(0xEDEAE3, 0.9));
                woolBall.position.set(-1.0 + wx, 1.22, -0.4 + wz);
                root.add(woolBall);
            });
        });

        // Rangka Alat Tenun Kayu Tegak
        const frameL = new THREE.Mesh(new THREE.BoxGeometry(0.14, 2.2, 0.14), darkWoodMat);
        frameL.position.set(-0.2, 1.7, 0.6);
        const frameR = new THREE.Mesh(new THREE.BoxGeometry(0.14, 2.2, 0.14), darkWoodMat);
        frameR.position.set(1.2, 1.7, 0.6);
        const topBar = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.14, 0.14), darkWoodMat);
        topBar.position.set(0.5, 2.7, 0.6);
        root.add(frameL, frameR, topBar);

        // Roda Pemintal Benang Kayu & Benang Linen Alami
        const spinnerGroup = new THREE.Group();
        spinnerGroup.position.set(0.5, 1.9, 0.6);

        // As Roda Besi
        const axle = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.5, 8), getMat(0x37474F, 0.6, 0.4));
        axle.rotation.z = Math.PI / 2;

        // 2 Roda Ruji Kayu Alami
        [-0.6, 0.6].forEach(wx => {
            const wheel = new THREE.Mesh(new THREE.TorusGeometry(0.52, 0.05, 8, 16), darkWoodMat);
            wheel.rotation.y = Math.PI / 2;
            wheel.position.x = wx;
            spinnerGroup.add(wheel);
        });

        // Gulungan Benang Linen Warna Krem Alami & Benang Biru Indigo Tua
        const yarnGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.8, 12);
        const yarn = new THREE.Mesh(yarnGeo, getMat(0xEDEAE3, 0.9));
        yarn.rotation.z = Math.PI / 2;
        spinnerGroup.add(axle, yarn);
        root.add(spinnerGroup);

        // Meja Tenun Horisontal dengan Lembaran Kain Tenun
        const loomBed = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.1, 1.0), getMat(0x4E342E));
        loomBed.position.set(0.5, 1.1, -0.2);

        // Kain Tenun Alami Berwarna Biru Indigo Gelap
        const fabricSheet = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.04, 0.8), getMat(0x37474F, 0.8));
        fabricSheet.position.set(0.5, 1.16, -0.2);
        root.add(loomBed, fabricSheet);

        // Rak Peti Kayu Sisi Depan: Gulungan Kain Sutra / Wol Jadi
        const boltRack = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.1, 0.6), darkWoodMat);
        boltRack.position.set(0.5, 0.75, 1.0);
        root.add(boltRack);

        // 2 Gulungan Kain Tenun Tradisional
        const bolt1 = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.8, 12), getMat(0x37474F));
        bolt1.rotation.z = Math.PI / 2;
        bolt1.position.set(0.5, 0.95, 0.9);
        const bolt2 = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.8, 12), getMat(0x546E7A));
        bolt2.rotation.z = Math.PI / 2;
        bolt2.position.set(0.5, 1.22, 0.9);
        root.add(bolt1, bolt2);

        // Plang Kayu Klasik di Atas
        const signPost = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.9), darkWoodMat);
        signPost.position.set(0.5, 3.0, -0.7);
        const signBoard = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.45, 0.08), getMat(0xD7CCC8, 0.8));
        signBoard.position.set(0.5, 3.3, -0.7);

        const iconWool = new THREE.Mesh(new THREE.DodecahedronGeometry(0.14, 1), getMat(0xEDEAE3));
        iconWool.position.set(0.2, 3.3, -0.63);
        const iconCloth = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.18, 0.14), getMat(0x37474F));
        iconCloth.position.set(0.8, 3.3, -0.63);

        // Tumpukan Karung Goni Besar & Peti Kayu Panen di Depan Mesin (Persis Foto Referensi)
        const sackPile = ModelBuilder3D.createBurlapSackGroup();
        sackPile.position.set(1.4, 0, 1.35);
        const crateHarvest = ModelBuilder3D.createRusticCrate(0.8, 0.6, 0.8);
        crateHarvest.position.set(-1.4, 0, 1.35);

        root.add(signPost, signBoard, iconWool, iconCloth, sackPile, crateHarvest);
        root.userData = { spinnerGroup };
        return root;
    }

    // ==========================================
    // 12. POS & STASIUN INTERAKSI REALISTIS (PENGGANTI LINGKARAN NEON WARNA-WARNI)
    // Palet kayu, karung goni, rak peti, dermaga kayu, & tiang bel ekspedisi
    // ==========================================
    static createRealisticFarmStation(type = "deposit") {
        const root = new THREE.Group();
        const woodMat = getMat(0x6D4C41, 0.8, 0.1);

        if (type === "deposit") {
            // A. Stasiun Setor: Palet Kayu Pengiriman & 2 Karung Goni Berisi Bahan Mentah
            const pallet = new THREE.Group();
            // 3 Balok Kayu Penyangga
            [-0.7, 0, 0.7].forEach(px => {
                const runner = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.14, 1.8), woodMat);
                runner.position.set(px, 0.07, 0);
                pallet.add(runner);
            });
            // 5 Bilah Papan Kayu Atas
            [-0.7, -0.35, 0, 0.35, 0.7].forEach(pz => {
                const plank = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.06, 0.26), woodMat);
                plank.position.set(0, 0.16, pz);
                pallet.add(plank);
            });
            root.add(pallet);

            // 2 Karung Goni Alami (Burlap Sacks) di Atas Palet
            const sackMat = getMat(0xBCAAA4, 0.9, 0.0); // Kain goni cokelat pucat
            const sack1 = new THREE.Mesh(new THREE.SphereGeometry(0.35, 8, 8), sackMat);
            sack1.scale.set(0.85, 1.25, 0.85);
            sack1.position.set(-0.35, 0.45, 0);
            sack1.castShadow = true;

            const sack2 = new THREE.Mesh(new THREE.SphereGeometry(0.32, 8, 8), sackMat);
            sack2.scale.set(0.85, 1.15, 0.85);
            sack2.position.set(0.35, 0.42, 0.1);
            sack2.castShadow = true;

            root.add(sack1, sack2);

            // Garis Marka Lantai Alami & Halus (Bukan Lingkaran Neon Mencolok!)
            const borderGeo = new THREE.RingGeometry(1.1, 1.18, 24);
            const borderMat = new THREE.MeshBasicMaterial({
                color: 0xE0D6B8, // Garis putih kapur lembut
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.35
            });
            const border = new THREE.Mesh(borderGeo, borderMat);
            border.rotation.x = -Math.PI / 2;
            border.position.y = 0.02;
            root.add(border);
            root.userData = { ringMesh: border };

        } else if (type === "pickup") {
            // B. Stasiun Ambil: Bangku Kayu & Peti Sayur / Hasil Olahan Jadi
            const bench = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.22, 1.1), woodMat);
            bench.position.y = 0.11;
            bench.castShadow = true;
            root.add(bench);

            // Peti Kayu Kemasan di Atas Bangku
            const crate = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.35, 0.75), getMat(0x5D4037, 0.8));
            crate.position.set(0, 0.35, 0);
            crate.castShadow = true;
            root.add(crate);

            // Garis Marka Lembut di Lantai
            const borderGeo = new THREE.RingGeometry(1.1, 1.18, 24);
            const borderMat = new THREE.MeshBasicMaterial({
                color: 0x81C784, // Hijau lembut redup alami
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.35
            });
            const border = new THREE.Mesh(borderGeo, borderMat);
            border.rotation.x = -Math.PI / 2;
            border.position.y = 0.02;
            root.add(border);
            root.userData = { ringMesh: border };

        } else if (type === "truck_load") {
            // C. Dermaga Muat Truk: Platform Balok Kayu Tebal Menghadap Aspal
            const ramp = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.25, 2.0), woodMat);
            ramp.position.y = 0.12;
            ramp.castShadow = true;
            ramp.receiveShadow = true;

            // Lis Balok Pembatas Tepi Jalan
            const curb = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.35, 2.0), getMat(0x3E2723));
            curb.position.set(1.15, 0.25, 0);
            root.add(ramp, curb);

            const border = new THREE.Mesh(
                new THREE.RingGeometry(1.3, 1.4, 24),
                new THREE.MeshBasicMaterial({ color: 0x90A4AE, side: THREE.DoubleSide, transparent: true, opacity: 0.35 })
            );
            border.rotation.x = -Math.PI / 2;
            border.position.y = 0.02;
            root.add(border);
            root.userData = { ringMesh: border };

        } else if (type === "truck_ship") {
            // D. Tiang Bel & Tuas Ekspedisi Peternakan (Farm Dispatch Bell Post)
            const post = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1.8, 0.2), woodMat);
            post.position.y = 0.9;
            post.castShadow = true;

            // Bel Kuningan Peternakan di Atas Tiang
            const bell = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.25, 8), getMat(0xD4AF37, 0.3, 0.8));
            bell.position.set(0, 1.9, 0);

            // Tuas Tarik Mekanik
            const lever = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.5), getMat(0x37474F));
            lever.rotation.z = 0.6;
            lever.position.set(0.2, 1.2, 0);
            root.add(post, bell, lever);

            const border = new THREE.Mesh(
                new THREE.RingGeometry(1.2, 1.28, 24),
                new THREE.MeshBasicMaterial({ color: 0xCE93D8, side: THREE.DoubleSide, transparent: true, opacity: 0.35 })
            );
            border.rotation.x = -Math.PI / 2;
            border.position.y = 0.02;
            root.add(border);
            root.userData = { ringMesh: border };

        } else if (type === "quest" || type === "shop" || type === "clean_ring") {
            // E. Cincin Interaktif Emas Bersih (Tanpa Papan Ganda yang Menumpuk)
            const border = new THREE.Mesh(
                new THREE.RingGeometry(1.2, 1.32, 24),
                new THREE.MeshBasicMaterial({ color: 0xFFD54F, side: THREE.DoubleSide, transparent: true, opacity: 0.45 })
            );
            border.rotation.x = -Math.PI / 2;
            border.position.y = 0.02;
            root.add(border);
            root.userData = { ringMesh: border };

        } else {
            // F. Papan Pengumuman Kayu Terpisah (Hanya jika benar-benar type bulletin_board)
            const postL = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.8, 0.12), woodMat); postL.position.set(-0.6, 0.9, 0);
            const postR = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.8, 0.12), woodMat); postR.position.set(0.6, 0.9, 0);
            const board = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.9, 0.08), getMat(0x5D4037));
            board.position.set(0, 1.35, 0);

            const roof = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.1, 0.4), getMat(Colors3D.roofSlate));
            roof.position.set(0, 1.85, 0);

            root.add(postL, postR, board, roof);

            const border = new THREE.Mesh(
                new THREE.RingGeometry(1.2, 1.28, 24),
                new THREE.MeshBasicMaterial({ color: 0xFFCC80, side: THREE.DoubleSide, transparent: true, opacity: 0.35 })
            );
            border.rotation.x = -Math.PI / 2;
            border.position.y = 0.02;
            root.add(border);
            root.userData = { ringMesh: border };
        }

        return root;
    }

    static createFactoryMachine(name, inColor, outColor) {
        if (name === "mayo") return ModelBuilder3D.createEggProcessor();
        if (name === "cheese") return ModelBuilder3D.createCheesePress();
        return ModelBuilder3D.createTextileLoom();
    }

    // ==========================================
    // 13. KENDARAAN PENGANTAR (6 LEVEL PENINGKATAN)
    // Sesuai gambar referensi: Dari Sepeda hingga Truk Kontainer!
    // ==========================================
    static createTruck(level = 1) {
        if (level === 1) return this.createDeliveryBicycle();
        if (level === 2) return this.createDeliveryMotorcycle();
        if (level === 3) return this.createDeliveryTrike();
        if (level === 4) return this.createDeliveryPickup();
        if (level === 5) return this.createDeliveryMediumTruck();
        return this.createDeliveryContainerTruck();
    }

    // ==========================================
    // Karakter Pengemudi 3D (Driver / Rider) yang Mengendarai Armada Pengantar Saat Berjalan
    // Didesain setara & konsisten dengan Karakter Petani Utama (Topi Jerami, Wajah Anime Chibi, Denim & Syal Merah)
    // ==========================================
    static createVehicleDriver(type = "bike") {
        const root = new THREE.Group();
        root.name = "vehicleDriver";

        const skinMat = getMat(0xF8D4B4, 0.72, 0.0);
        const hairMat = getMat(0x1F140E, 0.82, 0.0);
        const shirtMat = getMat(0xF4F6F9, 0.68, 0.0);
        const denimMat = (typeof getTexturedMat === "function") 
            ? getTexturedMat("denimFabric", 0x2A5482, 0.78, 0.02, { rx: 2, ry: 2 })
            : getMat(0x2A5482, 0.8, 0.02);
        const strawMat = (typeof getTexturedMat === "function")
            ? getTexturedMat("wovenStraw", 0xE5B860, 0.88, 0.0, { rx: 3, ry: 3 })
            : getMat(0xE5B860, 0.85, 0.0);
        const strawBandMat = getMat(0x5A351D, 0.75, 0.05);
        const redScarfMat = getMat(0xD32F2F, 0.65, 0.0);
        const leatherGlovesMat = getMat(0xA76735, 0.75, 0.04);
        const bootMat = getMat(0x2E1E12, 0.7, 0.05);
        const soleMat = getMat(0x141414, 0.85, 0.0);
        const brassMat = getMat(0xD4AF37, 0.35, 0.75);

        const isBike = (type === "bike");

        // 1. BADAN / TORSO & CELANA KODOK DENIM (MENGHADAP KE DEPAN +Z)
        const torsoGroup = new THREE.Group();
        torsoGroup.name = "torsoGroup";
        torsoGroup.position.set(0, 0.14, 0);
        torsoGroup.rotation.x = isBike ? 0.22 : 0.08; // Posisi condong tegap ke setang kemudi
        root.add(torsoGroup);

        // Pinggul & Bokong Denim (Duduk Mantap di Jok / Sadel)
        const pelvis = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.16, 0.30), denimMat);
        pelvis.position.set(0, 0, 0);
        torsoGroup.add(pelvis);

        // Baju Putih Bersih
        const shirt = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.19, 0.34, 12), shirtMat);
        shirt.position.set(0, 0.20, 0);
        torsoGroup.add(shirt);

        // Pelat Dada Celana Kodok Denim (Front Bib)
        const bib = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.24, 0.06), denimMat);
        bib.position.set(0, 0.18, 0.17);
        // Saku Depan & Kancing Kuningan
        const pocket = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.10, 0.03), getMat(0x325E8C));
        pocket.position.set(0, 0.16, 0.20);
        const brassBtn = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.02, 6), brassMat);
        brassBtn.rotation.x = Math.PI / 2;
        brassBtn.position.set(0, 0.19, 0.22);

        // Tali Selempang Bahu Denim
        const strapL = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.32, 0.02), denimMat);
        strapL.position.set(-0.09, 0.20, 0.17);
        const strapR = strapL.clone(); strapR.position.x = 0.09;
        const bckL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.04, 0.03), brassMat);
        bckL.position.set(-0.09, 0.26, 0.18);
        const bckR = bckL.clone(); bckR.position.x = 0.09;

        torsoGroup.add(bib, pocket, brassBtn, strapL, strapR, bckL, bckR);

        // Syal Merah Menyala di Leher dengan Simpul Menghadap Depan (+Z)
        const scarf = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.035, 6, 12), redScarfMat);
        scarf.rotation.x = Math.PI / 2;
        scarf.position.set(0, 0.36, 0);
        const knot = new THREE.Mesh(new THREE.SphereGeometry(0.045, 6, 6), redScarfMat);
        knot.position.set(0, 0.35, 0.15);
        torsoGroup.add(scarf, knot);

        // 2. KEPALA, WAJAH ANIME CHIBI RAMAH & TOPI JERAMI ANYAM
        const headGroup = new THREE.Group();
        headGroup.name = "headGroup";
        headGroup.position.set(0, 0.52, 0.03);
        torsoGroup.add(headGroup);

        // Bentuk Kepala Chibi Lembut Warna Kulit
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.20, 16, 14), skinMat);
        head.scale.set(1.0, 1.05, 1.0);
        headGroup.add(head);

        // Wajah Ekspresif Menghadap ke Depan (+Z) - Posisi di depan kepala agar tidak tembus
        let faceMat = skinMat;
        if (typeof window !== "undefined" && window.FarmTextures && window.FarmTextures.getFarmerFace) {
            faceMat = new THREE.MeshBasicMaterial({
                map: window.FarmTextures.getFarmerFace("boy"),
                transparent: false
            });
        }
        const facePlane = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.34), faceMat);
        facePlane.position.set(0, -0.01, 0.205);
        facePlane.rotation.x = -0.05;
        headGroup.add(facePlane);

        // Rambut Hitam Alami Hanya di Bagian Belakang & Atas (Tidak Menembus Wajah!)
        const hairBack = new THREE.Mesh(new THREE.SphereGeometry(0.208, 14, 12, 0, Math.PI * 2, 0, Math.PI * 0.44), hairMat);
        hairBack.position.set(0, 0.04, -0.02);
        headGroup.add(hairBack);

        // Topi Jerami Anyam Khas Petani (Straw Hat Terpasang Rapi di Kepala)
        const hatGroup = new THREE.Group();
        hatGroup.position.set(0, 0.16, 0.01);
        hatGroup.rotation.x = -0.08;

        const hatBrim = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.40, 0.022, 20), strawMat);
        hatBrim.castShadow = true;
        const hatCrown = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.22, 0.16, 16), strawMat);
        hatCrown.position.y = 0.08;
        hatCrown.castShadow = true;
        const hatBand = new THREE.Mesh(new THREE.CylinderGeometry(0.225, 0.225, 0.04, 16), strawBandMat);
        hatBand.position.y = 0.03;

        hatGroup.add(hatBrim, hatCrown, hatBand);
        headGroup.add(hatGroup);

        // 3. LENGAN & SARUNG TANGAN KULIT MEMEGANG KEMUDI
        const armL = new THREE.Group();
        const armR = new THREE.Group();
        armL.position.set(-0.21, 0.30, 0.04);
        armR.position.set(0.21, 0.30, 0.04);

        if (isBike) {
            // Lengan menjangkau setang sepeda ke depan & bawah (+Z dan -Y)
            const upperArmL = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.07, 0.30, 8), shirtMat);
            upperArmL.position.set(0, -0.06, 0.16);
            upperArmL.rotation.x = 0.50;
            upperArmL.rotation.y = -0.15;
            const foreArmL = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.06, 0.36, 8), skinMat);
            foreArmL.position.set(-0.02, -0.16, 0.46);
            foreArmL.rotation.x = 0.30;
            foreArmL.rotation.y = -0.15;
            const gloveL = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.09, 0.10), leatherGlovesMat);
            gloveL.position.set(-0.04, -0.24, 0.72);
            armL.add(upperArmL, foreArmL, gloveL);

            const upperArmR = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.07, 0.30, 8), shirtMat);
            upperArmR.position.set(0, -0.06, 0.16);
            upperArmR.rotation.x = 0.50;
            upperArmR.rotation.y = 0.15;
            const foreArmR = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.06, 0.36, 8), skinMat);
            foreArmR.position.set(0.02, -0.16, 0.46);
            foreArmR.rotation.x = 0.30;
            foreArmR.rotation.y = 0.15;
            const gloveR = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.09, 0.10), leatherGlovesMat);
            gloveR.position.set(0.04, -0.24, 0.72);
            armR.add(upperArmR, foreArmR, gloveR);
        } else {
            // Motor / Pikap / Truk: memegang stang motor atau kemudi setir bundar
            const upperArmL = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.07, 0.26, 8), shirtMat);
            upperArmL.position.set(0, -0.06, 0.12);
            upperArmL.rotation.x = 0.85;
            upperArmL.rotation.y = -0.2;
            const foreArmL = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.06, 0.30, 8), skinMat);
            foreArmL.position.set(-0.03, -0.12, 0.34);
            foreArmL.rotation.x = 0.65;
            foreArmL.rotation.y = -0.2;
            const gloveL = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.09, 0.09), leatherGlovesMat);
            gloveL.position.set(-0.06, -0.16, 0.52);
            armL.add(upperArmL, foreArmL, gloveL);

            const upperArmR = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.07, 0.26, 8), shirtMat);
            upperArmR.position.set(0, -0.06, 0.12);
            upperArmR.rotation.x = 0.85;
            upperArmR.rotation.y = 0.2;
            const foreArmR = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.06, 0.30, 8), skinMat);
            foreArmR.position.set(0.03, -0.12, 0.34);
            foreArmR.rotation.x = 0.65;
            foreArmR.rotation.y = 0.2;
            const gloveR = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.09, 0.09), leatherGlovesMat);
            gloveR.position.set(0.06, -0.16, 0.52);
            armR.add(upperArmR, foreArmR, gloveR);
        }

        torsoGroup.add(armL, armR);

        // 4. KAKI DENGAN SEPATU BOT KARET (BISA MENGAYUH PEDAL)
        const buildDriverLeg = (isLeft) => {
            const legRoot = new THREE.Group();
            const sign = isLeft ? -1 : 1;
            legRoot.position.set(sign * 0.13, 0.06, 0.02);

            if (isBike) {
                // Paha Denim mengarah maju-turun ke lutut
                const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.085, 0.34, 8), denimMat);
                thigh.position.set(0, -0.12, 0.14);
                thigh.rotation.x = 0.62;
                thigh.castShadow = true;

                // Betis & Sepatu Bot mengarah turun ke pedal
                const calf = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.07, 0.32, 8), denimMat);
                calf.position.set(0, -0.32, 0.24);
                calf.rotation.x = -0.28;
                calf.castShadow = true;

                // Sepatu Bot Kerja Petani Cokelat Tua
                const boot = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.10, 0.22), bootMat);
                boot.position.set(0, -0.48, 0.26);
                boot.castShadow = true;
                const sole = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.03, 0.24), soleMat);
                sole.position.set(0, -0.54, 0.26);

                legRoot.add(thigh, calf, boot, sole);
            } else {
                // Posisi duduk santai di motor/truk
                const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.085, 0.30, 8), denimMat);
                thigh.position.set(0, -0.06, 0.14);
                thigh.rotation.x = 1.15;

                const calf = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.07, 0.30, 8), denimMat);
                calf.position.set(0, -0.22, 0.28);

                const boot = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.10, 0.20), bootMat);
                boot.position.set(0, -0.38, 0.32);
                const sole = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.03, 0.22), soleMat);
                sole.position.set(0, -0.44, 0.32);

                legRoot.add(thigh, calf, boot, sole);
            }

            return legRoot;
        };

        const legL = buildDriverLeg(true);
        const legR = buildDriverLeg(false);
        root.add(legL, legR);

        root.userData = { head: headGroup, torso: torsoGroup, armL, armR, legL, legR };
        return root;
    }

    // LEVEL 1: SEPEDA PENGANTAR TRADISIONAL (DELIVERY BICYCLE)
    // Sadel kulit, rangka segitiga silinder melengkung, setang ber-handgrip, pedal & pelindung rantai,
    // keranjang bambu depan (wortel & sayur), rak kayu belakang, dan roda sejajar lurus ke depan.
    static createDeliveryBicycle() {
        const root = new THREE.Group();
        root.name = "deliveryBicycle";

        const frameRed = getMat(0xD32F2F, 0.4, 0.2);
        const metalChrome = getMat(0xE0E0E0, 0.15, 0.85);
        const rubberBlack = getMat(0x212121, 0.9, 0.05);
        const leatherDark = getMat(0x3E2723, 0.7, 0.1);
        const woodCrate = getMat(0x8D6E63, 0.8, 0.05);
        const wickerBamboo = getMat(0xD7CCC8, 0.9, 0.0);
        const carrotOrange = getMat(0xFF6D00, 0.6);
        const leafyGreen = getMat(0x43A047, 0.7);

        const wheels = [];
        const createBikeWheel = (posZ) => {
            const wGroup = new THREE.Group();
            const tire = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.038, 12, 28), rubberBlack);
            tire.castShadow = true;
            const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.12, 10), metalChrome);
            hub.rotation.z = Math.PI / 2;
            wGroup.add(tire, hub);

            // 12 Ruji Kawat Sepeda Halus (Chrome Spokes)
            for (let i = 0; i < 12; i++) {
                const sp = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.72, 4), metalChrome);
                sp.rotation.z = (i * Math.PI) / 6;
                wGroup.add(sp);
            }

            // Putar 90 Derajat agar Roda Menggelinding Lurus Sejajar Rangka Sepeda (Tidak Menyamping!)
            wGroup.rotation.y = Math.PI / 2;
            wGroup.position.set(0, 0.38, posZ);
            wheels.push(wGroup);
            return wGroup;
        };

        const wF = createBikeWheel(0.95);
        const wR = createBikeWheel(-0.85);
        root.add(wF, wR);

        // Titik-titik Rangka Sepeda Terhubung Rapi (Diamond Tubular Frame):
        // 1. Top Tube (Pipa Atas Horizontal)
        const topTube = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.88, 8), frameRed);
        topTube.rotation.x = Math.PI / 2;
        topTube.position.set(0, 0.86, 0.24);

        // 2. Down Tube (Pipa Bawah Miring)
        const downLen = Math.hypot(0.50, 0.73);
        const downTube = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.026, downLen, 8), frameRed);
        downTube.rotation.x = Math.atan2(0.73, 0.50);
        downTube.position.set(0, 0.63, 0.315);

        // 3. Seat Tube (Pipa Jok Vertikal Miring)
        const seatLen = Math.hypot(0.48, 0.15);
        const seatTube = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, seatLen, 8), frameRed);
        seatTube.rotation.x = -Math.atan2(0.15, 0.48);
        seatTube.position.set(0, 0.62, -0.125);

        // 4. Chain Stays (Pipa Garpu Belakang Bawah Kiri & Kanan)
        const chainStayL = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.80, 6), frameRed);
        chainStayL.rotation.x = Math.PI / 2;
        chainStayL.position.set(-0.06, 0.38, -0.45);
        const chainStayR = chainStayL.clone(); chainStayR.position.x = 0.06;

        // 5. Seat Stays (Pipa Garpu Belakang Atas Kiri & Kanan)
        const stayLen = Math.hypot(0.48, 0.65);
        const seatStayL = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, stayLen, 6), frameRed);
        seatStayL.rotation.x = -Math.atan2(0.65, 0.48);
        seatStayL.position.set(-0.06, 0.62, -0.525);
        const seatStayR = seatStayL.clone(); seatStayR.position.x = 0.06;

        // 6. Garpu Roda Depan (Front Fork Blades)
        const forkLen = Math.hypot(0.50, 0.27);
        const forkL = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.018, forkLen, 6), metalChrome);
        forkL.rotation.x = Math.atan2(0.27, 0.50);
        forkL.position.set(-0.06, 0.63, 0.815);
        const forkR = forkL.clone(); forkR.position.x = 0.06;

        // Head Tube (Pipa Leher Setang)
        const headTube = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.22, 8), frameRed);
        headTube.rotation.x = Math.atan2(0.27, 0.50);
        headTube.position.set(0, 0.88, 0.68);

        // Poros Tengah (Bottom Bracket) & Pelindung Rantai (Chain Guard) & Pedal
        const bbHub = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.16, 8), metalChrome);
        bbHub.rotation.z = Math.PI / 2; bbHub.position.set(0, 0.38, -0.05);

        // Piringan Gir Rantai & Pelindung (Chain Guard)
        const chainGuard = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.02, 16), metalChrome);
        chainGuard.rotation.z = Math.PI / 2; chainGuard.position.set(0.09, 0.38, -0.05);

        // Lengan Engkol & Pedal Kiri-Kanan (Pedals & Cranks)
        const crankL = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.16, 0.02), metalChrome);
        crankL.position.set(-0.09, 0.32, -0.05);
        const pedalL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.025, 0.06), rubberBlack);
        pedalL.position.set(-0.13, 0.24, -0.05);
        const crankR = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.16, 0.02), metalChrome);
        crankR.position.set(0.11, 0.44, -0.05);
        const pedalR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.025, 0.06), rubberBlack);
        pedalR.position.set(0.15, 0.52, -0.05);

        // Standar Samping Sepeda (Kickstand Solid Menapak Tanah Y = 0)
        const kickstand = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.014, 0.42, 6), metalChrome);
        kickstand.rotation.z = 0.45; kickstand.rotation.x = -0.2;
        kickstand.position.set(-0.12, 0.18, -0.32);

        // Stem & Setang Sepeda Lengkung
        const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.18, 6), metalChrome);
        stem.position.set(0, 1.02, 0.72);

        const handlebar = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.035, 0.035), metalChrome);
        handlebar.position.set(0, 1.08, 0.72);

        // Handgrips Karet Hitam & Bel Sepeda Krom
        const gripsL = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.13, 8), rubberBlack);
        gripsL.rotation.z = Math.PI / 2; gripsL.position.set(-0.31, 1.08, 0.72);
        const gripsR = gripsL.clone(); gripsR.position.x = 0.31;
        const bell = new THREE.Mesh(new THREE.SphereGeometry(0.038, 8, 8), metalChrome);
        bell.position.set(-0.16, 1.13, 0.74);

        // Sadel Kulit Gelap Berkontur dengan Tiang Sadel
        const seatPost = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.18, 6), metalChrome);
        seatPost.position.set(0, 0.94, -0.22);
        const saddle = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.08, 0.32), leatherDark);
        saddle.position.set(0, 1.02, -0.24); saddle.castShadow = true;

        // Keranjang Anyaman Bambu Depan (Penuh Wortel 3D & Telur)
        const basket = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.32, 0.38), wickerBamboo);
        basket.position.set(0, 0.95, 0.98); basket.castShadow = true;

        // Wortel 3D dengan Daun Hijau di Keranjang Depan
        for (let i = 0; i < 3; i++) {
            const carrot = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.24, 6), carrotOrange);
            carrot.rotation.x = 0.4 + i * 0.15;
            carrot.rotation.z = (i - 1) * 0.3;
            carrot.position.set((i - 1) * 0.12, 1.08, 0.98);
            const leaves = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.1, 4), leafyGreen);
            leaves.position.set(0, 0.14, 0); carrot.add(leaves);
            root.add(carrot);
        }
        const eggFarm = new THREE.Mesh(new THREE.SphereGeometry(0.065, 8, 8), getMat(0xFFFAF0));
        eggFarm.position.set(0.02, 1.08, 1.04); root.add(eggFarm);

        // Rak Bagasi Belakang & Kotak Peti Panen Kayu Terbuka
        const rack = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.04, 0.68), metalChrome);
        rack.position.set(0, 0.74, -0.75);
        const crate = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.3, 0.58), woodCrate);
        crate.position.set(0, 0.91, -0.75); crate.castShadow = true;

        // Sayuran 3D di Peti Belakang (Kubis & Ikat Wortel)
        const cabbage1 = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 8), leafyGreen);
        cabbage1.position.set(-0.11, 1.08, -0.75);
        const cabbage2 = cabbage1.clone(); cabbage2.position.set(0.11, 1.08, -0.72);
        const c3 = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.22, 6), carrotOrange);
        c3.rotation.x = Math.PI / 2; c3.position.set(0, 1.07, -0.82);

        root.add(
            topTube, downTube, seatTube, chainStayL, chainStayR, seatStayL, seatStayR, forkL, forkR, headTube,
            bbHub, chainGuard, crankL, pedalL, crankR, pedalR, kickstand,
            stem, handlebar, gripsL, gripsR, bell, seatPost, saddle,
            basket, rack, crate, cabbage1, cabbage2, c3
        );

        const driver = ModelBuilder3D.createVehicleDriver("bike");
        driver.position.set(0, 1.02, -0.24);
        driver.visible = false;
        root.add(driver);

        root.userData = { wheels, driver };
        return root;
    }

    // LEVEL 2: SEPEDA MOTOR RODA DUA DENGAN KERANJANG (DELIVERY MOTORCYCLE)
    // Motor bebek/klasik merah: tangki bensin, mesin berpendingin sirip di bawah, knalpot samping krom,
    // jok panjang kulit, lampu bulat, spion, keranjang samping & boks kayu sarat hasil panen.
    static createDeliveryMotorcycle() {
        const root = new THREE.Group();
        root.name = "deliveryMotorcycle";

        const motorRed = getMat(0xC62828, 0.35, 0.4);
        const chromeMat = getMat(0xCFD8DC, 0.15, 0.85);
        const engineMat = getMat(0x37474F, 0.6, 0.4);
        const rubberBlack = getMat(0x212121, 0.9, 0.05);
        const woodPlank = getMat(0x5D4037, 0.8, 0.05);
        const wickerBamboo = getMat(0xD7CCC8, 0.9, 0.0);
        const produceOrange = getMat(0xFF6D00, 0.6);
        const produceGreen = getMat(0x43A047, 0.7);

        const wheels = [];
        const createMotoWheel = (posZ) => {
            const wGroup = new THREE.Group();
            const tire = new THREE.Mesh(new THREE.TorusGeometry(0.44, 0.08, 12, 28), rubberBlack);
            tire.castShadow = true;
            const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.18, 10), chromeMat);
            hub.rotation.z = Math.PI / 2;
            wGroup.add(tire, hub);
            for (let i = 0; i < 12; i++) {
                const sp = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.8, 4), chromeMat);
                sp.rotation.z = (i * Math.PI) / 6;
                wGroup.add(sp);
            }
            // Putar 90 Derajat agar Roda Menggelinding Lurus Sejajar Bodi Motor (Tidak Menyamping!)
            wGroup.rotation.y = Math.PI / 2;
            wGroup.position.set(0, 0.44, posZ);
            wheels.push(wGroup);
            return wGroup;
        };

        const wF = createMotoWheel(1.15);
        const wR = createMotoWheel(-0.95);
        root.add(wF, wR);

        // Lengan Ayun Belakang (Rear Swingarm Menghubungkan Rangka ke Roda Belakang)
        const swingLen = Math.hypot(0.12, 0.75);
        const swingL = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.06, swingLen), chromeMat);
        swingL.position.set(-0.16, 0.48, -0.58);
        const swingR = swingL.clone(); swingR.position.x = 0.16;
        root.add(swingL, swingR);

        // Rangka Baja & Blok Mesin dengan Sirip Pendingin (Crankcase & Cooling Fins)
        const frameTube = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1.4, 8), engineMat);
        frameTube.rotation.x = 0.55; frameTube.position.set(0, 0.75, 0.25);
        
        const engineBlock = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.42, 0.52), engineMat);
        engineBlock.position.set(0, 0.52, 0.1);
        // Sirip Pendingin Mesin (Cooling Fins)
        for (let f = 0; f < 4; f++) {
            const fin = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.02, 0.48), chromeMat);
            fin.position.set(0, 0.42 + f * 0.08, 0.1);
            root.add(fin);
        }

        // Knalpot Samping Krom Panjang dengan Pelindung Panas (Exhaust & Muffler)
        const exhaust = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.055, 1.35, 8), chromeMat);
        exhaust.rotation.x = Math.PI / 2; exhaust.position.set(0.24, 0.32, -0.32);
        const mufflerGuard = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.55, 8), chromeMat);
        mufflerGuard.rotation.x = Math.PI / 2; mufflerGuard.position.set(0.25, 0.32, -0.65);

        // Tangki Bensin Merah Berlekuk & Tutup Bensin Krom
        const tank = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.34, 0.68), motorRed);
        tank.position.set(0, 0.95, 0.45); tank.castShadow = true;
        const gasCap = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.04, 10), chromeMat);
        gasCap.position.set(0, 1.14, 0.52);

        // Jok Panjang Kulit Hitam (Dual Contour Seat)
        const seat = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.16, 0.78), rubberBlack);
        seat.position.set(0, 0.88, -0.15); seat.castShadow = true;

        // Garpu Depan Teleskopik (Telescopic Forks Kiri & Kanan Terhubung Presisi ke Roda)
        const forkLen = Math.hypot(0.71, 0.27);
        const forkL = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.032, forkLen, 8), chromeMat);
        forkL.rotation.x = Math.atan2(0.27, 0.71); forkL.position.set(-0.16, 0.795, 1.015);
        const forkR = forkL.clone(); forkR.position.x = 0.16;

        const bar = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.038, 0.038), chromeMat);
        bar.position.set(0, 1.15, 0.88);
        const gripL = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.12, 8), rubberBlack);
        gripL.rotation.z = Math.PI / 2; gripL.position.set(-0.38, 1.15, 0.88);
        const gripR = gripL.clone(); gripR.position.x = 0.38;

        // Spion Bulat Krom Kiri & Kanan
        const mirrorL = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.015, 12), chromeMat);
        mirrorL.position.set(-0.4, 1.26, 0.86); mirrorL.rotation.x = 0.3;
        const mirrorR = mirrorL.clone(); mirrorR.position.x = 0.4;

        // Lampu Depan Bulat Klasik & Lampu Rem Belakang
        const headlight = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 10), getMat(0xFFF9C4, 0.2, 0.8));
        headlight.position.set(0, 0.98, 1.28);
        const tailLight = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.06, 0.05), getMat(0xD32F2F));
        tailLight.position.set(0, 0.72, -1.48);

        // Standar Tengah Menapak Tanah Y = 0
        const kickstand = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.44, 6), chromeMat);
        kickstand.rotation.z = -0.35; kickstand.position.set(0.18, 0.2, -0.05);

        // Keranjang Samping Anyaman (Panniers) Kiri & Kanan
        const basketL = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.35, 0.55), wickerBamboo);
        basketL.position.set(-0.35, 0.78, -0.35); basketL.castShadow = true;
        const basketR = basketL.clone(); basketR.position.x = 0.35;
        // Hasil Panen di Keranjang Samping (Wortel & Buah)
        const p1 = new THREE.Mesh(new THREE.SphereGeometry(0.08, 6, 6), produceOrange);
        p1.position.set(-0.35, 0.98, -0.32);
        const p2 = new THREE.Mesh(new THREE.SphereGeometry(0.08, 6, 6), produceGreen);
        p2.position.set(0.35, 0.98, -0.32);

        // Boks Peti Kayu Kargo Besar di Rak Belakang
        const boxFrame = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.55, 0.85), woodPlank);
        boxFrame.position.set(0, 0.95, -0.98); boxFrame.castShadow = true;
        
        // Karung Goni Berisi Hasil Panen & Labu di Boks Belakang
        const sack1 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.24, 1), getMat(0xD7CCC8));
        sack1.position.set(-0.2, 1.28, -0.95); sack1.castShadow = true;
        const sack2 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.22, 1), getMat(0xBCAAA4));
        sack2.position.set(0.2, 1.25, -0.95); sack2.castShadow = true;

        root.add(
            frameTube, engineBlock, exhaust, mufflerGuard, tank, gasCap, seat,
            forkL, forkR, bar, gripL, gripR, mirrorL, mirrorR, headlight, tailLight,
            kickstand, basketL, basketR, p1, p2, boxFrame, sack1, sack2
        );

        const driver = ModelBuilder3D.createVehicleDriver("motor");
        driver.position.set(0, 0.95, -0.15);
        driver.visible = false;
        root.add(driver);

        root.userData = { wheels, driver };
        return root;
    }

    // LEVEL 3: KENDARAAN RODA 3 / PIKAP KECIL (3-WHEELED UTILITY TRIKE / TOSA / VIAR)
    // 1 roda depan + stang kemudi, 2 roda belakang penopang bak kargo, mesin di bawah jok,
    // bak berpagar besi/kayu biru, kaleng susu murni, peti sayur, dan karung gandum.
    static createDeliveryTrike() {
        const root = new THREE.Group();
        root.name = "deliveryTrike";

        const blueMetal = getMat(0x1976D2, 0.45, 0.35);
        const darkChassis = getMat(0x263238, 0.7, 0.2);
        const rubberBlack = getMat(0x212121, 0.9, 0.05);
        const chromeMat = getMat(0xCFD8DC, 0.2, 0.8);
        const milkSilver = getMat(0xE0E0E0, 0.2, 0.8);
        const woodFloor = getMat(0x8D6E63, 0.85, 0.05);
        const tomatoRed = getMat(0xE53935, 0.6);
        const produceGreen = getMat(0x43A047, 0.7);

        const wheels = [];
        const createTrikeWheel = (x, z) => {
            const wGroup = new THREE.Group();
            const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.24, 16), rubberBlack);
            tire.rotation.z = Math.PI / 2; tire.castShadow = true;
            const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.26, 10), chromeMat);
            cap.rotation.z = Math.PI / 2;
            wGroup.add(tire, cap);
            wGroup.position.set(x, 0.38, z);
            wheels.push(wGroup);
            return wGroup;
        };

        // 1 Roda Depan di Poros Tengah, 2 Roda Belakang Penopang Bak
        const wF = createTrikeWheel(0, 1.55);
        const wRL = createTrikeWheel(-0.76, -0.65);
        const wRR = createTrikeWheel(0.76, -0.65);
        root.add(wF, wRL, wRR);

        // Sasis Baja Utama & Gardan Belakang (Rear Differential)
        const chassis = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.22, 2.9), darkChassis);
        chassis.position.set(0, 0.42, 0.25); root.add(chassis);
        const diffAxle = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 8), darkChassis);
        diffAxle.position.set(0, 0.38, -0.65); root.add(diffAxle);

        // Tameng Depan Biru & Garpu Suspensi Teleskopik
        const cabinFront = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.8, 0.8), blueMetal);
        cabinFront.position.set(0, 0.9, 1.15); cabinFront.castShadow = true;
        
        const fenderF = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.12, 0.65), blueMetal);
        fenderF.position.set(0, 0.68, 1.55);

        const fork = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 1.1, 8), chromeMat);
        fork.rotation.x = -0.3; fork.position.set(0, 0.82, 1.4);

        const hBar = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.04, 0.04), chromeMat);
        hBar.position.set(0, 1.28, 0.98);
        const m1 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.06, 0.02), chromeMat);
        m1.position.set(-0.42, 1.38, 0.98);
        const m2 = m1.clone(); m2.position.x = 0.42;

        // Lampu Depan Tunggal Terang & Speedometer
        const light = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.12, 12), getMat(0xFFEB3B, 0.2, 0.8));
        light.rotation.x = Math.PI / 2; light.position.set(0, 0.95, 1.58);

        // Jok Supir & Mesin Kecil di Bawah Jok
        const seat = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.2, 0.48), rubberBlack);
        seat.position.set(0, 0.86, 0.55);
        const miniEngine = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.32, 0.45), darkChassis);
        miniEngine.position.set(0, 0.55, 0.55);

        // Bak Kargo Belakang Berpagar Besi Biru dengan Lantai Kayu (Cargo Bed)
        const bedFloor = new THREE.Mesh(new THREE.BoxGeometry(1.48, 0.1, 1.8), woodFloor);
        bedFloor.position.set(0, 0.58, -0.55);
        
        // Pagar Sisi Kiri, Kanan, Depan & Pintu Belakang (Tailgate dengan Pengait)
        const wallL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.55, 1.8), blueMetal);
        wallL.position.set(-0.72, 0.88, -0.55); wallL.castShadow = true;
        const wallR = wallL.clone(); wallR.position.x = 0.72;
        const wallFront = new THREE.Mesh(new THREE.BoxGeometry(1.48, 0.55, 0.08), blueMetal);
        wallFront.position.set(0, 0.88, 0.32);
        const tailgate = new THREE.Mesh(new THREE.BoxGeometry(1.48, 0.52, 0.08), blueMetal);
        tailgate.position.set(0, 0.86, -1.42); tailgate.castShadow = true;

        // Muatan 1: Tiga Kaleng Susu Murni Aluminium (Milk Churns)
        [-0.42, 0, 0.42].forEach(mx => {
            const can = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.17, 0.52, 10), milkSilver);
            can.position.set(mx, 0.88, -0.95); can.castShadow = true;
            const canCap = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.08, 10), milkSilver);
            canCap.position.set(mx, 1.16, -0.95);
            root.add(can, canCap);
        });

        // Muatan 2: Peti Kayu Penuh Sayuran & Tomat Segar
        const crate1 = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.32, 0.48), woodFloor);
        crate1.position.set(-0.32, 0.78, -0.3); crate1.castShadow = true;
        const tomato = new THREE.Mesh(new THREE.SphereGeometry(0.08, 6, 6), tomatoRed);
        tomato.position.set(-0.32, 0.98, -0.3);
        const greenCrop = new THREE.Mesh(new THREE.SphereGeometry(0.09, 6, 6), produceGreen);
        greenCrop.position.set(-0.18, 0.98, -0.3);

        // Muatan 3: Karung Goni Gandum Ditumpuk Rapi
        const sackG = new THREE.Mesh(new THREE.DodecahedronGeometry(0.25, 1), getMat(0xD7CCC8));
        sackG.position.set(0.35, 0.8, -0.28); sackG.castShadow = true;

        root.add(
            fenderF, cabinFront, fork, hBar, m1, m2, light, seat, miniEngine,
            bedFloor, wallL, wallR, wallFront, tailgate,
            crate1, tomato, greenCrop, sackG
        );

        const driver = ModelBuilder3D.createVehicleDriver("trike");
        driver.position.set(0, 0.90, 0.25);
        driver.visible = false;
        root.add(driver);

        root.userData = { wheels, driver };
        return root;
    }

    // LEVEL 4: MOBIL PIKAP SERBAGUNA (PICK-UP TRUCK)
    // Pikap 4 roda abu-abu metalik: kabin tertutup kaca transparan, pintu & spion samping,
    // bumper kokoh, lampu depan-belakang, bak terbuka ber-tailgate, velg perak,
    // muatan karung gandum terikat tali, peti apel merah, dan boks pasokan tani.
    static createDeliveryPickup() {
        const root = new THREE.Group();
        root.name = "deliveryPickup";

        const greyPaint = getMat(0x607D8B, 0.35, 0.45); // Abu-abu metalik modern
        const darkGrey = getMat(0x37474F, 0.6, 0.2);
        const glassMat = getMat(0x81D4FA, 0.15, 0.9);
        const chromeMat = getMat(0xECEFF1, 0.1, 0.9);
        const rubberBlack = getMat(0x212121, 0.9, 0.05);
        const appleRed = getMat(0xE53935, 0.5);

        const wheels = [];
        const createCarWheel = (x, z) => {
            const wGroup = new THREE.Group();
            const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.26, 16), rubberBlack);
            tire.rotation.z = Math.PI / 2; tire.castShadow = true;
            // Velg Perak Sporty 5-Spoke
            const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.28, 12), chromeMat);
            rim.rotation.z = Math.PI / 2;
            const hubCenter = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.3, 8), darkGrey);
            hubCenter.rotation.z = Math.PI / 2;
            wGroup.add(tire, rim, hubCenter);
            wGroup.position.set(x, 0.38, z);
            wheels.push(wGroup);
            return wGroup;
        };

        const wFL = createCarWheel(-0.85, 1.15);
        const wFR = createCarWheel(0.85, 1.15);
        const wRL = createCarWheel(-0.85, -1.05);
        const wRR = createCarWheel(0.85, -1.05);
        root.add(wFL, wFR, wRL, wRR);

        // Sasis & Bumper Depan-Belakang
        const chassis = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.25, 3.8), darkGrey);
        chassis.position.set(0, 0.42, 0); root.add(chassis);
        
        const bumperF = new THREE.Mesh(new THREE.BoxGeometry(1.68, 0.24, 0.22), chromeMat);
        bumperF.position.set(0, 0.42, 1.95); root.add(bumperF);
        const bumperR = new THREE.Mesh(new THREE.BoxGeometry(1.68, 0.22, 0.2), darkGrey);
        bumperR.position.set(0, 0.42, -1.95); root.add(bumperR);

        // Kap Mesin Depan Berlekuk (Hood)
        const hood = new THREE.Mesh(new THREE.BoxGeometry(1.52, 0.55, 1.25), greyPaint);
        hood.position.set(0, 0.8, 1.25); hood.castShadow = true;

        // Gril Radiator & Lampu Utama Kotak + Lampu Sein Oranye
        const grill = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.26, 0.06), darkGrey);
        grill.position.set(0, 0.78, 1.88);
        const hL1 = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.15, 0.05), getMat(0xFFF9C4, 0.2, 0.8));
        hL1.position.set(-0.58, 0.82, 1.88);
        const hL2 = hL1.clone(); hL2.position.x = 0.58;
        const turnL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.15, 0.05), getMat(0xFF9800));
        turnL.position.set(-0.73, 0.82, 1.87);
        const turnR = turnL.clone(); turnR.position.x = 0.73;

        // Kabin Penumpang Tertutup (Enclosed Cabin)
        const cab = new THREE.Mesh(new THREE.BoxGeometry(1.52, 0.75, 1.18), greyPaint);
        cab.position.set(0, 1.25, 0.25); cab.castShadow = true;

        // Kaca Depan Transparan Miring, Kaca Pintu Samping & Kaca Belakang
        const windshield = new THREE.Mesh(new THREE.BoxGeometry(1.38, 0.52, 0.05), glassMat);
        windshield.rotation.x = -0.3; windshield.position.set(0, 1.35, 0.76);
        
        const winSideL = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.38, 0.75), glassMat);
        winSideL.position.set(-0.77, 1.32, 0.25);
        const winSideR = winSideL.clone(); winSideR.position.x = 0.77;

        // Spion Samping Kiri & Kanan (Side Mirrors) & Handel Pintu
        const mirrorL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.12, 0.16), darkGrey);
        mirrorL.position.set(-0.84, 1.28, 0.65);
        const mirrorR = mirrorL.clone(); mirrorR.position.x = 0.84;

        const doorHandleL = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.12), chromeMat);
        doorHandleL.position.set(-0.78, 1.05, 0.12);
        const doorHandleR = doorHandleL.clone(); doorHandleR.position.x = 0.78;

        // Bak Terbuka di Belakang dengan Pintu Bak (Tailgate)
        const bed = new THREE.Mesh(new THREE.BoxGeometry(1.52, 0.58, 1.65), greyPaint);
        bed.position.set(0, 0.82, -1.02); bed.castShadow = true;
        const tailgate = new THREE.Mesh(new THREE.BoxGeometry(1.48, 0.45, 0.08), greyPaint);
        tailgate.position.set(0, 0.85, -1.86);

        // Lampu Belakang Merah (Taillights)
        const tailL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.22, 0.04), getMat(0xD32F2F));
        tailL.position.set(-0.72, 0.85, -1.86);
        const tailR = tailL.clone(); tailR.position.x = 0.72;

        // Muatan 1: Tumpukan Karung Goni Gandum Diikat Tali Pengaman
        const s1 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.3, 1), getMat(0xD7CCC8));
        s1.position.set(-0.35, 1.22, -0.85); s1.castShadow = true;
        const s2 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.28, 1), getMat(0xBCAAA4));
        s2.position.set(0.35, 1.22, -0.85); s2.castShadow = true;
        const sTop = new THREE.Mesh(new THREE.DodecahedronGeometry(0.26, 1), getMat(0xD7CCC8));
        sTop.position.set(0, 1.48, -0.85); sTop.castShadow = true;

        // Tali Pengikat Muatan (Cargo Tie-down Rope)
        const rope = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 1.4, 4), getMat(0xD7CCC8));
        rope.rotation.z = Math.PI / 2; rope.position.set(0, 1.58, -0.85);

        // Muatan 2: Peti Kayu Buah Apel Merah Segar & Kotak Pasokan Pertanian
        const boxApples = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.35, 0.55), getMat(0x8D6E63));
        boxApples.position.set(0, 1.18, -1.45); boxApples.castShadow = true;
        for (let a = 0; a < 3; a++) {
            const apple = new THREE.Mesh(new THREE.SphereGeometry(0.07, 6, 6), appleRed);
            apple.position.set((a - 1) * 0.18, 1.38, -1.45);
            root.add(apple);
        }

        root.add(
            hood, grill, hL1, hL2, turnL, turnR,
            cab, windshield, winSideL, winSideR, mirrorL, mirrorR, doorHandleL, doorHandleR,
            bed, tailgate, tailL, tailR,
            s1, s2, sTop, rope, boxApples
        );

        const driver = ModelBuilder3D.createVehicleDriver("pickup");
        driver.position.set(-0.35, 0.88, 0.25);
        driver.visible = false;
        root.add(driver);

        root.userData = { wheels, driver };
        return root;
    }

    // LEVEL 5: TRUK SEDANG BAK KAYU (MEDIUM CARGO STAKE-BED TRUCK)
    // Truk engkel roda enam: kabin tinggi biru, kaca spion besar, gril & bumper besi,
    // tangga naik kabin, bak panel kayu bertekstur & rangka besi, penutup terpal terlipat rapi di atas,
    // muatan sangat padat bertingkat: peti sayur, karung goni, keranjang, dan drum.
    static createDeliveryMediumTruck() {
        const root = new THREE.Group();
        root.name = "deliveryMediumTruck";

        const cabBlue = getMat(0x1565C0, 0.35, 0.4); // Biru cerah ekspedisi
        const darkChassis = getMat(0x212121, 0.8, 0.1);
        const woodStake = getMat(0x8D6E63, 0.85, 0.05);
        const chromeMat = getMat(0xE0E0E0, 0.15, 0.85);
        const rubberBlack = getMat(0x212121, 0.9, 0.05);
        const tarpGreen = getMat(0x2E7D32, 0.7, 0.1); // Terpal hijau kanvas tahan air

        const wheels = [];
        const createTruckWheel = (x, z) => {
            const wGroup = new THREE.Group();
            const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.44, 0.32, 16), rubberBlack);
            tire.rotation.z = Math.PI / 2; tire.castShadow = true;
            const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.34, 10), darkChassis);
            hub.rotation.z = Math.PI / 2;
            wGroup.add(tire, hub);
            wGroup.position.set(x, 0.44, z);
            wheels.push(wGroup);
            return wGroup;
        };

        // 6 Roda: 2 Depan + 4 Belakang Gandeng (Dual Wheels Tandem)
        const wFL = createTruckWheel(-0.96, 1.6);
        const wFR = createTruckWheel(0.96, 1.6);
        const wRL1 = createTruckWheel(-0.96, -0.8);
        const wRR1 = createTruckWheel(0.96, -0.8);
        const wRL2 = createTruckWheel(-0.96, -1.55);
        const wRR2 = createTruckWheel(0.96, -1.55);
        root.add(wFL, wFR, wRL1, wRR1, wRL2, wRR2);

        // Sasis Baja Panjang (Ladder Chassis) & Bumper Depan Besi Kokoh
        const chassis = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.35, 5.1), darkChassis);
        chassis.position.set(0, 0.52, 0.2); root.add(chassis);

        const bumper = new THREE.Mesh(new THREE.BoxGeometry(1.98, 0.32, 0.25), chromeMat);
        bumper.position.set(0, 0.48, 2.45); root.add(bumper);

        // Kabin Truk Biru Tinggi (Cabover Forward Control)
        const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.88, 1.5, 1.45), cabBlue);
        cabin.position.set(0, 1.52, 1.68); cabin.castShadow = true;

        // Kaca Depan Lebar, Wiper & Sun Visor Pelindung Panas
        const windshield = new THREE.Mesh(new THREE.BoxGeometry(1.68, 0.68, 0.05), getMat(0x81D4FA, 0.15, 0.9));
        windshield.position.set(0, 1.68, 2.41);
        const wiper1 = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.03, 0.02), darkChassis);
        wiper1.rotation.z = 0.25; wiper1.position.set(-0.35, 1.48, 2.44);
        const wiper2 = wiper1.clone(); wiper2.position.x = 0.35;

        const visor = new THREE.Mesh(new THREE.BoxGeometry(1.78, 0.16, 0.32), darkChassis);
        visor.position.set(0, 2.18, 2.34);

        // Gril Depan Berlapis Garis & Lampu Kabut
        const grill = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.42, 0.06), darkChassis);
        grill.position.set(0, 0.92, 2.42);

        // Spion Truk Besar Bertangkai Panjang (Kiri & Kanan)
        const mirrorArmL = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.55, 6), darkChassis);
        mirrorArmL.position.set(-1.08, 1.65, 2.1);
        const mirrorGlassL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.35, 0.16), chromeMat);
        mirrorGlassL.position.set(-1.08, 1.65, 2.1);
        const mirrorArmR = mirrorArmL.clone(); mirrorArmR.position.x = 1.08;
        const mirrorGlassR = mirrorGlassL.clone(); mirrorGlassR.position.x = 1.08;

        // Tangga Kecil Pijakan Kaki (Footsteps) Naik Kabin
        const stepL = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.04, 0.35), darkChassis);
        stepL.position.set(-1.02, 0.42, 1.6);
        const stepR = stepL.clone(); stepR.position.x = 1.02;

        // Bak Belakang Panel Kayu Bertekstur dengan Rangka Besi (Wooden Stake Bed)
        const bedFloor = new THREE.Mesh(new THREE.BoxGeometry(1.95, 0.16, 3.3), woodStake);
        bedFloor.position.set(0, 0.92, -0.92);

        // Tiang Rangka Besi Sudut & Panel Kayu Berpalang
        const wallL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.0, 3.3), woodStake);
        wallL.position.set(-0.94, 1.48, -0.92); wallL.castShadow = true;
        const wallR = wallL.clone(); wallR.position.x = 0.94;
        const wallFront = new THREE.Mesh(new THREE.BoxGeometry(1.95, 1.0, 0.08), woodStake);
        wallFront.position.set(0, 1.48, 0.72);
        const wallBack = wallFront.clone(); wallBack.position.z = -2.55;

        // Penutup Terpal Hijau Kanvas yang Terlipat Rapi di Atas Bagian Depan Bak
        const tarpRoll = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 1.88, 12), tarpGreen);
        tarpRoll.rotation.z = Math.PI / 2; tarpRoll.position.set(0, 2.05, 0.65);
        tarpRoll.castShadow = true;
        // Tali Pengikat Terpal
        const strap1 = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.19, 0.04, 12), darkChassis);
        strap1.rotation.z = Math.PI / 2; strap1.position.set(-0.5, 2.05, 0.65);
        const strap2 = strap1.clone(); strap2.position.x = 0.5;

        // Muatan Sangat Padat Bertingkat (Peti Sayur Hijau, Karung Goni, Drum Hasil Panen)
        for (let row = 0; row < 2; row++) {
            for (let col = -1; col <= 1; col++) {
                const crate = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.35, 0.88), getMat(0x43A047, 0.7));
                crate.position.set(col * 0.58, 1.15 + row * 0.38, -0.95 + (col % 2) * 0.2);
                crate.castShadow = true;
                root.add(crate);
            }
        }
        // Tong/Drum Hasil Tani Kayu di Sisi Belakang
        const barrel1 = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.55, 10), woodStake);
        barrel1.position.set(-0.45, 1.25, -2.1); barrel1.castShadow = true;
        const barrel2 = barrel1.clone(); barrel2.position.x = 0.45;
        // Karung Gandum Tambahan di Atas
        const topSack = new THREE.Mesh(new THREE.DodecahedronGeometry(0.28, 1), getMat(0xD7CCC8));
        topSack.position.set(0, 1.95, -1.1); topSack.castShadow = true;

        root.add(
            cabin, windshield, wiper1, wiper2, visor, grill,
            mirrorArmL, mirrorGlassL, mirrorArmR, mirrorGlassR, stepL, stepR,
            bedFloor, wallL, wallR, wallFront, wallBack,
            tarpRoll, strap1, strap2, barrel1, barrel2, topSack
        );

        const driver = ModelBuilder3D.createVehicleDriver("truck");
        driver.position.set(-0.45, 1.25, 1.65);
        driver.visible = false;
        root.add(driver);

        root.userData = { wheels, driver };
        return root;
    }

    // LEVEL 6: TRUK KONTAINER BESAR (HEAVY SEMI-TRAILER CONTAINER TRUCK)
    // Truk semi-trailer 10-roda megah: kepala truk merah ber-moncong panjang, knalpot vertikal krom ganda,
    // spion besar & klakson angin atap, penghubung fifth wheel, kontainer biru besi bergelombang (corrugated),
    // pintu belakang ganda dengan palang pengunci krom, dan logo pertanian melingkar emas.
    static createDeliveryContainerTruck() {
        const root = new THREE.Group();
        root.name = "deliveryContainerTruck";

        const cabRed = getMat(0xD32F2F, 0.35, 0.4); // Merah traktor kontainer
        const containerBlue = getMat(0x1976D2, 0.45, 0.3); // Biru laut kontainer ekspor
        const chromeMat = getMat(0xECEFF1, 0.1, 0.9);
        const darkSteel = getMat(0x212121, 0.8, 0.1);
        const rubberBlack = getMat(0x212121, 0.9, 0.05);

        const wheels = [];
        const createBigWheel = (x, z) => {
            const wGroup = new THREE.Group();
            const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.48, 0.36, 18), rubberBlack);
            tire.rotation.z = Math.PI / 2; tire.castShadow = true;
            const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.38, 12), chromeMat);
            cap.rotation.z = Math.PI / 2;
            wGroup.add(tire, cap);
            wGroup.position.set(x, 0.48, z);
            wheels.push(wGroup);
            return wGroup;
        };

        // 10 Roda: 2 Roda Depan Traktor + 4 Roda Belakang Traktor + 4 Roda Tandem Kontainer
        const wFL = createBigWheel(-1.08, 2.7);
        const wFR = createBigWheel(1.08, 2.7);
        const wTL1 = createBigWheel(-1.08, 0.7);
        const wTR1 = createBigWheel(1.08, 0.7);
        const wTL2 = createBigWheel(-1.08, -0.22);
        const wTR2 = createBigWheel(1.08, -0.22);

        const wTrL1 = createBigWheel(-1.08, -2.6);
        const wTrR1 = createBigWheel(1.08, -2.6);
        const wTrL2 = createBigWheel(-1.08, -3.55);
        const wTrR2 = createBigWheel(1.08, -3.55);
        root.add(wFL, wFR, wTL1, wTR1, wTL2, wTR2, wTrL1, wTrR1, wTrL2, wTrR2);

        // ==========================================
        // 1. KEPALA TRUK TRAKTOR MERAH (SEMI TRACTOR CAB)
        // ==========================================
        const tractorCab = new THREE.Mesh(new THREE.BoxGeometry(2.05, 1.88, 2.05), cabRed);
        tractorCab.position.set(0, 1.72, 1.9); tractorCab.castShadow = true;

        // Moncong Mesin Depan Panjang (Classic Long-Nose Hood)
        const hood = new THREE.Mesh(new THREE.BoxGeometry(1.82, 1.05, 1.45), cabRed);
        hood.position.set(0, 1.18, 3.15); hood.castShadow = true;

        // Gril Radiator Krom Vertikal Raksasa & Bumper Krom Baja
        const grill = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.9, 0.12), chromeMat);
        grill.position.set(0, 1.18, 3.88);
        const bumper = new THREE.Mesh(new THREE.BoxGeometry(2.18, 0.38, 0.28), chromeMat);
        bumper.position.set(0, 0.5, 3.85); root.add(bumper);

        // Kaca Depan Ganda & Kaca Samping
        const windshield = new THREE.Mesh(new THREE.BoxGeometry(1.72, 0.68, 0.05), getMat(0x81D4FA, 0.15, 0.9));
        windshield.position.set(0, 1.95, 2.94);

        // Klakson Angin Krom Ganda di Atas Atap & Lampu Kuning Indikator
        const hornL = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.02, 0.55, 8), chromeMat);
        hornL.rotation.x = Math.PI / 2; hornL.position.set(-0.55, 2.74, 2.2);
        const hornR = hornL.clone(); hornR.position.x = 0.55;

        // Pipa Knalpot Krom Vertikal Ganda (Dual Towering Vertical Chrome Stacks)
        const pipeL = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 2.5, 10), chromeMat);
        pipeL.position.set(-1.08, 2.25, 1.05);
        const heatShieldL = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, 1.2, 10), darkSteel);
        heatShieldL.position.set(-1.08, 1.75, 1.05);
        const pipeR = pipeL.clone(); pipeR.position.x = 1.08;
        const heatShieldR = heatShieldL.clone(); heatShieldR.position.x = 1.08;

        // Tangki Solar Silinder Krom Samping Kiri & Kanan
        const fuelTankL = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 1.2, 14), chromeMat);
        fuelTankL.rotation.x = Math.PI / 2; fuelTankL.position.set(-1.05, 0.55, 1.7);
        const fuelTankR = fuelTankL.clone(); fuelTankR.position.x = 1.05;

        // Kaca Spion Tanduk Besar Krom (West Coast Mirrors)
        const mirrorL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.42, 0.18), chromeMat);
        mirrorL.position.set(-1.18, 1.88, 2.45);
        const mirrorR = mirrorL.clone(); mirrorR.position.x = 1.18;

        // Penghubung Piringan Gandengan (Fifth Wheel Hitch)
        const fifthWheel = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.12, 12), darkSteel);
        fifthWheel.position.set(0, 0.85, 0.2); root.add(fifthWheel);

        // ==========================================
        // 2. SASIS & GANDENGAN KONTAINER (TRAILER CHASSIS)
        // ==========================================
        const trailerChassis = new THREE.Mesh(new THREE.BoxGeometry(2.15, 0.38, 5.9), darkSteel);
        trailerChassis.position.set(0, 0.65, -1.8); root.add(trailerChassis);

        // Kaki Penopang Trailer (Landing Gear)
        const legL = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.65, 0.12), darkSteel);
        legL.position.set(-0.85, 0.38, 0.45);
        const legR = legL.clone(); legR.position.x = 0.85;

        // ==========================================
        // 3. KOTAK KONTAINER BIRU BERGELOMBANG RAKSASA (40ft CORRUGATED CONTAINER)
        // ==========================================
        const container = new THREE.Mesh(new THREE.BoxGeometry(2.18, 2.28, 5.5), containerBlue);
        container.position.set(0, 2.02, -1.8); container.castShadow = true; container.receiveShadow = true;

        // Tulang Besi Bergelombang (Vertical Corrugated Ribs) di Dinding Kontainer
        for (let r = -2.4; r <= 2.4; r += 0.4) {
            const ribL = new THREE.Mesh(new THREE.BoxGeometry(0.04, 2.1, 0.14), containerBlue);
            ribL.position.set(-1.11, 2.02, -1.8 + r);
            const ribR = ribL.clone(); ribR.position.x = 1.11;
            root.add(ribL, ribR);
        }

        // Pintu Belakang Ganda dengan Sepasang Palang Pengunci Krom (Rear Locking Bars)
        const lockBar1 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 2.05, 8), chromeMat);
        lockBar1.position.set(-0.35, 2.02, -4.58);
        const lockBar2 = lockBar1.clone(); lockBar2.position.x = 0.35;
        const lockHandle1 = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.04, 0.06), chromeMat);
        lockHandle1.position.set(-0.35, 1.6, -4.6);
        const lockHandle2 = lockHandle1.clone(); lockHandle2.position.x = 0.35;

        // Pelindung Belakang Bawah (Rear Underride Guard) & Garis Hazard Reflektif
        const rearBumper = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.15, 0.12), darkSteel);
        rearBumper.position.set(0, 0.48, -4.6); root.add(rearBumper);
        const rearLights = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.08, 0.04), getMat(0xD32F2F));
        rearLights.position.set(0, 0.48, -4.67); root.add(rearLights);

        // Logo Peternakan Melingkar Emas di Samping Kontainer (Farm Seal)
        const logoGeo = new THREE.CylinderGeometry(0.68, 0.68, 0.04, 20);
        logoGeo.rotateZ(Math.PI / 2);
        const logoL = new THREE.Mesh(logoGeo, getMat(0xFBC02D, 0.4, 0.6));
        logoL.position.set(-1.12, 2.1, -1.8);
        const logoR = logoL.clone(); logoR.position.x = 1.12;

        root.add(
            tractorCab, hood, grill, windshield, hornL, hornR,
            pipeL, heatShieldL, pipeR, heatShieldR, fuelTankL, fuelTankR, mirrorL, mirrorR,
            legL, legR, container, lockBar1, lockBar2, lockHandle1, lockHandle2, logoL, logoR
        );

        const driver = ModelBuilder3D.createVehicleDriver("container");
        driver.position.set(-0.45, 1.45, 2.15);
        driver.visible = false;
        root.add(driver);

        root.userData = { wheels, driver };
        return root;
    }

    static createGrassTuft(type = "green") {
        const root = new THREE.Group();
        // Rumput hijau lebat atau bunga liar ungu pedesaan (persis foto referensi ladang ayam)
        const col = (type === "purple") ? 0x7E57C2 : (type === "wildflower" ? 0xAB47BC : 0x43A047);
        const mat = getMat(col, 0.85, 0.0);

        const count = 7;
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2 + (Math.random() * 0.4 - 0.2);
            const h = 0.35 + Math.random() * 0.3;
            const blade = new THREE.Mesh(new THREE.ConeGeometry(0.035, h, 3), mat);
            blade.position.set(Math.cos(angle) * 0.1, h / 2, Math.sin(angle) * 0.1);
            blade.rotation.x = (Math.random() * 0.35 + 0.15);
            blade.rotation.y = angle;
            blade.castShadow = true;
            root.add(blade);
        }
        return root;
    }

    static createGroundItemMesh(type) {
        const root = new THREE.Group();
        let mesh;
        if (type === "egg") {
            // Telur Ayam Cantik di Atas Bantalan Jerami Emas (Persis Ikon Misi & Foto Referensi)
            const eggGroup = new THREE.Group();
            
            // Alas jerami mini
            const strawMat = getMat(0xE6B800, 0.85, 0.0);
            const strawBase = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.07, 6, 12), strawMat);
            strawBase.rotation.x = Math.PI / 2;
            strawBase.position.y = 0.05;
            strawBase.receiveShadow = true;
            eggGroup.add(strawBase);

            // Telur ayam lonjong halus
            const geo = new THREE.SphereGeometry(0.22, 14, 12);
            geo.scale(0.85, 1.25, 0.85);
            const eggMesh = new THREE.Mesh(geo, getMat(0xFFFAF0, 0.45, 0.05));
            eggMesh.rotation.z = 0.22;
            eggMesh.position.y = 0.22;
            eggMesh.castShadow = true;
            eggGroup.add(eggMesh);

            mesh = eggGroup;
        } else if (type === "milk") {
            // Botol Susu Kaca Segar Bertutup Biru
            const bottleGroup = new THREE.Group();
            const glassMat = getMat(0xFFFFFF, 0.3, 0.2);
            const bottleBody = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 0.36, 10), glassMat);
            bottleBody.position.y = 0.20;
            bottleBody.castShadow = true;
            bottleGroup.add(bottleBody);

            const capMat = getMat(0x0288D1, 0.4, 0.1);
            const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.08, 10), capMat);
            cap.position.y = 0.40;
            cap.castShadow = true;
            bottleGroup.add(cap);

            mesh = bottleGroup;
        } else if (type === "wool") {
            // Gumpalan Wol Hampshire Puffy Lebat & Lembut (Fluffy Wool Clump)
            const woolGroup = new THREE.Group();
            const woolMat = getMat(0xFDFEFE, 0.95, 0.0);
            const mainLobe = new THREE.Mesh(new THREE.SphereGeometry(0.20, 10, 8), woolMat);
            mainLobe.position.y = 0.22;
            mainLobe.castShadow = true;
            woolGroup.add(mainLobe);

            const puffOffsets = [
                { x: 0.12, y: 0.22, z: 0.08, r: 0.13 },
                { x: -0.12, y: 0.20, z: -0.06, r: 0.12 },
                { x: 0.05, y: 0.28, z: -0.08, r: 0.11 },
                { x: -0.06, y: 0.25, z: 0.10, r: 0.12 }
            ];
            puffOffsets.forEach(p => {
                const puff = new THREE.Mesh(new THREE.SphereGeometry(p.r, 8, 6), woolMat);
                puff.position.set(p.x, p.y, p.z);
                puff.castShadow = true;
                woolGroup.add(puff);
            });

            mesh = woolGroup;
        } else if (type === "cheese") {
            mesh = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.16, 6), getMat(Colors3D.cheese));
            mesh.position.y = 0.2;
            mesh.castShadow = true;
        } else if (type === "mayo") {
            mesh = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.32, 8), getMat(Colors3D.mayo));
            mesh.position.y = 0.22;
            mesh.castShadow = true;
        } else if (type === "meat") {
            const steak = new THREE.Group();
            const meatCore = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.1, 0.22), getMat(0xD32F2F));
            const meatBone = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.12, 6), getMat(0xFFFAF0));
            meatBone.position.set(-0.12, 0, 0);
            steak.add(meatCore, meatBone);
            steak.position.y = 0.18;
            steak.castShadow = true;
            mesh = steak;
        } else if (type === "golden_yarn") {
            const spool = new THREE.Group();
            const goldThread = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.28, 12), getMat(0xFFD700, 0.2, 0.8));
            const woodCore = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.04, 12), getMat(0x8D6E63));
            woodCore.position.y = 0.15;
            const woodCoreB = woodCore.clone(); woodCoreB.position.y = -0.15;
            spool.add(goldThread, woodCore, woodCoreB);
            spool.position.y = 0.22;
            spool.castShadow = true;
            mesh = spool;
        } else {
            // fabric / Benang Gulung
            const spool = new THREE.Group();
            const thread = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.26, 10), getMat(0xE0E0E0, 0.8));
            const capT = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.03, 10), getMat(0x5D4037));
            capT.position.y = 0.14;
            const capB = capT.clone(); capB.position.y = -0.14;
            spool.add(thread, capT, capB);
            spool.position.y = 0.2;
            spool.castShadow = true;
            mesh = spool;
        }
        root.add(mesh);

        // Lingkaran Interaksi Lembut di Tanah
        const ring = new THREE.Mesh(
            new THREE.RingGeometry(0.25, 0.36, 16),
            new THREE.MeshBasicMaterial({ color: 0xFFE082, side: THREE.DoubleSide, transparent: true, opacity: 0.4 })
        );
        ring.rotation.x = -Math.PI / 2;
        ring.position.y = 0.02;
        root.add(ring);
        root.userData = { mesh, ring };
        return root;
    }

    // ==========================================
    // 11B. PAPAN MISI HARIAN 3D (DAILY QUEST NOTICE BOARD)
    // Persis Foto Referensi media_1794423944018_32f52c0d.jpg:
    // Tiang kayu kokoh, atap genteng sirap abu-abu, header "Misi Harian",
    // serta 3 kertas poster (Telur di Sarang, Botol Susu Bercahaya, Keju Biru Kosmik).
    // ==========================================
    static createDailyQuestBoard() {
        const root = new THREE.Group();
        root.name = "dailyQuestBoard";

        const woodDark = getMat(0x2E1C11, 0.8, 0.1);
        const roofMat = getMat(Colors3D.roofSlate, 0.7, 0.1);

        // 1. Tiang Kayu Penyangga Kiri & Kanan (Sturdy Timber Posts)
        const postGeo = new THREE.BoxGeometry(0.24, 3.2, 0.24);
        const postL = new THREE.Mesh(postGeo, woodDark);
        postL.position.set(-1.22, 1.6, 0); postL.castShadow = true;
        const postR = postL.clone(); postR.position.x = 1.22;

        // Kaki Tiang Berbentuk Balok Baja Hitam (Foot Brackets)
        const baseGeo = new THREE.BoxGeometry(0.38, 0.2, 0.38);
        const baseL = new THREE.Mesh(baseGeo, getMat(0x212121, 0.8));
        baseL.position.set(-1.22, 0.1, 0);
        const baseR = baseL.clone(); baseR.position.x = 1.22;

        // 2. Papan Pengumuman Kayu Utama (Bulletin Board Frame & Backing)
        const frameMesh = new THREE.Mesh(new THREE.BoxGeometry(2.68, 1.55, 0.14), woodDark);
        frameMesh.position.set(0, 1.9, 0); frameMesh.castShadow = true;

        // 3. Tekstur Wajah Papan: "Misi Harian" + 3 Poster (Telur, Susu, Keju)
        const canvas = document.createElement("canvas");
        canvas.width = 1024;
        canvas.height = 576;
        const ctx = canvas.getContext("2d");

        // Background Papan Kayu Cokelat Gelap Bertekstur
        ctx.fillStyle = "#351E10";
        ctx.fillRect(0, 0, 1024, 576);

        // Garis-garis Papan Kayu Horisontal
        ctx.strokeStyle = "#241309";
        ctx.lineWidth = 4;
        for (let y = 48; y < 576; y += 48) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(1024, y); ctx.stroke();
        }

        // Header Papan Kayu Atas: "Misi Harian"
        ctx.fillStyle = "#221107";
        ctx.fillRect(16, 16, 992, 104);
        ctx.strokeStyle = "#4D2813";
        ctx.lineWidth = 6;
        ctx.strokeRect(16, 16, 992, 104);

        ctx.fillStyle = "#FFFFFF";
        ctx.shadowColor = "#000000";
        ctx.shadowBlur = 12;
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 4;
        ctx.font = "bold 68px 'Segoe UI', Arial, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Misi Harian", 512, 68);
        ctx.shadowColor = "transparent";

        // Gambar 3 Kertas Poster Papan Misi (Persis Foto media_1794423944018_32f52c0d.jpg)
        const drawParchment = (x, y, w, h, iconType) => {
            // Bayangan Kertas
            ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
            ctx.fillRect(x + 6, y + 8, w, h);

            // Kertas Krem Perkamen
            ctx.fillStyle = "#FBF4E2";
            ctx.fillRect(x, y, w, h);
            ctx.strokeStyle = "#D2B889";
            ctx.lineWidth = 4;
            ctx.strokeRect(x, y, w, h);

            // Pin / Paku Emas di Atas Kertas
            ctx.fillStyle = "#FFD700";
            ctx.beginPath();
            ctx.arc(x + w / 2, y + 14, 8, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = "#795548";
            ctx.lineWidth = 2;
            ctx.stroke();

            // Ilustrasi Ikon di Dalam Kertas
            const cx = x + w / 2;
            const cy = y + h / 2 + 10;

            if (iconType === "egg") {
                // Sarang Jerami Kuning
                ctx.fillStyle = "#D79A2B";
                ctx.beginPath();
                ctx.ellipse(cx, cy + 35, 60, 24, 0, 0, Math.PI * 2);
                ctx.fill();
                // Telur Ayam Putih
                ctx.fillStyle = "#FFFFFF";
                ctx.beginPath();
                ctx.ellipse(cx, cy + 10, 42, 54, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = "#D7CCC8";
                ctx.lineWidth = 3;
                ctx.stroke();
            } else if (iconType === "milk") {
                // Aura Berkilau Ungu/Pink
                ctx.fillStyle = "rgba(225, 190, 231, 0.5)";
                ctx.beginPath();
                ctx.arc(cx, cy + 10, 65, 0, Math.PI * 2);
                ctx.fill();
                // Botol Susu Kaca
                ctx.fillStyle = "#FFFFFF";
                ctx.fillRect(cx - 24, cy - 10, 48, 65);
                ctx.fillStyle = "#90CAF9";
                ctx.fillRect(cx - 16, cy - 35, 32, 25);
                // Tutup Botol
                ctx.fillStyle = "#E91E63";
                ctx.fillRect(cx - 18, cy - 42, 36, 10);
            } else {
                // Keju Biru Kosmik (Cosmic Blue Cheese)
                ctx.fillStyle = "#1A237E";
                ctx.beginPath();
                ctx.moveTo(cx - 55, cy + 35);
                ctx.lineTo(cx + 55, cy + 35);
                ctx.lineTo(cx + 35, cy - 35);
                ctx.lineTo(cx - 45, cy - 20);
                ctx.closePath();
                ctx.fill();
                ctx.strokeStyle = "#3949AB";
                ctx.lineWidth = 4;
                ctx.stroke();
                // Lubang Keju Kuning Bercahaya
                ctx.fillStyle = "#FFD54F";
                [[cx - 20, cy + 10, 10], [cx + 15, cy - 5, 12], [cx + 10, cy + 20, 8]].forEach(([hx, hy, hr]) => {
                    ctx.beginPath(); ctx.arc(hx, hy, hr, 0, Math.PI * 2); ctx.fill();
                });
            }
        };

        drawParchment(70, 138, 240, 385, "egg");
        drawParchment(392, 138, 240, 385, "milk");
        drawParchment(714, 138, 240, 385, "cheese");

        const boardTex = new THREE.CanvasTexture(canvas);
        boardTex.minFilter = THREE.LinearFilter;
        const boardMat = new THREE.MeshBasicMaterial({ map: boardTex });
        const facePlane = new THREE.Mesh(new THREE.PlaneGeometry(2.46, 1.4), boardMat);
        facePlane.position.set(0, 1.9, 0.08);
        root.add(facePlane);

        // 4. Atap Kanopi Sirap Kayu / Genteng Abu-Abu Klasik (Gabled Shingles Roof)
        const roofRidge = new THREE.Mesh(new THREE.BoxGeometry(2.95, 0.16, 0.82), roofMat);
        roofRidge.position.set(0, 2.94, 0); roofRidge.castShadow = true;
        
        // Kemiringan Atap Depan & Belakang
        const roofFront = new THREE.Mesh(new THREE.PlaneGeometry(2.95, 0.58), roofMat);
        roofFront.rotation.x = Math.PI / 4; roofFront.position.set(0, 2.84, 0.23);
        const roofBack = new THREE.Mesh(new THREE.PlaneGeometry(2.95, 0.58), roofMat);
        roofBack.rotation.x = -Math.PI / 4; roofBack.position.set(0, 2.84, -0.23);

        // Balok Kayu Penopang Atap
        const beamGeo = new THREE.BoxGeometry(0.12, 0.12, 0.6);
        const beamL = new THREE.Mesh(beamGeo, woodDark); beamL.position.set(-1.22, 2.72, 0);
        const beamR = beamL.clone(); beamR.position.x = 1.22;

        root.add(postL, postR, baseL, baseR, frameMesh, roofRidge, roofFront, roofBack, beamL, beamR);
        return root;
    }

    // ==========================================
    // 12. GEROBAK TOKO HEWAN (ANIMAL SHOP CART) - Persis Foto Referensi
    // ==========================================
    static createAnimalShopCart() {
        const root = new THREE.Group();
        root.name = "animalShopCart";

        const woodDark = getMat(0x3E2723, 0.75, 0.1);
        const woodPlank = getMat(0x5D4037, 0.7, 0.1);
        const woodTrim = getMat(0x271915, 0.8, 0.1);

        // A. 4 Roda Gerobak Kayu Beruji (Spoked Cart Wheels)
        const wheelGeo = new THREE.TorusGeometry(0.42, 0.045, 8, 20);
        const hubGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.12, 12);
        hubGeo.rotateZ(Math.PI / 2);

        const createWheel = () => {
            const wGroup = new THREE.Group();
            const rim = new THREE.Mesh(wheelGeo, woodDark);
            rim.castShadow = true;
            const hub = new THREE.Mesh(hubGeo, woodTrim);
            hub.castShadow = true;
            wGroup.add(rim, hub);

            // 8 Ruji Kayu
            for (let i = 0; i < 8; i++) {
                const angle = (i * Math.PI) / 4;
                const spoke = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.8, 6), woodDark);
                spoke.rotation.z = angle;
                spoke.castShadow = true;
                wGroup.add(spoke);
            }
            return wGroup;
        };

        const wFL = createWheel(); wFL.position.set(-0.85, 0.42, 0.75);
        const wFR = createWheel(); wFR.position.set(0.85, 0.42, 0.75);
        const wBL = createWheel(); wBL.position.set(-0.85, 0.42, -0.75);
        const wBR = createWheel(); wBR.position.set(0.85, 0.42, -0.75);
        root.add(wFL, wFR, wBL, wBR);

        // As Roda (Axles)
        const axleF = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.6, 8), woodTrim);
        axleF.rotation.x = Math.PI / 2;
        axleF.position.set(0, 0.42, 0.75);
        const axleB = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.6, 8), woodTrim);
        axleB.rotation.x = Math.PI / 2;
        axleB.position.set(0, 0.42, -0.75);
        root.add(axleF, axleB);

        // B. Bak Gerobak & Meja Dagang (Cart Body & Table Counter)
        const cartBody = new THREE.Mesh(new THREE.BoxGeometry(1.65, 0.45, 1.25), woodPlank);
        cartBody.position.set(0, 0.72, 0);
        cartBody.castShadow = true; cartBody.receiveShadow = true;
        root.add(cartBody);

        // Papan Meja Counter Atas
        const tableTop = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.08, 1.45), woodDark);
        tableTop.position.set(0, 0.98, 0);
        tableTop.castShadow = true; tableTop.receiveShadow = true;
        root.add(tableTop);

        // C. Papan Nama "TOKO HEWAN" di Depan Gerobak (Persis Foto Referensi)
        const signCanvas = document.createElement("canvas");
        signCanvas.width = 512;
        signCanvas.height = 140;
        const sctx = signCanvas.getContext("2d");
        // Bingkai Papan Kayu Hitam
        sctx.fillStyle = "#1E120B";
        sctx.fillRect(0, 0, 512, 140);
        sctx.fillStyle = "#5D3A1F";
        sctx.fillRect(10, 10, 492, 120);
        // Teks TOKO HEWAN
        sctx.fillStyle = "#FFFFFF";
        sctx.strokeStyle = "#000000";
        sctx.lineWidth = 6;
        sctx.font = "900 56px 'Segoe UI', Arial, sans-serif";
        sctx.textAlign = "center";
        sctx.textBaseline = "middle";
        sctx.strokeText("TOKO HEWAN", 256, 70);
        sctx.fillText("TOKO HEWAN", 256, 70);

        const signTex = new THREE.CanvasTexture(signCanvas);
        const signMat = new THREE.MeshStandardMaterial({ map: signTex, roughness: 0.6 });
        const signMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 0.38), signMat);
        signMesh.position.set(0, 0.74, 0.64);
        root.add(signMesh);

        // D. 4 Tiang Penyangga Kanopi Kayu (Canopy Corner Posts)
        const postGeo = new THREE.BoxGeometry(0.08, 1.35, 0.08);
        const pFL = new THREE.Mesh(postGeo, woodDark); pFL.position.set(-0.8, 1.65, 0.6);
        const pFR = new THREE.Mesh(postGeo, woodDark); pFR.position.set(0.8, 1.65, 0.6);
        const pBL = new THREE.Mesh(postGeo, woodDark); pBL.position.set(-0.8, 1.65, -0.6);
        const pBR = new THREE.Mesh(postGeo, woodDark); pBR.position.set(0.8, 1.65, -0.6);
        [pFL, pFR, pBL, pBR].forEach(p => { p.castShadow = true; root.add(p); });

        // E. Kanopi Tenda Garis Merah-Putih Bergelombang (Red & White Striped Awning)
        const awningCanvas = document.createElement("canvas");
        awningCanvas.width = 512;
        awningCanvas.height = 512;
        const actx = awningCanvas.getContext("2d");
        const stripeW = 64;
        for (let x = 0; x < 512; x += stripeW * 2) {
            actx.fillStyle = "#D32F2F"; // Merah cerah
            actx.fillRect(x, 0, stripeW, 512);
            actx.fillStyle = "#F5F5F5"; // Putih bersih
            actx.fillRect(x + stripeW, 0, stripeW, 512);
        }
        const awningTex = new THREE.CanvasTexture(awningCanvas);
        awningTex.wrapS = THREE.RepeatWrapping;
        awningTex.wrapT = THREE.RepeatWrapping;
        const awningMat = new THREE.MeshStandardMaterial({
            map: awningTex,
            roughness: 0.6,
            side: THREE.DoubleSide
        });

        // Struktur Atap Segitiga Pelana Kanopi
        const roofL = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.06, 0.95), awningMat);
        roofL.rotation.x = 0.42;
        roofL.position.set(0, 2.45, 0.38);
        roofL.castShadow = true;
        const roofR = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.06, 0.95), awningMat);
        roofR.rotation.x = -0.42;
        roofR.position.set(0, 2.45, -0.38);
        roofR.castShadow = true;
        root.add(roofL, roofR);

        // Renda / Rumbai Kain Bergelombang Menggantung di Depan (Scalloped Valence)
        const valenceGeo = new THREE.BoxGeometry(2.1, 0.28, 0.04);
        const valenceF = new THREE.Mesh(valenceGeo, awningMat);
        valenceF.position.set(0, 2.22, 0.78);
        valenceF.castShadow = true;
        const valenceB = new THREE.Mesh(valenceGeo, awningMat);
        valenceB.position.set(0, 2.22, -0.78);
        root.add(valenceF, valenceB);

        // F. Lampu Lentera Bersinar Biru / Cyan di Meja (Glowing Magic Lanterns - Persis Foto)
        [-0.45, 0, 0.45].forEach((lx) => {
            const baseMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 0.12, 8), woodTrim);
            baseMesh.position.set(lx, 1.08, 0.35);
            baseMesh.castShadow = true;

            const ringGlow = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.03, 8), getMat(0xFFD54F, 0.2, 0.8));
            ringGlow.position.set(lx, 1.15, 0.35);

            const bulbMat = new THREE.MeshBasicMaterial({ color: 0x40E0D0 }); // Cyan turquoise glow
            const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.11, 12, 10), bulbMat);
            bulb.position.set(lx, 1.25, 0.35);

            root.add(baseMesh, ringGlow, bulb);
        });

        // Cahaya Titik Bersinar Halus (Soft Cyan Cart Light)
        const cartLight = new THREE.PointLight(0x00E5FF, 1.4, 5.0);
        cartLight.position.set(0, 1.5, 0.4);
        root.add(cartLight);

        return root;
    }

    // ==========================================
    // 14. POHON PINUS CEMARA REALISTIS (PERSIS SCREENSHOT REFERENSI)
    // Batang kayu bertekstur, akar mengembang, dan 5 tingkat daun berundak rimbun
    // ==========================================
    static createRealisticPineTree(scale = 1.0) {
        const root = new THREE.Group();
        root.name = "realisticPineTree";

        const woodBark = getMat(0x3B2219, 0.85, 0.05);
        const foliageDark = getMat(0x1B4332, 0.9, 0.0);
        const foliageMid = getMat(0x2D6A4F, 0.88, 0.0);
        const foliageLight = getMat(0x40916C, 0.85, 0.0);
        const foliageTop = getMat(0x52B788, 0.85, 0.0);

        // Batang Pohon
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.55, 3.4, 8), woodBark);
        trunk.position.y = 1.7;
        trunk.castShadow = true;
        trunk.receiveShadow = true;
        root.add(trunk);

        // Tonjolan Akar di Permukaan Tanah
        for (let i = 0; i < 3; i++) {
            const ang = (i * Math.PI * 2) / 3;
            const rootMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.22, 0.9, 6), woodBark);
            rootMesh.rotation.z = 0.55;
            rootMesh.rotation.y = ang;
            rootMesh.position.set(Math.cos(ang) * 0.38, 0.2, Math.sin(ang) * 0.38);
            rootMesh.castShadow = true;
            root.add(rootMesh);
        }

        // 5 Tingkat Dedaunan Pinus Berundak Rimbun (Foliage Tiers)
        const tiers = [
            { r: 2.3, h: 2.2, y: 2.6, mat: foliageDark },
            { r: 1.95, h: 2.0, y: 3.8, mat: foliageMid },
            { r: 1.6, h: 1.8, y: 4.9, mat: foliageMid },
            { r: 1.25, h: 1.6, y: 6.0, mat: foliageLight },
            { r: 0.8, h: 1.4, y: 7.0, mat: foliageTop }
        ];

        tiers.forEach((t, idx) => {
            const cone = new THREE.Mesh(new THREE.ConeGeometry(t.r, t.h, 7), t.mat);
            cone.position.y = t.y;
            cone.rotation.y = idx * 0.45;
            cone.castShadow = true;
            cone.receiveShadow = true;
            root.add(cone);
        });

        if (scale !== 1.0) {
            root.scale.set(scale, scale, scale);
        }

        return root;
    }

    // ==========================================
    // 15. DINDING GUNUNG PEMBATAS MAP BERGAYA LOW-POLY HIJAU & HUTAN MUSIM GUGUR
    // Sesuai persis dengan gambar referensi media_1794700384525_9a1c9c3e.jpg:
    // - Lereng perbukitan dan punggung gunung bertingkat hijau asri (faceted low-poly meadow green)
    // - Puncak bebatuan slate dengan sentuhan salju/kabut lembut di kejauhan
    // - Kaki gunung dipenuhi karpet pohon musim gugur merah, jingga, kuning keemasan, persik, dan pinus hijau
    // ==========================================
    // ==========================================
    // 15. DINDING PEGUNUNGAN HIJAU BERGELOMBANG LEMBUT (ROLLING GREEN MOUNTAINS)
    // Sesuai Persis dengan Foto Referensi media_1794703007921_45c0d6f3.jpg:
    // - Puncak MEMBULAT HALUS & BERGELOMBANG (TIDAK LANCIP, Bebas Kerucut Lancip!)
    // - Lapisan Ganda Realistis: Pegunungan Jauh (Sage Green) & Perbukitan Dekat (Lush Meadow Olive)
    // - Kaki gunung dipenuhi pepohonan musim gugur (merah, jingga, kuning) & pohon pinus cemara
    // ==========================================
    static createMountainRidge(width = 34, height = 26, depth = 22, variant = 0) {
        const root = new THREE.Group();
        root.name = `mountainRidge_v${variant}`;

        // Helper fungsi pembuat jajaran punggungan gunung bergelombang bebas lancip
        const buildRollingRidge = (w, d, h, seed, color, roughness = 0.90) => {
            const segX = 18;
            const segZ = 10;
            const geo = new THREE.PlaneGeometry(w, d, segX, segZ);
            geo.rotateX(-Math.PI / 2);

            const pos = geo.attributes.position;
            for (let i = 0; i < pos.count; i++) {
                const x = pos.getX(i);
                const z = pos.getZ(i);

                const u = (x + w / 2) / w; // 0 s.d. 1 sepanjang punggungan
                const v = (z + d / 2) / d; // 0 di belakang, 1 di depan tanah

                // Profil melengkung kubah/parabola di sumbu Z: Tepi depan dan belakang melandai mulus ke tanah (y = 0)
                const crossProfile = Math.pow(Math.sin(v * Math.PI), 0.75);

                // Gelombang sinus harmonik lembut sepanjang X: Menghasilkan puncak-puncak bulat melengkung (BUKAN LANCIP)
                const wave1 = Math.sin(u * Math.PI * 2.0 + seed);
                const wave2 = Math.cos(u * Math.PI * 4.0 + seed * 1.5) * 0.40;
                const wave3 = Math.sin(u * Math.PI * 1.0 + seed * 0.7) * 0.28;
                const ridgeProfile = 0.60 + 0.30 * wave1 + 0.16 * wave2 + 0.12 * wave3;

                // Variasi mikro untuk sudut facet low-poly realistis
                const facetJitter = Math.sin(u * 14 + seed) * Math.cos(v * 12 + seed) * 0.14;

                let vertH = h * crossProfile * (ridgeProfile + facetJitter);
                if (vertH < 0.05) vertH = 0.0;
                pos.setY(i, vertH);

                // Sedikit distorsi horizontal organik
                if (v > 0.05 && v < 0.95 && u > 0.05 && u < 0.95) {
                    pos.setX(i, x + Math.sin(v * 7 + seed) * 0.5);
                    pos.setZ(i, z + Math.cos(u * 6 + seed) * 0.5);
                }
            }
            geo.computeVertexNormals();

            const mat = new THREE.MeshStandardMaterial({
                color: color,
                roughness: roughness,
                flatShading: true
            });
            const mesh = new THREE.Mesh(geo, mat);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            return mesh;
        };

        // 1. LAYER GUNUNG LATAR BELAKANG JAUH (Distant Sage Green Mountain Range)
        const backColor = 0x547558; // Warna sage hijau keabuan pegunungan jauh
        const backRidge = buildRollingRidge(width * 1.18, depth * 1.25, height * 1.15, variant * 1.7 + 0.5, backColor, 0.92);
        backRidge.position.set(0, 0, -depth * 0.35);
        root.add(backRidge);

        // 2. LAYER PERBUKITAN LERENG DEPAN (Foreground Rolling Green Foothills)
        const frontColor = 0x58873E; // Warna hijau rumput segar perbukitan depan
        const frontRidge = buildRollingRidge(width * 0.98, depth * 0.9, height * 0.72, variant * 2.3 + 1.2, frontColor, 0.88);
        frontRidge.position.set((variant % 2 === 0 ? 1 : -1) * 2.5, 0, depth * 0.1);
        root.add(frontRidge);

        // 3. KARPET PEPOHONAN ASRI DI KAKI GUNUNG & LERENG (Sesuai Foto media_1794703007921_45c0d6f3.jpg)
        const autumnMats = [
            new THREE.MeshStandardMaterial({ color: 0xD84315, roughness: 0.85, flatShading: true }), // Merah mapel
            new THREE.MeshStandardMaterial({ color: 0xEF6C00, roughness: 0.85, flatShading: true }), // Oranye menyala
            new THREE.MeshStandardMaterial({ color: 0xFBC02D, roughness: 0.85, flatShading: true }), // Kuning keemasan
            new THREE.MeshStandardMaterial({ color: 0xFF8A65, roughness: 0.85, flatShading: true }), // Persik hangat
            new THREE.MeshStandardMaterial({ color: 0x2E7D32, roughness: 0.88, flatShading: true }), // Pinus hijau segar
            new THREE.MeshStandardMaterial({ color: 0x1B5E20, roughness: 0.88, flatShading: true })  // Cemara gelap
        ];
        const trunkMat = getMat(0x4A2E1B, 0.9, 0.0);

        for (let i = 0; i < 20; i++) {
            const frac = i / 19;
            const treeX = -width * 0.44 + frac * (width * 0.88) + (Math.sin(i * 3.2) * 1.8);
            const treeZ = depth * 0.32 + (Math.sin(i * 1.4) * 2.5);
            const treeY = 0.4 + (Math.sin(i * 2.1) * 0.4);
            const tScale = 0.85 + Math.abs(Math.sin(i * 2.7)) * 0.45;
            const mat = autumnMats[i % autumnMats.length];

            const treeGroup = new THREE.Group();
            treeGroup.position.set(treeX, treeY, treeZ);

            const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.16 * tScale, 0.24 * tScale, 1.4 * tScale, 6), trunkMat);
            trunk.position.y = 0.7 * tScale;
            treeGroup.add(trunk);

            if (i % 3 === 2) {
                // Pohon Pinus Hijau / Cemara
                [1.3, 0.95, 0.6].forEach((r, idx) => {
                    const pineCone = new THREE.Mesh(new THREE.ConeGeometry(r * tScale, 1.0 * tScale, 6), mat);
                    pineCone.position.y = (1.1 + idx * 0.65) * tScale;
                    treeGroup.add(pineCone);
                });
            } else {
                // Pohon Musim Gugur Rindang Bermahkota Dodecahedron
                const c1 = new THREE.Mesh(new THREE.DodecahedronGeometry(1.15 * tScale, 1), mat);
                c1.position.set(0, 1.7 * tScale, 0);
                const c2 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.85 * tScale, 1), mat);
                c2.position.set(0.32 * tScale, 2.2 * tScale, 0.15 * tScale);
                const c3 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.75 * tScale, 1), mat);
                c3.position.set(-0.28 * tScale, 2.0 * tScale, -0.15 * tScale);
                treeGroup.add(c1, c2, c3);
            }

            treeGroup.castShadow = true;
            root.add(treeGroup);
        }

        return root;
    }

    // 16. Sudut Gunung Raksasa untuk Menutup 4 Sudut Peta (Rolling Low-Poly Massif)
    static createMountainCorner(size = 46, height = 35) {
        const root = new THREE.Group();
        root.name = "mountainCorner";

        const slopeDark = new THREE.MeshStandardMaterial({ color: 0x486B33, roughness: 0.92, flatShading: true });
        const slopeMid = new THREE.MeshStandardMaterial({ color: 0x547558, roughness: 0.90, flatShading: true });
        const slopeLight = new THREE.MeshStandardMaterial({ color: 0x6E9552, roughness: 0.86, flatShading: true });

        // Fondasi Sudut Bertingkat Membulat
        const cornerBase = new THREE.Mesh(new THREE.CylinderGeometry(size * 0.40, size * 0.62, height * 0.65, 12, 1), slopeDark);
        cornerBase.position.set(0, (height * 0.65) / 2, 0);
        cornerBase.castShadow = true;
        cornerBase.receiveShadow = true;
        root.add(cornerBase);

        // Kubah Puncak Sudut Membulat Halus (BUKAN KERUCUT LANCIP)
        const dome1 = new THREE.Mesh(new THREE.SphereGeometry(size * 0.36, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.5), slopeMid);
        dome1.position.set(-size * 0.08, height * 0.62, -size * 0.08);
        dome1.scale.set(1.0, 0.72, 1.0);
        dome1.castShadow = true;
        root.add(dome1);

        const dome2 = new THREE.Mesh(new THREE.SphereGeometry(size * 0.28, 10, 8, 0, Math.PI * 2, 0, Math.PI * 0.5), slopeLight);
        dome2.position.set(size * 0.16, height * 0.48, size * 0.14);
        dome2.scale.set(1.0, 0.65, 1.0);
        dome2.castShadow = true;
        root.add(dome2);

        return root;
    }

    // 17. Awan Kumulus Lembut Mengapung di Langit Horizon (Soft Peach-White Cumulus Clouds)
    static createFluffyCloud(scale = 1.0) {
        const root = new THREE.Group();
        root.name = "fluffyCloud";

        const cloudMat = new THREE.MeshStandardMaterial({
            color: 0xF6E7D8, // Awan kumulus persik-krem hangat khas sore hari (media_1794700384525_9a1c9c3e.jpg)
            roughness: 0.75,
            flatShading: true,
            transparent: true,
            opacity: 0.92
        });

        const spheres = [
            { x: 0, y: 0, z: 0, r: 2.8 },
            { x: -2.2, y: -0.4, z: 0, r: 2.2 },
            { x: 2.2, y: -0.4, z: 0.2, r: 2.3 },
            { x: -1.0, y: 1.2, z: -0.2, r: 2.0 },
            { x: 1.1, y: 1.1, z: 0.1, r: 1.9 },
            { x: 0, y: -0.6, z: 0.6, r: 2.0 }
        ];

        spheres.forEach(s => {
            const m = new THREE.Mesh(new THREE.DodecahedronGeometry(s.r * scale, 1), cloudMat);
            m.position.set(s.x * scale, s.y * scale, s.z * scale);
            root.add(m);
        });

        return root;
    }

    // 18. Barikade Pintu Masuk Kandang Terkunci (Locked Paddock Gate Barricade)
    static createLockedPaddockBarrier(title = "Kandang Terkunci", cost = 150) {
        const root = new THREE.Group();
        root.name = "lockedPaddockBarrier";

        const woodDark = getMat(0x3E2723, 0.9, 0.05);
        const woodPlank = getMat(0x6D4C41, 0.85, 0.05);
        const ironMat = getMat(0x455A64, 0.5, 0.5);
        const brassMat = getMat(0xFFD700, 0.3, 0.7);

        // 1. Dua Tiang Kayu Kokoh Penopang Barikade
        const postL = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 1.8, 8), woodDark);
        postL.position.set(-1.8, 0.9, 0); postL.castShadow = true;
        const postR = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 1.8, 8), woodDark);
        postR.position.set(1.8, 0.9, 0); postR.castShadow = true;
        root.add(postL, postR);

        // 2. Palang Kayu Silang Menghalangi Pintu Masuk (Crossed Planks)
        const bar1 = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.2, 0.08), woodPlank);
        bar1.rotation.z = 0.22; bar1.position.set(0, 0.9, 0.05); bar1.castShadow = true;
        const bar2 = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.2, 0.08), woodPlank);
        bar2.rotation.z = -0.22; bar2.position.set(0, 0.9, -0.05); bar2.castShadow = true;
        const barH = new THREE.Mesh(new THREE.BoxGeometry(3.9, 0.22, 0.08), woodPlank);
        barH.position.set(0, 1.25, 0.08); barH.castShadow = true;
        root.add(bar1, bar2, barH);

        // 3. Rantai Besi & Gembok Emas / Kuningan Besar (Padlock & Chains)
        const chainL = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.04, 8, 12), ironMat);
        chainL.position.set(-0.12, 0.95, 0.14); chainL.rotation.y = 0.3;
        const chainR = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.04, 8, 12), ironMat);
        chainR.position.set(0.12, 0.95, 0.14); chainR.rotation.y = -0.3;

        const lockBody = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.32, 0.14), brassMat);
        lockBody.position.set(0, 0.88, 0.18); lockBody.castShadow = true;
        const lockShackle = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.035, 8, 10, Math.PI), ironMat);
        lockShackle.position.set(0, 1.04, 0.18); lockShackle.rotation.z = Math.PI;
        root.add(chainL, chainR, lockBody, lockShackle);

        // 4. Sprite Papan Pengumuman Kayu Menampilkan Status Terkunci & Harga
        const canvas = document.createElement("canvas");
        canvas.width = 512;
        canvas.height = 192;
        const ctx = canvas.getContext("2d");

        // Papan Kayu Bergaris Emas
        ctx.fillStyle = "#2D1802";
        ctx.fillRect(0, 0, 512, 192);
        ctx.fillStyle = "#4E342E";
        ctx.fillRect(8, 8, 496, 176);
        ctx.lineWidth = 6;
        ctx.strokeStyle = "#FFD54F";
        ctx.strokeRect(12, 12, 488, 168);

        ctx.fillStyle = "#FF6B6B";
        ctx.font = "bold 34px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`🔒 ${title.toUpperCase()}`, 256, 62);

        ctx.fillStyle = "#FFF";
        ctx.font = "bold 26px sans-serif";
        ctx.fillText(`Buka di Toko: Rp ${cost.toLocaleString("id-ID")}`, 256, 114);

        ctx.fillStyle = "#FFD54F";
        ctx.font = "bold 22px sans-serif";
        ctx.fillText(`[ Dekati & Tekan E ]`, 256, 156);

        const tex = new THREE.CanvasTexture(canvas);
        tex.minFilter = THREE.LinearFilter;
        const spriteMat = new THREE.SpriteMaterial({ map: tex, transparent: true });
        const sprite = new THREE.Sprite(spriteMat);
        sprite.scale.set(3.6, 1.35, 1);
        sprite.position.set(0, 1.85, 0);
        root.add(sprite);

        return root;
    }

    // ==========================================
    // RUMAH AYAM PANGGUNG 3D (ELEVATED CHICKEN COOP)
    // Sesuai Persis Foto Referensi (media_1794709109026_137712fc.jpg):
    // 1. Tiang panggung kayu gelap (stilts) di bawah, kolong panggung tinggi 1.05m
    // 2. Dinding papan kayu merah vertikal dengan tiang & lis sudut putih bersih
    // 3. Atap pelana genteng slate/abu-abu gelap berlapis dengan ridge cap hitam
    // 4. Jendela kawat kasa kawat ayam (chicken wire mesh) di dinding samping kiri
    // 5. Jendela loteng segi delapan (octagonal attic window) di segitiga atap depan
    // 6. Pintu masuk depan kanan dengan lis putih & tangga jalan kayu (wooden cleated ramp)
    // 7. Kotak sarang samping (nesting box annex) bertiang panggung, berisi jerami & 6 butir telur
    // 8. Keset kain bertuliskan "EGGS" tebal cokelat di tanah depan tangga
    // 9. Pagar pembatas kayu kecil di sekeliling area khusus 4 ekor ayam
    // ==========================================
    static createElevatedChickenCoop(includeFence = false) {
        const root = new THREE.Group();
        root.name = "elevatedChickenCoop";

        const darkStiltWood = getMat(0x3B2616, 0.9, 0.04);
        const redBarnWallMat = getTexturedMat("weatheredBarnWood", 0xBA2626, 0.88, 0.02, { rx: 2, ry: 2 });
        const whiteTrimMat = getMat(0xF8FAFC, 0.82, 0.02);
        const roofSlateMat = getTexturedMat("mossyShingle", 0x333D48, 0.88, 0.05, { rx: 4, ry: 4 });
        const roofRidgeMat = getMat(0x1F242D, 0.9, 0.02);
        const warmWoodMat = getMat(0x8B5A2B, 0.88, 0.02);
        const rampWoodMat = getMat(0x9C6A3B, 0.88, 0.02);
        const strawMat = getTexturedMat("thatchRoof", Colors3D.thatchGold || 0xE0B84C, 0.92, 0.0, { rx: 3, ry: 3 });
        const eggMat = getMat(0xFAF4E8, 0.72, 0.0);
        const eggBrownMat = getMat(0xF3DFC3, 0.72, 0.0);
        const wireMeshMat = getMat(0x475569, 0.4, 0.5);
        const interiorDarkMat = getMat(0x18100C, 0.95, 0.0);

        // A. TIANG PANGGUNG KAYU GELAP (STILTS & UNDER-HOUSE FRAME)
        const stiltH = 1.05;
        const stiltW = 0.18;
        const halfW = 1.45; // X: -1.45 to +1.45 (Lebar total 2.9m)
        const halfD = 1.15; // Z: -1.15 to +1.15 (Panjang total 2.3m)

        const postGeo = new THREE.BoxGeometry(stiltW, stiltH, stiltW);
        const stiltPositions = [
            [-halfW, stiltH / 2, -halfD],
            [halfW, stiltH / 2, -halfD],
            [-halfW, stiltH / 2, halfD],
            [halfW, stiltH / 2, halfD]
        ];
        stiltPositions.forEach(([sx, sy, sz]) => {
            const stilt = new THREE.Mesh(postGeo, darkStiltWood);
            stilt.position.set(sx, sy, sz);
            stilt.castShadow = true;
            stilt.receiveShadow = true;
            root.add(stilt);
        });

        // Balok Penyangga Horizontal Bawah Panggung (Cross Beams)
        const beamXGeo = new THREE.BoxGeometry(halfW * 2 + stiltW, 0.12, stiltW);
        const beamZGeo = new THREE.BoxGeometry(stiltW, 0.12, halfD * 2);
        const bX1 = new THREE.Mesh(beamXGeo, darkStiltWood); bX1.position.set(0, stiltH - 0.06, -halfD); root.add(bX1);
        const bX2 = new THREE.Mesh(beamXGeo, darkStiltWood); bX2.position.set(0, stiltH - 0.06, halfD); root.add(bX2);
        const bZ1 = new THREE.Mesh(beamZGeo, darkStiltWood); bZ1.position.set(-halfW, stiltH - 0.06, 0); root.add(bZ1);
        const bZ2 = new THREE.Mesh(beamZGeo, darkStiltWood); bZ2.position.set(halfW, stiltH - 0.06, 0); root.add(bZ2);

        // B. DASAR LANTAI & LIS BAWAH PUTIH (BASE APRON & FLOOR)
        const floorGeo = new THREE.BoxGeometry(halfW * 2 + 0.1, 0.12, halfD * 2 + 0.1);
        const floorMesh = new THREE.Mesh(floorGeo, whiteTrimMat);
        floorMesh.position.set(0, stiltH + 0.06, 0);
        floorMesh.castShadow = true;
        floorMesh.receiveShadow = true;
        root.add(floorMesh);

        // C. DINDING UTAMA KAYU MERAH (RED WOODEN WALLS)
        const wallH = 1.7;
        const wallY = stiltH + 0.12 + wallH / 2;

        const backWall = new THREE.Mesh(new THREE.BoxGeometry(halfW * 2, wallH, 0.08), redBarnWallMat);
        backWall.position.set(0, wallY, -halfD);
        backWall.castShadow = true;
        root.add(backWall);

        const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.08, wallH, halfD * 2), redBarnWallMat);
        rightWall.position.set(halfW, wallY, 0);
        rightWall.castShadow = true;
        root.add(rightWall);

        const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.08, wallH, halfD * 2), redBarnWallMat);
        leftWall.position.set(-halfW, wallY, 0);
        leftWall.castShadow = true;
        root.add(leftWall);

        const frontWallLeft = new THREE.Mesh(new THREE.BoxGeometry(halfW + 0.1, wallH, 0.08), redBarnWallMat);
        frontWallLeft.position.set(-halfW / 2 - 0.05, wallY, halfD);
        frontWallLeft.castShadow = true;
        root.add(frontWallLeft);

        const frontWallRight = new THREE.Mesh(new THREE.BoxGeometry(0.5, wallH, 0.08), redBarnWallMat);
        frontWallRight.position.set(halfW - 0.25, wallY, halfD);
        frontWallRight.castShadow = true;
        root.add(frontWallRight);

        const frontWallLintel = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.5, 0.08), redBarnWallMat);
        frontWallLintel.position.set(0.65, wallY + 0.6, halfD);
        frontWallLintel.castShadow = true;
        root.add(frontWallLintel);

        const darkInterior = new THREE.Mesh(new THREE.BoxGeometry(0.85, 1.15, 0.02), interiorDarkMat);
        darkInterior.position.set(0.65, stiltH + 0.12 + 1.15 / 2, halfD - 0.05);
        root.add(darkInterior);

        // D. TIANG & LIS SUDUT PUTIH TEBAL
        const cornerGeo = new THREE.BoxGeometry(0.18, wallH + 0.12, 0.18);
        const corners = [
            [-halfW, wallY, -halfD],
            [halfW, wallY, -halfD],
            [-halfW, wallY, halfD],
            [halfW, wallY, halfD]
        ];
        corners.forEach(([cx, cy, cz]) => {
            const cMesh = new THREE.Mesh(cornerGeo, whiteTrimMat);
            cMesh.position.set(cx, cy, cz);
            cMesh.castShadow = true;
            root.add(cMesh);
        });

        const fasciaX = new THREE.Mesh(new THREE.BoxGeometry(halfW * 2 + 0.2, 0.1, 0.14), whiteTrimMat);
        fasciaX.position.set(0, wallY + wallH / 2, halfD);
        root.add(fasciaX);
        const fasciaBack = new THREE.Mesh(new THREE.BoxGeometry(halfW * 2 + 0.2, 0.1, 0.14), whiteTrimMat);
        fasciaBack.position.set(0, wallY + wallH / 2, -halfD);
        root.add(fasciaBack);

        // E. DINDING SEGITIGA ATAP DEPAN & BELAKANG
        const gableH = 1.05;
        const gablePeakY = wallY + wallH / 2 + gableH;
        const gableShape = new THREE.Shape();
        gableShape.moveTo(-halfW - 0.05, 0);
        gableShape.lineTo(halfW + 0.05, 0);
        gableShape.lineTo(0, gableH);
        gableShape.closePath();

        const extrudeGableOpts = { depth: 0.08, bevelEnabled: false };
        const frontGableGeo = new THREE.ExtrudeGeometry(gableShape, extrudeGableOpts);
        const frontGable = new THREE.Mesh(frontGableGeo, redBarnWallMat);
        frontGable.position.set(0, wallY + wallH / 2, halfD - 0.04);
        frontGable.castShadow = true;
        root.add(frontGable);

        const backGable = new THREE.Mesh(frontGableGeo, redBarnWallMat);
        backGable.position.set(0, wallY + wallH / 2, -halfD - 0.04);
        backGable.castShadow = true;
        root.add(backGable);

        // F. ATAP GENTENG SLATE ABU-ABU GELAP
        const roofPitchAngle = Math.atan2(gableH, halfW + 0.35);
        const roofSlopeLen = Math.hypot(gableH, halfW + 0.35) + 0.35;
        const roofDepth = halfD * 2 + 0.6;

        const roofLeftGroup = new THREE.Group();
        roofLeftGroup.position.set(0, gablePeakY, 0);
        roofLeftGroup.rotation.z = roofPitchAngle;

        const roofLeftPlane = new THREE.Mesh(new THREE.BoxGeometry(roofSlopeLen, 0.08, roofDepth), roofSlateMat);
        roofLeftPlane.position.set(-roofSlopeLen / 2, -0.04, 0);
        roofLeftPlane.castShadow = true;
        roofLeftPlane.receiveShadow = true;
        roofLeftGroup.add(roofLeftPlane);

        for (let i = 1; i <= 6; i++) {
            const ridge = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.04, roofDepth + 0.02), roofRidgeMat);
            ridge.position.set(-i * (roofSlopeLen / 7), 0.02, 0);
            roofLeftGroup.add(ridge);
        }
        root.add(roofLeftGroup);

        const roofRightGroup = new THREE.Group();
        roofRightGroup.position.set(0, gablePeakY, 0);
        roofRightGroup.rotation.z = -roofPitchAngle;

        const roofRightPlane = new THREE.Mesh(new THREE.BoxGeometry(roofSlopeLen, 0.08, roofDepth), roofSlateMat);
        roofRightPlane.position.set(roofSlopeLen / 2, -0.04, 0);
        roofRightPlane.castShadow = true;
        roofRightPlane.receiveShadow = true;
        roofRightGroup.add(roofRightPlane);

        for (let i = 1; i <= 6; i++) {
            const ridge = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.04, roofDepth + 0.02), roofRidgeMat);
            ridge.position.set(i * (roofSlopeLen / 7), 0.02, 0);
            roofRightGroup.add(ridge);
        }
        root.add(roofRightGroup);

        const ridgeCap = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.1, roofDepth + 0.06), roofRidgeMat);
        ridgeCap.position.set(0, gablePeakY + 0.04, 0);
        ridgeCap.castShadow = true;
        root.add(ridgeCap);

        [-1, 1].forEach(side => {
            const barge = new THREE.Mesh(new THREE.BoxGeometry(roofSlopeLen, 0.12, 0.08), whiteTrimMat);
            barge.position.set(side * (roofSlopeLen / 2), gablePeakY - (gableH / 2) * 0.9, halfD + 0.3);
            barge.rotation.z = -side * roofPitchAngle;
            barge.castShadow = true;
            root.add(barge);
        });

        // G. JENDELA LOTENG SEGI DELAPAN DI DEPAN
        const atticWinGroup = new THREE.Group();
        atticWinGroup.position.set(0.2, wallY + wallH / 2 + 0.52, halfD + 0.06);

        const octOuter = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.06, 8), whiteTrimMat);
        octOuter.rotation.x = Math.PI / 2;
        atticWinGroup.add(octOuter);

        const octInner = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.07, 8), interiorDarkMat);
        octInner.rotation.x = Math.PI / 2;
        atticWinGroup.add(octInner);
        root.add(atticWinGroup);

        // H. JENDELA KAWAT KASA DI DINDING KIRI
        const sideWinGroup = new THREE.Group();
        sideWinGroup.position.set(-halfW - 0.05, wallY + 0.1, 0.1);
        sideWinGroup.rotation.y = -Math.PI / 2;

        const winFrame = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.85, 0.06), whiteTrimMat);
        sideWinGroup.add(winFrame);
        const winBacking = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.7, 0.07), interiorDarkMat);
        sideWinGroup.add(winBacking);
        const mullion = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.75, 0.08), whiteTrimMat);
        sideWinGroup.add(mullion);

        for (let gx = -0.42; gx <= 0.42; gx += 0.14) {
            const wireV = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.68, 4), wireMeshMat);
            wireV.position.set(gx, 0, 0.04);
            sideWinGroup.add(wireV);
        }
        for (let gy = -0.28; gy <= 0.28; gy += 0.14) {
            const wireH = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.96, 4), wireMeshMat);
            wireH.rotation.z = Math.PI / 2;
            wireH.position.set(0, gy, 0.04);
            sideWinGroup.add(wireH);
        }
        root.add(sideWinGroup);

        // I. PINTU MASUK DEPAN KANAN & TANGGA KAYU
        const doorX = 0.65;
        const doorFrameW = 0.85;
        const doorFrameH = 1.25;

        const doorFrameTop = new THREE.Mesh(new THREE.BoxGeometry(doorFrameW + 0.14, 0.1, 0.1), whiteTrimMat);
        doorFrameTop.position.set(doorX, stiltH + 0.12 + doorFrameH, halfD + 0.04);
        root.add(doorFrameTop);

        const doorFrameL = new THREE.Mesh(new THREE.BoxGeometry(0.09, doorFrameH, 0.1), whiteTrimMat);
        doorFrameL.position.set(doorX - doorFrameW / 2 - 0.02, stiltH + 0.12 + doorFrameH / 2, halfD + 0.04);
        root.add(doorFrameL);

        const doorFrameR = new THREE.Mesh(new THREE.BoxGeometry(0.09, doorFrameH, 0.1), whiteTrimMat);
        doorFrameR.position.set(doorX + doorFrameW / 2 + 0.02, stiltH + 0.12 + doorFrameH / 2, halfD + 0.04);
        root.add(doorFrameR);

        // Tangga Papan Kayu Menurun ke Tanah
        const rampStartY = stiltH + 0.1;
        const rampEndY = 0.04;
        const rampStartZ = halfD + 0.04;
        const rampEndZ = halfD + 1.85;
        const rampLen = Math.hypot(rampEndZ - rampStartZ, rampStartY - rampEndY);
        const rampAngle = Math.atan2(rampStartY - rampEndY, rampEndZ - rampStartZ);

        const rampPlank = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.07, rampLen), rampWoodMat);
        rampPlank.position.set(doorX, (rampStartY + rampEndY) / 2, (rampStartZ + rampEndZ) / 2);
        rampPlank.rotation.x = rampAngle;
        rampPlank.castShadow = true;
        rampPlank.receiveShadow = true;
        root.add(rampPlank);

        const cleatCount = 7;
        for (let i = 1; i <= cleatCount; i++) {
            const frac = i / (cleatCount + 1);
            const cy = rampStartY - frac * (rampStartY - rampEndY) + 0.04;
            const cz = rampStartZ + frac * (rampEndZ - rampStartZ);
            const cleat = new THREE.Mesh(new THREE.BoxGeometry(0.74, 0.04, 0.08), darkStiltWood);
            cleat.position.set(doorX, cy, cz);
            cleat.rotation.x = rampAngle;
            cleat.castShadow = true;
            root.add(cleat);
        }

        // J. KOTAK SARANG PENGERAMAN SAMPING
        const nestBoxW = 1.35;
        const nestBoxD = 0.85;
        const nestBoxH = 0.75;
        const nestBoxBaseY = 0.75;
        const nestBoxX = -0.55;
        const nestBoxZ = halfD + nestBoxD / 2;

        [-nestBoxW / 2 + 0.1, nestBoxW / 2 - 0.1].forEach(nx => {
            const leg = new THREE.Mesh(new THREE.BoxGeometry(0.12, nestBoxBaseY, 0.12), darkStiltWood);
            leg.position.set(nestBoxX + nx, nestBoxBaseY / 2, nestBoxZ + nestBoxD / 2 - 0.08);
            leg.castShadow = true;
            root.add(leg);
        });

        const nestBoxBody = new THREE.Mesh(new THREE.BoxGeometry(nestBoxW, nestBoxH * 0.75, nestBoxD), warmWoodMat);
        nestBoxBody.position.set(nestBoxX, nestBoxBaseY + (nestBoxH * 0.75) / 2, nestBoxZ);
        nestBoxBody.castShadow = true;
        root.add(nestBoxBody);

        const nestBoxBack = new THREE.Mesh(new THREE.BoxGeometry(nestBoxW, nestBoxH, 0.06), warmWoodMat);
        nestBoxBack.position.set(nestBoxX, nestBoxBaseY + nestBoxH / 2, nestBoxZ - nestBoxD / 2 + 0.03);
        root.add(nestBoxBack);

        const lidLen = nestBoxD + 0.15;
        const lidAngle = 0.38;
        const nestLid = new THREE.Mesh(new THREE.BoxGeometry(nestBoxW + 0.12, 0.06, lidLen), roofSlateMat);
        nestLid.position.set(nestBoxX, nestBoxBaseY + nestBoxH + 0.02, nestBoxZ);
        nestLid.rotation.x = lidAngle;
        nestLid.castShadow = true;
        root.add(nestLid);

        const nestStrawBed = new THREE.Mesh(new THREE.BoxGeometry(nestBoxW - 0.15, 0.22, nestBoxD - 0.15), strawMat);
        nestStrawBed.position.set(nestBoxX, nestBoxBaseY + 0.32, nestBoxZ + 0.02);
        nestStrawBed.receiveShadow = true;
        root.add(nestStrawBed);

        const eggGeo = new THREE.SphereGeometry(0.08, 12, 10);
        eggGeo.scale(0.85, 1.25, 0.85);

        const nestEggOffsets = [
            [-0.32, 0.06, -0.08, 0.2],
            [-0.15, 0.07, 0.12, -0.3],
            [0.05, 0.08, -0.05, 0.1],
            [0.22, 0.07, 0.08, -0.2],
            [-0.05, 0.11, 0.02, 0.0],
            [0.35, 0.06, -0.1, 0.25]
        ];
        nestEggOffsets.forEach(([ex, ey, ez, rotZ], idx) => {
            const egg = new THREE.Mesh(eggGeo, idx % 2 === 0 ? eggMat : eggBrownMat);
            egg.position.set(nestBoxX + ex, nestBoxBaseY + 0.42 + ey, nestBoxZ + ez);
            egg.rotation.set(0.2, 0, rotZ);
            egg.castShadow = true;
            root.add(egg);
        });

        // K. KESET LANTAI TEBAL BERTULISAN "EGGS"
        const matTex = (window.FarmTextures && window.FarmTextures.getEggsMatTexture)
            ? window.FarmTextures.getEggsMatTexture()
            : null;
        const matMaterial = matTex
            ? new THREE.MeshStandardMaterial({ map: matTex, roughness: 0.85, metalness: 0.02 })
            : getMat(0xEADBBD, 0.85, 0.02);

        const matGeo = new THREE.PlaneGeometry(1.6, 0.88);
        const eggsMat = new THREE.Mesh(matGeo, matMaterial);
        eggsMat.rotation.x = -Math.PI / 2;
        eggsMat.position.set(0.1, 0.02, halfD + 2.15);
        eggsMat.receiveShadow = true;
        root.add(eggsMat);

        // L. JERAMI TABUR & TELUR TERCECER DI DEKAT TANGGA
        for (let i = 0; i < 16; i++) {
            const angle = Math.random() * Math.PI * 2;
            const dist = Math.random() * 0.9 + 0.2;
            const sx = 0.1 + Math.cos(angle) * dist;
            const sz = (halfD + 2.15) + Math.sin(angle) * (dist * 0.6);
            const wisp = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.015, 0.03), strawMat);
            wisp.position.set(sx, 0.025, sz);
            wisp.rotation.y = Math.random() * Math.PI;
            root.add(wisp);
        }

        [
            [doorX - 0.45, 0.05, rampEndZ - 0.1, 0.3],
            [doorX + 0.25, 0.05, rampEndZ + 0.2, -0.2],
            [nestBoxX + 0.4, 0.05, rampEndZ - 0.3, 0.1]
        ].forEach(([ex, ey, ez, rz], idx) => {
            const groundEgg = new THREE.Mesh(eggGeo, idx % 2 === 0 ? eggMat : eggBrownMat);
            groundEgg.position.set(ex, ey, ez);
            groundEgg.rotation.set(0.1, Math.random(), rz);
            groundEgg.castShadow = true;
            root.add(groundEgg);
        });

        // M. PAGAR PEMBATAS KAYU RUSTIC DI SEKELILING RUMAH AYAM (OPSIONAL)
        if (includeFence) {
            const fenceWoodMat = getMat(0x6D4C41, 0.9, 0.02);
            const postH = 0.85;
            const postRadius = 0.07;
            const fencePostGeo = new THREE.CylinderGeometry(postRadius, postRadius, postH, 8);

            const fMinX = -2.7;
            const fMaxX = 2.4;
            const fMinZ = -2.2;
            const fMaxZ = 3.6;

            const fencePostCoords = [
                [fMinX, fMinZ], [0, fMinZ], [fMaxX, fMinZ],
                [fMinX, (fMinZ + fMaxZ) / 2], [fMaxX, (fMinZ + fMaxZ) / 2],
                [fMinX, fMaxZ], [-0.8, fMaxZ], [1.3, fMaxZ], [fMaxX, fMaxZ]
            ];
            fencePostCoords.forEach(([px, pz]) => {
                const fp = new THREE.Mesh(fencePostGeo, fenceWoodMat);
                fp.position.set(px, postH / 2, pz);
                fp.castShadow = true;
                root.add(fp);
            });

            const addRailsBetween = (x1, z1, x2, z2) => {
                const dx = x2 - x1;
                const dz = z2 - z1;
                const len = Math.hypot(dx, dz);
                const midX = (x1 + x2) / 2;
                const midZ = (z1 + z2) / 2;
                const rotY = Math.atan2(dx, dz);

                [0.32, 0.62].forEach(ry => {
                    const rail = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, len), fenceWoodMat);
                    rail.position.set(midX, ry, midZ);
                    rail.rotation.y = rotY;
                    rail.castShadow = true;
                    root.add(rail);
                });
            };

            addRailsBetween(fMinX, fMinZ, 0, fMinZ);
            addRailsBetween(0, fMinZ, fMaxX, fMinZ);
            addRailsBetween(fMinX, fMinZ, fMinX, (fMinZ + fMaxZ) / 2);
            addRailsBetween(fMinX, (fMinZ + fMaxZ) / 2, fMinX, fMaxZ);
            addRailsBetween(fMaxX, fMinZ, fMaxX, (fMinZ + fMaxZ) / 2);
            addRailsBetween(fMaxX, (fMinZ + fMaxZ) / 2, fMaxX, fMaxZ);
            addRailsBetween(fMinX, fMaxZ, -0.8, fMaxZ);
            addRailsBetween(1.3, fMaxZ, fMaxX, fMaxZ);
        }

        return root;
    }

    // ==========================================
    // BANGUNAN GARASI PENGANTARAN 3D (DELIVERY GARAGE)
    // Sesuai Persis Gambar Referensi (media_1794709542646_112c4141.jpg):
    // 1. Dinding beton abu-abu industri dengan rangka tiang & balok baja hitam/gunmetal
    // 2. Atap seng bergelombang (corrugated metal) dengan aksen noda karat besi & lumut
    // 3. Pintu gerbang garasi besar dengan papan nama bertuliskan "PENGANTARAN / DELIVERY"
    // 4. Jalur masuk-keluar kendaraan (driveway) aspal abu-abu dengan garis kuning batas ambang
    // 5. Area kargo samping berpagar kayu berisi tumpukan peti kayu, karung gandum, drum minyak & tong kayu
    // 6. Tangga kayu kecil (stepladder) di depan area kargo samping
    // ==========================================
    static createDeliveryGarage() {
        const root = new THREE.Group();
        root.name = "deliveryGarage";

        // Material-material
        const concreteWallMat = getMat(0x606972, 0.92, 0.04);
        const steelFrameMat = getMat(0x22262C, 0.6, 0.35);
        const tinRoofMat = getTexturedMat("corrugatedTin", 0x7E8B95, 0.75, 0.25, { rx: 3, ry: 6 });
        const roofRidgeMat = getMat(0x1B1E22, 0.7, 0.3);
        const yellowLineMat = getMat(0xFACC15, 0.5, 0.0);
        const drivewayAsphaltMat = (window.getTexturedMat)
            ? getTexturedMat("asphaltRoad", 0x24282E, 0.88, 0.05, { rx: 1, ry: 2 })
            : getMat(0x24282E, 0.88, 0.05);
        const rusticWoodMat = getMat(0x734F36, 0.88, 0.02);
        const crateWoodMat = getMat(0x9E784F, 0.85, 0.02);
        const drumRedMat = getMat(0x8B3222, 0.55, 0.25);
        const drumGreyMat = getMat(0x3B424D, 0.55, 0.3);
        const sackMat = getTexturedMat("burlapSack", Colors3D.burlap || 0xD2B48C, 0.92, 0.0, { rx: 2, ry: 2 });
        const interiorFloorMat = getMat(0x1E2228, 0.9, 0.05);

        // Dimensi Garasi
        const gW = 5.4;   // Lebar (X)
        const gL = 9.2;   // Panjang (Z)
        const wallH = 3.3; // Tinggi dinding ke eave
        const peakH = 4.5; // Tinggi puncak atap

        // 1. LANTAI DASAR BETON (CONCRETE BASE SLAB - ANCHORED FLUSH TO GROUND)
        const baseSlab = new THREE.Mesh(new THREE.BoxGeometry(gW + 0.2, 0.12, gL + 0.2), concreteWallMat);
        baseSlab.position.set(0, 0.06, 0);
        baseSlab.receiveShadow = true;
        root.add(baseSlab);

        // Lantai interior gelap dalam garasi
        const interiorFloor = new THREE.Mesh(new THREE.BoxGeometry(gW - 0.2, 0.04, gL - 0.2), interiorFloorMat);
        interiorFloor.position.set(0, 0.08, 0);
        interiorFloor.receiveShadow = true;
        root.add(interiorFloor);

        // Lampu interior plafon garasi hangat
        const garageLight = new THREE.PointLight(0xFFE5A0, 1.8, 12);
        garageLight.position.set(0, wallH - 0.3, 0);
        root.add(garageLight);

        // 2. DINDING BETON ABU-ABU (CONCRETE WALL PANELS)
        const halfW = gW / 2;
        const halfL = gL / 2;

        // Dinding Belakang (-Z)
        const backWall = new THREE.Mesh(new THREE.BoxGeometry(gW, wallH, 0.14), concreteWallMat);
        backWall.position.set(0, wallH / 2, -halfL);
        backWall.castShadow = true;
        root.add(backWall);

        // Dinding Kanan (+X)
        const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.14, wallH, gL), concreteWallMat);
        rightWall.position.set(halfW, wallH / 2, 0);
        rightWall.castShadow = true;
        root.add(rightWall);

        // Dinding Kiri (-X)
        const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.14, wallH, gL), concreteWallMat);
        leftWall.position.set(-halfW, wallH / 2, 0);
        leftWall.castShadow = true;
        root.add(leftWall);

        // Dinding Depan (+Z) dengan Bukaan Pintu Gerbang Garasi Besar (Doorway Portal)
        const doorW = 3.4;
        const doorH = 2.65;
        const sidePillarW = (gW - doorW) / 2; // ~1.0m

        // Tiang Dinding Depan Kiri
        const frontWallL = new THREE.Mesh(new THREE.BoxGeometry(sidePillarW, wallH, 0.14), concreteWallMat);
        frontWallL.position.set(-halfW + sidePillarW / 2, wallH / 2, halfL);
        frontWallL.castShadow = true;
        root.add(frontWallL);

        // Tiang Dinding Depan Kanan
        const frontWallR = new THREE.Mesh(new THREE.BoxGeometry(sidePillarW, wallH, 0.14), concreteWallMat);
        frontWallR.position.set(halfW - sidePillarW / 2, wallH / 2, halfL);
        frontWallR.castShadow = true;
        root.add(frontWallR);

        // Balok Atas Pintu (Door Lintel)
        const lintelH = wallH - doorH;
        const frontWallLintel = new THREE.Mesh(new THREE.BoxGeometry(doorW, lintelH, 0.14), concreteWallMat);
        frontWallLintel.position.set(0, doorH + lintelH / 2, halfL);
        frontWallLintel.castShadow = true;
        root.add(frontWallLintel);

        // 3. RANGKA BAJA HITAM STRUKTURAL (DARK STEEL I-BEAM FRAME)
        const beamSize = 0.22;
        const columnGeo = new THREE.BoxGeometry(beamSize, wallH, beamSize);

        // 4 Kolom Sudut Baja
        [
            [-halfW, -halfL], [halfW, -halfL],
            [-halfW, halfL], [halfW, halfL]
        ].forEach(([cx, cz]) => {
            const col = new THREE.Mesh(columnGeo, steelFrameMat);
            col.position.set(cx, wallH / 2, cz);
            col.castShadow = true;
            root.add(col);
        });

        // 4 Kolom Antara di Sisi Dinding Panjang (2 di kiri, 2 di kanan)
        [-halfW, halfW].forEach(sideX => {
            [-halfL / 3, halfL / 3].forEach(midZ => {
                const midCol = new THREE.Mesh(columnGeo, steelFrameMat);
                midCol.position.set(sideX, wallH / 2, midZ);
                midCol.castShadow = true;
                root.add(midCol);
            });
        });

        // Kusen Baja Tebal di Sekeliling Mulut Gerbang Garasi
        const frameColGeo = new THREE.BoxGeometry(0.18, doorH, 0.22);
        const portalL = new THREE.Mesh(frameColGeo, steelFrameMat); portalL.position.set(-doorW / 2, doorH / 2, halfL + 0.04); root.add(portalL);
        const portalR = new THREE.Mesh(frameColGeo, steelFrameMat); portalR.position.set(doorW / 2, doorH / 2, halfL + 0.04); root.add(portalR);
        const portalTop = new THREE.Mesh(new THREE.BoxGeometry(doorW + 0.36, 0.18, 0.22), steelFrameMat);
        portalTop.position.set(0, doorH, halfL + 0.04);
        root.add(portalTop);

        // Balok Horisontal Eaves Fascia Baja di Atas Dinding
        const eavesFasciaX = new THREE.Mesh(new THREE.BoxGeometry(gW + 0.3, 0.16, 0.22), steelFrameMat);
        eavesFasciaX.position.set(0, wallH, halfL + 0.04);
        root.add(eavesFasciaX);

        // 4. ATAP SEGITIGA DEPAN & BELAKANG (GABLE TRIANGLES)
        const gableH = peakH - wallH; // ~1.2m
        const gableShape = new THREE.Shape();
        gableShape.moveTo(-halfW - 0.05, 0);
        gableShape.lineTo(halfW + 0.05, 0);
        gableShape.lineTo(0, gableH);
        gableShape.closePath();

        const frontGableMesh = new THREE.Mesh(new THREE.ExtrudeGeometry(gableShape, { depth: 0.14, bevelEnabled: false }), concreteWallMat);
        frontGableMesh.position.set(0, wallH, halfL - 0.07);
        frontGableMesh.castShadow = true;
        root.add(frontGableMesh);

        const backGableMesh = new THREE.Mesh(new THREE.ExtrudeGeometry(gableShape, { depth: 0.14, bevelEnabled: false }), concreteWallMat);
        backGableMesh.position.set(0, wallH, -halfL - 0.07);
        backGableMesh.castShadow = true;
        root.add(backGableMesh);

        // 5. ATAP SENG BERGELOMBANG BERKARAT (CORRUGATED TIN GABLE ROOF)
        const roofPitch = Math.atan2(gableH, halfW + 0.45);
        const roofSlopeLen = Math.hypot(gableH, halfW + 0.45) + 0.35;
        const roofDepth = gL + 0.8;

        [-1, 1].forEach(side => {
            const roofSide = new THREE.Group();
            roofSide.position.set(0, peakH, 0);
            roofSide.rotation.z = -side * roofPitch;

            const slopeMesh = new THREE.Mesh(new THREE.BoxGeometry(roofSlopeLen, 0.08, roofDepth), tinRoofMat);
            slopeMesh.position.set(side * (roofSlopeLen / 2), -0.04, 0);
            slopeMesh.castShadow = true;
            slopeMesh.receiveShadow = true;
            roofSide.add(slopeMesh);

            // Bargeboard tepi atap
            const barge = new THREE.Mesh(new THREE.BoxGeometry(roofSlopeLen, 0.1, 0.06), steelFrameMat);
            barge.position.set(side * (roofSlopeLen / 2), -0.04, halfL + 0.4);
            roofSide.add(barge);

            root.add(roofSide);
        });

        // Ridge Cap Nok Baja Hitam di Puncak Atap
        const ridgeCap = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.1, roofDepth + 0.06), roofRidgeMat);
        ridgeCap.position.set(0, peakH + 0.05, 0);
        ridgeCap.castShadow = true;
        root.add(ridgeCap);

        // 6. PAPAN NAMA "PENGANTARAN / DELIVERY" PERSIS FOTO REFERENSI
        const signTex = (window.FarmTextures && window.FarmTextures.getDeliverySignTexture)
            ? window.FarmTextures.getDeliverySignTexture()
            : null;
        const signMat = signTex
            ? new THREE.MeshStandardMaterial({ map: signTex, roughness: 0.8, metalness: 0.15 })
            : getMat(0x4A3222, 0.8, 0.1);

        const signMesh = new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.25, 0.08), signMat);
        signMesh.position.set(0, doorH + 0.72, halfL + 0.16);
        signMesh.castShadow = true;
        root.add(signMesh);

        // 7. JALUR AKSES (DRIVEWAY) MENUJU JALAN RAYA DENGAN GARIS KUNING
        // Menjulur ke depan dari pintu gerbang garasi hingga persis tepi jalan raya (4.4 meter)
        const drivewayLen = 4.4;
        const drivewayW = 4.4;
        const drivewayGeo = new THREE.PlaneGeometry(drivewayW, drivewayLen);
        const drivewayMesh = new THREE.Mesh(drivewayGeo, drivewayAsphaltMat);
        drivewayMesh.rotation.x = -Math.PI / 2;
        drivewayMesh.position.set(0, 0.02, halfL + drivewayLen / 2);
        drivewayMesh.receiveShadow = true;
        root.add(drivewayMesh);

        // Garis batas ambang kuning (Yellow Threshold Line) melintang di mulut gerbang garasi
        const yellowLine = new THREE.Mesh(new THREE.PlaneGeometry(doorW + 0.4, 0.18), yellowLineMat);
        yellowLine.rotation.x = -Math.PI / 2;
        yellowLine.position.set(0, 0.03, halfL + 0.12);
        yellowLine.receiveShadow = true;
        root.add(yellowLine);

        // Pagar Pembatas Kayu di Sisi Kiri & Kanan Jalur Masuk Driveway
        // Berhenti sebelum mencapai jalan raya agar manuver belok kendaraan leluasa
        const fencePostGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.9, 8);
        const leftFenceX = -drivewayW / 2;
        const rightFenceX = drivewayW / 2;
        const fenceLen = 3.2;

        [leftFenceX, rightFenceX].forEach(fx => {
            for (let z = halfL + 0.2; z <= halfL + fenceLen; z += 1.5) {
                const fp = new THREE.Mesh(fencePostGeo, rusticWoodMat);
                fp.position.set(fx, 0.45, z);
                fp.castShadow = true;
                root.add(fp);
            }
            [0.35, 0.7].forEach(ry => {
                const rail = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, fenceLen), rusticWoodMat);
                rail.position.set(fx, ry, halfL + fenceLen / 2);
                rail.castShadow = true;
                root.add(rail);
            });
        });

        // Palet Kayu Kecil Berisi Tong & Karung di Samping Pagar Driveway
        const pallet = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.12, 1.2), crateWoodMat);
        pallet.position.set(leftFenceX - 0.7, 0.06, halfL + 2.0);
        pallet.castShadow = true;
        root.add(pallet);

        const pDrum1 = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.75, 12), drumRedMat);
        pDrum1.position.set(leftFenceX - 0.9, 0.48, halfL + 1.8);
        pDrum1.castShadow = true;
        root.add(pDrum1);

        const pCrate = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.45, 0.5), crateWoodMat);
        pCrate.position.set(leftFenceX - 0.5, 0.35, halfL + 2.1);
        pCrate.castShadow = true;
        root.add(pCrate);

        const pSack = new THREE.Mesh(new THREE.SphereGeometry(0.25, 8, 8), sackMat);
        pSack.scale.set(1.0, 0.75, 1.2);
        pSack.position.set(leftFenceX - 0.5, 0.24, halfL + 1.6);
        pSack.castShadow = true;
        root.add(pSack);

        // 8. AREA KARGO SAMPING BERPAGAR KAYU (SIDE CARGO STAGING YARD)
        // Terletak di sisi kanan garasi (+X)
        const yardW = 3.6;
        const yardL = 6.2;
        const yardX = halfW + yardW / 2 + 0.1;
        const yardZ = 0.5;

        // Lantai Area Kargo (Concrete / Packed Ground Slab)
        const yardFloor = new THREE.Mesh(new THREE.BoxGeometry(yardW, 0.1, yardL), concreteWallMat);
        yardFloor.position.set(yardX, 0.05, yardZ);
        yardFloor.receiveShadow = true;
        root.add(yardFloor);

        // Pagar Kayu Rustic Mengelilingi Area Kargo
        const yMinX = halfW + 0.1;
        const yMaxX = halfW + yardW + 0.1;
        const yMinZ = yardZ - yardL / 2;
        const yMaxZ = yardZ + yardL / 2;

        const yardPostCoords = [
            [yMaxX, yMinZ], [yMaxX, (yMinZ + yMaxZ) / 2], [yMaxX, yMaxZ],
            [(yMinX + yMaxX) / 2, yMinZ], [(yMinX + yMaxX) / 2, yMaxZ],
            [yMinX + 1.2, yMaxZ] // ada celah tangga di Z = yMaxZ
        ];
        yardPostCoords.forEach(([px, pz]) => {
            const p = new THREE.Mesh(fencePostGeo, rusticWoodMat);
            p.position.set(px, 0.45, pz);
            p.castShadow = true;
            root.add(p);
        });

        // Rel Pagar Samping
        const addYardRail = (x1, z1, x2, z2) => {
            const dx = x2 - x1;
            const dz = z2 - z1;
            const len = Math.hypot(dx, dz);
            const midX = (x1 + x2) / 2;
            const midZ = (z1 + z2) / 2;
            const rotY = Math.atan2(dx, dz);
            [0.32, 0.65].forEach(ry => {
                const rail = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, len), rusticWoodMat);
                rail.position.set(midX, ry, midZ);
                rail.rotation.y = rotY;
                rail.castShadow = true;
                root.add(rail);
            });
        };
        addYardRail(yMinX, yMinZ, yMaxX, yMinZ);
        addYardRail(yMaxX, yMinZ, yMaxX, yMaxZ);
        addYardRail(yMinX + 1.2, yMaxZ, yMaxX, yMaxZ);

        // Tangga Kayu Kecil (Wooden Stepladder) di Depan Pagar Area Kargo
        const stepGroup = new THREE.Group();
        stepGroup.position.set(yMinX + 0.6, 0, yMaxZ + 0.2);
        stepGroup.rotation.y = Math.PI;

        for (let i = 0; i < 4; i++) {
            const stepY = i * 0.16 + 0.08;
            const stepZ = i * 0.22;
            const stepMesh = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.06, 0.22), rusticWoodMat);
            stepMesh.position.set(0, stepY, stepZ);
            stepMesh.castShadow = true;
            stepGroup.add(stepMesh);
        }
        root.add(stepGroup);

        // Isi Muatan Kargo di Dalam Area Samping:
        // A. Barisan Drum Minyak Merah & Abu-abu di Samping Dinding
        for (let i = 0; i < 4; i++) {
            const drum = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.82, 12), i % 2 === 0 ? drumRedMat : drumGreyMat);
            drum.position.set(yMinX + 0.35, 0.46, yMinZ + 1.2 + i * 0.65);
            drum.castShadow = true;
            root.add(drum);
        }

        // B. Tumpukan Peti Kayu (Stack of Wooden Cargo Crates) di Sudut Belakang
        const crateCoords = [
            [yMaxX - 0.6, 0.35, yMinZ + 0.7, 0.7, 0.6, 0.7],
            [yMaxX - 1.35, 0.35, yMinZ + 0.7, 0.7, 0.6, 0.7],
            [yMaxX - 0.6, 0.35, yMinZ + 1.45, 0.7, 0.6, 0.7],
            [yMaxX - 0.95, 0.88, yMinZ + 1.05, 0.65, 0.5, 0.65]
        ];
        crateCoords.forEach(([cx, cy, cz, cw, ch, cd]) => {
            const cr = new THREE.Mesh(new THREE.BoxGeometry(cw, ch, cd), crateWoodMat);
            cr.position.set(cx, cy, cz);
            cr.castShadow = true;
            root.add(cr);
        });

        // C. Tumpukan Karung Gandum Burlap (Burlap Grain Sacks)
        const sackCoords = [
            [yMaxX - 0.6, 0.18, yMinZ + 2.6],
            [yMaxX - 1.1, 0.18, yMinZ + 2.7],
            [yMaxX - 0.85, 0.42, yMinZ + 2.65],
            [yMaxX - 0.6, 0.18, yMinZ + 3.4],
            [yMaxX - 1.1, 0.18, yMinZ + 3.3]
        ];
        sackCoords.forEach(([sx, sy, sz]) => {
            const sk = new THREE.Mesh(new THREE.SphereGeometry(0.28, 8, 8), sackMat);
            sk.scale.set(1.0, 0.65, 1.25);
            sk.position.set(sx, sy, sz);
            sk.rotation.y = Math.random() * Math.PI;
            sk.castShadow = true;
            root.add(sk);
        });

        // D. Tong Kayu Tradisional di Samping Tangga
        [
            [yMinX + 0.35, 0.4, yMaxZ - 0.6],
            [yMinX + 0.7, 0.4, yMaxZ - 0.5]
        ].forEach(([bx, by, bz]) => {
            const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.28, 0.75, 10), rusticWoodMat);
            barrel.position.set(bx, by, bz);
            barrel.castShadow = true;
            root.add(barrel);
        });

        return root;
    }
}

window.ModelBuilder3D = ModelBuilder3D;
window.getMat = getMat;
window.Colors3D = Colors3D;
