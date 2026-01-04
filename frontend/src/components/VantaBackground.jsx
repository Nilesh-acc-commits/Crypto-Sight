import React, { useState, useEffect, useRef } from 'react';
import FOG from 'vanta/dist/vanta.fog.min';
import * as THREE from 'three';

const VantaBackground = () => {
    const [vantaEffect, setVantaEffect] = useState(null);
    const myRef = useRef(null);

    useEffect(() => {
        if (!vantaEffect) {
            setVantaEffect(FOG({
                el: myRef.current,
                THREE: THREE,
                mouseControls: true,
                touchControls: true,
                gyroControls: false,
                minHeight: 200.00,
                minWidth: 200.00,
                highlightColor: 0x00e5ff, // Cyan
                midtoneColor: 0x7c3aed,   // Purple
                lowlightColor: 0x2a3b55,  // Accents
                baseColor: 0x0b0f19,      // Deep Navy Background
                blurFactor: 0.6,
                speed: 1.5,
                zoom: 1.0
            }));
        }
        return () => {
            if (vantaEffect) vantaEffect.destroy();
        };
    }, []); // Empty dependency array for single initialization

    return (
        <div
            ref={myRef}
            className="fixed top-0 left-0 w-full h-full -z-50 pointer-events-none"
            style={{ position: 'fixed', zIndex: -50 }}
        />
    );
};

export default VantaBackground;
