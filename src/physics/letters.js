import * as THREE from 'three';
import * as RAPIER from '@dimforge/rapier2d';

const COLOR = '#1a1a1a';
const AGENT_COLLISION_GROUP = 0x00010002; 

const createSolidBody = (world, pos, angularDamping = 1.5, linearDamping = 0.5) => {
    return world.createRigidBody(
        RAPIER.RigidBodyDesc.dynamic()
            .setTranslation(pos.x, pos.y)
            .setAngularDamping(angularDamping) 
            .setLinearDamping(linearDamping) 
            .setCanSleep(false)
            .setCcdEnabled(true)
    );
};

const addCollider = (world, desc, body) => {
    return world.createCollider(desc.setCollisionGroups(AGENT_COLLISION_GROUP), body);
};

// Visual Debugger: Red Dot for "Muscles"
const createMuscleTag = (group, x, y) => {
    const dot = new THREE.Mesh(
        new THREE.SphereGeometry(0.06), 
        new THREE.MeshBasicMaterial({ color: '#ff0000', depthTest: false })
    );
    dot.position.set(x, y, 0.2);
    dot.renderOrder = 999;
    dot.name = "muscleTag";

    dot.visible = window.musclesEnabled !== false;
    
    group.add(dot);
};

export function createLetterA(scene, world, pos) {
    const body = createSolidBody(world, pos, 1.0);
    addCollider(world, RAPIER.ColliderDesc.ball(0.7).setFriction(0.7), body);
    addCollider(world, RAPIER.ColliderDesc.cuboid(0.2, 0.7).setTranslation(0.5, 0), body);
    const group = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({ color: COLOR });
    const shape = new THREE.Shape();
    shape.absarc(0, 0, 0.7, 0, Math.PI * 2, false);
    const hole = new THREE.Path(); hole.absarc(0, 0, 0.3, 0, Math.PI * 2, true);
    shape.holes.push(hole);
    group.add(new THREE.Mesh(new THREE.ShapeGeometry(shape), mat));
    const stem = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 1.4), mat);
    stem.position.set(0.5, 0, 0);
    group.add(stem);
    scene.add(group);

    const muscles = [
        {x: -0.7, y: 0}, {x: 0, y: 0.7}, {x: 0, y: -0.7}, // Round edges
        {x: 0.7, y: 0.7}, {x: 0.7, y: -0.7}, {x: 0.3, y: -0.7} // Stem corners
    ];
    muscles.forEach(m => createMuscleTag(group, m.x, m.y));
    return { name: 'a', body, mesh: group, muscles};
}

export function createLetterB(scene, world, pos) {
    const body = createSolidBody(world, pos, 2.0);
    addCollider(world, RAPIER.ColliderDesc.ball(0.7).setFriction(0.8), body);
    addCollider(world, RAPIER.ColliderDesc.cuboid(0.2, 1.0).setTranslation(-0.5, 0.3), body);
    const group = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({ color: COLOR });
    const shape = new THREE.Shape();
    shape.absarc(0, 0, 0.7, 0, Math.PI * 2, false);
    const hole = new THREE.Path(); hole.absarc(0, 0, 0.3, 0, Math.PI * 2, true);
    shape.holes.push(hole);
    group.add(new THREE.Mesh(new THREE.ShapeGeometry(shape), mat));
    const stem = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 2.0), mat);
    stem.position.set(-0.5, 0.3, 0);
    group.add(stem);
    scene.add(group);

    const muscles = [
        {x: -0.7, y: 1.3}, {x: -0.7, y: -0.7}, {x: -0.3, y: -0.7}, // Stem corners
        {x: 0.7, y: 0}, {x: 0, y: 0.7}, {x: 0, y: -0.7} // Belly edges
    ];
    muscles.forEach(m => createMuscleTag(group, m.x, m.y));
    return { name: 'b', body, mesh: group, muscles};
}

export function createLetterC(scene, world, pos) {
    const body = createSolidBody(world, pos, 10.0);
    addCollider(world, RAPIER.ColliderDesc.ball(0.7).setFriction(0.5), body);
    const group = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({ color: COLOR, side: THREE.DoubleSide });
    const shape = new THREE.Shape();
    shape.absarc(0, 0, 0.7, 0.6, 2 * Math.PI - 0.6, false);
    shape.absarc(0, 0, 0.3, 2 * Math.PI - 0.6, 0.6, true);
    group.add(new THREE.Mesh(new THREE.ShapeGeometry(shape), mat));
    scene.add(group);

    const muscles = [
        { x: -0.7, y: 0 }, { x: 0, y: 0.7 }, { x: 0, y: -0.7 }, // Outer curve
        { x: 0.5, y: 0.5 }, { x: 0.5, y: -0.5 } // Open mouth tips
    ];
    muscles.forEach(m => createMuscleTag(group, m.x, m.y));
    return { name: 'c', body, mesh: group, muscles};
}

export function createLetterD(scene, world, pos) {
    const body = createSolidBody(world, pos, 2.0);
    addCollider(world, RAPIER.ColliderDesc.ball(0.7).setFriction(0.8), body);
    addCollider(world, RAPIER.ColliderDesc.cuboid(0.2, 1.0).setTranslation(0.5, 0.3), body);
    const group = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({ color: COLOR });
    const shape = new THREE.Shape();
    shape.absarc(0, 0, 0.7, 0, Math.PI * 2, false);
    const hole = new THREE.Path(); hole.absarc(0, 0, 0.3, 0, Math.PI * 2, true);
    shape.holes.push(hole);
    group.add(new THREE.Mesh(new THREE.ShapeGeometry(shape), mat));
    const stem = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 2.0), mat);
    stem.position.set(0.5, 0.3, 0); 
    group.add(stem);
    scene.add(group);

    const muscles = [
        { x: 0.7, y: 1.3 }, { x: 0.7, y: -0.7 }, { x: 0.3, y: -0.7 }, // Stem corners
        { x: -0.7, y: 0 }, { x: 0, y: 0.7 }, { x: 0, y: -0.7 } // Belly edges
    ];
    muscles.forEach(m => createMuscleTag(group, m.x, m.y));
    return { name: 'd', body, mesh: group, muscles};
}

export function createLetterE(scene, world, pos) {
    const body = createSolidBody(world, pos, 10.0);
    addCollider(world, RAPIER.ColliderDesc.ball(0.7).setFriction(0.5), body);
    addCollider(world, RAPIER.ColliderDesc.cuboid(0.5, 0.17).setTranslation(0.15, 0), body);
    const group = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({ color: COLOR, side: THREE.DoubleSide });
    const shape = new THREE.Shape();
    shape.absarc(0, 0, 0.7, -0.2, Math.PI * 2 - 0.7, false);
    shape.lineTo(Math.cos(Math.PI*2-0.7)*0.35, Math.sin(Math.PI*2-0.7)*0.35);
    shape.absarc(0, 0, 0.35, Math.PI * 2 - 0.7, -0.2, true);
    group.add(new THREE.Mesh(new THREE.ShapeGeometry(shape), mat));
    const bar = new THREE.Mesh(new THREE.PlaneGeometry(1.05, 0.35), mat);
    bar.position.x = 0.15;
    group.add(bar);
    scene.add(group);

    const muscles = [
        {x: -0.7, y: 0}, {x: 0, y: 0.7}, {x: 0, y: -0.7}, // Outer round
        {x: 0.6, y: 0.4}, {x: 0.6, y: -0.4}, {x: 0.7, y: 0} // Mouth and bar tip
    ];
    muscles.forEach(m => createMuscleTag(group, m.x, m.y));
    return { name: 'e', body, mesh: group, muscles};
}

export function createLetterF(scene, world, pos) {
    const body = createSolidBody(world, pos, 30.0, 30.0);
    
    addCollider(world, RAPIER.ColliderDesc.cuboid(0.2, 0.55).setTranslation(-0.15, 0.45).setFriction(1.1), body); // Stem
    addCollider(world, RAPIER.ColliderDesc.cuboid(0.3, 0.15).setTranslation(0.35, 1.15).setFriction(1.1), body); // Top bar
    addCollider(world, RAPIER.ColliderDesc.cuboid(0.4, 0.2).setTranslation(0.25, 0.3).setFriction(1.1), body); // Mid bar

    const group = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({ color: COLOR, side: THREE.DoubleSide });

    const fShape = new THREE.Shape();

    fShape.moveTo(0, 0); 
    fShape.lineTo(0.4, 0);
    fShape.lineTo(0.4, 1.3); 
    fShape.bezierCurveTo(0.4, 1.6, 0.4, 1.6, 0.7, 1.6);
    fShape.lineTo(1.0, 1.6);
    fShape.lineTo(1.0, 2.0);
    fShape.lineTo(0.6, 2.0);
    fShape.bezierCurveTo(0, 2.0, 0, 2.0, 0, 1.4);
    fShape.lineTo(0, 0);

    const midBarShape = new THREE.Shape();
    midBarShape.moveTo(0, 0.8);
    midBarShape.lineTo(1.0, 0.8);
    midBarShape.lineTo(1.0, 1.2);
    midBarShape.lineTo(0, 1.2);
    midBarShape.lineTo(0, 0.8);

    const fGeom = new THREE.ShapeGeometry([fShape, midBarShape]);
    
    const fMesh = new THREE.Mesh(fGeom, mat);
    fMesh.position.set(-0.35, -0.7, 0); 
    group.add(fMesh);
    scene.add(group);

    const muscles = [
        { x: -0.3, y: -0.7 }, { x: 0.1, y: -0.7 },  // Bottom
        { x: 0.6, y: 1.3 }, { x: -0.3, y: 1.3 },   // Top Curve
        { x: 0.6, y: 0.5 }, { x: 0.6, y: 0.1 }     // Mid Bar
    ];

    muscles.forEach(m => createMuscleTag(group, m.x, m.y));
    return { name: 'f', body, mesh: group, muscles };
}

export function createLetterG(scene, world, pos) {
    const body = createSolidBody(world, pos, 10.0);
    addCollider(world, RAPIER.ColliderDesc.ball(0.7).setTranslation(0, 0.7).setFriction(0.5), body);
    const group = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({ color: COLOR, side: THREE.DoubleSide });
    const ringShape = new THREE.Shape();
    ringShape.absarc(0, 0.7, 0.7, 0, Math.PI * 2, false);
    const hole = new THREE.Path(); hole.absarc(0, 0.7, 0.3, 0, Math.PI * 2, true);
    ringShape.holes.push(hole);
    group.add(new THREE.Mesh(new THREE.ShapeGeometry(ringShape), mat));
    const tailShape = new THREE.Shape();
    tailShape.moveTo(0.3, 0.7); tailShape.lineTo(0.7, 0.7);
    tailShape.lineTo(0.7, -0.3); tailShape.quadraticCurveTo(0.7, -0.7, 0.3, -0.7);
    tailShape.lineTo(-0.4, -0.7); tailShape.quadraticCurveTo(-0.8, -0.7, -0.8, -0.3);
    tailShape.lineTo(-0.8, -0.3); tailShape.lineTo(-0.4, -0.3); tailShape.lineTo(0.3, -0.3);
    tailShape.lineTo(0.3, 0.7);
    group.add(new THREE.Mesh(new THREE.ShapeGeometry(tailShape), mat));
    scene.add(group);

    const muscles = [
        { x: 0, y: 1.4 }, { x: -0.7, y: 0.7 }, { x: 0.7, y: 0.7 }, // Ring edges
        { x: 0.7, y: -0.7 }, { x: -0.8, y: -0.7 }, { x: -0.8, y: -0.3 } // Tail corners
    ];
    muscles.forEach(m => createMuscleTag(group, m.x, m.y));
    return { name: 'g', body, mesh: group, muscles};
}

export function createLetterH(scene, world, pos) {
    const body = createSolidBody(world, pos, 3.0);
    addCollider(world, RAPIER.ColliderDesc.ball(0.7).setTranslation(0, 0.7).setFriction(0.8), body);
    addCollider(world, RAPIER.ColliderDesc.cuboid(0.2, 0.35).setTranslation(0.5, 0.35), body);
    addCollider(world, RAPIER.ColliderDesc.cuboid(0.2, 1.0).setTranslation(-0.5, 1.0), body);
    const group = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({ color: COLOR, side: THREE.DoubleSide });
    const nShape = new THREE.Shape();
    nShape.moveTo(-0.7, 0); nShape.lineTo(-0.7, 0.7);
    nShape.absarc(0, 0.7, 0.7, Math.PI, 0, true);
    nShape.lineTo(0.7, 0); nShape.lineTo(-0.7, 0);
    const hole = new THREE.Path();
    hole.moveTo(-0.3, 0); hole.lineTo(0.3, 0); hole.lineTo(0.3, 0.7);
    hole.absarc(0, 0.7, 0.3, 0, Math.PI, false); hole.lineTo(-0.3, 0);
    nShape.holes.push(hole);
    const stem = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 1.3), mat);
    stem.position.set(-0.5, 1.35, 0); 
    group.add(new THREE.Mesh(new THREE.ShapeGeometry(nShape), mat), stem);
    scene.add(group);

    const muscles = [
        {x: -0.7, y: 0}, {x: -0.3, y: 0}, {x: 0.3, y: 0}, {x: 0.7, y: 0}, // Base feet corners
        {x: -0.7, y: 2.0}, {x: -0.3, y: 2.0}, {x: 0, y: 1.4} // Top stem and arch
    ];
    muscles.forEach(m => createMuscleTag(group, m.x, m.y));
    return { name: 'h', body, mesh: group, muscles};
}

export function createLetterI(scene, world, pos) {
    const body = createSolidBody(world, pos, 2.5); 

    addCollider(world, RAPIER.ColliderDesc.cuboid(0.2, 0.35).setTranslation(0, -0.25).setDensity(10.0).setFriction(1.5), body); // Bottom stem (weighted)
    addCollider(world, RAPIER.ColliderDesc.cuboid(0.2, 0.35).setTranslation(0, 0.45).setDensity(0.5), body); // Upper stem
    addCollider(world, RAPIER.ColliderDesc.cuboid(0.2, 0.2).setTranslation(0, 1.2).setDensity(0.1), body); // Dot

    const group = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({ color: COLOR, side: THREE.DoubleSide });

    const stem = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 1.4), mat);
    stem.position.y = 0.1;
    
    const dot = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.4), mat);
    dot.position.y = 1.2;
    
    group.add(stem, dot);
    scene.add(group);

    const muscles = [
        {x: -0.2, y: -0.6}, {x: 0.2, y: -0.6}, // Bottom
        {x: -0.2, y: 1.4}, {x: 0.2, y: 1.4}    // Dot
    ];
    muscles.forEach(m => createMuscleTag(group, m.x, m.y));

    return { name: 'i', body, mesh: group, muscles};
}

export function createLetterJ(scene, world, pos) {
    const body = createSolidBody(world, pos, 10.0, 5.0);

    addCollider(world, RAPIER.ColliderDesc.cuboid(0.2, 0.2).setTranslation(0.3, 0.4).setDensity(35.0).setFriction(1.2), body); // Bottom stem (weighted)
    addCollider(world, RAPIER.ColliderDesc.cuboid(0.2, 0.5).setTranslation(0.3, 1.1).setDensity(5.0).setFriction(1.2), body); // Upper stem
    addCollider(world, RAPIER.ColliderDesc.cuboid(0.2, 0.2).setTranslation(0.3, 1.9).setDensity(0.1), body); // Dot

    const group = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({ color: COLOR, side: THREE.DoubleSide });

    const dot = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.4), mat);
    dot.position.set(0.3, 2.0, 0); 

    const shape = new THREE.Shape();
    shape.moveTo(0.1, 1.6);
    shape.lineTo(0.5, 1.6);
    shape.lineTo(0.5, -0.3); 
    
    // Hook
    shape.quadraticCurveTo(0.5, -0.7, 0.1, -0.7); 
    shape.lineTo(-0.3, -0.7); 
    shape.quadraticCurveTo(-0.7, -0.7, -0.7, -0.3); 
    shape.lineTo(-0.3, -0.3); 
    shape.lineTo(0.1, -0.3); 
    
    shape.lineTo(0.1, 1.6);

    group.add(dot, new THREE.Mesh(new THREE.ShapeGeometry(shape), mat));
    scene.add(group);

    const muscles = [
        { x: 0.5, y: 2.2 }, { x: 0.1, y: 2.2 },
        { x: 0.5, y: -0.3 }, { x: -0.7, y: -0.3 }, 
        { x: -0.7, y: -0.7 }, { x: 0.1, y: -0.7 } 
    ];

    muscles.forEach(m => createMuscleTag(group, m.x, m.y));
    return { name: 'j', body, mesh: group, muscles};
}

export function createLetterK(scene, world, pos) {
    const body = createSolidBody(world, pos, 3.0);
    addCollider(world, RAPIER.ColliderDesc.cuboid(0.2, 1.05).setTranslation(-0.5, 0.35).setFriction(1.0), body);
    addCollider(world, RAPIER.ColliderDesc.cuboid(0.4, 0.2).setTranslation(-0.017, -0.283).setRotation(-Math.PI / 4).setFriction(1.0), body);
    addCollider(world, RAPIER.ColliderDesc.cuboid(0.4, 0.2).setTranslation(-0.017, 0.283).setRotation(Math.PI / 4).setFriction(1.0), body);
    const group = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({ color: COLOR });
    const stem = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 2.1), mat);
    stem.position.set(-0.5, 0.35, 0); 
    const createHalfDiagonal = (isTop) => {
        const geom = new THREE.PlaneGeometry(0.8, 0.4);
        geom.translate(0.4, 0, 0); 
        const mesh = new THREE.Mesh(geom, mat);
        mesh.position.set(-0.3, 0, 0); 
        mesh.rotation.z = isTop ? -Math.PI / 4 : Math.PI / 4;
        return mesh;
    };
    group.add(stem, createHalfDiagonal(true), createHalfDiagonal(false));
    scene.add(group);
    
    const muscles = [
        {x: -0.7, y: 1.4}, {x: -0.7, y: -0.7}, // Stem corners
        {x: 0.4, y: 0.8}, {x: 0.4, y: -0.8}    // Diagonal tips
    ];
    muscles.forEach(m => createMuscleTag(group, m.x, m.y));
    return { name: 'k', body, mesh: group, muscles};
}

export function createLetterL(scene, world, pos) {
    const body = createSolidBody(world, pos, 2.5, 0.1);
    addCollider(world, RAPIER.ColliderDesc.cuboid(0.2, 0.2).setTranslation(0, -0.8).setDensity(20.0).setFriction(1.5), body);
    addCollider(world, RAPIER.ColliderDesc.cuboid(0.2, 0.8).setTranslation(0, 0.2).setDensity(0.5), body);
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 2.0), new THREE.MeshStandardMaterial({ color: COLOR }));
    group.add(mesh);
    scene.add(group);

    const muscles = [
        { x: -0.2, y: 0.9 }, { x: 0.2, y: 0.9 }, // Top corners
        { x: -0.2, y: -0.9 }, { x: 0.2, y: -0.9 } // Bottom corners
    ];
    muscles.forEach(m => createMuscleTag(group, m.x, m.y));
    return { name: 'l', body, mesh: group, muscles};
}

export function createLetterM(scene, world, pos) {
    const body = createSolidBody(world, pos, 0.5, 0.1); 
    addCollider(world, RAPIER.ColliderDesc.ball(0.7).setTranslation(-0.5, 0.7).setFriction(0.5), body);
    addCollider(world, RAPIER.ColliderDesc.ball(0.7).setTranslation(0.5, 0.7).setFriction(0.5), body);
    addCollider(world, RAPIER.ColliderDesc.cuboid(0.2, 0.35).setTranslation(-1.0, 0.35).setFriction(0.1), body);
    addCollider(world, RAPIER.ColliderDesc.cuboid(0.2, 0.35).setTranslation(1.0, 0.35).setFriction(0.1), body);
    const group = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({ color: COLOR, side: THREE.DoubleSide });
    const createNShape = (offsetX) => {
        const shape = new THREE.Shape();
        shape.moveTo(-0.7 + offsetX, 0); shape.lineTo(0.7 + offsetX, 0); shape.lineTo(0.7 + offsetX, 0.7);
        shape.absarc(offsetX, 0.7, 0.7, 0, Math.PI, false); shape.lineTo(-0.7 + offsetX, 0);
        const hole = new THREE.Path();
        hole.moveTo(0.3 + offsetX, 0); hole.lineTo(-0.3 + offsetX, 0); hole.lineTo(-0.3 + offsetX, 0.7);
        hole.absarc(offsetX, 0.7, 0.3, Math.PI, 0, true); hole.lineTo(0.3 + offsetX, 0);
        shape.holes.push(hole); return shape;
    };
    group.add(new THREE.Mesh(new THREE.ShapeGeometry(createNShape(-0.5)), mat), new THREE.Mesh(new THREE.ShapeGeometry(createNShape(0.5)), mat));
    scene.add(group);

    const muscles = [
        {x: -1.2, y: 0}, {x: -0.8, y: 0}, {x: -0.2, y: 0}, {x: 0.2, y: 0}, {x: 0.8, y: 0}, {x: 1.2, y: 0}, // Feet base
        {x: -0.5, y: 1.4}, {x: 0.5, y: 1.4} // Arch tops
    ];
    muscles.forEach(m => createMuscleTag(group, m.x, m.y));
    return { name: 'm', body, mesh: group, muscles};
}

export function createLetterN(scene, world, pos) {
    const body = createSolidBody(world, pos, 2.5);
    addCollider(world, RAPIER.ColliderDesc.ball(0.7).setTranslation(0, 0.7).setFriction(0.8), body);
    addCollider(world, RAPIER.ColliderDesc.cuboid(0.2, 0.35).setTranslation(-0.5, 0.35), body);
    addCollider(world, RAPIER.ColliderDesc.cuboid(0.2, 0.35).setTranslation(0.5, 0.35), body);
    const group = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({ color: COLOR, side: THREE.DoubleSide });
    const shape = new THREE.Shape();
    shape.moveTo(-0.7, 0); shape.lineTo(0.7, 0); shape.lineTo(0.7, 0.7);
    shape.absarc(0, 0.7, 0.7, 0, Math.PI, false); shape.lineTo(-0.7, 0);
    const hole = new THREE.Path();
    hole.moveTo(0.3, 0); hole.lineTo(-0.3, 0); hole.lineTo(-0.3, 0.7);
    hole.absarc(0, 0.7, 0.3, Math.PI, 0, true); hole.lineTo(0.3, 0);
    shape.holes.push(hole);
    group.add(new THREE.Mesh(new THREE.ShapeGeometry(shape), mat));
    scene.add(group);

    const muscles = [
        {x: -0.7, y: 0}, {x: -0.3, y: 0}, {x: 0.3, y: 0}, {x: 0.7, y: 0}, // Base corners
        {x: 0, y: 1.4}, {x: -0.7, y: 0.7}, {x: 0.7, y: 0.7} // Top arch
    ];
    muscles.forEach(m => createMuscleTag(group, m.x, m.y));
    return { name: 'n', body, mesh: group, muscles};
}

export function createLetterO(scene, world, pos) {
    const body = createSolidBody(world, pos, 10.0); 
    addCollider(world, RAPIER.ColliderDesc.ball(0.7).setFriction(0.5), body);
    const group = new THREE.Group();
    const shape = new THREE.Shape();
    shape.absarc(0, 0, 0.7, 0, Math.PI * 2, false);
    const hole = new THREE.Path(); hole.absarc(0, 0, 0.3, 0, Math.PI * 2, true);
    shape.holes.push(hole);
    group.add(new THREE.Mesh(new THREE.ShapeGeometry(shape), new THREE.MeshStandardMaterial({ color: COLOR })));
    scene.add(group);

    const muscles = [
        {x: 0, y: 0.7}, {x: 0, y: -0.7}, {x: 0.7, y: 0}, {x: -0.7, y: 0}, // 4 Poles
        {x: 0.5, y: 0.5}, {x: -0.5, y: 0.5}, {x: 0.5, y: -0.5}, {x: -0.5, y: -0.5} // 4 Diagonals
    ];
    muscles.forEach(m => createMuscleTag(group, m.x, m.y));
    return { name: 'o', body, mesh: group, muscles};
}

export function createLetterP(scene, world, pos) {
    const body = createSolidBody(world, pos, 1.5);
    addCollider(world, RAPIER.ColliderDesc.ball(0.7).setFriction(0.7), body);
    addCollider(world, RAPIER.ColliderDesc.cuboid(0.2, 0.7).setTranslation(-0.5, 0), body);
    const group = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({ color: COLOR, side: THREE.DoubleSide });
    const shape = new THREE.Shape();
    shape.absarc(0, 0, 0.7, 0, Math.PI * 2, false);
    const hole = new THREE.Path(); hole.absarc(0, 0, 0.3, 0, Math.PI * 2, true);
    shape.holes.push(hole);
    const stem = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 2.1), mat);
    stem.position.set(-0.5, -0.35, 0); 
    group.add(new THREE.Mesh(new THREE.ShapeGeometry(shape), mat), stem);
    scene.add(group);

    const muscles = [
        {x: -0.7, y: -1.4}, {x: -0.3, y: -1.4}, // Descender base
        {x: -0.7, y: 0.7}, {x: 0, y: 0.7}, {x: 0.7, y: 0}, {x: 0, y: -0.7} // Belly round
    ];
    muscles.forEach(m => createMuscleTag(group, m.x, m.y));
    return { name: 'p', body, mesh: group, muscles};
}

export function createLetterQ(scene, world, pos) {
    const body = createSolidBody(world, pos, 1.5);
    addCollider(world, RAPIER.ColliderDesc.ball(0.7).setFriction(0.7), body);
    addCollider(world, RAPIER.ColliderDesc.cuboid(0.2, 0.7).setTranslation(0.5, 0), body);
    const group = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({ color: COLOR, side: THREE.DoubleSide });
    const shape = new THREE.Shape();
    shape.absarc(0, 0, 0.7, 0, Math.PI * 2, false);
    const hole = new THREE.Path(); hole.absarc(0, 0, 0.3, 0, Math.PI * 2, true);
    shape.holes.push(hole);
    const stem = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 2.1), mat);
    stem.position.set(0.5, -0.35, 0); 
    group.add(new THREE.Mesh(new THREE.ShapeGeometry(shape), mat), stem);
    scene.add(group);

    const muscles = [
        {x: 0.7, y: -1.4}, {x: 0.3, y: -1.4}, // Descender base
        {x: 0.7, y: 0.7}, {x: 0, y: 0.7}, {x: -0.7, y: 0}, {x: 0, y: -0.7} // Belly round
    ];
    muscles.forEach(m => createMuscleTag(group, m.x, m.y));
    return { name: 'q', body, mesh: group, muscles};
}

export function createLetterR(scene, world, pos) {
    const body = createSolidBody(world, pos, 1.5);
    addCollider(world, RAPIER.ColliderDesc.cuboid(0.2, 0.35).setTranslation(-0.5, 0.35).setFriction(1.0), body);
    addCollider(world, RAPIER.ColliderDesc.ball(0.7).setTranslation(0, 0.7).setFriction(0.8), body);
    const group = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({ color: COLOR, side: THREE.DoubleSide });
    const shape = new THREE.Shape();
    shape.moveTo(-0.7, 0); shape.lineTo(-0.7, 0.7);
    shape.absarc(0, 0.7, 0.7, Math.PI, Math.PI / 4, true); 
    const innerEndX = Math.cos(Math.PI / 4) * 0.3; const innerEndY = 0.7 + Math.sin(Math.PI / 4) * 0.3;
    shape.lineTo(innerEndX, innerEndY);
    shape.absarc(0, 0.7, 0.3, Math.PI / 4, Math.PI, false);
    shape.lineTo(-0.3, 0); shape.lineTo(-0.7, 0);
    group.add(new THREE.Mesh(new THREE.ShapeGeometry(shape), mat));
    scene.add(group);

    const muscles = [
        {x: -0.7, y: 0}, {x: -0.3, y: 0}, // Base feet
        {x: -0.7, y: 1.4}, {x: 0, y: 1.4}, {x: 0.7, y: 1.2} // Top shoulder
    ];
    muscles.forEach(m => createMuscleTag(group, m.x, m.y));
    return { name: 'r', body, mesh: group, muscles};
}

export function createLetterS(scene, world, pos) {
    const body = createSolidBody(world, pos, 2.5);
    addCollider(world, RAPIER.ColliderDesc.cuboid(0.7, 0.7).setFriction(1.1), body);
    const group = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({ color: COLOR });
    const top = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.4), mat);
    top.position.y = 0.5;
    const bot = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.4), mat);
    bot.position.y = -0.5;
    const diag = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 1.45), mat);
    diag.rotation.z = Math.PI / 3.5; 
    group.add(top, bot, diag);
    scene.add(group);

    const muscles = [
        {x: -0.7, y: 0.7}, {x: 0.7, y: 0.7}, {x: 0.7, y: 0.3}, // Top S corners
        {x: 0.7, y: -0.7}, {x: -0.7, y: -0.7}, {x: -0.7, y: -0.3} // Bot S corners
    ];
    muscles.forEach(m => createMuscleTag(group, m.x, m.y));
    return { name: 's', body, mesh: group, muscles};
}

export function createLetterT(scene, world, pos) {
    const body = createSolidBody(world, pos, 2.5);
    addCollider(world, RAPIER.ColliderDesc.cuboid(0.2, 0.4).setTranslation(0, -0.4).setDensity(6.0), body);
    addCollider(world, RAPIER.ColliderDesc.cuboid(0.2, 0.4).setTranslation(0, 0.6).setDensity(0.1), body);
    addCollider(world, RAPIER.ColliderDesc.cuboid(0.6, 0.2).setTranslation(0, 0.4).setDensity(0.1), body);
    const group = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({ color: COLOR });
    const stem = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 1.8), mat);
    stem.position.set(0, 0.1, 0); 
    const bar = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.4), mat);
    bar.position.set(0, 0.4, 0);
    group.add(stem, bar);
    scene.add(group);
    
    const muscles = [
        {x: -0.2, y: -0.8}, {x: 0.2, y: -0.8}, // Base
        {x: -0.6, y: 0.6}, {x: 0.6, y: 0.6}, {x: -0.6, y: 0.2}, {x: 0.6, y: 0.2} // Bar corners
    ];
    muscles.forEach(m => createMuscleTag(group, m.x, m.y));
    return { name: 't', body, mesh: group, muscles};
}

export function createLetterU(scene, world, pos) {
    const body = createSolidBody(world, pos, 10.0);
    addCollider(world, RAPIER.ColliderDesc.ball(0.7).setFriction(0.5), body);
    addCollider(world, RAPIER.ColliderDesc.cuboid(0.2, 0.35).setTranslation(-0.5, 0.35), body);
    addCollider(world, RAPIER.ColliderDesc.cuboid(0.2, 0.35).setTranslation(0.5, 0.35), body);
    const group = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({ color: COLOR, side: THREE.DoubleSide });
    const shape = new THREE.Shape();
    shape.moveTo(-0.7, 0.7); shape.lineTo(-0.7, 0);
    shape.absarc(0, 0, 0.7, Math.PI, 0, false); shape.lineTo(0.7, 0.7); shape.lineTo(-0.7, 0.7);
    const hole = new THREE.Path();
    hole.moveTo(-0.3, 0.7); hole.lineTo(0.3, 0.7); hole.lineTo(0.3, 0);
    hole.absarc(0, 0, 0.3, 0, Math.PI, true); hole.lineTo(-0.3, 0.7);
    shape.holes.push(hole);
    group.add(new THREE.Mesh(new THREE.ShapeGeometry(shape), mat));
    scene.add(group);

    const muscles = [
        {x: -0.7, y: 0.7}, {x: -0.3, y: 0.7}, {x: 0.3, y: 0.7}, {x: 0.7, y: 0.7}, // Top stems
        {x: -0.7, y: 0}, {x: 0.7, y: 0}, {x: 0, y: -0.7} // Bottom arch
    ];
    muscles.forEach(m => createMuscleTag(group, m.x, m.y));
    return { name: 'u', body, mesh: group, muscles};
}

export function createLetterV(scene, world, pos) {
    const body = createSolidBody(world, pos, 2.0);
    addCollider(world, RAPIER.ColliderDesc.cuboid(0.25, 0.1).setTranslation(0, -0.6).setFriction(1.2), body);
    addCollider(world, RAPIER.ColliderDesc.cuboid(0.2, 0.65).setTranslation(-0.35, -0.005).setRotation(0.45), body);
    addCollider(world, RAPIER.ColliderDesc.cuboid(0.2, 0.65).setTranslation(0.35, -0.005).setRotation(-0.45), body);
    const group = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({ color: COLOR });
    const plug = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.2), mat);
    plug.position.set(0, -0.6, 0); 
    const left = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 1.3), mat);
    left.rotation.z = 0.45; left.position.set(-0.35, -0.005, 0); 
    const right = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 1.3), mat);
    right.rotation.z = -0.45; right.position.set(0.35, -0.005, 0);
    group.add(plug, left, right);
    scene.add(group);
    
    const muscles = [
        {x: -0.25, y: -0.7}, {x: 0.25, y: -0.7}, // Pointy base
        {x: -0.7, y: 0.6}, {x: 0.7, y: 0.6}      // Top wing tips
    ];
    muscles.forEach(m => createMuscleTag(group, m.x, m.y));
    return { name: 'v', body, mesh: group, muscles};
}

export function createLetterW(scene, world, pos) {
    const body = createSolidBody(world, pos, 0.5);
    addCollider(world, RAPIER.ColliderDesc.ball(0.7).setTranslation(-0.5, 0).setFriction(0.8), body);
    addCollider(world, RAPIER.ColliderDesc.ball(0.7).setTranslation(0.5, 0).setFriction(0.8), body);
    addCollider(world, RAPIER.ColliderDesc.cuboid(0.2, 0.35).setTranslation(-1.0, 0.35), body);
    addCollider(world, RAPIER.ColliderDesc.cuboid(0.2, 0.35).setTranslation(0, 0.35), body);
    addCollider(world, RAPIER.ColliderDesc.cuboid(0.2, 0.35).setTranslation(1.0, 0.35), body);
    const group = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({ color: COLOR, side: THREE.DoubleSide });
    const createUShape = (offsetX) => {
        const shape = new THREE.Shape();
        shape.moveTo(-0.7 + offsetX, 0.7); shape.lineTo(-0.7 + offsetX, 0);
        shape.absarc(offsetX, 0, 0.7, Math.PI, 0, false); shape.lineTo(0.7 + offsetX, 0.7);
        shape.lineTo(-0.7 + offsetX, 0.7);
        const hole = new THREE.Path();
        hole.moveTo(-0.3 + offsetX, 0.7); hole.lineTo(0.3 + offsetX, 0.7); hole.lineTo(0.3 + offsetX, 0);
        hole.absarc(offsetX, 0, 0.3, 0, Math.PI, true); hole.lineTo(-0.3 + offsetX, 0.7);
        shape.holes.push(hole); return shape;
    };
    group.add(new THREE.Mesh(new THREE.ShapeGeometry(createUShape(-0.5)), mat), new THREE.Mesh(new THREE.ShapeGeometry(createUShape(0.5)), mat));
    scene.add(group);

    const muscles = [
        {x: -1.2, y: 0.7}, {x: -0.8, y: 0.7}, {x: -0.2, y: 0.7}, {x: 0.2, y: 0.7}, {x: 0.8, y: 0.7}, {x: 1.2, y: 0.7}, // Top stems
        {x: -0.5, y: -0.7}, {x: 0.5, y: -0.7} // Bottom arches
    ];
    muscles.forEach(m => createMuscleTag(group, m.x, m.y));
    return { name: 'w', body, mesh: group, muscles};
}

export function createLetterX(scene, world, pos) {
    const body = createSolidBody(world, pos, 2.0);
    addCollider(world, RAPIER.ColliderDesc.cuboid(0.7, 0.7).setFriction(1.0), body);
    const group = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({ color: COLOR });
    const line1 = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 1.4), mat);
    line1.rotation.z = Math.PI / 4;
    const line2 = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 1.4), mat);
    line2.rotation.z = -Math.PI / 4;
    group.add(line1, line2);
    scene.add(group);

    const muscles = [
        {x: -0.7, y: 0.7}, {x: 0.7, y: 0.7}, {x: -0.7, y: -0.7}, {x: 0.7, y: -0.7} // 4 Diag tips
    ];
    muscles.forEach(m => createMuscleTag(group, m.x, m.y));
    return { name: 'x', body, mesh: group, muscles};
}

export function createLetterY(scene, world, pos) {
    const body = createSolidBody(world, pos, 10.0);
    addCollider(world, RAPIER.ColliderDesc.ball(0.7).setFriction(0.5), body);
    addCollider(world, RAPIER.ColliderDesc.cuboid(0.2, 0.35).setTranslation(-0.5, 0.35), body);
    addCollider(world, RAPIER.ColliderDesc.cuboid(0.2, 0.35).setTranslation(0.5, 0.35), body);
    const group = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({ color: COLOR, side: THREE.DoubleSide });
    const shape = new THREE.Shape();
    shape.moveTo(-0.7, 0.7); shape.lineTo(-0.7, 0);
    shape.absarc(0, 0, 0.7, Math.PI, 0, false); shape.lineTo(0.7, 0.7); shape.lineTo(-0.7, 0.7);
    const hole = new THREE.Path();
    hole.moveTo(-0.3, 0.7); hole.lineTo(0.3, 0.7); hole.lineTo(0.3, 0);
    hole.absarc(0, 0, 0.3, 0, Math.PI, true); hole.lineTo(-0.3, 0.7);
    shape.holes.push(hole);
    const stem = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 2.1), mat);
    stem.position.set(0.5, -0.35, 0); 
    group.add(new THREE.Mesh(new THREE.ShapeGeometry(shape), mat), stem);
    scene.add(group);

    const muscles = [
        {x: -0.7, y: 0.7}, {x: 0.7, y: 0.7}, // Top stems
        {x: 0.7, y: -1.4}, {x: 0.3, y: -1.4}, // Descender base
        {x: -0.7, y: 0}, {x: 0, y: -0.7} // Belly curves
    ];
    muscles.forEach(m => createMuscleTag(group, m.x, m.y));
    return { name: 'y', body, mesh: group, muscles};
}

export function createLetterZ(scene, world, pos) {
    const body = createSolidBody(world, pos, 2.5);
    addCollider(world, RAPIER.ColliderDesc.cuboid(0.7, 0.7).setFriction(1.1), body);
    const group = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({ color: COLOR });
    const top = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.4), mat);
    top.position.y = 0.5;
    const bot = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.4), mat);
    bot.position.y = -0.5;
    const diag = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 1.45), mat);
    diag.rotation.z = -Math.PI / 3.5; 
    group.add(top, bot, diag);
    scene.add(group);
    
    const muscles = [
        {x: -0.7, y: 0.7}, {x: 0.7, y: 0.7}, {x: 0.7, y: 0.3}, // Top corners
        {x: 0.7, y: -0.7}, {x: -0.7, y: -0.7}, {x: -0.7, y: -0.3} // Bot corners
    ];
    muscles.forEach(m => createMuscleTag(group, m.x, m.y));
    return { name: 'z', body, mesh: group, muscles};
}