import * as THREE from 'three';
import * as RAPIER from '@dimforge/rapier2d';
import { initPhysics } from './physics/engine.js';
import { 
    createLetterA, createLetterB, createLetterC, createLetterD, createLetterE, 
    createLetterF, createLetterG, createLetterH, createLetterI, createLetterJ,
    createLetterK, createLetterL, createLetterM, createLetterN, createLetterO, 
    createLetterP, createLetterQ, createLetterR, createLetterS, createLetterT,
    createLetterU, createLetterV, createLetterW, createLetterX, createLetterY, createLetterZ
} from './physics/letters.js';
import { setupUI } from './ui/overlay.js';
import { InferenceManager } from './ml/inference.js';
import { getLLMResponse } from './ml/chatbot.js';

let world;
let scene, camera, renderer;
const agents = []; 
const STORAGE_KEY = 'v11';
let currentWord = '';

let leftWall, rightWall;
let targetFrustumSize = 15; 
let currentFrustumSize = 15;

let showGhosts = false;

let dotCount = 0;
let lastDotUpdate = 0;
let isAiThinking = false;

const INITIAL_HEIGHT = window.innerHeight;
const INITIAL_WIDTH = window.innerWidth;

const STATE = {
    SEARCH: 'SEARCH',
    SETTLE: 'SETTLE',
    LOCK: 'LOCK'
};

const ghostMaterial = new THREE.MeshBasicMaterial({ 
    color: '#1a1a1a', 
    transparent: true, 
    opacity: 0.1, 
    wireframe: true 
});

window.toggleGhosts = function() {
    showGhosts = !showGhosts;
    scene.traverse(child => {
        if (child.name === "ghost") {
            child.visible = showGhosts;
        }
    });
    console.log(`Ghosts ${showGhosts ? 'ON' : 'OFF'}`);
};

window.musclesEnabled = false;

window.toggleMuscles = function() {
    window.musclesEnabled = !window.musclesEnabled;
    
    agents.forEach(agent => {
        if (agent.mesh) {
            agent.mesh.traverse(child => {
                if (child.name === "muscleTag") {
                    child.visible = window.musclesEnabled;
                }
            });
        }
    });
    
    return `Muscles are now: ${window.musclesEnabled ? 'VISIBLE' : 'HIDDEN'}`;
};

function initVisuals() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color('#fafafa');
    const canvas = document.querySelector('#canvas-3d');
    if (!canvas) return;
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const frustumSize = 15; 
    const aspect = window.innerWidth / window.innerHeight;
    camera = new THREE.OrthographicCamera(
        (frustumSize * aspect) / -2, (frustumSize * aspect) / 2, 
        frustumSize / 2, frustumSize / -2, 0.1, 1000
    );
    camera.position.set(0, 0, 10);
    camera.lookAt(0, 0, 0);
    const grid = new THREE.GridHelper(1000, 1000, '#e8e8e8', '#f0f0f0');
    grid.rotation.x = Math.PI / 2;
    grid.position.set(0, 0, -0.5);
    scene.add(grid);
    scene.add(new THREE.AmbientLight('#ffffff', 1.0));
}

function updatePhysicsWalls() {
    if (leftWall) world.removeCollider(leftWall);
    if (rightWall) world.removeCollider(rightWall);

    const aspect = window.innerWidth / window.innerHeight;
    const wallX = (currentFrustumSize * aspect) / 2;

    leftWall = world.createCollider(
        RAPIER.ColliderDesc.cuboid(0.5, 100).setTranslation(-wallX - 0.5, 5)
    );
    rightWall = world.createCollider(
        RAPIER.ColliderDesc.cuboid(0.5, 100).setTranslation(wallX + 0.5, 5)
    );
}

function setCameraTarget(word) {
    if (!word) return;

    const letterMetrics = { 
        'a': 1.4, 'b': 1.4, 'c': 1.2, 'd': 1.4, 'e': 1.2, 
        'f': 1.4, 'g': 1.4, 'h': 1.4, 'i': 0.4, 'j': 0.4,
        'k': 1.0, 'l': 0.4, 'm': 2.4, 'n': 1.4, 'o': 1.2, 
        'p': 1.4, 'q': 1.4, 'r': 1.0, 's': 1.4, 't': 1.0, 
        'u': 1.2, 'v': 1.4, 'w': 2.4, 'x': 1.4, 'y': 1.2, 'z': 1.4
    };
    const spacing = 0.4;
    let totalWordWidth = word.split('').reduce((acc, char) => acc + (letterMetrics[char] || 1.4) + spacing, -spacing);

    const isMobile = window.innerWidth < 600;
    const padding = isMobile ? 12 : 6; 
    const requiredVisibleWidth = totalWordWidth + padding;

    const aspect = window.innerWidth / window.innerHeight;
    
    let calculatedFrustum = requiredVisibleWidth / aspect;

    const minFrustum = isMobile ? 25 : 12; 
    
    targetFrustumSize = Math.max(minFrustum, calculatedFrustum);
    
    currentWord = word; 
}

window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Keyboard Ignore
    const heightDiff = Math.abs(height - INITIAL_HEIGHT);
    const isKeyboardResize = heightDiff > 150 && width === INITIAL_WIDTH;

    if (isKeyboardResize) {
        return;
    }
    
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    if (currentWord) {
        setCameraTarget(currentWord);
    }
});

function spawnWord(word) {
    setCameraTarget(word);

    const objectsToRemove = [];
    scene.traverse(child => { 
        if (child.name === "ghost" || child.name === "label" || child.name === "trail") objectsToRemove.push(child); 
    });
    objectsToRemove.forEach(obj => { scene.remove(obj); });
    agents.forEach(agent => {
        if (agent.mesh) scene.remove(agent.mesh);
        if (agent.body) world.removeRigidBody(agent.body);
    });
    agents.length = 0;

    const letterMetrics = { 
        'a': 1.4, 'b': 1.4, 'c': 1.2, 'd': 1.4, 'e': 1.2, 
        'f': 1.4, 'g': 1.4, 'h': 1.4, 'i': 0.4, 'j': 0.4,
        'k': 1.0, 'l': 0.4, 'm': 2.4, 'n': 1.4, 'o': 1.2, 
        'p': 1.4, 'q': 1.4, 'r': 1.0, 's': 1.4, 't': 1.0, 
        'u': 1.2, 'v': 1.4, 'w': 2.4, 'x': 1.4, 'y': 1.2, 'z': 1.4};
    const spacing = 0.4;
    let totalWordWidth = word.split('').reduce((acc, char) => acc + (letterMetrics[char] || 1.4) + spacing, -spacing);
    let currentX = -(totalWordWidth / 2);

    for (let i = 0; i < word.length; i++) {
        const char = word[i];
        const w = letterMetrics[char] || 1.4;
        const targetX = currentX + (w / 2);
        
        // Randomize x
        const spawnX = (Math.random() - 0.5) * (targetFrustumSize * (window.innerWidth / window.innerHeight) * 0.8);
        
        const agent = createCharAgent(char, i, targetX, spawnX); 
        
        if (agent && agent.body) {
            // Random rotation
            const randomRotation = (Math.random() - 0.5) * Math.PI; 
            agent.body.setRotation(randomRotation, true);
        }

        if (agent) agents.push(agent);
        currentX += w + spacing;
    }
}

function createCharAgent(char, index, targetX, spawnX) {
    const pos = { x: spawnX, y: 8 };
    let agent;
    
    const ghostOffsets = {
        'f': -0.6, 'g': -0.7, 'j': -0.9,
        'i': -0.1, 'x': -0.05,
        'l': 0.3, 't': 0.1,
        'h': -0.7, 'm': -0.7, 'n': -0.7, 'r': -0.7
    };

    // Kerning
    const spacingOffsets = {
        'j': -0.35, 
        'r': 0.1
    };

    const charType = char.toLowerCase();
    const yOffset = ghostOffsets[charType] || 0;
    const finalTargetY = 0.7 + yOffset;
    const xOffset = spacingOffsets[charType] || 0;
    const adjustedTargetX = targetX + xOffset;

    if (char === 'a') agent = createLetterA(scene, world, pos);
    else if (char === 'b') agent = createLetterB(scene, world, pos);
    else if (char === 'c') agent = createLetterC(scene, world, pos);
    else if (char === 'd') agent = createLetterD(scene, world, pos);
    else if (char === 'e') agent = createLetterE(scene, world, pos);
    else if (char === 'f') agent = createLetterF(scene, world, pos);
    else if (char === 'g') agent = createLetterG(scene, world, pos);
    else if (char === 'h') agent = createLetterH(scene, world, pos);
    else if (char === 'i') agent = createLetterI(scene, world, pos);
    else if (char === 'j') agent = createLetterJ(scene, world, pos);
    else if (char === 'k') agent = createLetterK(scene, world, pos);
    else if (char === 'l') agent = createLetterL(scene, world, pos);
    else if (char === 'm') agent = createLetterM(scene, world, pos);
    else if (char === 'n') agent = createLetterN(scene, world, pos);
    else if (char === 'o') agent = createLetterO(scene, world, pos);
    else if (char === 'p') agent = createLetterP(scene, world, pos);
    else if (char === 'q') agent = createLetterQ(scene, world, pos);
    else if (char === 'r') agent = createLetterR(scene, world, pos);
    else if (char === 's') agent = createLetterS(scene, world, pos);
    else if (char === 't') agent = createLetterT(scene, world, pos);
    else if (char === 'u') agent = createLetterU(scene, world, pos);
    else if (char === 'v') agent = createLetterV(scene, world, pos);
    else if (char === 'w') agent = createLetterW(scene, world, pos);
    else if (char === 'x') agent = createLetterX(scene, world, pos);
    else if (char === 'y') agent = createLetterY(scene, world, pos);
    else if (char === 'z') agent = createLetterZ(scene, world, pos);

    if (agent) {
        agent.targetX = adjustedTargetX;
        agent.targetY = finalTargetY;
        agent.lastDist = Math.abs(targetX - spawnX);
        agent.name = char + "_" + index;
        agent.totalReward = 0;
        agent.frameCount = 0;
        agent.checkTimer = 0;

        const savedWeights = localStorage.getItem(`${STORAGE_KEY}_${agent.name}`) || localStorage.getItem(`${STORAGE_KEY}_${char}`);
        if (savedWeights && agent.brain) {
            try { agent.brain.weights.set(new Float32Array(JSON.parse(savedWeights))); } catch (e) {}
        }

        // Ghost
        const ghostGroup = new THREE.Group();
        ghostGroup.name = "ghost";
        const fullGhostMesh = new THREE.Group(); 
        ghostGroup.visible = showGhosts;

        agent.mesh.traverse(child => {
            if (child.isMesh && child.name !== "label") {
                const c = child.clone();
                c.material = ghostMaterial;
                fullGhostMesh.add(c);
            }
        });
        
        ghostGroup.add(fullGhostMesh);
        
        ghostGroup.position.set(adjustedTargetX, finalTargetY, -0.05);
        scene.add(ghostGroup);
        
        agent.ghost = ghostGroup;
    }
    return agent;
}

async function start() {
    initVisuals();
    try {
        const response = await fetch('/letter_rl/slide_policy_weights.json');
        if (!response.ok) throw new Error("File JSON tidak ditemukan!");
        const weightsData = await response.json();
        const inference = new InferenceManager(weightsData);

        world = await initPhysics();

        setupUI(
            // (word) => { spawnWord(word); }, 
            async (word) => {
                isAiThinking = true;
                const aiAnswer = await getLLMResponse(word);
                isAiThinking = false;
                if (aiAnswer) {
                    console.log("LLM Answer:", aiAnswer);
                    spawnWord(aiAnswer); 
                }
            },
            () => { 
                agents.forEach(agent => {
                    if (agent.mesh) scene.remove(agent.mesh);
                    if (agent.body) world.removeRigidBody(agent.body);
                    if (agent.trails) agent.trails.forEach(t => scene.remove(t.mesh));
                });
                agents.length = 0;
                const ghosts = [];
                scene.traverse(child => { if (child.name === "ghost" || child.name == "trail") ghosts.push(child); });
                ghosts.forEach(g => scene.remove(g));
            }
        );

        const runAnimate = () => {
            requestAnimationFrame(runAnimate);

            const now = Date.now();
            if (now - lastDotUpdate > 300) {
                dotCount = (dotCount + 1) % 4;
                lastDotUpdate = now;
            }
            const dots = ".".repeat(dotCount);
            
            if (world && typeof RAPIER !== 'undefined') {
                const aspect = window.innerWidth / window.innerHeight;
                currentFrustumSize += (targetFrustumSize - currentFrustumSize) * 0.15;

                camera.left = (currentFrustumSize * aspect) / -2;
                camera.right = (currentFrustumSize * aspect) / 2;
                camera.top = currentFrustumSize / 2;
                camera.bottom = currentFrustumSize / -2;
                camera.updateProjectionMatrix();

                updatePhysicsWalls();
                world.step();

                // Perfecting the Typography
                agents.forEach((agent) => {
                    if (!agent || !agent.body) return;

                    const bodyPos = agent.body.translation();
                    const dist = Math.abs(agent.targetX - bodyPos.x);
                    const vel = agent.body.linvel();
                    // const angVel = agent.body.angvel();
                    const rot = agent.body.rotation();
                    const charType = agent.name.split('_')[0];
                    const dampRot = ['c', 'e', 'l', 'o', 'g', 'u', 'y'].includes(charType);

                    if (!agent.state) agent.state = STATE.SEARCH;

                    // State
                    if (agent.state === STATE.SEARCH && dist < 0.2) {
                        agent.state = STATE.SETTLE;
                    }

                    // Lock
                    if (agent.state === STATE.LOCK) {
                        if (agent.body.bodyType() !== RAPIER.RigidBodyType.KinematicPositionBased) {
                            const currentPos = agent.body.translation();
                            const currentRot = agent.body.rotation();

                            agent.body.setBodyType(RAPIER.RigidBodyType.KinematicPositionBased, true);
                            
                            agent.body.setTranslation({ x: currentPos.x, y: currentPos.y }, true);
                            agent.body.setRotation(currentRot, true);

                            agent.mesh.traverse(child => {
                                if (child.isMesh && child.material.emissive) {
                                    child.material.emissiveIntensity = 0;
                                }
                            });
                        }
                        return;
                    }

                    // Dynamic Physics
                    // 1. Soft Braking for Unstable Rotations
                    if (dampRot && dist < 0.6) {
                        const proximity = 1.0 - (dist / 0.6);
                        
                        const dynamicADamping = 2.0 + (proximity * 15.0); 
                        const dynamicLDamping = 0.5 + (proximity * 5.0);
                        agent.body.setAngularDamping(dynamicADamping);
                        agent.body.setLinearDamping(dynamicLDamping);

                        const currentAV = agent.body.angvel();
                        const maxAllowedRotation = 4.0 * (1.0 - proximity * 0.8);
                        
                        if (Math.abs(currentAV) > maxAllowedRotation) {
                            const clampedAV = Math.sign(currentAV) * maxAllowedRotation;
                            agent.body.setAngvel(clampedAV, true);
                        }

                        if (dist < 0.2 && Math.abs(currentAV) < 1.0) {
                            const uprightTorque = -rot * 2.0 * proximity;
                            agent.body.applyTorqueImpulse(uprightTorque, true);
                        }
                    } else {
                        agent.body.setAngularDamping(2.0);
                        agent.body.setLinearDamping(0.5);
                    }

                    // Orientation Recovery
                    const normalizedRot = Math.atan2(Math.sin(rot), Math.cos(rot));
                    const isFlipped = Math.abs(normalizedRot) > 0.8; // > 45 deg

                    const isStuck = Math.abs(vel.x) < 0.5 && Math.abs(vel.y) < 0.5;

                    if (isFlipped && isStuck && agent.state !== STATE.LOCK) {
                        agent.recoveryTimer = (agent.recoveryTimer || 0) + 16.6;

                        if (agent.recoveryTimer > 3000) {
                            console.log(`!!! KICKING ${agent.name} !!!`);
                            
                            // Linear push
                            const jumpX = (Math.random() - 0.5) * 10;
                            const jumpY = 5;
                            agent.body.setLinvel({ x: jumpX, y: jumpY }, true);

                            // Rotation push
                            const spinForce = (Math.random() - 0.5) * 30; 
                            agent.body.setAngvel(spinForce, true);
                            
                            agent.recoveryTimer = 0;
                        }
                    } else {
                        agent.recoveryTimer = 0;
                    }

                    // Sliding Assist
                    const isSpecial = ['k', 'j'].includes(charType);
                    const isFar = dist < 5.0 && dist > 0.2;

                    agent.posCheckTimer = (agent.posCheckTimer || 0) + 16.6;
                    if (agent.posCheckTimer > 500) {
                        const currentX = bodyPos.x;
                        const moveDist = Math.abs(currentX - (agent.lastX || currentX));
                        
                        if (moveDist < 0.02) {
                            agent.isStuckMoving = true;
                        } else {
                            const threshold = isSpecial ? 0.04 : 0.05; 
                            agent.isStuckMoving = moveDist < threshold;
                            agent.lastX = currentX;
                        }
                        
                        agent.posCheckTimer = 0;
                    }

                    if (isFar && agent.isStuckMoving && agent.state !== STATE.LOCK) {
                        agent.slideTimer = (agent.slideTimer || 0) + 16.6;

                        const waitTime = isSpecial ? 1000 : 3000;

                        if (agent.slideTimer > waitTime) {
                            const direction = agent.targetX > bodyPos.x ? 1 : -1;
                            const adaptivePower = Math.max(1.0, dist * 1.5);
                            
                            const jumpY = isSpecial ? 2.5 : 1.5;

                            console.warn(`[FORCE PUSH] Kicking ${agent.name}`);
                            agent.body.setLinvel({ x: direction * adaptivePower, y: jumpY }, true);
                            
                            agent.slideTimer = 0;
                            agent.isStuckMoving = false; 
                        }
                    } else {
                        if (agent.slideTimer > 0) agent.slideTimer -= 10;
                    }

                    // Visual Debugging
                    const rotProgress = (agent.recoveryTimer || 0) / 3000;
                    const slideProgress = (agent.slideTimer || 0) / 3000;
                    const totalProgress = Math.max(rotProgress, slideProgress);

                    agent.mesh.traverse(child => {
                        if (child.isMesh && child.material.emissive) {
                            if (totalProgress > 0) {
                                child.material.emissive.setRGB(totalProgress, 0, 0);
                                child.material.emissiveIntensity = totalProgress * 1.5; 
                            } else {
                                child.material.emissiveIntensity = 0;
                            }
                        }
                    });

                    const isStable = dist < 0.2 && 
                                    Math.abs(vel.x) < 0.1 && 
                                    Math.abs(rot) < 0.1;

                    if (agent.state === STATE.SETTLE && isStable) {
                        agent.settleTimer = (agent.settleTimer || 0) + 16.6;
                        if (agent.settleTimer > 1000) {
                            agent.state = STATE.LOCK;
                        }
                    }
                });

                const activeAgents = agents.filter(a => a.state !== STATE.LOCK);
                if (activeAgents.length > 0) {
                    inference.update(activeAgents, world);
                }

                agents.forEach((agent) => {
                    if (!agent.mesh || !agent.body) return;
                    const bodyPos = agent.body.translation();
                    agent.mesh.position.set(bodyPos.x, bodyPos.y, 0);
                    agent.mesh.rotation.z = agent.body.rotation();
                    const vel = agent.body.linvel();
                    const speedY = vel.y;
                    const speed = Math.sqrt(vel.x ** 2 + vel.y ** 2);

                    // Squash n Stretch
                    const stretch = 0.1;

                    if (agent.state !== STATE.LOCK) {
                        // Makin kencang jatuh/loncat, makin lonjong
                        const squashY = 1.0 + (Math.abs(speedY * 0.1) * stretch);
                        const squashX = 1.0 / squashY;
                        
                        agent.mesh.scale.set(squashX, squashY, 1.0);
                    } else {
                        agent.mesh.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
                    }

                    // Motion Trail
                    if (!agent.trails) agent.trails = [];
                    agent.trailTimer = (agent.trailTimer || 0) + 16.6;

                    if (speed > 5.0 && agent.state !== STATE.LOCK && agent.trailTimer > 60) {
                        const ghost = agent.mesh.clone();
                        
                        ghost.traverse(child => {
                            if (child.isMesh) {
                                child.material = child.material.clone();
                                child.material.transparent = true;
                                child.material.opacity = 0.3;
                                child.material.depthWrite = false;
                            }
                        });

                        ghost.name = "trail"
                        
                        scene.add(ghost);
                        agent.trails.push({ mesh: ghost, life: 1.0 });
                        agent.trailTimer = 0;
                    }

                    for (let i = agent.trails.length - 1; i >= 0; i--) {
                        const t = agent.trails[i];
                        t.life -= 0.04;
                        
                        if (t.life <= 0) {
                            scene.remove(t.mesh);
                            t.mesh.traverse(c => { 
                                if(c.isMesh) {
                                    c.geometry.dispose(); 
                                    c.material.dispose(); 
                                }
                            });
                            agent.trails.splice(i, 1);
                        } else {
                            t.mesh.traverse(child => {
                                if (child.isMesh) child.material.opacity = t.life * 0.2;
                            });
                            t.mesh.scale.multiplyScalar(0.98); 
                        }
                    }
                });

                const inputElement = document.querySelector('#word-input');
                const statusElement = document.querySelector('#status');

                if (inputElement && statusElement) {
                    const allLocked = agents.every(a => a.state === STATE.LOCK);
                    const hasAgents = agents.length > 0;

                    if (isAiThinking) {
                        inputElement.disabled = true;
                        inputElement.placeholder = `let it speak...`;
                        statusElement.innerHTML = `status: <span style="color: #e67e22;">thinking${dots}</span>`;

                    } else if (!allLocked && hasAgents) {
                        inputElement.disabled = true;
                        statusElement.innerHTML = `status: <span style="color: #3498db;">calibrating${dots}</span>`;

                    } else if (allLocked && hasAgents) {
                        inputElement.disabled = false;
                        inputElement.placeholder = "type something...";
                        statusElement.innerHTML = `status: <span style="color: #2ecc71;">active</span>`;

                    } else {
                        inputElement.disabled = false;
                        statusElement.innerHTML = `status: idle`;
                    }
                }
            }
            renderer.render(scene, camera);
        };
        runAnimate();

    } catch (e) { 
        console.error("Gagal inisialisasi PPO:", e); 
    }
}

start();