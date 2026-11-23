// 3d_game.js - Engine Dunia 3D Realistis & Hidup (Sesuai Referensi Foto Diorama Pertanian)

class GameEngine3D {
    constructor() {
        this.container = document.getElementById("canvasContainer");
        this.state = window.gameState;
        this.sound = window.soundFX;

        this.scene = null;
        this.camera = null;
        this.renderer = null;

        // Entitas 3D
        this.playerMesh = null;
        this.truckMesh = null;
        this.dogMesh = null;
        this.animalEntities = [];
        this.machineMeshes = {};
        this.groundItemMeshes = [];
        this.interactivePads = [];
        this.particles3D = [];

        // Dual-Camera System (High-Angle Diorama Overview ⇄ Eye-Level First-Person POV)
        this.cameraMode = "overview"; // "overview" | "firstperson"
        this.cameraLookTarget = new THREE.Vector3(0, 1.2, 0);
        this.fpvYaw = Math.PI; // Sudut pandang FPV horizontal
        this.fpvPitch = -0.05; // Sudut pandang FPV vertikal
        this.pointerDownPos = { x: 0, y: 0 };
        this.isPointerDragging = false;
        this.toastTimer = null;

        // Kontrol & Raycasting
        this.keys = {};
        this.mouseTarget = null;
        this.nearestItem = null; // Item telur/panen terdekat untuk aksi [E] Ambil
        this.raycaster = new THREE.Raycaster();
        this.mousePos = new THREE.Vector2();
        this.groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

        this.walkCycle = 0;
        this.idleTime = 0;
        this.joyTimer = 0;
        this.lastTime = performance.now();
        this.saveTimer = 0;

        // Paddock Terkunci & Visibilitas Grup Kandang
        this.cowPaddockGroup = null;
        this.sheepPaddockGroup = null;
        this.chickenPaddockGroup = null;
        this.paddockLockMeshes = { cow: null, sheep: null };
        this.nearCowUnlock = false;
        this.nearSheepUnlock = false;

        // Kontrol Click-to-Move & Status Modal
        this.clickDestination = null;
        this.clickTargetMesh = null;
        this.wasModalOpen = false;
        this.cloudsList = [];

        // Muat data save TERLEBIH DAHULU agar karakter terpilih dan status dunia langsung sinkron
        this.initialLoadResult = this.state.load();

        this.initThree();
        this.buildRealisticWorld();
        this.initInput();
        this.initUI();
    }

    initThree() {
        // 1. Scene dengan Nuansa Atmosfer Pedesaan Hangat & Cerah Alami (Sesuai Foto media_1794700384525_9a1c9c3e.jpg)
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x283849); // Langit senja temaram slate-blue khas pegunungan referensi
        this.scene.fog = new THREE.FogExp2(0x3B4A56, 0.0011); // Efek kabut atmosferik lembut untuk pegunungan lembah luas 3x lipat

        // 2. Kamera Perspektif Isometrik Klasik 2.5D Retro (Telephoto FOV 30°)
        const aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera = new THREE.PerspectiveCamera(30, aspect, 0.1, 850);
        this.camera.position.set(34, 38, 34);
        this.cameraLookTarget.set(5.0, 1.0, 5.0);
        this.camera.lookAt(this.cameraLookTarget);

        // 3. Renderer WebGL High-Definition dengan Bayangan Tegas (Hard Retro Shadows)
        this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFShadowMap; // Hard shadows khas era RTS 90-an

        // Pencahayaan natural linear retro
        this.renderer.toneMapping = THREE.LinearToneMapping;
        this.renderer.toneMappingExposure = 1.05;

        // Pasang canvas tanpa menghapus elemen HUD overlay
        const oldCanvas = this.container.querySelector("canvas");
        if (oldCanvas) oldCanvas.remove();
        this.container.insertBefore(this.renderer.domElement, this.container.firstChild);

        // 4. Pencahayaan Matahari Sore/Pagi Satu Arah (Directional Sun)
        // Memproyeksikan bayangan panjang & tegas ke arah timur/jalan persis foto referensi
        const hemiLight = new THREE.HemisphereLight(0xFFF0DC, 0x36402E, 0.52);
        hemiLight.position.set(0, 50, 0);
        this.scene.add(hemiLight);

        // Matahari dari sudut kiri-atas (West/North-West)
        const sun = new THREE.DirectionalLight(0xFFECC0, 1.25);
        sun.position.set(-65, 55, -35);
        sun.castShadow = true;
        sun.shadow.mapSize.width = 4096;
        sun.shadow.mapSize.height = 4096;
        sun.shadow.camera.near = 1;
        sun.shadow.camera.far = 380;
        const d = 140;
        sun.shadow.camera.left = -d;
        sun.shadow.camera.right = d;
        sun.shadow.camera.top = d;
        sun.shadow.camera.bottom = -d;
        sun.shadow.bias = -0.0004;
        this.scene.add(sun);

        // Cahaya Pengisi Lembut
        const fillLight = new THREE.DirectionalLight(0x90B8D0, 0.18);
        fillLight.position.set(20, 15, 20);
        this.scene.add(fillLight);

        // Marker Denyut Lingkaran untuk Click-to-Move di Tanah
        const clickGroup = new THREE.Group();
        const ringGeo = new THREE.RingGeometry(0.35, 0.50, 32);
        const ringMat = new THREE.MeshBasicMaterial({ color: 0x00E5FF, side: THREE.DoubleSide, transparent: true, opacity: 0.85 });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = -Math.PI / 2;
        clickGroup.add(ring);
        const centerDot = new THREE.Mesh(new THREE.CircleGeometry(0.12, 16), new THREE.MeshBasicMaterial({ color: 0xFFFFFF, side: THREE.DoubleSide, transparent: true, opacity: 0.9 }));
        centerDot.rotation.x = -Math.PI / 2;
        clickGroup.add(centerDot);
        clickGroup.position.set(0, 0.05, 0);
        clickGroup.visible = false;
        this.scene.add(clickGroup);
        this.clickTargetMesh = clickGroup;

        // Handler Ubah Ukuran Layar
        window.addEventListener("resize", () => {
            if (!this.container || !this.renderer || !this.camera) return;
            const w = this.container.clientWidth;
            const h = this.container.clientHeight;
            this.camera.aspect = w / h;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(w, h);
        });
    }

    buildRealisticWorld() {
        const MB = window.ModelBuilder3D;
        const C = window.Colors3D;

        // A. Tanah Dasar Pedesaan Rumput Alami Retro (Pixelated / Dithered Style)
        const grassMat = (window.getTexturedMat)
            ? window.getTexturedMat("retroGrass", C.grassRetro || 0x436B22, 0.85, 0.0, { rx: 45, ry: 45 })
            : window.getMat(C.grassRetro || 0x436B22, 0.85, 0.0);
        const ground = new THREE.Mesh(
            new THREE.PlaneGeometry(750, 750),
            grassMat
        );
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);

        // B. Halaman Tanah Liat Cokelat Bertekstur (Mud Courtyard with Ruts, Puddles & Scattered Pebbles)
        // Menyelimuti area mesin, gudang, lobi & gerobak toko: x = -6.5 s.d. 18.5, z = -7 s.d. 18
        const courtyardMat = (window.getTexturedMat) 
            ? window.getTexturedMat("clayMudCourtyard", C.dirtClayMud || 0x5C381F, 0.9, 0.02, { rx: 1, ry: 1 })
            : window.getMat(C.dirtClayMud || 0x5C381F, 0.88, 0.02);
        const courtyard = new THREE.Mesh(new THREE.PlaneGeometry(28, 30), courtyardMat);
        courtyard.rotation.x = -Math.PI / 2;
        courtyard.position.set(4.5, 0.015, 5.0);
        courtyard.receiveShadow = true;
        this.scene.add(courtyard);

        // C. Jalan Aspal Hitam dengan Marka Garis Putih Putus-putus (Black Asphalt Road)
        const roadMat = (window.getTexturedMat)
            ? window.getTexturedMat("asphaltRoad", 0x1E1F22, 0.9, 0.05, { rx: 1, ry: 38 })
            : window.getMat(0x222225, 0.9, 0.05);
        const road = new THREE.Mesh(new THREE.PlaneGeometry(14, 380), roadMat);
        road.rotation.x = -Math.PI / 2;
        road.position.set(22, 0.02, 0);
        road.receiveShadow = true;
        this.scene.add(road);

        // ==========================================
        // D. KANDANG MERAH BESAR UTAMA (BIG RED BARN)
        // Bangunan utama peternakan menghadap ke selatan (halaman pabrik)
        // ==========================================
        const bigBarn = MB.createBigRedBarn();
        bigBarn.position.set(2.5, 0, -0.5);
        this.scene.add(bigBarn);

        // ==========================================
        // E. SILO GANDUM LOGAM TINGGI (GRAIN SILO)
        // Berdiri kokoh di samping kanan Big Red Barn (dekat ladang gandum & jalan)
        // ==========================================
        const silo = MB.createGrainSilo();
        silo.position.set(9.5, 0, -1.5);
        this.scene.add(silo);

        // ==========================================
        // F. BANGUNAN BELAKANG DENGAN TATA LETAK RAPI (TIDAK BERTABRAKAN)
        // Diberi jarak aman dari pagar padang domba (x = -7) dan satu sama lain
        // ==========================================
        // 1. Kandang Kayu Merah Besar (Semua Rumah/Gedung Peternakan Berwarna Merah)
        // Ditempatkan rapi di sisi kiri belakang (x = -1.0), berjarak 3 meter dari pagar padang domba
        const whiteBarn = MB.createSecondaryBarn("red");
        whiteBarn.position.set(-1.0, 0, -13.5);
        this.scene.add(whiteBarn);

        // 2. Bangunan Garasi Pengantaran (Delivery Garage) dengan Jalur Akses Driveway Aspal
        // Menggantikan gudang merah kecil dan petak gandum kuning di sebelah kanan Silo hitam
        // Orientasi: Lurus tegak lurus terhadap jalan raya (tidak miring), pintu menghadap lurus ke timur / jalan raya utama
        this.deliveryGarage = MB.createDeliveryGarage();
        this.deliveryGarage.position.set(6.0, 0, -12.5);
        this.deliveryGarage.rotation.y = Math.PI / 2;
        this.scene.add(this.deliveryGarage);

        // 3. Gudang Perkakas Kecil Merah (Tool Shed)
        // Ditempatkan di sudut barat Big Red Barn (x = -2.8, z = -6.5), menyisakan lorong jalan bebas hambatan
        const toolShed = MB.createSecondaryBarn("red");
        toolShed.scale.set(0.55, 0.55, 0.55);
        toolShed.position.set(-2.8, 0, -6.5);
        this.scene.add(toolShed);

        // ==========================================
        // G. LAHAN GANDUM BERGELOMBANG (WHEAT FIELDS)
        // ==========================================
        // Lahan Gandum di latar belakang utara (di belakang white barn & area garasi)
        const wheatField2 = MB.createWheatField(22, 6);
        wheatField2.position.set(3.0, 0, -21.0);
        this.scene.add(wheatField2);

        // ==========================================
        // H. PAGAR PUTIH PETERNAKAN & AREA HEWAN (PADDOCKS)
        // Kandang ayam, sapi, dan domba di depan kiri
        // ==========================================
        this.createWhitePaddocks();

        // Bak Air di Kandang Ayam (Bak Sapi & Domba berada di dalam grup paddock masing-masing)
        const troughChicken = MB.createWaterTrough();
        troughChicken.position.set(-16.0, 0, 9.0);
        this.scene.add(troughChicken);

        // Tumpukan Gulungan Jerami (Hay Bales) Disusun Rapi Merapat ke Dinding Gedung (Tidak Menghalangi Gerobak)
        const bale1 = MB.createHayBale(true); bale1.position.set(-1.0, 0, 2.5);
        const bale2 = MB.createHayBale(true); bale2.position.set(-1.0, 0, 3.5);
        const bale3 = MB.createHayBale(false); bale3.position.set(6.8, 0, 2.8);
        const bale4 = MB.createHayBale(true); bale4.position.set(10.2, 0, 2.0);
        this.scene.add(bale1, bale2, bale3, bale4);

        // ==========================================
        // I. PABRIK PENGOLAHAN INDUSTRI (3 MESIN DENGAN DESAIN UNIK NYATA)
        // ==========================================
        // Mesin 1: Pengolah Telur & Mayones (Egg Mixer Vat)
        const mayoMachine = MB.createEggProcessor();
        mayoMachine.position.set(-1.5, 0, 11.5);
        mayoMachine.rotation.y = 0.15;
        this.scene.add(mayoMachine);
        this.machineMeshes["mayo_maker"] = mayoMachine;

        // Mesin 2: Pengepres Keju Hidrolik & Kaleng Susu (Cheese Press & Dairy Churn)
        const cheeseMachine = MB.createCheesePress();
        cheeseMachine.position.set(5.0, 0, 11.5);
        this.scene.add(cheeseMachine);
        this.machineMeshes["cheese_maker"] = cheeseMachine;

        // Mesin 3: Alat Tenun & Pemintal Kain Wol (Textile Loom & Spinning Wheel)
        const loomMachine = MB.createTextileLoom();
        loomMachine.position.set(11.5, 0, 11.5);
        loomMachine.rotation.y = -0.15;
        this.scene.add(loomMachine);
        this.machineMeshes["loom_weaver"] = loomMachine;

        // ==========================================
        // J. TRUK LOGISTIK / KENDARAAN PENGANTARAN DI DALAM GARASI
        // Terparkir rapi di lantai beton dalam garasi pengantaran (tidak miring)
        // ==========================================
        this.truckMesh = MB.createTruck(this.state.truck.level);
        this.truckMesh.position.set(7.5, 0, -12.5);
        this.truckMesh.rotation.y = Math.PI / 2; // Menghadap keluar pintu gerbang garasi
        if (this.truckMesh.userData && this.truckMesh.userData.driver) {
            this.truckMesh.userData.driver.visible = false;
        }
        this.scene.add(this.truckMesh);

        // ==========================================
        // K. ANJING PENJAGA PETERNAKAN (FARM DOG)
        // Duduk setia di dekat teras lobi
        // ==========================================
        this.dogMesh = MB.createFarmDog();
        this.dogMesh.position.set(1.5, 0, 5);
        this.scene.add(this.dogMesh);

        // ==========================================
        // L. GEROBAK TOKO HEWAN 3D (ANIMAL SHOP CART - PERSIS FOTO REFERENSI)
        // Berdiri strategis di dekat pintu masuk area ladang hewan ternak
        // ==========================================
        this.animalCart = MB.createAnimalShopCart();
        this.animalCart.position.set(-6.5, 0, 4.5);
        this.animalCart.rotation.y = 0.25;
        this.scene.add(this.animalCart);

        // ==========================================
        // L2. PAPAN MISI HARIAN 3D (DAILY QUEST NOTICE BOARD)
        // Diposisikan persis di lingkaran merah foto media_1794444290272_1e55dff4.jpg
        // Di area tanah lapang depan silo & tumpukan jerami emas
        // ==========================================
        this.questBoard = MB.createDailyQuestBoard();
        this.questBoard.position.set(13.5, 0, 3.2);
        this.questBoard.rotation.y = -0.35;
        this.scene.add(this.questBoard);

        // ==========================================
        // M. KARAKTER PEMAIN 3D (CHIBI ANIME RETRO FARMER)
        // ==========================================
        const initialCharType = (this.state && this.state.player && this.state.player.characterType) || "grandpa";
        const initialCharName = (this.state && this.state.player && this.state.player.name) || "Petani Hebat";
        this.playerMesh = MB.createPlayerCharacter(initialCharType);
        this.playerMesh.position.set(0.0, 0, 6.5);
        this.scene.add(this.playerMesh);

        // Nameplate Papan Kayu Bersih & Rapi
        this.nameplateSprite = this.createPlayerNameplate(initialCharName);
        this.playerMesh.add(this.nameplateSprite);

        // ==========================================
        // N. LINGKARAN INTERAKTIF DENYUT (PULSING PADS)
        // ==========================================
        this.createInteractivePad(-6.5, 6.2, 1.8, "shop", "Toko Hewan", "animal_shop");
        this.createInteractivePad(13.5, 4.6, 1.8, "quest", "Misi Harian", "quest_board");

        this.createInteractivePad(-2.5, 10.2, 1.4, "deposit", "Setor Telur", "deposit_mayo");
        this.createInteractivePad(-2.5, 13.8, 1.4, "pickup", "Ambil Mayo", "pickup_mayo");

        this.createInteractivePad(4.0, 10.2, 1.4, "deposit", "Setor Susu", "deposit_cheese");
        this.createInteractivePad(4.0, 13.8, 1.4, "pickup", "Ambil Keju", "pickup_cheese");

        this.createInteractivePad(10.5, 10.2, 1.4, "deposit", "Setor Wol", "deposit_loom");
        this.createInteractivePad(10.5, 13.8, 1.4, "pickup", "Ambil Kain", "pickup_loom");

        this.createInteractivePad(10.5, -10.5, 1.8, "truck_load", "Muat Truk", "load_truck");
        this.createInteractivePad(13.2, -12.5, 1.5, "truck_ship", "Kirim Truk", "ship_truck");
        this.createInteractivePad(2.5, 3.2, 1.6, "shop", "Toko Upgrade", "shop");

        // Item panen awal ditaruh rapi di sarang jerami & ember susu (tidak berupa titik-titik acak di tanah)

        // ==========================================
        // N. DINDING GUNUNG PEMBATAS MAP & SABUK HUTAN ASRI
        // Mengelilingi 4 sisi batas arena persis foto referensi
        // ==========================================
        this.createMountainPerimeter();
        this.createLushForestPerimeter();

        // ==========================================
        // O. SHOWCASE PENINGKATAN ARMADA PENGANTAR (6 TINGKAT KENDARAAN MENANJAK)
        // Disusun menanjak satu arah dari Level 1 (Sepeda) hingga Level 6 (Truk Kontainer)
        // di sepanjang jalan tanah pedesaan berpemandangan asri di padang timur
        // ==========================================
        this.createDeliveryVehiclesShowcase();

        // Spawn Hewan 3D Hidup dengan AI Pengembara
        this.syncAnimalsWithAI();
    }

    createWhitePaddocks() {
        const MB = window.ModelBuilder3D;
        const C = window.Colors3D;

        // Tanah liat cokelat alami peternakan bertekstur
        const penSoilMat = (window.getTexturedMat) 
            ? window.getTexturedMat("clayMudCourtyard", C.dirtClayMud || 0x5C381F, 0.9, 0.05, { rx: 3, ry: 2 })
            : window.getMat(C.dirtClayMud || 0x5C381F, 0.88, 0.02);

        const postMat = window.getMat(0x423020, 0.9, 0.02);
        const postGeo = new THREE.CylinderGeometry(0.12, 0.14, 1.4, 8);

        // ==========================================
        // 1. KANDANG AYAM PETELUR (KANDANG TENGAH - 18 x 14 meter)
        // Dilengkapi Rumah Ayam Panggung (Elevated Chicken Coop) Khusus 4 Ekor Ayam Sesuai Referensi
        // ==========================================
        this.chickenPaddockGroup = new THREE.Group();
        this.chickenPaddockGroup.name = "chickenPaddockGroup";

        const pastureGround = new THREE.Mesh(new THREE.PlaneGeometry(18, 14), penSoilMat);
        pastureGround.rotation.x = -Math.PI / 2;
        pastureGround.position.set(-20, 0.015, 4);
        pastureGround.receiveShadow = true;
        this.chickenPaddockGroup.add(pastureGround);

        // Pagar Kayu Mengelilingi Kandang Ayam dengan Gerbang Terbuka (z: 2.0 s.d. 6.0)
        const fTopChk = MB.createWhiteFence(18); fTopChk.position.set(-20, 0, -3);
        const fBotChk = MB.createWhiteFence(18); fBotChk.position.set(-20, 0, 11);
        const fLeftChk = MB.createWhiteFence(14); fLeftChk.rotation.y = Math.PI / 2; fLeftChk.position.set(-29, 0, 4);
        const fRightTopChk = MB.createWhiteFence(5.0); fRightTopChk.rotation.y = Math.PI / 2; fRightTopChk.position.set(-11, 0, -0.5);
        const fRightBotChk = MB.createWhiteFence(5.0); fRightBotChk.rotation.y = Math.PI / 2; fRightBotChk.position.set(-11, 0, 8.5);

        // Tiang Gerbang Kayu Tua Kasar di Mulut Pintu Masuk Kandang Ayam
        const postChk1 = new THREE.Mesh(postGeo, postMat); postChk1.position.set(-11, 0.7, 2.0); postChk1.castShadow = true;
        const postChk2 = new THREE.Mesh(postGeo, postMat); postChk2.position.set(-11, 0.7, 6.0); postChk2.castShadow = true;
        this.chickenPaddockGroup.add(fTopChk, fBotChk, fLeftChk, fRightTopChk, fRightBotChk, postChk1, postChk2);

        // 3 Rumah Panggung Ayam (Elevated Chicken Coops) Berjajar Menghadap ke Depan (Kapasitas Total 12 Ayam: 4 Ayam per Rumah)
        this.chickenCoops = [];
        this.chickenCoopPositions = [
            { x: -24.5, z: 1.0 },
            { x: -24.5, z: 4.5 },
            { x: -24.5, z: 8.0 }
        ];
        this.chickenCoopPositions.forEach((pos, idx) => {
            const coop = MB.createElevatedChickenCoop(false);
            coop.position.set(pos.x, 0, pos.z);
            coop.rotation.y = Math.PI / 2; // Menghadap ke depan (tenggara / arah kamera & halaman terbuka)
            coop.visible = (idx === 0); // Di awal permainan hanya 1 kandang yang aktif
            this.chickenCoops.push(coop);
            this.chickenPaddockGroup.add(coop);
        });
        this.chickenCoop = this.chickenCoops[0];

        // Gundukan Jerami Alami di Sudut Kandang Ayam
        const chkStraw1 = MB.createStrawMound(1.6, 0.85, 1.4); chkStraw1.position.set(-27.0, 0, -1.8);
        const chkStraw2 = MB.createStrawMound(1.5, 0.80, 1.3); chkStraw2.position.set(-27.0, 0, 10.2);
        this.chickenPaddockGroup.add(chkStraw1, chkStraw2);

        // Rumpun Rumput Alami
        const tufts = [
            [-27, 2, "green"], [-25, 9, "green"], [-27, -1, "green"], [-13, 9, "green"],
            [-13, -1, "green"], [-27, 6, "purple"], [-13, 2, "purple"]
        ];
        tufts.forEach(([tx, tz, style]) => {
            const tuft = MB.createGrassTuft(style);
            tuft.position.set(tx, 0, tz);
            this.chickenPaddockGroup.add(tuft);
        });
        this.scene.add(this.chickenPaddockGroup);

        // ==========================================
        // 2. KANDANG SAPI PERAH HOLSTEIN (KANDANG DEPAN - 18 x 14 meter, Ukuran Sama dengan Ayam)
        // Posisi cx = -20, cz = 21. Rentang Z: 14 s.d. 28. Pintu gerbang di z: 19.0 s.d. 23.0
        // ==========================================
        this.cowPaddockGroup = new THREE.Group();
        this.cowPaddockGroup.name = "cowPaddockGroup";

        const cowGround = new THREE.Mesh(new THREE.PlaneGeometry(18, 14), penSoilMat);
        cowGround.rotation.x = -Math.PI / 2;
        cowGround.position.set(-20, 0.015, 21);
        cowGround.receiveShadow = true;
        this.cowPaddockGroup.add(cowGround);

        // Pagar Kandang Sapi dengan Pintu Masuk Terbuka (z: 19.0 s.d. 23.0)
        const fTopCow = MB.createWhiteFence(18); fTopCow.position.set(-20, 0, 14);
        const fBotCow = MB.createWhiteFence(18); fBotCow.position.set(-20, 0, 28);
        const fLeftCow = MB.createWhiteFence(14); fLeftCow.rotation.y = Math.PI / 2; fLeftCow.position.set(-29, 0, 21);
        const fRightTopCow = MB.createWhiteFence(5.0); fRightTopCow.rotation.y = Math.PI / 2; fRightTopCow.position.set(-11, 0, 16.5);
        const fRightBotCow = MB.createWhiteFence(5.0); fRightBotCow.rotation.y = Math.PI / 2; fRightBotCow.position.set(-11, 0, 25.5);

        // Tiang Gerbang Kayu Tua di Pintu Masuk Kandang Sapi
        const postCow1 = new THREE.Mesh(postGeo, postMat); postCow1.position.set(-11, 0.7, 19.0); postCow1.castShadow = true;
        const postCow2 = new THREE.Mesh(postGeo, postMat); postCow2.position.set(-11, 0.7, 23.0); postCow2.castShadow = true;
        this.cowPaddockGroup.add(fTopCow, fBotCow, fLeftCow, fRightTopCow, fRightBotCow, postCow1, postCow2);

        // Tempat Makan Kayu Panjang Penuh Rumput Hijau Segar
        const cowTrough = MB.createFeedingTrough(4.2, 0.95, 0.65, "grass");
        cowTrough.position.set(-15.5, 0, 21.0);
        cowTrough.rotation.y = Math.PI / 2;
        this.cowPaddockGroup.add(cowTrough);

        // Bak Air Sapi
        const troughCow = MB.createWaterTrough();
        troughCow.position.set(-26, 0, 21);
        this.cowPaddockGroup.add(troughCow);

        // Gundukan Jerami Alami di Kandang Sapi
        const cowStraw1 = MB.createStrawMound(1.8, 1.0, 1.6); cowStraw1.position.set(-24.5, 0, 16.5);
        const cowStraw2 = MB.createStrawMound(1.7, 0.9, 1.5); cowStraw2.position.set(-15.0, 0, 25.5);
        const cowStraw3 = MB.createStrawMound(1.9, 1.1, 1.8); cowStraw3.position.set(-25.0, 0, 25.5);
        this.cowPaddockGroup.add(cowStraw1, cowStraw2, cowStraw3);

        // Ember Susu Tradisional Diam & Statis
        const milkPail1 = MB.createMilkPail ? MB.createMilkPail(1.1) : MB.createMilkPailWithStraw();
        milkPail1.position.set(-14.2, 0, 19.0);
        const milkPail2 = MB.createMilkPail ? MB.createMilkPail(1.0) : MB.createMilkPailWithStraw();
        milkPail2.position.set(-17.0, 0, 17.0);
        this.cowPaddockGroup.add(milkPail1, milkPail2);

        this.scene.add(this.cowPaddockGroup);

        // ==========================================
        // 3. KANDANG DOMBA WOL LEBAT (KANDANG BELAKANG - 18 x 14 meter, Ukuran Sama dengan Ayam)
        // Posisi cx = -20, cz = -13. Rentang Z: -20 s.d. -6. Pintu gerbang di z: -15.0 s.d. -11.0
        // ==========================================
        this.sheepPaddockGroup = new THREE.Group();
        this.sheepPaddockGroup.name = "sheepPaddockGroup";

        const sheepGround = new THREE.Mesh(new THREE.PlaneGeometry(18, 14), penSoilMat);
        sheepGround.rotation.x = -Math.PI / 2;
        sheepGround.position.set(-20, 0.015, -13);
        sheepGround.receiveShadow = true;
        this.sheepPaddockGroup.add(sheepGround);

        // Pagar Kandang Domba dengan Pintu Masuk Terbuka (z: -15.0 s.d. -11.0)
        const fTopSheep = MB.createWhiteFence(18); fTopSheep.position.set(-20, 0, -20);
        const fBotSheep = MB.createWhiteFence(18); fBotSheep.position.set(-20, 0, -6);
        const fLeftSheep = MB.createWhiteFence(14); fLeftSheep.rotation.y = Math.PI / 2; fLeftSheep.position.set(-29, 0, -13);
        const fRightTopSheep = MB.createWhiteFence(5.0); fRightTopSheep.rotation.y = Math.PI / 2; fRightTopSheep.position.set(-11, 0, -17.5);
        const fRightBotSheep = MB.createWhiteFence(5.0); fRightBotSheep.rotation.y = Math.PI / 2; fRightBotSheep.position.set(-11, 0, -8.5);

        // Tiang Gerbang Kayu Tua di Pintu Masuk Kandang Domba
        const postSheep1 = new THREE.Mesh(postGeo, postMat); postSheep1.position.set(-11, 0.7, -15.0); postSheep1.castShadow = true;
        const postSheep2 = new THREE.Mesh(postGeo, postMat); postSheep2.position.set(-11, 0.7, -11.0); postSheep2.castShadow = true;
        this.sheepPaddockGroup.add(fTopSheep, fBotSheep, fLeftSheep, fRightTopSheep, fRightBotSheep, postSheep1, postSheep2);

        // Tempat Makan Kayu Panjang Penuh Jerami Kering
        const sheepTrough = MB.createFeedingTrough(4.2, 0.95, 0.65, "hay");
        sheepTrough.position.set(-15.5, 0, -13.0);
        sheepTrough.rotation.y = Math.PI / 2;
        this.sheepPaddockGroup.add(sheepTrough);

        // Bak Air Domba
        const troughSheep = MB.createWaterTrough();
        troughSheep.position.set(-26, 0, -13.5);
        this.sheepPaddockGroup.add(troughSheep);

        // Gundukan Jerami Alami di Kandang Domba
        const sheepStraw1 = MB.createStrawMound(1.8, 1.0, 1.6); sheepStraw1.position.set(-24.5, 0, -9.5);
        const sheepStraw2 = MB.createStrawMound(1.6, 0.9, 1.5); sheepStraw2.position.set(-15.0, 0, -17.5);
        const sheepStraw3 = MB.createStrawMound(1.8, 1.0, 1.7); sheepStraw3.position.set(-25.0, 0, -17.5);
        this.sheepPaddockGroup.add(sheepStraw1, sheepStraw2, sheepStraw3);

        this.scene.add(this.sheepPaddockGroup);

        // Terapkan visibilitas kandang sapi & domba (hanya ayam yang terbuka di awal baru)
        this.updatePaddockVisibility();
    }

    // Resolusi Tabrakan Pagar Kandang (Pagar Solid Tidak Tembus - Harus Lewat Pintu Masing-masing!)
    resolvePaddockFenceCollisions() {
        if (!this.playerMesh) return;
        const r = 0.45; // Radius tubus pemain

        // Kotak-kotak pagar solid yang menahan pemain
        const boxes = [
            // 1. Pagar Kandang Ayam (Selalu Aktif - Ukuran 18 x 14 meter)
            { minX: -29.2, maxX: -10.8, minZ: -3.2, maxZ: -2.8 },    // Pagar Atas
            { minX: -29.2, maxX: -10.8, minZ: 10.8, maxZ: 11.2 },    // Pagar Bawah
            { minX: -29.2, maxX: -28.8, minZ: -3.2, maxZ: 11.2 },    // Pagar Kiri
            { minX: -11.2, maxX: -10.8, minZ: -3.2, maxZ: 2.0 },     // Pagar Kanan Atas
            { minX: -11.2, maxX: -10.8, minZ: 6.0, maxZ: 11.2 },     // Pagar Kanan Bawah
            // (Pintu gerbang terbuka di x: -11, z: 2.0 s.d. 6.0)

            // Dinding Bangunan Garasi Pengantaran
            { minX: 6.0, maxX: 12.0, minZ: -16.5, maxZ: -10.5 }
        ];

        // 2. Pagar Kandang Sapi (Ukuran 18 x 14 meter, Z: 14 s.d. 28)
        if (this.state && this.state.upgrades && this.state.upgrades.hasCow) {
            boxes.push(
                { minX: -29.2, maxX: -10.8, minZ: 13.8, maxZ: 14.2 },   // Pagar Atas
                { minX: -29.2, maxX: -10.8, minZ: 27.8, maxZ: 28.2 },   // Pagar Bawah
                { minX: -29.2, maxX: -28.8, minZ: 13.8, maxZ: 28.2 },   // Pagar Kiri
                { minX: -11.2, maxX: -10.8, minZ: 13.8, maxZ: 19.0 },   // Pagar Kanan Atas
                { minX: -11.2, maxX: -10.8, minZ: 23.0, maxZ: 28.2 }    // Pagar Kanan Bawah
                // (Pintu gerbang terbuka di x: -11, z: 19.0 s.d. 23.0)
            );
        }

        // 3. Pagar Padang Domba (Ukuran 18 x 14 meter, Z: -20 s.d. -6)
        if (this.state && this.state.upgrades && this.state.upgrades.hasSheep) {
            boxes.push(
                { minX: -29.2, maxX: -10.8, minZ: -20.2, maxZ: -19.8 }, // Pagar Atas
                { minX: -29.2, maxX: -10.8, minZ: -6.2, maxZ: -5.8 },   // Pagar Bawah
                { minX: -29.2, maxX: -28.8, minZ: -20.2, maxZ: -5.8 },  // Pagar Kiri
                { minX: -11.2, maxX: -10.8, minZ: -20.2, maxZ: -15.0 }, // Pagar Kanan Atas
                { minX: -11.2, maxX: -10.8, minZ: -11.0, maxZ: -5.8 }   // Pagar Kanan Bawah
                // (Pintu gerbang terbuka di x: -11, z: -15.0 s.d. -11.0)
            );
        }

        // Resolusi tabrakan pemain terhadap pagar (Sliding collision)
        boxes.forEach(b => {
            const bMinX = b.minX - r;
            const bMaxX = b.maxX + r;
            const bMinZ = b.minZ - r;
            const bMaxZ = b.maxZ + r;

            const px = this.playerMesh.position.x;
            const pz = this.playerMesh.position.z;

            if (px > bMinX && px < bMaxX && pz > bMinZ && pz < bMaxZ) {
                const pushLeft = px - bMinX;
                const pushRight = bMaxX - px;
                const pushTop = pz - bMinZ;
                const pushBottom = bMaxZ - pz;

                const minPush = Math.min(pushLeft, pushRight, pushTop, pushBottom);
                if (minPush === pushLeft) this.playerMesh.position.x = bMinX;
                else if (minPush === pushRight) this.playerMesh.position.x = bMaxX;
                else if (minPush === pushTop) this.playerMesh.position.z = bMinZ;
                else this.playerMesh.position.z = bMaxZ;
            }
        });
    }

    buildFenceLoop(cx, cz, w, d) {
        const MB = window.ModelBuilder3D;
        const hw = w / 2;
        const hd = d / 2;

        const fTop = MB.createWhiteFence(w); fTop.position.set(cx, 0, cz - hd);
        const fBot = MB.createWhiteFence(w); fBot.position.set(cx, 0, cz + hd);
        const fLeft = MB.createWhiteFence(d); fLeft.rotation.y = Math.PI / 2; fLeft.position.set(cx - hw, 0, cz);
        const fRight = MB.createWhiteFence(d); fRight.rotation.y = Math.PI / 2; fRight.position.set(cx + hw, 0, cz);

        this.scene.add(fTop, fBot, fLeft, fRight);
    }

    createPlayerNameplate(name = "AselolejoZzz") {
        const canvas = document.createElement("canvas");
        canvas.width = 400;
        canvas.height = 110;
        const ctx = canvas.getContext("2d");

        // Papan Kayu Utama (Carved Wood Plank)
        ctx.fillStyle = "#E49B38";
        ctx.strokeStyle = "#5C3317";
        ctx.lineWidth = 6;
        ctx.beginPath();
        if (ctx.roundRect) {
            ctx.roundRect(40, 18, 320, 68, 14);
        } else {
            ctx.rect(40, 18, 320, 68);
        }
        ctx.fill();
        ctx.stroke();

        // Baut Besi Hitam di Sudut Kiri & Kanan
        ctx.fillStyle = "#3E2723";
        ctx.beginPath(); ctx.arc(60, 52, 4.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(340, 52, 4.5, 0, Math.PI * 2); ctx.fill();

        // Daun Hiasan Hijau Segar di Sudut Papan
        ctx.fillStyle = "#689F38";
        ctx.beginPath(); ctx.ellipse(40, 20, 16, 10, -0.4, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(360, 20, 16, 10, 0.4, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(200, 15, 14, 8, 0, 0, Math.PI * 2); ctx.fill();

        // Nama Pemain Bersih & Tebal (Tanpa Angka Rp 3.500 yang Menumpuk)
        ctx.fillStyle = "#2D1802";
        ctx.font = "bold 32px 'Segoe UI', Arial, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(name, 200, 52);

        const tex = new THREE.CanvasTexture(canvas);
        tex.minFilter = THREE.LinearFilter;
        const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false });
        const sprite = new THREE.Sprite(mat);
        sprite.scale.set(3.4, 0.94, 1.0);
        sprite.position.y = 2.45;
        return sprite;
    }

    createInteractivePad(x, z, radius, stationType, label, actionKey, y = 0) {
        const MB = window.ModelBuilder3D;
        const station = MB.createRealisticFarmStation(stationType);
        station.position.set(x, y, z);
        this.scene.add(station);

        const ringMesh = station.userData.ringMesh || station;
        this.interactivePads.push({ x, y, z, radius, actionKey, ringMesh });
    }

    getTerrainHeightAt(x, z) {
        // Cek apakah posisi berada di atas jalur jalan tanjakan pameran kendaraan (Showcase Ramp)
        // Tanjakan berada di x: 37.5 s.d. 46.5, z: -34.0 s.d. 28.0 (tinggi 0.04 s.d. 3.60m)
        if (x >= 37.5 && x <= 46.5 && z >= -34.0 && z <= 28.0) {
            const frac = (28.0 - z) / 62.0;
            return 0.04 + frac * 3.56;
        }
        return 0;
    }

    createVehicleSignboardSprite(title, sub, cost = "") {
        const canvas = document.createElement("canvas");
        canvas.width = 512;
        canvas.height = 256;
        const ctx = canvas.getContext("2d");

        // Papan Kayu Bertekstur Cokelat Keemasan
        ctx.fillStyle = "#E49B38";
        ctx.strokeStyle = "#4E2706";
        ctx.lineWidth = 8;
        ctx.beginPath();
        if (ctx.roundRect) {
            ctx.roundRect(16, 16, 480, 224, 20);
        } else {
            ctx.rect(16, 16, 480, 224);
        }
        ctx.fill();
        ctx.stroke();

        // Garis Pembatas Emas Mewah
        ctx.strokeStyle = "#FDD835";
        ctx.lineWidth = 3;
        ctx.strokeRect(26, 26, 460, 204);

        // Baut Sudut Kayu Klasik
        ctx.fillStyle = "#2D1802";
        [[38, 38], [474, 38], [38, 218], [474, 218]].forEach(([bx, by]) => {
            ctx.beginPath(); ctx.arc(bx, by, 5, 0, Math.PI * 2); ctx.fill();
        });

        // Nama Kendaraan
        ctx.fillStyle = "#261301";
        ctx.font = "bold 32px 'Segoe UI', Arial, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(title, 256, 72);

        // Kapasitas & Durasi Pengiriman
        ctx.fillStyle = "#0D47A1";
        ctx.font = "bold 23px 'Segoe UI', Arial, sans-serif";
        ctx.fillText(sub, 256, 128);

        // Biaya / Status Upgrade
        if (cost) {
            ctx.fillStyle = "#1B5E20";
            ctx.font = "bold 25px 'Segoe UI', Arial, sans-serif";
            ctx.fillText(cost, 256, 184);
        }

        const tex = new THREE.CanvasTexture(canvas);
        tex.minFilter = THREE.LinearFilter;
        const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false });
        const sprite = new THREE.Sprite(mat);
        sprite.scale.set(4.2, 2.1, 1.0);
        return sprite;
    }

    createDeliveryVehiclesShowcase() {
        const MB = window.ModelBuilder3D;
        const C = window.Colors3D;
        if (!MB) return;

        const showcaseGroup = new THREE.Group();
        showcaseGroup.name = "deliveryVehiclesShowcase";

        // ==========================================
        // 1. JALAN TANAH PEDESAAN MENANJAK (UPHILL COUNTRY ROAD RAMP)
        // Membentang searah dari Z = 28 (selatan, elevasi y = 0.04) 
        // menanjak hingga Z = -34 (utara, elevasi bukit y = 3.60) di X = 42.0
        // Sesuai gambar referensi: urutan menanjak dari Level 1 (bawah) s.d. Level 6 (atas)
        // ==========================================
        const zStart = 28.0;
        const zEnd = -34.0;
        const yStart = 0.04;
        const yEnd = 3.60;
        const totalLen = zStart - zEnd; // 62 meter
        const totalHeight = yEnd - yStart; // 3.56 meter
        const slopeAngle = Math.atan2(totalHeight, totalLen); // ~0.05736 rad

        // Permukaan Jalan Aspal Hitam Ramp Pameran
        const roadMat = (window.getTexturedMat)
            ? window.getTexturedMat("asphaltRoad", 0x1E1F22, 0.9, 0.05, { rx: 1, ry: 20 })
            : window.getMat(0x222225, 0.9, 0.05);

        const roadPlaneGeo = new THREE.PlaneGeometry(6.4, totalLen + 2.0);
        const roadRamp = new THREE.Mesh(roadPlaneGeo, roadMat);
        roadRamp.rotation.x = -Math.PI / 2 + slopeAngle;
        roadRamp.position.set(42.0, (yStart + yEnd) / 2, (zStart + zEnd) / 2);
        roadRamp.receiveShadow = true;
        showcaseGroup.add(roadRamp);

        // Gundukan Bukit Penopang Jalan (Solid Ramp Embankment)
        const rampSegments = 16;
        for (let i = 0; i < rampSegments; i++) {
            const frac = i / rampSegments;
            const zSeg = zStart - frac * totalLen;
            const ySeg = yStart + frac * totalHeight;
            if (ySeg > 0.15) {
                const bermMat = window.getMat(C.grass, 0.85, 0.0);
                const bermGeo = new THREE.BoxGeometry(7.6, ySeg, (totalLen / rampSegments) + 0.2);
                const berm = new THREE.Mesh(bermGeo, bermMat);
                berm.position.set(42.0, ySeg / 2, zSeg - (totalLen / rampSegments) / 2);
                berm.receiveShadow = true;
                showcaseGroup.add(berm);
            }
        }

        // Tiang Kayu Pembatas Pinggir Jalan & Tali
        const woodPostMat = window.getMat(0x5D4037, 0.8, 0.05);
        const postGeo = new THREE.CylinderGeometry(0.08, 0.09, 1.1, 6);
        const ropeMat = window.getMat(0xD7CCC8, 0.9, 0.0);

        for (let z = zStart; z >= zEnd; z -= 5.0) {
            const y = yStart + ((zStart - z) / totalLen) * totalHeight;
            [-3.4, 3.4].forEach(xOff => {
                const post = new THREE.Mesh(postGeo, woodPostMat);
                post.position.set(42.0 + xOff, y + 0.55, z);
                post.castShadow = true;
                showcaseGroup.add(post);
            });
        }

        const ropeL = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, totalLen, 4), ropeMat);
        ropeL.rotation.x = Math.PI / 2 + slopeAngle;
        ropeL.position.set(38.6, (yStart + yEnd) / 2 + 0.85, (zStart + zEnd) / 2);
        const ropeR = ropeL.clone(); ropeR.position.x = 45.4;
        showcaseGroup.add(ropeL, ropeR);

        // ==========================================
        // 2. GERBANG UTAMA SHOWCASE DI KAKI TANJAKAN (Z = 28.5)
        // ==========================================
        const gatePostL = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.2, 3.8, 8), woodPostMat);
        gatePostL.position.set(38.4, 1.9, zStart + 0.5);
        const gatePostR = gatePostL.clone(); gatePostR.position.x = 45.6;
        
        const gateBeam = new THREE.Mesh(new THREE.BoxGeometry(7.6, 0.45, 0.3), woodPostMat);
        gateBeam.position.set(42.0, 3.6, zStart + 0.5);
        gateBeam.castShadow = true;

        const archSign = this.createVehicleSignboardSprite(
            "🏆 PAMERAN PENINGKATAN ARMADA PENGANTAR 🏆",
            "Urutan Level 1 (Sepeda) Hingga Level 6 (Truk Kontainer)"
        );
        archSign.position.set(42.0, 4.4, zStart + 0.5);
        showcaseGroup.add(gatePostL, gatePostR, gateBeam, archSign);

        // ==========================================
        // 3. SUSUNAN 6 KENDARAAN MENANJAK SEARAH (LEVEL 1 S.D. LEVEL 6)
        // Di-anchor kokoh di atas jalan tanah dengan sudut miring lereng yang presisi
        // ==========================================
        const vehiclesConfig = [
            {
                level: 1,
                name: "Level 1: Sepeda Onthel",
                sub: "Kapasitas: 6 | 10s Jalan + 5s Tunggu + 10s Balik",
                cost: "Armada Awal Gratis",
                z: 24.5,
                createFn: () => MB.createDeliveryBicycle()
            },
            {
                level: 2,
                name: "Level 2: Sepeda Motor",
                sub: "Kapasitas: 12 | 7.5s Jalan + 5s Tunggu + 7.5s Balik",
                cost: "Upgrade: Rp 60",
                z: 13.5,
                createFn: () => MB.createDeliveryMotorcycle()
            },
            {
                level: 3,
                name: "Level 3: Kendaraan Roda 3",
                sub: "Kapasitas: 20 | 5.5s Jalan + 5s Tunggu + 5.5s Balik",
                cost: "Upgrade: Rp 140",
                z: 2.5,
                createFn: () => MB.createDeliveryTrike()
            },
            {
                level: 4,
                name: "Level 4: Mobil Pikap",
                sub: "Kapasitas: 32 | 4s Jalan + 5s Tunggu + 4s Balik",
                cost: "Upgrade: Rp 260",
                z: -8.5,
                createFn: () => MB.createDeliveryPickup()
            },
            {
                level: 5,
                name: "Level 5: Truk Sedang",
                sub: "Kapasitas: 48 | 3s Jalan + 5s Tunggu + 3s Balik",
                cost: "Upgrade: Rp 480",
                z: -20.0,
                createFn: () => MB.createDeliveryMediumTruck()
            },
            {
                level: 6,
                name: "Level 6: Truk Kontainer",
                sub: "Kapasitas: 75 | 2s Jalan + 5s Tunggu + 2s Balik",
                cost: "Upgrade: Rp 850 (Maksimal)",
                z: -32.5,
                createFn: () => MB.createDeliveryContainerTruck()
            }
        ];

        vehiclesConfig.forEach(cfg => {
            const vY = yStart + ((zStart - cfg.z) / totalLen) * totalHeight;
            const vehicleMesh = cfg.createFn();

            // Posisikan dan miringkan kendaraan sesuai lereng tanjakan (Weld & Anchor Solid)
            vehicleMesh.position.set(42.0, vY, cfg.z);
            vehicleMesh.rotation.y = Math.PI; // Menghadap menanjak ke arah utara
            vehicleMesh.rotation.x = slopeAngle; // Miring menanjak sejajar permukaan jalan
            showcaseGroup.add(vehicleMesh);

            // Landasan Pijakan Roda Batu/Paving di Bawah Kendaraan
            const padMat = window.getMat(0xB0BEC5, 0.8, 0.1);
            const padLen = (cfg.level === 6) ? 10.0 : (cfg.level === 5 ? 6.0 : (cfg.level === 4 ? 4.5 : 3.0));
            const padGeo = new THREE.BoxGeometry(3.6, 0.06, padLen);
            const padMesh = new THREE.Mesh(padGeo, padMat);
            padMesh.rotation.x = slopeAngle;
            padMesh.position.set(42.0, vY + 0.02, cfg.z);
            padMesh.receiveShadow = true;
            showcaseGroup.add(padMesh);

            // Papan Nama Kayu Eksklusif di Samping Kendaraan (Sisi Kiri x = 38.0)
            const signpost = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.8, 6), woodPostMat);
            signpost.position.set(38.0, vY + 0.9, cfg.z);
            signpost.castShadow = true;
            showcaseGroup.add(signpost);

            const signSprite = this.createVehicleSignboardSprite(cfg.name, cfg.sub, cfg.cost);
            signSprite.position.set(38.0, vY + 2.1, cfg.z);
            showcaseGroup.add(signSprite);

            // Lentera Penerangan Malam Berwarna Hangat
            const lampMat = window.getMat(0xFFF176, 0.2, 0.8);
            const lantern = new THREE.Mesh(new THREE.DodecahedronGeometry(0.18, 0), lampMat);
            lantern.position.set(38.0, vY + 1.85, cfg.z);
            showcaseGroup.add(lantern);

            // Interactive Pad Denyut untuk Membuka Info/Upgrade Toko saat Pemain Mendekat
            this.createInteractivePad(39.5, cfg.z, 2.2, "truck_load", cfg.name, "shop", vY);
        });

        this.scene.add(showcaseGroup);
    }

    createMountainPerimeter() {
        const MB = window.ModelBuilder3D;
        if (!MB || !MB.createMountainRidge) return;

        // Pegunungan Megah di Jarak Horizon Jauh (Menciptakan Lembah Luas 3x Lipat)
        // 1. SISI UTARA (NORTH RANGE) - Jauh di latar belakang (Z = -175)
        // Menyisakan celah ngarai di X = 20 s.d. 25 untuk jalur jalan raya keluar lembah ke kota
        [-150, -85, -20, 65, 140].forEach((mx, idx) => {
            const m = MB.createMountainRidge(80, 52 + (idx % 2) * 8, 38, idx);
            m.position.set(mx, 0, -175);
            m.rotation.y = (idx % 2 === 0 ? 0 : 0.08);
            this.scene.add(m);
        });

        // Gerbang Batas Luar Kota di Ujung Jalan Raya (Titik Bongkar Muat Armada Z = -170)
        const gateWoodMat = window.getMat(0x4E2706, 0.85, 0.05);
        const cityGateL = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 4.4, 8), gateWoodMat);
        cityGateL.position.set(16.5, 2.2, -170); cityGateL.castShadow = true;
        const cityGateR = cityGateL.clone(); cityGateR.position.x = 27.5;
        const cityBeam = new THREE.Mesh(new THREE.BoxGeometry(11.8, 0.45, 0.35), gateWoodMat);
        cityBeam.position.set(22.0, 4.2, -170); cityBeam.castShadow = true;
        const citySign = this.createVehicleSignboardSprite("🏙️ GERBANG LUAR KOTA 🏙️", "Titik Bongkar Muat Armada (Tunggu 5 Detik)");
        citySign.position.set(22.0, 5.0, -170);
        this.scene.add(cityGateL, cityGateR, cityBeam, citySign);

        // 2. SISI SELATAN (SOUTH RANGE) - Jauh di horizon selatan (Z = +175)
        [-140, -70, 0, 70, 140].forEach((mx, idx) => {
            const m = MB.createMountainRidge(80, 50 + (idx % 2) * 8, 38, idx + 2);
            m.position.set(mx, 0, 175);
            m.rotation.y = Math.PI + (idx % 2 === 0 ? 0 : -0.08);
            this.scene.add(m);
        });

        // 3. SISI BARAT (WEST RANGE) - Jauh di barat (X = -180)
        [-130, -65, 0, 65, 130].forEach((mz, idx) => {
            const m = MB.createMountainRidge(80, 54 + (idx % 2) * 8, 38, idx + 4);
            m.position.set(-180, 0, mz);
            m.rotation.y = Math.PI / 2 + (idx % 2 === 0 ? 0 : 0.08);
            this.scene.add(m);
        });

        // 4. SISI TIMUR (EAST RANGE) - Jauh di timur (X = +180)
        [-130, -65, 0, 65, 130].forEach((mz, idx) => {
            const m = MB.createMountainRidge(80, 52 + (idx % 2) * 8, 38, idx + 6);
            m.position.set(180, 0, mz);
            m.rotation.y = -Math.PI / 2 + (idx % 2 === 0 ? 0 : -0.08);
            this.scene.add(m);
        });

        // 5. 4 SUDUT GUNUNG RAKSASA DI HORIZON JAUH
        const corners = [
            { x: -175, z: -170, rot: Math.PI / 4 },      // Barat Laut (NW)
            { x: 175, z: -170, rot: -Math.PI / 4 },     // Timur Laut (NE)
            { x: -175, z: 170, rot: 3 * Math.PI / 4 },  // Barat Daya (SW)
            { x: 175, z: 170, rot: -3 * Math.PI / 4 }   // Tenggara (SE)
        ];

        corners.forEach(c => {
            const cornerMtn = MB.createMountainCorner(90, 65);
            cornerMtn.position.set(c.x, 0, c.z);
            cornerMtn.rotation.y = c.rot;
            this.scene.add(cornerMtn);
        });

        // 6. Gumpalan Awan Kumulus Melayang Lembut di Langit Pegunungan (Sesuai Foto media_1794700384525_9a1c9c3e.jpg)
        const cloudPositions = [
            [-95, 36, -140], [0, 38, -150], [95, 35, -140],
            [-145, 37, -40], [145, 36, 35],
            [-60, 38, 140], [80, 37, 135]
        ];
        cloudPositions.forEach(([cx, cy, cz], idx) => {
            const cloud = MB.createFluffyCloud ? MB.createFluffyCloud(2.4 + (idx % 3) * 0.5) : null;
            if (cloud) {
                cloud.position.set(cx, cy, cz);
                this.scene.add(cloud);
                this.cloudsList.push(cloud);
            }
        });

        // 7. Bintang-bintang Senja Temaram Berkelip Lembut di Langit Pegunungan (Sesuai Foto Referensi)
        const starGeo = new THREE.BufferGeometry();
        const starCount = 350;
        const starPos = new Float32Array(starCount * 3);
        for (let i = 0; i < starCount * 3; i += 3) {
            starPos[i] = (Math.random() - 0.5) * 380;
            starPos[i + 1] = 30 + Math.random() * 50;
            starPos[i + 2] = (Math.random() - 0.5) * 380;
        }
        starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
        const starMat = new THREE.PointsMaterial({ color: 0xFFF9E6, size: 0.75, transparent: true, opacity: 0.85 });
        this.starsMesh = new THREE.Points(starGeo, starMat);
        this.scene.add(this.starsMesh);
    }

    createLushForestPerimeter() {
        const MB = window.ModelBuilder3D;
        if (!MB) return;

        // Zona Terlarang (Exclusion Zone): Tempat yang MUTLAK tidak boleh ditumbuhi pohon
        const isBlocked = (x, z) => {
            // 1. Jalur Koridor Jalan Aspal Pengiriman Truk (Road corridor x: 14.0 s.d. 38.0)
            if (x >= 14.0 && x <= 38.0) return true;

            // 2. Kompleks Inti Peternakan & Kandang Hewan Luas 3x (x: -48.0 s.d. 16.0, z: -35.0 s.d. 44.0)
            if (x >= -48.0 && x <= 16.0 && z >= -35.0 && z <= 44.0) return true;

            // 3. Koridor Jalur Tanjakan Pameran 6 Armada Kendaraan (Showcase Ramp x: 37.0 s.d. 49.0, z: -38.0 s.d. 32.0)
            if (x >= 37.0 && x <= 49.0 && z >= -38.0 && z <= 32.0) return true;

            // 4. Di luar batas bukit / tebing gunung
            if (x < -170 || x > 170 || z < -165 || z > 165) return true;

            return false;
        };

        const treeList = [];
        const tryAddTree = (x, z, scale = 1.0, isPine = true) => {
            if (isBlocked(x, z)) return false;
            // Jarak minimal antar pohon 3.2m agar tidak menumpuk rapat
            for (let i = 0; i < treeList.length; i++) {
                if (Math.hypot(treeList[i].x - x, treeList[i].z - z) < 3.2) return false;
            }
            treeList.push({ x, z });

            const tree = isPine 
                ? MB.createRealisticPineTree(scale) 
                : MB.createRealisticTree(1);
            tree.position.set(x, 0, z);
            tree.rotation.y = Math.random() * Math.PI * 2;
            tree.rotation.z = (Math.random() * 0.06 - 0.03); // Kemiringan alami batang
            if (!isPine && scale !== 1.0) {
                tree.scale.set(scale, scale, scale);
            }
            this.scene.add(tree);
            return true;
        };

        // Pola Sebaran Organik / Random Alami (Bebas dari Pola Baris Lurus)
        // A. LEMBAH BARAT & KAKI BUKIT (Di luar kandang ternak x: -65 s.d. -32)
        const westCenters = [
            [-37, -45], [-48, -48], [-58, -35], [-44, -20], [-55, -8],
            [-36, 0], [-48, 12], [-58, 25], [-42, 38], [-54, 48],
            [-38, 52], [-60, 5], [-50, -30], [-40, -10], [-42, 22]
        ];
        westCenters.forEach(([cx, cz], gIdx) => {
            const count = 2 + (gIdx % 3);
            for (let k = 0; k < count; k++) {
                const rx = cx + (Math.random() * 7 - 3.5);
                const rz = cz + (Math.random() * 7 - 3.5);
                const scale = 0.9 + Math.random() * 0.55;
                const isPine = Math.random() > 0.3;
                tryAddTree(rx, rz, scale, isPine);
            }
        });

        // B. LEMBAH TIMUR SEBERANG JALAN ASPAL (x: 33 s.d. 64)
        const eastCenters = [
            [35, -45], [46, -48], [56, -35], [42, -22], [54, -10],
            [36, 2], [48, 15], [58, 28], [40, 42], [52, 50],
            [36, 52], [58, 5], [48, -32], [38, -12], [44, 25]
        ];
        eastCenters.forEach(([cx, cz], gIdx) => {
            const count = 2 + (gIdx % 3);
            for (let k = 0; k < count; k++) {
                const rx = cx + (Math.random() * 7 - 3.5);
                const rz = cz + (Math.random() * 7 - 3.5);
                const scale = 0.9 + Math.random() * 0.55;
                const isPine = Math.random() > 0.35;
                tryAddTree(rx, rz, scale, isPine);
            }
        });

        // C. PADANG UTARA DI BELAKANG LADANG GANDUM (z: -26 s.d. -58, di luar koridor jalan)
        const northCenters = [
            [-22, -32], [-10, -42], [0, -35], [8, -46], [-16, -50],
            [4, -54], [-28, -40], [-6, -48], [10, -32], [-20, -56]
        ];
        northCenters.forEach(([cx, cz], gIdx) => {
            const count = 2 + (gIdx % 3);
            for (let k = 0; k < count; k++) {
                const rx = cx + (Math.random() * 6 - 3.0);
                const rz = cz + (Math.random() * 6 - 3.0);
                const scale = 0.95 + Math.random() * 0.5;
                const isPine = Math.random() > 0.25;
                tryAddTree(rx, rz, scale, isPine);
            }
        });

        // D. PADANG SELATAN DI DEPAN PETERNAKAN (z: 30 s.d. 58, di luar koridor jalan)
        const southCenters = [
            [-22, 35], [-12, 45], [2, 38], [8, 48], [-18, 52],
            [-4, 55], [-26, 42], [-8, 36], [6, 42], [-15, 46]
        ];
        southCenters.forEach(([cx, cz], gIdx) => {
            const count = 2 + (gIdx % 3);
            for (let k = 0; k < count; k++) {
                const rx = cx + (Math.random() * 6 - 3.0);
                const rz = cz + (Math.random() * 6 - 3.0);
                const scale = 0.95 + Math.random() * 0.5;
                const isPine = Math.random() > 0.3;
                tryAddTree(rx, rz, scale, isPine);
            }
        });

        // E. POHON-POHON SOLITER (SOLITARY TREES) TERSEBAR ACAK DI LEMBAH TERBUKA
        for (let i = 0; i < 25; i++) {
            const angle = Math.random() * Math.PI * 2;
            const dist = 32 + Math.random() * 26;
            const sx = Math.cos(angle) * dist;
            const sz = Math.sin(angle) * dist;
            tryAddTree(sx, sz, 1.0 + Math.random() * 0.45, Math.random() > 0.4);
        }

        // F. SEMAK & BUNGA LIAR PEDESAAN DI SELA POHON ALAMI
        const bushMat = window.getMat(0x2E7D32, 0.85);
        const flowerMat1 = window.getMat(0xFFEB3B, 0.8);
        const flowerMat2 = window.getMat(0xF44336, 0.8);

        for (let i = 0; i < 35; i++) {
            const angle = Math.random() * Math.PI * 2;
            const dist = 33 + Math.random() * 26;
            const bx = Math.cos(angle) * dist;
            const bz = Math.sin(angle) * dist;
            if (!isBlocked(bx, bz)) {
                const bush = new THREE.Mesh(new THREE.DodecahedronGeometry(0.65 + Math.random() * 0.4, 0), bushMat);
                bush.position.set(bx, 0.38, bz);
                bush.castShadow = true;
                this.scene.add(bush);

                const flower = new THREE.Mesh(new THREE.SphereGeometry(0.14, 4, 4), i % 2 === 0 ? flowerMat1 : flowerMat2);
                flower.position.set(bx, 0.85, bz);
                this.scene.add(flower);
            }
        }
    }

    syncAnimalsWithAI() {
        // Hapus entitas hewan lama
        this.animalEntities.forEach(a => this.scene.remove(a.mesh));
        this.animalEntities = [];

        const MB = window.ModelBuilder3D;
        if (!MB) return;

        // Ambil data hewan yang benar-benar dimiliki pemain dari State (1:1 dengan Toko Hewan)
        const ownedChickens = (this.state.animals || []).filter(a => a.type === "chicken");
        const ownedCows = (this.state.animals || []).filter(a => a.type === "cow");
        const ownedSheep = (this.state.animals || []).filter(a => a.type === "sheep");

        // ==========================================
        // 1. KANDANG AYAM (3 ELEVATED CHICKEN COOPS DENGAN KAPASITAS 4 EKOR PER RUMAH, MAKSIMAL 12 AYAM)
        // Visibilitas kandang dinamis:
        // 1-4 ayam: 1 kandang aktif
        // 5-8 ayam: 2 kandang aktif
        // 9-12 ayam: 3 kandang aktif
        // ==========================================
        const chickenCount = ownedChickens.length;
        const activeCoopsCount = Math.max(1, Math.min(3, Math.ceil(chickenCount / 4)));
        if (this.chickenCoops) {
            this.chickenCoops.forEach((coop, i) => {
                coop.visible = (i < activeCoopsCount);
            });
        }

        const chickensToSpawn = ownedChickens.slice(0, 12);
        chickensToSpawn.forEach((animal, idx) => {
            const coopIdx = Math.min(2, Math.floor(idx / 4));
            const slotIdx = idx % 4;
            const basePos = (this.chickenCoopPositions && this.chickenCoopPositions[coopIdx]) 
                || { x: -24.5, z: 1.0 + coopIdx * 3.5 };
            const cX = basePos.x;
            const cZ = basePos.z;

            let spot;
            if (slotIdx === 0) {
                // Ayam ke-1: Di dalam kotak sarang samping di atas jerami mengerami telur
                spot = {
                    x: cX + 1.58, y: 1.07, z: cZ + 0.55,
                    rotY: Math.PI / 2, variant: (idx % 2 === 0 ? "brown" : "white"),
                    isNesting: true, isOnRamp: false, isUnderStilts: false
                };
            } else if (slotIdx === 1) {
                // Ayam ke-2: Di tengah tangga kayu bersiap turun/naik
                spot = {
                    x: cX + 2.10, y: 0.65, z: cZ - 0.65,
                    rotY: Math.PI / 2, variant: (idx % 2 === 1 ? "white" : "brown"),
                    isNesting: false, isOnRamp: true, isUnderStilts: false
                };
            } else if (slotIdx === 2) {
                // Ayam ke-3: Di bawah kolong panggung dekat tiang mematuk tanah
                spot = {
                    x: cX + 0.2, y: 0.0, z: cZ + 0.3,
                    rotY: Math.PI * 0.7, variant: "brown",
                    isNesting: false, isOnRamp: false, isUnderStilts: true
                };
            } else {
                // Ayam ke-4: Di bagian depan bawah dekat keset 'EGGS' mencari makan
                spot = {
                    x: cX + 3.35, y: 0.0, z: cZ - 0.65,
                    rotY: Math.PI / 2, variant: "white",
                    isNesting: false, isOnRamp: false, isUnderStilts: false
                };
            }

            const mesh = MB.createChicken(spot.variant, spot.isNesting);
            mesh.position.set(spot.x, spot.y, spot.z);
            mesh.rotation.y = spot.rotY;
            this.scene.add(mesh);

            this.animalEntities.push({
                type: "chicken",
                stateRef: animal,
                mesh: mesh,
                spawnY: spot.y,
                isNesting: spot.isNesting,
                isOnRamp: spot.isOnRamp,
                isUnderStilts: spot.isUnderStilts,
                isEating: false,
                penCenter: spot.isUnderStilts 
                    ? { x: cX + 0.2, z: cZ + 0.3, rx: 0.6, rz: 0.6 } 
                    : { x: cX + 3.5, z: cZ, rx: 3.0, rz: 1.4 },
                targetX: spot.x,
                targetZ: spot.z,
                isWalking: false,
                wanderTimer: (spot.isNesting || spot.isOnRamp) ? 999999 : (Math.random() * 3 + 1),
                peckTimer: Math.random() * 5,
                produceTimer: animal.timer || (Math.random() * 4000),
                produceInterval: animal.produceTime || 5000,
                walkSpeed: 1.2
            });
        });

        // ==========================================
        // 2. KANDANG SAPI (COW PADDOCK - 18 x 14 METER)
        // Pen center: cx = -20, cz = 21, rx = 7.0, rz = 5.5
        // ==========================================
        ownedCows.forEach((animal, idx) => {
            const mesh = MB.createCow();

            const spawnX = -20 + (Math.random() * 8 - 4);
            const spawnZ = 21 + (Math.random() * 7 - 3.5);
            const rotY = (Math.random() * 2 - 1) * Math.PI;

            mesh.position.set(spawnX, 0, spawnZ);
            mesh.rotation.y = rotY;
            this.scene.add(mesh);

            this.animalEntities.push({
                type: "cow",
                stateRef: animal,
                mesh: mesh,
                spawnY: 0,
                isNesting: false,
                isEating: false,
                eatTimer: 0,
                troughPos: { x: -16.8, z: 21.0 },
                penCenter: { x: -20, z: 21, rx: 6.5, rz: 5.0 },
                targetX: spawnX,
                targetZ: spawnZ,
                isWalking: false,
                wanderTimer: Math.random() * 2.5 + 1.0,
                peckTimer: 0,
                produceTimer: animal.timer || (Math.random() * 6000),
                produceInterval: animal.produceTime || 8000,
                walkSpeed: 0.85
            });
        });

        // ==========================================
        // 3. KANDANG DOMBA (SHEEP PADDOCK - 18 x 14 METER)
        // Pen center: cx = -20, cz = -13, rx = 7.0, rz = 5.5
        // ==========================================
        ownedSheep.forEach((animal, idx) => {
            const variant = (idx % 3 === 0) ? "white" : (idx % 3 === 1 ? "cream" : "grey");
            const mesh = MB.createSheep(variant);

            const spawnX = -20 + (Math.random() * 8 - 4);
            const spawnZ = -13 + (Math.random() * 7 - 3.5);
            const rotY = (Math.random() * 2 - 1) * Math.PI;

            mesh.position.set(spawnX, 0, spawnZ);
            mesh.rotation.y = rotY;
            this.scene.add(mesh);

            this.animalEntities.push({
                type: "sheep",
                stateRef: animal,
                mesh: mesh,
                spawnY: 0,
                isNesting: false,
                isEating: false,
                eatTimer: 0,
                troughPos: { x: -16.8, z: -13.0 },
                penCenter: { x: -20, z: -13, rx: 6.5, rz: 5.0 },
                targetX: spawnX,
                targetZ: spawnZ,
                isWalking: false,
                wanderTimer: Math.random() * 2.5 + 1.0,
                peckTimer: 0,
                produceTimer: animal.timer || (Math.random() * 8000),
                produceInterval: animal.produceTime || 11000,
                walkSpeed: 1.05
            });
        });

        // Sinkronisasi status barikade gembok kandang sapi & domba
        this.updatePaddockLocks();
    }

    clearAllInputState() {
        this.keys = {};
        this.mouseTarget = null;
        this.isPointerDragging = false;
        this.clickDestination = null;
        if (this.clickTargetMesh) this.clickTargetMesh.visible = false;
        if (this.playerMesh && this.playerMesh.userData) {
            const u = this.playerMesh.userData;
            if (u.leftLeg) u.leftLeg.rotation.x = 0;
            if (u.rightLeg) u.rightLeg.rotation.x = 0;
            if (u.leftArm) u.leftArm.rotation.x = 0;
            if (u.rightArm) u.rightArm.rotation.x = 0;
        }
    }

    updatePaddockVisibility() {
        const hasCow = !!(this.state && this.state.upgrades && this.state.upgrades.hasCow);
        const hasSheep = !!(this.state && this.state.upgrades && this.state.upgrades.hasSheep);

        if (this.cowPaddockGroup) {
            this.cowPaddockGroup.visible = hasCow;
        }
        if (this.sheepPaddockGroup) {
            this.sheepPaddockGroup.visible = hasSheep;
        }
        if (this.chickenPaddockGroup) {
            this.chickenPaddockGroup.visible = true;
        }
    }

    updatePaddockLocks() {
        this.updatePaddockVisibility();
        if (this.paddockLockMeshes.cow) {
            this.scene.remove(this.paddockLockMeshes.cow);
            this.paddockLockMeshes.cow = null;
        }
        if (this.paddockLockMeshes.sheep) {
            this.scene.remove(this.paddockLockMeshes.sheep);
            this.paddockLockMeshes.sheep = null;
        }
    }

    initInput() {
        let pointerDownTime = 0;
        let pointerDownCoord = { x: 0, y: 0 };

        window.addEventListener("keydown", (e) => {
            const isModalOpen = !!document.querySelector(".modal-overlay:not(.hidden)");
            if (isModalOpen) {
                this.clearAllInputState();
                if (e.key === "Escape") {
                    document.querySelectorAll(".modal-overlay").forEach(m => m.classList.add("hidden"));
                    this.clearAllInputState();
                    if (document.activeElement) document.activeElement.blur();
                }
                return;
            }

            // Tombol Escape membatalkan tujuan gerak klik-tanah seketika
            if (e.key === "Escape") {
                this.clickDestination = null;
                if (this.clickTargetMesh) this.clickTargetMesh.visible = false;
            }

            this.keys[e.key.toLowerCase()] = true;
            this.sound.init();

            // Toggle Dual-Camera System (V atau C)
            if (e.key === "v" || e.key === "V" || e.key === "c" || e.key === "C") {
                this.toggleCameraMode();
            }

            // Ambil Telur Satu Persatu / Interaksi Stasiun dengan Tombol E
            if (e.key === "e" || e.key === "E") {
                this.handleInteractE();
            }
            // Buka Ransel / Inventaris dengan Tombol B atau I
            if (e.key === "b" || e.key === "B" || e.key === "i" || e.key === "I") {
                const invModal = document.getElementById("inventoryModal");
                if (invModal && !invModal.classList.contains("hidden")) {
                    this.closeInventoryModal();
                } else {
                    this.openInventoryModal();
                }
            }
            if (e.key === " " || e.key === "Spacebar") {
                this.triggerShipTruck();
            }
        });

        window.addEventListener("keyup", (e) => {
            this.keys[e.key.toLowerCase()] = false;
            if (e.code) {
                if (e.code === "KeyW") this.keys["w"] = false;
                if (e.code === "KeyA") this.keys["a"] = false;
                if (e.code === "KeyS") this.keys["s"] = false;
                if (e.code === "KeyD") this.keys["d"] = false;
            }
        });

        // 1. Cegah Menu Konteks / Klik Kanan Default Browser di Atas Game
        // Memastikan jika pemain tidak sengaja klik kanan, karakter TIDAK jalan sendiri
        this.renderer.domElement.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.clearAllInputState();
            return false;
        });

        window.addEventListener("contextmenu", (e) => {
            if (e.target === this.renderer.domElement || (this.container && this.container.contains(e.target))) {
                e.preventDefault();
                this.clearAllInputState();
                return false;
            }
        });

        // 2. Reset semua tombol jika jendela browser kehilangan fokus, pointer dibatalkan, atau tab berganti
        window.addEventListener("blur", () => {
            this.clearAllInputState();
        });

        window.addEventListener("focus", () => {
            this.clearAllInputState();
        });

        window.addEventListener("pointercancel", () => {
            this.clearAllInputState();
        });

        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                this.clearAllInputState();
            }
        });

        // 3. Pointer Input: HANYA proses tombol Klik Kiri Utama (e.button === 0)
        this.renderer.domElement.addEventListener("pointerdown", (e) => {
            if (e.button !== 0) {
                // Abaikan klik kanan / tengah agar karakter tidak terpicu jalan sendiri
                this.clearAllInputState();
                return;
            }
            this.sound.init();
            this.isPointerDragging = true;
            this.pointerDownPos = { x: e.clientX, y: e.clientY };
            pointerDownCoord = { x: e.clientX, y: e.clientY };
            pointerDownTime = performance.now();
        });

        this.renderer.domElement.addEventListener("pointermove", (e) => {
            if (!this.isPointerDragging) return;

            if (this.cameraMode === "firstperson" || this.cameraMode === "thirdperson") {
                // Rotasi sudut pandang kamera FPV / Third-Person (Look Around 360°)
                const dx = e.clientX - this.pointerDownPos.x;
                const dy = e.clientY - this.pointerDownPos.y;
                this.pointerDownPos = { x: e.clientX, y: e.clientY };

                this.fpvYaw -= dx * 0.005;
                this.fpvPitch = Math.max(-0.75, Math.min(0.75, this.fpvPitch - dy * 0.005));
            }
        });

        window.addEventListener("pointerup", (e) => {
            this.isPointerDragging = false;
            if (e.button !== 0) {
                this.clearAllInputState();
                return;
            }
            const clickDuration = performance.now() - pointerDownTime;
            const dragDist = Math.hypot(e.clientX - pointerDownCoord.x, e.clientY - pointerDownCoord.y);

            // Click to Move: HANYA untuk klik kiri tanah di Diorama Overview
            const isModalOpen = !!document.querySelector(".modal-overlay:not(.hidden)");
            if (this.cameraMode === "overview" && clickDuration < 380 && dragDist < 8 && !isModalOpen) {
                const rect = this.renderer.domElement.getBoundingClientRect();
                this.mousePos.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
                this.mousePos.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
                this.raycaster.setFromCamera(this.mousePos, this.camera);
                const targetPoint = new THREE.Vector3();
                if (this.raycaster.ray.intersectPlane(this.groundPlane, targetPoint)) {
                    // Batas map luas 3x lipat
                    const clampedX = Math.max(-140, Math.min(140, targetPoint.x));
                    const clampedZ = Math.max(-130, Math.min(130, targetPoint.z));
                    this.clickDestination = new THREE.Vector3(clampedX, 0, clampedZ);

                    if (this.clickTargetMesh) {
                        this.clickTargetMesh.position.set(clampedX, 0.05, clampedZ);
                        this.clickTargetMesh.scale.set(1, 1, 1);
                        this.clickTargetMesh.visible = true;
                    }
                }
            }
        });
    }

    toggleCameraMode() {
        if (this.cameraMode === "overview") {
            this.cameraMode = "thirdperson";
        } else if (this.cameraMode === "thirdperson") {
            this.cameraMode = "firstperson";
        } else {
            this.cameraMode = "overview";
        }
        if (this.sound) this.sound.playMachine();

        // Notifikasi toast HUD bergaya Unreal Engine
        const toast = document.getElementById("cameraToast");
        if (toast) {
            if (this.cameraMode === "thirdperson") {
                toast.textContent = "🏃 Mode: Third-Person (Kamera Mengikuti Petani dari Belakang)";
            } else if (this.cameraMode === "firstperson") {
                toast.textContent = "👀 Mode: First-Person POV (Mata Pemain - Jernih Tanpa Halangan)";
            } else {
                toast.textContent = "🎥 Mode: Birds-Eye Overview (Diorama 2.5D)";
            }
            toast.classList.add("show");
            if (this.toastTimer) clearTimeout(this.toastTimer);
            this.toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
        }

        // Tampilkan/sembunyikan crosshair reticle di tengah layar saat FPV
        if (this.container) {
            this.container.classList.toggle("fpv-active", this.cameraMode === "firstperson");
        }

        // Label tombol pada header HUD
        const btnCam = document.getElementById("btnToggleCamera");
        if (btnCam) {
            if (this.cameraMode === "thirdperson") {
                btnCam.textContent = "🏃 3rd (V)";
            } else if (this.cameraMode === "firstperson") {
                btnCam.textContent = "👀 FPV (V)";
            } else {
                btnCam.textContent = "🎥 Diorama (V)";
            }
        }
    }

    showToast(message, duration = 2400) {
        const toast = document.getElementById("cameraToast");
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add("show");
        if (this.toastTimer) clearTimeout(this.toastTimer);
        this.toastTimer = setTimeout(() => {
            toast.classList.remove("show");
        }, duration);
    }

    handleResetGame() {
        const confirmed = confirm("Apakah Anda yakin ingin memulai peternakan dari awal? Semua uang, hewan, dan level akan direset kembali ke awal baru.");
        if (!confirmed) return;

        this.clearAllInputState();
        try {
            localStorage.removeItem("farm_industry_save");
        } catch (e) {}

        this.state.resetToDefaults();

        // 100% Bersihkan seluruh item panen lama di tanah (susu, telur, wol, dll)
        if (this.groundItemMeshes && this.groundItemMeshes.length > 0) {
            this.groundItemMeshes.forEach(item => {
                if (item && item.mesh) {
                    this.scene.remove(item.mesh);
                    item.mesh.traverse(child => {
                        if (child.geometry) child.geometry.dispose();
                        if (child.material) {
                            if (Array.isArray(child.material)) child.material.forEach(m => m.dispose());
                            else child.material.dispose();
                        }
                    });
                }
            });
            this.groundItemMeshes = [];
        }
        this.groundItems = [];
        this.nearestItem = null;

        // Reset armada kendaraan & hewan (hanya ayam 1 ekor di awal)
        this.rebuildTruck3D();
        this.syncAnimalsWithAI();

        // Kunci & sembunyikan kembali kandang sapi dan domba
        this.updatePaddockLocks();
        this.updatePaddockVisibility();

        // Reposisi karakter pemain ke posisi awal halaman
        if (this.playerMesh) {
            this.playerMesh.position.set(0.0, 0, 6.5);
            this.playerMesh.rotation.set(0, 0, 0);
        }

        this.updateHUD();
        this.clearAllInputState();

        // Tutup semua modal yang aktif
        ["howToPlayModal", "questModal", "shopModal", "animalShopModal", "inventoryModal"].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.add("hidden");
        });

        if (document.activeElement) document.activeElement.blur();

        // Tampilkan Layar Utama / Pembuatan Karakter Pop-up
        this.openCharacterCreationModal();
    }

    openCharacterCreationModal() {
        this.clearAllInputState();
        const modal = document.getElementById("characterCreationModal");
        if (!modal) return;

        const inputPlayer = document.getElementById("inputPlayerName");
        const inputFarm = document.getElementById("inputFarmName");
        if (inputPlayer) inputPlayer.value = (this.state && this.state.player && this.state.player.name) || "Petani Hebat";
        if (inputFarm) inputFarm.value = (this.state && this.state.player && this.state.player.farmName) || "Green Valley Farm";

        this.selectedCharType = (this.state && this.state.player && this.state.player.characterType) || "grandpa";
        const cards = modal.querySelectorAll(".char-card");
        cards.forEach(card => {
            if (card.getAttribute("data-char") === this.selectedCharType) {
                card.classList.add("selected");
            } else {
                card.classList.remove("selected");
            }
        });

        modal.classList.remove("hidden");
    }

    closeCharacterCreationModal() {
        const modal = document.getElementById("characterCreationModal");
        if (modal) modal.classList.add("hidden");
    }

    initCharacterCreationUI() {
        const modal = document.getElementById("characterCreationModal");
        if (!modal) return;

        this.selectedCharType = (this.state && this.state.player && this.state.player.characterType) || "grandpa";

        const cards = modal.querySelectorAll(".char-card");
        cards.forEach(card => {
            card.addEventListener("click", () => {
                cards.forEach(c => c.classList.remove("selected"));
                card.classList.add("selected");
                this.selectedCharType = card.getAttribute("data-char");
                if (this.sound && this.sound.playClick) this.sound.playClick();
            });
        });

        const btnStart = document.getElementById("btnStartAdventure");
        if (btnStart) {
            btnStart.addEventListener("click", () => {
                const inputPlayer = document.getElementById("inputPlayerName");
                const inputFarm = document.getElementById("inputFarmName");

                const playerName = (inputPlayer && inputPlayer.value.trim()) ? inputPlayer.value.trim() : "Petani Hebat";
                const farmName = (inputFarm && inputFarm.value.trim()) ? inputFarm.value.trim() : "Green Valley Farm";
                const charType = this.selectedCharType || "grandpa";

                if (this.state && this.state.player) {
                    this.state.player.name = playerName;
                    this.state.player.farmName = farmName;
                    this.state.player.characterType = charType;
                    this.state.player.hasCreatedCharacter = true;
                    this.state.save();
                }

                this.rebuildPlayerMesh();
                this.closeCharacterCreationModal();
                if (this.sound && this.sound.playUpgrade) this.sound.playUpgrade();
                this.showToast(`🌾 Selamat datang di ${farmName}, ${playerName}! Petualangan dimulai!`, 4000);
                this.updateHUD();
            });
        }
    }

    rebuildPlayerMesh() {
        const MB = window.ModelBuilder3D;
        if (!MB || !MB.createPlayerCharacter) return;

        const oldPos = this.playerMesh ? this.playerMesh.position.clone() : new THREE.Vector3(0, 0, 6.5);
        const oldRot = this.playerMesh ? this.playerMesh.rotation.y : 0;

        if (this.playerMesh) {
            this.scene.remove(this.playerMesh);
            this.playerMesh.traverse(child => {
                if (child.geometry) child.geometry.dispose();
                if (child.material) {
                    if (Array.isArray(child.material)) child.material.forEach(m => m.dispose());
                    else child.material.dispose();
                }
            });
        }

        const charType = (this.state && this.state.player && this.state.player.characterType) || "grandpa";
        const playerName = (this.state && this.state.player && this.state.player.name) || "Petani Hebat";

        this.playerMesh = MB.createPlayerCharacter(charType);
        this.playerMesh.position.copy(oldPos);
        this.playerMesh.rotation.y = oldRot;
        this.scene.add(this.playerMesh);

        this.nameplateSprite = this.createPlayerNameplate(playerName);
        this.playerMesh.add(this.nameplateSprite);
    }

    openInventoryModal() {
        this.clearAllInputState();
        const modal = document.getElementById("inventoryModal");
        if (!modal) return;
        modal.classList.remove("hidden");
        this.renderInventoryGUI();
        if (this.sound && this.sound.playClick) this.sound.playClick();
    }

    closeInventoryModal() {
        this.clearAllInputState();
        const modal = document.getElementById("inventoryModal");
        if (modal) modal.classList.add("hidden");
        if (this.sound && this.sound.playClick) this.sound.playClick();
        if (document.activeElement) document.activeElement.blur();
    }

    renderInventoryGUI() {
        const modal = document.getElementById("inventoryModal");
        if (!modal || modal.classList.contains("hidden")) return;

        const bagCount = this.state.getBagCount();
        const maxBag = this.state.getMaxBagCapacity();
        const bagPercent = Math.min(100, Math.round((bagCount / maxBag) * 100));

        const truckCount = this.state.getTruckCargoCount();
        const truckCfg = this.state.getTruckConfig();
        const truckCap = truckCfg.capacity;
        const truckPercent = Math.min(100, Math.round((truckCount / truckCap) * 100));

        // Update badge di tab
        const tabBagCountEl = document.getElementById("invBagTabCount");
        if (tabBagCountEl) tabBagCountEl.textContent = `${bagCount}/${maxBag}`;
        const tabTruckCountEl = document.getElementById("invTruckTabCount");
        if (tabTruckCountEl) tabTruckCountEl.textContent = `${truckCount}/${truckCap}`;

        // Kapasitas Ransel
        const capTextEl = document.getElementById("invBagCapacityText");
        if (capTextEl) capTextEl.textContent = `${bagCount} / ${maxBag} Barang (${bagPercent}% Penuh)`;
        const capFillEl = document.getElementById("invBagCapacityFill");
        if (capFillEl) {
            capFillEl.style.width = `${bagPercent}%`;
            capFillEl.classList.toggle("full", bagCount >= maxBag);
        }

        // Kapasitas Truk
        const truckCapTextEl = document.getElementById("invTruckCapacityText");
        if (truckCapTextEl) truckCapTextEl.textContent = `${truckCount} / ${truckCap} Muatan (${truckPercent}% Penuh)`;
        const truckCapFillEl = document.getElementById("invTruckCapacityFill");
        if (truckCapFillEl) {
            truckCapFillEl.style.width = `${truckPercent}%`;
            truckCapFillEl.classList.toggle("full", truckCount >= truckCap);
        }
        const invTruckNameEl = document.getElementById("invTruckName");
        if (invTruckNameEl) invTruckNameEl.textContent = truckCfg.name;

        const itemDescriptions = {
            egg: "Telur ayam segar. Dapat diolah di Mesin Mayones menjadi botol mayones atau dimuat ke truk.",
            milk: "Susu sapi murni segar. Dapat dipres di Mesin Keju menjadi keju balok lezat atau dimuat ke truk.",
            wool: "Bulu domba wol tebal. Dapat ditenun di Alat Tenun menjadi kain berkualitas atau dimuat ke truk.",
            mayo: "Mayones kemasan lezat. Produk olahan bernilai tinggi untuk diekspor lewat armada pengantar.",
            cheese: "Keju balok fermentasi gurih. Hasil olahan bernilai tinggi dari susu murni sapi.",
            fabric: "Gulungan kain tenun halus. Hasil olahan bernilai tinggi dari bulu domba wol.",
            meat: "Daging segar peternakan berkualitas tinggi.",
            golden_yarn: "Benang emas legendaris bernilai sangat tinggi."
        };

        // Render Ransel
        const bagListEl = document.getElementById("invBagItemsList");
        if (bagListEl) {
            bagListEl.innerHTML = "";
            let totalBagValue = 0;

            if (!this.state.player.bag || this.state.player.bag.length === 0 || bagCount === 0) {
                bagListEl.innerHTML = `
                    <div class="inventory-empty-state">
                        <div class="inv-empty-icon">🧺</div>
                        <div class="inv-empty-title">Ransel Anda Masih Kosong!</div>
                        <div class="inv-empty-desc">
                            Ambil telur ayam di kandang ayam, perah susu sapi di kandang sapi, gunting wol domba, atau ambil produk olahan dari mesin pabrik untuk mengisi ransel Anda.
                        </div>
                    </div>
                `;
            } else {
                this.state.player.bag.forEach(item => {
                    if (item.count <= 0) return;
                    const def = (typeof ITEM_DEFS !== "undefined" && ITEM_DEFS[item.type]) || { name: item.type, price: 5, icon: "📦" };
                    const itemTotal = (def.price || 5) * item.count;
                    totalBagValue += itemTotal;
                    const desc = itemDescriptions[item.type] || "Hasil panen berkualitas dari peternakan.";

                    const card = document.createElement("div");
                    card.className = "inv-item-card";
                    card.innerHTML = `
                        <div class="inv-item-icon-box">
                            ${this.getQuestItemIcon(item.type)}
                        </div>
                        <div class="inv-item-name">${def.name}</div>
                        <div class="inv-item-qty-badge">x${item.count} Tersimpan</div>
                        <div class="inv-item-price-tag">Rp ${def.price} / butir (Total: Rp ${itemTotal.toLocaleString("id-ID")})</div>
                        <div class="inv-item-desc">${desc}</div>
                        <button class="inv-item-action-btn btn-load-one" data-type="${item.type}">
                            🚚 Muat 1 ke Truk
                        </button>
                    `;

                    const btnLoad = card.querySelector(".btn-load-one");
                    if (btnLoad) {
                        btnLoad.addEventListener("click", () => {
                            if (this.state.truck.status === "delivering") {
                                this.showToast("⚠️ Armada sedang di jalan mengantar pesanan!");
                                return;
                            }
                            if (this.state.getTruckCargoCount() >= truckCap) {
                                this.showToast("⚠️ Muatan truk sudah penuh! Berangkatkan dulu.");
                                return;
                            }
                            if (this.state.removeFromBag(item.type, 1)) {
                                let cargo = this.state.truck.cargo.find(c => c.type === item.type);
                                if (cargo) cargo.count += 1;
                                else this.state.truck.cargo.push({ type: item.type, count: 1 });
                                if (this.sound && this.sound.playDeposit) this.sound.playDeposit();
                                this.renderInventoryGUI();
                                this.updateHUD();
                            }
                        });
                    }

                    bagListEl.appendChild(card);
                });
            }

            const totalValEl = document.getElementById("invBagTotalValue");
            if (totalValEl) totalValEl.textContent = `Rp ${totalBagValue.toLocaleString("id-ID")}`;
        }

        // Render Truk Cargo
        const truckListEl = document.getElementById("invTruckItemsList");
        if (truckListEl) {
            truckListEl.innerHTML = "";
            let totalTruckValue = 0;

            if (!this.state.truck.cargo || this.state.truck.cargo.length === 0 || truckCount === 0) {
                truckListEl.innerHTML = `
                    <div class="inventory-empty-state">
                        <div class="inv-empty-icon">🚚</div>
                        <div class="inv-empty-title">Bak Truk Masih Kosong!</div>
                        <div class="inv-empty-desc">
                            Muat barang dari ransel ke truk untuk dikirimkan dan menghasilkan uang kas peternakan.
                        </div>
                    </div>
                `;
            } else {
                this.state.truck.cargo.forEach(item => {
                    if (item.count <= 0) return;
                    const def = (typeof ITEM_DEFS !== "undefined" && ITEM_DEFS[item.type]) || { name: item.type, price: 5, icon: "📦" };
                    const mult = truckCfg.multiplier || 1.0;
                    const itemTotal = Math.round((def.price || 5) * mult * item.count);
                    totalTruckValue += itemTotal;

                    const card = document.createElement("div");
                    card.className = "inv-item-card";
                    card.innerHTML = `
                        <div class="inv-item-icon-box">
                            ${this.getQuestItemIcon(item.type)}
                        </div>
                        <div class="inv-item-name">${def.name}</div>
                        <div class="inv-item-qty-badge" style="background:#E3F2FD; color:#1565C0; border-color:#90CAF9;">x${item.count} Dimuat</div>
                        <div class="inv-item-price-tag">Nilai Ekspor: Rp ${itemTotal.toLocaleString("id-ID")} (Bonus: x${mult})</div>
                        <div class="inv-item-desc">Barang siap dikirim ke pembeli kota saat armada diberangkatkan.</div>
                        <button class="inv-item-action-btn btn-unload-one" data-type="${item.type}" style="color:#C62828; border-color:#FFCDD2; background:#FFEBEE;">
                            🎒 Ambil ke Ransel
                        </button>
                    `;

                    const btnUnload = card.querySelector(".btn-unload-one");
                    if (btnUnload) {
                        btnUnload.addEventListener("click", () => {
                            if (this.state.truck.status === "delivering") {
                                this.showToast("⚠️ Armada sedang di jalan, tidak bisa mengambil muatan!");
                                return;
                            }
                            if (this.state.getBagCount() >= maxBag) {
                                this.showToast("⚠️ Ransel Anda sudah penuh!");
                                return;
                            }
                            item.count -= 1;
                            if (item.count <= 0) {
                                this.state.truck.cargo = this.state.truck.cargo.filter(c => c.type !== item.type);
                            }
                            this.state.addToBag(item.type, 1);
                            if (this.sound && this.sound.playHarvest) this.sound.playHarvest();
                            this.renderInventoryGUI();
                            this.updateHUD();
                        });
                    }

                    truckListEl.appendChild(card);
                });
            }

            const truckValEl = document.getElementById("invTruckTotalValue");
            if (truckValEl) truckValEl.textContent = `Rp ${totalTruckValue.toLocaleString("id-ID")}`;

            const descEl = document.getElementById("invTruckStatusDesc");
            if (descEl) {
                if (this.state.truck.status === "delivering") {
                    const totalMs = this.state.truck.deliverDuration || 45000;
                    const sLeft = Math.max(1, Math.ceil((totalMs - this.state.truck.deliverTimer) / 1000));
                    descEl.textContent = `🚚 Sedang mengantar pesanan... Kembali dalam ${sLeft}s`;
                } else {
                    descEl.textContent = "🚚 Armada standby di dermaga peternakan. Muat barang dan kirim!";
                }
            }
        }
    }

    initInventoryUI() {
        const btnOpen = document.getElementById("btnQuickBagAction");
        if (btnOpen) {
            btnOpen.addEventListener("click", (e) => {
                e.stopPropagation();
                this.openInventoryModal();
            });
        }

        const bagPill = document.querySelector(".hud-bag-pill");
        if (bagPill) {
            bagPill.addEventListener("click", () => {
                this.openInventoryModal();
            });
        }

        const btnClose = document.getElementById("btnCloseInventoryModal");
        if (btnClose) {
            btnClose.addEventListener("click", () => this.closeInventoryModal());
        }

        const tabBag = document.getElementById("tabInvBag");
        const tabTruck = document.getElementById("tabInvTruck");
        const secBag = document.getElementById("sectionInvBag");
        const secTruck = document.getElementById("sectionInvTruck");

        if (tabBag && tabTruck && secBag && secTruck) {
            tabBag.addEventListener("click", () => {
                tabBag.classList.add("active");
                tabTruck.classList.remove("active");
                secBag.classList.remove("hidden");
                secTruck.classList.add("hidden");
                if (this.sound && this.sound.playClick) this.sound.playClick();
                this.renderInventoryGUI();
            });

            tabTruck.addEventListener("click", () => {
                tabTruck.classList.add("active");
                tabBag.classList.remove("active");
                secTruck.classList.remove("hidden");
                secBag.classList.add("hidden");
                if (this.sound && this.sound.playClick) this.sound.playClick();
                this.renderInventoryGUI();
            });
        }

        const btnUpgrade = document.getElementById("btnUpgradeBagFromInv");
        if (btnUpgrade) {
            btnUpgrade.addEventListener("click", () => {
                this.closeInventoryModal();
                this.openShopModal();
            });
        }

        const btnLoadAll = document.getElementById("btnLoadAllToTruck");
        if (btnLoadAll) {
            btnLoadAll.addEventListener("click", () => {
                if (this.state.truck.status === "delivering") {
                    this.showToast("⚠️ Armada sedang di jalan mengantar pesanan!");
                    return;
                }
                const truckCfg = this.state.getTruckConfig();
                let loadedAny = false;
                while (this.state.player.bag.length > 0 && this.state.getTruckCargoCount() < truckCfg.capacity) {
                    const item = this.state.player.bag[0];
                    if (this.state.removeFromBag(item.type, 1)) {
                        let cargo = this.state.truck.cargo.find(c => c.type === item.type);
                        if (cargo) cargo.count += 1;
                        else this.state.truck.cargo.push({ type: item.type, count: 1 });
                        loadedAny = true;
                    } else break;
                }
                if (loadedAny) {
                    if (this.sound && this.sound.playDeposit) this.sound.playDeposit();
                    this.showToast("🚚 Semua barang berhasil dimuat ke armada pengantar!");
                    this.renderInventoryGUI();
                    this.updateHUD();
                } else {
                    if (this.state.player.bag.length === 0) this.showToast("⚠️ Ransel Anda sudah kosong!");
                    else this.showToast("⚠️ Muatan armada sudah penuh!");
                }
            });
        }

        const btnShip = document.getElementById("btnShipTruckFromInv");
        if (btnShip) {
            btnShip.addEventListener("click", () => {
                this.closeInventoryModal();
                this.triggerShipTruck();
            });
        }
    }

    handleInteractE() {
        // 1. Papan Misi Harian 3D (Persis Screenshot media_1794423944018_32f52c0d.jpg)
        if (this.nearQuestBoard) {
            this.clearAllInputState();
            this.openQuestModal();
            return;
        }

        // 2. Gerobak Toko Hewan
        if (this.nearAnimalCart) {
            this.clearAllInputState();
            this.openAnimalShopModal();
            return;
        }

        // 2B. Gerbang Kandang Terkunci (Sapi & Domba)
        if (this.nearCowUnlock && !this.state.upgrades.hasCow) {
            this.clearAllInputState();
            const success = this.state.unlockPaddock("cow");
            if (success) {
                this.syncAnimalsWithAI();
                this.updatePaddockLocks();
                this.sound.playUpgrade();
                this.spawnSparks3D(-11.0, 1.5, 21.0, 0x4CAF50, 35);
                this.updateHUD();
                this.showToast("🎉 Berhasil membuka Kandang Sapi! 1 ekor sapi perah telah tiba.");
            } else {
                this.showToast("⚠️ Saldo Anda belum mencukupi (Rp 150) untuk membuka Kandang Sapi!");
            }
            return;
        }

        if (this.nearSheepUnlock && !this.state.upgrades.hasSheep) {
            this.clearAllInputState();
            const success = this.state.unlockPaddock("sheep");
            if (success) {
                this.syncAnimalsWithAI();
                this.updatePaddockLocks();
                this.sound.playUpgrade();
                this.spawnSparks3D(-11.0, 1.5, -13.0, 0x4CAF50, 35);
                this.updateHUD();
                this.showToast("🎉 Berhasil membuka Padang Domba! 1 ekor domba wol telah tiba.");
            } else {
                this.showToast("⚠️ Saldo Anda belum mencukupi (Rp 300) untuk membuka Padang Domba!");
            }
            return;
        }

        // 3. Ambil Bahan Panen di Tanah Satu Persatu (Telur, Susu, Wol, Keju, Mayo, dll)
        if (this.nearestItem) {
            const isBagFull = (this.state.getBagCount() >= this.state.getMaxBagCapacity());
            if (isBagFull) {
                if (this.sound && this.sound.playBuzz) this.sound.playBuzz();
                this.showToast("🎒 Ransel Penuh! Setor ke mesin atau muat ke armada truk dulu.");
                return;
            }

            const item = this.nearestItem;
            const added = this.state.addToBag(item.type, 1);
            if (added > 0) {
                this.sound.playHarvest();
                this.joyTimer = 0.35;
                this.spawnSparks3D(item.mesh.position.x, 0.4, item.mesh.position.z, 0xFFF59D);
                this.scene.remove(item.mesh);

                const idx = this.groundItemMeshes.indexOf(item);
                if (idx !== -1) {
                    this.groundItemMeshes.splice(idx, 1);
                }
                this.state.stats.totalHarvested++;
                this.state.onItemCollected(item.type, 1);
                this.updateHUD();
                this.nearestItem = null;
                this.updateGroundItems3D(0);
                return;
            }
        }

        // 4. Stasiun Pengolahan Mesin 3D (Waktu Proses 3 Detik)
        if (this.nearMachine) {
            this.interactMachine3D(this.nearMachine);
            return;
        }

        // 5. Interaksi Panen Langsung dari Hewan Ternak di Kandang (Ayam, Domba, Sapi)
        if (this.nearAnimalHarvest) {
            const isBagFull = (this.state.getBagCount() >= this.state.getMaxBagCapacity());
            if (isBagFull) {
                if (this.sound && this.sound.playBuzz) this.sound.playBuzz();
                this.showToast("🎒 Ransel Penuh! Kosongkan isi ransel dulu.");
                return;
            }

            const h = this.nearAnimalHarvest;
            const added = this.state.addToBag(h.type, 1);
            if (added > 0) {
                this.sound.playHarvest();
                this.joyTimer = 0.35;
                if (h.ent && h.ent.mesh) {
                    h.ent.mesh.position.y += 0.35;
                    setTimeout(() => { if (h.ent && h.ent.mesh) h.ent.mesh.position.y = 0; }, 280);
                    this.spawnEmote3D(h.ent.mesh.position.x, h.ent.mesh.position.y + 1.2, h.ent.mesh.position.z, "❤️");
                }
                this.spawnSparks3D(h.ent.mesh.position.x, 1.2, h.ent.mesh.position.z, 0x69F0AE, 16);
                this.state.stats.totalHarvested++;
                this.state.onItemCollected(h.type, 1);
                this.showToast(`✨ Berhasil memanen 1 ${h.name}! Masuk ke ransel.`);
                this.updateHUD();
                return;
            }
        }

        // 6. Aksi Stasiun Pad Mesin / Truk jika tidak berada di dekat objek langsung
        this.checkPadsTrigger();
    }

    updateMouseWorldTarget(e) {
        const rect = this.renderer.domElement.getBoundingClientRect();
        this.mousePos.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        this.mousePos.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        this.raycaster.setFromCamera(this.mousePos, this.camera);
        const intersect = new THREE.Vector3();
        if (this.raycaster.ray.intersectPlane(this.groundPlane, intersect)) {
            this.mouseTarget = intersect;
        }
    }

    initUI() {
        const btnAnimalShop = document.getElementById("btnOpenAnimalShop");
        if (btnAnimalShop) btnAnimalShop.addEventListener("click", () => this.openAnimalShopModal());

        const btnShop = document.getElementById("btnOpenShop");
        if (btnShop) btnShop.addEventListener("click", () => this.openShopModal());

        const btnMute = document.getElementById("btnToggleSound");
        if (btnMute) {
            btnMute.addEventListener("click", () => {
                const isMuted = this.sound.toggleMute();
                btnMute.textContent = isMuted ? "🔇 Suara: Mati" : "🔊 Suara: Nyala";
                btnMute.classList.toggle("btn-muted", isMuted);
            });
        }

        const btnToggleCam = document.getElementById("btnToggleCamera");
        if (btnToggleCam) {
            btnToggleCam.addEventListener("click", () => this.toggleCameraMode());
        }

        const btnShipTruck = document.getElementById("btnShipTruck");
        if (btnShipTruck) btnShipTruck.addEventListener("click", () => this.triggerShipTruck());

        const btnHowToPlay = document.getElementById("btnHowToPlay");
        if (btnHowToPlay) {
            btnHowToPlay.addEventListener("click", () => {
                const m = document.getElementById("howToPlayModal");
                if (m) m.classList.remove("hidden");
            });
        }

        // Tab Navigasi Buku Panduan (How To Play Guide Tabs)
        const guideNavBtns = document.querySelectorAll(".guide-nav-btn");
        const guidePanes = document.querySelectorAll(".guide-tab-pane");
        guideNavBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                guideNavBtns.forEach(b => b.classList.remove("active"));
                guidePanes.forEach(p => p.classList.add("hidden"));
                btn.classList.add("active");
                const targetId = btn.getAttribute("data-target");
                const targetPane = document.getElementById(targetId);
                if (targetPane) targetPane.classList.remove("hidden");
                if (this.sound && this.sound.playClick) this.sound.playClick();
            });
        });

        // Tombol Reset / Mulai Ulang Peternakan dari Awal
        const btnResetGame = document.getElementById("btnResetGame");
        if (btnResetGame) {
            btnResetGame.addEventListener("click", () => this.handleResetGame());
        }

        const btnResetGameProgress = document.getElementById("btnResetGameProgress");
        if (btnResetGameProgress) {
            btnResetGameProgress.addEventListener("click", () => this.handleResetGame());
        }

        // Interaksi Klik Prompt Roblox [E] Ambil
        const promptEl = document.getElementById("interactPrompt");
        if (promptEl) {
            promptEl.addEventListener("click", () => this.handleInteractE());
        }

        // Hook Menu Misi & Penukaran Hadiah (Quest GUI)
        const btnOpenQuests = document.getElementById("btnOpenQuests");
        if (btnOpenQuests) btnOpenQuests.addEventListener("click", () => this.openQuestModal());

        const btnCloseQuestModal = document.getElementById("btnCloseQuestModal");
        if (btnCloseQuestModal) btnCloseQuestModal.addEventListener("click", () => this.closeQuestModal());

        const tabQuestDaily = document.getElementById("tabQuestDaily");
        if (tabQuestDaily) {
            tabQuestDaily.addEventListener("click", () => {
                this.state.questTab = "daily";
                this.renderQuestGUI();
            });
        }

        const tabQuestWeekly = document.getElementById("tabQuestWeekly");
        if (tabQuestWeekly) {
            tabQuestWeekly.addEventListener("click", () => {
                this.state.questTab = "weekly";
                this.renderQuestGUI();
            });
        }

        const btnRefreshQuests = document.getElementById("btnRefreshQuests");
        if (btnRefreshQuests) {
            btnRefreshQuests.addEventListener("click", () => {
                this.state.refreshQuests(this.state.questTab === "weekly");
                if (this.sound && this.sound.playClick) this.sound.playClick();
                this.renderQuestGUI();
                this.showToast("🔄 Daftar Misi telah diperbarui!");
            });
        }

        const questStarBadge = document.getElementById("questStarBadge");
        if (questStarBadge) {
            questStarBadge.addEventListener("click", () => {
                this.showToast("⭐ Kumpulkan Bintang Misi untuk ditukarkan dengan Skin di Toko Skin!");
            });
        }

        // Tombol Tutorial Avatar Ayam Kiri Bawah (Persis Screenshot Referensi)
        const btnTutorial = document.getElementById("btnTutorialBadge");
        if (btnTutorial) {
            btnTutorial.addEventListener("click", () => {
                const m = document.getElementById("howToPlayModal");
                if (m) m.classList.remove("hidden");
            });
        }

        // Quick Buttons di Floating Pill Bar Header (Sesuai Foto media_1794443741827_e16e2a11.jpg)
        const btnQuickAddCash = document.getElementById("btnQuickAddCash");
        if (btnQuickAddCash) btnQuickAddCash.addEventListener("click", () => this.openShopModal());

        const btnQuickMisiTag = document.getElementById("btnQuickMisiTag");
        if (btnQuickMisiTag) btnQuickMisiTag.addEventListener("click", () => this.openQuestModal());

        const btnPillStars = document.getElementById("btnPillStars");
        if (btnPillStars) btnPillStars.addEventListener("click", () => this.openQuestModal());

        const btnQuickTruckTag = document.getElementById("btnQuickTruckTag");
        if (btnQuickTruckTag) btnQuickTruckTag.addEventListener("click", () => this.triggerShipTruck());

        // Inisialisasi Layar Utama / Pembuatan Karakter & Ransel Inventaris
        this.initCharacterCreationUI();
        this.initInventoryUI();

        const loadResult = this.state.load();
        if (loadResult && loadResult.offlineDurationMs > 8000) {
            const report = this.state.processOfflineEarnings(loadResult.offlineDurationMs);
            if (report) this.showOfflineModal(report);
        }
        this.rebuildTruck3D();
        this.syncAnimalsWithAI();
        this.rebuildPlayerMesh();
        this.updateHUD();

        // Jika belum membuat karakter atau data kosong, tampilkan layar pembuatan karakter
        if (!this.state.player || !this.state.player.hasCreatedCharacter) {
            this.openCharacterCreationModal();
        } else {
            this.closeCharacterCreationModal();
        }
    }

    start() {
        this.lastTime = performance.now();
        const loop = (timestamp) => {
            const dt = Math.min((timestamp - this.lastTime) / 1000, 0.1);
            this.lastTime = timestamp;

            this.update(dt, timestamp);
            this.render(timestamp);

            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    }

    update(dt, timestamp) {
        // Jeda & amankan pergerakan karakter pemain saat modal popup apapun sedang terbuka (Toko, Misi, Panduan)
        const isModalOpen = !!document.querySelector(".modal-overlay:not(.hidden)");
        if (isModalOpen) {
            this.clearAllInputState();
            this.wasModalOpen = true;
            this.animatePlayer(false, dt);

            // Simulator latar belakang tetap berjalan (truk, ternak, magnet hasil panen)
            this.updateTruck3D(dt);
            this.updateAnimalsAI(dt, timestamp);
            this.updateFarmDog(dt, timestamp);
            this.updateGroundItems3D(dt);
            this.updateParticles3D(dt);
            return;
        }

        // Jika baru saja menutup modal (Toko / Misi / dll), pastikan karakter tidak jalan sendiri!
        if (this.wasModalOpen) {
            this.wasModalOpen = false;
            this.clearAllInputState();
            if (document.activeElement && document.activeElement.blur) {
                document.activeElement.blur();
            }
        }

        // 1. Gerak Karakter Pemain 3D
        let moveX = 0;
        let moveZ = 0;
        const isFPV = (this.cameraMode === "firstperson");
        const isTPV = (this.cameraMode === "thirdperson");

        if (isFPV || isTPV) {
            // Kontrol Mode Kamera Dinamis (First-Person & Third-Person Follow): Berorientasi Arah Kamera
            let fwd = 0;
            let strafe = 0;
            if (this.keys["w"]) fwd += 1;
            if (this.keys["s"]) fwd -= 1;
            if (this.keys["d"]) strafe += 1;
            if (this.keys["a"]) strafe -= 1;

            // Kontrol tombol panah untuk putar arah pandang kamera
            if (this.keys["arrowright"]) this.fpvYaw -= dt * 2.5;
            if (this.keys["arrowleft"]) this.fpvYaw += dt * 2.5;
            if (this.keys["arrowup"]) this.fpvPitch = Math.min(0.75, this.fpvPitch + dt * 1.5);
            if (this.keys["arrowdown"]) this.fpvPitch = Math.max(-0.75, this.fpvPitch - dt * 1.5);

            if (fwd !== 0 || strafe !== 0) {
                const sinY = Math.sin(this.fpvYaw);
                const cosY = Math.cos(this.fpvYaw);
                // Arah gerak sinkron dengan sudut pandang kamera
                moveX = (sinY * fwd) + (cosY * strafe);
                moveZ = (cosY * fwd) - (sinY * strafe);
            }
        } else {
            // Kontrol Mode Overview Isometrik Diorama: Tombol keyboard atau Click-to-Move lewat kursor
            let keyMoveX = 0;
            let keyMoveZ = 0;
            if (this.keys["w"] || this.keys["arrowup"]) keyMoveZ -= 1;
            if (this.keys["s"] || this.keys["arrowdown"]) keyMoveZ += 1;
            if (this.keys["a"] || this.keys["arrowleft"]) keyMoveX -= 1;
            if (this.keys["d"] || this.keys["arrowright"]) keyMoveX += 1;

            if (keyMoveX !== 0 || keyMoveZ !== 0) {
                // Input keyboard langsung membatalkan target klik tanah
                this.clickDestination = null;
                if (this.clickTargetMesh) this.clickTargetMesh.visible = false;
                moveX = keyMoveX;
                moveZ = keyMoveZ;
            } else if (this.clickDestination) {
                const cdx = this.clickDestination.x - this.playerMesh.position.x;
                const cdz = this.clickDestination.z - this.playerMesh.position.z;
                const cdist = Math.hypot(cdx, cdz);
                if (cdist > 0.35) {
                    moveX = cdx / cdist;
                    moveZ = cdz / cdist;
                    if (this.clickTargetMesh) {
                        this.clickTargetMesh.visible = true;
                        const pulse = 1.0 + Math.sin(timestamp * 0.009) * 0.18;
                        this.clickTargetMesh.scale.set(pulse, 1, pulse);
                    }
                } else {
                    this.clickDestination = null;
                    if (this.clickTargetMesh) this.clickTargetMesh.visible = false;
                }
            }
        }

        const isMoving = (moveX !== 0 || moveZ !== 0);
        const speed = (this.state.getPlayerSpeed() / 200) * 8.5;

        if (isMoving) {
            this.idleTime = 0;
            const len = Math.hypot(moveX, moveZ);
            const nx = moveX / len;
            const nz = moveZ / len;

            this.playerMesh.position.x += nx * speed * dt;
            this.playerMesh.position.z += nz * speed * dt;

            // Batas Maksimal Gerak Pemain (Batas Akhir Map 3x Lipat di Kaki Pegunungan Luas)
            this.playerMesh.position.x = Math.max(-160.0, Math.min(150.0, this.playerMesh.position.x));
            this.playerMesh.position.z = Math.max(-150.0, Math.min(150.0, this.playerMesh.position.z));

            // Solid Fence Collision: Pemain tidak bisa menembus pagar dan wajib lewat pintu masing-masing!
            this.resolvePaddockFenceCollisions();

            if (isFPV) {
                this.playerMesh.rotation.y = this.fpvYaw;
            } else {
                const targetRot = Math.atan2(nx, nz);
                // Rotasi halus menuju arah berjalan
                let rDiff = targetRot - this.playerMesh.rotation.y;
                while (rDiff < -Math.PI) rDiff += Math.PI * 2;
                while (rDiff > Math.PI) rDiff -= Math.PI * 2;
                this.playerMesh.rotation.y += rDiff * Math.min(1.0, dt * 12.0);
            }

            this.walkCycle += dt * 14;
        } else {
            this.idleTime += dt;
            if (isFPV) {
                this.playerMesh.rotation.y = this.fpvYaw;
            }
        }

        // Animasi Gerak Pemain (Ayun Kaki & Tangan)
        if (this.joyTimer > 0) this.joyTimer -= dt;
        this.animatePlayer(isMoving, dt);

        // 2. Dynamic Triple-Camera System (Diorama 2.5D, Third-Person Follow, & Clear First-Person POV)
        const targetFov = isFPV ? 75 : (isTPV ? 62 : 30);
        const targetCamPos = new THREE.Vector3();
        const targetLookAt = new THREE.Vector3();

        if (isFPV) {
            // First-Person POV: Kamera tepat di ketinggian mata pemain
            const eyeHeight = 1.65;
            const forwardOffset = 0.28;
            targetCamPos.set(
                this.playerMesh.position.x + Math.sin(this.fpvYaw) * forwardOffset,
                this.playerMesh.position.y + eyeHeight,
                this.playerMesh.position.z + Math.cos(this.fpvYaw) * forwardOffset
            );
            targetLookAt.set(
                targetCamPos.x + Math.sin(this.fpvYaw) * Math.cos(this.fpvPitch) * 20,
                targetCamPos.y + Math.sin(this.fpvPitch) * 20,
                targetCamPos.z + Math.cos(this.fpvYaw) * Math.cos(this.fpvPitch) * 20
            );

            // Sembunyikan TOTAL tubuh pemain di FPV agar pandangan 100% jernih tanpa clipping (tidak ada syal merah/garpu rumput)
            this.playerMesh.visible = false;
        } else if (isTPV) {
            // Third-Person Follow POV: Kamera di belakang karakter dengan jarak aman tanpa halangan
            const camDist = 4.4;
            const camHeight = 2.4;
            const pitchOffset = Math.sin(this.fpvPitch) * 1.5;
            targetCamPos.set(
                this.playerMesh.position.x - Math.sin(this.fpvYaw) * camDist,
                this.playerMesh.position.y + camHeight - pitchOffset,
                this.playerMesh.position.z - Math.cos(this.fpvYaw) * camDist
            );
            targetLookAt.set(
                this.playerMesh.position.x + Math.sin(this.fpvYaw) * 1.8,
                this.playerMesh.position.y + 1.25 + Math.sin(this.fpvPitch) * 2.8,
                this.playerMesh.position.z + Math.cos(this.fpvYaw) * 1.8
            );

            // Tampilkan kembali tubuh pemain lengkap dengan kepala, topi, syal, dan alat kerja
            this.playerMesh.visible = true;
            if (this.playerMesh.userData.headGroup) this.playerMesh.userData.headGroup.visible = true;
            if (this.playerMesh.userData.bagMesh) this.playerMesh.userData.bagMesh.visible = true;
            if (this.nameplateSprite) this.nameplateSprite.visible = true;
        } else {
            // High-angle top-down birds-eye diorama overview klasik 2.5D (telephoto FOV 30°)
            targetCamPos.set(
                this.playerMesh.position.x * 0.45 + 23,
                26 + this.playerMesh.position.y * 0.5,
                this.playerMesh.position.z * 0.45 + 24
            );
            targetLookAt.set(
                this.playerMesh.position.x * 0.7 + 1.2,
                this.playerMesh.position.y + 0.8,
                this.playerMesh.position.z * 0.7 + 1.2
            );

            // Tampilkan kembali karakter pemain penuh
            this.playerMesh.visible = true;
            if (this.playerMesh.userData.headGroup) this.playerMesh.userData.headGroup.visible = true;
            if (this.playerMesh.userData.bagMesh) this.playerMesh.userData.bagMesh.visible = true;
            if (this.nameplateSprite) this.nameplateSprite.visible = true;
        }

        // Transisi Halus Posisi & Pandangan Kamera (Smooth Lerp)
        const camLerpSpeed = Math.min(dt * (isFPV ? 8.0 : 4.0), 1.0);
        this.camera.position.lerp(targetCamPos, camLerpSpeed);
        this.cameraLookTarget.lerp(targetLookAt, camLerpSpeed);
        this.camera.lookAt(this.cameraLookTarget);

        // Transisi Halus Sudut Pandang Lensa (Smooth FOV Lerp)
        if (Math.abs(this.camera.fov - targetFov) > 0.05) {
            this.camera.fov += (targetFov - this.camera.fov) * dt * 5.0;
            this.camera.updateProjectionMatrix();
        }

        // 3. AI Pengembara & Animasi Hewan Ternak (Wandering & Natural Animal AI)
        this.updateAnimalsAI(dt, timestamp);

        // 4. Animasi Anjing Peternakan Dinamis & Interaktif
        this.updateFarmDog(dt, timestamp);

        // 5. Magnet Panen Bahan di Tanah
        this.updateGroundItems3D(dt);

        // 6. Mesin Pabrik 3D
        this.updateMachines3D(dt);

        // 7. Truk Pengiriman 3D
        this.updateTruck3D(dt);

        // 8. Cek Zona Interaksi (Pad Denyut)
        this.checkPadsTrigger(dt);

        // Denyut Pad
        this.interactivePads.forEach(pad => {
            const scale = 1 + Math.sin(timestamp * 0.006 + pad.x) * 0.08;
            pad.ringMesh.scale.set(scale, scale, 1);
        });

        // 9. Update Partikel 3D
        this.updateParticles3D(dt);

        // 10. Auto-save
        this.saveTimer += dt;
        if (this.saveTimer > 6.0) {
            this.saveTimer = 0;
            this.state.save();
        }

        // 11. Update HUD
        this.updateHUD();

        // 12. Update Countdown Timer Misi Harian jika Modal Terbuka
        const qTimerEl = document.getElementById("questTimerCountdown");
        const qModal = document.getElementById("questModal");
        if (qTimerEl && qModal && !qModal.classList.contains("hidden")) {
            qTimerEl.textContent = this.state.getQuestCountdownFormatted();
        }

        // 13. Animasi Awan Melayang & Bintang Berkelip di Pegunungan Senja
        if (this.cloudsList && this.cloudsList.length > 0) {
            this.cloudsList.forEach((cloud, idx) => {
                cloud.position.x += dt * (0.45 + (idx % 3) * 0.2);
                if (cloud.position.x > 80) cloud.position.x = -80;
            });
        }
        if (this.starsMesh && this.starsMesh.material) {
            this.starsMesh.material.opacity = 0.75 + Math.sin(timestamp * 0.002) * 0.2;
        }
    }

    updateAnimalsAI(dt, timestamp) {
        const petMult = this.state.getPetCareMultiplier ? this.state.getPetCareMultiplier() : 1.0;
        const px = this.playerMesh ? this.playerMesh.position.x : 0;
        const pz = this.playerMesh ? this.playerMesh.position.z : 0;

        this.animalEntities.forEach((ent, animalIdx) => {
            const aType = ent.type || (ent.stateRef && ent.stateRef.type) || "chicken";
            const u = ent.mesh.userData;

            // Timer internal hewan yang unik (tidak sinkron satu sama lain)
            ent.animTime = (ent.animTime || (animalIdx * 1.73)) + dt;
            const t = ent.animTime;
            const pDist = Math.hypot(px - ent.mesh.position.x, pz - ent.mesh.position.z);

            // Produksi Bahan Mentah (Telur, Susu, Wol) Berkala
            // Dibatasi maksimal 24 item di tanah agar performa tetap ringan 60 FPS
            const pInterval = ent.produceInterval || 6000;
            ent.produceTimer = (ent.produceTimer || 0) + dt * 1000 * petMult;
            if (ent.produceTimer >= pInterval) {
                ent.produceTimer = 0;
                const prodType = (aType === "chicken") ? "egg" : (aType === "cow" ? "milk" : "wool");
                if (this.groundItemMeshes.length < 24) {
                    const spawnX = ent.mesh.position.x + (Math.random() * 1.4 - 0.7);
                    const spawnZ = ent.mesh.position.z + (Math.random() * 1.4 - 0.7);
                    this.spawnGroundItem3D(prodType, spawnX, spawnZ);

                    // Reaksi Visual Saat Menghasilkan Panen: Emote & Jingkrak Senang
                    const emoteIcon = (aType === "chicken") ? "🥚" : (aType === "cow") ? "🥛" : "🧶";
                    this.spawnEmote3D(ent.mesh.position.x, ent.mesh.position.y + 1.2, ent.mesh.position.z, emoteIcon);
                    ent.produceHopTimer = 0.45;
                }
            }

            // Tangani lompatan senang saat produksi
            if (ent.produceHopTimer > 0) {
                ent.produceHopTimer -= dt;
                ent.mesh.position.y = (ent.spawnY || 0) + Math.sin((0.45 - ent.produceHopTimer) / 0.45 * Math.PI) * 0.22;
                if (aType === "chicken" && u.wingL && u.wingR) {
                    u.wingL.rotation.z = Math.sin(t * 32) * 0.65;
                    u.wingR.rotation.z = -Math.sin(t * 32) * 0.65;
                }
            }

            // ==========================================
            // 1. AYAM: PERILAKU MENGERAMI DI SARANG JERAMI
            // ==========================================
            if (ent.isNesting) {
                ent.isWalking = false;
                ent.mesh.position.y = ent.spawnY || 1.07;
                
                // Bernapas hangat dan mengembang (fluffy warm hen breathing)
                if (u.torsoGroup) {
                    const puff = Math.sin(t * 2.2);
                    u.torsoGroup.scale.set(1.0 + puff * 0.02, 1.0 + puff * 0.035, 1.0 + puff * 0.02);
                }

                // Sayap dirapatkan hangat melindungi telur
                if (u.wingL && u.wingR) {
                    u.wingL.rotation.z = 0.06;
                    u.wingR.rotation.z = -0.06;
                }

                if (u.headGroup) {
                    // Siklus mengerami: menoleh lembut, sesekali menunduk merapikan jerami/telur
                    const nestCycle = (t % 7.0);
                    if (nestCycle < 4.5) {
                        // Menoleh santai dan memperhatikan sekeliling
                        u.headGroup.rotation.x = 0.15 + Math.sin(t * 1.5) * 0.08;
                        u.headGroup.rotation.y = Math.sin(t * 0.9) * 0.28;
                        u.headGroup.rotation.z = Math.sin(t * 1.1) * 0.1;
                    } else if (nestCycle < 5.8) {
                        // Menunduk merapikan dan menghangatkan telur
                        u.headGroup.rotation.x = 0.48 + Math.sin(t * 8.0) * 0.08;
                        u.headGroup.rotation.y = 0;
                        u.headGroup.rotation.z = 0;
                    } else {
                        // Menengadah tenang
                        u.headGroup.rotation.x = -0.08;
                        u.headGroup.rotation.y = Math.sin(t * 2.0) * 0.2;
                    }
                }

                if (u.tailFan) {
                    u.tailFan.rotation.y = Math.sin(t * 1.2) * 0.12;
                }

                // Emote tidur / mimpi sesekali di sarang
                ent.nestEmoteTimer = (ent.nestEmoteTimer || (Math.random() * 8)) + dt;
                if (ent.nestEmoteTimer > 14.0) {
                    ent.nestEmoteTimer = 0;
                    this.spawnEmote3D(ent.mesh.position.x, ent.mesh.position.y + 0.65, ent.mesh.position.z, Math.random() > 0.5 ? "💤" : "✨");
                }
                return;
            }

            // ==========================================
            // 2. AYAM: PERILAKU DI TANGGA KAYU KANDANG
            // ==========================================
            if (ent.isOnRamp) {
                ent.isWalking = false;
                ent.mesh.position.y = ent.spawnY || 0.65;
                // Sayap sedikit membentang menjaga keseimbangan di tangga
                if (u.wingL && u.wingR) {
                    u.wingL.rotation.z = 0.2 + Math.sin(t * 3.5) * 0.06;
                    u.wingR.rotation.z = -0.2 - Math.sin(t * 3.5) * 0.06;
                }
                if (u.headGroup) {
                    u.headGroup.rotation.x = 0.32 + Math.sin(t * 2.0) * 0.12;
                    u.headGroup.rotation.y = Math.sin(t * 1.0) * 0.25;
                }
                return;
            }

            // ==========================================
            // 3. SAPI & DOMBA: MAKAN DI PALUNG (FEEDING TROUGH)
            // ==========================================
            if (ent.isEating) {
                ent.isWalking = false;
                ent.eatTimer = (ent.eatTimer || 8.0) - dt;

                // Ketika kenyang makan di palung, tinggalkan palung & kembali mengembara ke padang rumput
                if (ent.eatTimer <= 0) {
                    ent.isEating = false;
                    ent.wanderTimer = Math.random() * 2.5 + 1.0;
                    ent.isWalking = true;
                    if (ent.penCenter) {
                        const rx = ent.penCenter.rx || 6.5;
                        const rz = ent.penCenter.rz || 5.0;
                        ent.targetX = ent.penCenter.x + (Math.random() * 2 - 1) * (rx * 0.85);
                        ent.targetZ = ent.penCenter.z + (Math.random() * 2 - 1) * (rz * 0.85);
                    }
                }

                if (aType === "cow") {
                    // Mengunyah memamah biak dengan ritme melingkar (elliptical cud chewing)
                    if (u.head) {
                        u.head.rotation.x = 0.34 + Math.sin(t * 5.0) * 0.06;
                        u.head.rotation.z = Math.sin(t * 5.0) * 0.035;
                    }
                    if (u.muzzle) {
                        u.muzzle.position.x = Math.sin(t * 5.0) * 0.024;
                        u.muzzle.position.y = 0.22 * 1.38 + Math.abs(Math.sin(t * 5.0)) * 0.015;
                    }
                    if (u.tailGroup) {
                        // Ayunan ekor harmonik natural mengusir serangga
                        u.tailGroup.rotation.z = Math.sin(t * 2.2) * 0.42 + Math.sin(t * 4.4) * 0.18;
                        u.tailGroup.rotation.x = -Math.abs(Math.sin(t * 2.2)) * 0.15;
                    }
                    if (u.torso) {
                        u.torso.scale.x = 1.0 + Math.sin(t * 1.6) * 0.02;
                        u.torso.scale.y = 1.0 + Math.sin(t * 1.6) * 0.015;
                    }
                    // Goyangan telinga mandiri mengusir lalat
                    ent.earTimer = (ent.earTimer || 0) + dt;
                    if (Math.sin(ent.earTimer * 0.8) > 0.85 && u.earL && u.earR) {
                        u.earL.rotation.z = Math.sin(t * 32) * 0.35;
                        u.earR.rotation.z = -Math.sin(t * 28) * 0.35;
                    } else if (u.earL && u.earR) {
                        u.earL.rotation.z = 0;
                        u.earR.rotation.z = 0;
                    }
                } else if (aType === "sheep") {
                    // Domba mengunyah jerami kering dengan ritme cepat
                    if (u.head) {
                        u.head.rotation.x = 0.32 + Math.sin(t * 8.5) * 0.06;
                        u.head.rotation.z = Math.sin(t * 8.5) * 0.025;
                    }
                    if (u.earL && u.earR) {
                        u.earL.rotation.z = Math.sin(t * 4.0) * 0.12;
                        u.earR.rotation.z = -Math.sin(t * 4.0) * 0.12;
                    }
                    if (u.bobTail) {
                        u.bobTail.rotation.y = Math.sin(t * 12.0) * 0.35;
                    }
                    if (u.torso) {
                        u.torso.scale.y = 1.0 + Math.sin(t * 2.0) * 0.025;
                    }
                }
                return;
            }

            // ==========================================
            // 4. AI PENGEMBARA DI KANDANG (WANDERING DECISION)
            // ==========================================
            ent.wanderTimer = (ent.wanderTimer || (Math.random() * 3 + 2)) - dt;
            if (ent.wanderTimer <= 0) {
                ent.wanderTimer = Math.random() * 4 + 2.5;
                ent.isWalking = Math.random() > 0.35; // Aktif berjalan ~65% waktu

                if (ent.isWalking && ent.penCenter) {
                    // 25% kemungkinan memutuskan mampir makan ke palung makan
                    const wantsToEatAtTrough = (aType === "cow" || aType === "sheep") && (Math.random() < 0.25) && ent.troughPos;
                    if (wantsToEatAtTrough) {
                        ent.targetX = ent.troughPos.x;
                        ent.targetZ = ent.troughPos.z + (Math.random() * 2 - 1) * 1.0;
                        ent.headingToTrough = true;
                    } else {
                        ent.headingToTrough = false;
                        const rx = ent.penCenter.rx || 6.5;
                        const rz = ent.penCenter.rz || 5.0;
                        ent.targetX = ent.penCenter.x + (Math.random() * 2 - 1) * (rx * 0.85);
                        ent.targetZ = ent.penCenter.z + (Math.random() * 2 - 1) * (rz * 0.85);
                    }
                    // Acak flap sayap saat ayam mulai melangkah
                    if (aType === "chicken" && Math.random() > 0.6) {
                        ent.flapDuration = 0.65;
                    }
                }
            }

            // ==========================================
            // 5. STATUS BERJALAN (LOCOMOTION KINEMATICS)
            // ==========================================
            if (ent.isWalking) {
                const dx = ent.targetX - ent.mesh.position.x;
                const dz = ent.targetZ - ent.mesh.position.z;
                const dist = Math.hypot(dx, dz);

                if (dist > 0.3) {
                    const nx = dx / dist;
                    const nz = dz / dist;
                    const wSpeed = ent.walkSpeed || 1.0;
                    ent.mesh.position.x += nx * wSpeed * dt;
                    ent.mesh.position.z += nz * wSpeed * dt;

                    // Rotasi halus menghadap arah jalan
                    const targetRot = Math.atan2(nx, nz);
                    let diff = targetRot - ent.mesh.rotation.y;
                    while (diff < -Math.PI) diff += Math.PI * 2;
                    while (diff > Math.PI) diff -= Math.PI * 2;
                    ent.mesh.rotation.y += diff * dt * 6.0;

                    if (aType === "chicken") {
                        // Gaya Jalan Ayam Khas: Gerakan Kepala Mengangguk-Nodding (Head-Bobbing)
                        const stepFreq = 16.0 * wSpeed;
                        const stepPhase = Math.sin(t * stepFreq);
                        
                        ent.mesh.position.y = (ent.spawnY || 0) + Math.abs(stepPhase) * 0.055;
                        ent.mesh.rotation.z = stepPhase * 0.06; // Goyang badan kiri-kanan waddle

                        if (u.leftLeg && u.rightLeg) {
                            u.leftLeg.rotation.x = stepPhase * 0.65;
                            u.rightLeg.rotation.x = -stepPhase * 0.65;
                        }

                        // Kepala mematuk maju-mundur secara sinkron dengan langkah kaki (Head-Bob)
                        if (u.headGroup) {
                            u.headGroup.position.z = 0.32 * 0.9 + Math.max(-0.02, stepPhase * 0.06);
                            u.headGroup.rotation.x = Math.max(0, stepPhase) * 0.22;
                            u.headGroup.rotation.y = 0;
                            u.headGroup.rotation.z = 0;
                        }

                        if (u.tailFan) {
                            u.tailFan.rotation.y = stepPhase * 0.2;
                        }

                        // Kepakan sayap sesekali saat berjalan
                        if (ent.flapDuration > 0 && u.wingL && u.wingR) {
                            ent.flapDuration -= dt;
                            const flapAngle = Math.sin(t * 30.0) * 0.55;
                            u.wingL.rotation.z = flapAngle;
                            u.wingR.rotation.z = -flapAngle;
                        } else if (u.wingL && u.wingR) {
                            u.wingL.rotation.z = 0;
                            u.wingR.rotation.z = 0;
                        }
                    } else if (aType === "cow") {
                        // Gaya Jalan Sapi: Quadruped Gait 4 Kaki yang Berat & Megah
                        const stride = Math.sin(t * 5.5 * wSpeed);
                        ent.mesh.position.y = Math.abs(stride) * 0.04;
                        ent.mesh.rotation.z = stride * 0.025; // Goyang badan khas sapi

                        if (u.legFL && u.legFR && u.legBL && u.legBR) {
                            u.legFL.rotation.x = stride * 0.38;
                            u.legBR.rotation.x = stride * 0.38;
                            u.legFR.rotation.x = -stride * 0.38;
                            u.legBL.rotation.x = -stride * 0.38;
                        }

                        if (u.head) {
                            u.head.rotation.x = 0.06 + Math.sin(t * 5.5 * wSpeed) * 0.07;
                            u.head.rotation.z = Math.sin(t * 5.5 * wSpeed) * 0.03;
                        }

                        if (u.tailGroup) {
                            u.tailGroup.rotation.z = Math.sin(t * 3.0) * 0.45;
                        }

                        if (u.torso) {
                            u.torso.scale.x = 1.0 + Math.sin(t * 1.8) * 0.02;
                            u.torso.scale.y = 1.0 + Math.sin(t * 1.8) * 0.015;
                        }
                    } else if (aType === "sheep") {
                        // Gaya Jalan Domba: Bouncy Skip & Wool Bobbing yang Menggemaskan
                        const sheepStride = Math.sin(t * 8.5 * wSpeed);
                        ent.mesh.position.y = Math.abs(sheepStride) * 0.09;

                        if (u.legFL && u.legFR && u.legBL && u.legBR) {
                            u.legFL.rotation.x = sheepStride * 0.46;
                            u.legBR.rotation.x = sheepStride * 0.46;
                            u.legFR.rotation.x = -sheepStride * 0.46;
                            u.legBL.rotation.x = -sheepStride * 0.46;
                        }

                        if (u.torso) {
                            // Squash & stretch bulu wol montok saat meloncat kecil
                            u.torso.scale.y = 1.0 + Math.sin(t * 17.0 * wSpeed) * 0.04;
                        }

                        if (u.head) {
                            u.head.rotation.x = 0.12 + sheepStride * 0.08;
                        }

                        if (u.earL && u.earR) {
                            u.earL.rotation.z = Math.sin(t * 8.5) * 0.18;
                            u.earR.rotation.z = -Math.sin(t * 8.5) * 0.18;
                        }

                        if (u.bobTail) {
                            u.bobTail.rotation.y = Math.sin(t * 14.0) * 0.45;
                        }
                    }
                } else {
                    ent.isWalking = false;
                    ent.mesh.position.y = ent.spawnY || 0;
                    ent.mesh.rotation.z = 0;

                    // Jika hewan baru saja tiba di palung makan, mulai sesi makan rumput / jerami
                    if (ent.headingToTrough) {
                        ent.headingToTrough = false;
                        ent.isEating = true;
                        ent.eatTimer = Math.random() * 6 + 6; // Makan selama 6 - 12 detik
                        ent.mesh.rotation.y = -Math.PI / 2; // Menghadap lurus ke palung kayu
                    }
                }
            } else {
                // ==========================================
                // 6. STATUS DIAM & INTERAKSI ALAMI (IDLE LIVING BEHAVIORS)
                // ==========================================
                if (!ent.produceHopTimer || ent.produceHopTimer <= 0) {
                    ent.mesh.position.y = ent.spawnY || 0;
                }

                if (aType === "chicken") {
                    if (u.leftLeg && u.rightLeg) {
                        u.leftLeg.rotation.x = 0;
                        u.rightLeg.rotation.x = 0;
                    }
                    ent.mesh.rotation.z = 0;

                    // Siklus Mematuk & Merawat Bulu Alami (Peck & Preen Routine)
                    const cycle = (t % 6.0);
                    if (cycle < 2.4) {
                        // Fase 1: Memperhatikan tanah dengan satu mata (Lateral Monocular Look)
                        if (u.headGroup) {
                            u.headGroup.position.z = 0.32 * 0.9;
                            u.headGroup.rotation.x = 0.18 + Math.sin(t * 1.8) * 0.06;
                            u.headGroup.rotation.y = Math.sin(t * 1.2) * 0.45;
                            u.headGroup.rotation.z = Math.sin(t * 1.5) * 0.16;
                        }
                        if (u.wingL && u.wingR) { u.wingL.rotation.z = 0; u.wingR.rotation.z = 0; }
                    } else if (cycle < 3.8) {
                        // Fase 2: Mematuk cepat biji-bijian di tanah (Snappy Pecking)
                        if (u.headGroup) {
                            const peckFast = Math.sin(t * 18.0);
                            u.headGroup.position.z = 0.32 * 0.9;
                            u.headGroup.rotation.x = (peckFast > 0.2) ? 0.82 : 0.42;
                            u.headGroup.rotation.y = 0;
                            u.headGroup.rotation.z = 0;
                        }
                    } else if (cycle < 4.8) {
                        // Fase 3: Mengibaskan ekor & merapikan bulu (Tail Waggle & Feather Ruffle)
                        if (u.tailFan) {
                            u.tailFan.rotation.y = Math.sin(t * 26.0) * 0.38;
                        }
                        if (u.torsoGroup) {
                            u.torsoGroup.scale.set(1.05, 1.04, 1.05);
                        }
                        if (u.wingL && u.wingR) {
                            u.wingL.rotation.z = 0.2;
                            u.wingR.rotation.z = -0.2;
                        }
                        if (u.headGroup) {
                            u.headGroup.rotation.x = -0.15;
                            u.headGroup.rotation.y = Math.sin(t * 2.5) * 0.3;
                        }
                    } else {
                        // Fase 4: Kembali tenang bersiap
                        if (u.torsoGroup) u.torsoGroup.scale.set(1, 1, 1);
                        if (u.wingL && u.wingR) { u.wingL.rotation.z = 0; u.wingR.rotation.z = 0; }
                        if (u.headGroup) {
                            u.headGroup.rotation.x = Math.sin(t * 2.0) * 0.08;
                            u.headGroup.rotation.y = Math.sin(t * 1.2) * 0.2;
                        }
                    }

                    // Lompatan kecil ceria sesekali
                    ent.hopCooldown = (ent.hopCooldown || (Math.random() * 8 + 4)) - dt;
                    if (ent.hopCooldown <= 0) {
                        ent.hopCooldown = Math.random() * 10 + 6;
                        ent.hopTimer = 0.32;
                    }
                    if (ent.hopTimer > 0) {
                        ent.hopTimer -= dt;
                        ent.mesh.position.y = (ent.spawnY || 0) + Math.sin((0.32 - ent.hopTimer) / 0.32 * Math.PI) * 0.16;
                        if (u.wingL && u.wingR) {
                            u.wingL.rotation.z = Math.sin(t * 30) * 0.55;
                            u.wingR.rotation.z = -Math.sin(t * 30) * 0.55;
                        }
                    }
                } else if (aType === "cow") {
                    if (u.legFL) { u.legFL.rotation.x = 0; u.legFR.rotation.x = 0; u.legBL.rotation.x = 0; u.legBR.rotation.x = 0; }

                    // Pergeseran berat badan halus dari satu kaki ke kaki lain (Weight Shifting)
                    ent.mesh.rotation.z = Math.sin(t * 0.6) * 0.016;

                    // Mengunyah memamah biak (Cud Chewing) & Bernapas Tenang
                    if (u.muzzle) {
                        u.muzzle.position.x = Math.sin(t * 5.2) * 0.022;
                        u.muzzle.position.y = 0.22 * 1.38 + Math.abs(Math.sin(t * 5.2)) * 0.012;
                    }
                    if (u.head) {
                        // Jika pemain mendekat, sapi menoleh memperhatikan pemain
                        if (pDist < 5.0) {
                            const lookAngle = Math.atan2(px - ent.mesh.position.x, pz - ent.mesh.position.z);
                            let hDiff = lookAngle - ent.mesh.rotation.y;
                            while (hDiff < -Math.PI) diff = hDiff + Math.PI * 2;
                            while (hDiff > Math.PI) diff = hDiff - Math.PI * 2;
                            u.head.rotation.y += (Math.max(-0.6, Math.min(0.6, hDiff)) - u.head.rotation.y) * dt * 3.0;
                            u.head.rotation.x = -0.05 + Math.sin(t * 1.5) * 0.04;
                        } else {
                            u.head.rotation.y = Math.sin(t * 0.8) * 0.18;
                            u.head.rotation.x = Math.sin(t * 1.8) * 0.06;
                        }
                        u.head.rotation.z = Math.sin(t * 5.2) * 0.03;
                    }

                    // Pernapasan dada silinder besar
                    if (u.torso) {
                        u.torso.scale.x = 1.0 + Math.sin(t * 1.6) * 0.022;
                        u.torso.scale.y = 1.0 + Math.sin(t * 1.6) * 0.016;
                    }

                    // Kibasan ekor lalat dua arah
                    if (u.tailGroup) {
                        u.tailGroup.rotation.z = Math.sin(t * 2.2) * 0.45 + Math.sin(t * 4.4) * 0.18;
                        u.tailGroup.rotation.x = -Math.abs(Math.sin(t * 2.2)) * 0.16;
                    }

                    // Kedutan telinga mendadak mengusir lalat
                    ent.cowEarTimer = (ent.cowEarTimer || 0) + dt;
                    if (Math.sin(ent.cowEarTimer * 1.1) > 0.88 && u.earL && u.earR) {
                        u.earL.rotation.z = Math.sin(t * 35) * 0.35;
                        u.earR.rotation.z = -Math.sin(t * 30) * 0.35;
                    } else if (u.earL && u.earR) {
                        u.earL.rotation.z = 0;
                        u.earR.rotation.z = 0;
                    }
                } else if (aType === "sheep") {
                    if (u.legFL) { u.legFL.rotation.x = 0; u.legFR.rotation.x = 0; u.legBL.rotation.x = 0; u.legBR.rotation.x = 0; }

                    // Domba merumput dan mengunyah jerami cepat
                    if (u.head) {
                        if (pDist < 4.5) {
                            // Menengadah ramah menatap pemain
                            u.head.rotation.x = -0.12 + Math.sin(t * 2.0) * 0.06;
                            const lookAngle = Math.atan2(px - ent.mesh.position.x, pz - ent.mesh.position.z);
                            let hDiff = lookAngle - ent.mesh.rotation.y;
                            while (hDiff < -Math.PI) diff = hDiff + Math.PI * 2;
                            while (hDiff > Math.PI) diff = hDiff - Math.PI * 2;
                            u.head.rotation.y += (Math.max(-0.7, Math.min(0.7, hDiff)) - u.head.rotation.y) * dt * 4.0;
                        } else {
                            // Menunduk merumput di padang rumput
                            u.head.rotation.x = 0.28 + Math.sin(t * 10.0) * 0.05;
                            u.head.rotation.y = Math.sin(t * 1.0) * 0.22;
                        }
                    }

                    // Goyangan telinga turun lembut
                    if (u.earL && u.earR) {
                        u.earL.rotation.z = Math.sin(t * 3.2) * 0.14;
                        u.earR.rotation.z = -Math.sin(t * 3.2) * 0.14;
                    }

                    // Kibasan ekor wol mini (cute bobtail wag)
                    if (u.bobTail) {
                        u.bobTail.rotation.y = Math.sin(t * 14.0) * 0.42;
                        u.bobTail.rotation.x = Math.sin(t * 7.0) * 0.2;
                    }

                    // Napas badan wol bulat
                    if (u.torso) {
                        u.torso.scale.y = 1.0 + Math.sin(t * 2.4) * 0.024;
                    }
                }
            }
        });
    }

    updateFarmDog(dt, timestamp) {
        if (!this.dogMesh) return;
        const u = this.dogMesh.userData;
        const px = this.playerMesh ? this.playerMesh.position.x : 0;
        const pz = this.playerMesh ? this.playerMesh.position.z : 0;
        const dx = px - this.dogMesh.position.x;
        const dz = pz - this.dogMesh.position.z;
        const dist = Math.hypot(dx, dz);

        const isPlayerClose = dist < 6.5;
        this.dogTime = (this.dogTime || 0) + dt;
        const t = this.dogTime;

        if (isPlayerClose) {
            // Anjing gembira menyambut kedatangan petani!
            const targetAngle = Math.atan2(dx, dz);
            if (u.headGroup) {
                let diff = targetAngle - this.dogMesh.rotation.y;
                while (diff < -Math.PI) diff += Math.PI * 2;
                while (diff > Math.PI) diff -= Math.PI * 2;
                u.headGroup.rotation.y += (diff * 0.7 - u.headGroup.rotation.y) * dt * 8.0;
                u.headGroup.rotation.x = -0.12 + Math.sin(t * 8) * 0.06;
                u.headGroup.rotation.z = Math.sin(t * 4) * 0.12; // Miringkan kepala lucu
            }
            // Ekor mengibas cepat dan gembira
            if (u.tailGroup) {
                u.tailGroup.rotation.y = Math.sin(t * 22) * 0.85;
            }
            // Telinga berdiri senang
            if (u.earL && u.earR) {
                u.earL.rotation.z = 0.18 + Math.sin(t * 12) * 0.08;
                u.earR.rotation.z = -0.18 - Math.sin(t * 12) * 0.08;
            }
            // Lidah menjulur bernapas ceria
            if (u.tongue) {
                u.tongue.scale.z = 1.0 + Math.sin(t * 15) * 0.35;
            }
            // Jingkrak-jingkrak senang
            this.dogMesh.position.y = Math.abs(Math.sin(t * 8)) * 0.06;

            // Beri emote cinta/jejak kaki sesekali saat dekat
            if (dist < 3.2) {
                this.dogEmoteTimer = (this.dogEmoteTimer || 0) + dt;
                if (this.dogEmoteTimer > 5.0) {
                    this.dogEmoteTimer = 0;
                    this.spawnEmote3D(this.dogMesh.position.x, 1.4, this.dogMesh.position.z, Math.random() > 0.4 ? "❤️" : "🐾");
                }
            }
        } else {
            // Bersantai mengawasi peternakan
            if (u.headGroup) {
                u.headGroup.rotation.y = Math.sin(t * 1.2) * 0.32;
                u.headGroup.rotation.x = Math.sin(t * 2.0) * 0.05;
                u.headGroup.rotation.z = 0;
            }
            if (u.tailGroup) {
                u.tailGroup.rotation.y = Math.sin(t * 8) * 0.35;
            }
            if (u.earL && u.earR) {
                u.earL.rotation.z = Math.sin(t * 3) * 0.05;
                u.earR.rotation.z = -Math.sin(t * 3) * 0.05;
            }
            if (u.tongue) {
                u.tongue.scale.z = 0.5;
            }
            if (u.torsoGroup) {
                u.torsoGroup.scale.y = 1.0 + Math.sin(t * 2) * 0.02;
            }
            this.dogMesh.position.y = 0;
        }
    }

    animatePlayer(isMoving, dt) {
        const u = this.playerMesh.userData;
        if (!u.leftLeg || !u.rightLeg) return;

        const baseGroundY = this.getTerrainHeightAt(this.playerMesh.position.x, this.playerMesh.position.z);
        const joyHop = this.joyTimer > 0 ? Math.sin(this.joyTimer * 16) * 0.45 : 0;
        const breathBob = !isMoving ? Math.sin(this.idleTime * 3) * 0.03 : 0;
        this.playerMesh.position.y = baseGroundY + joyHop + breathBob;

        if (isMoving) {
            u.leftLeg.rotation.x = Math.sin(this.walkCycle) * 0.75;
            u.rightLeg.rotation.x = -Math.sin(this.walkCycle) * 0.75;
            u.leftArm.rotation.x = -Math.sin(this.walkCycle) * 0.75;
            u.rightArm.rotation.x = Math.sin(this.walkCycle) * 0.75;
        } else {
            u.leftLeg.rotation.x = 0;
            u.rightLeg.rotation.x = 0;
            u.leftArm.rotation.x = 0;
            u.rightArm.rotation.x = 0;
        }

        const bagCount = this.state.getBagCount();
        const maxBag = this.state.getMaxBagCapacity();
        if (u.bagMesh) {
            u.bagMesh.material = window.getMat(bagCount >= maxBag ? 0xD32F2F : 0x795548);
        }
    }

    spawnGroundItem3D(type, x, z) {
        const itemRoot = window.ModelBuilder3D.createGroundItemMesh(type);
        itemRoot.position.set(x, 0, z);
        this.scene.add(itemRoot);

        this.groundItemMeshes.push({
            type: type,
            mesh: itemRoot
        });
    }

    toScreenPosition(pos3d, offsetY = 0.45) {
        const tempV = new THREE.Vector3(pos3d.x, pos3d.y + offsetY, pos3d.z);
        tempV.project(this.camera);

        if (tempV.z > 1) {
            return { visible: false, x: 0, y: 0 };
        }

        const rect = this.container.getBoundingClientRect();
        const x = (tempV.x * 0.5 + 0.5) * rect.width;
        const y = (-tempV.y * 0.5 + 0.5) * rect.height;

        return { visible: true, x, y };
    }

    updateGroundItems3D(dt) {
        const px = this.playerMesh.position.x;
        const pz = this.playerMesh.position.z;
        const isBagFull = (this.state.getBagCount() >= this.state.getMaxBagCapacity());

        let closestDist = Infinity;
        let closestItem = null;

        for (let i = 0; i < this.groundItemMeshes.length; i++) {
            const item = this.groundItemMeshes[i];
            if (dt > 0) item.mesh.rotation.y += dt * 1.5;

            const dist = Math.hypot(item.mesh.position.x - px, item.mesh.position.z - pz);
            if (dist < 2.5 && dist < closestDist) {
                closestDist = dist;
                closestItem = item;
            }

            // Redupkan ring default
            if (item.mesh.userData && item.mesh.userData.ring) {
                item.mesh.userData.ring.material.opacity = 0.25;
                item.mesh.userData.ring.scale.set(1.0, 1.0, 1.0);
            }
        }

        const promptEl = document.getElementById("interactPrompt");
        const titleEl = document.getElementById("interactTitle");
        const actionEl = document.getElementById("interactAction");

        // Reset status kedekatan
        this.nearQuestBoard = false;
        this.nearAnimalCart = false;
        this.nearMachine = null;
        this.nearAnimalHarvest = null;

        if (closestItem) {
            this.nearestItem = closestItem;

            // Highlight ring item terdekat (menandakan target aktif untuk diambil dengan tombol E)
            if (closestItem.mesh.userData && closestItem.mesh.userData.ring) {
                closestItem.mesh.userData.ring.material.opacity = 0.9;
                closestItem.mesh.userData.ring.scale.set(1.2, 1.2, 1.2);
            }

            if (promptEl) {
                promptEl.classList.remove("hidden");

                let itemName = "Telur Ayam";
                if (closestItem.type === "milk") itemName = "Susu Sapi Segar";
                else if (closestItem.type === "wool") itemName = "Wol Domba";
                else if (closestItem.type === "cheese") itemName = "Keju Olahan";
                else if (closestItem.type === "mayo") itemName = "Mayones Siap Jual";
                else if (closestItem.type === "fabric") itemName = "Benang Wol";
                else if (closestItem.type === "meat") itemName = "Daging Segar";
                else if (closestItem.type === "golden_yarn") itemName = "Benang Emas";

                if (titleEl) titleEl.textContent = itemName;

                if (actionEl) {
                    if (isBagFull) {
                        actionEl.textContent = "Tas Penuh!";
                        actionEl.style.color = "#FF6B6B";
                    } else {
                        actionEl.textContent = "Ambil";
                        actionEl.style.color = "#F8FAFC";
                    }
                }

                // Posisi 3D melayang tepat di atas item (Roblox ProximityPrompt persis foto referensi)
                const screenPos = this.toScreenPosition(closestItem.mesh.position, 0.45);
                this.positionPromptEl(promptEl, screenPos);
            }
        } else {
            this.nearestItem = null;

            // 1. Cek Jarak ke Papan Misi Harian 3D (media_1794444290272_1e55dff4.jpg)
            const qX = this.questBoard ? this.questBoard.position.x : 13.5;
            const qZ = this.questBoard ? this.questBoard.position.z : 3.2;
            const distToQuest = Math.hypot(px - qX, pz - (qZ + 1.2));
            if (distToQuest < 3.2) {
                this.nearQuestBoard = true;
                if (promptEl) {
                    promptEl.classList.remove("hidden");
                    if (titleEl) titleEl.textContent = "Misi Harian";
                    if (actionEl) {
                        actionEl.textContent = "BUKA MISI";
                        actionEl.style.color = "#FFD54F";
                    }
                    const screenPos = this.toScreenPosition(new THREE.Vector3(qX, 2.0, qZ), 0.2);
                    this.positionPromptEl(promptEl, screenPos);
                }
                return;
            }

            // 2. Cek Jarak ke Gerobak Toko Hewan (-4.2, 5.5)
            const distToCart = Math.hypot(px - (-4.2), pz - 5.5);
            if (distToCart < 3.8) {
                this.nearAnimalCart = true;
                if (promptEl) {
                    promptEl.classList.remove("hidden");
                    if (titleEl) titleEl.textContent = "Toko Hewan";
                    if (actionEl) {
                        actionEl.textContent = "Buka Toko";
                        actionEl.style.color = "#00E5FF";
                    }
                    const screenPos = this.toScreenPosition(new THREE.Vector3(-4.2, 1.8, 5.5), 0.2);
                    this.positionPromptEl(promptEl, screenPos);
                }
                return;
            }

            // 2B. Cek Jarak ke Gerbang Kandang Terkunci (Kandang Sapi & Padang Domba)
            this.nearCowUnlock = false;
            this.nearSheepUnlock = false;

            if (!this.state.upgrades.hasCow) {
                const distCow = Math.hypot(px - (-11.0), pz - 21.0);
                if (distCow < 3.4) {
                    this.nearCowUnlock = true;
                    if (promptEl) {
                        promptEl.classList.remove("hidden");
                        if (titleEl) titleEl.textContent = "Kandang Sapi (Terkunci)";
                        if (actionEl) {
                            actionEl.textContent = "Buka: Rp 150";
                            actionEl.style.color = (this.state.player.cash >= 150) ? "#69F0AE" : "#FF6B6B";
                        }
                        const screenPos = this.toScreenPosition(new THREE.Vector3(-11.0, 1.8, 21.0), 0.2);
                        this.positionPromptEl(promptEl, screenPos);
                    }
                    return;
                }
            }

            if (!this.state.upgrades.hasSheep) {
                const distSheep = Math.hypot(px - (-11.0), pz - (-13.0));
                if (distSheep < 3.4) {
                    this.nearSheepUnlock = true;
                    if (promptEl) {
                        promptEl.classList.remove("hidden");
                        if (titleEl) titleEl.textContent = "Padang Domba (Terkunci)";
                        if (actionEl) {
                            actionEl.textContent = "Buka: Rp 300";
                            actionEl.style.color = (this.state.player.cash >= 300) ? "#69F0AE" : "#FF6B6B";
                        }
                        const screenPos = this.toScreenPosition(new THREE.Vector3(-11.0, 1.8, -13.0), 0.2);
                        this.positionPromptEl(promptEl, screenPos);
                    }
                    return;
                }
            }

            // 3. Cek Jarak ke Stasiun Mesin Pengolahan 3D (Waktu Proses 3 Detik Sesuai Permintaan)
            const machineConfigs = [
                { key: "mayo_maker", pos: new THREE.Vector3(-1.5, 0, 11.5) },
                { key: "cheese_maker", pos: new THREE.Vector3(5.0, 0, 11.5) },
                { key: "loom_weaver", pos: new THREE.Vector3(11.5, 0, 11.5) }
            ];

            let closeMachine = null;
            let closeMachineDist = Infinity;
            for (let mc of machineConfigs) {
                const d = Math.hypot(px - mc.pos.x, pz - mc.pos.z);
                if (d < 3.2 && d < closeMachineDist) {
                    closeMachineDist = d;
                    closeMachine = mc;
                }
            }

            if (closeMachine) {
                this.nearMachine = closeMachine.key;
                const mDef = MACHINE_DEFS[closeMachine.key];
                const mState = this.state.machines[closeMachine.key];
                const inBagCount = this.state.getItemCountInBag(mDef.inputItem);

                if (promptEl) {
                    promptEl.classList.remove("hidden");
                    if (mState.outputCount > 0) {
                        if (titleEl) titleEl.textContent = `${ITEM_DEFS[mDef.outputItem].name} Siap (${mState.outputCount})`;
                        if (actionEl) {
                            actionEl.textContent = "Ambil Hasil";
                            actionEl.style.color = "#69F0AE";
                        }
                    } else if (mState.isProcessing) {
                        const sLeft = Math.ceil((mDef.baseTimeMs - (mState.progress * mDef.baseTimeMs)) / 1000);
                        if (titleEl) titleEl.textContent = `Sedang Mengolah ${ITEM_DEFS[mDef.inputItem].name}...`;
                        if (actionEl) {
                            actionEl.textContent = `Tunggu (${sLeft}s)`;
                            actionEl.style.color = "#FFD54F";
                        }
                    } else if (inBagCount >= mDef.inputQty) {
                        if (titleEl) titleEl.textContent = `Olah ${ITEM_DEFS[mDef.inputItem].name} ➔ ${ITEM_DEFS[mDef.outputItem].name}`;
                        if (actionEl) {
                            actionEl.textContent = "Olah (3s)";
                            actionEl.style.color = "#40C4FF";
                        }
                    } else {
                        if (titleEl) titleEl.textContent = `Mesin ${ITEM_DEFS[mDef.outputItem].name} (3 Detik)`;
                        if (actionEl) {
                            actionEl.textContent = `Butuh ${ITEM_DEFS[mDef.inputItem].name}`;
                            actionEl.style.color = "#B0BEC5";
                        }
                    }
                    const screenPos = this.toScreenPosition(closeMachine.pos, 1.8);
                    this.positionPromptEl(promptEl, screenPos);
                }
                return;
            }

            // 4. Cek Jarak ke Hewan Ternak Langsung di Kandang (Ayam, Domba, Sapi)
            let closeAnimal = null;
            let closeAnimalDist = Infinity;
            for (let ent of this.animalEntities) {
                const d = Math.hypot(px - ent.mesh.position.x, pz - ent.mesh.position.z);
                if (d < 2.5 && d < closeAnimalDist) {
                    closeAnimalDist = d;
                    closeAnimal = ent;
                }
            }

            if (closeAnimal) {
                const aType = closeAnimal.type || (closeAnimal.stateRef && closeAnimal.stateRef.type) || "chicken";
                let prodType = "egg";
                let aTitle = "Ayam Petelur";
                let aAct = "Ambil Telur";
                let aColor = "#FFF176";

                if (aType === "cow") {
                    prodType = "milk";
                    aTitle = "Sapi Perah";
                    aAct = "Perah Susu";
                    aColor = "#81D4FA";
                } else if (aType === "sheep") {
                    prodType = "wool";
                    aTitle = "Domba Wol";
                    aAct = "Cukur Bulu";
                    aColor = "#E0E0E0";
                }

                this.nearAnimalHarvest = {
                    type: prodType,
                    name: aAct.replace(/Ambil |Perah |Cukur /, ""),
                    ent: closeAnimal
                };

                if (promptEl) {
                    promptEl.classList.remove("hidden");
                    if (titleEl) titleEl.textContent = aTitle;
                    if (actionEl) {
                        actionEl.textContent = aAct;
                        actionEl.style.color = aColor;
                    }
                    const screenPos = this.toScreenPosition(closeAnimal.mesh.position, 1.1);
                    this.positionPromptEl(promptEl, screenPos);
                }
                return;
            }

            // Jika di luar jangkauan semua objek interaktif, sembunyikan prompt
            if (promptEl) {
                promptEl.classList.add("hidden");
            }
        }
    }

    positionPromptEl(promptEl, screenPos) {
        if (screenPos.visible && screenPos.x >= 20 && screenPos.x <= this.container.clientWidth - 20) {
            promptEl.style.left = `${screenPos.x}px`;
            promptEl.style.top = `${screenPos.y}px`;
            promptEl.style.bottom = "auto";
            promptEl.style.transform = "translate(-50%, -100%)";
        } else {
            promptEl.style.left = "50%";
            promptEl.style.bottom = "35px";
            promptEl.style.top = "auto";
            promptEl.style.transform = "translateX(-50%)";
        }
    }

    updateMachines3D(dt) {
        const factorySpeedMult = this.state.getFactorySpeedMultiplier();
        for (let key in this.state.machines) {
            const mState = this.state.machines[key];
            const mDef = MACHINE_DEFS[key];
            const mMesh = this.machineMeshes[key];

            if (!mState.isProcessing && mState.inputQueue >= mDef.inputQty) {
                mState.isProcessing = true;
                mState.progress = 0;
            }

            if (mState.isProcessing) {
                // 1. Animasi Pengaduk Whisk Berputar Cepat di Mangkuk Kaca (Mesin Telur)
                if (mMesh && mMesh.userData.whiskGroup) {
                    mMesh.userData.whiskGroup.rotation.y += dt * 16;
                }
                // 2. Animasi Piston Hidrolik Menekan Naik-Turun (Mesin Keju)
                if (mMesh && mMesh.userData.pistonGroup) {
                    mMesh.userData.pistonGroup.position.y = 1.5 - Math.abs(Math.sin(mState.progress * Math.PI * 4)) * 0.45;
                }
                // 3. Animasi Roda Pemintal Benang Wol Berputar Cepat (Mesin Tenun)
                if (mMesh && mMesh.userData.spinnerGroup) {
                    mMesh.userData.spinnerGroup.rotation.x += dt * 10;
                }

                const effectiveDuration = mDef.baseTimeMs / factorySpeedMult;
                mState.progress += (dt * 1000) / effectiveDuration;

                if (mState.progress >= 1.0) {
                    mState.isProcessing = false;
                    mState.progress = 0;
                    mState.inputQueue -= mDef.inputQty;
                    mState.outputCount += mDef.outputQty;
                    this.state.stats.totalProcessed++;
                    this.sound.playMachineFinish();

                    if (mMesh) {
                        this.spawnSparks3D(mMesh.position.x - 0.6, 3.2, mMesh.position.z - 0.3, 0x69F0AE);
                    }
                }
            }
        }
    }

    interactMachine3D(machineKey) {
        const mState = this.state.machines[machineKey];
        const mDef = MACHINE_DEFS[machineKey];
        const mMesh = this.machineMeshes[machineKey];
        if (!mState || !mDef) return;

        // 1. Ambil Barang Olahan Jika Sudah Siap
        if (mState.outputCount > 0) {
            const isBagFull = (this.state.getBagCount() >= this.state.getMaxBagCapacity());
            if (isBagFull) {
                if (this.sound && this.sound.playBuzz) this.sound.playBuzz();
                this.showToast("🎒 Ransel Penuh! Kosongkan isi ransel dulu.");
                return;
            }

            const added = this.state.addToBag(mDef.outputItem, 1);
            if (added > 0) {
                mState.outputCount -= 1;
                this.state.onItemCollected(mDef.outputItem, 1);
                this.sound.playHarvest();
                this.joyTimer = 0.35;
                if (mMesh) {
                    this.spawnSparks3D(mMesh.position.x, 2.0, mMesh.position.z, 0x69F0AE, 16);
                }
                this.showToast(`🎁 Mengambil 1 ${ITEM_DEFS[mDef.outputItem].name} dari mesin!`);
                this.updateHUD();
                return;
            }
        }

        // 2. Sedang Mengolah (Waktu Proses 3 Detik)
        if (mState.isProcessing) {
            const sLeft = Math.ceil((mDef.baseTimeMs - (mState.progress * mDef.baseTimeMs)) / 1000);
            this.showToast(`⏳ Mesin sedang mengolah ${ITEM_DEFS[mDef.inputItem].name}... Tunggu ${sLeft} detik.`);
            return;
        }

        // 3. Setor Bahan Mentah untuk Diolah (Proses 3 Detik Persis Permintaan)
        const inBagCount = this.state.getItemCountInBag(mDef.inputItem);
        if (inBagCount >= mDef.inputQty) {
            this.state.removeFromBag(mDef.inputItem, mDef.inputQty);
            mState.inputQueue += mDef.inputQty;
            mState.isProcessing = true;
            mState.progress = 0;
            this.sound.playDeposit();
            if (mMesh) {
                this.spawnSparks3D(mMesh.position.x, 2.0, mMesh.position.z, 0xFFD54F, 18);
            }
            this.showToast(`⚙️ Memulai proses: ${mDef.inputQty} ${ITEM_DEFS[mDef.inputItem].name} ➔ ${mDef.outputQty} ${ITEM_DEFS[mDef.outputItem].name} (Waktu: 3 Detik)!`);
            this.updateHUD();
        } else {
            if (this.sound && this.sound.playBuzz) this.sound.playBuzz();
            this.showToast(`⚠️ Kamu butuh ${mDef.inputQty} ${ITEM_DEFS[mDef.inputItem].name} di ransel untuk mesin ini!`);
        }
    }

    rebuildTruck3D() {
        const MB = window.ModelBuilder3D;
        if (!MB || !MB.createTruck) return;
        const currentLv = Math.max(1, Math.min(6, (this.state.truck && this.state.truck.level) || (this.state.upgrades && this.state.upgrades.truckLevel) || 1));
        if (this.truckMesh) {
            this.scene.remove(this.truckMesh);
        }
        this.truckMesh = MB.createTruck(currentLv);
        if (this.truckMesh) {
            this.truckMesh.userData = this.truckMesh.userData || {};
            this.truckMesh.userData.level = currentLv;
            this.truckMesh.position.set(7.5, 0, -12.5);
            this.truckMesh.rotation.y = Math.PI / 2; // Parkir rapi di lantai garasi menghadap ke pintu luar
            if (this.truckMesh.userData.driver) {
                this.truckMesh.userData.driver.visible = false;
            }
            this.scene.add(this.truckMesh);
        }
    }

    updateTruck3D(dt) {
        const currentLv = Math.max(1, Math.min(6, (this.state.truck && this.state.truck.level) || (this.state.upgrades && this.state.upgrades.truckLevel) || 1));
        if (!this.truckMesh || !this.truckMesh.userData || this.truckMesh.userData.level !== currentLv) {
            this.rebuildTruck3D();
        }
        if (!this.truckMesh) return;

        const dockX = 7.5;
        const dockZ = -12.5;
        const roadX = 20.5;
        const edgeZ = -170.0;
        const waitMs = 5000; // Tepat 5 detik berhenti/tunggu di ujung map
        const totalMs = this.state.truck.deliverDuration || 45000;
        const travelMs = Math.max(1000, (totalMs - waitMs) / 2);
        const exitMs = Math.min(3000, travelMs * 0.15);

        if (this.state.truck.status === "delivering") {
            this.state.truck.deliverTimer += dt * 1000;
            const timer = this.state.truck.deliverTimer;

            // Tampilkan pengendara/sopir 3D saat armada sedang aktif mengantar pesanan
            if (this.truckMesh.userData && this.truckMesh.userData.driver) {
                this.truckMesh.userData.driver.visible = true;
            }

            if (timer < travelMs) {
                // ==========================================
                // FASE 1: BERANGKAT DARI DALAM GARASI MENUJU UJUNG MAP
                // Keluar garasi menyusuri driveway, berbelok ke jalan raya, melaju utara (-Z) ke Z = -170
                // ==========================================
                if (timer < exitMs) {
                    const u = timer / exitMs;
                    if (u < 0.70) {
                        // Maju lurus keluar dari dalam garasi menyusuri jalan aspal driveway
                        const p = u / 0.70;
                        this.truckMesh.position.x = dockX + p * (18.5 - dockX);
                        this.truckMesh.position.z = dockZ;
                        this.truckMesh.rotation.y = Math.PI / 2; // Menghadap timur ke jalan raya
                    } else {
                        // Belok kiri mulus saat memasuki badan jalan raya utama (arah utara)
                        const turnRatio = (u - 0.70) / 0.30;
                        this.truckMesh.position.x = 18.5 + turnRatio * (roadX - 18.5);
                        this.truckMesh.position.z = dockZ - turnRatio * 2.0;
                        this.truckMesh.rotation.y = Math.PI / 2 + turnRatio * (Math.PI / 2); // Putar dari PI/2 ke PI
                    }
                } else {
                    // Melaju kencang menyusuri jalur jalan raya aspal ke utara (-Z)
                    const roadFrac = Math.min(1.0, (timer - exitMs) / (travelMs - exitMs));
                    this.truckMesh.position.x = roadX;
                    this.truckMesh.position.z = (dockZ - 2.0) + roadFrac * (edgeZ - (dockZ - 2.0));
                    this.truckMesh.rotation.y = Math.PI; // Menghadap utara
                }

                // Roda berputar maju & kaki pengendara mengayuh pedal
                if (this.truckMesh.userData && this.truckMesh.userData.wheels) {
                    this.truckMesh.userData.wheels.forEach(w => w.rotation.x += dt * 18);
                }
                if (this.truckMesh.userData && this.truckMesh.userData.driver) {
                    const du = this.truckMesh.userData.driver.userData;
                    if (du && du.legL && du.legR) {
                        const pedal = timer * 0.015;
                        du.legL.rotation.x = Math.sin(pedal) * 0.35;
                        du.legR.rotation.x = -Math.sin(pedal) * 0.35;
                    }
                }
            } else if (timer < travelMs + waitMs) {
                // ==========================================
                // FASE 2: TUNGGU 5 DETIK DI UJUNG MAP (BONGKAR MUATAN DI KOTA)
                // Berhenti diam di ujung map Z = -170 selama tepat 5 detik
                // ==========================================
                const waitElapsed = timer - travelMs;
                this.truckMesh.position.set(roadX, 0, edgeZ);

                // Roda berhenti & pengendara diam santai
                if (this.truckMesh.userData && this.truckMesh.userData.driver) {
                    const du = this.truckMesh.userData.driver.userData;
                    if (du && du.legL && du.legR) {
                        du.legL.rotation.x = 0;
                        du.legR.rotation.x = 0;
                    }
                }

                // Pada 800ms terakhir dari jeda 5 detik, putar balik haluan menghadap selatan (kembali ke peternakan)
                if (waitElapsed > 4200) {
                    const turnRatio = (waitElapsed - 4200) / 800;
                    this.truckMesh.rotation.y = Math.PI - turnRatio * Math.PI; // Haluan berputar mulus dari PI ke 0
                } else {
                    this.truckMesh.rotation.y = Math.PI;
                }
            } else if (timer < totalMs) {
                // ==========================================
                // FASE 3: BALIK LAGI KE PETERNAKAN & MASUK KE DALAM GARASI
                // Melaju selatan (+Z) ke Z = -12.5, belok kanan masuk driveway ke dalam garasi
                // ==========================================
                const retElapsed = timer - (travelMs + waitMs);
                const roadRetMs = travelMs - exitMs;

                if (retElapsed < roadRetMs) {
                    // Melaju di jalan raya ke arah selatan (+Z)
                    const roadFrac = Math.min(1.0, retElapsed / roadRetMs);
                    this.truckMesh.position.x = roadX;
                    this.truckMesh.position.z = edgeZ + roadFrac * ((dockZ - 2.0) - edgeZ);
                    this.truckMesh.rotation.y = 0; // Menghadap ke selatan
                } else {
                    // Masuk ke simpang garasi, belok kanan dan parkir kembali ke dalam garasi
                    const u = Math.min(1.0, (retElapsed - roadRetMs) / exitMs);
                    if (u < 0.30) {
                        // Belok kanan mulus dari jalan raya ke arah barat (driveway)
                        const turnRatio = u / 0.30;
                        this.truckMesh.position.x = roadX - turnRatio * (roadX - 18.5);
                        this.truckMesh.position.z = (dockZ - 2.0) + turnRatio * 2.0;
                        this.truckMesh.rotation.y = -turnRatio * (Math.PI / 2); // Dari 0 ke -PI/2 (menghadap barat)
                    } else if (u < 0.88) {
                        // Melaju lurus masuk ke dalam garasi
                        const driveFrac = (u - 0.30) / 0.58;
                        this.truckMesh.position.x = 18.5 - driveFrac * (18.5 - dockX);
                        this.truckMesh.position.z = dockZ;
                        this.truckMesh.rotation.y = -Math.PI / 2; // Menghadap barat masuk ke garasi
                    } else {
                        // Tiba di slot parkir dalam garasi, putar haluan menghadap keluar pintu
                        const turnFrac = (u - 0.88) / 0.12;
                        this.truckMesh.position.x = dockX;
                        this.truckMesh.position.z = dockZ;
                        this.truckMesh.rotation.y = -Math.PI / 2 + turnFrac * Math.PI; // Putar haluan ke +PI/2
                    }
                }

                // Roda berputar & kaki pengendara mengayuh
                if (this.truckMesh.userData && this.truckMesh.userData.wheels) {
                    this.truckMesh.userData.wheels.forEach(w => w.rotation.x += dt * 18);
                }
                if (this.truckMesh.userData && this.truckMesh.userData.driver) {
                    const du = this.truckMesh.userData.driver.userData;
                    if (du && du.legL && du.legR) {
                        const pedal = timer * 0.015;
                        du.legL.rotation.x = Math.sin(pedal) * 0.35;
                        du.legR.rotation.x = -Math.sin(pedal) * 0.35;
                    }
                }
            } else {
                // ==========================================
                // FASE 4: TIBA KEMBALI DI DALAM GARASI PETERNAKAN
                // Parkir rapi di lantai garasi, serahkan uang hasil penjualan, dan beri partikel emas
                // ==========================================
                this.state.truck.status = "docked";
                this.state.truck.deliverTimer = 0;
                this.truckMesh.position.set(dockX, 0, dockZ);
                this.truckMesh.rotation.y = Math.PI / 2; // Menghadap keluar pintu garasi
                if (this.truckMesh.userData && this.truckMesh.userData.driver) {
                    this.truckMesh.userData.driver.visible = false;
                }

                const earned = this.state.truck.potentialRevenue;
                this.state.player.cash += earned;
                this.state.stats.totalEarned += earned;
                this.state.truck.cargo = [];
                this.state.truck.potentialRevenue = 0;

                this.sound.playCash();
                this.spawnSparks3D(dockX, 2, dockZ, 0xFFD700, 30);
                this.showToast(`💰 Armada pengantar tiba kembali di garasi! Hasil penjualan: Rp ${earned.toLocaleString("id-ID")}`, 4000);
                this.updateHUD();
            }
        } else {
            this.truckMesh.position.set(dockX, 0, dockZ);
            this.truckMesh.rotation.y = Math.PI / 2;
            if (this.truckMesh.userData && this.truckMesh.userData.driver) {
                this.truckMesh.userData.driver.visible = false;
            }
        }
    }

    checkPadsTrigger(dt = 0.016) {
        const px = this.playerMesh.position.x;
        const pz = this.playerMesh.position.z;

        this.interactivePads.forEach(pad => {
            const dist = Math.hypot(px - pad.x, pz - pad.z);
            if (dist < pad.radius) {
                // Untuk modal UI (toko hewan, upgrade shop, quest board) & kirim armada truk: hanya trigger SEKALI saat masuk pad
                if (pad.actionKey === "shop" || pad.actionKey === "animal_shop" || pad.actionKey === "ship_truck" || pad.actionKey === "quest_board") {
                    if (!pad.isPlayerInside) {
                        pad.isPlayerInside = true;
                        this.executePadAction(pad.actionKey);
                    }
                } else {
                    // Mesin setor/ambil & muat truk: interval halus agar tidak freeze
                    pad.cooldown = (pad.cooldown || 0) - dt;
                    if (pad.cooldown <= 0) {
                        pad.cooldown = 0.12;
                        this.executePadAction(pad.actionKey);
                    }
                }
            } else {
                pad.isPlayerInside = false;
                pad.cooldown = 0;
            }
        });
    }

    executePadAction(actionKey) {
        if (actionKey === "deposit_mayo") {
            const hasItem = this.state.player.bag.find(i => i.type === "egg");
            if (hasItem && hasItem.count > 0 && this.state.machines.mayo_maker.inputQueue < 25) {
                this.state.removeFromBag("egg", 1);
                this.state.machines.mayo_maker.inputQueue += 1;
                this.sound.playDeposit();
            }
        }
        if (actionKey === "pickup_mayo" && this.state.machines.mayo_maker.outputCount > 0) {
            if (this.state.getBagCount() < this.state.getMaxBagCapacity()) {
                this.state.addToBag("mayo", 1);
                this.state.onItemCollected("mayo", 1);
                this.state.machines.mayo_maker.outputCount -= 1;
                this.sound.playHarvest();
                this.joyTimer = 0.35;
            }
        }

        if (actionKey === "deposit_cheese") {
            const hasItem = this.state.player.bag.find(i => i.type === "milk");
            if (hasItem && hasItem.count > 0 && this.state.machines.cheese_maker.inputQueue < 25) {
                this.state.removeFromBag("milk", 1);
                this.state.machines.cheese_maker.inputQueue += 1;
                this.sound.playDeposit();
            }
        }
        if (actionKey === "pickup_cheese" && this.state.machines.cheese_maker.outputCount > 0) {
            if (this.state.getBagCount() < this.state.getMaxBagCapacity()) {
                this.state.addToBag("cheese", 1);
                this.state.onItemCollected("cheese", 1);
                this.state.machines.cheese_maker.outputCount -= 1;
                this.sound.playHarvest();
                this.joyTimer = 0.35;
            }
        }

        if (actionKey === "deposit_loom") {
            const hasItem = this.state.player.bag.find(i => i.type === "wool");
            if (hasItem && hasItem.count > 0 && this.state.machines.loom_weaver.inputQueue < 25) {
                this.state.removeFromBag("wool", 1);
                this.state.machines.loom_weaver.inputQueue += 1;
                this.sound.playDeposit();
            }
        }
        if (actionKey === "pickup_loom" && this.state.machines.loom_weaver.outputCount > 0) {
            if (this.state.getBagCount() < this.state.getMaxBagCapacity()) {
                this.state.addToBag("fabric", 1);
                this.state.onItemCollected("fabric", 1);
                this.state.machines.loom_weaver.outputCount -= 1;
                this.sound.playHarvest();
                this.joyTimer = 0.35;
            }
        }

        if (actionKey === "load_truck" && this.state.truck.status === "docked") {
            const truckCfg = this.state.getTruckConfig();
            if (this.state.getTruckCargoCount() < truckCfg.capacity && this.state.player.bag.length > 0) {
                const item = this.state.player.bag[0];
                this.state.removeFromBag(item.type, 1);
                let cargoItem = this.state.truck.cargo.find(c => c.type === item.type);
                if (cargoItem) cargoItem.count += 1;
                else this.state.truck.cargo.push({ type: item.type, count: 1 });
                this.sound.playDeposit();
            }
        }

        if (actionKey === "ship_truck") this.triggerShipTruck();
        if (actionKey === "shop") this.openShopModal();
        if (actionKey === "animal_shop") this.openAnimalShopModal();
        if (actionKey === "quest_board") this.openQuestModal();
    }

    triggerShipTruck() {
        if (this.state.truck.status === "delivering") return;
        if (this.state.getTruckCargoCount() === 0) return;

        const truckCfg = this.state.getTruckConfig();
        let totalRev = 0;
        this.state.truck.cargo.forEach(c => {
            totalRev += ITEM_DEFS[c.type].price * c.count;
        });
        this.state.truck.potentialRevenue = Math.round(totalRev * truckCfg.multiplier);
        this.state.truck.status = "delivering";
        this.state.truck.deliverTimer = 0;
        this.state.truck.deliverDuration = truckCfg.travelTimeMs;

        this.sound.playTruckHonk();
    }

    spawnSparks3D(x, y, z, color, count = 12) {
        for (let i = 0; i < count; i++) {
            const geo = new THREE.SphereGeometry(0.12, 6, 6);
            const mat = new THREE.MeshBasicMaterial({ color: color });
            const p = new THREE.Mesh(geo, mat);
            p.position.set(x, y, z);
            this.scene.add(p);

            const angle = Math.random() * Math.PI * 2;
            const spd = Math.random() * 4 + 2;
            this.particles3D.push({
                mesh: p,
                vx: Math.cos(angle) * spd,
                vy: Math.random() * 5 + 3,
                vz: Math.sin(angle) * spd,
                life: 0.8
            });
        }
    }

    getEmoteTexture(emoji) {
        if (!this.emoteTextures) this.emoteTextures = {};
        if (this.emoteTextures[emoji]) return this.emoteTextures[emoji];
        if (typeof document === "undefined") return null;
        const canvas = document.createElement("canvas");
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext("2d");
        if (!ctx) return null;
        ctx.clearRect(0, 0, 128, 128);
        ctx.font = "72px 'Segoe UI Emoji', 'Apple Color Emoji', 'Noto Color Emoji', sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(emoji, 64, 68);
        const tex = new THREE.CanvasTexture(canvas);
        tex.minFilter = THREE.LinearFilter;
        this.emoteTextures[emoji] = tex;
        return tex;
    }

    spawnEmote3D(x, y, z, emoji = "❤️", riseDist = 1.8, duration = 1.6) {
        const tex = this.getEmoteTexture(emoji);
        if (!tex) return;
        const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, opacity: 1.0, depthWrite: false });
        const sprite = new THREE.Sprite(mat);
        sprite.scale.set(0.9, 0.9, 1.0);
        sprite.position.set(x, y, z);
        this.scene.add(sprite);

        this.particles3D.push({
            mesh: sprite,
            vx: (Math.random() - 0.5) * 0.4,
            vy: riseDist / duration,
            vz: (Math.random() - 0.5) * 0.4,
            life: duration,
            maxLife: duration,
            isEmote: true
        });
    }

    updateParticles3D(dt) {
        for (let i = this.particles3D.length - 1; i >= 0; i--) {
            const p = this.particles3D[i];
            p.mesh.position.x += p.vx * dt;
            p.mesh.position.y += p.vy * dt;
            p.mesh.position.z += p.vz * dt;
            if (p.isEmote) {
                if (p.mesh.material) {
                    p.mesh.material.opacity = Math.max(0, Math.min(1.0, (p.life / p.maxLife) * 1.5));
                }
                p.mesh.position.x += Math.sin((p.maxLife - p.life) * 4) * 0.006;
                p.mesh.scale.multiplyScalar(1.0 + 0.1 * dt);
            } else {
                p.vy -= 12 * dt;
            }
            p.life -= dt;
            if (p.life <= 0) {
                this.scene.remove(p.mesh);
                if (p.isEmote && p.mesh.material) {
                    p.mesh.material.dispose();
                }
                this.particles3D.splice(i, 1);
            }
        }
    }

    render(time) {
        this.renderer.render(this.scene, this.camera);
    }

    updateHUD() {
        const cashEl = document.getElementById("hudCash");
        if (cashEl) cashEl.textContent = `Rp ${this.state.player.cash.toLocaleString("id-ID")}`;

        const playerLevel = this.state.player.level || 1;
        const xpCurrent = this.state.player.xp || 0;
        const levelCfg = this.state.getLevelConfig ? this.state.getLevelConfig(playerLevel) : { xpRequired: 100 };
        const xpMax = levelCfg.xpRequired || 100;
        const xpPercent = Math.min(100, Math.round((xpCurrent / xpMax) * 100));

        const levelEl = document.getElementById("hudPlayerLevel");
        if (levelEl) levelEl.textContent = playerLevel;

        const levelXpEl = document.getElementById("hudLevelXp");
        if (levelXpEl) levelXpEl.textContent = `${xpCurrent} / ${xpMax} XP`;

        const xpFillEl = document.getElementById("hudXpFill");
        if (xpFillEl) xpFillEl.style.width = `${xpPercent}%`;

        const stars = this.state.player.stars ?? 150;
        const starsEl = document.getElementById("hudStars");
        if (starsEl) starsEl.textContent = stars;

        const missionCountdownEl = document.getElementById("hudMissionCountdown");
        if (missionCountdownEl) missionCountdownEl.textContent = "MISI: SIAP";

        const bagCount = this.state.getBagCount();
        const maxBag = this.state.getMaxBagCapacity();
        const bagEl = document.getElementById("hudBag");
        if (bagEl) {
            bagEl.textContent = `${bagCount} / ${maxBag}`;
            if (bagEl.parentElement) {
                bagEl.parentElement.classList.toggle("hud-warning", bagCount >= maxBag);
            }
        }

        const truckCargo = this.state.getTruckCargoCount();
        const truckCap = this.state.getTruckConfig().capacity;
        const truckStatusEl = document.getElementById("hudTruckStatus");
        if (truckStatusEl) {
            if (this.state.truck.status === "delivering") {
                const totalMs = this.state.truck.deliverDuration || 45000;
                const sLeft = Math.max(1, Math.ceil((totalMs - this.state.truck.deliverTimer) / 1000));
                truckStatusEl.textContent = `${sLeft}s`;
                truckStatusEl.style.color = "#FF7043";
            } else {
                truckStatusEl.textContent = `${truckCargo}/${truckCap}`;
                truckStatusEl.style.color = "#2B1806";
            }
        }
    }

    openQuestModal() {
        this.clearAllInputState();
        const modal = document.getElementById("questModal");
        if (!modal) return;
        const shopModal = document.getElementById("shopModal");
        if (shopModal) shopModal.classList.add("hidden");
        const animalModal = document.getElementById("animalShopModal");
        if (animalModal) animalModal.classList.add("hidden");

        modal.classList.remove("hidden");
        this.renderQuestGUI();
        if (this.sound && this.sound.playClick) this.sound.playClick();
    }

    closeQuestModal() {
        this.clearAllInputState();
        const modal = document.getElementById("questModal");
        if (modal) modal.classList.add("hidden");
        if (this.sound && this.sound.playClick) this.sound.playClick();
        if (document.activeElement) document.activeElement.blur();
    }

    getQuestItemIcon(type) {
        switch (type) {
            case "wool":
                return `
                <svg width="44" height="44" viewBox="0 0 48 48">
                    <path d="M16 34h16a8 8 0 0 0 7-12 7 7 0 0 0-7-7 8 8 0 0 0-14-3 8 8 0 0 0-11 9 7 7 0 0 0 3 13z" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="2.5" stroke-linecap="round"/>
                    <circle cx="20" cy="22" r="1.5" fill="#94A3B8"/>
                    <circle cx="28" cy="24" r="1.5" fill="#94A3B8"/>
                </svg>`;
            case "meat":
                return `
                <svg width="44" height="44" viewBox="0 0 48 48">
                    <ellipse cx="24" cy="24" rx="18" ry="12" fill="#E53935" stroke="#B71C1C" stroke-width="2"/>
                    <ellipse cx="24" cy="24" rx="14" ry="9" fill="#EF5350"/>
                    <circle cx="20" cy="24" r="4.5" fill="#FFFFFF" stroke="#E0E0E0" stroke-width="1.5"/>
                    <path d="M12 22 Q24 28 36 22" stroke="#FFCDD2" stroke-width="2" fill="none"/>
                </svg>`;
            case "milk":
                return `
                <svg width="44" height="44" viewBox="0 0 48 48">
                    <rect x="18" y="6" width="12" height="6" rx="2" fill="#90CAF9" stroke="#1976D2" stroke-width="1.5"/>
                    <path d="M18 12 L15 19 L15 40 Q15 42 18 42 L30 42 Q33 42 33 40 L33 19 L30 12 Z" fill="#E1F5FE" stroke="#0288D1" stroke-width="2"/>
                    <rect x="17" y="24" width="14" height="12" rx="2" fill="#B3E5FC"/>
                    <text x="24" y="33" font-size="7" font-weight="bold" fill="#0277BD" text-anchor="middle">MILK</text>
                </svg>`;
            case "egg":
                return `
                <svg width="44" height="44" viewBox="0 0 48 48">
                    <path d="M8 34 Q24 44 40 34 Q36 30 24 32 Q12 30 8 34 Z" fill="#FFA000" stroke="#FF8F00" stroke-width="1.5"/>
                    <path d="M24 10 C18 10 16 22 16 30 C16 36 20 38 24 38 C28 38 32 36 32 30 C32 22 30 10 24 10 Z" fill="#FFFFFF" stroke="#D7CCC8" stroke-width="2"/>
                </svg>`;
            case "fabric":
                return `
                <svg width="44" height="44" viewBox="0 0 48 48">
                    <rect x="14" y="10" width="20" height="5" rx="2" fill="#795548"/>
                    <rect x="14" y="33" width="20" height="5" rx="2" fill="#795548"/>
                    <rect x="17" y="15" width="14" height="18" fill="#ECEFF1" stroke="#90A4AE" stroke-width="1.5"/>
                    <line x1="17" y1="20" x2="31" y2="20" stroke="#CFD8DC" stroke-width="1.5"/>
                    <line x1="17" y1="24" x2="31" y2="24" stroke="#CFD8DC" stroke-width="1.5"/>
                    <line x1="17" y1="28" x2="31" y2="28" stroke="#CFD8DC" stroke-width="1.5"/>
                </svg>`;
            case "golden_yarn":
                return `
                <svg width="44" height="44" viewBox="0 0 48 48">
                    <rect x="14" y="10" width="20" height="5" rx="2" fill="#8D6E63"/>
                    <rect x="14" y="33" width="20" height="5" rx="2" fill="#8D6E63"/>
                    <rect x="17" y="15" width="14" height="18" fill="#FFD700" stroke="#FFA000" stroke-width="1.5"/>
                    <line x1="17" y1="20" x2="31" y2="20" stroke="#FFE082" stroke-width="1.5"/>
                    <line x1="17" y1="24" x2="31" y2="24" stroke="#FFE082" stroke-width="1.5"/>
                    <line x1="17" y1="28" x2="31" y2="28" stroke="#FFE082" stroke-width="1.5"/>
                </svg>`;
            case "mayo":
                return `
                <svg width="44" height="44" viewBox="0 0 48 48">
                    <rect x="18" y="8" width="12" height="5" rx="1.5" fill="#EF5350"/>
                    <path d="M16 13 L32 13 L30 38 Q30 41 24 41 Q18 41 18 38 Z" fill="#FFF9C4" stroke="#FBC02D" stroke-width="2"/>
                    <rect x="19" y="21" width="10" height="9" rx="1.5" fill="#FFF59D"/>
                    <text x="24" y="28" font-size="6" font-weight="bold" fill="#F57F17" text-anchor="middle">MAYO</text>
                </svg>`;
            case "cheese":
                return `
                <svg width="44" height="44" viewBox="0 0 48 48">
                    <path d="M10 34 L38 34 L32 14 Z" fill="#FFCA28" stroke="#FFA000" stroke-width="2"/>
                    <circle cx="20" cy="28" r="2.5" fill="#FFE082"/>
                    <circle cx="28" cy="26" r="3" fill="#FFE082"/>
                    <circle cx="24" cy="20" r="2" fill="#FFE082"/>
                </svg>`;
            default:
                return `<span style="font-size:24px;">📦</span>`;
        }
    }

    renderQuestGUI() {
        const modal = document.getElementById("questModal");
        if (!modal || modal.classList.contains("hidden")) return;

        // 1. Update Saldo Total Bintang & Countdown 24 Jam
        const starAmountEl = document.getElementById("questStarAmount");
        if (starAmountEl) starAmountEl.textContent = this.state.player.stars ?? 150;

        const countdownEl = document.getElementById("questTimerCountdown");
        if (countdownEl) countdownEl.textContent = this.state.getQuestCountdownFormatted();

        // 2. Navigasi Tab (Harian vs Mingguan Sesuai Referensi)
        const tabDaily = document.getElementById("tabQuestDaily");
        const tabWeekly = document.getElementById("tabQuestWeekly");
        const isWeekly = (this.state.questTab === "weekly");
        if (tabDaily) tabDaily.classList.toggle("active", !isWeekly);
        if (tabWeekly) tabWeekly.classList.toggle("active", isWeekly);

        // 3. Render Kartu-Kartu Misi
        const container = document.getElementById("questCardsList");
        if (!container) return;
        container.innerHTML = "";

        const playerLevel = this.state.player.level || 1;
        const levelCfg = this.state.getLevelConfig ? this.state.getLevelConfig(playerLevel) : { title: "Peternak", xpRequired: 100 };
        const xpCurrent = this.state.player.xp || 0;
        const xpMax = levelCfg.xpRequired || 100;
        const xpPercent = Math.min(100, Math.round((xpCurrent / xpMax) * 100));

        // Banner Hubungan Tingkat Level & Misi (Sesuai Permintaan User: Selesaikan Misi untuk Naik Level!)
        const levelBanner = document.createElement("div");
        levelBanner.style.cssText = "background:linear-gradient(135deg, #FFF9C4, #FFE082); border:2px solid #F57F17; border-radius:10px; padding:10px 16px; margin-bottom:14px; display:flex; justify-content:space-between; align-items:center;";
        levelBanner.innerHTML = `
            <div>
                <strong style="color:#E65100; font-size:1.05rem;">⭐ Tingkat ${playerLevel}: ${levelCfg.title}</strong>
                <div style="font-size:0.8rem; color:#6D4C41; margin-top:2px;">Selesaikan misi setiap level untuk mengumpulkan XP dan membuka hewan & industri baru!</div>
            </div>
            <div style="text-align:right;">
                <div style="font-size:0.85rem; font-weight:800; color:#5D4037;">${xpCurrent} / ${xpMax} XP</div>
                <div style="width:130px; height:9px; background:#D7CCC8; border-radius:5px; overflow:hidden; margin-top:3px;">
                    <div style="width:${xpPercent}%; height:100%; background:linear-gradient(90deg, #AB47BC, #7B1FA2); border-radius:5px;"></div>
                </div>
            </div>
        `;
        container.appendChild(levelBanner);

        const currentQuests = isWeekly ? this.state.quests.weekly : this.state.quests.daily;
        if (!currentQuests || currentQuests.length === 0) {
            container.innerHTML += `<div style="text-align:center; padding:32px; color:#8D6E63; font-weight:800;">Semua misi telah diselesaikan! Klik tombol Refresh di atas untuk tantangan baru.</div>`;
            return;
        }

        currentQuests.forEach(quest => {
            const progress = this.state.checkQuestProgress(quest);
            const card = document.createElement("div");
            card.className = `quest-card ${quest.completed ? 'completed' : ''}`;

            // Header Kartu: Label Tingkat Kesulitan + Counter Progres (0/1, 1/2, dst)
            const headerDiv = document.createElement("div");
            headerDiv.className = "quest-card-header";
            headerDiv.innerHTML = `
                <span class="quest-difficulty-badge ${quest.diffBadge || 'easy'}">${quest.difficulty}</span>
                <span class="quest-progress-ratio">${progress.satisfiedCount}/${progress.totalRequired}</span>
            `;
            card.appendChild(headerDiv);

            // Body Kartu: Kotak Bahan, Hadiah (Rp & Bintang & XP), dan Tombol Aksi (Gembok / Tukar)
            const bodyDiv = document.createElement("div");
            bodyDiv.className = "quest-card-body";

            // List Bahan Panen yang Dibutuhkan
            const itemsList = document.createElement("div");
            itemsList.className = "quest-items-list";

            progress.details.forEach(req => {
                const slot = document.createElement("div");
                slot.className = `quest-item-slot ${req.isMet ? 'satisfied' : ''}`;
                slot.innerHTML = `
                    <div class="quest-item-title">${req.name}</div>
                    <div class="quest-item-icon">${this.getQuestItemIcon(req.type)}</div>
                    <div class="quest-item-count ${req.isMet ? 'satisfied' : ''}">
                        ${req.isMet ? `✓ ${req.current}/${req.required}` : `${req.current}/${req.required}`}
                    </div>
                `;
                itemsList.appendChild(slot);
            });
            bodyDiv.appendChild(itemsList);

            // Kotak HADIAH (Uang Rp, Bintang ⭐ & XP Level ✨)
            const rewardSlot = document.createElement("div");
            rewardSlot.className = "quest-reward-slot";
            rewardSlot.innerHTML = `
                <div class="reward-header-title">HADIAH</div>
                <div class="reward-details-body">
                    <div class="reward-cash-line">
                        <span class="reward-icon">💵</span>
                        <span>Rp ${quest.rewardCash.toLocaleString("id-ID")}</span>
                    </div>
                    <div class="reward-star-line">
                        <span class="reward-icon">⭐</span>
                        <span>${quest.rewardStars}</span>
                    </div>
                    <div class="reward-xp-line" style="color:#7B1FA2; font-weight:800; font-size:0.82rem; margin-top:2px;">
                        <span class="reward-icon">✨</span>
                        <span>+${quest.rewardXP || 35} XP</span>
                    </div>
                </div>
            `;
            bodyDiv.appendChild(rewardSlot);

            // Tombol Aksi (Tukar Hadiah / Gembok Terkunci)
            const actionSlot = document.createElement("div");
            actionSlot.className = "quest-action-slot";

            if (quest.completed) {
                actionSlot.innerHTML = `<button class="btn-quest-done" disabled>SELESAI ✓</button>`;
            } else if (progress.isAllMet) {
                const btnClaim = document.createElement("button");
                btnClaim.className = "btn-quest-claim";
                btnClaim.textContent = "Klaim";
                btnClaim.title = "Target misi tercapai! Klik untuk mengklaim Hadiah Rp, Bintang, dan XP (Isi ransel tetap utuh)";
                btnClaim.addEventListener("click", () => {
                    const res = this.state.claimQuest(quest.id);
                    if (res.success) {
                        if (res.leveledUp) {
                            this.sound.playUpgrade();
                            this.spawnSparks3D(this.playerMesh.position.x, 2.5, this.playerMesh.position.z, 0xAB47BC, 60);
                            this.showToast(`🌟 SELAMAT! TINGKAT MENINGKAT KE TINGKAT ${res.newLevel}! Misi baru telah dibuka!`, 4000);
                        } else {
                            this.sound.playCash();
                            this.spawnSparks3D(this.playerMesh.position.x, 2.0, this.playerMesh.position.z, 0xFFD700, 32);
                            this.showToast(`🎉 Misi Sukses Diklaim! +Rp ${res.rewardCash.toLocaleString("id-ID")}, +${res.rewardStars} ⭐ & +${res.rewardXP} XP! (Isi ransel tetap utuh)`);
                        }
                        this.renderQuestGUI();
                        this.updateHUD();
                    } else {
                        if (this.sound && this.sound.playBuzz) this.sound.playBuzz();
                        this.showToast(res.msg || "Target pengumpulan belum tercapai!");
                    }
                });
                actionSlot.appendChild(btnClaim);
            } else {
                actionSlot.innerHTML = `
                    <button class="btn-quest-locked" disabled title="Jumlah bahan di ransel belum mencukupi (Terkunci)">
                        🔒
                    </button>
                `;
            }
            bodyDiv.appendChild(actionSlot);

            card.appendChild(bodyDiv);
            container.appendChild(card);
        });
    }

    openShopModal() {
        this.clearAllInputState();
        const modal = document.getElementById("shopModal");
        if (!modal) return;
        const animalModal = document.getElementById("animalShopModal");
        if (animalModal) animalModal.classList.add("hidden");
        const questModal = document.getElementById("questModal");
        if (questModal) questModal.classList.add("hidden");

        this.renderShopItems();
        modal.classList.remove("hidden");
        if (this.sound && this.sound.playClick) this.sound.playClick();
    }

    closeShopModal() {
        this.clearAllInputState();
        const modal = document.getElementById("shopModal");
        if (modal) modal.classList.add("hidden");
        if (this.sound && this.sound.playClick) this.sound.playClick();
        if (document.activeElement) document.activeElement.blur();
    }

    openAnimalShopModal() {
        this.clearAllInputState();
        const modal = document.getElementById("animalShopModal");
        if (!modal) return;
        const shopModal = document.getElementById("shopModal");
        if (shopModal) shopModal.classList.add("hidden");
        const questModal = document.getElementById("questModal");
        if (questModal) questModal.classList.add("hidden");

        this.renderAnimalShopItems();
        modal.classList.remove("hidden");
        if (this.sound && this.sound.playClick) this.sound.playClick();
    }

    closeAnimalShopModal() {
        this.clearAllInputState();
        const modal = document.getElementById("animalShopModal");
        if (modal) modal.classList.add("hidden");
        if (this.sound && this.sound.playClick) this.sound.playClick();
        if (document.activeElement) document.activeElement.blur();
    }

    renderAnimalShopItems() {
        const list = document.getElementById("animalShopItemsList");
        if (!list) return;
        list.innerHTML = "";

        const animalShopDefs = [
            {
                type: "chicken",
                name: "Ayam",
                title: "🐔 Ayam Petelur",
                desc: "Menghasilkan 🥚 Telur Ayam segar di kandang ayam.",
                cost: 25,
                max: 12
            },
            {
                type: "cow",
                name: "Sapi",
                title: "🐄 Sapi Perah",
                desc: "Menghasilkan 🥛 Susu Sapi murni di kandang sapi.",
                cost: 55,
                max: 8
            },
            {
                type: "sheep",
                name: "Domba",
                title: "🐑 Domba Wol",
                desc: "Menghasilkan 🧶 Wol Domba tebal di padang domba.",
                cost: 85,
                max: 8
            }
        ];

        // Bar Informasi Saldo Pemain & Tombol Tambah Modal
        const headerDiv = document.createElement("div");
        headerDiv.style.cssText = "display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; padding:10px 14px; background:rgba(255,255,255,0.06); border-radius:10px; border:1px solid rgba(255,255,255,0.1);";
        headerDiv.innerHTML = `
            <div>
                <span style="color:#94A3B8; font-size:0.85rem;">Saldo Kas Anda:</span>
                <strong style="color:#4CAF50; font-size:1.25rem; margin-left:6px;">Rp ${this.state.player.cash.toLocaleString("id-ID")}</strong>
            </div>
            <button class="btn btn-secondary" id="btnAnimalBonusCash" style="font-size:0.8rem; padding:6px 14px; cursor:pointer; background:#2563EB; color:#FFF; border:none; border-radius:6px; font-weight:600;">
                🎁 + Rp 100 Modal Uji Coba
            </button>
        `;
        list.appendChild(headerDiv);

        headerDiv.querySelector("#btnAnimalBonusCash").addEventListener("click", () => {
            this.state.player.cash += 100;
            this.state.save();
            this.sound.playCash();
            this.updateHUD();
            this.renderAnimalShopItems();
        });

        animalShopDefs.forEach(a => {
            const isPaddockUnlocked = (a.type === "chicken") 
                ? true 
                : (a.type === "cow" ? !!this.state.upgrades.hasCow : !!this.state.upgrades.hasSheep);
            const count = this.state.getAnimalCount(a.type);
            const isMax = count >= a.max;
            const canAfford = (this.state.player.cash >= a.cost);
            const div = document.createElement("div");
            div.className = `shop-card ${!isPaddockUnlocked ? 'locked-paddock-card' : ''}`;

            if (!isPaddockUnlocked) {
                const paddockName = (a.type === "cow") ? "Kandang Sapi" : "Padang Domba";
                const paddockCost = (a.type === "cow") ? 150 : 300;
                div.innerHTML = `
                    <div class="shop-card-info">
                        <h4>${a.title}</h4>
                        <p>${a.desc}</p>
                        <span class="animal-count-badge" style="background:#E53935; color:#FFF; font-weight:700;">🔒 ${paddockName} Belum Terbuka</span>
                        <div style="color:#FFA000; font-size:0.82rem; margin-top:4px;">Kandang ini harus dibeli terlebih dahulu di Toko Upgrade seharga Rp ${paddockCost}!</div>
                    </div>
                    <button class="btn btn-primary btn-goto-upgrade-paddock" style="background:#F57C00; font-weight:700; white-space:nowrap; padding:10px 16px;">
                        Buka di Toko Upgrade (Rp ${paddockCost})
                    </button>
                `;
                div.querySelector(".btn-goto-upgrade-paddock").addEventListener("click", () => {
                    this.closeAnimalShopModal();
                    this.openShopModal();
                });
            } else {
                div.innerHTML = `
                    <div class="shop-card-info">
                        <h4>${a.title}</h4>
                        <p>${a.desc}</p>
                        <span class="animal-count-badge">Dimiliki: ${count} / ${a.max} ekor</span>
                        ${!canAfford && !isMax ? `<div style="color:#FFB74D; font-size:0.8rem; margin-top:4px;">⚠️ Saldo kurang Rp ${(a.cost - this.state.player.cash).toLocaleString("id-ID")}</div>` : ''}
                    </div>
                    <button class="btn btn-buy ${isMax ? 'disabled' : (canAfford ? '' : 'btn-warning')}" ${isMax ? 'disabled' : ''}>
                        ${isMax ? 'KANDANG PENUH' : `Beli: Rp ${a.cost}`}
                    </button>
                `;

                if (!isMax) {
                    div.querySelector("button").addEventListener("click", () => {
                        if (this.state.player.cash < a.cost) {
                            if (this.sound && this.sound.playBuzz) this.sound.playBuzz();
                            this.showToast(`💰 Uang belum cukup! Butuh Rp ${a.cost} (Uang Anda: Rp ${this.state.player.cash.toLocaleString("id-ID")}).`);
                            return;
                        }

                        const success = this.state.buyAnimal(a.type, a.cost);
                        if (success) {
                            this.syncAnimalsWithAI();
                            this.sound.playUpgrade();
                            this.spawnSparks3D(-4.2, 1.2, 5.5, 0x00E5FF, 25);
                            this.renderAnimalShopItems();
                            this.updateHUD();
                            const newCount = this.state.getAnimalCount(a.type);
                            if (a.type === "chicken" && newCount === 5) {
                                this.showToast(`🎉 Berhasil membeli Ayam ke-5! 🏠 Rumah Ayam ke-2 telah muncul di peternakan!`, 4000);
                            } else if (a.type === "chicken" && newCount === 9) {
                                this.showToast(`🎉 Berhasil membeli Ayam ke-9! 🏠 Rumah Ayam ke-3 telah muncul di peternakan!`, 4000);
                            } else {
                                this.showToast(`🎉 Berhasil membeli 1 ${a.name}! Langsung dilepas ke kandang ternak.`);
                            }
                        }
                    });
                }
            }

            list.appendChild(div);
        });
    }

    renderShopItems() {
        const list = document.getElementById("shopItemsList");
        if (!list) return;
        list.innerHTML = "";

        // ==========================================
        // BAGIAN 1: PEMBELIAN & EKSPANSI PADDOCK KANDANG HEWAN
        // Sesuai Permintaan User: Kandang Sapi (Rp 150) & Padang Domba (Rp 300)
        // ==========================================
        const paddockExpansions = [
            {
                key: "cow",
                name: "Kandang Sapi Perah",
                icon: "🐮",
                cost: 150,
                desc: "Membangun padang rumput berpagar kokoh, bak pakan rumput segar & menghadirkan 1 ekor sapi perah pertama untuk menghasilkan susu segar!",
                unlocked: !!this.state.upgrades.hasCow
            },
            {
                key: "sheep",
                name: "Padang Domba Wol",
                icon: "🐑",
                cost: 300,
                desc: "Membangun padang rumput berpagar luas & menghadirkan 1 ekor domba berbulu lebat pertama untuk memanen wol hangat bernilai tinggi!",
                unlocked: !!this.state.upgrades.hasSheep
            }
        ];

        paddockExpansions.forEach(p => {
            const div = document.createElement("div");
            div.className = `shop-card ${p.unlocked ? 'purchased-card' : 'special-card'}`;
            const canAfford = (this.state.player.cash >= p.cost);
            div.innerHTML = `
                <div class="shop-card-info">
                    <h4>${p.icon} ${p.name} ${p.unlocked ? '<span style="color:#4CAF50; font-size:0.85rem; font-weight:700;">(Terbuka ✓)</span>' : ''}</h4>
                    <p>${p.desc}</p>
                </div>
                <button class="btn btn-buy ${p.unlocked ? 'disabled' : (canAfford ? '' : 'disabled')}" ${p.unlocked || !canAfford ? 'disabled' : ''}>
                    ${p.unlocked ? 'SUDAH DIBUKA' : `Beli: Rp ${p.cost}`}
                </button>
            `;
            if (!p.unlocked) {
                div.querySelector("button").addEventListener("click", () => {
                    const success = this.state.unlockPaddock(p.key);
                    if (success) {
                        this.updatePaddockVisibility();
                        this.syncAnimalsWithAI();
                        this.sound.playUpgrade();
                        const sparkZ = (p.key === "cow") ? 21.0 : -13.0;
                        this.spawnSparks3D(-11.0, 1.8, sparkZ, 0x4CAF50, 45);
                        this.renderShopItems();
                        this.updateHUD();
                        this.showToast(`🎉 Berhasil membuka ${p.name}! Paddock & 1 ekor hewan telah hadir di peternakan.`);
                    } else {
                        if (this.sound && this.sound.playBuzz) this.sound.playBuzz();
                        this.showToast(`⚠️ Saldo Anda belum mencukupi (Rp ${p.cost}) untuk membuka ${p.name}!`);
                    }
                });
            }
            list.appendChild(div);
        });

        // ==========================================
        // BAGIAN 2: UPGRADE FASILITAS & KAPASITAS PETERNAK
        // ==========================================
        const upgradeKeys = [
            { key: "bag", cfg: UPGRADE_CONFIG.bag, curr: this.state.upgrades.bagLevel, max: UPGRADE_CONFIG.bag.costs.length },
            { key: "speed", cfg: UPGRADE_CONFIG.speed, curr: this.state.upgrades.speedLevel, max: UPGRADE_CONFIG.speed.costs.length },
            { key: "petCare", cfg: UPGRADE_CONFIG.petCare, curr: this.state.upgrades.petCareLevel, max: UPGRADE_CONFIG.petCare.costs.length },
            { key: "factorySpeed", cfg: UPGRADE_CONFIG.factorySpeed, curr: this.state.upgrades.factorySpeedLevel, max: UPGRADE_CONFIG.factorySpeed.costs.length }
        ];

        upgradeKeys.forEach(u => {
            const isMax = u.curr >= u.max;
            const cost = isMax ? 0 : u.cfg.costs[u.curr];
            const div = document.createElement("div");
            div.className = "shop-card";
            div.innerHTML = `
                <div class="shop-card-info">
                    <h4>${u.cfg.title} (Lv. ${u.curr + 1})</h4>
                    <p>${u.cfg.desc}</p>
                </div>
                <button class="btn btn-buy ${isMax ? 'disabled' : ''}" ${isMax || this.state.player.cash < cost ? 'disabled' : ''}>
                    ${isMax ? 'MAKSIMAL' : `Beli: Rp ${cost.toLocaleString("id-ID")}`}
                </button>
            `;
            if (!isMax) {
                div.querySelector("button").addEventListener("click", () => {
                    if (this.state.player.cash >= cost) {
                        this.state.player.cash -= cost;
                        if (u.key === "bag") this.state.upgrades.bagLevel++;
                        if (u.key === "speed") this.state.upgrades.speedLevel++;
                        if (u.key === "petCare") this.state.upgrades.petCareLevel++;
                        if (u.key === "factorySpeed") this.state.upgrades.factorySpeedLevel++;
                        this.sound.playUpgrade();
                        this.renderShopItems();
                        this.updateHUD();
                    }
                });
            }
            list.appendChild(div);
        });

        // Banner Jalan Pintas Toko Hewan
        const divAnimalShop = document.createElement("div");
        divAnimalShop.className = "shop-card special-card";
        divAnimalShop.innerHTML = `
            <div class="shop-card-info">
                <h4>🐾 Toko Hewan Ternak</h4>
                <p>Beli tambahan Ayam, Sapi, dan Domba di Gerobak Toko Hewan untuk melipatgandakan hasil panen!</p>
            </div>
            <button class="btn btn-primary" id="btnGoToAnimalShop">Buka Toko Hewan</button>
        `;
        divAnimalShop.querySelector("#btnGoToAnimalShop").addEventListener("click", () => {
            this.closeShopModal();
            this.openAnimalShopModal();
        });
        list.appendChild(divAnimalShop);

        // Armada Pengantar (6 Level Peningkatan: dari Sepeda hingga Truk Kontainer Sesuai Referensi)
        if (this.state.truck.level < TRUCK_LEVELS.length) {
            const nextLv = this.state.truck.level + 1;
            const cost = UPGRADE_CONFIG.truckUpgrade.costs[this.state.truck.level - 1];
            const nextCfg = TRUCK_LEVELS[nextLv - 1];
            const canAfford = (this.state.player.cash >= cost);
            const div = document.createElement("div");
            div.className = "shop-card";
            div.innerHTML = `
                <div class="shop-card-info">
                    <h4>🚀 Upgrade ke: ${nextCfg.name}</h4>
                    <p>${nextCfg.desc}</p>
                    <div style="font-size:0.82rem; color:#81C784; margin-top:3px;">
                        📦 Kapasitas: <strong>${nextCfg.capacity} barang</strong> | ⏱️ Waktu Antar: <strong>${nextCfg.travelTimeMs / 1000}s</strong> | 💰 Hasil: <strong>${nextCfg.multiplier}x</strong>
                    </div>
                </div>
                <button class="btn btn-buy ${canAfford ? '' : 'disabled'}" ${canAfford ? '' : 'disabled'}>
                    Upgrade: Rp ${cost.toLocaleString("id-ID")}
                </button>
            `;
            div.querySelector("button").addEventListener("click", () => {
                if (this.state.player.cash >= cost) {
                    this.state.player.cash -= cost;
                    this.state.truck.level = nextLv;
                    this.state.upgrades.truckLevel = nextLv;
                    this.rebuildTruck3D();
                    this.state.save();
                    this.sound.playUpgrade();
                    this.spawnSparks3D(20.5, 2.0, 8, 0xFFD700, 25);
                    this.renderShopItems();
                    this.updateHUD();

                    const toast = document.getElementById("cameraToast");
                    if (toast) {
                        toast.textContent = `🚀 Berhasil meningkatkan kendaraan ke: ${nextCfg.name}!`;
                        toast.classList.add("show");
                        setTimeout(() => toast.classList.remove("show"), 2600);
                    }
                }
            });
            list.appendChild(div);
        } else {
            const div = document.createElement("div");
            div.className = "shop-card";
            div.innerHTML = `
                <div class="shop-card-info">
                    <h4>🚛 Armada Maksimal (Truk Kontainer Logistik)</h4>
                    <p>Kendaraan pengantarmu sudah mencapai level tertinggi! Kapasitas 75 barang, waktu antar kilat 4.5 detik, bonus hasil 3.2x lipat.</p>
                </div>
                <button class="btn btn-buy disabled" disabled>MAKSIMAL</button>
            `;
            list.appendChild(div);
        }
    }

    showOfflineModal(report) {
        const modal = document.getElementById("offlineModal");
        if (!modal) return;
        document.getElementById("offlineDurationText").textContent = `Anda offline selama ${report.durationMinutes} menit.`;
        document.getElementById("offlineEggCount").textContent = report.itemsProduced.egg;
        document.getElementById("offlineMilkCount").textContent = report.itemsProduced.milk;
        document.getElementById("offlineWoolCount").textContent = report.itemsProduced.wool;
        modal.classList.remove("hidden");
    }
}

// Inisialisasi saat window dimuat
window.addEventListener("DOMContentLoaded", () => {
    window.gameEngine3D = new GameEngine3D();
    window.gameEngine3D.start();

    // Pastikan menutup modal selalu mereset state tombol/input agar karakter TIDAK jalan sendiri!
    document.querySelectorAll(".close-modal").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const m = e.target.closest(".modal-overlay");
            if (m) m.classList.add("hidden");
            if (window.gameEngine3D) window.gameEngine3D.clearAllInputState();
            if (document.activeElement) document.activeElement.blur();
        });
    });

    document.querySelectorAll(".modal-overlay").forEach(overlay => {
        overlay.addEventListener("click", (e) => {
            if (e.target === overlay) {
                overlay.classList.add("hidden");
                if (window.gameEngine3D) window.gameEngine3D.clearAllInputState();
                if (document.activeElement) document.activeElement.blur();
            }
        });
    });
});
