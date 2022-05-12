
import {
    Clock,
    Group,
    Line,
    LineBasicMaterial,
    Points, TextureLoader,
    PointsMaterial,
    MathUtils,
    VertexColors,
    Float32BufferAttribute,
    BufferGeometry,
    PerspectiveCamera,
    Scene,
    WebGLRenderer
} from 'three';
import { InteractionManager } from "three.interactive";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import '../style.css';
import * as data from './stromae.json';
const DOMAIN_URL = "https://stromae-douglas.netlify.app/";
var stromae = data.stromae;
class App {

    // Constructor method
    constructor() {
        this.init();
    }

    init() {

        /* -----------------------------------------------------------------------------------------------------------
        ---------------------------------------------INIT----------------------------------------------------------
        -------------------------------------------------------------------------------------------------------- */
        var renderer = new WebGLRenderer({
            antialias: true,
            alpha: true,
        });

        renderer.clearColor(0x000000, 0)
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        document.body.appendChild(renderer.domElement);

        const textureLoader = new TextureLoader();
        const graphTexture = textureLoader.load("/stromae.png");
        const scene = new Scene();


        const camera = new PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.01,
            1000
        );
        camera.position.z = 2;
        camera.position.y = 0.5;
        camera.position.x = 0.5;
        scene.add(camera);

        const distance = 6;
        let geometry = "";
        let interactionManager = new InteractionManager(
            renderer,
            camera,
            renderer.domElement
        );

        /* -----------------------------------------------------------------------------------------------------------
        ---------------------------------------------POINTS--------------------------------------------------------
        -------------------------------------------------------------------------------------------------------- */
        //window.localStorage.setItem('last_track', '');

        for (var i = 0; i < stromae.length; i++) {
            var obj = stromae[i];
            var popularite = obj.pop;
            var xP, yP, zP = i;
            var id = obj.id;
            const points = new Float32Array([xP, yP, zP]);
            const colors = new Float32Array([xP, yP, zP]);
            for (let a = 0; a < points.length; a++) {
                points[a] = MathUtils.randFloatSpread(distance * 2);
                colors[a] = Math.random() * 0.5 + 0.5;
            }

            geometry = new BufferGeometry();
            geometry.setAttribute('position', new Float32BufferAttribute(points, 3));
            geometry.setAttribute('color', new Float32BufferAttribute(colors, 3));
            const pointMaterial = new PointsMaterial({
                size: popularite * 0.3,
                vertexColors: VertexColors,
                map: graphTexture,
                alphaTest: 0.5,
                transparent: false,
            });

            const pointsObject = new Points(geometry, pointMaterial);
            pointsObject.name = "Track_" + id;
            scene.add(pointsObject);
            const group = new Group();
            group.add(pointsObject);

            const lineMaterial = new LineBasicMaterial({
                color: 0xE0E0E0,
                opacity: 0.01,
                depthTest: false,
                depthWrite: false,
            });

            const lineObject = new Line(geometry, lineMaterial);
            group.add(lineObject);
            scene.add(group);

            pointsObject.addEventListener('click', function (event) {
                event.stopPropagation();
                
                var compt = (pointsObject.name.substr(6) - 1);
                console.log(stromae[compt].track);
                var audio = new Audio(DOMAIN_URL + "/dist/assets/media"+stromae[compt].url);
                //console.log(audio)
                audio.play();
            })

            interactionManager.add(pointsObject);
        }

        /* -----------------------------------------------------------------------------------------------------------
        ---------------------------------------------RENDERER------------------------------------------------------
        -------------------------------------------------------------------------------------------------------- */

        const controls = new OrbitControls(camera, renderer.domElement);
        const clock = new Clock();

        function tick() {
            const time = clock.getElapsedTime();
            renderer.render(scene, camera);
            // controls.update();
            requestAnimationFrame(tick);
        }

        tick();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        })
    }
}
new App();

function OpenModal() {
    let element = document.getElementById('overlay');
    element.style.display = 'block';
}

document.addEventListener("DOMContentLoaded", function () {
    var urlTrack = window.localStorage.getItem('last_track');
    //console.log(urlTrack)
    function Play() {
        var audio = new Audio(urlTrack);
        audio.play();

    }
    var state = "paused";
    var pause = document.querySelector("#pause");
    pause.addEventListener('click', function () {
        if (state == 'paused') {
            state = "playing";
            let circle = document.querySelector("#circle");
            circle.setAttribute("class", "play");
            let from = document.querySelector("#from_pause_to_play");
            from.beginElement();

        } else {
            state = "paused";
            let circle = document.querySelector("#circle");
            circle.setAttribute("class", "");
            let from = document.querySelector("#from_pause_to_play");
            from.beginElement();
        }
    });
});