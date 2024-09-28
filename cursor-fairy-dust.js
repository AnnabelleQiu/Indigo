document.addEventListener('mousemove', function(e) {
    for (let i = 0; i < 5; i++) { // 创建15个粒子
        let particle = document.createElement('div');
        particle.className = 'particle';

        // 随机颜色（白色或紫色）
        let colors = ['#ffffff', '#9363c3'];
        let color = colors[Math.floor(Math.random() * colors.length)];
        particle.style.backgroundColor = color;

        document.body.appendChild(particle);

        // 随机偏移粒子的位置
        let offsetX = (Math.random() - 0.5) * 20;
        let offsetY = (Math.random() - 0.5) * 20;

        // 初始位置
        particle.style.left = `${e.pageX + offsetX}px`;
        particle.style.top = `${e.pageY + offsetY}px`;

        // 动画效果
        setTimeout(() => {
            particle.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
        }, 0);

        // 确保每个粒子在1秒后移除
        setTimeout(() => {
            particle.remove();
        }, 1000); // 1秒后移除
    }
});
