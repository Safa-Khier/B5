import React, { useEffect, useRef } from "react";

const AnimatedBackground = () => {
  const canvasRef = useRef(null);
  const mousePositionRef = useRef({ x: null, y: null });

  useEffect(() => {
    const updateCanvasSize = () => {
      const canvas = canvasRef.current;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", updateCanvasSize);
    return () => window.removeEventListener("resize", updateCanvasSize);
  }, [window.innerWidth, window.innerHeight]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const updateMousePosition = (ev) => {
      mousePositionRef.current = {
        x: ev.clientX,
        y: ev.clientY,
      };
    };
    window.addEventListener("mousemove", updateMousePosition);

    let animationFrameId;

    const circles = [];
    for (let i = 0; i < 50; i++) {
      circles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height + 50,
        radius: Math.random() * 20 + 5,
        dx: (Math.random() - 0.5) * 2,
        dy: (Math.random() - 0.5) * 2,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      circles.forEach((circle) => {
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
        ctx.fill();
        //check if dark mode is enabled
        if (localStorage.getItem("theme") === "dark") {
          ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
        } else {
          ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
        }

        const mousePos = mousePositionRef.current;
        if (mousePos.x != null && mousePos.y != null) {
          const dx = circle.x - mousePos.x;
          const dy = circle.y - mousePos.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          // When the circle is within a certain distance of the cursor, increase dx and dy
          if (distance < 100) {
            // Threshold of influence
            const speedIncreaseFactor = 0.07; // Adjust this value to make movement faster
            circle.dx += (dx / distance) * speedIncreaseFactor;
            circle.dy += (dy / distance) * speedIncreaseFactor;
          }
        }

        circle.x += circle.dx;
        circle.y += circle.dy;

        // Boundary checks and make the circles bounce
        if (
          circle.x < circle.radius ||
          circle.x > canvas.width - circle.radius
        ) {
          circle.dx = -circle.dx;
        }
        if (
          circle.y < circle.radius ||
          circle.y > canvas.height - circle.radius
        ) {
          circle.dy = -circle.dy;
        }

        // Apply a slight friction to slow down over time
        circle.dx *= 0.9999;
        circle.dy *= 0.9999;
      });
    };

    const animate = () => {
      draw();
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", updateMousePosition);
    };
  }, []);

  return <canvas className="canvas-background w-full h-full" ref={canvasRef} />;
};
export default AnimatedBackground;
