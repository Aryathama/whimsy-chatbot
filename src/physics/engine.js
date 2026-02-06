import * as RAPIER from '@dimforge/rapier2d';

export async function initPhysics() {
    try {
        await RAPIER.init();
    } catch (e) {
        console.warn("Standard RAPIER.init failed, trying to continue...");
    }

    const gravity = { x: 0.0, y: -10 }; 
    const world = new RAPIER.World(gravity);

    // Config
    world.integrationParameters.erp = 0.8; 
    world.integrationParameters.maxStabilizationVelocity = 1.0; 
    world.integrationParameters.numSolverIterations = 4; 

    // Floor: 100
    const groundBodyDesc = RAPIER.RigidBodyDesc.fixed().setTranslation(0, -0.1);
    const groundBody = world.createRigidBody(groundBodyDesc);
    world.createCollider(RAPIER.ColliderDesc.cuboid(50, 0.1), groundBody);

    return world;
}