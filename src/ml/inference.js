import { Brain } from './brain.js';

export class InferenceManager {
    constructor(weightsData = null) {
        this.weightsData = weightsData;
    }

    update(agents, world) {
        if (!this.weightsData) return;

        agents.forEach(agent => {
            if (!agent.brain) {
                agent.brain = new Brain(this.weightsData);
            }

            const body = agent.body;
            const pos = body.translation();
            
            // Y check
            const isGrounded = pos.y < 1.0; 

            if (!isGrounded) {
                body.setLinearDamping(0.1);
                body.setAngularDamping(0.1);
                return;
            }

            const vel = body.linvel();
            const rot = body.rotation();
            const angVel = body.angvel();

            const posError = agent.targetX - pos.x;
            const rotError = 0 - rot;

            const obs = [
            posError / 5.0,
            vel.x * 0.2,
            rotError / Math.PI,
            angVel * 0.2
            ];

            const action = agent.brain.predict(obs);
            const forceX = Math.sign(posError) * Math.abs(action[0]) * 8.0;
            const torque = Math.sign(rotError) * Math.abs(action[1]) * 2.0;

            agent.body.applyImpulse({ x: forceX, y: 0 }, true);
            agent.body.applyTorqueImpulse(torque, true);
        });
    }
}