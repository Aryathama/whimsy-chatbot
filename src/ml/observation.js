// export function getObservation(agent) {
//     const body = agent.body;
//     const pos = body.translation();
//     const rot = body.rotation();

//     // JARAK RELATIF yang sangat kuat (Amplify 10x)
//     const targetX = agent.targetX || 0;
//     const relativeDist = (targetX - pos.x);

//     return [
//         Math.cos(rot),             
//         Math.sin(rot),             
//         body.linvel().x * 0.1,     
//         body.angvel() * 0.1,       
//         relativeDist * 10.0,        // PERKUAT SINYAL DISINI
//         Math.sign(relativeDist)     // TAMBAHKAN ARAH MURNI (-1, 0, atau 1)
//     ];
// }

export function getObservation(agent) {
    const pos = agent.body.translation();
    const targetX = agent.targetX || 0;
    
    const relativeDist = (targetX - pos.x) / 10.0; 

    return [
        Math.cos(agent.body.rotation()),
        Math.sin(agent.body.rotation()),
        agent.body.linvel().x * 0.1,
        relativeDist
    ];
}