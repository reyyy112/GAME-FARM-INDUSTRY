# 🏭 FARM INDUSTRY 3D - WEB GAME (IMK EDITION)
### Hyper-Realistic Unreal Engine 5 Aesthetic & Dynamic Dual-Camera Simulation

Game simulasi peternakan industri (*Farming Tycoon / Idle Industrial Simulator*) **3 Dimensi (3D)** berbasis web, direplikasi dengan alur dan logika yang sama persis seperti game populer Roblox **`[🏭] Farm Industry`** karya **Arazy Verse**, dengan visual grafis fotorealistis terinspirasi dari **Unreal Engine 5**.

Dibuat untuk kebutuhan proyek dan tugas mata kuliah **Interaksi Manusia dan Komputer (IMK) Semester 5**.

---

## 🎮 Cara Menjalankan Game 3D

Game ini dibangun menggunakan teknologi **Three.js 3D Engine, HTML5 WebGL, Canvas PBR Texture Generator, CSS3 Glassmorphism, dan Web Audio API**. Semua pustaka Three.js dan tekstur disimpan secara lokal/prosedural, sehingga game dapat dimainkan **100% offline** tanpa perlu koneksi internet ataupun download aset eksternal!

### Cara 1 (Paling Cepat):
* Cukup buka file **`index.html`** langsung dengan mengklik ganda (*double-click*) di browser Google Chrome, Microsoft Edge, atau Firefox.

### Cara 2 (Menggunakan Local Server):
Jalankan perintah berikut di terminal:
```bash
python -m http.server 8080
```
Lalu buka di browser: `http://localhost:8080`

---

## 🌟 Fitur Unggulan Grafis & Simulasi (Unreal Engine 5 Aesthetic)

### 1. 🎥 Dynamic Dual-Camera System (Diorama ⇄ First-Person POV)
* **Mode 1: Birds-Eye Diorama Overview (Sudut Tinggi):**
  * Tinjauan isometrik sinematik (FOV 40°) yang memperlihatkan keseluruhan lanskap pertanian, bangunan gudang merah besar, silo logam, dan kandang ternak persis seperti miniatur foto diorama.
* **Mode 2: Eye-Level First-Person POV (Mata Petani):**
  * Transisi kamera halus (*seamless lerp interpolation*) dari langit langsung menyelam ke ketinggian mata karakter (1.65m) dengan lensa sudut lebar (FOV 76°).
  * Pemain dapat berjalan menjelajahi setiap sudut peternakan secara imersif, menengadah memandang silo gandum setinggi 12 meter, melihat ternak dari dekat, dan mengoperasikan mesin industri.
* **Kontrol Kamera:**
  * Tekan tombol **`V`** atau **`C`** pada keyboard, atau klik tombol **`🎥 Kamera (V)`** di bilah atas.
  * Pada mode FPV: **Tarik/drag mouse** atau gunakan tombol panah untuk menoleh 360° ke sekeliling arena.

### 2. 🎨 Tekstur PBR Prosedural Resolusi Tinggi (`textures.js`)
* **Weathered Red Barn Wood:** Papan kayu vertikal gudang merah pedesaan Amerika dengan serat kayu alami, bayangan celah, noda cuaca lapuk, dan paku keling besi.
* **Galvanized Steel Silo with Rust Accents:** Logam baja seng galvanis pada tabung silo gandum dengan plat bergaris, paku tempa, serta lelehan karat vertikal alami (*rust streaks*).
* **Dark Slate Shingle Roof:** Atap genteng batu sabak kelabu tua berundak (*gambrel roof*) pada Big Red Barn dan Farmhouse.
* **Asphalt Road with Crisp Yellow Markings:** Jalan aspal berbutir agregat kerikil dengan marka jalan kuning tajam untuk ekspedisi truk.
* **Organic Soil & Courtyard Gravel:** Tekstur tanah organik berpasir dan kerikil alami di halaman operasional peternakan.
* **White Clapboard Siding:** Papan kayu lapuk putih klasik pada rumah petani (*farmhouse*) dan kandang belakang.

### 3. ☀️ Pencahayaan Global Illumination & Unreal Engine 5 Tone Mapping
* **ACES Filmic Tone Mapping & Color Grading:** Kontras tinggi dan reproduksi warna kaya setara rendering Unreal Engine 5.
* **Dynamic Global Illumination (GI):** Hemisphere light mensimulasikan pantulan cahaya langit biru ke tanah bumi (*earth bounce*).
* **Directional Sunlight & Soft PCF Shadows:** Sinar matahari hangat *golden hour* dengan bayangan lembut beresolusi tinggi 2048x2048.
* **Atmospheric Fog:** Efek kabut udara pedesaan (*aerial perspective*) yang memberikan kedalaman ruang realistis.

### 4. 🐔 Hewan Ternak Realistis & Organik (Sesuai Foto Nyata)
* **Ayam Putih Realistis (White Hen):**
  * Anatomi tubuh bulat montok (*puffed breast*), sayap bulu terlipat rapi, ekor bulu mencuat melengkung ke atas, leher luwes, jengger merah bergerigi (*comb*), gelambir merah bawah paruh (*wattles*), paruh runcing, dan sepasang kaki ceker kuning dengan 3 jari depan + 1 taji belakang.
  * Dilengkapi animasi mematuk tanah (*pecking AI*) dan ayunan langkah kaki saat berkeliaran.
* **Sapi Perah Holstein (Dairy Cow):**
  * Bentuk tubuh silinder kekar dengan corak belang hitam-putih alami, ambing susu merah muda dengan 4 puting, moncong lebar dengan lubang hidung, telinga melengkung, tanduk gading, 4 kaki berlutut dengan kuku belah (*cloven hooves*), dan ekor pengibas dengan rumbai bulu hitam.
* **Domba Wol Hampshire (Wool Sheep):**
  * Tubuh diselimuti gumpalan wol lebat berundak (*puffy cloud fleece*), kepala dan kaki hitam arang beludru khas domba Hampshire, jambul wol di dahi (*topknot*), telinga menjuntai, dan animasi menunduk merumput.
* **Anjing Penjaga Peternakan (Farm Dog):**
  * Model anjing penjaga berotot dengan moncong gelap, hidung hitam, telinga jatuh, 4 kaki bertapak (*paws*), dan ekor melengkung yang mengibas ramah saat pemain mendekat.

### 5. 🏭 Mesin Industri Nyata & Truk Ekspedisi
* **Egg Mixer Vat:** Tong pencampur berputar dan corong penuang mayones otomatis.
* **Cast-Iron Cheese Press:** Pengepres keju hidrolik dengan balok keju padat dan kaleng susu tradisional.
* **Antique Textile Loom:** Rangka tenun kayu walnut dengan roda pemintal wol dan gulungan kain halus.
* **Truk Logistik:** Truk pengangkut dengan roda berputar dan klakson nyata yang meluncur mengantarkan muatan ke kota saat disetor.

---

## 📁 Struktur File Proyek
* `index.html` — Halaman utama game WebGL 3D dengan HUD interaktif dan viewport.
* `css/style.css` — Styling modern glassmorphism, reticle crosshair FPV, dan toast kamera.
* `js/three.min.js` — Pustaka Three.js r128 lokal (100% offline & bebas CORS).
* `js/textures.js` — Generator tekstur PBR prosedural canvas off-screen (kayu lapuk, baja seng karat, aspal, tanah organik, atap batu sabak).
* `js/3d_models.js` — Builder arsitektur pertanian, hewan hidup, karakter, dan mesin industri.
* `js/3d_game.js` — Core game engine 3D, dual-camera system, UE5 lighting, raycasting, dan AI loop.
* `js/state.js` — Manajemen state ekonomi, upgrade, dan produksi idle/offline progress.
* `js/audio.js` — Web Audio API SFX synthesizer untuk suara panen, mesin, klakson, dan koin.
