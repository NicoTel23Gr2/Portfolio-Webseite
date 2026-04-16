gsap.registerPlugin(ScrollTrigger);

// PROJEKT DATENBANK (Hier weitere Projekte hinzufügen)
// PROJEKT DATENBANK - Hier müssen alle 4 Projekte definiert sein!
const projectData = [
    {
        mainTitle: "Gitarrenverstärker",
        model: "models/Power_amp.glb",
        image: "models/PCB.png",

        lTitle: "Vorverstärker",
        lDesc: "Realisierung einer analogen Signalverarbeitung zur Emulation von Röhrenkennlinien. Durch gezielte asymmetrische Sättigung in der Transistorschaltung werden die für den Klirrfaktor relevanten geradzahligen Harmonischen erzeugt, um das dynamische Kompressionsverhalten klassischer Triodenstufen abzubilden.",

        rTitle: "Endstufe",
        rDesc: "Implementierung einer diskret aufgebauten Klasse-AB Endstufe mit einer thermisch stabilisierten Ruhestromeinstellung. Das System liefert eine Effektivleistung von 70W an 4Ω und wurde auf maximale Linearität im Arbeitsbereich sowie ein kontrolliertes Clipping-Verhalten hin optimiert."
    },
    {
        mainTitle: "kompakte Tastatur",
        model: "models/40Keyboard.glb", 
        image: "models/Project2.png", 

        lTitle: "Beschreibung",
        lDesc: "Entwicklung eines kompakten 40%-Layouts für Tablets und mobile Anwendungen. Die Hardware-Architektur wurde für Hot-Swap-Sockel ausgelegt, was den schnellen Austausch mechanischer Switches ohne Lötaufwand ermöglicht.",

        rTitle: "Spezifikationen",
        rDesc: "Einsatz eines ESP32-Mikrocontrollers zur Realisierung einer Low-Latency-Verbindung via Bluetooth und USB. Implementierung von Custom-Keymaps und Layer-Logik, um die geringen Tasten optimal nutzen zu können."
    },
    {
        mainTitle: "I/O-Platine",
        model: "models/Project3.glb", // Pfad zu deiner 3. GLB Datei
        image: "models/Project3.png", // Pfad zu deinem 3. Bild

        lTitle: "Beschreibung",
        lDesc: "Entwicklung einer modularen I/O-Platine zur Erweiterung eines generischen Steuergeräts im industriellen Umfeld. Das Design fokussiert sich auf die effiziente Anbindung variabler analoger Sensorik sowie die präzise Ansteuerung von Aktoren unter Einhaltung strenger Signalintegrität und EMV-Richtlinien.",

        rTitle: "Spezifikationen",
        rDesc: "Implementierung einer kaskadierten Multiplexer-Struktur zur hochdichten Erfassung analoger Messkanäle bei reduziertem Pin-Bedarf. Zum Schutz der Logik-Ebene wurde ein mehrstufiges Sicherheitskonzept integriert, das robuste Schutzschaltungen gegen Überspannung und Verpolung nutzt."
    },
    {
        mainTitle: "PID-Regler",
        model: "models/Project4.glb", // Pfad zu deiner 4. GLB Datei
        image: "models/Project4.png", // Pfad zu deinem 4. Bild
        lTitle: "Beschreibung",
        lDesc: "Realisierung eines zeitkontinuierlichen PID-Reglers durch eine dedizierte Operationsverstärker-Beschaltung. Das System nutzt die mathematischen Eigenschaften der Analoggatter zur unmittelbaren Abbildung von Proportional-, Integral- und Differenzialanteilen, wodurch eine verzögerungsfreie Regelung ohne digitale Diskretisierung ermöglicht wird.",
        rTitle: "Anwendung",
        rDesc: "Aufbau einer analogen Regelschleife zur exakten Positionssteuerung eines DC-Motors. Die Implementierung fokussiert sich auf die hardwareseitige Abstimmung der Regelparameter über die Rückkopplungsnetzwerke der Operationsverstärker, um ein stabiles Einschwingverhalten und eine präzise Zielpositionierung des Antriebssystems zu gewährleisten."
    }
];

// THREE.JS SETUP
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("canvas"), alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x000000, 0);

const ambientLight = new THREE.AmbientLight(0xffffff, 2);
scene.add(ambientLight);
const topLight = new THREE.DirectionalLight(0xffffff, 2);
topLight.position.set(5, 10, 5);
scene.add(topLight);

const loader = new THREE.GLTFLoader();
let pivotGroup = null;

// FUNKTION: PROJEKT WECHSELN
function changeProject(index) {
    const data = projectData[index];
    if(!data) return;

    // UI Updates
    document.getElementById("main-title").innerText = data.mainTitle;
    document.getElementById("title-left").innerText = data.lTitle;
    document.getElementById("desc-left").innerText = data.lDesc;
    document.getElementById("title-right").innerText = data.rTitle;
    document.getElementById("desc-right").innerText = data.rDesc;
    document.getElementById("final-pcb").src = data.image;

    // Aktiven Button markieren
    document.querySelectorAll(".project-nav button").forEach((btn, i) => {
        btn.classList.toggle("active", i === index);
    });

    // 3D Modell laden
    if (pivotGroup) scene.remove(pivotGroup);
    
    loader.load(data.model, function (gltf) {
        pivotGroup = new THREE.Group();
        const tiltGroup = new THREE.Group();
        pivotGroup.add(tiltGroup);
        
        const model = gltf.scene;
        const box = new THREE.Box3().setFromObject(model);
        const center = new THREE.Vector3();
        box.getCenter(center);
        
        model.position.set(-center.x, -center.y, -center.z);
        tiltGroup.add(model);
        
        tiltGroup.rotation.y = Math.PI / 4;
        tiltGroup.rotation.z = Math.PI / 10;
        
        const size = box.getSize(new THREE.Vector3());
        const scale = 3.5 / Math.max(size.x, size.y, size.z);
        pivotGroup.scale.set(scale, scale, scale);
        
        scene.add(pivotGroup);

        // Scroll-Rotation neu binden
        gsap.to(pivotGroup.rotation, {
            x: Math.PI * 4,
            scrollTrigger: { trigger: "body", start: "top top", end: "bottom bottom", scrub: 1 }
        });
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// GSAP SCROLL-ANIMATIONEN (GLOBAL)
gsap.to("#text-left", {
    opacity: 1, x: 20,
    scrollTrigger: { trigger: "body", start: "8% top", end: "18% top", scrub: true }
});

gsap.to("#text-right", {
    opacity: 1, x: -20,
    scrollTrigger: { trigger: "body", start: "18% top", end: "28% top", scrub: true }
});

gsap.to("#canvas", {
    opacity: 0,
    scrollTrigger: { trigger: "body", start: "35% top", end: "50% top", scrub: true }
});

gsap.fromTo("#final-pcb", 
    { opacity: 0, scale: 0.7, y: 50 },
    { opacity: 1, scale: 1, y: 0, scrollTrigger: { trigger: "body", start: "35% top", end: "55% top", scrub: true } }
);

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start mit Projekt 0
changeProject(0);