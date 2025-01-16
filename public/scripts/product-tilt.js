document.addEventListener("DOMContentLoaded", function() {
  console.log("DOM fully loaded and parsed");

  // Select the parent container of all products
  const productList = document.querySelector('.product-listings');

  if (!productList) {
    console.error("No product listings found");
    return;
  }

  // Throttle function to limit the frequency of event execution
  function throttle(callback, delay) {
    let lastCall = 0;
    return function(...args) {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        callback(...args);
      }
    };
  }

  // Throttle mousemove and touchmove events
  const handleMouseMove = throttle((e) => {
    const product = e.target.closest('.product');
    if (!product) return;

    const rect = product.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;

    product.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
  }, 16); // Approx. 60fps (16ms interval)

  const handleTouchMove = throttle((e) => {
    const product = e.target.closest('.product');
    if (!product) return;

    const touch = e.touches[0];
    const rect = product.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;

    product.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
  }, 16); // Approx. 60fps (16ms interval)

  productList.addEventListener('mousemove', handleMouseMove);
  productList.addEventListener('mouseleave', (e) => {
    const product = e.target.closest('.product');
    if (!product) return;

    product.style.transform = 'perspective(1000px) scale(1)';
  });

  productList.addEventListener('touchmove', handleTouchMove);
  productList.addEventListener('touchend', (e) => {
    const product = e.target.closest('.product');
    if (!product) return;

    product.style.transform = 'perspective(1000px) scale(1)';
  });
});
